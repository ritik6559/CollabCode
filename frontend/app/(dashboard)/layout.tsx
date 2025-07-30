'use client'

import { useGetCurrentUser } from "@/features/auth/api/use-get-current-user";
import { Loader2 } from "lucide-react";
import { redirect } from "next/navigation";
import { toast } from "sonner";

const Layout = ({ children }: { children: React.ReactNode }) => {
    
    const { data, isLoading } = useGetCurrentUser();

    if( isLoading ){
        return (
            <div className="flex min-h-screen min-w-screen items-center justify-center" >
                <Loader2 className="animate-spin" />
            </div>
        )
    }

    if( !data ){
        toast.error("Not logged in");
        redirect('/sign-in');
        return;
    }

    return (
        <div>
            <main>{children}</main>
        </div>
    );
};

export default Layout;
