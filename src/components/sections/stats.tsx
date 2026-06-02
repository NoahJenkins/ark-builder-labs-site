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
    <section className="relative overflow-hidden bg-[var(--deep-navy)] py-14 text-[oklch(95%_0.008_85)] md:py-24">
      <div className="absolute inset-0 blueprint-grid opacity-45" />
      <ProcessFieldSketch />

      <div className="container relative mx-auto px-4">
        <div className="grid gap-9 lg:grid-cols-[0.75fr_1.25fr] lg:items-start">
          <div className="lg:pl-20">
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.22em] text-[var(--field-amber)]">
              Our Process
            </p>
            <h2 className="max-w-[12ch] font-[family-name:var(--font-ledger)] text-[2.15rem] font-semibold leading-[1.08] sm:max-w-none sm:text-4xl md:text-5xl md:leading-tight">
              A steady path, from idea to enduring impact
            </h2>
            <p className="mt-5 max-w-md text-base leading-7 text-[oklch(95%_0.008_85_/_0.75)] md:text-lg md:leading-8">
              Software for every season means clear steps, honest communication, and long-term care when the weather changes.
            </p>
          </div>

          <div className="grid gap-0 md:grid-cols-4 md:gap-6">
            {process.map((step, index) => (
              <article
                key={step.season}
                className="relative grid grid-cols-[3.25rem_1fr] gap-x-4 pb-7 last:pb-0 md:block md:pb-0"
              >
                {index < process.length - 1 && (
                  <>
                    <div className="absolute left-6 top-12 h-[calc(100%-2.5rem)] border-l border-dashed border-[oklch(95%_0.008_85_/_0.32)] md:hidden" />
                    <div className="absolute left-[3rem] top-8 hidden h-px w-[calc(100%-2rem)] border-t border-dashed border-[oklch(95%_0.008_85_/_0.35)] md:block" />
                  </>
                )}
                <div className="relative z-10 flex h-12 w-12 items-center justify-center rounded-full border border-[oklch(95%_0.008_85_/_0.7)] bg-[var(--deep-navy)] md:h-16 md:w-16">
                  <step.icon className="h-5 w-5 md:h-7 md:w-7" />
                </div>
                <div className="pt-0.5 md:pt-0">
                  <p className="font-mono text-xs text-[var(--field-amber)] md:mt-5 md:text-sm">
                    {String(index + 1).padStart(2, "0")}
                  </p>
                  <h3 className="mt-1 text-xl font-semibold md:mt-2 md:text-2xl">{step.season}</h3>
                  <p className="mt-1 font-medium text-[oklch(95%_0.008_85_/_0.9)]">{step.title}</p>
                  <p className="mt-2 text-sm leading-6 text-[oklch(95%_0.008_85_/_0.7)] md:mt-3">
                    {step.description}
                  </p>
                </div>
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

function ProcessFieldSketch() {
  return (
    <svg
      className="pointer-events-none absolute bottom-8 right-8 hidden h-36 w-72 text-[oklch(95%_0.008_85_/_0.24)] lg:block"
      viewBox="0 0 288 144"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M18 108C56 76 89 72 118 92C147 112 174 113 207 88C227 73 247 68 270 75"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.2"
      />
      <path
        d="M38 112H254M58 88H225M86 64H201M118 40H170"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="0.8"
        opacity="0.38"
      />
      <path
        d="M72 106C70 90 75 76 88 63C102 79 104 94 95 112M213 87C212 75 216 65 225 56C235 68 237 79 231 91"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1"
        opacity="0.72"
      />
      <path
        d="M50 118C91 127 143 128 197 120"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1"
        opacity="0.58"
      />
      <circle cx="118" cy="92" r="2.5" fill="currentColor" opacity="0.8" />
      <circle cx="207" cy="88" r="2.5" fill="currentColor" opacity="0.8" />
    </svg>
  )
}
