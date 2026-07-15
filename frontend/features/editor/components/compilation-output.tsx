import React from 'react';
import { FileWarning } from "lucide-react";
import { SubmissionResult } from "@/data";
import OutputPanel from "./output-panel";

interface Props {
    result: SubmissionResult;
}

const CompilationOutput = ({ result }: Props) => {
    return (
        <OutputPanel title="Compilation" icon={FileWarning} tone="danger">
            <pre className="max-h-64 overflow-y-auto whitespace-pre-wrap break-words font-mono text-[13px] leading-relaxed text-rose-200">
                {result.compile_output}
            </pre>
        </OutputPanel>
    );
};

export default CompilationOutput;
