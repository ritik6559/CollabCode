"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";

const Cta = () => {
    const router = useRouter();

    return (
        <section id="cta" className="container mx-auto px-4 py-24">
            <div className="relative overflow-hidden rounded-3xl border border-amber-400/20 p-10 text-center sm:p-16">
                {/* warm glow background */}
                <div className="absolute inset-0 -z-10 bg-gradient-to-br from-amber-500/15 via-orange-500/10 to-rose-500/15" />
                <div className="absolute -left-20 -top-20 -z-10 h-72 w-72 rounded-full bg-amber-500/20 blur-3xl" />
                <div className="absolute -bottom-20 -right-20 -z-10 h-72 w-72 rounded-full bg-rose-500/20 blur-3xl" />

                <h2 className="mx-auto max-w-2xl text-4xl font-bold tracking-tight text-stone-50 lg:text-5xl">
                    Ready to build{" "}
                    <span className="lp-gradient-text">something together?</span>
                </h2>
                <p className="mx-auto mt-5 max-w-xl text-lg text-stone-300">
                    Create a room, invite a teammate, and start coding in real time. It
                    takes about ten seconds.
                </p>

                <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
                    <Button
                        onClick={() => router.push("/home")}
                        className="lp-shine group h-12 bg-gradient-to-r from-amber-400 to-orange-500 px-8 text-base font-semibold text-stone-950 shadow-xl shadow-orange-500/25 transition-transform hover:scale-[1.03] hover:from-amber-300 hover:to-orange-400"
                    >
                        Get started free
                        <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Button>
                    <Button
                        variant="outline"
                        onClick={() => router.push("/sign-in")}
                        className="h-12 border-stone-100/15 bg-stone-100/5 px-8 text-base font-semibold text-stone-100 hover:bg-stone-100/10 hover:text-white"
                    >
                        Sign in
                    </Button>
                </div>
            </div>
        </section>
    );
};

export default Cta;
