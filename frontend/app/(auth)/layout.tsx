'use client'

import React from 'react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { Code2, Loader2, Users, Zap, Play } from 'lucide-react';
import { useGetCurrentUser } from '@/features/auth/api/use-get-current-user';

interface Props {
    children: React.ReactNode;
}

const highlights = [
    { icon: Users, text: "Pair up in a shared room — every keystroke syncs live" },
    { icon: Play, text: "Run code in the browser across 9+ languages" },
    { icon: Zap, text: "Zero setup. Create a room and share the ID" },
];

const Layout = ({ children }: Props) => {
    const { data: user, isLoading } = useGetCurrentUser();

    if (isLoading) {
        return (
            <div className="lp-root flex min-h-screen items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-amber-400" />
            </div>
        );
    }

    if (user) {
        redirect('/home');
    }

    return (
        <div className="lp-root relative min-h-screen overflow-x-clip">
            {/* Ambient background */}
            <div className="lp-aurora">
                <span className="b1" />
                <span className="b2" />
                <span className="b3" />
            </div>
            <div className="lp-grid" />

            <div className="relative z-10 grid min-h-screen lg:grid-cols-[1.1fr_1fr]">
                {/* Left: brand panel */}
                <aside className="hidden flex-col justify-between border-r border-stone-100/10 p-10 lg:flex xl:p-14">
                    <Link href="/" className="flex w-fit items-center gap-2.5">
                        <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-amber-400 to-rose-400 shadow-lg shadow-orange-500/30">
                            <Code2 className="h-5 w-5 text-stone-950" />
                        </span>
                        <span className="text-lg font-bold tracking-tight text-stone-50">
                            CollabCode
                        </span>
                    </Link>

                    <div className="max-w-md space-y-10">
                        <h1 className="text-4xl font-bold leading-tight tracking-tight text-stone-50 xl:text-5xl">
                            Where two cursors are{" "}
                            <span className="lp-gradient-text">better than one.</span>
                        </h1>

                        {/* mini terminal */}
                        <div className="rounded-xl border border-stone-100/10 bg-stone-950/80 p-4 font-mono text-[13px] leading-7 shadow-2xl backdrop-blur">
                            <p className="text-stone-400">
                                <span className="text-amber-300">$</span> collabcode new-room
                            </p>
                            <p className="text-emerald-300">✓ room created — 2 seats</p>
                            <p className="text-stone-400">
                                <span className="text-amber-300">$</span> invite priya
                            </p>
                            <p className="text-teal-300">
                                ✓ syncing live<span className="lp-caret" />
                            </p>
                        </div>

                        <ul className="space-y-4">
                            {highlights.map((item) => (
                                <li key={item.text} className="flex items-center gap-3">
                                    <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg border border-amber-400/20 bg-amber-400/10">
                                        <item.icon className="h-4 w-4 text-amber-300" />
                                    </span>
                                    <span className="text-sm text-stone-300">{item.text}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <p className="font-mono text-xs text-stone-600">
                        © {new Date().getFullYear()} CollabCode
                    </p>
                </aside>

                {/* Right: the form */}
                <main className="flex flex-col p-6 sm:p-10">
                    {/* mobile logo */}
                    <Link href="/" className="mb-10 flex w-fit items-center gap-2.5 lg:hidden">
                        <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-amber-400 to-rose-400 shadow-lg shadow-orange-500/30">
                            <Code2 className="h-5 w-5 text-stone-950" />
                        </span>
                        <span className="text-lg font-bold tracking-tight text-stone-50">
                            CollabCode
                        </span>
                    </Link>

                    <div className="flex flex-1 items-center justify-center">
                        <div className="w-full max-w-md">{children}</div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Layout;
