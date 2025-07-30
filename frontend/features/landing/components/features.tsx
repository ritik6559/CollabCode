import React from 'react';
import {Clock, Target, Users, Video} from "lucide-react";

const Features = () => {
    return (
        <section id="features" className="container mx-auto px-4 py-20">
            <div className="text-center mb-16">
                <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
                    Why Choose <span className="bg-gradient-to-r from-gray-400 to-white bg-clip-text text-transparent">CollabCode</span>?
                </h2>
                <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                    Experience the future of collaborative coding with our comprehensive platform designed for modern developers.
                </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
                {[
                    {
                        icon: Users,
                        title: "Real-time Collaboration",
                        description: "Code together with peers in real-time, share ideas, and learn from each other in an interactive environment with live cursors and instant synchronization."
                    },
                    {
                        icon: Video,
                        title: "Integrated Video Calls",
                        description: "Connect face-to-face with your coding partners through seamless WebRTC video calls. See and communicate with your team while working on the same codebase."
                    },
                    {
                        icon: Target,
                        title: "Interactive Learning",
                        description: "Practice algorithms and data structures with guided tutorials, instant feedback, and comprehensive explanations that adapt to your learning pace."
                    },
                    {
                        icon: Clock,
                        title: "Time-based Challenges",
                        description: "Test your skills with timed coding challenges, compete with other developers, and track your progress with detailed analytics and leaderboards."
                    }
                ].map((feature, index) => (
                    <div key={index} className="group bg-gray-800/30 backdrop-blur-sm border border-gray-700/50 rounded-xl p-8 hover:border-gray-500/40 hover:bg-gray-800/50 transition-all duration-300 hover:scale-105">
                        <div className="w-12 h-12 bg-gradient-to-r from-gray-600/20 to-gray-800/20 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                            <feature.icon className="h-6 w-6 text-gray-400" />
                        </div>
                        <h3 className="text-xl font-semibold text-white mb-4 group-hover:text-gray-100 transition-colors">
                            {feature.title}
                        </h3>
                        <p className="text-gray-400 group-hover:text-gray-300 transition-colors leading-relaxed">
                            {feature.description}
                        </p>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default Features;