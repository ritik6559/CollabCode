'use client'

import { useGetCurrentUser } from "@/features/auth/api/use-get-current-user";
import { getApiErrorMessage } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { AlertCircle, Loader2, RefreshCw } from "lucide-react";
import { redirect } from "next/navigation";

const Layout = ({ children }: { children: React.ReactNode }) => {
    const { data: user, isLoading, error, refetch, isRefetching } = useGetCurrentUser();

    if (isLoading) {
        return (
            <div className="lp-root flex min-h-screen items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-amber-400" />
            </div>
        );
    }

    // A real failure (server down, timeout) — not the normal logged-out case
    if (error) {
        return (
            <div className="lp-root flex min-h-screen items-center justify-center p-4">
                <div className="w-full max-w-md space-y-5 rounded-2xl border border-stone-100/10 bg-stone-900/60 p-8 text-center backdrop-blur">
                    <span className="mx-auto grid h-12 w-12 place-items-center rounded-full border border-rose-400/30 bg-rose-500/10">
                        <AlertCircle className="h-6 w-6 text-rose-300" />
                    </span>
                    <div className="space-y-1.5">
                        <h2 className="text-lg font-semibold text-stone-50">
                            Couldn&#39;t verify your session
                        </h2>
                        <p className="text-sm text-stone-400">
                            {getApiErrorMessage(error, "Something went wrong while checking your session.")}
                        </p>
                    </div>
                    <Button
                        onClick={() => refetch()}
                        disabled={isRefetching}
                        className="bg-gradient-to-r from-amber-400 to-orange-500 font-semibold text-stone-950 hover:from-amber-300 hover:to-orange-400"
                    >
                        {isRefetching ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                            <RefreshCw className="mr-2 h-4 w-4" />
                        )}
                        Try again
                    </Button>
                </div>
            </div>
        );
    }

    if (!user) {
        redirect('/sign-in');
    }

    return <main>{children}</main>;
};

export default Layout;
