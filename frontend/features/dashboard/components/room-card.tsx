"use client"

import React from 'react';
import {Badge} from "@/components/ui/badge";
import {Calendar, Code, Copy, LogOut, MoreVertical, Trash2} from "lucide-react";
import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger} from "@/components/ui/dropdown-menu";
import {Button} from "@/components/ui/button";
import {Card} from "@/components/ui/card";
import {languageColors, LANGUAGES} from "@/data";
import {formatDate} from "@/lib/utils";
import {toast} from "sonner";
import {useRouter} from "next/navigation";
import {Room} from "@/features/dashboard/types";

interface Props{
    room: Room,
    onDeleteRoom: (room: Room) => void,
    onLeaveRoom: (room: Room) => void
}

const RoomCard = ({
    room,
    onDeleteRoom,
    onLeaveRoom
}: Props) => {

    const router = useRouter();

    return (
        <Card
            key={room._id}
            className="w-full bg-gray-900/40 border-gray-800/50 hover:border-gray-700/50 transition-all duration-200 hover:bg-gray-900/60 group"
        >
            <div className="flex items-center justify-between p-6">
                <div className="flex items-center space-x-6 flex-1">
                    <div
                        className="flex-1 min-w-0 cursor-pointer"
                        onClick={() => {
                            router.push(`/editor/${room._id}?username=${user!.username}`);
                        }}
                    >
                        <h3 className="text-lg font-semibold text-white truncate group-hover:text-blue-300 transition-colors mb-2">
                            {room.name}
                        </h3>
                        <div className="flex items-center space-x-4">
                            <Badge
                                variant="outline"
                                className={`${languageColors[LANGUAGES[room.language as keyof typeof LANGUAGES]] || 'bg-gray-500/20 text-gray-300 border-gray-500/30'} text-sm`}
                            >
                                <Code className="h-3 w-3 mr-1" />
                                {LANGUAGES[room.language as keyof typeof LANGUAGES]}
                            </Badge>
                            <div className="flex items-center text-sm text-gray-400">
                                <Calendar className="h-4 w-4 mr-2" />
                                <span>{formatDate(room.createdAt)}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex items-center space-x-2">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="ghost"
                                className="h-8 w-8 p-0 text-gray-400 hover:text-white hover:bg-gray-800/50 opacity-0 group-hover:opacity-100 transition-all duration-200 cursor-pointer"
                            >
                                <MoreVertical className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                            align="end"
                            className="bg-gray-900/95 border-gray-800/50 backdrop-blur-sm"
                        >
                            <DropdownMenuItem
                                onClick={() => {
                                    navigator.clipboard.writeText(room._id)
                                        .then(() => {
                                            toast.success("Room ID copied to clipboard");
                                        })

                                }}
                                className="text-white hover:bg-gray-400/70 cursor-pointer"
                            >
                                <Copy className="h-4 w-4 mr-2" />
                                Copy Room Id
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={() => onLeaveRoom(room)}
                                className="text-red-400 hover:text-red-300 hover:bg-red-900/20 cursor-pointer"
                            >
                                <LogOut className="h-4 w-4 mr-2" />
                                Leave Room
                            </DropdownMenuItem>

                            {/* Only room admins can delete a room */}
                            {
                                user!._id == room.admin._id && (
                                    <DropdownMenuItem
                                        onClick={() => onDeleteRoom(room)}
                                        className="text-red-400 hover:text-red-300 hover:bg-red-900/20 cursor-pointer"
                                    >
                                        <Trash2 className="h-4 w-4 mr-2" />
                                        Delete Room
                                    </DropdownMenuItem>
                                )
                            }

                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        </Card>
    );
};

export default RoomCard;
