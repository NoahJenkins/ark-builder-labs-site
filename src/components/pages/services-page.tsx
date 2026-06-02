"use client"

import Link from "next/link"
import { FadeIn } from "@/components/animations/fade-in"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { SERVICES } from "@/lib/constants"
import { encodePathSegment } from "@/lib/security"
import {
  ArrowRight,
  Brain,
  CheckCircle2,
  Cloud,
  Code2,
  Compass,
  MessageCircle,
} from "lucide-react"

const iconMap = {
  Code2,
  Cloud,
  Brain,
} as const

const serviceNotes = {
  "web-mobile": {
    line: "Shape the product surface",
    outcome: "Launch-ready web and mobile experiences with a maintainable foundation.",
    plan: ["Interface and workflow planning", "Application buildout", "Testing and handoff"],
    measure: "Product surface",
  },
  "cloud-engineering": {
    line: "Make the system reliable",
    outcome: "Infrastructure, deployment, and operations work that helps software hold up under use.",
    plan: ["Architecture review", "Secure deployment path", "Monitoring and cost visibility"],
    measure: "Operating posture",
  },
  "ai-consulting": {
    line: "Automate with judgment",
    outcome: "AI workflows and agents designed around real business steps, review, and measurement.",
    plan: ["Workflow mapping", "Agent and integration design", "Evaluation and iteration"],
    measure: "Workflow leverage",
  },
} as const

const blueprintRows = [
  "Listen before scope",
  "Document the tradeoffs",
  "Build for handoff",
] as const

const principles = [
  "Clear enough to operate",
  "Secure enough to trust",
  "Flexible enough to steward",
] as const

const measurementMarks = [
  { left: "12%", top: "24%" },
  { left: "28%", top: "70%" },
  { left: "52%", top: "34%" },
  { left: "76%", top: "62%" },
] as const

