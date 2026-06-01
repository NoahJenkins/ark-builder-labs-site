"use client"

import { ShieldCheck, ClipboardList, Users, Leaf, CheckCircle2 } from "lucide-react"

const standards = [
  {
    icon: ShieldCheck,
    title: "Security by design",
    description: "We build with security in mind from day one.",
  },
  {
    icon: ClipboardList,
    title: "Clear processes",
    description: "Documented plans, decisions, and next steps.",
  },
  {
    icon: Users,
    title: "Honest communication",
    description: "Straight talk, timely updates, zero surprises.",
  },
  {
    icon: Leaf,
    title: "Long-term thinking",
    description: "Maintainable systems that grow with you.",
  },
] as const

export function ServicesOverview() {
  return (
    <section className="border-b border-border bg-background py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
          <div className="lg:pl-20">
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.22em] text-primary">
              Our Operating Standards
            </p>
            <h2 className="font-[family-name:var(--font-ledger)] text-4xl font-semibold leading-tight text-foreground md:text-5xl">
              Stewardship is how we build
            </h2>
            <p className="mt-5 max-w-md text-lg leading-8 text-muted-foreground">
              Every engagement starts with listening and ends with a system your team can understand, operate, and improve.
            </p>
          </div>

          <div className="overflow-hidden rounded-xl border border-border bg-card">
            {standards.map((standard) => (
              <article
                key={standard.title}
                className="grid gap-4 border-b border-border p-5 last:border-b-0 md:grid-cols-[64px_220px_1fr_140px] md:items-center"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-md border border-[var(--ledger-line)] bg-background text-primary">
                  <standard.icon className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-semibold text-foreground">{standard.title}</h3>
                <p className="leading-7 text-muted-foreground">{standard.description}</p>
                <div className="flex items-center gap-2 text-sm font-medium text-success">
                  <CheckCircle2 className="h-4 w-4" />
                  Standard
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
