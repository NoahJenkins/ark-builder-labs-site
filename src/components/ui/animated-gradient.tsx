"use client"

import { cn } from "@/lib/utils"

interface AnimatedGradientProps {
  className?: string
  children?: React.ReactNode
}

export function AnimatedGradient({ className, children }: AnimatedGradientProps) {
  return (
    <div 
      className={cn(
        "relative bg-gradient-to-r from-primary via-accent to-primary bg-[length:200%_200%] animate-gradient",
        className
      )}
      style={{ 
        animation: "gradient 8s ease infinite" 
      }}
    >
      {children}
      <style jsx>{`
        @keyframes gradient {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }
      `}</style>
    </div>
  )
}