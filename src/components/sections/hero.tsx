"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { SERVICES } from "@/lib/constants"
import { encodePathSegment } from "@/lib/security"
import {
  ArrowRight,
  BarChart3,
  Bot,
  Brain,
  CheckCircle2,
  Cloud,
  Code2,
  Cog,
  Database,
  HardDrive,
  Lock,
  MessageCircle,
  Server,
  Smartphone,
  Users,
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
    focus: ["Responsive product surface", "Launch-ready handoff"],
    stamp: "ready to build",
  },
  "cloud-engineering": {
    line: "Run securely. Scale reliably.",
    description: "Cloud infrastructure and DevOps practices that improve performance, security, and resilience.",
    focus: ["Reliable deployment path", "Operational visibility"],
    stamp: "ready to scale",
  },
  "ai-consulting": {
    line: "Automate with purpose.",
    description: "AI-powered workflows and agents that streamline operations and create real business value.",
    focus: ["Human-reviewed automation", "Measurable workflow lift"],
    stamp: "ready to improve",
  },
} as const

const topologyScenes = {
  "web-mobile": {
    paths: [
      "M63 36 H88",
      "M63 101 H88",
      "M148 36 H196",
      "M148 66 V88 H107",
      "M148 66 H196 V98",
      "M121 123 H190",
    ],
    nodes: [
      { label: "Web App", detail: "Next.js", icon: "phone", x: 6, y: 14, width: 58 },
      { label: "Mobile", detail: "Expo", icon: "phone", x: 6, y: 80, width: 58 },
      { label: "API", detail: "Node routes", icon: "server", x: 88, y: 42, width: 62 },
      { label: "Auth", detail: "Sessions", icon: "lock", x: 84, y: 105, width: 72 },
      { label: "Data", detail: "Records", icon: "database", x: 198, y: 14, width: 72 },
      { label: "Files", detail: "CMS", icon: "storage", x: 196, y: 92, width: 80 },
    ],
  },
  "cloud-engineering": {
    paths: [
      "M55 34 H76",
      "M133 34 H160",
      "M218 34 H238",
      "M105 58 V78 H69 V88",
      "M188 58 V78 H224 V88",
      "M188 58 V102 H118",
    ],
    nodes: [
      { label: "Users", detail: "Traffic", icon: "users", x: 8, y: 14, width: 58 },
      { label: "Edge", detail: "WAF", icon: "lock", x: 76, y: 14, width: 58 },
      { label: "Load Balancer", detail: "Routing", icon: "server", x: 144, y: 14, width: 76 },
      { label: "App", detail: "Runtime", icon: "cloud", x: 238, y: 14, width: 62 },
      { label: "Object", detail: "Store", icon: "storage", x: 34, y: 88, width: 76 },
      { label: "CI / CD", detail: "Deploys", icon: "cog", x: 116, y: 104, width: 64 },
      { label: "Monitor", detail: "Logs", icon: "chart", x: 206, y: 88, width: 82 },
    ],
  },
  "ai-consulting": {
    paths: [
      "M78 34 H92",
      "M152 34 H170",
      "M236 34 H240",
      "M122 58 V84 H73 V102",
      "M194 58 V94 H164 V106",
      "M214 58 V86 H255 V102",
    ],
    nodes: [
      { label: "Inputs", detail: "Docs + apps", icon: "database", x: 8, y: 14, width: 70 },
      { label: "Router", detail: "Rules", icon: "server", x: 92, y: 14, width: 60 },
      { label: "AI Agent", detail: "Tools", icon: "bot", x: 170, y: 14, width: 66 },
      { label: "Tasks", detail: "Actions", icon: "cog", x: 240, y: 14, width: 60 },
      { label: "Vector DB", detail: "Memory", icon: "storage", x: 34, y: 102, width: 78 },
      { label: "Review", detail: "Approval", icon: "users", x: 126, y: 106, width: 76 },
      { label: "Telemetry", detail: "Evals + logs", icon: "chart", x: 212, y: 102, width: 86 },
    ],
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
            <h1 className="max-w-[9ch] font-[family-name:var(--font-ledger)] text-5xl font-semibold leading-[1.04] tracking-normal text-foreground md:text-6xl xl:text-7xl">
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

          <div>
            <div id="service-ledger" className="rounded-xl border border-border bg-card/90 shadow-sm">
              <div className="grid grid-cols-[136px_minmax(150px,1fr)_280px_60px] border-b border-border px-6 py-3 font-mono text-[11px] uppercase tracking-[0.18em] text-primary max-lg:hidden">
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
                    className="grid gap-5 border-b border-border p-6 last:border-b-0 lg:min-h-[340px] lg:grid-cols-[136px_minmax(150px,1fr)_280px_60px] lg:items-stretch"
                  >
                    <div className="flex gap-4 lg:flex lg:h-full lg:flex-col">
                      <div>
                        <span className="font-mono text-sm text-primary">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                      </div>
                      <div className="mt-0 flex items-start gap-3 lg:mt-4 lg:block">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-md border border-[var(--ledger-line)] bg-background text-primary lg:mb-3">
                          <Icon className="h-6 w-6" />
                        </div>
                        <h2 className="text-lg font-semibold leading-tight text-foreground md:max-w-[10rem]">
                          {service.title}
                        </h2>
                      </div>
                      <div className="mt-auto hidden border-t border-[var(--ledger-line)]/60 pt-3 font-mono text-[10px] uppercase tracking-[0.14em] text-primary/75 lg:block">
                        Path {String(index + 1).padStart(2, "0")}
                      </div>
                    </div>

                    <div className="flex h-full flex-col">
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

                      <div className="mt-6 border-t border-[var(--ledger-line)]/70 pt-3 lg:mt-auto">
                        <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.14em] text-primary">
                          Stewardship focus
                        </p>
                        <ul className="space-y-1.5 text-xs leading-5 text-muted-foreground">
                          {note.focus.map((item) => (
                            <li key={item} className="flex gap-2">
                              <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-success" />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="flex h-full items-center">
                      <TopologySketch serviceId={service.id as keyof typeof topologyScenes} />
                    </div>

                    <div className="flex lg:justify-center">
                      <Link
                        href={`/services/${encodePathSegment(service.id)}`}
                        className="flex h-[3.25rem] w-[3.25rem] rotate-[-8deg] items-center justify-center rounded-full border border-success/70 text-center font-[family-name:var(--font-ledger)] text-[8px] font-semibold uppercase leading-[0.7rem] text-success transition-transform hover:rotate-0 lg:mt-1"
                      >
                        {note.stamp}
                      </Link>
                    </div>
                  </article>
                )
              })}
            </div>
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

