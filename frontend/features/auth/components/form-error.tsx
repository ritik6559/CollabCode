import React from "react";
import { AlertCircle } from "lucide-react";

interface FormErrorBannerProps {
    message?: string | null;
}

/** Inline form-level error showing the exact message returned by the API. */
const FormErrorBanner = ({ message }: FormErrorBannerProps) => {
    if (!message) {
        return null;
    }

    return (
        <div
            role="alert"
            className="flex items-start gap-2.5 rounded-lg border border-rose-400/30 bg-rose-500/10 px-3.5 py-2.5 text-sm text-rose-200"
        >
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-rose-300" />
            <span>{message}</span>
        </div>
    );
};

export default FormErrorBanner;
