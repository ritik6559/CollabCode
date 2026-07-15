"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { oneDark } from "@codemirror/theme-one-dark";
import { keymap } from "@codemirror/view";
import { yCollab, yUndoManagerKeymap } from "y-codemirror.next";
import * as Y from "yjs";
import {
    AlertCircle,
    Copy,
    Download,
    FileCode2,
    Loader2,
    LogOut,
    Play,
} from "lucide-react";
import { toast } from "sonner";
import { ACTIONS } from "@/lib/utils";
import { useCodeExecution } from "@/hooks/use-code-execution";
import { EXTENSION_BY_LANGUAGE, LANGUAGES } from "@/data";
import { downloadFile, safeFileName } from "@/lib/download";
import { base64ToUint8, pickCollabColor, uint8ToBase64 } from "@/lib/collab";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import ExecutionStatus from "@/features/editor/components/execution-status";
import ProgramOutput from "@/features/editor/components/program-output";
import ErrorOutput from "@/features/editor/components/error-output";
import CompilationOutput from "@/features/editor/components/compilation-output";
import GettingStarted from "@/features/editor/components/getting-started";
import OutputPanel from "@/features/editor/components/output-panel";
import CollabPresence from "@/components/collab-presence";
import { useGetCurrentUser } from "@/features/auth/api/use-get-current-user";
import { useGetRoomById } from "@/features/dashboard/api/use-get-room-by-id";
import { useJoinRoom } from "@/features/dashboard/api/use-join-room";
import useSaveCode from "@/features/dashboard/hooks/use-save-code";
import { useSocket } from "@/context/SocketProvider";
import { useCollabSession } from "@/hooks/use-collab-session";