const topologyIconMap = {
  bot: Bot,
  chart: BarChart3,
  cloud: Cloud,
  cog: Cog,
  database: Database,
  lock: Lock,
  phone: Smartphone,
  server: Server,
  storage: HardDrive,
  users: Users,
} as const

function TopologySketch({ serviceId }: { serviceId: keyof typeof topologyScenes }) {
  const scene = topologyScenes[serviceId]

  return (
    <div className="relative min-h-[14.5rem] w-full overflow-hidden rounded-lg border border-[var(--ledger-line)] bg-background/80 p-4 shadow-[inset_0_1px_0_oklch(98%_0.006_85_/_0.45)]">
      <div className="absolute inset-0 topology-grid opacity-70" />
      <svg
        className="absolute inset-4 h-[calc(100%-2rem)] w-[calc(100%-2rem)] text-primary/55"
        viewBox="0 0 300 150"
        fill="none"
        aria-hidden="true"
      >
        <defs>
          <marker
            id={`topology-arrow-${serviceId}`}
            markerHeight="6"
            markerWidth="6"
            orient="auto"
            refX="5"
            refY="3"
          >
            <path d="M0 0L6 3L0 6" fill="currentColor" />
          </marker>
        </defs>
        {scene.paths.map((path) => (
          <path
            key={path}
            d={path}
            stroke="currentColor"
            strokeDasharray={path.includes("V") ? "4 4" : undefined}
            strokeLinecap="round"
            strokeLinejoin="round"
            markerEnd={`url(#topology-arrow-${serviceId})`}
          />
        ))}
      </svg>

      <div className="relative h-[214px] w-full">
        {scene.nodes.map((node) => {
          const Icon = topologyIconMap[node.icon]

          return (
            <div
              key={node.label}
              className="absolute rounded-md border border-[var(--ledger-line)] bg-card/95 p-2 text-center shadow-sm"
              style={{
                left: `${(node.x / 300) * 100}%`,
                top: `${(node.y / 150) * 100}%`,
                width: `${(node.width / 300) * 100}%`,
              }}
            >
              <Icon className="mx-auto h-3.5 w-3.5 text-primary" />
              <span className="mt-1 block text-[10px] font-semibold leading-[0.7rem] text-foreground">
                {node.label}
              </span>
              <span className="mt-0.5 block text-[8px] font-medium leading-[0.6rem] text-muted-foreground">
                {node.detail}
              </span>
            </div>
          )
        })}
      </div>
      <style jsx>{`
        .topology-grid {
          background-image:
            linear-gradient(to right, oklch(62% 0.105 246 / 0.08) 1px, transparent 1px),
            linear-gradient(to bottom, oklch(62% 0.105 246 / 0.06) 1px, transparent 1px);
          background-size: 48px 48px;
        }
      `}</style>
    </div>
  )
}
