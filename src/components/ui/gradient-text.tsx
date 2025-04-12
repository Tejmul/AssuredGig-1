"use client";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface GradientTextProps {
  children: React.ReactNode;
  className?: string;
  gradient?: string;
  animate?: boolean;
  delay?: number;
}

export const GradientText = ({
  children,
  className,
  gradient = "from-purple-500 via-pink-500 to-red-500",
  animate = true,
  delay = 0,
}: GradientTextProps) => {
  return (
    <motion.span
      initial={animate ? { opacity: 0, y: 20 } : false}
      animate={animate ? { opacity: 1, y: 0 } : false}
      transition={{ duration: 0.5, delay }}
      className={cn(
        "bg-clip-text text-transparent bg-gradient-to-r",
        gradient,
        className
      )}
    >
      {children}
    </motion.span>
  );
}; 