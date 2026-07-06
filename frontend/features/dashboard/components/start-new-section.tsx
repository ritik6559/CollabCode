"use client";

import React from "react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { FileCode2, FileText, Hash, Plus, Upload } from "lucide-react";

interface StartNewSectionProps {
    onNewCodeRoom: () => void;
    onNewDocRoom: () => void;
    onUploadFile: () => void;
    onJoinRoom: () => void;
}

interface TemplateCard {
    label: string;
    hint: string;
    icon: React.ElementType;
    accent: string;
    onClick: () => void;
}

const StartNewSection = ({ onNewCodeRoom, onNewDocRoom, onUploadFile, onJoinRoom }: StartNewSectionProps) => {
    const templates: TemplateCard[] = [
        {
            label: "Blank code room",
            hint: "Start from scratch",
            icon: Plus,
            accent: "from-amber-400 to-orange-500",
            onClick: onNewCodeRoom,
        },
        {
            label: "Doc file",
            hint: "Collaborative document",
            icon: FileText,
            accent: "from-lime-400 to-emerald-500",
            onClick: onNewDocRoom,
        },
        {
            label: "Upload a file",
            hint: "From your device",
            icon: Upload,
            accent: "from-sky-400 to-blue-500",
            onClick: onUploadFile,
        },
        {
            label: "Join with ID",
            hint: "Enter a room ID",
            icon: Hash,
            accent: "from-orange-400 to-rose-500",
            onClick: onJoinRoom,
        },
    ];

    return (
        <section className="space-y-4">
            <div className="flex items-center justify-between">
                <h2 className="text-sm font-medium uppercase tracking-wider text-stone-400">
                    Start a new room
                </h2>

                {/* "New" dropdown — code file / doc file / upload */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button className="lp-shine bg-gradient-to-r from-amber-400 to-orange-500 font-semibold text-stone-950 shadow-lg shadow-orange-500/25 hover:from-amber-300 hover:to-orange-400">
                            <Plus className="mr-1 h-4 w-4" />
                            New
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                        align="end"
                        className="w-56 border-stone-100/10 bg-stone-900/95 backdrop-blur-xl"
                    >
                        <DropdownMenuItem
                            onClick={onNewCodeRoom}
                            className="cursor-pointer text-stone-200 focus:bg-stone-800/80 focus:text-stone-50"
                        >
                            <FileCode2 className="mr-2 h-4 w-4 text-amber-300" />
                            Code file
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            onClick={onNewDocRoom}
                            className="cursor-pointer text-stone-200 focus:bg-stone-800/80 focus:text-stone-50"
                        >
                            <FileText className="mr-2 h-4 w-4 text-emerald-300" />
                            Doc file
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            onClick={onUploadFile}
                            className="cursor-pointer text-stone-200 focus:bg-stone-800/80 focus:text-stone-50"
                        >
                            <Upload className="mr-2 h-4 w-4 text-sky-300" />
                            Upload from device
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            {/* Google Docs style template cards */}
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                {templates.map((template) => (
                    <button
                        key={template.label}
                        onClick={template.onClick}
                        className="lp-card group cursor-pointer rounded-2xl p-5 text-left"
                    >
                        <span
                            className={`mb-4 grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br ${template.accent} shadow-lg transition-transform group-hover:scale-110`}
                        >
                            <template.icon className="h-5 w-5 text-stone-950" />
                        </span>
                        <p className="text-sm font-semibold text-stone-100">{template.label}</p>
                        <p className="mt-0.5 text-xs text-stone-500">{template.hint}</p>
                    </button>
                ))}
            </div>
        </section>
    );
};

export default StartNewSection;
