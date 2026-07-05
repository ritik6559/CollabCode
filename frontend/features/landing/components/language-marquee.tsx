"use client";

import React from "react";

const languages = [
    "Python 3.10",
    "C++",
    "Java",
    "C",
    "C# (Mono)",
    "Python 2.7",
    "Nim",
    "C3",
    "Bosque",
];

const Row = () => (
    <div className="lp-marquee">
        {[...languages, ...languages].map((lang, i) => (
            <div
                key={`${lang}-${i}`}
                className="mx-3 flex items-center gap-2 whitespace-nowrap rounded-full border border-stone-100/10 bg-stone-900/50 px-5 py-2.5 backdrop-blur-sm"
            >
                <span className="h-2 w-2 rounded-full bg-gradient-to-r from-amber-400 to-orange-500" />
                <span className="font-mono text-sm text-stone-300">{lang}</span>
            </div>
        ))}
    </div>
);

const LanguageMarquee = () => {
    return (
        <section id="languages" className="py-14">
            <p className="mb-6 text-center text-xs font-medium uppercase tracking-[0.2em] text-stone-500">
                Run your code in the browser — no setup
            </p>
            <div className="lp-marquee-track relative overflow-hidden">
                {/* edge fades */}
                <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-[#0c0a09] to-transparent" />
                <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-[#0c0a09] to-transparent" />
                <Row />
            </div>
        </section>
    );
};

export default LanguageMarquee;
