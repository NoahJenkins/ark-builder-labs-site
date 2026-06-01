"use client"

import { Binoculars, CheckSquare, Leaf, Wrench } from "lucide-react"

const process = [
  {
    icon: Binoculars,
    season: "Discover",
    title: "Listen first",
    description: "Understand the goal, constraints, context, and what success should look like.",
  },
  {
    icon: Wrench,
    season: "Build",
    title: "Craft with care",
    description: "Design and build secure, testable systems that can evolve with the business.",
  },
  {
    icon: CheckSquare,
    season: "Handoff",
    title: "Deliver clearly",
    description: "Ship with documentation, training, and support paths your team can use.",
  },
  {
    icon: Leaf,
    season: "Steward",
    title: "Improve over time",
    description: "Measure what matters, respond to change, and keep the system useful.",
  },
] as const

export function StatsSection() {
  return (
    <section className="relative overflow-hidden bg-[var(--deep-navy)] py-16 text-[oklch(95%_0.008_85)] md:py-24">
      <div className="absolute inset-0 blueprint-grid opacity-45" />
      <div className="absolute bottom-0 right-0 h-40 w-64 rotate-[-8deg] border border-[oklch(95%_0.008_85_/_0.16)] bg-[oklch(95%_0.008_85_/_0.05)] max-md:hidden" />

      <div className="container relative mx-auto px-4">
        <div className="grid gap-10 lg:grid-cols-[0.75fr_1.25fr] lg:items-start">
          <div className="lg:pl-20">
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.22em] text-[var(--field-amber)]">
              Our Process
            </p>
            <h2 className="font-[family-name:var(--font-ledger)] text-4xl font-semibold leading-tight md:text-5xl">
              A steady path, from idea to enduring impact
            </h2>
            <p className="mt-5 max-w-md text-lg leading-8 text-[oklch(95%_0.008_85_/_0.75)]">
              Software for every season means clear steps, honest communication, and long-term care when the weather changes.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-4">
            {process.map((step, index) => (
              <article key={step.season} className="relative">
                {index < process.length - 1 && (
                  <div className="absolute left-[3rem] top-8 hidden h-px w-[calc(100%-2rem)] border-t border-dashed border-[oklch(95%_0.008_85_/_0.35)] md:block" />
                )}
                <div className="relative flex h-16 w-16 items-center justify-center rounded-full border border-[oklch(95%_0.008_85_/_0.7)] bg-[var(--deep-navy)]">
                  <step.icon className="h-7 w-7" />
                </div>
                <p className="mt-5 font-mono text-sm text-[var(--field-amber)]">
                  {String(index + 1).padStart(2, "0")}
                </p>
                <h3 className="mt-2 text-2xl font-semibold">{step.season}</h3>
                <p className="mt-1 font-medium text-[oklch(95%_0.008_85_/_0.9)]">{step.title}</p>
                <p className="mt-3 text-sm leading-6 text-[oklch(95%_0.008_85_/_0.7)]">
                  {step.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        .blueprint-grid {
          background-image:
            linear-gradient(to right, oklch(98% 0.006 85 / 0.08) 1px, transparent 1px),
            linear-gradient(to bottom, oklch(98% 0.006 85 / 0.07) 1px, transparent 1px);
          background-size: 56px 56px;
        }
      `}</style>
    </section>
  )
}
