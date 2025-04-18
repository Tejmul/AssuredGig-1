'use client'

import { ReactNode, useEffect, useState } from 'react'

interface AnimatedElementProps {
  children: ReactNode
  delay?: number
  className?: string
}

export function AnimatedElement({ children, delay = 0, className = '' }: AnimatedElementProps) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true)
    }, delay * 100)

    return () => clearTimeout(timer)
  }, [delay])

  return (
    <div
      className={`transition-all duration-500 ease-out ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
      } ${className}`}
    >
      {children}
    </div>
  )
} 