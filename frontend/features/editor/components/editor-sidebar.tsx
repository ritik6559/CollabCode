/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useCallback, useState, useRef } from 'react';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Copy, LogOut, Video, VideoOff, Mic, MicOff, PhoneCall, PhoneOff } from 'lucide-react';
import { toast } from "sonner";
import { Room, RoomUser } from "@/features/dashboard/types";
import { User } from "@/lib/types";
import peer from "@/services/peer";
import { useSocket } from "@/context/SocketProvider";
import { ACTIONS } from '@/lib/utils';

interface EditorSidebarProps {
    room: Room;
    roomMembers: RoomUser[];
    activeMembers: User[];
    onLeaveRoom: () => void;
    onCopyRoomId: () => void;
}

const EditorSidebar = ({ room, onLeaveRoom, onCopyRoomId }: EditorSidebarProps) => {
    const socket = useSocket();

    const [remoteSocketId, setRemoteSocketId] = useState(null);
    const [myStream, setMyStream] = useState<MediaStream | null>(null);
    const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
    const [isAudioMuted, setIsAudioMuted] = useState(false);
    const [isVideoOff, setIsVideoOff] = useState(false);
    const [isCallActive, setIsCallActive] = useState(false);
    const [isConnecting, setIsConnecting] = useState(false);

    const myVideoRef = useRef<HTMLVideoElement | null>(null);
    const remoteVideoRef = useRef<HTMLVideoElement | null>(null);

    const handleUserJoined = useCallback(
        ({ email, id }: { email: string; id: any }) => {
            console.log(`Email ${email} joined room`);
            setRemoteSocketId(id);
            toast(`${email} has joined the room`);
        },
        []
    );

    const toggleAudio = useCallback(() => {
        if (myStream) {
            const audioTrack = myStream.getAudioTracks()[0];
            if (audioTrack) {
                audioTrack.enabled = !audioTrack.enabled;
                setIsAudioMuted(!audioTrack.enabled);
                toast(audioTrack.enabled ? "You are now unmuted" : "You are now muted");
            }
        }
    }, [myStream]);

    const toggleVideo = useCallback(() => {
        if (myStream) {
            const videoTrack = myStream.getVideoTracks()[0];
            if (videoTrack) {
                videoTrack.enabled = !videoTrack.enabled;
                setIsVideoOff(!videoTrack.enabled);
                toast(
                    videoTrack.enabled
                        ? "Your camera is now on"
                        : "Your camera is now off"
                );
            }
        }
    }, [myStream]);

    const handleCallUser = useCallback(async () => {
        try {
            setIsConnecting(true);
            const stream = await navigator.mediaDevices.getUserMedia({
                audio: true,
                video: true,
            });
            setMyStream(stream);
            const offer = await peer.getOffer();
            socket.emit(ACTIONS.USER_CALL, { to: remoteSocketId, offer });
            toast("Connecting to the other participant");
        } catch (error) {
            console.log(error);
            toast("Failed to access camera or microphone");
            setIsConnecting(false);
        }
    }, [remoteSocketId, socket]);

    const handleIncommingCall = useCallback(
        async ({ from, offer }: { from: any; offer: any }) => {
            try {
                setRemoteSocketId(from);
                setIsConnecting(true);
                const stream = await navigator.mediaDevices.getUserMedia({
                    audio: true,
                    video: true,
                });
                setMyStream(stream);
                console.log(`Incoming Call`, from, offer);
                const ans = await peer.getAnswer(offer);
                socket.emit(ACTIONS.CALL_ACCEPTED, { to: from, ans });
                toast("Call accepted automatically");
            } catch (error) {
                console.log(error);
                toast("Failed to accept incoming call");
                setIsConnecting(false);
            }
        },
        [socket]
    );

    const sendStreams = useCallback(() => {
        if (!myStream) return;
        myStream.getTracks().forEach((track) => {
            peer.peer.addTrack(track, myStream);
        });
        toast("Your video stream has been shared");
    }, [myStream]);

    const handleCallAccepted = useCallback(
        ({ ans }: { form: any; ans: any }) => {
            peer.setLocalDescription(ans);
            console.log("Call Accepted!");
            setIsCallActive(true);
            setIsConnecting(false);
            sendStreams();
            toast("You are now connected!");
        },
        [sendStreams]
    );

    const handleNegoNeeded = useCallback(async () => {
        const offer = await peer.getOffer();
        socket.emit(ACTIONS.PEER_NEGO_NEEDED, { offer, to: remoteSocketId });
    }, [remoteSocketId, socket]);

    const handleNegoNeedIncomming = useCallback(
        async ({ from, offer }: { from: any; offer: any }) => {
            const ans = await peer.getAnswer(offer);
            socket.emit(ACTIONS.PEER_NEGO_DONE, { to: from, ans });
        },
        [socket]
    );

    const handleNegoNeedFinal = useCallback(async ({ ans }: { ans: any }) => {
        await peer.setLocalDescription(ans);
    }, []);

    const endCall = useCallback(() => {
        if (myStream) {
            myStream.getTracks().forEach((track) => track.stop());
            setMyStream(null);
        }
        setIsCallActive(false);
        setIsConnecting(false);
        setRemoteStream(null);
        toast("The call has been disconnected");
    }, [myStream]);

    const handleCopyRoomId = async () => {
        try {
            onCopyRoomId();
            toast.success("Room ID copied to clipboard");
        } catch (err) {
            console.log(err);
            toast.error("Error copying room ID to clipboard. Please try again later.");
        }
    };

    const handleLeaveRoom = () => {
        // End call before leaving room
        if (myStream || isCallActive) {
            endCall();
        }
        toast.success("Room left successfully.");
        setTimeout(onLeaveRoom, 1000);
    };

    // Video call effects
    useEffect(() => {
        peer.peer.addEventListener("negotiationneeded", handleNegoNeeded);
        return () => {
            peer.peer.removeEventListener("negotiationneeded", handleNegoNeeded);
        };
    }, [handleNegoNeeded]);

    useEffect(() => {
        peer.peer.addEventListener("track", (ev) => {
            const remoteStream = ev.streams[0];
            console.log("GOT TRACKS!!");
            setRemoteStream(remoteStream);
            setIsCallActive(true);
            setIsConnecting(false);
        });
    }, []);

    useEffect(() => {
        socket.on(ACTIONS.USER_JOINED, handleUserJoined);
        socket.on(ACTIONS.INCOMING_CALL, handleIncommingCall);
        socket.on(ACTIONS.CALL_ACCEPTED, handleCallAccepted);
        socket.on(ACTIONS.PEER_NEGO_NEEDED, handleNegoNeedIncomming);
        socket.on(ACTIONS.PEER_NEGO_FINAL, handleNegoNeedFinal);

        return () => {
            socket.off(ACTIONS.USER_JOINED, handleUserJoined);
            socket.off(ACTIONS.INCOMING_CALL, handleIncommingCall);
            socket.off(ACTIONS.CALL_ACCEPTED, handleCallAccepted);
            socket.off(ACTIONS.PEER_NEGO_NEEDED, handleNegoNeedIncomming);
            socket.off(ACTIONS.PEER_NEGO_FINAL, handleNegoNeedFinal);
        };
    }, [
        socket,
        handleUserJoined,
        handleIncommingCall,
        handleCallAccepted,
        handleNegoNeedIncomming,
        handleNegoNeedFinal,
    ]);

    useEffect(() => {
        if (myVideoRef.current && myStream) {
            myVideoRef.current.srcObject = myStream;
        }
    }, [myStream]);

    useEffect(() => {
        if (remoteVideoRef.current && remoteStream) {
            remoteVideoRef.current.srcObject = remoteStream;
        }
    }, [remoteStream]);

    return (
        <Sidebar className="bg-black/80 border-r border-gray-700/30 backdrop-blur-md mt-16 pb-16">
            <SidebarHeader className="border-b border-gray-700/30 p-4 bg-sidebar-accent-foreground">
                <div className="space-y-2">
                    <h2 className="text-lg font-semibold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent truncate">
                        {room?.name || 'Loading...'}
                    </h2>
                    <div className="flex items-center gap-2">
                        <Badge
                            variant={remoteSocketId ? "default" : "secondary"}
                            className="gap-2 px-2 py-1 text-xs"
                        >
                            <div
                                className={`w-2 h-2 rounded-full ${
                                    remoteSocketId ? "bg-emerald-500" : "bg-gray-500"
                                }`}
                            />
                            {remoteSocketId ? "Connected" : "Waiting"}
                        </Badge>
                    </div>
                </div>
            </SidebarHeader>

            <SidebarContent className="bg-sidebar-accent-foreground">
                {/* Video Call Section */}
                <SidebarGroup>
                    <SidebarGroupLabel className="text-gray-400 text-xs uppercase tracking-wider px-3 py-2">
                        Video Conference
                    </SidebarGroupLabel>
                    <SidebarGroupContent className="px-3 space-y-3">
                        {/* My Video */}
                        {myStream && (
                            <div className="relative bg-gray-800/50 rounded-lg overflow-hidden">
                                <video
                                    ref={myVideoRef}
                                    autoPlay
                                    muted
                                    className="w-full h-32 object-cover"
                                />
                                <div className="absolute bottom-2 left-2">
                                    <Badge className="bg-black/50 text-white text-xs">
                                        You {isAudioMuted && "(Muted)"} {isVideoOff && "(Camera Off)"}
                                    </Badge>
                                </div>
                                {isVideoOff && (
                                    <div className="absolute inset-0 bg-gray-800/80 flex items-center justify-center">
                                        <VideoOff className="h-8 w-8 text-gray-400" />
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Remote Video */}
                        {remoteStream && (
                            <div className="relative bg-gray-800/50 rounded-lg overflow-hidden">
                                <video
                                    ref={remoteVideoRef}
                                    autoPlay
                                    className="w-full h-32 object-cover"
                                />
                                <div className="absolute bottom-2 left-2">
                                    <Badge className="bg-black/50 text-white text-xs">
                                        Remote User
                                    </Badge>
                                </div>
                            </div>
                        )}

                        {/* Video Controls */}
                        <div className="flex gap-2 justify-center">
                            {myStream && (
                                <>
                                    <Button
                                        onClick={toggleAudio}
                                        variant={isAudioMuted ? "destructive" : "secondary"}
                                        size="sm"
                                        className="h-8 w-8 p-0"
                                    >
                                        {isAudioMuted ? (
                                            <MicOff className="h-4 w-4" />
                                        ) : (
                                            <Mic className="h-4 w-4" />
                                        )}
                                    </Button>
                                    <Button
                                        onClick={toggleVideo}
                                        variant={isVideoOff ? "destructive" : "secondary"}
                                        size="sm"
                                        className="h-8 w-8 p-0"
                                    >
                                        {isVideoOff ? (
                                            <VideoOff className="h-4 w-4" />
                                        ) : (
                                            <Video className="h-4 w-4" />
                                        )}
                                    </Button>
                                </>
                            )}

                            {remoteSocketId && !isCallActive && !isConnecting && (
                                <Button
                                    onClick={handleCallUser}
                                    size="sm"
                                    className="bg-emerald-600 hover:bg-emerald-700 text-white px-3"
                                >
                                    <PhoneCall className="h-4 w-4 mr-1" />
                                    Call
                                </Button>
                            )}

                            {isConnecting && (
                                <Button disabled size="sm" className="px-3">
                                    <div className="animate-spin rounded-full h-3 w-3 border border-white/30 border-t-white mr-1"></div>
                                    Connecting
                                </Button>
                            )}

                            {(myStream || isCallActive) && (
                                <Button
                                    onClick={endCall}
                                    variant="destructive"
                                    size="sm"
                                    className="h-8 w-8 p-0"
                                >
                                    <PhoneOff className="h-4 w-4" />
                                </Button>
                            )}
                        </div>

                        {myStream && isCallActive && (
                            <Button
                                onClick={sendStreams}
                                variant="outline"
                                size="sm"
                                className="w-full text-xs"
                            >
                                Send Stream
                            </Button>
                        )}
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>

            <SidebarFooter className="border-t border-gray-700/30 p-4 space-y-3 bg-sidebar-accent-foreground">
                <Button
                    onClick={handleCopyRoomId}
                    variant="outline"
                    className="w-full bg-gray-800/50 hover:bg-gray-700/50 text-gray-300 hover:text-white border-gray-600/30 transition-colors cursor-pointer"
                >
                    <Copy className="w-4 h-4 mr-2" />
                    Copy Room ID
                </Button>
                <Button
                    onClick={handleLeaveRoom}
                    variant="destructive"
                    className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white shadow-lg shadow-red-600/25 transition-all duration-200 cursor-pointer"
                >
                    <LogOut className="w-4 h-4 mr-2" />
                    Leave Room
                </Button>
            </SidebarFooter>
        </Sidebar>
    );
}

export default EditorSidebar;