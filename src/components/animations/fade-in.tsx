"use client"

interface FadeInProps {
  children: React.ReactNode
  direction?: "up" | "down" | "left" | "right" | "none"
  delay?: number
  duration?: number
  className?: string
}

export function FadeIn({ 
  children, 
  direction = "up", 
  delay = 0, 
  duration = 0.6, 
  className 
}: FadeInProps) {
  void direction
  void delay
  void duration

  return (
    <div className={className}>
      {children}
    </div>
  )
}
