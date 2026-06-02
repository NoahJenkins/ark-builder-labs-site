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
  Ruler,
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
  },
  "cloud-engineering": {
    line: "Make the system reliable",
    outcome: "Infrastructure, deployment, and operations work that helps software hold up under use.",
    plan: ["Architecture review", "Secure deployment path", "Monitoring and cost visibility"],
  },
  "ai-consulting": {
    line: "Automate with judgment",
    outcome: "AI workflows and agents designed around real business steps, review, and measurement.",
    plan: ["Workflow mapping", "Agent and integration design", "Evaluation and iteration"],
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

      <section id="service-paths" className="border-b border-border bg-background py-12 md:py-20 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="grid gap-8 lg:grid-cols-[0.9fr_1.3fr] lg:items-start">
            <FadeIn direction="up" className="lg:pl-20">
              <p className="mb-4 text-xs font-semibold uppercase tracking-[0.22em] text-primary">
                Existing Services
              </p>
              <h2 className="max-w-md font-[family-name:var(--font-ledger)] text-4xl font-semibold leading-tight text-foreground md:text-[2.75rem]">
                Choose the right service path
              </h2>
              <p className="mt-4 max-w-lg text-base leading-7 text-muted-foreground md:text-lg md:leading-8">
                Each path includes practical planning, direct implementation, and a clear next step for your team.
              </p>
            </FadeIn>

            <FadeIn direction="up" delay={0.1}>
              <div className="overflow-hidden rounded-xl border border-border bg-card">
                {SERVICES.map((service, index) => {
                  const Icon = iconMap[service.icon as keyof typeof iconMap]
                  const note = serviceNotes[service.id as keyof typeof serviceNotes]

                  return (
                    <article
                      key={service.id}
                      aria-label={`${service.title} service path`}
                      className="grid gap-5 border-b border-border p-5 last:border-b-0 md:grid-cols-[64px_1fr] lg:grid-cols-[64px_minmax(210px,0.9fr)_minmax(250px,1.1fr)_176px] lg:items-start"
                    >
                      <div className="flex h-12 w-12 items-center justify-center rounded-md border border-[var(--ledger-line)] bg-background text-primary">
                        <Icon className="h-5 w-5" />
                      </div>

                      <div>
                        <p className="font-mono text-xs text-primary">
                          {String(index + 1).padStart(2, "0")}
                        </p>
                        <h3 className="mt-1 text-xl font-semibold leading-tight text-foreground">
                          {service.title}
                        </h3>
                        <p className="mt-3 text-sm leading-7 text-muted-foreground">
                          {service.description}
                        </p>
                      </div>

                      <div className="md:col-start-2 lg:col-start-auto">
                        <h4 className="text-sm font-semibold text-foreground">{note.line}</h4>
                        <p className="mt-2 text-sm leading-6 text-muted-foreground">{note.outcome}</p>

                        <ul className="mt-4 grid gap-2 text-sm text-muted-foreground sm:grid-cols-3 lg:grid-cols-1">
                          {note.plan.map((item) => (
                            <li key={item} className="flex gap-2">
                              <Ruler className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>

                        <div className="mt-5 flex flex-wrap gap-2">
                          {service.technologies.slice(0, 5).map((tech) => (
                            <Badge key={tech} variant="secondary" className="border border-border bg-background">
                              {tech}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div className="flex items-start md:col-start-2 lg:col-start-auto lg:justify-end">
                        <Link
                          href={`/services/${encodePathSegment(service.id)}`}
                          className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-primary px-4 py-2 text-sm font-medium text-primary transition-colors hover:bg-primary hover:text-primary-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                        >
                          Learn more about {service.title}
                          <ArrowRight className="h-4 w-4" />
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
