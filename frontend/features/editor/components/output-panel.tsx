import React from "react";
import { LucideIcon } from "lucide-react";

type OutputTone = "neutral" | "success" | "danger";

interface OutputPanelProps {
    title: string;
    icon: LucideIcon;
    tone?: OutputTone;
    children: React.ReactNode;
}

const toneStyles: Record<OutputTone, { panel: string; icon: string }> = {
    neutral: { panel: "border-stone-100/10 bg-stone-900/40", icon: "text-stone-400" },
    success: { panel: "border-stone-100/10 bg-stone-900/40", icon: "text-emerald-300" },
    danger: { panel: "border-rose-400/30 bg-rose-500/10", icon: "text-rose-300" },
};

/** Shared shell for every panel in the editor's output rail. */
const OutputPanel = ({ title, icon: Icon, tone = "neutral", children }: OutputPanelProps) => {
    const styles = toneStyles[tone];

    return (
        <section className={`rounded-2xl border p-4 ${styles.panel}`}>
            <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-stone-100">
                <Icon className={`h-4 w-4 shrink-0 ${styles.icon}`} />
                {title}
            </h3>
            {children}
        </section>
    );
};

export default OutputPanel;
