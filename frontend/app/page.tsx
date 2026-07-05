"use client"

import React from 'react'
import Header from "@/features/landing/components/header";
import Hero from "@/features/landing/components/hero";
import Features from "@/features/landing/components/features";
import LanguageMarquee from "@/features/landing/components/language-marquee";
import Cta from "@/features/landing/components/CTA";
import Footer from "@/features/landing/components/footer";

const Page = () => {
    return (
        <div className="lp-root relative min-h-screen overflow-x-clip">
            {/* Ambient background */}
            <div className="lp-aurora">
                <span className="b1" />
                <span className="b2" />
                <span className="b3" />
            </div>
            <div className="lp-grid" />

            {/* Content */}
            <div className="relative z-10">
                <Header />
                <Hero />
                <LanguageMarquee />
                <Features />
                <Cta />
                <Footer />
            </div>
        </div>
    )
}

export default Page;
