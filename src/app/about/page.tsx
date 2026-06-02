import type { Metadata } from "next"
import Link from "next/link"
import {
  ArrowRight,
  CheckCircle2,
  ClipboardList,
  Heart,
  Leaf,
  MessageCircle,
  Shield,
  Sparkles,
  Users,
} from "lucide-react"
import { FadeIn } from "@/components/animations/fade-in"
import { Button } from "@/components/ui/button"
import { SITE_CONFIG } from "@/lib/constants"

export const metadata: Metadata = {
  title: "About Us",
  description: "Learn about Ark Builder Labs' mission, values, and approach to building exceptional software solutions.",
}

const values = [
  {
    icon: Heart,
    title: "Honesty & Integrity",
    description: "Clear expectations, plain communication, and ethical decisions before convenient ones.",
    signal: "Trust first",
  },
  {
    icon: Shield,
    title: "Service Excellence",
    description: "Careful implementation, tested handoffs, and quality standards that stay visible.",
    signal: "Built well",
  },
  {
    icon: Users,
    title: "Lasting Relationships",
    description: "Partnerships shaped around long-term business value, not one-time delivery.",
    signal: "Stay useful",
  },
  {
    icon: Sparkles,
    title: "Stewardship",
    description: "Every project is treated as entrusted work, with attention to what comes after launch.",
    signal: "Carry forward",
  },
] as const

const approach = [
  {
    icon: Users,
    phase: "Listen",
    title: "Understand the business",
    description: "We start by learning the goals, constraints, risks, and people behind the work.",
  },
  {
    icon: ClipboardList,
    phase: "Plan",
    title: "Make the path clear",
    description: "We document scope, architecture, priorities, and tradeoffs before the build gets noisy.",
  },
  {
    icon: Shield,
    phase: "Build",
    title: "Ship dependable software",
    description: "We build maintainable systems with security, testing, and operations in view.",
  },
  {
    icon: Leaf,
    phase: "Steward",
    title: "Care for what changes",
    description: "We support, improve, and adapt the solution as your business enters new seasons.",
  },
] as const

const fieldNotes = [
  "Faithful with the work entrusted to us.",
  "Practical about scope, quality, and long-term care.",
  "Focused on software your team can understand and operate.",
] as const

const storyLines = [
  "Ark Builder Labs was founded on the principle of being faithful with the projects we have been given to steward.",
  "Like the Ark, good software is built before the storm arrives: planned with care, assembled with discipline, and ready to protect what matters.",
  "Our work spans web and mobile development, cloud engineering, AI consulting, automation, and ongoing software stewardship.",
] as const

