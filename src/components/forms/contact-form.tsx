"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { SERVICES } from "@/lib/constants"
import { Send, CheckCircle, AlertCircle } from "lucide-react"

interface ContactFormData {
  name: string
  email: string
  company?: string
  service: string
  message: string
  _hp?: string // honeypot field for spam protection
}

type ExtendedFormspreePayload = ContactFormData & { [key: string]: string | undefined }

import { FORMSPREE_CONFIG } from "@/lib/constants"
import {
  submitToFormspree,
  canSubmitForm,
  recordSubmission,
  throttleSubmission,
  isHoneypotTripped,
} from "@/lib/formspree"

export function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error' | 'rate-limit' | 'spam'>('idle')
  const [lastSubmit, setLastSubmit] = useState(0)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<ContactFormData & { _hp?: string }>()

  const onSubmit = async (data: ContactFormData & { _hp?: string }) => {
    setIsSubmitting(true)
    setSubmitStatus('idle')

    // Honeypot spam protection
    if (isHoneypotTripped(data as ExtendedFormspreePayload)) {
      setSubmitStatus('spam')
      setIsSubmitting(false)
      return
    }

    // Client-side rate limiting
    if (!canSubmitForm() || !throttleSubmission(lastSubmit)) {
      setSubmitStatus('rate-limit')
      setIsSubmitting(false)
      return
    }

    setLastSubmit(Date.now())
    recordSubmission()

    // Use Formspree if enabled, else fallback to local API
    let result;
    if (FORMSPREE_CONFIG.enabled) {
      result = await submitToFormspree(data as ExtendedFormspreePayload, FORMSPREE_CONFIG.endpoint)
    } else {
      try {
        const response = await fetch('/api/contact', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        })
        if (response.ok) {
          result = { ok: true, message: "Submission successful." }
        } else {
          result = { ok: false, error: "Local API error", status: response.status }
        }
      } catch {
        result = { ok: false, error: "Network error" }
      }
    }

    if (result.ok) {
      setSubmitStatus('success')
      reset()
    } else {
      setSubmitStatus(result.error === "rate-limit" ? "rate-limit" : "error")
    }
    setIsSubmitting(false)
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl text-center">Get in Touch</CardTitle>
        <p className="text-muted-foreground text-center">
          Tell us about your project and we'll get back to you within 24 hours.
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium">
                Name *
              </label>
              <Input
                id="name"
                {...register("name", { required: "Name is required" })}
                placeholder="Your full name"
                className={errors.name ? "border-destructive" : ""}
              />
              {errors.name && (
                <p className="text-sm text-destructive">{errors.name.message}</p>
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
                placeholder="your@email.com"
                className={errors.email ? "border-destructive" : ""}
              />
              {errors.email && (
                <p className="text-sm text-destructive">{errors.email.message}</p>
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
              placeholder="Your company name (optional)"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="service" className="text-sm font-medium">
              Service Interest *
            </label>
            <select
              id="service"
              {...register("service", { required: "Please select a service" })}
              className="w-full h-10 px-3 py-2 text-sm bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
            >
              <option value="">Select a service</option>
              {SERVICES.map((service) => (
                <option key={service.id} value={service.id}>
                  {service.title}
                </option>
              ))}
              <option value="general">General Inquiry</option>
            </select>
            {errors.service && (
              <p className="text-sm text-destructive">{errors.service.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="message" className="text-sm font-medium">
              Message *
            </label>
            <Textarea
              id="message"
              {...register("message", { required: "Message is required" })}
              placeholder="Tell us about your project, timeline, and any specific requirements..."
              rows={6}
              className={errors.message ? "border-destructive" : ""}
            />
            {errors.message && (
              <p className="text-sm text-destructive">{errors.message.message}</p>
            )}
          </div>

          {submitStatus === 'success' && (
            <div className="flex items-center space-x-2 p-4 bg-success/10 border border-success/20 rounded-lg">
              <CheckCircle className="h-5 w-5 text-success" />
              <p className="text-success">Thank you! We'll get back to you within 24 hours.</p>
            </div>
          )}

          {submitStatus === 'error' && (
            <div className="flex items-center space-x-2 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
              <AlertCircle className="h-5 w-5 text-destructive" />
              <p className="text-destructive">Something went wrong. Please try again or email us directly.</p>
            </div>
          )}

          <Button 
            type="submit" 
            className="w-full" 
            disabled={isSubmitting}
            size="lg"
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                Sending...
              </>
            ) : (
              <>
                <Send className="h-4 w-4 mr-2" />
                Send Message
              </>
            )}
          </Button>

          <p className="text-sm text-muted-foreground text-center">
            Or email us directly at{" "}
            <a href="mailto:noah@arkbuilderlabs.com" className="text-primary hover:underline">
              noah@arkbuilderlabs.com
            </a>
          </p>
        </form>
      </CardContent>
    </Card>
  )
}