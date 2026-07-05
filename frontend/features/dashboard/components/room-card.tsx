"use client";

import React from "react";
import { useRouter } from "next/navigation";
import {
    Copy,
    FileCode2,
    LogOut,
    MoreVertical,
    SquareArrowOutUpRight,
    Trash2,
    Users,
} from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { LANGUAGES } from "@/data";
import { formatDate } from "@/lib/utils";
import { Room } from "@/features/dashboard/types";
import { User } from "@/features/auth/types";

interface RoomCardProps {
    room: Room;
    user: User;
    onDelete: (room: Room) => void;
    onLeave: (room: Room) => void;
}

const RoomCard = ({ room, user, onDelete, onLeave }: RoomCardProps) => {
    const router = useRouter();
    const isOwner = user._id === room.admin._id;

    const openRoom = () => {
        router.push(`/editor/${room._id}?username=${encodeURIComponent(user.username)}`);
    };

    const copyRoomId = async () => {
        await navigator.clipboard.writeText(room._id);
        toast.success("Room ID copied to clipboard");
    };

    return (
        <div className="lp-card group cursor-pointer overflow-hidden rounded-2xl" onClick={openRoom}>
            {/* Thumbnail — mini code preview, like a Docs page preview */}
            <div className="relative h-36 overflow-hidden border-b border-stone-100/10 bg-[#0c0a09]">
                {room.code ? (
                    <pre className="pointer-events-none p-4 font-mono text-[10px] leading-4 text-stone-500">
                        {room.code.split("\n").slice(0, 9).join("\n")}
                    </pre>
                ) : (
                    <div className="flex h-full items-center justify-center">
                        <FileCode2 className="h-10 w-10 text-stone-800" />
                    </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950/60 to-transparent" />

                {/* shared indicator */}
                {room.joinedUser && (
                    <span className="absolute right-3 top-3 flex items-center gap-1 rounded-full border border-teal-400/20 bg-teal-400/10 px-2 py-0.5 text-[10px] font-medium text-teal-200 backdrop-blur">
                        <Users className="h-3 w-3" />
                        Shared
                    </span>
                )}
            </div>

            {/* Info row */}
            <div className="flex items-start gap-3 p-4">
                <span className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-amber-400/20 bg-amber-400/10">
                    <FileCode2 className="h-4.5 w-4.5 text-amber-300" />
                </span>

                <div className="min-w-0 flex-1">
                    <h3 className="truncate font-semibold text-stone-100 transition-colors group-hover:text-amber-200">
                        {room.name}
                    </h3>
                    <p className="mt-0.5 truncate text-xs text-stone-500">
                        {LANGUAGES[room.language as keyof typeof LANGUAGES] ?? "Unknown"}
                        {" · "}
                        {isOwner ? "Owned by you" : `Owned by ${room.admin.username}`}
                        {" · "}
                        {formatDate(room.updatedAt)}
                    </p>
                </div>

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            variant="ghost"
                            aria-label="Room options"
                            onClick={(e) => e.stopPropagation()}
                            className="h-8 w-8 shrink-0 p-0 text-stone-500 hover:bg-stone-800/60 hover:text-stone-200"
                        >
                            <MoreVertical className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                        align="end"
                        onClick={(e) => e.stopPropagation()}
                        className="w-52 border-stone-100/10 bg-stone-900/95 backdrop-blur-xl"
                    >
                        <DropdownMenuItem
                            onClick={openRoom}
                            className="cursor-pointer text-stone-200 focus:bg-stone-800/80 focus:text-stone-50"
                        >
                            <SquareArrowOutUpRight className="mr-2 h-4 w-4" />
                            Open
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            onClick={copyRoomId}
                            className="cursor-pointer text-stone-200 focus:bg-stone-800/80 focus:text-stone-50"
                        >
                            <Copy className="mr-2 h-4 w-4" />
                            Copy room ID
                        </DropdownMenuItem>
                        <DropdownMenuSeparator className="bg-stone-100/10" />
                        <DropdownMenuItem
                            onClick={() => onLeave(room)}
                            className="cursor-pointer text-rose-300 focus:bg-rose-500/10 focus:text-rose-200"
                        >
                            <LogOut className="mr-2 h-4 w-4" />
                            Leave room
                        </DropdownMenuItem>
                        {isOwner && (
                            <DropdownMenuItem
                                onClick={() => onDelete(room)}
                                className="cursor-pointer text-rose-300 focus:bg-rose-500/10 focus:text-rose-200"
                            >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete room
                            </DropdownMenuItem>
                        )}
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </div>
    );
};

export default RoomCard;
