import type { Metadata } from "next"
import { FadeIn } from "@/components/animations/fade-in"
import { StaggerChildren } from "@/components/animations/stagger-children"
import { Card, CardContent } from "@/components/ui/card"
import { SITE_CONFIG } from "@/lib/constants"
import { Heart, Shield, Users, Sparkles } from "lucide-react"

export const metadata: Metadata = {
  title: "About Us",
  description: "Learn about Ark Builder Labs' mission, values, and approach to building exceptional software solutions.",
}

const values = [
  {
    icon: Heart,
    title: "Honesty & Integrity",
    description: "We believe in transparent communication and ethical business practices in all our interactions."
  },
  {
    icon: Shield,
    title: "Service Excellence",
    description: "We're committed to delivering exceptional quality and exceeding client expectations."
  },
  {
    icon: Users,
    title: "Lasting Relationships",
    description: "We build partnerships, not just software, focusing on long-term client success."
  },
  {
    icon: Sparkles,
    title: "Stewardship",
    description: "We treat every project as if it were our own, with care, responsibility, and attention to detail."
  }
]

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="py-20 md:py-32 bg-gradient-to-br from-background via-muted/20 to-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <FadeIn direction="up">
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                About <span className="gradient-text">Ark Builder Labs</span>
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground mb-8">
                {SITE_CONFIG.tagline}
              </p>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Company Story */}
      <section className="py-20 md:py-32">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <FadeIn direction="up">
              <div className="prose prose-lg max-w-none text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold mb-8">Our Story</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Like Noah's ark that provided safety and shelter during uncertain times, 
                  Ark Builder Labs was founded on the principle of creating reliable, enduring 
                  software solutions that help businesses navigate the ever-changing digital landscape.
                </p>
              </div>
            </FadeIn>

            <FadeIn direction="up" delay={0.2}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                <div className="space-y-6">
                  <h3 className="text-2xl font-bold">The Vision</h3>
                  <p className="text-muted-foreground">
                    We envision a world where technology serves as a bridge to better business 
                    outcomes, not a barrier. Every line of code we write, every solution we architect, 
                    and every relationship we build is guided by this vision.
                  </p>
                  <p className="text-muted-foreground">
                    Our name reflects our commitment to building solutions that stand the test of time, 
                    providing refuge and growth opportunities for businesses in any market condition.
                  </p>
                </div>
                <div className="relative">
                  <div className="aspect-square rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                    <div className="text-6xl">⚓</div>
                  </div>
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Mission Statement */}
      <section className="py-20 md:py-32 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <FadeIn direction="up">
              <h2 className="text-3xl md:text-4xl font-bold mb-8">Our Mission</h2>
              <blockquote className="text-xl md:text-2xl italic text-muted-foreground leading-relaxed border-l-4 border-primary pl-6">
                "{SITE_CONFIG.mission}"
              </blockquote>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-20 md:py-32">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <FadeIn direction="up" className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Our <span className="gradient-text">Values</span>
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                These core principles guide every decision we make and every solution we deliver.
              </p>
            </FadeIn>

            <StaggerChildren className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {values.map((value, index) => (
                <Card key={index} className="group hover:shadow-lg transition-all duration-300">
                  <CardContent className="p-8">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                        <value.icon className="h-6 w-6 text-white" />
                      </div>
                      <div className="space-y-2">
                        <h3 className="text-xl font-bold">{value.title}</h3>
                        <p className="text-muted-foreground">{value.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </StaggerChildren>
          </div>
        </div>
      </section>

      {/* Approach */}
      <section className="py-20 md:py-32 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <FadeIn direction="up" className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Our Approach</h2>
              <p className="text-lg text-muted-foreground">
                We believe in a collaborative, transparent, and results-driven approach to software development.
              </p>
            </FadeIn>

            <div className="space-y-12">
              <FadeIn direction="up" delay={0.1}>
                <div className="flex items-start space-x-6">
                  <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold flex-shrink-0 mt-1">
                    1
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">Listen & Understand</h3>
                    <p className="text-muted-foreground">
                      We start every project by deeply understanding your business goals, challenges, 
                      and technical requirements. Your success is our success.
                    </p>
                  </div>
                </div>
              </FadeIn>

              <FadeIn direction="up" delay={0.2}>
                <div className="flex items-start space-x-6">
                  <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold flex-shrink-0 mt-1">
                    2
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">Plan & Design</h3>
                    <p className="text-muted-foreground">
                      We create detailed project plans and architectural designs that align with your 
                      objectives while incorporating industry best practices and scalable solutions.
                    </p>
                  </div>
                </div>
              </FadeIn>

              <FadeIn direction="up" delay={0.3}>
                <div className="flex items-start space-x-6">
                  <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold flex-shrink-0 mt-1">
                    3
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">Build & Iterate</h3>
                    <p className="text-muted-foreground">
                      Using agile methodologies, we build your solution incrementally, providing 
                      regular updates and incorporating your feedback throughout the development process.
                    </p>
                  </div>
                </div>
              </FadeIn>

              <FadeIn direction="up" delay={0.4}>
                <div className="flex items-start space-x-6">
                  <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold flex-shrink-0 mt-1">
                    4
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">Support & Grow</h3>
                    <p className="text-muted-foreground">
                      Our relationship doesn't end at deployment. We provide ongoing support, 
                      maintenance, and enhancement services to help your solution evolve with your business.
                    </p>
                  </div>
                </div>
              </FadeIn>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}