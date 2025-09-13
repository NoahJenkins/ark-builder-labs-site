"use client"

import Link from "next/link"
import { FadeIn } from "@/components/animations/fade-in"
import { StaggerChildren } from "@/components/animations/stagger-children"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { SERVICES } from "@/lib/constants"
import { ArrowRight, Code2, Cloud, Brain, CheckCircle } from "lucide-react"
import { motion } from "framer-motion"

const iconMap = {
  Code2,
  Cloud,
  Brain
}

export function ServicesPageContent() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="py-20 md:py-32 bg-gradient-to-br from-background via-muted/20 to-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <FadeIn direction="up">
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                Our <span className="gradient-text">Services</span>
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground mb-8">
                Comprehensive technology solutions to transform your ideas into powerful, 
                scalable applications that drive business growth.
              </p>
              <blockquote className="text-sm md:text-base italic text-muted-foreground/80 max-w-xl mx-auto">
                "Commit to the Lord whatever you do, and he will establish your plans."
                <cite className="block text-xs mt-2 not-italic">— Proverbs 16:3</cite>
              </blockquote>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20 md:py-32">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <StaggerChildren className="space-y-20">
              {SERVICES.map((service, index) => {
                const IconComponent = iconMap[service.icon as keyof typeof iconMap]
                const isEven = index % 2 === 0
                
                return (
                  <motion.div
                    key={service.id}
                    className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${
                      !isEven ? 'lg:flex-row-reverse' : ''
                    }`}
                  >
                    <div className={`space-y-6 ${!isEven ? 'lg:order-2' : ''}`}>
                      <div className="flex items-center space-x-4">
                        <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                          <IconComponent className="h-8 w-8 text-white" />
                        </div>
                        <div>
                          <h2 className="text-3xl md:text-4xl font-bold">{service.title}</h2>
                        </div>
                      </div>
                      
                      <p className="text-lg text-muted-foreground">
                        {service.description}
                      </p>

                      <div className="space-y-4">
                        <h3 className="text-xl font-semibold">What we offer:</h3>
                        <ul className="space-y-2">
                          {service.features.map((feature) => (
                            <li key={feature} className="flex items-start space-x-3">
                              <CheckCircle className="h-5 w-5 text-success mt-0.5 flex-shrink-0" />
                              <span className="text-muted-foreground">{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="space-y-3">
                        <h3 className="text-lg font-semibold">Technologies we use:</h3>
                        <div className="flex flex-wrap gap-2">
                          {service.technologies.map((tech) => (
                            <Badge key={tech} variant="secondary">
                              {tech}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
                        <Button asChild>
                          <Link href={`/services/${service.id}`} className="inline-flex items-center space-x-2">
                            <span>Learn More</span>
                            <ArrowRight className="h-4 w-4" />
                          </Link>
                        </Button>
                        <Button variant="secondary" asChild>
                          <Link href="/contact">Get a Quote</Link>
                        </Button>
                      </div>
                    </div>

                    <div className={`${!isEven ? 'lg:order-1' : ''}`}>
                      <Card className="border-0 shadow-2xl bg-gradient-to-br from-card to-muted/20">
                        <CardContent className="p-8">
                          <div className="aspect-square rounded-xl bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center">
                            <IconComponent className="h-24 w-24 text-primary" />
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </motion.div>
                )
              })}
            </StaggerChildren>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-32 bg-gradient-to-br from-primary to-accent text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <FadeIn direction="up">
              <h2 className="text-3xl md:text-5xl font-bold mb-6">
                Ready to Get Started?
              </h2>
              <p className="text-lg md:text-xl text-white/90 mb-8">
                Let's discuss your project and see how we can help bring your vision to life.
              </p>
              <div className="flex flex-col md:flex-row items-center justify-center space-y-4 md:space-y-0 md:space-x-6">
                <Button size="lg" variant="secondary" asChild>
                  <Link href="/contact" className="inline-flex items-center space-x-2">
                    <span>Start Your Project</span>
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button size="lg" variant="ghost" className="text-white border-white hover:bg-white hover:text-primary" asChild>
                  <Link href="/about">Learn About Us</Link>
                </Button>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>
    </div>
  )
}