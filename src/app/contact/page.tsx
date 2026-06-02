import type { Metadata } from "next"
import Link from "next/link"
import { FadeIn } from "@/components/animations/fade-in"
import { ContactForm } from "@/components/forms/contact-form"
import { ConsultationCalendar } from "@/components/calendar/consultation-calendar"
import { Button } from "@/components/ui/button"
import { SITE_CONFIG } from "@/lib/constants"
import {
  ArrowRight,
  Calendar,
  CheckCircle2,
  Clock,
  Mail,
  MapPin,
  MessageCircle,
} from "lucide-react"

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Start a practical software conversation with Ark Builder Labs. Share your project, service path, or consultation request.",
}

const contactNotes = [
  {
    icon: Mail,
    label: "Direct email",
    value: SITE_CONFIG.email,
    href: `mailto:${SITE_CONFIG.email}`,
  },
  {
    icon: Clock,
    label: "Typical response",
    value: "Within 24 hours",
    href: undefined,
  },
  {
    icon: MapPin,
    label: "Home base",
    value: "Fort Worth, Texas",
    href: undefined,
  },
] as const

const intakeStandards = [
  "We read for context before recommending a service path.",
  "We will name practical tradeoffs clearly.",
  "We keep the next step direct, useful, and pressure-free.",
] as const

const faqs = [
  {
    question: "How do you handle project pricing?",
    answer: "We quote around the actual scope, risks, timeline, and handoff needs. After the first conversation, we provide a clear proposal with the work, timeline, and price separated plainly.",
  },
  {
    question: "What should I include in the first note?",
    answer: "Send the goal, what exists today, the timeline you are working around, and any constraints you already know. A rough note is enough to begin.",
  },
  {
    question: "Can you work with an existing team?",
    answer: "Yes. We can support in-house teams through planning, implementation, architecture review, automation work, or a focused handoff package.",
  },
  {
    question: "Do you provide ongoing support?",
    answer: "Yes. We offer support and stewardship options for teams that need maintenance, monitoring, iteration, or help planning the next stage after launch.",
  },
] as const

