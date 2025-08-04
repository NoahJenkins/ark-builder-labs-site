"use client"

import { Button } from "@/components/ui/button"
import { FadeIn } from "@/components/animations/fade-in"
import { ArrowRight, MessageCircle, Calendar } from "lucide-react"
import Link from "next/link"

export function CTASection() {
  return (
    <section className="py-20 md:py-32 relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-accent/5 to-primary/5" />
      <div className="absolute inset-0 bg-grid-pattern opacity-5" />
      
      <div className="container mx-auto px-4 relative">
        <div className="max-w-4xl mx-auto text-center">
          <FadeIn direction="up">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              Ready to Build Your Next <span className="gradient-text">Project</span>?
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Let's discuss how we can help transform your ideas into powerful, scalable solutions 
              that drive your business forward.
            </p>
          </FadeIn>

          <FadeIn direction="up" delay={0.2}>
            <div className="flex flex-col md:flex-row items-center justify-center space-y-4 md:space-y-0 md:space-x-6">
              <Button size="lg" className="text-base min-w-[200px]" asChild>
                <Link href="/contact" className="inline-flex items-center space-x-2">
                  <MessageCircle className="h-4 w-4" />
                  <span>Start a Conversation</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="secondary" className="text-base min-w-[200px]" asChild>
                <Link href="/contact#calendar" className="inline-flex items-center space-x-2">
                  <Calendar className="h-4 w-4" />
                  <span>Schedule a Call</span>
                </Link>
              </Button>
            </div>
          </FadeIn>

          <FadeIn direction="up" delay={0.3}>
            <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <div className="space-y-2">
                <div className="w-12 h-12 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-4">
                  <div className="w-6 h-6 rounded-full bg-success" />
                </div>
                <h3 className="font-semibold">Free Consultation</h3>
                <p className="text-sm text-muted-foreground">
                  No-obligation discussion about your project needs
                </p>
              </div>
              <div className="space-y-2">
                <div className="w-12 h-12 rounded-full bg-warning/10 flex items-center justify-center mx-auto mb-4">
                  <div className="w-6 h-6 rounded-full bg-warning" />
                </div>
                <h3 className="font-semibold">Quick Response</h3>
                <p className="text-sm text-muted-foreground">
                  We'll get back to you within 24 hours
                </p>
              </div>
              <div className="space-y-2">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <div className="w-6 h-6 rounded-full bg-primary" />
                </div>
                <h3 className="font-semibold">Custom Solutions</h3>
                <p className="text-sm text-muted-foreground">
                  Tailored approach for your unique requirements
                </p>
              </div>
            </div>
          </FadeIn>
        </div>
      </div>

      <style jsx>{`
        .bg-grid-pattern {
          background-image: radial-gradient(circle at 1px 1px, rgb(156 163 175 / 0.15) 1px, transparent 0);
          background-size: 20px 20px;
        }
      `}</style>
    </section>
  )
}