"use client"

import { Button } from "@/components/ui/button"
import { FadeIn } from "@/components/animations/fade-in"
import { SITE_CONFIG } from "@/lib/constants"
import { ArrowRight, Play } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-background via-background to-muted/20 py-20 md:py-32">
      {/* Background elements */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5" />
      <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 blur-3xl" />
      <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-gradient-to-tr from-accent/20 to-primary/20 blur-3xl" />
      
      <div className="container mx-auto px-4 relative">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <FadeIn direction="up" delay={0.1}>
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="inline-flex items-center space-x-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium border border-primary/20"
            >
              <span>🚀 Building exceptional software solutions</span>
            </motion.div>
          </FadeIn>

          <FadeIn direction="up" delay={0.2}>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight">
              <span className="gradient-text">Building software</span>
              <br />
              <span className="text-foreground">for every season</span>
            </h1>
          </FadeIn>

          <FadeIn direction="up" delay={0.3}>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              {SITE_CONFIG.mission}
            </p>
          </FadeIn>

          <FadeIn direction="up" delay={0.4}>
            <div className="flex flex-col md:flex-row items-center justify-center space-y-4 md:space-y-0 md:space-x-6">
              <Button size="lg" className="text-base" asChild>
                <Link href="/contact" className="inline-flex items-center space-x-2">
                  <span>Get a Quote</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="secondary" className="text-base" asChild>
                <Link href="/services" className="inline-flex items-center space-x-2">
                  <Play className="h-4 w-4" />
                  <span>View Our Services</span>
                </Link>
              </Button>
            </div>
          </FadeIn>

          <FadeIn direction="up" delay={0.5}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-16">
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold gradient-text">5+</div>
                <div className="text-muted-foreground">Years Experience</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold gradient-text">50+</div>
                <div className="text-muted-foreground">Projects Completed</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold gradient-text">100%</div>
                <div className="text-muted-foreground">Client Satisfaction</div>
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