'use client'

import React from 'react';
import Header from "@/features/landing/components/header";
import { useGetCurrentUser } from '@/features/auth/api/use-get-current-user';
import { redirect } from 'next/navigation';
import { Loader } from 'lucide-react';

interface Props {
    children: React.ReactNode;
}

const Layout = ({ children }: Props) => {
    const { data: user, isLoading } = useGetCurrentUser();

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="flex flex-col items-center space-y-4">
                    <Loader className='animate-spin text-white' />
                </div>
            </div>
        );
    }

    if( user ){
        console.log(user);
        redirect('/home');
    }

    return (
        <div>
            <Header />
            {children}
        </div>
    );
};

export default Layout;