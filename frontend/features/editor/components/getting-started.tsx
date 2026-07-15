import React from 'react';
import { Play } from "lucide-react";

const GettingStarted = () => {
    return (
        <section className="rounded-2xl border border-stone-100/10 bg-stone-900/20 p-6 text-center">
            <span className="mx-auto mb-3 grid h-12 w-12 place-items-center rounded-full border border-stone-100/10 bg-stone-900/60">
                <Play className="h-5 w-5 text-stone-400" />
            </span>
            <h3 className="text-sm font-semibold text-stone-200">No output yet</h3>
            <p className="mx-auto mt-1.5 max-w-[34ch] text-xs leading-relaxed text-stone-400">
                Run your code to see the result here. If your program reads input,
                add it below the editor first.
            </p>
        </section>
    );
};

export default GettingStarted;