const socialLabels = {
  linkedin: "LinkedIn",
  twitter: "X/Twitter",
  instagram: "Instagram",
  facebook: "Facebook",
} as const

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-background">
      <section
        aria-label="Contact introduction"
        className="relative overflow-hidden border-b border-border bg-[var(--paper-warm)]"
      >
        <div className="absolute inset-0 about-ledger-grid opacity-55" aria-hidden="true" />
        <div className="absolute left-8 top-24 hidden h-3 w-3 rounded-full bg-[var(--field-amber)] shadow-[0_0_0_12px_oklch(74%_0.11_85_/_0.12)] lg:block" aria-hidden="true" />
        <div className="absolute bottom-28 right-[12%] hidden h-2.5 w-2.5 rounded-full bg-primary/45 shadow-[0_0_0_10px_oklch(41%_0.11_262_/_0.1)] md:block" aria-hidden="true" />

        <div className="container relative mx-auto px-4 py-12 md:py-20 lg:py-24">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(420px,1.1fr)] lg:items-start">
            <FadeIn direction="up" className="max-w-2xl pt-2 lg:pl-20">
              <p className="mb-5 text-xs font-semibold uppercase tracking-[0.22em] text-primary md:mb-7">
                Contact
              </p>
              <h1 className="max-w-[11ch] font-[family-name:var(--font-ledger)] text-5xl font-semibold leading-[1.02] tracking-normal text-foreground sm:text-6xl md:text-7xl">
                Tell us what needs stewardship.
              </h1>
              <p className="mt-6 max-w-xl text-base leading-7 text-muted-foreground md:text-xl md:leading-8">
                Bring the goal, the constraint, or the unfinished system. We will help turn it into a practical path for web, mobile, cloud, AI, or ongoing software care.
              </p>

              <div className="mt-8 grid gap-3 sm:max-w-xl">
                {contactNotes.map((note) => (
                  <div key={note.label} className="grid min-h-16 grid-cols-[2.75rem_1fr] items-center gap-3 rounded-lg border border-[var(--ledger-line)]/45 bg-card/70 p-3 shadow-sm">
                    <span className="flex h-10 w-10 items-center justify-center rounded-md bg-primary/10 text-primary" aria-hidden="true">
                      <note.icon className="h-4 w-4" />
                    </span>
                    <span>
                      <span className="block text-xs font-semibold uppercase tracking-[0.14em] text-primary">
                        {note.label}
                      </span>
                      {note.href ? (
                        <a
                          href={note.href}
                          className="mt-1 inline-flex min-h-7 items-center text-sm font-medium text-foreground underline-offset-4 hover:text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                        >
                          {note.value}
                        </a>
                      ) : (
                        <span className="mt-1 block text-sm font-medium text-foreground">
                          {note.value}
                        </span>
                      )}
                    </span>
                  </div>
                ))}
              </div>
            </FadeIn>

            <FadeIn direction="up" delay={0.1}>
              <ContactForm />
            </FadeIn>
          </div>
        </div>
      </section>

      <section
        aria-label="Consultation standard"
        className="relative overflow-hidden border-b border-[oklch(95%_0.008_85_/_0.14)] bg-[var(--deep-navy)] py-12 text-[oklch(95%_0.008_85)] md:py-16"
      >
        <div className="absolute inset-0 about-blueprint-grid opacity-70" aria-hidden="true" />
        <div className="container relative mx-auto px-4">
          <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <FadeIn direction="up" className="lg:pl-20">
              <p className="mb-4 text-xs font-semibold uppercase tracking-[0.22em] text-[var(--field-amber)]">
                Consultation
              </p>
              <h2 className="max-w-xl font-[family-name:var(--font-ledger)] text-4xl font-semibold leading-tight md:text-5xl">
                Prefer to talk through the path?
              </h2>
              <p className="mt-5 max-w-xl text-base leading-7 text-[oklch(95%_0.008_85_/_0.72)] md:text-lg md:leading-8">
                Book a 30-minute consultation if a conversation would make the next step clearer than a written note.
              </p>
              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <Button size="lg" asChild>
                  <Link href="#calendar" className="inline-flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Schedule a Consultation
                  </Link>
                </Button>
                <Button size="lg" variant="secondary" asChild>
                  <a href={`mailto:${SITE_CONFIG.email}`} className="inline-flex items-center gap-2">
                    Email Directly
                    <ArrowRight className="h-4 w-4" />
                  </a>
                </Button>
              </div>
            </FadeIn>

            <FadeIn direction="up" delay={0.1}>
              <div className="rounded-xl border border-[oklch(95%_0.008_85_/_0.18)] bg-[oklch(95%_0.008_85_/_0.045)] p-5 shadow-[0_18px_60px_oklch(12%_0.03_262_/_0.18)] md:p-6">
                <div className="mb-5 flex items-center gap-3 border-b border-[oklch(95%_0.008_85_/_0.12)] pb-5">
                  <MessageCircle className="h-5 w-5 shrink-0 text-[var(--field-amber)]" aria-hidden="true" />
                  <div>
                    <p className="font-semibold text-[oklch(95%_0.008_85)]">What you can expect</p>
                    <p className="text-sm text-[oklch(95%_0.008_85_/_0.62)]">
                      A practical response, not a packaged pitch.
                    </p>
                  </div>
                </div>
                <ul className="grid gap-3">
                  {intakeStandards.map((standard) => (
                    <li key={standard} className="grid grid-cols-[1.75rem_1fr] gap-3 text-sm leading-6 text-[oklch(95%_0.008_85_/_0.75)]">
                      <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[var(--field-amber)]" aria-hidden="true" />
                      <span>{standard}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      <section id="calendar" aria-label="Schedule a consultation" className="border-b border-border bg-background py-12 md:py-20">
        <div className="container mx-auto px-4">
          <div className="grid gap-8 lg:grid-cols-[minmax(220px,0.55fr)_minmax(0,1.45fr)] lg:items-start">
            <FadeIn direction="up" className="lg:pl-20 lg:sticky lg:top-24">
              <p className="mb-4 text-xs font-semibold uppercase tracking-[0.22em] text-primary">
                Calendar
              </p>
              <h2 className="font-[family-name:var(--font-ledger)] text-3xl font-semibold leading-tight text-foreground md:text-4xl">
                Choose a time that gives the work room.
              </h2>
              <p className="mt-4 max-w-md text-sm leading-7 text-muted-foreground md:text-base">
                The calendar is here for projects that are easier to explain aloud. Written notes are just as welcome.
              </p>
            </FadeIn>

            <FadeIn direction="up" delay={0.1}>
              <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
                <div className="grid gap-3 border-b border-border bg-[var(--paper-warm)] p-4 sm:grid-cols-[1fr_auto] sm:items-center md:p-5">
                  <div className="flex items-start gap-3">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary" aria-hidden="true">
                      <Calendar className="h-4 w-4" />
                    </span>
                    <div>
                      <p className="font-semibold text-foreground">30-minute consultation</p>
                      <p className="mt-1 text-sm leading-6 text-muted-foreground">
                        If the scheduler does not load, email us and we will coordinate a time.
                      </p>
                    </div>
                  </div>
                  <a
                    href={`mailto:${SITE_CONFIG.email}`}
                    className="inline-flex min-h-10 items-center justify-center rounded-lg border border-primary px-4 text-sm font-medium text-primary transition-colors hover:bg-primary hover:text-primary-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  >
                    Email to schedule
                  </a>
                </div>
                <ConsultationCalendar />
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      <section aria-label="Contact questions" className="bg-[var(--paper-warm)] py-12 md:py-20">
        <div className="container mx-auto px-4">
          <div className="grid gap-10 lg:grid-cols-[minmax(220px,0.7fr)_minmax(0,1.3fr)]">
            <FadeIn direction="up" className="lg:pl-20">
              <p className="mb-4 text-xs font-semibold uppercase tracking-[0.22em] text-primary">
                Questions
              </p>
              <h2 className="max-w-md font-[family-name:var(--font-ledger)] text-4xl font-semibold leading-tight text-foreground md:text-5xl">
                Useful answers before the first note.
              </h2>
              <div className="mt-7 flex flex-wrap gap-3">
                {Object.entries(SITE_CONFIG.social).map(([platform, url]) => (
                  <a
                    key={platform}
                    href={url}
                    className="inline-flex min-h-11 items-center rounded-lg border border-[var(--ledger-line)]/55 bg-card/75 px-4 text-sm font-medium text-muted-foreground transition-colors hover:border-primary hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  >
                    {socialLabels[platform as keyof typeof socialLabels]}
                  </a>
                ))}
              </div>
            </FadeIn>

            <FadeIn direction="up" delay={0.1}>
              <div className="divide-y divide-border rounded-xl border border-border bg-card/85">
                {faqs.map((faq) => (
                  <article key={faq.question} className="grid gap-3 p-5 md:grid-cols-[0.72fr_1.28fr] md:gap-6 md:p-6">
                    <h3 className="text-lg font-semibold leading-snug text-foreground">
                      {faq.question}
                    </h3>
                    <p className="text-sm leading-7 text-muted-foreground md:text-base md:leading-8">
                      {faq.answer}
                    </p>
                  </article>
                ))}
              </div>
            </FadeIn>
          </div>
        </div>
      </section>
    </main>
  )
}
