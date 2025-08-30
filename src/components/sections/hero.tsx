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
      
      {/* Dynamic Swiping Animation Background */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Primary Sweep */}
        <div className="absolute w-full h-full animate-sweep-primary">
          <div className="absolute top-0 -left-1/4 w-1/2 h-full bg-gradient-to-r from-transparent via-primary/10 to-transparent transform -skew-x-12" />
        </div>
        
        {/* Secondary Sweep */}
        <div className="absolute w-full h-full animate-sweep-secondary">
          <div className="absolute top-0 -right-1/4 w-1/2 h-full bg-gradient-to-r from-transparent via-accent/8 to-transparent transform skew-x-12" />
        </div>
        
        {/* Tertiary Sweep */}
        <div className="absolute w-full h-full animate-sweep-tertiary">
          <div className="absolute top-0 -left-1/3 w-2/3 h-full bg-gradient-to-r from-transparent via-primary/6 to-transparent transform -skew-x-6" />
        </div>
        
        {/* Floating Particles */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-2 h-2 rounded-full bg-primary/20 animate-float-1" />
          <div className="absolute top-3/4 right-1/3 w-1 h-1 rounded-full bg-accent/30 animate-float-2" />
          <div className="absolute top-1/2 left-2/3 w-1.5 h-1.5 rounded-full bg-primary/15 animate-float-3" />
          <div className="absolute top-1/3 right-1/4 w-1 h-1 rounded-full bg-accent/25 animate-float-4" />
        </div>
      </div>
      
      <div className="container mx-auto px-4 relative">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <FadeIn direction="up" delay={0.1}>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight">
              <span className="gradient-text">Building Software</span>
              <br />
              <span className="text-foreground">for Every Season</span>
            </h1>
          </FadeIn>

          <FadeIn direction="up" delay={0.2}>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              {SITE_CONFIG.mission}
            </p>
          </FadeIn>

          <FadeIn direction="up" delay={0.3}>
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

          <FadeIn direction="up" delay={0.4}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-16">
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold gradient-text">3+</div>
                <div className="text-muted-foreground">Years Experience</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold gradient-text">100+</div>
                <div className="text-muted-foreground">Projects Created</div>
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
        
        /* Swiping Animation Keyframes */
        @keyframes sweep-primary {
          0% {
            transform: translateX(-150%) rotate(15deg);
            opacity: 0;
          }
          20% {
            opacity: 1;
          }
          80% {
            opacity: 1;
          }
          100% {
            transform: translateX(150%) rotate(15deg);
            opacity: 0;
          }
        }
        
        @keyframes sweep-secondary {
          0% {
            transform: translateX(150%) rotate(-15deg);
            opacity: 0;
          }
          25% {
            opacity: 1;
          }
          75% {
            opacity: 1;
          }
          100% {
            transform: translateX(-150%) rotate(-15deg);
            opacity: 0;
          }
        }
        
        @keyframes sweep-tertiary {
          0% {
            transform: translateX(-180%) rotate(8deg);
            opacity: 0;
          }
          30% {
            opacity: 0.8;
          }
          70% {
            opacity: 0.8;
          }
          100% {
            transform: translateX(180%) rotate(8deg);
            opacity: 0;
          }
        }
        
        /* Floating Particle Animations */
        @keyframes float-1 {
          0%, 100% {
            transform: translateY(0px) translateX(0px);
            opacity: 0.2;
          }
          50% {
            transform: translateY(-20px) translateX(10px);
            opacity: 0.8;
          }
        }
        
        @keyframes float-2 {
          0%, 100% {
            transform: translateY(0px) translateX(0px);
            opacity: 0.3;
          }
          50% {
            transform: translateY(15px) translateX(-8px);
            opacity: 0.7;
          }
        }
        
        @keyframes float-3 {
          0%, 100% {
            transform: translateY(0px) translateX(0px);
            opacity: 0.15;
          }
          50% {
            transform: translateY(-12px) translateX(6px);
            opacity: 0.6;
          }
        }
        
        @keyframes float-4 {
          0%, 100% {
            transform: translateY(0px) translateX(0px);
            opacity: 0.25;
          }
          50% {
            transform: translateY(18px) translateX(-12px);
            opacity: 0.9;
          }
        }
        
        /* Animation Classes */
        .animate-sweep-primary {
          animation: sweep-primary 12s ease-in-out infinite;
        }
        
        .animate-sweep-secondary {
          animation: sweep-secondary 16s ease-in-out infinite 2s;
        }
        
        .animate-sweep-tertiary {
          animation: sweep-tertiary 20s ease-in-out infinite 4s;
        }
        
        .animate-float-1 {
          animation: float-1 8s ease-in-out infinite;
        }
        
        .animate-float-2 {
          animation: float-2 6s ease-in-out infinite 1s;
        }
        
        .animate-float-3 {
          animation: float-3 10s ease-in-out infinite 2s;
        }
        
        .animate-float-4 {
          animation: float-4 7s ease-in-out infinite 3s;
        }
        
        /* Responsive adjustments */
        @media (max-width: 768px) {
          .animate-sweep-primary,
          .animate-sweep-secondary,
          .animate-sweep-tertiary {
            animation-duration: 8s, 12s, 16s;
          }
        }
        
        /* Performance optimizations */
        .animate-sweep-primary,
        .animate-sweep-secondary,
        .animate-sweep-tertiary,
        .animate-float-1,
        .animate-float-2,
        .animate-float-3,
        .animate-float-4 {
          will-change: transform, opacity;
          backface-visibility: hidden;
          transform-style: preserve-3d;
        }
      `}</style>
    </section>
  )
}