const EditorPage = () => {
    const params = useParams();
    const roomId = params.roomId as string;
    const searchParams = useSearchParams();
    const router = useRouter();
    const currUsername = searchParams.get("username") || "Anonymous";

    const socket = useSocket();
    const hydratedDocRef = useRef<Y.Doc | null>(null);

    const [stdin, setStdin] = useState('');
    const [languageId, setLanguageId] = useState(28);
    const [isSocketReady, setIsSocketReady] = useState(false);

    const { submitAndPoll, result, error, loading } = useCodeExecution();

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

    const ytext = useMemo(() => session?.doc.getText("content"), [session]);

    const undoManager = useMemo(
        () => (ytext ? new Y.UndoManager(ytext) : null),
        [ytext]
    );

    const extensions = useMemo(() => {
        if (!session || !ytext || !undoManager) return [];
        return [
            keymap.of(yUndoManagerKeymap),
            javascript({ jsx: true }),
            yCollab(ytext, session.awareness, { undoManager }),
        ];
    }, [session, ytext, undoManager]);

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

    // Doc rooms belong in the rich-text editor
    useEffect(() => {
        if (room && room.type === "doc") {
            router.replace(`/doc/${roomId}?username=${encodeURIComponent(currUsername)}`);
        }
    }, [room, roomId, currUsername, router]);

    // Hydrate the Yjs doc once per session from the persisted room
    useEffect(() => {
        if (!room || !session || !ytext || hydratedDocRef.current === session.doc) {
            return;
        }
        hydratedDocRef.current = session.doc;

        setLanguageId(room.language ?? 28);

        if (room.yjsState) {
            // Every client applies the same serialized state -> identical docs
            Y.applyUpdate(session.doc, base64ToUint8(room.yjsState), "remote");
        } else if (room.code) {
            // Legacy room saved before CRDT sync existed — seed once
            ytext.insert(0, room.code);
        }
    }, [room, session, ytext]);

    // Persist local edits: derived text for previews + the CRDT state
    useEffect(() => {
        if (!session || !ytext) {
            return;
        }
        const { doc } = session;

        const handleUpdate = (_update: Uint8Array, origin: unknown) => {
            if (origin !== "remote") {
                debouncedSave(ytext.toString(), uint8ToBase64(Y.encodeStateAsUpdate(doc)));
            }
        };

        doc.on("update", handleUpdate);
        return () => {
            doc.off("update", handleUpdate);
        };
    }, [session, ytext, debouncedSave]);

    // Socket lifecycle: join the room, surface errors, clean up symmetrically
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
                toast.success(`${username} joined the room`);
            }
        };

        const handleUserLeft = ({ username }: { id: string; username?: string }) => {
            if (username) {
                toast.info(`${username} left the room`);
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

    const handleRun = async () => {
        await submitAndPoll({
            source_code: ytext?.toString() ?? "",
            language_id: languageId,
            stdin,
        });
    };

    const handleCopyRoomId = async () => {
        await navigator.clipboard.writeText(roomId);
        toast.success("Room ID copied!");
    };

    const handleDownload = () => {
        const extension = EXTENSION_BY_LANGUAGE[languageId] ?? "txt";
        downloadFile(
            `${safeFileName(room?.name ?? "code")}.${extension}`,
            ytext?.toString() ?? "",
            "text/plain;charset=utf-8"
        );
        toast.success("Code downloaded");
    };

    if (userLoading || roomLoading || !user || !room || !isSocketReady || !session) {
        return (
            <div className="lp-root flex min-h-screen items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="h-8 w-8 animate-spin text-amber-400" />
                    <p className="text-sm text-stone-400">
                        {userLoading ? "Loading your account…" :
                         roomLoading ? "Loading room…" :
                         "Connecting to room…"}
                    </p>
                </div>
            </div>
        );
    }

    const languageName = LANGUAGES[languageId as keyof typeof LANGUAGES] ?? "Unknown";

    return (
        <div className="lp-root min-h-screen">
            {/* Header — identity, presence, file actions */}
            <header className="sticky top-0 z-40 border-b border-stone-100/10 bg-stone-950/80 backdrop-blur-xl">
                <div className="mx-auto flex h-16 max-w-7xl items-center gap-3 px-4">
                    <Link
                        href="/home"
                        aria-label="Back to your rooms"
                        className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 shadow-lg shadow-orange-500/25 transition-transform hover:scale-105"
                    >
                        <FileCode2 className="h-5 w-5 text-stone-950" />
                    </Link>

                    <div className="min-w-0 flex-1">
                        <h1 className="truncate font-semibold text-stone-50">{room.name}</h1>
                        <span className="text-xs text-stone-400">
                            {isSaving ? "Saving…" : "Saved"}
                        </span>
                    </div>

                    <CollabPresence awareness={session.awareness} />

                    <Button
                        variant="outline"
                        onClick={handleDownload}
                        className="border-stone-100/15 bg-stone-100/5 text-stone-200 hover:bg-stone-100/10 hover:text-white"
                    >
                        <Download className="h-4 w-4" />
                        <span className="hidden sm:inline">Download</span>
                    </Button>

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

            {/* Action bar — what will run, and the button that runs it */}
            <div className="sticky top-16 z-30 border-b border-stone-100/10 bg-stone-950/80 backdrop-blur-xl">
                <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-2">
                    <span className="rounded-full border border-stone-100/10 bg-stone-100/5 px-2.5 py-1 font-mono text-xs text-stone-300">
                        {languageName}
                    </span>

                    <Button
                        onClick={handleRun}
                        disabled={loading}
                        className="bg-gradient-to-r from-amber-400 to-orange-500 font-semibold text-stone-950 shadow-lg shadow-orange-500/25 hover:from-amber-300 hover:to-orange-400"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="h-4 w-4 animate-spin" />
                                Running…
                            </>
                        ) : (
                            <>
                                <Play className="h-4 w-4" />
                                Run
                            </>
                        )}
                    </Button>
                </div>
            </div>

            <main className="mx-auto grid max-w-7xl gap-5 px-4 py-6 lg:grid-cols-3">
                <div className="space-y-5 lg:col-span-2">
                    <div className="code-pane overflow-hidden rounded-2xl border border-stone-100/10 bg-stone-900/40">
                        <CodeMirror
                            height="clamp(320px, calc(100vh - 24rem), 760px)"
                            theme={oneDark}
                            extensions={extensions}
                            aria-label="Collaborative code editor"
                            basicSetup={{
                                lineNumbers: true,
                                foldGutter: true,
                                dropCursor: true,
                                allowMultipleSelections: true,
                                indentOnInput: true,
                                bracketMatching: true,
                                closeBrackets: true,
                                autocompletion: true,
                                highlightSelectionMatches: true,
                                history: false,
                            }}
                            className="text-[13px]"
                        />
                    </div>

                    <div className="rounded-2xl border border-stone-100/10 bg-stone-900/40 p-4">
                        <label
                            htmlFor="stdin"
                            className="mb-2 block text-sm font-semibold text-stone-100"
                        >
                            Program input{" "}
                            <span className="font-normal text-stone-400">(stdin)</span>
                        </label>
                        <Textarea
                            id="stdin"
                            value={stdin}
                            onChange={(e) => setStdin(e.target.value)}
                            className="resize-none border-stone-100/10 bg-stone-900/60 font-mono text-[13px] text-stone-100 placeholder:text-stone-400 focus-visible:border-amber-400/50 focus-visible:ring-amber-400/20"
                            rows={4}
                            placeholder="Anything your program reads from input goes here"
                        />
                    </div>
                </div>

                <aside className="space-y-4">
                    {error && (
                        <OutputPanel title="Couldn't run your code" icon={AlertCircle} tone="danger">
                            <p className="text-[13px] leading-relaxed text-rose-200">{error}</p>
                        </OutputPanel>
                    )}

                    {result && (
                        <>
                            <ExecutionStatus result={result} />
                            {result.stdout && <ProgramOutput result={result} />}
                            {result.stderr && <ErrorOutput result={result} />}
                            {result.compile_output && <CompilationOutput result={result} />}
                        </>
                    )}

                    {!result && !error && !loading && <GettingStarted />}
                </aside>
            </main>
        </div>
    );
};

export default EditorPage;
