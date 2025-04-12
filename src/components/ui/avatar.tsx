import * as React from "react"
import { cn } from "@/lib/utils"

const Avatar = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    src?: string
    alt?: string
    size?: "sm" | "md" | "lg"
  }
>(({ className, src, alt, size = "md", ...props }, ref) => {
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-10 h-10",
    lg: "w-12 h-12",
  }

  return (
    <div
      ref={ref}
      className={cn(
        "relative flex shrink-0 overflow-hidden rounded-full",
        sizeClasses[size],
        className
      )}
      {...props}
    >
      {src ? (
        <img
          src={src}
          alt={alt || ""}
          className="aspect-square h-full w-full object-cover"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center bg-gray-800">
          <span className="text-lg font-medium text-gray-400">
            {alt?.[0]?.toUpperCase() || "?"}
          </span>
        </div>
      )}
    </div>
  )
})
Avatar.displayName = "Avatar"

export { Avatar } 