const seasonMarks = [
  { left: "10%", top: "22%" },
  { left: "28%", top: "72%" },
  { left: "48%", top: "28%" },
  { left: "68%", top: "66%" },
  { left: "86%", top: "36%" },
] as const

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      <section className="relative overflow-hidden border-b border-border bg-[var(--paper-warm)]">
        <div className="absolute inset-0 about-ledger-grid opacity-60" />
        <div className="absolute inset-y-0 left-0 hidden w-[72px] border-r border-[var(--ledger-line)]/50 lg:block">
          {Array.from({ length: 10 }).map((_, index) => (
            <div
              key={index}
              className="flex h-16 items-center border-b border-[var(--ledger-line)]/30 pl-8 text-[10px] font-medium text-primary/80"
            >
              {String(index + 1).padStart(2, "0")}
            </div>
          ))}
        </div>

        <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
          {seasonMarks.map((mark, index) => (
            <span
              key={index}
              className="about-season-mark"
              style={{
                left: mark.left,
                top: mark.top,
                animationDelay: `${index * 0.85}s`,
              }}
            />
          ))}
        </div>

        <div className="container relative mx-auto px-4 py-16 md:py-24 lg:py-28">
          <div className="grid gap-12 xl:grid-cols-[0.72fr_1.28fr] xl:items-start">
            <FadeIn direction="up" className="max-w-2xl pt-2 lg:pl-20 xl:pl-16">
              <p className="mb-8 text-xs font-semibold uppercase tracking-[0.22em] text-primary">
                About Ark Builder Labs
              </p>
              <h1 className="max-w-[10ch] font-[family-name:var(--font-ledger)] text-5xl font-semibold leading-[1.04] tracking-normal text-foreground md:text-6xl xl:text-7xl">
                Built with stewardship in mind
              </h1>
              <div className="mt-7 h-1 w-24 rounded-full bg-[var(--field-amber)]" />
              <p className="mt-7 max-w-xl text-lg leading-8 text-muted-foreground md:text-xl">
                We are a practical technology partner for teams that need dependable software, honest guidance, and care that lasts beyond launch.
              </p>

              <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                <Button size="lg" asChild>
                  <Link href="/contact" className="inline-flex items-center gap-2">
                    <MessageCircle className="h-4 w-4" />
                    Start a Conversation
                  </Link>
                </Button>
                <Button size="lg" variant="secondary" asChild>
                  <Link href="/services" className="inline-flex items-center gap-2">
                    View Services
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </FadeIn>

            <FadeIn direction="up" delay={0.12}>
              <div className="overflow-hidden rounded-xl border border-border bg-card/90 shadow-sm">
                <div className="grid grid-cols-[128px_1fr] gap-3 border-b border-border px-5 py-3 font-mono text-[11px] uppercase tracking-[0.18em] text-primary lg:grid-cols-[128px_1fr_128px]">
                  <span>Origin</span>
                  <span>Field Notes</span>
                  <span className="hidden lg:block">Signal</span>
                </div>

                <div className="grid gap-0 lg:grid-cols-[0.95fr_1.05fr]">
                  <div className="border-b border-border p-6 lg:border-b-0 lg:border-r">
                    <p className="mb-4 font-mono text-xs uppercase tracking-[0.16em] text-primary">
                      Steward's Workshop
                    </p>
                    <h2 className="font-[family-name:var(--font-ledger)] text-3xl font-semibold leading-tight text-foreground md:text-4xl">
                      Software for every season means building with care before the weather changes.
                    </h2>
                    <blockquote className="mt-6 max-w-md text-base italic leading-7 text-muted-foreground">
                      "Here I am. Send me."
                      <cite className="mt-2 block font-mono text-[11px] not-italic uppercase tracking-[0.14em] text-primary">
                        Isaiah 6:8
                      </cite>
                    </blockquote>
                  </div>

                  <div className="p-6">
                    <div className="space-y-5">
                      {storyLines.map((line, index) => (
                        <p key={line} className="grid gap-3 text-sm leading-7 text-muted-foreground sm:grid-cols-[2.5rem_1fr]">
                          <span className="font-mono text-xs text-primary">
                            {String(index + 1).padStart(2, "0")}
                          </span>
                          <span>{line}</span>
                        </p>
                      ))}
                    </div>

                    <div className="mt-8 border-t border-[var(--ledger-line)]/70 pt-5">
                      <p className="mb-3 font-mono text-xs uppercase tracking-[0.16em] text-primary">
                        Working posture
                      </p>
                      <ul className="space-y-2">
                        {fieldNotes.map((note) => (
                          <li key={note} className="flex gap-2 text-sm leading-6 text-muted-foreground">
                            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                            <span>{note}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      <section className="border-b border-border bg-background py-12 md:py-20 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="grid gap-8 lg:grid-cols-[0.9fr_1.3fr] lg:items-start">
            <FadeIn direction="up" className="lg:pl-20">
              <p className="mb-4 text-xs font-semibold uppercase tracking-[0.22em] text-primary">
                Our Values
              </p>
              <h2 className="max-w-lg font-[family-name:var(--font-ledger)] text-4xl font-semibold leading-tight text-foreground md:text-5xl">
                Standards for the work
              </h2>
              <p className="mt-4 max-w-lg text-base leading-7 text-muted-foreground md:text-lg md:leading-8">
                They shape how we scope, communicate, build, and support every engagement.
              </p>
            </FadeIn>

            <FadeIn direction="up" delay={0.1}>
              <div className="overflow-hidden rounded-xl border border-border bg-card">
                {values.map((value, index) => (
                  <article
                    key={value.title}
                    className="grid gap-3 border-b border-border p-4 last:border-b-0 md:grid-cols-[64px_220px_1fr_132px] md:items-center md:gap-4 md:p-5"
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-md border border-[var(--ledger-line)] bg-background text-primary">
                      <value.icon className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-mono text-xs text-primary">{String(index + 1).padStart(2, "0")}</p>
                      <h3 className="mt-1 text-lg font-semibold text-foreground">{value.title}</h3>
                    </div>
                    <p className="leading-7 text-muted-foreground">{value.description}</p>
                    <div className="flex items-center gap-2 text-sm font-medium text-success">
                      <CheckCircle2 className="h-4 w-4" />
                      {value.signal}
                    </div>
                  </article>
                ))}
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-[var(--deep-navy)] py-16 text-[oklch(95%_0.008_85)] md:py-24">
        <div className="absolute inset-0 about-blueprint-grid opacity-45" />
        <StewardshipSketch />

        <div className="container relative mx-auto px-4">
          <div className="grid gap-10 lg:grid-cols-[0.74fr_1.26fr] lg:items-start">
            <FadeIn direction="up" className="lg:pl-20">
              <p className="mb-4 text-xs font-semibold uppercase tracking-[0.22em] text-[var(--field-amber)]">
                Our Approach
              </p>
              <h2 className="max-w-[12ch] font-[family-name:var(--font-ledger)] text-[2.15rem] font-semibold leading-[1.08] sm:max-w-none sm:text-4xl md:text-5xl md:leading-tight">
                A clear path from trust to handoff
              </h2>
              <p className="mt-5 max-w-md text-base leading-7 text-[oklch(95%_0.008_85_/_0.75)] md:text-lg md:leading-8">
                We keep the process legible so your team knows what is being built, why it matters, and how it will be cared for.
              </p>
            </FadeIn>

            <div className="grid gap-0 md:grid-cols-4 md:gap-6">
              {approach.map((step, index) => (
                <FadeIn key={step.phase} direction="up" delay={index * 0.08}>
                  <article className="relative grid grid-cols-[3.25rem_1fr] gap-x-4 pb-7 last:pb-0 md:block md:pb-0">
                    {index < approach.length - 1 && (
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
                      <h3 className="mt-1 text-xl font-semibold md:mt-2 md:text-2xl">{step.phase}</h3>
                      <p className="mt-1 font-medium text-[oklch(95%_0.008_85_/_0.9)]">{step.title}</p>
                      <p className="mt-2 text-sm leading-6 text-[oklch(95%_0.008_85_/_0.7)] md:mt-3">
                        {step.description}
                      </p>
                    </div>
                  </article>
                </FadeIn>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-border bg-[var(--paper-warm)] py-16 md:py-24">
        <div className="container mx-auto px-4">
          <FadeIn direction="up" className="mx-auto max-w-5xl">
            <div className="grid gap-8 rounded-xl border border-border bg-card/90 p-6 shadow-sm md:grid-cols-[1fr_auto] md:items-center md:p-8">
              <div>
                <p className="mb-4 text-xs font-semibold uppercase tracking-[0.22em] text-primary">
                  Mission
                </p>
                <h2 className="font-[family-name:var(--font-ledger)] text-3xl font-semibold leading-tight text-foreground md:text-4xl">
                  {SITE_CONFIG.tagline}
                </h2>
                <p className="mt-4 max-w-3xl text-base leading-7 text-muted-foreground md:text-lg md:leading-8">
                  {SITE_CONFIG.mission}
                </p>
              </div>
              <Button size="lg" asChild>
                <Link href="/contact" className="inline-flex items-center gap-2">
                  Talk Through a Project
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </FadeIn>
        </div>
      </section>
    </div>
  )
}

function StewardshipSketch() {
  return (
    <svg
      className="pointer-events-none absolute bottom-8 right-8 hidden h-36 w-72 text-[oklch(95%_0.008_85_/_0.24)] lg:block"
      viewBox="0 0 288 144"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M26 106C54 76 84 69 116 88C148 107 177 106 209 82C231 65 250 62 272 70"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.2"
      />
      <path
        d="M42 116H252M58 92H230M84 68H205M118 44H172"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="0.8"
        opacity="0.38"
      />
      <path
        d="M70 106C70 88 78 74 92 62C106 78 108 95 98 112M214 82C213 70 219 60 229 52C239 65 241 78 234 90"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1"
        opacity="0.72"
      />
      <path
        d="M78 98H112M188 82H232M120 88H164"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="0.9"
        opacity="0.62"
      />
      <circle cx="116" cy="88" r="2.5" fill="currentColor" opacity="0.8" />
      <circle cx="209" cy="82" r="2.5" fill="currentColor" opacity="0.8" />
    </svg>
  )
}
