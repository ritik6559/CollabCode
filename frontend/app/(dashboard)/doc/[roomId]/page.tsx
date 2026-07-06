"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { TextStyle, FontSize, FontFamily } from "@tiptap/extension-text-style";
import TextAlign from "@tiptap/extension-text-align";
import Collaboration, { isChangeOrigin } from "@tiptap/extension-collaboration";
import CollaborationCaret from "@tiptap/extension-collaboration-caret";
import * as Y from "yjs";
import {
    Copy,
    Download,
    FileText,
    Loader,
    LogOut,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ACTIONS } from "@/lib/utils";
import { downloadFile, safeFileName } from "@/lib/download";
import { base64ToUint8, pickCollabColor, uint8ToBase64 } from "@/lib/collab";
import { useGetCurrentUser } from "@/features/auth/api/use-get-current-user";
import { useGetRoomById } from "@/features/dashboard/api/use-get-room-by-id";
import { useJoinRoom } from "@/features/dashboard/api/use-join-room";
import useSaveCode from "@/features/dashboard/hooks/use-save-code";
import { useSocket } from "@/context/SocketProvider";
import { useCollabSession } from "@/hooks/use-collab-session";
import CollabPresence from "@/components/collab-presence";
import DocToolbar from "@/features/doc/components/doc-toolbar";

