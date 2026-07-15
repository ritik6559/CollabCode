import React from 'react';
import { Activity } from "lucide-react";
import { SubmissionResult } from "@/data";
import OutputPanel from "./output-panel";

interface Props {
    result: SubmissionResult;
}

/** Judge0 status id 3 is "Accepted"; anything higher is a failure. */
const ACCEPTED = 3;

const ExecutionStatus = ({ result }: Props) => {
    const passed = result.status.id === ACCEPTED;

    return (
        <OutputPanel title="Execution" icon={Activity}>
            <dl className="space-y-2.5 text-xs">
                <div className="flex items-center justify-between gap-3">
                    <dt className="text-stone-400">Status</dt>
                    <dd>
                        <span
                            className={`rounded-full border px-2 py-0.5 font-medium ${
                                passed
                                    ? "border-emerald-400/20 bg-emerald-400/10 text-emerald-200"
                                    : "border-rose-400/20 bg-rose-400/10 text-rose-200"
                            }`}
                        >
                            {result.status.description}
                        </span>
                    </dd>
                </div>
                <div className="flex items-center justify-between gap-3">
                    <dt className="text-stone-400">Time</dt>
                    <dd className="font-mono text-stone-100">
                        {result.time ? `${result.time}s` : "—"}
                    </dd>
                </div>
                <div className="flex items-center justify-between gap-3">
                    <dt className="text-stone-400">Memory</dt>
                    <dd className="font-mono text-stone-100">
                        {result.memory ? `${result.memory} KB` : "—"}
                    </dd>
                </div>
            </dl>
        </OutputPanel>
    );
};

export default ExecutionStatus;
