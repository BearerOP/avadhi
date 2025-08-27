"use client";

import React from "react";
import { motion } from "framer-motion";


export const BgGradient = () => {
  return (
    <div className="h-screenlw-full relative overflow-hidden z-0">

      <motion.div
        className="absolute inset-0 z-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        style={{
          background: "radial-gradient(125% 125% at 50% 10%, #0a0a0a 40%, #14b8a6 100%)",
        }}
      />

    </div>

  );
};


