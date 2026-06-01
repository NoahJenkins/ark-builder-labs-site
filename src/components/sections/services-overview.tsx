"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { FadeIn } from "@/components/animations/fade-in"
import { StaggerChildren } from "@/components/animations/stagger-children"
import { SERVICES } from "@/lib/constants"
import { encodePathSegment } from "@/lib/security"
import { ArrowRight, Code2, Cloud, Brain } from "lucide-react"
import Link from "next/link"

const iconMap = {
  Code2,
  Cloud,
  Brain
}

const serviceCtas = {
  "web-mobile": "Explore web and mobile",
  "cloud-engineering": "Explore cloud",
  "ai-consulting": "Explore AI",
} as const

export function ServicesOverview() {
  return (
    <section className="py-20 md:py-32 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <FadeIn direction="up" className="mb-12 grid gap-5 md:grid-cols-[0.95fr_1.05fr] md:items-end">
            <h2 className="text-3xl md:text-5xl font-bold">
              Services shaped around ownership
            </h2>
            <p className="text-lg text-muted-foreground md:max-w-xl">
              Choose the path that matches the problem in front of you. Each engagement is scoped around useful software, clear handoff, and practical stewardship after launch.
            </p>
          </FadeIn>

          <StaggerChildren className="divide-y divide-border overflow-hidden rounded-xl border bg-card">
            {SERVICES.map((service) => {
              const IconComponent = iconMap[service.icon as keyof typeof iconMap]
              
              return (
                <article
                  key={service.id}
                  className="grid gap-6 p-6 transition-colors hover:bg-primary/5 md:grid-cols-[220px_1fr_auto] md:items-start md:p-8"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                      <IconComponent className="h-6 w-6" />
                    </div>
                    <h3 className="text-xl font-bold leading-tight">{service.title}</h3>
                  </div>

                  <div className="space-y-4">
                    <p className="max-w-2xl text-muted-foreground">
                      {service.description}
                    </p>

                    <div className="flex flex-wrap gap-2">
                      {service.technologies.slice(0, 4).map((tech) => (
                        <Badge key={tech} variant="secondary" className="text-xs">
                          {tech}
                        </Badge>
                      ))}
                    </div>

                    <ul className="grid gap-2 text-sm text-muted-foreground sm:grid-cols-3">
                      {service.features.slice(0, 3).map((feature) => (
                        <li key={feature} className="flex items-start">
                          <span className="mt-2 mr-3 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <Button variant="ghost" className="justify-start md:justify-center" asChild>
                    <Link href={`/services/${encodePathSegment(service.id)}`}>
                      {serviceCtas[service.id as keyof typeof serviceCtas]}
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Link>
                  </Button>
                </article>
              )
            })}
          </StaggerChildren>

          <FadeIn direction="up" delay={0.3} className="text-center mt-16">
            <Button size="lg" asChild>
              <Link href="/services" className="inline-flex items-center space-x-2">
                <span>View All Services</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </FadeIn>
        </div>
      </div>
    </section>
  )
}
