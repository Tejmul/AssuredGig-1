"use client";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface AnimatedCardProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  once?: boolean;
  glow?: boolean;
  gradient?: boolean;
  noise?: boolean;
  hover?: boolean;
  variant?: "default" | "glass" | "solid";
  size?: "sm" | "default" | "lg" | "xl";
  padding?: "none" | "sm" | "default" | "lg";
  rounded?: "none" | "sm" | "default" | "lg" | "full";
  shadow?: "none" | "sm" | "default" | "lg";
  border?: boolean;
  onClick?: () => void;
}

export const AnimatedCard = ({
  children,
  className,
  delay = 0,
  duration = 0.5,
  once = true,
  glow = false,
  gradient = false,
  noise = false,
  hover = true,
  variant = "default",
  size = "default",
  padding = "default",
  rounded = "default",
  shadow = "default",
  border = true,
  onClick,
  ...props
}: AnimatedCardProps) => {
  const cardVariants = {
    hidden: {
      opacity: 0,
      y: 20,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 100,
        duration,
        delay,
      },
    },
    hover: hover
      ? {
          scale: 1.02,
          transition: {
            type: "spring",
            damping: 12,
            stiffness: 100,
          },
        }
      : {},
  };

  const variantStyles = {
    default: "bg-white dark:bg-gray-800",
    glass: "bg-white/10 backdrop-blur-lg dark:bg-gray-800/10",
    solid: "bg-gray-100 dark:bg-gray-900",
  };

  const sizeStyles = {
    sm: "w-64",
    default: "w-full",
    lg: "w-full max-w-4xl",
    xl: "w-full max-w-6xl",
  };

  const paddingStyles = {
    none: "p-0",
    sm: "p-4",
    default: "p-6",
    lg: "p-8",
  };

  const roundedStyles = {
    none: "rounded-none",
    sm: "rounded-sm",
    default: "rounded-lg",
    lg: "rounded-xl",
    full: "rounded-full",
  };

  const shadowStyles = {
    none: "shadow-none",
    sm: "shadow-sm",
    default: "shadow-md",
    lg: "shadow-lg",
  };

  const gradientStyles = gradient
    ? "bg-gradient-to-br from-purple-500/10 to-pink-500/10"
    : "";

  const glowStyles = glow
    ? "before:absolute before:inset-0 before:bg-gradient-to-br before:from-purple-500/20 before:to-pink-500/20 before:blur-xl before:opacity-0 before:transition-opacity before:duration-300 hover:before:opacity-100"
    : "";

  const noiseStyles = noise
    ? "before:absolute before:inset-0 before:bg-noise before:opacity-10 before:mix-blend-overlay"
    : "";

  const borderStyles = border
    ? "border border-gray-200 dark:border-gray-700"
    : "";

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      whileHover="hover"
      viewport={{ once }}
      className={cn(
        "relative overflow-hidden",
        variantStyles[variant],
        sizeStyles[size],
        paddingStyles[padding],
        roundedStyles[rounded],
        shadowStyles[shadow],
        gradientStyles,
        glowStyles,
        noiseStyles,
        borderStyles,
        className
      )}
      onClick={onClick}
      {...props}
    >
      {children}
    </motion.div>
  );
}; 