export function ServicesPageContent() {
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
          {measurementMarks.map((mark, index) => (
            <span
              key={`${mark.left}-${mark.top}`}
              className="about-season-mark"
              style={{
                left: mark.left,
                top: mark.top,
                animationDelay: `${index * 0.8}s`,
              }}
            />
          ))}
        </div>

        <div className="container relative mx-auto px-4 py-16 md:py-24 lg:py-28">
          <div className="grid gap-12 xl:grid-cols-[0.72fr_1.28fr] xl:items-start">
            <FadeIn direction="up" className="max-w-2xl pt-2 lg:pl-20 xl:pl-16">
              <p className="mb-8 text-xs font-semibold uppercase tracking-[0.22em] text-primary">
                Services
              </p>
              <h1 className="max-w-[10ch] font-[family-name:var(--font-ledger)] text-5xl font-semibold leading-[1.04] tracking-normal text-foreground md:text-6xl xl:text-7xl">
                Services built with stewardship
              </h1>
              <div className="mt-7 h-1 w-24 rounded-full bg-[var(--field-amber)]" />
              <p className="mt-7 max-w-xl text-lg leading-8 text-muted-foreground md:text-xl">
                We help teams plan, build, operate, and improve software with clear technical judgment and care that lasts beyond launch.
              </p>

              <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                <Button size="lg" asChild>
                  <Link href="/contact" className="inline-flex items-center gap-2">
                    <MessageCircle className="h-4 w-4" />
                    Start a Conversation
                  </Link>
                </Button>
                <Button size="lg" variant="secondary" asChild>
                  <Link href="#service-paths" className="inline-flex items-center gap-2">
                    Review service paths
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </FadeIn>

            <FadeIn direction="up" delay={0.12}>
              <div className="overflow-hidden rounded-xl border border-border bg-card/90 shadow-sm">
                <div className="grid grid-cols-[120px_1fr_130px] gap-3 border-b border-border px-5 py-3 font-mono text-[11px] uppercase tracking-[0.18em] text-primary max-md:grid-cols-[96px_1fr]">
                  <span>Plan</span>
                  <span>Working Standard</span>
                  <span className="max-md:hidden">Signal</span>
                </div>

                <div className="grid gap-0 lg:grid-cols-[0.95fr_1.05fr]">
                  <div className="border-b border-border p-6 lg:border-b-0 lg:border-r">
                    <p className="mb-4 font-mono text-xs uppercase tracking-[0.16em] text-primary">
                      Technical Blueprint
                    </p>
                    <h2 className="font-[family-name:var(--font-ledger)] text-3xl font-semibold leading-tight text-foreground md:text-4xl">
                      Three service paths, one operating posture.
                    </h2>
                    <p className="mt-5 text-sm leading-7 text-muted-foreground">
                      The services differ by discipline, but each one starts with context, documents the path, and ships with handoff in view.
                    </p>
                  </div>

                  <div className="p-6">
                    <div className="space-y-5">
                      {blueprintRows.map((row, index) => (
                        <p key={row} className="grid gap-3 text-sm leading-7 text-muted-foreground sm:grid-cols-[2.5rem_1fr]">
                          <span className="font-mono text-xs text-primary">
                            {String(index + 1).padStart(2, "0")}
                          </span>
                          <span>{row}</span>
                        </p>
                      ))}
                    </div>

                    <div className="mt-8 rounded-lg border border-[var(--ledger-line)] bg-background p-4">
                      <p className="mb-3 font-mono text-xs uppercase tracking-[0.16em] text-primary">
                        Project measure
                      </p>
                      <ul className="space-y-2">
                        {principles.map((principle) => (
                          <li key={principle} className="flex gap-2 text-sm leading-6 text-muted-foreground">
                            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                            <span>{principle}</span>
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

      <section id="service-paths" className="relative overflow-hidden border-b border-border bg-[var(--deep-navy)] py-12 text-[oklch(95%_0.008_85)] md:py-20 lg:py-24">
        <div className="pointer-events-none absolute inset-x-0 -mt-12 h-px bg-[oklch(95%_0.008_85_/_0.16)]" aria-hidden="true" />
        <div className="container mx-auto px-4">
          <div className="grid gap-8 lg:grid-cols-[minmax(220px,0.74fr)_minmax(0,1.46fr)] lg:items-start">
            <FadeIn direction="up" className="lg:pl-20">
              <p className="mb-4 text-xs font-semibold uppercase tracking-[0.22em] text-[var(--field-amber)]">
                Existing Services
              </p>
              <h2 className="max-w-md font-[family-name:var(--font-ledger)] text-4xl font-semibold leading-tight md:text-[2.75rem]">
                Choose the right service path
              </h2>
              <p className="mt-4 max-w-lg text-base leading-7 text-[oklch(95%_0.008_85_/_0.72)] md:text-lg md:leading-8">
                Each path includes practical planning, direct implementation, and a clear next step for your team.
              </p>
              <div className="mt-8 hidden max-w-sm rounded-lg border border-[oklch(95%_0.008_85_/_0.18)] bg-[oklch(95%_0.008_85_/_0.04)] p-4 lg:block">
                <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-[oklch(95%_0.008_85_/_0.52)]">
                  Service plan format
                </p>
                <div className="mt-4 grid grid-cols-[auto_1fr] gap-x-3 gap-y-3 text-sm text-[oklch(95%_0.008_85_/_0.7)]">
                  <span className="font-mono text-xs text-[var(--field-amber)]">01</span>
                  <span>Define the working surface</span>
                  <span className="font-mono text-xs text-[var(--field-amber)]">02</span>
                  <span>Build the durable path</span>
                  <span className="font-mono text-xs text-[var(--field-amber)]">03</span>
                  <span>Leave the handoff clear</span>
                </div>
              </div>
            </FadeIn>

            <FadeIn direction="up" delay={0.1}>
              <div className="overflow-hidden rounded-xl border border-[oklch(95%_0.008_85_/_0.2)] bg-[oklch(22%_0.04_262)] shadow-[0_24px_70px_oklch(12%_0.03_262_/_0.28)]">
                <div className="hidden border-b border-[oklch(95%_0.008_85_/_0.14)] bg-[oklch(95%_0.008_85_/_0.035)] px-5 py-3 font-mono text-[11px] uppercase tracking-[0.16em] text-[oklch(95%_0.008_85_/_0.54)] lg:grid lg:grid-cols-[84px_1fr_1fr_160px]">
                  <span>Ref</span>
                  <span>Service</span>
                  <span>Plan</span>
                  <span className="text-right">Next</span>
                </div>
                {SERVICES.map((service, index) => {
                  const Icon = iconMap[service.icon as keyof typeof iconMap]
                  const note = serviceNotes[service.id as keyof typeof serviceNotes]

                  return (
                    <article
                      key={service.id}
                      aria-label={`${service.title} service path`}
                      className="group relative grid gap-5 border-b border-[oklch(95%_0.008_85_/_0.14)] p-5 last:border-b-0 sm:p-6 lg:grid-cols-[84px_minmax(220px,0.9fr)_minmax(290px,1.1fr)_150px] lg:items-start"
                    >
                      <div className="flex items-start gap-3 lg:block">
                        <div className="flex h-12 w-12 items-center justify-center rounded-md border border-[oklch(66%_0.105_246_/_0.42)] bg-[oklch(18%_0.035_262)] text-[oklch(66%_0.105_246)] transition-colors duration-200 group-hover:border-[oklch(74%_0.11_85_/_0.7)] group-hover:text-[var(--field-amber)]">
                          <Icon className="h-5 w-5" />
                        </div>
                        <p className="pt-1 font-mono text-xs text-[oklch(66%_0.105_246)] lg:mt-4 lg:pt-0">
                          {String(index + 1).padStart(2, "0")}
                        </p>
                      </div>

                      <div>
                        <p className="mb-2 font-mono text-[11px] uppercase tracking-[0.16em] text-[oklch(95%_0.008_85_/_0.5)]">
                          {note.measure}
                        </p>
                        <h3 className="max-w-[13rem] text-[1.35rem] font-semibold leading-tight text-[oklch(95%_0.008_85)]">
                          {service.title}
                        </h3>
                        <p className="mt-4 max-w-[31ch] text-sm leading-7 text-[oklch(95%_0.008_85_/_0.68)]">
                          {service.description}
                        </p>
                      </div>

                      <div>
                        <h4 className="text-sm font-semibold text-[oklch(95%_0.008_85)]">{note.line}</h4>
                        <p className="mt-2 max-w-[42ch] text-sm leading-6 text-[oklch(95%_0.008_85_/_0.68)]">{note.outcome}</p>

                        <ol className="mt-5 grid gap-2.5 text-sm text-[oklch(95%_0.008_85_/_0.72)]">
                          {note.plan.map((item, planIndex) => (
                            <li key={item} className="grid grid-cols-[1.75rem_1fr] items-start gap-2">
                              <span className="flex h-6 w-6 items-center justify-center rounded-full border border-[oklch(66%_0.105_246_/_0.38)] font-mono text-[10px] text-[oklch(66%_0.105_246)]">
                                {planIndex + 1}
                              </span>
                              <span>{item}</span>
                            </li>
                          ))}
                        </ol>

                        <div className="mt-5 flex flex-wrap gap-2" aria-label={`${service.title} technologies`}>
                          {service.technologies.slice(0, 5).map((tech) => (
                            <Badge
                              key={tech}
                              variant="secondary"
                              className="border border-[oklch(66%_0.105_246_/_0.28)] bg-[oklch(18%_0.035_262)] text-[oklch(95%_0.008_85_/_0.82)]"
                            >
                              {tech}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div className="flex items-start lg:justify-end">
                        <Link
                          href={`/services/${encodePathSegment(service.id)}`}
                          aria-label={`Learn more about ${service.title}`}
                          className="inline-flex min-h-11 w-full items-center justify-between gap-3 rounded-lg border border-[oklch(66%_0.105_246_/_0.42)] px-4 py-3 text-sm font-medium text-[oklch(66%_0.105_246)] transition-colors duration-200 hover:border-[var(--field-amber)] hover:bg-[oklch(95%_0.008_85_/_0.08)] hover:text-[var(--field-amber)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--field-amber)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--deep-navy)] lg:max-w-[150px]"
                        >
                          <span>Open path</span>
                          <ArrowRight className="h-4 w-4 shrink-0" />
                        </Link>
                      </div>
                    </article>
                  )
                })}
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-[var(--deep-navy)] py-16 text-[oklch(95%_0.008_85)] md:py-24">
        <div className="absolute inset-0 about-blueprint-grid opacity-45" />
        <div className="container relative mx-auto px-4">
          <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
            <FadeIn direction="up" className="lg:pl-20">
              <p className="mb-4 text-xs font-semibold uppercase tracking-[0.22em] text-[var(--field-amber)]">
                Next Step
              </p>
              <h2 className="max-w-xl font-[family-name:var(--font-ledger)] text-4xl font-semibold leading-tight md:text-5xl">
                Bring the plan. We will help make it durable.
              </h2>
              <p className="mt-5 max-w-xl text-base leading-7 text-[oklch(95%_0.008_85_/_0.75)] md:text-lg md:leading-8">
                Tell us what you are trying to build, repair, automate, or steward. We will help identify the practical next move.
              </p>
            </FadeIn>

            <FadeIn direction="up" delay={0.1}>
              <div className="rounded-xl border border-[oklch(95%_0.008_85_/_0.22)] bg-[oklch(95%_0.008_85_/_0.06)] p-6">
                <div className="mb-6 flex items-center gap-3 border-b border-[oklch(95%_0.008_85_/_0.18)] pb-5">
                  <Compass className="h-5 w-5 text-[var(--field-amber)]" />
                  <div>
                    <p className="font-semibold">A good service path starts with a real conversation.</p>
                    <p className="text-sm text-[oklch(95%_0.008_85_/_0.68)]">
                      No generic package recommendation before the context is clear.
                    </p>
                  </div>
                </div>

                <div className="flex flex-col gap-4 sm:flex-row">
                  <Button size="lg" variant="secondary" asChild>
                    <Link href="/contact" className="inline-flex items-center gap-2">
                      <MessageCircle className="h-4 w-4" />
                      Request a Quote
                    </Link>
                  </Button>
                  <Button
                    size="lg"
                    variant="ghost"
                    className="border border-[oklch(95%_0.008_85_/_0.5)] text-[oklch(95%_0.008_85)] hover:bg-[oklch(95%_0.008_85)] hover:text-primary"
                    asChild
                  >
                    <Link href="/about" className="inline-flex items-center gap-2">
                      Learn how we work
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>
    </div>
  )
}
