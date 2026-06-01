"use client"

import { FadeIn } from "@/components/animations/fade-in"
import { StaggerChildren } from "@/components/animations/stagger-children"
import { Award, Target, Cloud, Lock } from "lucide-react"

const stats = [
  {
    icon: Award,
    value: "Practical scoping",
    label: "Start with the business need",
    description: "We define the useful outcome before choosing the stack."
  },
  {
    icon: Lock,
    value: "Security from start",
    label: "Built into the plan",
    description: "We design with security, reliability, and ownership in view."
  },
  {
    icon: Cloud,
    value: "Cloud-fit choices",
    label: "Azure, AWS, Vercel, and more",
    description: "We match hosting and automation to the project, not to a favorite vendor."
  },
  {
    icon: Target,
    value: "Clear handoff",
    label: "Ready for the next season",
    description: "Documentation and maintenance options keep the work usable after launch."
  }
]

export function StatsSection() {
  return (
    <section className="py-20 md:py-32 bg-gradient-to-br from-primary to-accent text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-black/10" />
      <div className="absolute top-0 left-0 w-full h-full opacity-10">
        <div className="absolute top-10 left-10 w-20 h-20 rounded-full border border-white/20" />
        <div className="absolute bottom-10 right-10 w-32 h-32 rounded-full border border-white/20" />
        <div className="absolute top-1/3 right-1/4 w-16 h-16 rounded-full border border-white/20" />
      </div>
      
      <div className="container mx-auto px-4 relative">
        <div className="max-w-6xl mx-auto">
          <FadeIn direction="up" className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              How Ark Builder Labs Works
            </h2>
            <p className="text-lg text-white/80 max-w-2xl mx-auto">
              We bring a steward's mindset to planning, delivery, and long-term support.
            </p>
          </FadeIn>

          <StaggerChildren className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="text-center group"
              >
                <div className="w-16 h-16 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center mx-auto mb-4 group-hover:bg-white/20 transition-colors duration-300">
                  <stat.icon className="h-8 w-8 text-white" />
                </div>
                <div className="text-2xl md:text-3xl font-bold mb-2">{stat.value}</div>
                <div className="text-lg font-semibold mb-2 text-white/90">{stat.label}</div>
                <div className="text-sm text-white/70">{stat.description}</div>
              </div>
            ))}
          </StaggerChildren>
        </div>
      </div>
    </section>
  )
}
