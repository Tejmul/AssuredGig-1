"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

type GlassCardProps = {
  children: React.ReactNode
  className?: string
  glowColor?: "cyan" | "magenta" | "gold"
  gradient?: boolean
  noise?: boolean
  animated?: boolean
}

const glowColors = {
  cyan: "shadow-[0_0_15px_rgba(0,212,255,0.3)]",
  magenta: "shadow-[0_0_15px_rgba(255,0,122,0.3)]",
  gold: "shadow-[0_0_15px_rgba(255,215,0,0.3)]",
}

const gradientColors = {
  cyan: "bg-gradient-to-br from-[#00D4FF]/10 to-[#00FFF0]/5",
  magenta: "bg-gradient-to-br from-[#FF007A]/10 to-[#FF00D4]/5",
  gold: "bg-gradient-to-br from-[#FFD700]/10 to-[#FFA500]/5",
}

export function GlassCard({
  children,
  className,
  glowColor = "cyan",
  gradient = false,
  noise = false,
  animated = false,
}: GlassCardProps) {
  const glowClass = glowColors[glowColor]
  const gradientClass = gradient ? gradientColors[glowColor] : ""
  const noiseClass = noise ? "bg-[url('/noise.svg')] bg-repeat opacity-5" : ""
  
  const Component = animated ? motion.div : "div"
  
  return (
    <Component
      className={cn(
        "backdrop-blur-md bg-white/5 rounded-xl border border-white/10 p-6",
        glowClass,
        gradientClass,
        noiseClass,
        "transition-all duration-300 hover:bg-white/10",
        className
      )}
      {...(animated && {
        initial: { opacity: 0, y: 20 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true },
        transition: { duration: 0.5 },
      })}
    >
      {children}
    </Component>
  )
} 