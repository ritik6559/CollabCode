import React from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

const Cta = () => {
  const router = useRouter();

  return (
    <section className="container mx-auto px-4 py-20">
      <div className="bg-gradient-to-r from-gray-900/50 to-black/50 rounded-2xl border border-gray-500/30 p-12 text-center backdrop-blur-sm">
        <h2 className="text-4xl font-bold text-white mb-6">
          Ready to Start Your Coding Journey?
        </h2>
        <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto">
          Join developers coding together face-to-face, building amazing
          projects through real-time collaboration and video communication.{" "}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            className="bg-gray-700 hover:bg-gray-600 text-white px-8 py-4 text-lg font-semibold shadow-lg shadow-gray-700/25 cursor-pointer"
            onClick={() => router.push("/home")}
          >
            Get Started
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Cta;
