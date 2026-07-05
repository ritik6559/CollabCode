"use client";

import React from "react";
import { Users, Zap, Share2, ShieldCheck, Code2, Gauge } from "lucide-react";

const features = [
    {
        icon: Users,
        title: "Real-time collaboration",
        description:
            "Two developers, one file. Every keystroke syncs instantly over WebSockets with live presence — perfect for pair programming and interviews.",
        className: "md:col-span-2",
        accent: "from-amber-400 to-orange-500",
    },
    {
        icon: Zap,
        title: "Instant execution",
        description:
            "Run code in the browser and get program output, errors, and compile results in seconds.",
        className: "",
        accent: "from-orange-400 to-rose-500",
    },
    {
        icon: Share2,
        title: "One-click rooms",
        description:
            "Create a room, share the ID, and start coding together. No installs, no config.",
        className: "",
        accent: "from-rose-400 to-amber-500",
    },
    {
        icon: ShieldCheck,
        title: "Secure by default",
        description:
            "JWT auth over httpOnly cookies keeps sessions safe, so you can focus on the code — not the plumbing.",
        className: "md:col-span-2",
        accent: "from-teal-400 to-emerald-500",
    },
];

const Features = () => {
    return (
        <section id="features" className="container mx-auto px-4 py-24">
            <div className="mx-auto mb-16 max-w-2xl text-center">
                <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-stone-100/10 bg-stone-900/50 px-4 py-1.5 text-xs font-medium text-stone-300">
                    <Code2 className="h-3.5 w-3.5 text-amber-300" />
                    Everything you need to code together
                </span>
                <h2 className="text-4xl font-bold tracking-tight text-stone-50 lg:text-5xl">
                    Built for the way{" "}
                    <span className="lp-gradient-text">developers collaborate</span>
                </h2>
            </div>

            <div className="grid gap-5 md:grid-cols-3">
                {features.map((feature) => (
                    <div
                        key={feature.title}
                        className={`lp-card group rounded-2xl p-7 ${feature.className}`}
                    >
                        <div
                            className={`mb-5 grid h-12 w-12 place-items-center rounded-xl bg-gradient-to-br ${feature.accent} shadow-lg transition-transform group-hover:scale-110`}
                        >
                            <feature.icon className="h-6 w-6 text-stone-950" />
                        </div>
                        <h3 className="mb-2 text-xl font-semibold text-stone-50">
                            {feature.title}
                        </h3>
                        <p className="leading-relaxed text-stone-400">
                            {feature.description}
                        </p>
                    </div>
                ))}
            </div>

            {/* metric strip */}
            <div className="mt-5 grid gap-5 sm:grid-cols-3">
                {[
                    { icon: Gauge, stat: "Sub-second", label: "code execution" },
                    { icon: Users, stat: "Live cursors", label: "see edits as they happen" },
                    { icon: Zap, stat: "Zero setup", label: "runs entirely in-browser" },
                ].map((item) => (
                    <div
                        key={item.label}
                        className="flex items-center gap-4 rounded-2xl border border-stone-100/10 bg-stone-900/40 px-6 py-5"
                    >
                        <item.icon className="h-6 w-6 shrink-0 text-amber-300" />
                        <div>
                            <p className="font-semibold text-stone-50">{item.stat}</p>
                            <p className="text-sm text-stone-400">{item.label}</p>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default Features;
