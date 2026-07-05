"use client";

import React from "react";
import { Code2 } from "lucide-react";

const Footer = () => {
    return (
        <footer className="border-t border-stone-100/10">
            <div className="container mx-auto flex flex-col items-center justify-between gap-4 px-4 py-8 sm:flex-row">
                <div className="flex items-center gap-2.5">
                    <span className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-amber-400 to-rose-400">
                        <Code2 className="h-4 w-4 text-stone-950" />
                    </span>
                    <span className="font-semibold text-stone-100">CollabCode</span>
                </div>
                <p className="text-sm text-stone-500">
                    Built for developers who code better together.
                </p>
                <p className="font-mono text-xs text-stone-600">
                    © {new Date().getFullYear()} CollabCode
                </p>
            </div>
        </footer>
    );
};

export default Footer;
