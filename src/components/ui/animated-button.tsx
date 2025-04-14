"use client";
import { motion, HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";

interface AnimatedButtonProps extends Omit<HTMLMotionProps<"button">, "children"> {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  once?: boolean;
  glow?: boolean;
  gradient?: boolean;
  noise?: boolean;
  hover?: boolean;
  variant?: "default" | "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "default" | "lg";
  rounded?: "none" | "sm" | "default" | "lg" | "full";
  shadow?: "none" | "sm" | "default" | "lg";
  loading?: boolean;
  disabled?: boolean;
  onClick?: () => void;
}

export const AnimatedButton = ({
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
  rounded = "default",
  shadow = "default",
  loading = false,
  disabled = false,
  onClick,
  ...props
}: AnimatedButtonProps) => {
  const buttonVariants = {
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
    default: "bg-white text-gray-900 dark:bg-gray-800 dark:text-white",
    primary: "bg-purple-600 text-white hover:bg-purple-700",
    secondary: "bg-pink-600 text-white hover:bg-pink-700",
    outline: "border-2 border-purple-600 text-purple-600 hover:bg-purple-600 hover:text-white",
    ghost: "bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800",
  };

  const sizeStyles = {
    sm: "px-3 py-1.5 text-sm",
    default: "px-4 py-2",
    lg: "px-6 py-3 text-lg",
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
    ? "bg-gradient-to-br from-purple-500 to-pink-500"
    : "";

  const glowStyles = glow
    ? "before:absolute before:inset-0 before:bg-gradient-to-br before:from-purple-500/20 before:to-pink-500/20 before:blur-xl before:opacity-0 before:transition-opacity before:duration-300 hover:before:opacity-100"
    : "";

  const noiseStyles = noise
    ? "before:absolute before:inset-0 before:bg-noise before:opacity-10 before:mix-blend-overlay"
    : "";

  return (
    <motion.button
      variants={buttonVariants}
      initial="hidden"
      whileInView="visible"
      whileHover="hover"
      viewport={{ once }}
      className={cn(
        "relative overflow-hidden font-medium transition-colors",
        variantStyles[variant],
        sizeStyles[size],
        roundedStyles[rounded],
        shadowStyles[shadow],
        gradientStyles,
        glowStyles,
        noiseStyles,
        loading && "cursor-wait opacity-70",
        disabled && "cursor-not-allowed opacity-50",
        className
      )}
      onClick={onClick}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <div className="flex items-center justify-center">
          <svg
            className="h-5 w-5 animate-spin text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        </div>
      ) : (
        children
      )}
    </motion.button>
  );
}; 