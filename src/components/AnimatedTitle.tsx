"use client";
import { motion } from 'framer-motion';

export function AnimatedTitle() {
  return (
    <motion.h1
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="text-xl sm:text-2xl md:text-3xl font-semibold text-gray-900 flex-1 text-center md:text-left"
    >
      AI Chat Assistant
    </motion.h1>
  );
} 