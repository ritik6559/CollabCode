"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

const Hero = () => {
  const router = useRouter();

  return (
    <section id="home" className="min-h-screen flex items-center justify-center container mx-auto px-4">
      <div className="grid lg:grid-cols-2 gap-12 items-center w-full">
        <div className="space-y-8">
          <div className="inline-flex items-center space-x-2 bg-gray-900/30 border border-gray-500/30 rounded-full px-4 py-2 backdrop-blur-sm">
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></div>
            <span className="text-gray-300 text-sm font-medium">
              Revolutionizing Collaborative Coding
            </span>
          </div>

          <div className="space-y-6">
            <h1 className="text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight">
              <span className="text-white">Code Together, </span>
              <span className="bg-gradient-to-r from-gray-400 via-white to-gray-600 bg-clip-text text-transparent">
                Build Better
              </span>
            </h1>

            <p className="text-gray-300 text-lg lg:text-xl leading-relaxed max-w-2xl">
              Real-time collaborative coding with integrated video calls. Code
              together face-to-face through WebRTC video while editing the same
              codebase simultaneously. Perfect for remote interviews, pair
              programming, and team debugging.{" "}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              onClick={() => router.push("/home")}
              className="bg-gray-700 hover:bg-gray-600 text-white px-8 py-4 text-lg font-semibold shadow-lg shadow-gray-700/25 transform hover:scale-105 transition-all duration-200 cursor-pointer"
            >
              Start Coding Now
            </Button>
          </div>
        </div>

        {/* Code Editor Mockup */}
        <div className="relative">
          <div className="absolute -inset-4 bg-gradient-to-r from-gray-600 to-gray-800 rounded-2xl blur-2xl opacity-20 animate-pulse"></div>
          <div className="relative bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl border-2 border-gray-500/30 p-6 shadow-2xl backdrop-blur-sm">
            <div className="bg-black rounded-lg p-6 min-h-[350px] relative overflow-hidden">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                </div>
                <div className="text-xs text-gray-500">main.js</div>
              </div>

              <div className="space-y-3 text-sm font-mono">
                <div className="text-gray-400">
                  <span className="text-white">function</span>{" "}
                  <span className="text-yellow-400">twoSum</span>
                  <span className="text-gray-300">(nums, target) {`{`}</span>
                </div>
                <div className="text-gray-500 ml-4">
                  Collaborative coding in action
                </div>
                <div className="text-gray-300 ml-4">
                  <span className="text-white">const</span>{" "}
                  <span className="text-blue-400">map</span> =
                  <span className="text-green-400"> new Map</span>();
                </div>
                <div className="text-gray-300 ml-4">
                  <span className="text-white">for</span> (
                  <span className="text-blue-400">let</span> i =
                  <span className="text-green-400"> 0 </span>;
                  {"i < nums.length; i++) {`{`} "}
                </div>
                <div className="ml-8 text-gray-400">...</div>
                <div className="text-gray-300 ml-4">{"}"}</div>
                <div className="text-gray-300">{"}"}</div>

                {/* Typing indicator */}
                <div className="flex items-center space-x-2 mt-8 p-2 bg-gray-900/20 rounded border border-gray-500/20">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div
                    className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                    style={{ animationDelay: "0.1s" }}
                  ></div>
                  <div
                    className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                    style={{ animationDelay: "0.2s" }}
                  ></div>
                  <span className="text-xs text-gray-300 ml-2">
                    Alex is typing...
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;