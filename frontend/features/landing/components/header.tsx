"use client";

import React, { useState } from "react";
import { Code2, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

const navLinks = [
    { label: "Features", href: "#features" },
    { label: "Languages", href: "#languages" },
    { label: "Get Started", href: "#cta" },
];

const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const router = useRouter();

    return (
        <header className="sticky top-0 z-50 border-b border-stone-100/10 bg-stone-950/60 backdrop-blur-xl">
            <div className="container mx-auto flex h-16 items-center justify-between px-4">
                <button
                    className="flex items-center gap-2.5"
                    onClick={() => router.push("/")}
                >
                    <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-amber-400 to-rose-400 shadow-lg shadow-orange-500/30">
                        <Code2 className="h-5 w-5 text-stone-950" />
                    </span>
                    <span className="text-left">
                        <span className="block text-lg font-bold tracking-tight text-stone-50">
                            CollabCode
                        </span>
                        <span className="-mt-1 block font-mono text-[10px] text-amber-300/80">
                            {"<Code /> together"}
                        </span>
                    </span>
                </button>

                <nav className="hidden items-center gap-1 md:flex">
                    {navLinks.map((link) => (
                        <a
                            key={link.href}
                            href={link.href}
                            className="rounded-lg px-3 py-2 text-sm font-medium text-stone-300 transition-colors hover:text-amber-300"
                        >
                            {link.label}
                        </a>
                    ))}
                </nav>

                <div className="hidden items-center gap-2 md:flex">
                    <Button
                        variant="ghost"
                        className="text-stone-300 hover:bg-stone-800/60 hover:text-stone-50"
                        onClick={() => router.push("/sign-in")}
                    >
                        Sign in
                    </Button>
                    <Button
                        className="lp-shine bg-gradient-to-r from-amber-400 to-orange-500 font-semibold text-stone-950 shadow-lg shadow-orange-500/25 hover:from-amber-300 hover:to-orange-400"
                        onClick={() => router.push("/sign-up")}
                    >
                        Sign up
                    </Button>
                </div>

                <Button
                    variant="ghost"
                    size="icon"
                    className="text-stone-300 hover:text-stone-50 md:hidden"
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    aria-label="Toggle menu"
                >
                    {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                </Button>
            </div>

            {isMenuOpen && (
                <div className="border-t border-stone-100/10 bg-stone-950/95 backdrop-blur-xl md:hidden">
                    <nav className="container mx-auto flex flex-col gap-1 px-4 py-4">
                        {navLinks.map((link) => (
                            <a
                                key={link.href}
                                href={link.href}
                                onClick={() => setIsMenuOpen(false)}
                                className="rounded-lg px-3 py-2 text-sm font-medium text-stone-300 hover:bg-stone-800/60 hover:text-amber-300"
                            >
                                {link.label}
                            </a>
                        ))}
                        <div className="mt-2 flex flex-col gap-2 border-t border-stone-800 pt-3">
                            <Button
                                variant="ghost"
                                className="justify-start text-stone-300 hover:text-stone-50"
                                onClick={() => router.push("/sign-in")}
                            >
                                Sign in
                            </Button>
                            <Button
                                className="bg-gradient-to-r from-amber-400 to-orange-500 font-semibold text-stone-950"
                                onClick={() => router.push("/sign-up")}
                            >
                                Sign up
                            </Button>
                        </div>
                    </nav>
                </div>
            )}
        </header>
    );
};

export default Header;
