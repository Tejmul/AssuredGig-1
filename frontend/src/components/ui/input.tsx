import * as React from "react"

import { cn } from "@/lib/utils"

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  variant?: 'default' | 'success' | 'error'
  glowColor?: 'cyan' | 'magenta' | 'gold'
  isGlassomorphic?: boolean
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, variant = 'default', glowColor = 'cyan', isGlassomorphic = true, ...props }, ref) => {
    const baseStyles = "flex h-12 w-full rounded-md bg-transparent px-4 py-2 text-sm transition-all duration-300"
    const glassStyles = isGlassomorphic ? "backdrop-blur-sm bg-opacity-5 bg-white" : ""
    const borderStyles = "border border-white/10"
    const focusStyles = "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-offset-1 ring-offset-background"
    
    const variantStyles = {
      default: `${focusStyles} focus-visible:ring-[#00D4FF] focus-visible:border-[#00D4FF] hover:border-[#00D4FF]/50`,
      success: `${focusStyles} focus-visible:ring-[#4CAF50] focus-visible:border-[#4CAF50] hover:border-[#4CAF50]/50`,
      error: `${focusStyles} focus-visible:ring-[#FF007A] focus-visible:border-[#FF007A] hover:border-[#FF007A]/50`
    }

    const glowStyles = {
      cyan: "focus:shadow-[0_0_10px_rgba(0,212,255,0.3)]",
      magenta: "focus:shadow-[0_0_10px_rgba(255,0,122,0.3)]",
      gold: "focus:shadow-[0_0_10px_rgba(255,215,0,0.3)]"
    }

    return (
      <input
        type={type}
        className={cn(
          baseStyles,
          glassStyles,
          borderStyles,
          variantStyles[variant],
          glowStyles[glowColor],
          "placeholder:text-muted-foreground/50",
          "disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input } 