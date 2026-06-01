"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { SERVICES } from "@/lib/constants"
import { encodePathSegment } from "@/lib/security"
import {
  ArrowRight,
  Bot,
  Brain,
  CheckCircle2,
  Cloud,
  Code2,
  Database,
  Lock,
  MessageCircle,
  Server,
  Smartphone,
} from "lucide-react"
import Link from "next/link"

const iconMap = {
  Code2,
  Cloud,
  Brain,
} as const

const serviceNotes = {
  "web-mobile": {
    line: "Build fast, ship with confidence.",
    description: "Custom web and mobile apps that are maintainable, scalable, and built for your users.",
    sketch: [
      { label: "Web and mobile UI", detail: "Next.js plus React Native" },
      { label: "API boundary", detail: "Node routes, auth, integrations" },
      { label: "Data layer", detail: "Database, storage, reporting" },
    ],
    stamp: "ready to build",
  },
  "cloud-engineering": {
    line: "Run securely. Scale reliably.",
    description: "Cloud infrastructure and DevOps practices that improve performance, security, and resilience.",
    sketch: [
      { label: "Users and traffic", detail: "Requests, sessions, edge rules" },
      { label: "Load balancing", detail: "Routing, scaling, availability" },
      { label: "App services", detail: "Secure runtime and observability" },
    ],
    stamp: "ready to scale",
  },
  "ai-consulting": {
    line: "Automate with purpose.",
    description: "AI-powered workflows and agents that streamline operations and create real business value.",
    sketch: [
      { label: "Data sources", detail: "Docs, systems, customer context" },
      { label: "Agent workflow", detail: "Models, tools, approval gates" },
      { label: "Business actions", detail: "Draft, route, update, report" },
    ],
    stamp: "ready to improve",
  },
} as const

const checklist = [
  "Purpose understood",
  "Scope aligned",
  "Plan documented",
  "Ready to build",
] as const

const fieldLines = [
  "Good software solves today.",
  "Stewardship builds for tomorrow.",
] as const

const seasonMarks = [
  { left: "8%", top: "18%", delay: "0s" },
  { left: "18%", top: "76%", delay: "1.5s" },
  { left: "34%", top: "34%", delay: "2.1s" },
  { left: "53%", top: "68%", delay: "0.8s" },
  { left: "70%", top: "24%", delay: "2.8s" },
  { left: "86%", top: "58%", delay: "1.2s" },
] as const

