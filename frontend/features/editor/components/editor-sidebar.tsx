import React, { useEffect, useCallback, useState } from 'react';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Copy, LogOut } from 'lucide-react';
import { toast } from "sonner";
import { Room } from "@/features/dashboard/types";
import { useSocket } from "@/context/SocketProvider";
import { ACTIONS } from '@/lib/utils';

interface EditorSidebarProps {
    room: Room;
    onLeaveRoom: () => void;
    onCopyRoomId: () => void;
}

const EditorSidebar = ({ room, onLeaveRoom, onCopyRoomId }: EditorSidebarProps) => {
    const socket = useSocket();

    const [remoteSocketId, setRemoteSocketId] = useState<string | null>(null);

    const handleUserJoined = useCallback(
        ({ id }: { email: string; id: string }) => {
            setRemoteSocketId(id);
        },
        []
    );

    useEffect(() => {
        socket.on(ACTIONS.USER_JOINED, handleUserJoined);

        return () => {
            socket.off(ACTIONS.USER_JOINED, handleUserJoined);
        };
    }, [socket, handleUserJoined]);

    const handleCopyRoomId = async () => {
        try {
            onCopyRoomId();
        } catch (err) {
            console.error(err);
            toast.error("Error copying room ID to clipboard. Please try again later.");
        }
    };

    const handleLeaveRoom = () => {
        toast.success("Room left successfully.");
        onLeaveRoom();
    };

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

            <SidebarContent className="bg-sidebar-accent-foreground" />

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
