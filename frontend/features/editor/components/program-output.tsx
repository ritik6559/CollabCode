import React from 'react';
import { Terminal } from "lucide-react";
import { SubmissionResult } from "@/data";
import OutputPanel from "./output-panel";

interface Props {
    result: SubmissionResult;
}

const ProgramOutput = ({ result }: Props) => {
    return (
        <OutputPanel title="Output" icon={Terminal} tone="success">
            <pre className="max-h-64 overflow-y-auto whitespace-pre-wrap break-words font-mono text-[13px] leading-relaxed text-stone-200">
                {result.stdout}
            </pre>
        </OutputPanel>
    );
};

export default ProgramOutput;
