import * as React from "react"
import { cn } from "@/lib/utils"

interface DropdownMenuProps extends React.HTMLAttributes<HTMLDivElement> {
  trigger: React.ReactNode
  align?: "left" | "right"
}

const DropdownMenu = React.forwardRef<HTMLDivElement, DropdownMenuProps>(
  ({ className, children, trigger, align = "right", ...props }, ref) => {
    const [isOpen, setIsOpen] = React.useState(false)

    return (
      <div className="relative" ref={ref} {...props}>
        <div onClick={() => setIsOpen(!isOpen)}>{trigger}</div>
        {isOpen && (
          <>
            <div
              className="fixed inset-0 z-50"
              onClick={() => setIsOpen(false)}
            />
            <div
              className={cn(
                "absolute z-50 mt-2 min-w-[8rem] overflow-hidden rounded-md border border-gray-700 bg-gray-800 p-1 shadow-lg",
                align === "right" ? "right-0" : "left-0",
                className
              )}
            >
              {children}
            </div>
          </>
        )}
      </div>
    )
  }
)
DropdownMenu.displayName = "DropdownMenu"

interface DropdownMenuItemProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon?: React.ReactNode
}

const DropdownMenuItem = React.forwardRef<HTMLButtonElement, DropdownMenuItemProps>(
  ({ className, children, icon, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-sm text-gray-300 outline-none transition-colors hover:bg-gray-700 focus:bg-gray-700",
          className
        )}
        {...props}
      >
        {icon}
        {children}
      </button>
    )
  }
)
DropdownMenuItem.displayName = "DropdownMenuItem"

export { DropdownMenu, DropdownMenuItem } 