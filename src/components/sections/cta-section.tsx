"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight, Calendar, CheckCircle2, Mail, MessageCircle } from "lucide-react"
import Link from "next/link"

const outcomes = [
  "Free consultation",
  "Response within 24 hours",
  "Custom plan for your context",
] as const

export function CTASection() {
  return (
    <section className="bg-[var(--paper-warm)] py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="mx-auto grid max-w-6xl gap-8 rounded-xl border border-border bg-card p-6 shadow-sm md:grid-cols-[1.1fr_0.9fr] md:p-10">
          <div>
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.22em] text-primary">
              Ready to build
            </p>
            <h2 className="font-[family-name:var(--font-ledger)] text-4xl font-semibold leading-tight text-foreground md:text-5xl">
              Bring the plan. We will help make it durable.
            </h2>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-muted-foreground">
              Tell us what you are trying to build, repair, automate, or steward. We will help you find the practical next step.
            </p>
            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <Button size="lg" asChild>
                <Link href="/contact" className="inline-flex items-center gap-2">
                  <MessageCircle className="h-4 w-4" />
                  Start a Conversation
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="secondary" asChild>
                <Link href="/contact#calendar" className="inline-flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Schedule a Call
                </Link>
              </Button>
            </div>
          </div>

          <aside className="rounded-lg border border-[var(--ledger-line)] bg-background p-5">
            <div className="mb-5 flex items-center gap-3 border-b border-border pb-4">
              <Mail className="h-5 w-5 text-primary" />
              <div>
                <p className="font-semibold text-foreground">Handoff starts with a conversation</p>
                <p className="text-sm text-muted-foreground">contact@arkbuilderlabs.com</p>
              </div>
            </div>
            <ul className="space-y-3">
              {outcomes.map((outcome) => (
                <li key={outcome} className="flex items-center gap-3 text-sm text-muted-foreground">
                  <CheckCircle2 className="h-4 w-4 text-success" />
                  {outcome}
                </li>
              ))}
            </ul>
            <p className="mt-8 font-[family-name:var(--font-ledger)] text-lg italic leading-7 text-primary">
              Every project starts with listening. Every system ships with clarity.
            </p>
          </aside>
        </div>
      </div>
    </section>
  )
}
