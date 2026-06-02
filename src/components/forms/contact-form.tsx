"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { SERVICES } from "@/lib/constants"
import { cn } from "@/lib/utils"
import { Send, CheckCircle, AlertCircle } from "lucide-react"

interface ContactFormData {
  name: string
  email: string
  company?: string
  service: string
  message: string
  _hp?: string // honeypot field for spam protection
}

interface ContactFormProps {
  className?: string
}

export function ContactForm({ className }: ContactFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error' | 'rate-limit' | 'spam'>('idle')
  

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<ContactFormData & { _hp?: string }>()

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true)
    setSubmitStatus('idle')

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (response.ok) {
        setSubmitStatus('success')
        reset()
      } else if (response.status === 429) {
        setSubmitStatus('rate-limit')
      } else {
        setSubmitStatus('error')
      }
    } catch {
      setSubmitStatus('error')
    }
    setIsSubmitting(false)
  }

  return (
    <section
      aria-labelledby="contact-intake-title"
      className={cn(
        "relative overflow-hidden rounded-xl border border-[var(--ledger-line)]/45 bg-card/95 shadow-[0_24px_70px_oklch(24%_0.03_260_/_0.12)]",
        className
      )}
    >
      <div className="absolute inset-x-0 top-0 h-1 bg-[var(--field-amber)]" aria-hidden="true" />
      <div className="border-b border-border bg-[var(--paper-warm)] px-5 py-4 md:px-6">
        <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-primary">
          Intake note
        </p>
        <h2 id="contact-intake-title" className="mt-3 font-[family-name:var(--font-ledger)] text-3xl font-semibold leading-tight text-foreground md:text-4xl">
          Tell us about the work.
        </h2>
        <p className="mt-3 max-w-[58ch] text-sm leading-6 text-muted-foreground md:text-base md:leading-7">
          Share the goal, the current constraint, and the practical next step you need help choosing.
        </p>
      </div>

      <div className="p-5 md:p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium">
                Your name *
              </label>
              <Input
                id="name"
                {...register("name", { required: "Name is required" })}
                placeholder="Jane Smith"
                aria-invalid={errors.name ? "true" : "false"}
                aria-describedby={errors.name ? "name-error" : undefined}
                className={errors.name ? "border-destructive" : ""}
              />
              {errors.name && (
                <p id="name-error" className="text-sm text-destructive">{errors.name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                Email *
              </label>
              <Input
                id="email"
                type="email"
                {...register("email", { 
                  required: "Email is required",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Invalid email address"
                  }
                })}
                placeholder="jane@company.com"
                aria-invalid={errors.email ? "true" : "false"}
                aria-describedby={errors.email ? "email-error" : undefined}
                className={errors.email ? "border-destructive" : ""}
              />
              {errors.email && (
                <p id="email-error" className="text-sm text-destructive">{errors.email.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="company" className="text-sm font-medium">
              Company
            </label>
            <Input
              id="company"
              {...register("company")}
              placeholder="Company or organization"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="service" className="text-sm font-medium">
              Service path *
            </label>
            <select
              id="service"
              {...register("service", { required: "Please select a service" })}
              aria-invalid={errors.service ? "true" : "false"}
              aria-describedby={errors.service ? "service-error" : undefined}
              className={cn(
                "h-11 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                errors.service && "border-destructive"
              )}
            >
              <option value="">Choose the closest path</option>
              {SERVICES.map((service) => (
                <option key={service.id} value={service.id}>
                  {service.title}
                </option>
              ))}
              <option value="general">General Inquiry</option>
            </select>
            {errors.service && (
              <p id="service-error" className="text-sm text-destructive">{errors.service.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="message" className="text-sm font-medium">
              Project note *
            </label>
            <Textarea
              id="message"
              {...register("message", { required: "Message is required" })}
              placeholder="What are you trying to build, repair, automate, or decide?"
              rows={7}
              aria-invalid={errors.message ? "true" : "false"}
              aria-describedby={errors.message ? "message-error" : "message-help"}
              className={errors.message ? "border-destructive" : ""}
            />
            <p id="message-help" className="text-xs leading-5 text-muted-foreground">
              Helpful context: goal, timeline, current tools, and what a good outcome would change.
            </p>
            {errors.message && (
              <p id="message-error" className="text-sm text-destructive">{errors.message.message}</p>
            )}
          </div>

          <input
            aria-hidden="true"
            tabIndex={-1}
            autoComplete="off"
            className="sr-only"
            {...register("_hp")}
          />

          {submitStatus === 'success' && (
            <div role="status" className="flex items-start gap-3 rounded-lg border border-success/25 bg-success/10 p-4">
              <CheckCircle className="h-5 w-5 text-success" />
              <p className="text-sm leading-6 text-success">
                Thank you. We will read the note and respond within 24 hours.
              </p>
            </div>
          )}

          {submitStatus === 'error' && (
            <div role="alert" className="flex items-start gap-3 rounded-lg border border-destructive/20 bg-destructive/10 p-4">
              <AlertCircle className="h-5 w-5 text-destructive" />
              <p className="text-sm leading-6 text-destructive">
                Something went wrong. Please try again, or email us directly.
              </p>
            </div>
          )}

          {submitStatus === 'rate-limit' && (
            <div role="alert" className="flex items-start gap-3 rounded-lg border border-destructive/20 bg-destructive/10 p-4">
              <AlertCircle className="h-5 w-5 text-destructive" />
              <p className="text-sm leading-6 text-destructive">
                Too many submissions were sent recently. Please wait a few minutes and try again.
              </p>
            </div>
          )}

          <Button 
            type="submit" 
            className="h-12 w-full"
            disabled={isSubmitting}
            size="lg"
          >
            {isSubmitting ? (
              <>
                <div className="mr-2 h-4 w-4 rounded-full border-2 border-primary-foreground border-t-transparent animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <Send className="mr-2 h-4 w-4" />
                Send project note
              </>
            )}
          </Button>

          <p className="text-center text-sm leading-6 text-muted-foreground">
            Prefer email? Write directly to{" "}
            <a href="mailto:contact@arkbuilderlabs.com" className="font-medium text-primary underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
              contact@arkbuilderlabs.com
            </a>
          </p>
        </form>
      </div>
    </section>
  )
}
