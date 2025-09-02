import type { Metadata } from "next"
import { notFound } from "next/navigation"
import Link from "next/link"
import { FadeIn } from "@/components/animations/fade-in"
import { StaggerChildren } from "@/components/animations/stagger-children"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { SERVICES } from "@/lib/constants"
import { ArrowRight, ArrowLeft, Code2, Cloud, Brain, CheckCircle, Star } from "lucide-react"

const iconMap = {
  Code2,
  Cloud,
  Brain
}

interface ServicePageProps {
  params: Promise<{
    service: string
  }>
}

export async function generateStaticParams() {
  return SERVICES.map((service) => ({
    service: service.id,
  }))
}

export async function generateMetadata({ params }: ServicePageProps): Promise<Metadata> {
  const resolvedParams = await params
  const service = SERVICES.find((s) => s.id === resolvedParams.service)
  
  if (!service) {
    return {
      title: "Service Not Found",
    }
  }

  return {
    title: service.title,
    description: service.description,
  }
}

export default async function ServicePage({ params }: ServicePageProps) {
  const resolvedParams = await params
  const service = SERVICES.find((s) => s.id === resolvedParams.service)

  if (!service) {
    notFound()
  }

  const IconComponent = iconMap[service.icon as keyof typeof iconMap]

  const benefits = {
    "web-mobile": [
      "Faster time to market with modern development practices",
      "Scalable architecture that grows with your business",
      "Cross-platform compatibility reducing development costs",
      "SEO-optimized solutions for better online visibility",
      "Responsive design ensuring great user experience across devices"
    ],
    "cloud-engineering": [
      "Reduced infrastructure costs through optimization",
      "Improved scalability and reliability",
      "Enhanced security with cloud-native solutions",
      "Faster deployment and development cycles",
      "24/7 monitoring and automated maintenance"
    ],
    "ai-consulting": [
      "Automated processes reducing manual workload",
      "Data-driven insights for better decision making",
      "Improved customer experience through personalization",
      "Competitive advantage through AI adoption",
      "Future-proof solutions with cutting-edge technology"
    ]
  }

  const processSteps = {
    "web-mobile": [
      { title: "Discovery & Planning", description: "Understanding your requirements and user needs" },
      { title: "Design & Prototyping", description: "Creating wireframes and interactive prototypes" },
      { title: "Development", description: "Building your application with modern technologies" },
      { title: "Testing & QA", description: "Comprehensive testing across devices and browsers" },
      { title: "Deployment & Support", description: "Launch and ongoing maintenance" }
    ],
    "cloud-engineering": [
      { title: "Assessment", description: "Analyzing your current infrastructure and needs" },
      { title: "Architecture Design", description: "Creating scalable cloud architecture plans" },
      { title: "Migration Strategy", description: "Planning seamless transition to the cloud" },
      { title: "Implementation", description: "Executing migration with minimal downtime" },
      { title: "Optimization", description: "Continuous monitoring and cost optimization" }
    ],
    "ai-consulting": [
      { title: "AI Readiness Assessment", description: "Evaluating your data and infrastructure" },
      { title: "Strategy Development", description: "Creating AI implementation roadmap" },
      { title: "Proof of Concept", description: "Building and testing AI solutions" },
      { title: "Full Implementation", description: "Deploying production-ready AI systems" },
      { title: "Training & Support", description: "Team training and ongoing optimization" }
    ]
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="py-20 md:py-32 bg-gradient-to-br from-background via-muted/20 to-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <FadeIn direction="up">
              <Link 
                href="/services" 
                className="inline-flex items-center space-x-2 text-muted-foreground hover:text-primary transition-colors mb-8"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Back to Services</span>
              </Link>
              
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                  <IconComponent className="h-8 w-8 text-white" />
                </div>
                <h1 className="text-4xl md:text-6xl font-bold">{service.title}</h1>
              </div>
              
              <p className="text-lg md:text-xl text-muted-foreground mb-8">
                {service.description}
              </p>

              <div className="flex flex-wrap gap-3">
                {service.technologies.map((tech) => (
                  <Badge key={tech} variant="secondary" className="text-sm">
                    {tech}
                  </Badge>
                ))}
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* What We Offer */}
      <section className="py-20 md:py-32">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <FadeIn direction="up" className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                What We <span className="gradient-text">Deliver</span>
              </h2>
            </FadeIn>

            <StaggerChildren className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {service.features.map((feature, index) => (
                <Card key={index} className="group hover:shadow-lg transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-3">
                      <CheckCircle className="h-5 w-5 text-success mt-1 flex-shrink-0" />
                      <span>{feature}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </StaggerChildren>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-20 md:py-32 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <FadeIn direction="up" className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Business <span className="gradient-text">Benefits</span>
              </h2>
              <p className="text-lg text-muted-foreground">
                How our {service.title.toLowerCase()} services drive real business value
              </p>
            </FadeIn>

            <StaggerChildren className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {benefits[service.id as keyof typeof benefits].map((benefit, index) => (
                <div key={index} className="flex items-start space-x-4">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center flex-shrink-0 mt-1">
                    <Star className="h-4 w-4 text-white" />
                  </div>
                  <p className="text-muted-foreground">{benefit}</p>
                </div>
              ))}
            </StaggerChildren>
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="py-20 md:py-32">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <FadeIn direction="up" className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Our <span className="gradient-text">Process</span>
              </h2>
              <p className="text-lg text-muted-foreground">
                A proven methodology that ensures successful project delivery
              </p>
            </FadeIn>

            <StaggerChildren className="space-y-8">
              {processSteps[service.id as keyof typeof processSteps].map((step, index) => (
                <div key={index} className="flex items-start space-x-6">
                  <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold flex-shrink-0 text-lg">
                    {index + 1}
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold">{step.title}</h3>
                    <p className="text-muted-foreground">{step.description}</p>
                  </div>
                </div>
              ))}
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
                Ready to Start Your {service.title} Project?
              </h2>
              <p className="text-lg md:text-xl text-white/90 mb-8">
                Get in touch to discuss your requirements and receive a custom proposal.
              </p>
              <div className="flex flex-col md:flex-row items-center justify-center space-y-4 md:space-y-0 md:space-x-6">
                <Button size="lg" variant="secondary" asChild>
                  <Link href="/contact" className="inline-flex items-center space-x-2">
                    <span>Get a Quote</span>
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button size="lg" variant="ghost" className="text-white border-white hover:bg-white hover:text-primary" asChild>
                  <Link href="/services">View All Services</Link>
                </Button>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>
    </div>
  )
}