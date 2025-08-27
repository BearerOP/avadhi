
"use client";
//usage eg:
import React from "react";
import {   BgGradient } from "../../components/bg-gradient";

export default function HomePage() {
  return (
    <div className="h-screen relative overflow-hidden">
      {/* Background Animation */}
      <BgGradient/>

      {/* Foreground Content */}
      <div className="absolute inset-0 z-10 flex items-center justify-center">
        {/* Your components go here */}
        <div className="text-center">
          <p className="text-4xl font-bold text-white">Your Components Go Here</p>
          <p className="text-lg text-gray-300 mt-2">
            Replace this with any UI elements, cards, forms, etc.
          </p>
        </div>
      </div>
    </div>
  );
}