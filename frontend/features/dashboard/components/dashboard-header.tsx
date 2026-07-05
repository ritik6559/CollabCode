"use client";

import React from "react";
import Link from "next/link";
import { Code2, LogOut, Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useLogoutUser } from "@/features/auth/api/use-logout-user";
import { User } from "@/features/auth/types";

interface DashboardHeaderProps {
    user: User;
    search: string;
    onSearchChange: (value: string) => void;
}

const DashboardHeader = ({ user, search, onSearchChange }: DashboardHeaderProps) => {
    const { mutateAsync: logout, isPending } = useLogoutUser();

    return (
        <header className="sticky top-0 z-40 border-b border-stone-100/10 bg-stone-950/70 backdrop-blur-xl">
            <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 sm:px-6 lg:px-8">
                {/* Logo */}
                <Link href="/home" className="flex shrink-0 items-center gap-2.5">
                    <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-amber-400 to-rose-400 shadow-lg shadow-orange-500/30">
                        <Code2 className="h-5 w-5 text-stone-950" />
                    </span>
                    <span className="hidden text-lg font-bold tracking-tight text-stone-50 sm:block">
                        CollabCode
                    </span>
                </Link>

                {/* Search — Google Docs style centered pill */}
                <div className="relative mx-auto w-full max-w-xl">
                    <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-500" />
                    <Input
                        value={search}
                        onChange={(e) => onSearchChange(e.target.value)}
                        placeholder="Search your rooms"
                        className="h-11 rounded-full border-stone-100/10 bg-stone-900/60 pl-11 pr-10 text-stone-100 placeholder:text-stone-500 focus-visible:border-amber-400/40 focus-visible:ring-amber-400/20"
                    />
                    {search && (
                        <button
                            aria-label="Clear search"
                            onClick={() => onSearchChange("")}
                            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-500 transition-colors hover:text-stone-300"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    )}
                </div>

                {/* Avatar menu */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <button
                            aria-label="Account menu"
                            className="grid h-10 w-10 shrink-0 cursor-pointer place-items-center rounded-full bg-gradient-to-br from-amber-400 to-rose-400 text-base font-bold text-stone-950 shadow-lg shadow-orange-500/20 transition-transform hover:scale-105"
                        >
                            {user.username.charAt(0).toUpperCase()}
                        </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                        align="end"
                        className="w-60 border-stone-100/10 bg-stone-900/95 backdrop-blur-xl"
                    >
                        <DropdownMenuLabel className="font-normal">
                            <p className="truncate font-semibold text-stone-100">{user.username}</p>
                            <p className="truncate text-xs text-stone-400">{user.email}</p>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator className="bg-stone-100/10" />
                        <DropdownMenuItem
                            disabled={isPending}
                            onClick={() => logout()}
                            className="cursor-pointer text-rose-300 focus:bg-rose-500/10 focus:text-rose-200"
                        >
                            <LogOut className="mr-2 h-4 w-4" />
                            Log out
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </header>
    );
};

export default DashboardHeader;
