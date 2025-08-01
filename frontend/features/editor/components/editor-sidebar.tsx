import React from 'react';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Copy, LogOut } from 'lucide-react';
import {toast} from "sonner";
import {Room, RoomUser} from "@/features/dashboard/types";
import {User} from "@/lib/types";

interface EditorSidebarProps {
    room: Room;
    roomMembers: RoomUser[];
    activeMembers: User[];
    onLeaveRoom: () => void;
    onCopyRoomId: () => void;
}

const EditorSidebar = ({ room, roomMembers, activeMembers, onLeaveRoom, onCopyRoomId }: EditorSidebarProps) => {
    const safeGroupMembers = Array.isArray(roomMembers) ? roomMembers : [];
    const safeActiveMembers = Array.isArray(activeMembers) ? activeMembers : [];


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
        toast.success("Room left successfully.");
        setTimeout(onLeaveRoom, 1000);
    };

    return (
        <Sidebar className="bg-black/80 border-r border-gray-700/30 backdrop-blur-md mt-16 pb-16">
            <SidebarHeader className="border-b border-gray-700/30 p-4 bg-sidebar-accent-foreground">
                <div className="space-y-2">
                    <h2 className="text-lg font-semibold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent truncate">
                        {room?.name || 'Loading...'}
                    </h2>
                </div>
            </SidebarHeader>

            <SidebarContent className="bg-sidebar-accent-foreground">
                <SidebarGroup>
                    <SidebarGroupLabel className="text-gray-400 text-xs uppercase tracking-wider px-3 py-2">
                        Active Members
                    </SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {safeActiveMembers.length > 0 ? (
                                safeActiveMembers.map((user) => (
                                    <SidebarMenuItem key={user.socketId}>
                                        <SidebarMenuButton className="flex items-center gap-3 px-3 py-2 hover:bg-gray-800/30 transition-colors">
                                            <div className="relative">
                                                <Avatar className="h-8 w-8">
                                                    <AvatarFallback className={`text-white bg-blue-600 font-semibold text-lg uppercase rounded-md`}>
                                                        {user.username?.[0] || '?'}
                                                    </AvatarFallback>
                                                </Avatar>
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium text-gray-200 truncate">
                                                    {user.username || 'Unknown User'}
                                                </p>
                                            </div>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                ))
                            ) : (
                                <SidebarMenuItem>
                                    <div className="flex items-center gap-3 px-3 py-2 text-gray-400 text-sm">
                                        <div className="h-8 w-8 rounded-full bg-gray-700/50 animate-pulse" />
                                        <span>Loading members...</span>
                                    </div>
                                </SidebarMenuItem>
                            )}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
                <SidebarGroup>
                    <SidebarGroupLabel className="text-gray-400 text-xs uppercase tracking-wider px-3 py-2">
                        Room Members
                    </SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {safeGroupMembers.length > 0 ? (
                                safeGroupMembers.map((user) => (
                                    <SidebarMenuItem key={user._id}>
                                        <SidebarMenuButton className="flex items-center gap-3 px-3 py-2 hover:bg-gray-800/30 transition-colors">
                                            <div className="relative">
                                                <Avatar className="h-8 w-8">
                                                    <AvatarFallback className={`text-white bg-blue-600 font-semibold text-lg uppercase rounded-md`}>
                                                        {user.username?.[0] || '?'}
                                                    </AvatarFallback>
                                                </Avatar>
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium text-gray-200 truncate">
                                                    {user.username || 'Unknown User'}
                                                </p>
                                            </div>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                ))
                            ) : (
                                <SidebarMenuItem>
                                    <div className="flex items-center gap-3 px-3 py-2 text-gray-400 text-sm">
                                        <div className="h-8 w-8 rounded-full bg-gray-700/50 animate-pulse" />
                                        <span>Loading members...</span>
                                    </div>
                                </SidebarMenuItem>
                            )}
                        </SidebarMenu>
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
