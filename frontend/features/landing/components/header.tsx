"use client";

import React, { useState } from "react";
import { Code, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const router = useRouter();

    return (
        <header className="border-b border-gray-800/50 backdrop-blur-sm sticky top-0 z-50">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between cursor-pointer">
                <div
                    className="flex items-center space-x-2"
                    onClick={() => {
                        router.push("/");
                    }}
                >
                    <div className="p-2 bg-gray-600/20 rounded-lg">
                        <Code className="h-6 w-6 text-gray-400" />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-white">CollabCode</h1>
                        <p className="text-xs text-gray-400 -mt-1 hidden sm:block">
                            {"<Code /> Together"}
                        </p>
                    </div>
                </div>
                <div className="hidden md:flex items-center space-x-4">
                    <Button
                        variant="ghost"
                        className="text-gray-300 hover:text-white hover:bg-gray-800 cursor-pointer"
                        onClick={() => router.push("/sign-in")}
                    >
                        Sign in
                    </Button>
                    <Button
                        className="bg-gray-700 hover:bg-gray-600 text-white shadow-lg shadow-gray-700/25 cursor-pointer"
                        onClick={() => router.push("/sign-up")}
                    >
                        Sign up
                    </Button>
                </div>
                
                <Button
                    variant="ghost"
                    size="icon"
                    className="md:hidden text-gray-300 hover:text-white"
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                    {isMenuOpen ? (
                        <X className="h-6 w-6" />
                    ) : (
                        <Menu className="h-6 w-6" />
                    )}
                </Button>
            </div>

            {/* Mobile menu */}
            {isMenuOpen && (
                <div className="md:hidden bg-gray-900/95 backdrop-blur-sm border-t border-gray-800/50">
                    <nav className="container mx-auto px-4 py-4 space-y-4">
                        <div className="flex flex-col space-y-2 pt-4 border-t border-gray-800">
                            <Button
                                variant="ghost"
                                className="text-gray-300 hover:text-white justify-start"
                            >
                                Sign in
                            </Button>
                            <Button className="bg-gray-700 hover:bg-gray-600 text-white">
                                Sign up
                            </Button>
                        </div>
                    </nav>
                </div>
            )}
        </header>
    );
};

export default Header;
