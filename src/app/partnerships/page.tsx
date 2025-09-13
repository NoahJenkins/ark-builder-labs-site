import type { Metadata } from "next"
import Image from "next/image"
import { FadeIn } from "@/components/animations/fade-in"
import { StaggerChildren } from "@/components/animations/stagger-children"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PARTNERS } from "@/lib/constants"
import { Award, Shield, Zap, Users } from "lucide-react"

export const metadata: Metadata = {
  title: "Partnerships & Certifications",
  description: "Our strategic technology partnerships and professional certifications that ensure we deliver cutting-edge solutions.",
}


const benefits = [
  {
    icon: Zap,
    title: "Access to Latest Technologies",
    description: "Stay ahead with early access to cutting-edge tools and platforms through our partnerships."
  },
  {
    icon: Shield,
    title: "Enterprise-Grade Security",
    description: "Leverage security best practices and tools from industry-leading partners."
  },
  {
    icon: Users,
    title: "Priority Support",
    description: "Get priority support and faster issue resolution through our partner channels."
  },
  {
    icon: Award,
    title: "Certified Expertise",
    description: "Work with certified professionals who maintain the highest industry standards."
  }
]

export default function PartnershipsPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="py-20 md:py-32 bg-gradient-to-br from-background via-muted/20 to-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <FadeIn direction="up">
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                Our <span className="gradient-text">Partnerships</span> & Certifications
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground mb-8">
                Strategic alliances and professional certifications that enable us to deliver 
                world-class solutions with the latest technologies and best practices.
              </p>
              <blockquote className="text-sm md:text-base italic text-muted-foreground/80 max-w-xl mx-auto">
                "Where there is no counsel, the people fall; But in the multitude of counselors there is safety."
                <cite className="block text-xs mt-2 not-italic">— Proverbs 11:14</cite>
              </blockquote>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Technology Partners */}
      <section className="py-20 md:py-32">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <FadeIn direction="up" className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Technology <span className="gradient-text">Partners</span>
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                We partner with industry leaders to ensure our clients have access to the best tools and platforms available.
              </p>
            </FadeIn>

            <StaggerChildren className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {PARTNERS.map((partner, index) => (
                <Card key={index} className="group hover:shadow-xl transition-all duration-300 border-0 bg-card/50 backdrop-blur-sm">
                  <CardHeader className="text-center pb-4">
                    <div className="mx-auto mb-4 w-20 h-20 rounded-xl bg-white flex items-center justify-center group-hover:scale-110 transition-transform duration-300 p-4">
                      <Image
                        src={partner.logo}
                        alt={`${partner.name} logo`}
                        width={48}
                        height={48}
                        className="object-contain"
                      />
                    </div>
                    <CardTitle className="text-xl">{partner.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground text-center text-sm">
                      {partner.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </StaggerChildren>
          </div>
        </div>
      </section>


      {/* Partnership Benefits */}
      <section className="py-20 md:py-32 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <FadeIn direction="up" className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                How Our Partnerships <span className="gradient-text">Benefit You</span>
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Our strategic partnerships and certifications translate directly into better outcomes for your projects.
              </p>
            </FadeIn>

            <StaggerChildren className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {benefits.map((benefit, index) => (
                <Card key={index} className="group hover:shadow-lg transition-all duration-300">
                  <CardContent className="p-8">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                        <benefit.icon className="h-6 w-6 text-white" />
                      </div>
                      <div className="space-y-2">
                        <h3 className="text-xl font-bold">{benefit.title}</h3>
                        <p className="text-muted-foreground">{benefit.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </StaggerChildren>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 md:py-32 bg-gradient-to-br from-primary to-accent text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <FadeIn direction="up">
              <h2 className="text-3xl md:text-5xl font-bold mb-16">
                Partnership Impact
              </h2>
            </FadeIn>

            <StaggerChildren className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-bold mb-2">6</div>
                <div className="text-white/90">Technology Partners</div>
              </div>
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-bold mb-2">$1000s</div>
                <div className="text-white/90">in Savings</div>
              </div>
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-bold mb-2">100s</div>
                <div className="text-white/90">of Reliable Solutions</div>
              </div>
            </StaggerChildren>
          </div>
        </div>
      </section>
    </div>
  )
}