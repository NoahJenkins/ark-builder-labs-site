"use client"

import React from "react"

interface StaggerChildrenProps {
  children: React.ReactNode
  className?: string
  staggerDelay?: number
}

export function StaggerChildren({ 
  children, 
  className,
  staggerDelay = 0.1 
}: StaggerChildrenProps) {
  void staggerDelay

  return (
    <div className={className}>
      {React.Children.map(children, (child, index) => (
        <div key={index}>
          {child}
        </div>
      ))}
    </div>
  )
}
