"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { ArrowRight, Play, Sparkles, Users } from "lucide-react";

const Hero = () => {
    const router = useRouter();

    return (
        <section
            id="home"
            className="container mx-auto grid min-h-[calc(100vh-4rem)] items-center gap-12 px-4 py-16 lg:grid-cols-[1.05fr_1fr] lg:py-20"
        >
            {/* Left: copy */}
            <div className="space-y-8">
                <div
                    className="lp-reveal inline-flex items-center gap-2 rounded-full border border-amber-400/25 bg-amber-400/10 px-4 py-1.5 backdrop-blur-sm"
                    style={{ animationDelay: "0.05s" }}
                >
                    <Sparkles className="h-3.5 w-3.5 text-amber-300" />
                    <span className="text-sm font-medium text-amber-200">
                        Real-time pair programming, reimagined
                    </span>
                </div>

                <h1
                    className="lp-reveal text-5xl font-bold leading-[1.05] tracking-tight text-stone-50 sm:text-6xl xl:text-7xl"
                    style={{ animationDelay: "0.15s" }}
                >
                    Code together,
                    <br />
                    <span className="lp-gradient-text">ship faster.</span>
                </h1>

                <p
                    className="lp-reveal max-w-xl text-lg leading-relaxed text-stone-300"
                    style={{ animationDelay: "0.25s" }}
                >
                    Spin up a shared room and edit the same file live — every keystroke
                    syncs instantly. Run your code in the browser across Python, C++, Java
                    and more. Built for interviews, pair programming, and teaching.
                </p>

                <div
                    className="lp-reveal flex flex-col gap-3 sm:flex-row"
                    style={{ animationDelay: "0.35s" }}
                >
                    <Button
                        onClick={() => router.push("/home")}
                        className="lp-shine group h-12 bg-gradient-to-r from-amber-400 to-orange-500 px-7 text-base font-semibold text-stone-950 shadow-xl shadow-orange-500/25 transition-transform hover:scale-[1.03] hover:from-amber-300 hover:to-orange-400"
                    >
                        Start coding now
                        <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Button>
                    <Button
                        variant="outline"
                        onClick={() => router.push("/sign-up")}
                        className="h-12 border-stone-100/15 bg-stone-100/5 px-7 text-base font-semibold text-stone-100 backdrop-blur-sm hover:bg-stone-100/10 hover:text-white"
                    >
                        Create an account
                    </Button>
                </div>

                {/* Stat row */}
                <div
                    className="lp-reveal flex flex-wrap items-center gap-x-8 gap-y-3 pt-2"
                    style={{ animationDelay: "0.45s" }}
                >
                    {[
                        { value: "< 50ms", label: "sync latency" },
                        { value: "9+", label: "languages" },
                        { value: "0-setup", label: "in-browser runs" },
                    ].map((stat) => (
                        <div key={stat.label} className="flex flex-col">
                            <span className="font-mono text-2xl font-bold text-stone-50">
                                {stat.value}
                            </span>
                            <span className="text-xs uppercase tracking-wider text-stone-500">
                                {stat.label}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Right: live editor mockup */}
            <div
                className="lp-reveal relative"
                style={{ animationDelay: "0.3s" }}
            >
                {/* glow */}
                <div className="absolute -inset-6 rounded-[2rem] bg-gradient-to-tr from-amber-500/20 via-orange-500/10 to-rose-500/20 blur-3xl" />

                <div className="lp-float relative rounded-2xl border border-stone-100/10 bg-stone-900/70 p-2 shadow-2xl backdrop-blur-xl">
                    {/* window chrome */}
                    <div className="flex items-center justify-between rounded-t-xl bg-stone-950/80 px-4 py-3">
                        <div className="flex items-center gap-2">
                            <span className="h-3 w-3 rounded-full bg-rose-400/90" />
                            <span className="h-3 w-3 rounded-full bg-amber-400/90" />
                            <span className="h-3 w-3 rounded-full bg-emerald-400/90" />
                        </div>
                        <span className="font-mono text-xs text-stone-400">two-sum.js</span>
                        <span className="flex items-center gap-1.5 rounded-full bg-emerald-400/10 px-2.5 py-1 text-[10px] font-medium text-emerald-300">
                            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
                            live
                        </span>
                    </div>

                    {/* code body */}
                    <div className="relative rounded-b-xl bg-[#0c0a09] px-5 py-5 font-mono text-[13px] leading-7">
                        {/* collaborator cursor labels */}
                        <span className="absolute right-6 top-8 z-10 rounded-md bg-amber-400 px-1.5 py-0.5 text-[10px] font-semibold text-stone-950 shadow">
                            You
                        </span>
                        <span className="absolute left-24 top-[6.5rem] z-10 rounded-md bg-teal-400 px-1.5 py-0.5 text-[10px] font-semibold text-stone-950 shadow">
                            Priya
                        </span>

                        <pre className="text-stone-400">
<span className="text-rose-300">function</span> <span className="text-amber-200">twoSum</span><span className="text-stone-300">(nums, target) {"{"}</span>
</pre>
                        <pre className="pl-4 text-stone-500"># find the pair that sums to target</pre>
                        <pre className="pl-4 text-stone-300">
  <span className="text-rose-300">const</span> <span className="text-teal-300">seen</span> = <span className="text-amber-200">new</span> <span className="text-teal-300">Map</span>();
</pre>
                        <pre className="pl-4 text-stone-300">
  <span className="text-rose-300">for</span> (<span className="text-rose-300">let</span> i = <span className="text-orange-300">0</span>; i {"<"} nums.length; i++) {"{"}
</pre>
                        <pre className="pl-8 text-stone-300">
    <span className="text-rose-300">const</span> need = target - nums[i];
</pre>
                        <pre className="pl-8 text-stone-300">
    <span className="text-rose-300">if</span> (seen.<span className="text-amber-200">has</span>(need))<span className="lp-typeline"> return [seen.get(need), i];</span><span className="lp-caret" />
</pre>
                        <pre className="pl-8 text-stone-300">    seen.<span className="text-amber-200">set</span>(nums[i], i);</pre>
                        <pre className="pl-4 text-stone-300">{"  }"}</pre>
                        <pre className="text-stone-300">{"}"}</pre>

                        {/* typing indicator */}
                        <div className="mt-5 flex items-center gap-2 rounded-lg border border-teal-400/20 bg-teal-400/5 px-3 py-2">
                            <span className="flex gap-1">
                                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-teal-300" />
                                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-teal-300" style={{ animationDelay: "0.12s" }} />
                                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-teal-300" style={{ animationDelay: "0.24s" }} />
                            </span>
                            <span className="text-xs text-teal-200">Priya is editing line 6…</span>
                        </div>
                    </div>
                </div>

                {/* floating collaborator badge */}
                <div className="absolute -bottom-5 -left-5 hidden items-center gap-2 rounded-xl border border-stone-100/10 bg-stone-900/90 px-3 py-2 shadow-xl backdrop-blur sm:flex">
                    <span className="grid h-8 w-8 place-items-center rounded-full bg-gradient-to-br from-amber-400 to-rose-400">
                        <Users className="h-4 w-4 text-stone-950" />
                    </span>
                    <div className="leading-tight">
                        <p className="text-xs font-semibold text-stone-100">2 collaborators</p>
                        <p className="text-[10px] text-stone-400">in sync, right now</p>
                    </div>
                </div>

                {/* floating run badge */}
                <div className="absolute -right-4 top-10 hidden items-center gap-1.5 rounded-xl border border-emerald-400/20 bg-emerald-400/10 px-3 py-2 shadow-xl backdrop-blur md:flex">
                    <Play className="h-3.5 w-3.5 fill-emerald-300 text-emerald-300" />
                    <span className="text-xs font-medium text-emerald-200">Ran in 0.4s</span>
                </div>
            </div>
        </section>
    );
};

export default Hero;
