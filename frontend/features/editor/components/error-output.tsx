import React from 'react';
import { AlertTriangle } from "lucide-react";
import { SubmissionResult } from "@/data";
import OutputPanel from "./output-panel";

interface Props {
    result: SubmissionResult;
}

const ErrorOutput = ({ result }: Props) => {
    return (
        <OutputPanel title="Runtime error" icon={AlertTriangle} tone="danger">
            <pre className="max-h-64 overflow-y-auto whitespace-pre-wrap break-words font-mono text-[13px] leading-relaxed text-rose-200">
                {result.stderr}
            </pre>
        </OutputPanel>
    );
};

export default ErrorOutput;