const DocPage = () => {
    const params = useParams();
    const roomId = params.roomId as string;
    const searchParams = useSearchParams();
    const router = useRouter();
    const currUsername = searchParams.get("username") || "Anonymous";

    const socket = useSocket();
    const hydratedDocRef = useRef<Y.Doc | null>(null);

    const [isSocketReady, setIsSocketReady] = useState(false);

    const { data: user, isLoading: userLoading, error: userError } = useGetCurrentUser();
    const { data: room, isLoading: roomLoading, error: roomError } = useGetRoomById(roomId);
    const { mutateAsync: joinRoom } = useJoinRoom();
    const { debouncedSave, isSaving } = useSaveCode(roomId);

    // CRDT session: Yjs doc + awareness relayed over the socket
    const collabUser = useMemo(
        () => (user ? { name: currUsername, color: pickCollabColor(user._id) } : null),
        [user, currUsername]
    );
    const session = useCollabSession(socket, roomId, collabUser);

    const editor = useEditor(
        {
            extensions: session
                ? [
                      StarterKit.configure({ undoRedo: false }),
                      TextStyle,
                      FontSize,
                      FontFamily,
                      TextAlign.configure({ types: ["heading", "paragraph"] }),
                      Collaboration.configure({ document: session.doc }),
                      CollaborationCaret.configure({
                          provider: { awareness: session.awareness },
                          user: collabUser ?? { name: currUsername, color: "#fbbf24" },
                      }),
                  ]
                : [StarterKit],
            immediatelyRender: false,
            onUpdate: ({ editor, transaction }) => {
                // Only persist our own edits — remote changes are already
                // saved by their author
                if (session && !isChangeOrigin(transaction)) {
                    debouncedSave(
                        editor.getHTML(),
                        uint8ToBase64(Y.encodeStateAsUpdate(session.doc))
                    );
                }
            },
            editorProps: {
                attributes: {
                    class: "doc-editor focus:outline-none",
                },
            },
        },
        [session]
    );

    useEffect(() => {
        if (userError) {
            toast.error("Failed to load user data");
            router.push("/home");
        }
        if (roomError) {
            toast.error("Failed to load room data");
            router.push("/home");
        }
    }, [userError, roomError, router]);

    // Code rooms belong in the code editor
    useEffect(() => {
        if (room && room.type !== "doc") {
            router.replace(`/editor/${roomId}?username=${encodeURIComponent(currUsername)}`);
        }
    }, [room, roomId, currUsername, router]);

    // Hydrate the Yjs doc once per session from the persisted room
    useEffect(() => {
        if (!room || !session || !editor || hydratedDocRef.current === session.doc) {
            return;
        }
        hydratedDocRef.current = session.doc;

        if (room.yjsState) {
            // Every client applies the same serialized state -> identical docs
            Y.applyUpdate(session.doc, base64ToUint8(room.yjsState), "remote");
        } else if (room.code) {
            // Legacy room saved before CRDT sync existed — seed once
            editor.commands.setContent(room.code);
        }
    }, [room, session, editor]);

    // Socket lifecycle — mirrors the code editor page
    const userEmail = user?.email;
    const isRoomLoaded = !!room;

    useEffect(() => {
        if (!userEmail || !isRoomLoaded) {
            return;
        }

        const handleConnectError = (e: Error) => {
            console.error(e);
            toast.error("Error connecting to room");
            router.push("/home");
        };

        const handleUserJoined = ({ username }: { username: string }) => {
            if (username !== currUsername) {
                toast.success(`${username} joined the doc`);
            }
        };

        const handleUserLeft = ({ username }: { id: string; username?: string }) => {
            if (username) {
                toast.info(`${username} left the doc`);
            }
        };

        const handleRoomError = ({ message }: { message: string }) => {
            toast.error(message || "Room connection error");
            router.push("/home");
        };

        const joinTimeout = setTimeout(() => {
            console.warn("Room join timeout - proceeding anyway");
            setIsSocketReady(true);
        }, 3000);

        const join = async () => {
            try {
                await joinRoom(roomId);
                clearTimeout(joinTimeout);
                setIsSocketReady(true);
            } catch (error) {
                console.error('Error joining room:', error);
                toast.error("Failed to join room");
                router.push("/home");
            }
        };

        socket.on("connect_error", handleConnectError);
        socket.on(ACTIONS.USER_JOINED, handleUserJoined);
        socket.on(ACTIONS.USER_LEFT, handleUserLeft);
        socket.on(ACTIONS.ROOM_ERROR, handleRoomError);
        socket.on("connect", join);

        socket.emit(ACTIONS.ROOM_JOIN, {
            email: userEmail,
            room: roomId,
            username: currUsername,
        });

        if (socket.connected) {
            join();
        } else {
            socket.connect();
        }

        return () => {
            clearTimeout(joinTimeout);
            socket.off("connect_error", handleConnectError);
            socket.off(ACTIONS.USER_JOINED, handleUserJoined);
            socket.off(ACTIONS.USER_LEFT, handleUserLeft);
            socket.off(ACTIONS.ROOM_ERROR, handleRoomError);
            socket.off("connect", join);
            socket.disconnect();
        };
    }, [socket, userEmail, isRoomLoaded, roomId, currUsername, router, joinRoom]);

    const handleCopyRoomId = async () => {
        await navigator.clipboard.writeText(roomId);
        toast.success("Room ID copied!");
    };

    const docName = safeFileName(room?.name ?? "document");

    const handleDownload = (format: "html" | "txt" | "doc") => {
        if (!editor) return;

        if (format === "txt") {
            downloadFile(`${docName}.txt`, editor.getText(), "text/plain;charset=utf-8");
        } else {
            const body = editor.getHTML();
            const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>${docName}</title></head><body>${body}</body></html>`;

            if (format === "html") {
                downloadFile(`${docName}.html`, html, "text/html;charset=utf-8");
            } else {
                // Word opens HTML saved with a .doc extension
                downloadFile(`${docName}.doc`, html, "application/msword");
            }
        }

        toast.success("Document downloaded");
    };

    if (userLoading || roomLoading || !user || !room || !isSocketReady || !editor || !session) {
        return (
            <div className="lp-root flex min-h-screen items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <Loader className="h-8 w-8 animate-spin text-amber-400" />
                    <p className="text-sm text-stone-400">
                        {userLoading ? "Loading user data..." :
                         roomLoading ? "Loading document..." :
                         "Connecting to document..."}
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="lp-root min-h-screen">
            {/* Header */}
            <header className="sticky top-0 z-40 border-b border-stone-100/10 bg-stone-950/80 backdrop-blur-xl">
                <div className="mx-auto flex h-16 max-w-6xl items-center gap-3 px-4">
                    <Link
                        href="/home"
                        className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-lime-400 to-emerald-500 shadow-lg shadow-emerald-500/25"
                    >
                        <FileText className="h-5 w-5 text-stone-950" />
                    </Link>

                    <div className="min-w-0 flex-1">
                        <h1 className="truncate font-semibold text-stone-50">{room.name}</h1>
                        <span className="text-xs text-stone-500">
                            {isSaving ? "Saving…" : "Saved"}
                        </span>
                    </div>

                    <CollabPresence awareness={session.awareness} />

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="outline"
                                className="border-stone-100/15 bg-stone-100/5 text-stone-200 hover:bg-stone-100/10 hover:text-white"
                            >
                                <Download className="mr-1 h-4 w-4" />
                                Download
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                            align="end"
                            className="border-stone-100/10 bg-stone-900/95 backdrop-blur-xl"
                        >
                            <DropdownMenuItem
                                onClick={() => handleDownload("doc")}
                                className="cursor-pointer text-stone-200 focus:bg-stone-800/80 focus:text-stone-50"
                            >
                                Word document (.doc)
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={() => handleDownload("html")}
                                className="cursor-pointer text-stone-200 focus:bg-stone-800/80 focus:text-stone-50"
                            >
                                Web page (.html)
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={() => handleDownload("txt")}
                                className="cursor-pointer text-stone-200 focus:bg-stone-800/80 focus:text-stone-50"
                            >
                                Plain text (.txt)
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>

                    <Button
                        variant="outline"
                        onClick={handleCopyRoomId}
                        className="border-stone-100/15 bg-stone-100/5 text-stone-200 hover:bg-stone-100/10 hover:text-white"
                    >
                        <Copy className="h-4 w-4" />
                        <span className="hidden sm:inline">Copy ID</span>
                    </Button>

                    <Button
                        variant="destructive"
                        onClick={() => router.push("/home")}
                        className="bg-rose-600/90 text-white hover:bg-rose-500"
                    >
                        <LogOut className="h-4 w-4" />
                        <span className="hidden sm:inline">Leave</span>
                    </Button>
                </div>
            </header>

            <DocToolbar editor={editor} />

            {/* Page canvas */}
            <main className="mx-auto max-w-4xl px-4 py-8">
                <div
                    className="doc-page mx-auto min-h-[75vh] w-full max-w-3xl cursor-text rounded-lg shadow-2xl"
                    onClick={() => editor.chain().focus().run()}
                >
                    <EditorContent editor={editor} />
                </div>
            </main>
        </div>
    );
};

export default DocPage;