export function HeroSection() {
  return (
    <section className="relative overflow-hidden border-b border-border bg-[var(--paper-warm)]">
      <div className="absolute inset-0 ledger-grid opacity-60" />
      <div className="absolute inset-y-0 left-0 hidden w-[72px] border-r border-[var(--ledger-line)]/50 md:block">
        {Array.from({ length: 12 }).map((_, index) => (
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
            className="season-mark"
            style={{
              left: mark.left,
              top: mark.top,
              animationDelay: mark.delay,
            }}
          />
        ))}
      </div>

      <div className="container relative mx-auto px-4 py-16 md:py-24 lg:py-28">
        <div className="grid gap-12 xl:grid-cols-[0.62fr_1.38fr] xl:items-start">
          <div className="max-w-xl pt-2 lg:pl-20 xl:pl-16">
            <p className="mb-8 text-xs font-semibold uppercase tracking-[0.22em] text-primary">
              Steward's Workshop
            </p>
            <h1 className="font-[family-name:var(--font-ledger)] text-5xl font-semibold leading-[0.95] tracking-normal text-foreground md:text-6xl xl:text-7xl">
              A practical technology partner for the long road
            </h1>
            <div className="mt-7 h-1 w-24 rounded-full bg-[var(--field-amber)]" />
            <p className="mt-7 max-w-lg text-lg leading-8 text-muted-foreground md:text-xl">
              We build with stewardship in mind: clear plans, maintainable systems, and honest communication that lasts beyond launch.
            </p>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <Button size="lg" asChild>
                <Link href="/contact" className="inline-flex items-center gap-2">
                  <MessageCircle className="h-4 w-4" />
                  Start a Conversation
                </Link>
              </Button>
              <Button size="lg" variant="secondary" asChild>
                <Link href="#service-ledger" className="inline-flex items-center gap-2">
                  Choose a service path
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>

            <div className="mt-10 grid gap-6 sm:grid-cols-2 xl:grid-cols-1">
              <div>
                <p className="mb-3 border-b border-[var(--ledger-line)] pb-2 font-mono text-xs uppercase tracking-[0.16em] text-primary">
                  Field Note
                </p>
                <div className="space-y-1 font-[family-name:var(--font-ledger)] text-base italic leading-6 text-muted-foreground">
                  {fieldLines.map((line) => (
                    <p key={line}>{line}</p>
                  ))}
                </div>
              </div>
              <div>
                <p className="mb-3 border-b border-[var(--ledger-line)] pb-2 font-mono text-xs uppercase tracking-[0.16em] text-primary">
                  Handoff Checklist
                </p>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  {checklist.map((item) => (
                    <li key={item} className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-success" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div id="service-ledger" className="rounded-xl border border-border bg-card/90 shadow-sm">
            <div className="grid grid-cols-[150px_minmax(180px,1fr)_280px_76px] border-b border-border px-5 py-3 font-mono text-[11px] uppercase tracking-[0.18em] text-primary max-lg:hidden">
              <span>Path</span>
              <span>What it solves</span>
              <span>Topology sketch</span>
              <span>Signal</span>
            </div>

            {SERVICES.map((service, index) => {
              const Icon = iconMap[service.icon as keyof typeof iconMap]
              const note = serviceNotes[service.id as keyof typeof serviceNotes]

              return (
                <article
                  key={service.id}
                  className="grid gap-4 border-b border-border p-5 last:border-b-0 lg:grid-cols-[150px_minmax(180px,1fr)_280px_76px]"
                >
                  <div className="flex gap-4 lg:block">
                    <span className="font-mono text-sm text-primary">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <div className="mt-0 flex items-start gap-3 lg:mt-5 lg:block">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-md border border-[var(--ledger-line)] bg-background text-primary lg:mb-3">
                        <Icon className="h-6 w-6" />
                      </div>
                      <h2 className="text-lg font-semibold leading-tight text-foreground md:max-w-[10rem]">
                        {service.title}
                      </h2>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-base font-semibold text-foreground">{note.line}</h3>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">
                      {note.description}
                    </p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {service.technologies.slice(0, 4).map((tech) => (
                        <Badge key={tech} variant="secondary" className="border border-border bg-background">
                          {tech}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-lg border border-[var(--ledger-line)] bg-background/70 p-3">
                    <ol className="space-y-2">
                      {note.sketch.map((step, sketchIndex) => (
                        <li key={step.label}>
                          <div className="grid grid-cols-[2.25rem_1fr] gap-3 rounded-md border border-[var(--ledger-line)] bg-card p-2.5">
                            <div className="flex h-9 w-9 items-center justify-center rounded border border-[var(--ledger-line)] bg-background text-primary">
                              <TopologyIcon serviceId={service.id} index={sketchIndex} />
                            </div>
                            <div className="min-w-0">
                              <p className="text-xs font-semibold leading-4 text-foreground">
                                {step.label}
                              </p>
                              <p className="mt-0.5 text-[11px] leading-4 text-muted-foreground">
                                {step.detail}
                              </p>
                            </div>
                          </div>
                          {sketchIndex < note.sketch.length - 1 && (
                            <div className="flex h-4 items-center pl-[1.1rem] text-primary/60">
                              <ArrowRight className="h-3.5 w-3.5 rotate-90" />
                            </div>
                          )}
                        </li>
                      ))}
                    </ol>
                  </div>

                  <Link
                    href={`/services/${encodePathSegment(service.id)}`}
                    className="flex h-16 w-16 rotate-[-8deg] items-center justify-center rounded-full border border-success/70 text-center font-[family-name:var(--font-ledger)] text-[10px] font-semibold uppercase leading-3 text-success transition-transform hover:rotate-0"
                  >
                    {note.stamp}
                  </Link>
                </article>
              )
            })}
          </div>
        </div>
      </div>

      <style jsx>{`
        .ledger-grid {
          background-image:
            linear-gradient(to right, oklch(62% 0.105 246 / 0.14) 1px, transparent 1px),
            linear-gradient(to bottom, oklch(62% 0.105 246 / 0.1) 1px, transparent 1px);
          background-size: 72px 72px;
        }

        .season-mark {
          position: absolute;
          width: 5px;
          height: 5px;
          border-radius: 999px;
          background: oklch(62% 0.105 246 / 0.45);
          animation: seasonal-drift 7s ease-in-out infinite;
        }

        .season-mark::after {
          content: "";
          position: absolute;
          inset: -6px;
          border: 1px solid oklch(62% 0.105 246 / 0.18);
          border-radius: inherit;
        }

        @keyframes seasonal-drift {
          0%, 100% {
            transform: translate3d(0, 0, 0);
            opacity: 0.2;
          }
          45% {
            transform: translate3d(8px, 18px, 0);
            opacity: 0.65;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .season-mark {
            animation: none;
          }
        }
      `}</style>
    </section>
  )
}

function TopologyIcon({ serviceId, index }: { serviceId: string; index: number }) {
  if (serviceId === "web-mobile") {
    const icons = [Smartphone, Server, Database]
    const Icon = icons[index]
    return <Icon className="mx-auto h-4 w-4" />
  }

  if (serviceId === "cloud-engineering") {
    const icons = [Server, Cloud, Lock]
    const Icon = icons[index]
    return <Icon className="mx-auto h-4 w-4" />
  }

  const icons = [Database, Bot, CheckCircle2]
  const Icon = icons[index]
  return <Icon className="mx-auto h-4 w-4" />
}
