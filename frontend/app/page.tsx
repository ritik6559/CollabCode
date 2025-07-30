"use client"

import React from 'react'
import Header from "@/features/landing/components/header";
import Hero from "@/features/landing/components/hero";
import Features from "@/features/landing/components/features";
import Cta from "@/features/landing/components/CTA";

const page = () => {

    return (
        <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black">
            {/*<Header />*/}
            <Header />

            {/* Hero Section */}
            <Hero />

            {/* Features Section */}
            <Features />

            {/* CTA Section */}
            <Cta />
        </div>
    )
}

export default page;
