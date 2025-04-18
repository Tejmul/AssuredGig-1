"use client";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface AnimatedTextProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  once?: boolean;
  glow?: boolean;
  gradient?: boolean;
  noise?: boolean;
  hover?: boolean;
  variant?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "span";
  size?: "xs" | "sm" | "base" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "5xl" | "6xl";
  weight?: "light" | "normal" | "medium" | "semibold" | "bold";
  align?: "left" | "center" | "right";
  color?: "default" | "primary" | "secondary" | "accent";
  truncate?: boolean;
  lineClamp?: number;
}

export const AnimatedText = ({
  children,
  className,
  delay = 0,
  duration = 0.5,
  once = true,
  glow = false,
  gradient = false,
  noise = false,
  hover = true,
  variant = "p",
  size = "base",
  weight = "normal",
  align = "left",
  color = "default",
  truncate = false,
  lineClamp,
  ...props
}: AnimatedTextProps) => {
  const textVariants = {
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
          scale: 1.05,
          transition: {
            type: "spring",
            damping: 12,
            stiffness: 100,
          },
        }
      : {},
  };

  const variantStyles = {
    h1: "text-4xl font-bold",
    h2: "text-3xl font-bold",
    h3: "text-2xl font-bold",
    h4: "text-xl font-bold",
    h5: "text-lg font-bold",
    h6: "text-base font-bold",
    p: "text-base",
    span: "text-base",
  };

  const sizeStyles = {
    xs: "text-xs",
    sm: "text-sm",
    base: "text-base",
    lg: "text-lg",
    xl: "text-xl",
    "2xl": "text-2xl",
    "3xl": "text-3xl",
    "4xl": "text-4xl",
    "5xl": "text-5xl",
    "6xl": "text-6xl",
  };

  const weightStyles = {
    light: "font-light",
    normal: "font-normal",
    medium: "font-medium",
    semibold: "font-semibold",
    bold: "font-bold",
  };

  const alignStyles = {
    left: "text-left",
    center: "text-center",
    right: "text-right",
  };

  const colorStyles = {
    default: "text-gray-900 dark:text-white",
    primary: "text-purple-600 dark:text-purple-400",
    secondary: "text-pink-600 dark:text-pink-400",
    accent: "text-blue-600 dark:text-blue-400",
  };

  const gradientStyles = gradient
    ? "bg-clip-text text-transparent bg-gradient-to-br from-purple-500 to-pink-500"
    : "";

  const glowStyles = glow
    ? "before:absolute before:inset-0 before:bg-gradient-to-br before:from-purple-500/20 before:to-pink-500/20 before:blur-xl before:opacity-0 before:transition-opacity before:duration-300 hover:before:opacity-100"
    : "";

  const noiseStyles = noise
    ? "before:absolute before:inset-0 before:bg-noise before:opacity-10 before:mix-blend-overlay"
    : "";

  const truncateStyles = truncate ? "truncate" : "";
  const lineClampStyles = lineClamp ? `line-clamp-${lineClamp}` : "";

  const Component = variant;

  return (
    <motion.div
      variants={textVariants}
      initial="hidden"
      whileInView="visible"
      whileHover="hover"
      viewport={{ once }}
      className={cn(
        "relative",
        variantStyles[variant],
        sizeStyles[size],
        weightStyles[weight],
        alignStyles[align],
        colorStyles[color],
        gradientStyles,
        glowStyles,
        noiseStyles,
        truncateStyles,
        lineClampStyles,
        className
      )}
      {...props}
    >
      <Component>{children}</Component>
    </motion.div>
  );
}; 