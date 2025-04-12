"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

type NeonTextProps = {
  children: React.ReactNode
  size?: "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "5xl" | "6xl" | "7xl"
  color?: "cyan" | "magenta" | "gold"
  gradient?: boolean
  pulse?: boolean
  className?: string
}

const sizeClasses = {
  sm: "text-sm",
  md: "text-base",
  lg: "text-lg",
  xl: "text-xl",
  "2xl": "text-2xl",
  "3xl": "text-3xl",
  "4xl": "text-4xl",
  "5xl": "text-5xl",
  "6xl": "text-6xl",
  "7xl": "text-7xl",
}

const colorClasses = {
  cyan: "text-[#00D4FF] drop-shadow-[0_0_5px_rgba(0,212,255,0.5)]",
  magenta: "text-[#FF007A] drop-shadow-[0_0_5px_rgba(255,0,122,0.5)]",
  gold: "text-[#FFD700] drop-shadow-[0_0_5px_rgba(255,215,0,0.5)]",
}

const gradientClasses = {
  cyan: "bg-gradient-to-r from-[#00D4FF] to-[#00FFF0] bg-clip-text text-transparent",
  magenta: "bg-gradient-to-r from-[#FF007A] to-[#FF00D4] bg-clip-text text-transparent",
  gold: "bg-gradient-to-r from-[#FFD700] to-[#FFA500] bg-clip-text text-transparent",
}

export function NeonText({
  children,
  size = "md",
  color = "cyan",
  gradient = false,
  pulse = false,
  className,
}: NeonTextProps) {
  const sizeClass = sizeClasses[size]
  const colorClass = gradient ? gradientClasses[color] : colorClasses[color]
  
  return (
    <motion.span
      className={cn(
        "font-bold",
        sizeClass,
        colorClass,
        pulse && "animate-pulse",
        className
      )}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {children}
    </motion.span>
  )
} 