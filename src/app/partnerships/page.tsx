import type { Metadata } from "next"
import { FadeIn } from "@/components/animations/fade-in"
import { StaggerChildren } from "@/components/animations/stagger-children"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { PARTNERS } from "@/lib/constants"
import { Award, Shield, Zap, Users, CheckCircle } from "lucide-react"

export const metadata: Metadata = {
  title: "Partnerships & Certifications",
  description: "Our strategic technology partnerships and professional certifications that ensure we deliver cutting-edge solutions.",
}

const certifications = [
  {
    category: "Microsoft",
    badges: [
      "Azure Fundamentals",
      "Azure Developer Associate",
      "Azure Solutions Architect",
      "Microsoft 365 Certified"
    ],
    color: "bg-blue-500"
  },
  {
    category: "GitHub",
    badges: [
      "GitHub Actions",
      "GitHub Administration",
      "GitHub Advanced Security",
      "GitHub Copilot"
    ],
    color: "bg-gray-800"
  },
  {
    category: "HashiCorp",
    badges: [
      "Terraform Associate",
      "Terraform Professional",
      "Vault Associate",
      "Consul Associate"
    ],
    color: "bg-purple-600"
  },
  {
    category: "AWS",
    badges: [
      "Cloud Practitioner",
      "Solutions Architect",
      "Developer Associate",
      "SysOps Administrator"
    ],
    color: "bg-orange-500"
  },
  {
    category: "Security",
    badges: [
      "CompTIA Security+",
      "CompTIA Network+",
      "ISC2 CISSP",
      "Certified Ethical Hacker"
    ],
    color: "bg-red-600"
  }
]

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
                    <div className="mx-auto mb-4 w-20 h-20 rounded-xl bg-muted flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <div className="text-2xl font-bold text-primary">{partner.name[0]}</div>
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

      {/* Certifications */}
      <section className="py-20 md:py-32 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <FadeIn direction="up" className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Professional <span className="gradient-text">Certifications</span>
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Our team maintains current certifications across multiple technology domains 
                to ensure we deliver the highest quality solutions.
              </p>
            </FadeIn>

            <StaggerChildren className="space-y-8">
              {certifications.map((cert, index) => (
                <Card key={index} className="overflow-hidden">
                  <CardHeader>
                    <div className="flex items-center space-x-4">
                      <div className={`w-12 h-12 rounded-lg ${cert.color} flex items-center justify-center`}>
                        <Award className="h-6 w-6 text-white" />
                      </div>
                      <CardTitle className="text-2xl">{cert.category}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                      {cert.badges.map((badge, badgeIndex) => (
                        <div key={badgeIndex} className="flex items-center space-x-2 p-3 rounded-lg bg-muted/50">
                          <CheckCircle className="h-4 w-4 text-success flex-shrink-0" />
                          <span className="text-sm font-medium">{badge}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </StaggerChildren>
          </div>
        </div>
      </section>

      {/* Partnership Benefits */}
      <section className="py-20 md:py-32">
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
                <div className="text-4xl md:text-5xl font-bold mb-2">15+</div>
                <div className="text-white/90">Active Certifications</div>
              </div>
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-bold mb-2">5</div>
                <div className="text-white/90">Technology Partners</div>
              </div>
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-bold mb-2">100%</div>
                <div className="text-white/90">Up-to-date Credentials</div>
              </div>
            </StaggerChildren>
          </div>
        </div>
      </section>
    </div>
  )
}