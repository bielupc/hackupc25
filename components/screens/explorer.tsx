'use client';

import React from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

interface ExplorerScreenProps {
  onNext: () => void;
}

export function ExplorerScreen ({ onNext }: ExplorerScreenProps) {
  return (
    <div className="relative w-full h-full bg-gradient-to-t from-[#fef4f0] to-[#fff] text-center flex flex-col justify-between items-center p-6 pt-24 pb-12 overflow-hidden">
      {/* Background Illustration (Mountains or SVG) */}
      <div className="absolute inset-0 z-0">
        <img
          src="/mountain-illustration.svg" // replace with your actual image path
          alt="Mountains"
          className="absolute bottom-0 w-full object-cover pointer-events-none"
        />
      </div>

      {/* Title & Subtitle */}
      <div className="z-10">
        <motion.h1
          className="text-4xl font-bold text-gray-900"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          Explorer<br />the world
        </motion.h1>
        <motion.p
          className="text-sm text-gray-700 mt-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          Let’s start here!
        </motion.p>
      </div>

      {/* Start Button */}
      <motion.button
        onClick={onNext}
        className="z-10 bg-orange-500 rounded-full p-4 text-white shadow-lg hover:bg-orange-600 transition"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.6 }}
      >
        <ArrowRight />
      </motion.button>
    </div>
  );
};
