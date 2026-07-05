import React from 'react';
import { FileCode2, Plus, SearchX } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmptyCardProps {
    variant?: "no-rooms" | "no-results";
    searchTerm?: string;
    onCreate?: () => void;
}

const EmptyCard = ({ variant = "no-rooms", searchTerm, onCreate }: EmptyCardProps) => {
    if (variant === "no-results") {
        return (
            <div className="flex flex-col items-center justify-center py-24 text-center">
                <div className="mb-4 grid h-16 w-16 place-items-center rounded-full border border-stone-100/10 bg-stone-900/60">
                    <SearchX className="h-8 w-8 text-stone-500" />
                </div>
                <h3 className="mb-1 text-lg font-semibold text-stone-200">No rooms found</h3>
                <p className="text-sm text-stone-500">
                    Nothing matches “{searchTerm}”. Try a different search.
                </p>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="mb-4 grid h-16 w-16 place-items-center rounded-full border border-amber-400/20 bg-amber-400/10">
                <FileCode2 className="h-8 w-8 text-amber-300" />
            </div>
            <h3 className="mb-1 text-lg font-semibold text-stone-200">No rooms yet</h3>
            <p className="mb-6 text-sm text-stone-500">
                Create your first room and invite a teammate to code together.
            </p>
            {onCreate && (
                <Button
                    onClick={onCreate}
                    className="bg-gradient-to-r from-amber-400 to-orange-500 font-semibold text-stone-950 shadow-lg shadow-orange-500/25 hover:from-amber-300 hover:to-orange-400"
                >
                    <Plus className="mr-1 h-4 w-4" />
                    Create a room
                </Button>
            )}
        </div>
    );
};

export default EmptyCard;
