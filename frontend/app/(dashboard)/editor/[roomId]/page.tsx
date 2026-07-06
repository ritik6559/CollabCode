"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import EditorSidebar from "@/features/editor/components/editor-sidebar";
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { oneDark } from "@codemirror/theme-one-dark";
import { keymap } from "@codemirror/view";
import { yCollab, yUndoManagerKeymap } from "y-codemirror.next";
import * as Y from "yjs";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { Download, Loader, PanelLeftIcon, Play } from "lucide-react";
import { ACTIONS } from "@/lib/utils";
import { toast } from "sonner";
import { useCodeExecution } from "@/hooks/use-code-execution";
import { EXTENSION_BY_LANGUAGE, LANGUAGES } from "@/data";
import { downloadFile, safeFileName } from "@/lib/download";
import { base64ToUint8, pickCollabColor, uint8ToBase64 } from "@/lib/collab";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import ExecutionStatus from "@/features/editor/components/execution-status";
import ProgramOutput from "@/features/editor/components/program-output";
import ErrorOutput from "@/features/editor/components/error-output";
import CompilationOutput from "@/features/editor/components/compilation-output";
import GettingStarted from "@/features/editor/components/getting-started";
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
            socket.off(ACTIONS.ROOM_ERROR, handleRoomError);
            socket.off("connect", join);
            socket.disconnect();
        };
    }, [socket, userEmail, isRoomLoaded, roomId, currUsername, router, joinRoom]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        await submitAndPoll({
            source_code: ytext?.toString() ?? "",
            language_id: languageId,
            stdin,
        });
    };

    const handleLeaveRoom = () => {
        router.push("/home");
    };

    const handleCopyRoomId = async () => {
        if (roomId) {
            await navigator.clipboard.writeText(roomId);
            toast.success("Room ID copied!");
        }
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
            <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 to-black">
                <div className="flex flex-col items-center gap-4">
                    <Loader className="animate-spin w-8 h-8 text-white" />
                    <p className="text-gray-400 text-sm">
                        {userLoading ? "Loading user data..." :
                         roomLoading ? "Loading room data..." :
                         !isSocketReady ? "Connecting to room..." :
                         "Initializing editor..."}
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div>
            <SidebarProvider>
                <div className="flex w-full">
                    <EditorSidebar
                        room={room}
                        onLeaveRoom={handleLeaveRoom}
                        onCopyRoomId={handleCopyRoomId}
                    />
                    <main className="flex-1 flex flex-col">
                        <header className="bg-black/40 border-b border-gray-700/50 p-4 flex items-center gap-4">
                            <SidebarTrigger className="text-white hover:bg-gray-700/50 p-2 rounded-md transition-colors">
                                <PanelLeftIcon color="white" size={24} />
                            </SidebarTrigger>
                            <div className="flex flex-1 justify-between items-center">
                                <CollabPresence awareness={session.awareness} />
                                <div className="flex items-center gap-2">
                                    <Button
                                        onClick={handleDownload}
                                        variant="outline"
                                        className="border-gray-600/50 bg-gray-800/50 text-gray-200 hover:bg-gray-700/50 hover:text-white flex items-center gap-2 cursor-pointer"
                                    >
                                        <Download className="w-4 h-4" />
                                        Download
                                    </Button>
                                    <Button
                                        onClick={handleSubmit}
                                        disabled={loading}
                                        className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-2 cursor-pointer"
                                    >
                                        {loading ? (
                                            <Loader className="w-4 h-4 animate-spin" />
                                        ) : (
                                            <Play className="w-4 h-4" />
                                        )}
                                        Run Code
                                    </Button>
                                </div>
                            </div>
                        </header>

                        <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-4 p-4">
                            <div className="lg:col-span-2 space-y-4">
                                <Card className="bg-black/20 backdrop-blur-sm border-gray-700/30">
                                    <CardHeader className="pb-2">
                                        <div className="flex items-center justify-between">
                                            <CardTitle className="text-white">Code Editor</CardTitle>
                                            <div className="flex justify-center items-center gap-2">
                                                {isSaving && (
                                                    <Badge
                                                        variant="secondary"
                                                        className="bg-blue-600/20 text-white"
                                                    >
                                                        <Loader className="animate-spin w-3 h-3 mr-1" />
                                                        Syncing code
                                                    </Badge>
                                                )}
                                                <Badge variant="secondary" className="bg-blue-600/20 text-blue-300">
                                                    {LANGUAGES[languageId as keyof typeof LANGUAGES] || 'Unknown'}
                                                </Badge>
                                            </div>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="p-0">
                                        <div className="rounded-lg overflow-hidden">
                                            <CodeMirror
                                                height="400px"
                                                theme={oneDark}
                                                extensions={extensions}
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
                                                className="text-sm"
                                            />
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card className="bg-black/20 backdrop-blur-sm border-gray-700/30">
                                    <CardHeader className="pb-2">
                                        <CardTitle className="text-white text-sm">Program Input (stdin)</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <Textarea
                                            value={stdin}
                                            onChange={(e) => setStdin(e.target.value)}
                                            className="bg-gray-800/50 border-gray-600 text-white placeholder-gray-400 font-mono text-sm resize-none"
                                            rows={4}
                                            placeholder="Enter input for your program here..."
                                        />
                                    </CardContent>
                                </Card>
                            </div>

                            <div className="space-y-4">
                                {loading && (
                                    <Card className="bg-yellow-500/10 backdrop-blur-sm border-yellow-500/30">
                                        <CardContent className="p-4">
                                            <div className="flex items-center gap-2">
                                                <Loader className="w-4 h-4 animate-spin text-yellow-400" />
                                                <span className="text-yellow-400 text-sm">Executing code...</span>
                                            </div>
                                        </CardContent>
                                    </Card>
                                )}

                                {error && (
                                    <Card className="bg-red-500/10 backdrop-blur-sm border-red-500/30">
                                        <CardHeader className="pb-2">
                                            <CardTitle className="text-red-400 text-sm flex items-center gap-2">
                                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                                </svg>
                                                Execution Error
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <pre className="text-red-300 text-xs font-mono whitespace-pre-wrap break-words">
                                                {error}
                                            </pre>
                                        </CardContent>
                                    </Card>
                                )}

                                {result && (
                                    <>
                                        <ExecutionStatus result={result} />

                                        {result.stdout && (
                                            <ProgramOutput result={result} />
                                        )}

                                        {result.stderr && (
                                            <ErrorOutput result={result} />
                                        )}

                                        {result.compile_output && (
                                            <CompilationOutput result={result} />
                                        )}
                                    </>
                                )}

                                {!result && !error && !loading && (
                                    <GettingStarted />
                                )}
                            </div>
                        </div>
                    </main>
                </div>
            </SidebarProvider>
        </div>
    );
};

export default EditorPage;
