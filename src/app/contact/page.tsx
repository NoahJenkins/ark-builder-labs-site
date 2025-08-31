import type { Metadata } from "next"
import { FadeIn } from "@/components/animations/fade-in"
import { StaggerChildren } from "@/components/animations/stagger-children"
import { ContactForm } from "@/components/forms/contact-form"
import { ConsultationCalendar } from "@/components/calendar/consultation-calendar"
import { Card, CardContent } from "@/components/ui/card"
import { SITE_CONFIG } from "@/lib/constants"
import { Mail, Clock, MessageCircle, Calendar, MapPin, Phone, Linkedin, X, Instagram, Facebook } from "lucide-react"

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Get in touch with Ark Builder Labs for your next software development project. We respond within 24 hours.",
}

const contactMethods = [
  {
    icon: Mail,
    title: "Email Us",
    description: "Send us a message anytime",
    value: SITE_CONFIG.email,
    action: `mailto:${SITE_CONFIG.email}`
  },
  {
    icon: Clock,
    title: "Response Time",
    description: "We typically respond within",
    value: "24 hours",
    action: null
  },
]

const socialIcons = {
  linkedin: Linkedin,
  twitter: X,
  instagram: Instagram,
  facebook: Facebook,
}

const socialLabels = {
  linkedin: "linkedin",
  twitter: "X/Twitter", 
  instagram: "instagram",
  facebook: "facebook",
}

const faqs = [
  {
    question: "How do you handle project pricing?",
    answer: "We provide custom quotes based on your specific requirements. After our initial consultation, we'll deliver a detailed proposal with transparent pricing and timeline."
  },
  {
    question: "What's your typical project timeline?",
    answer: "Project timelines vary based on complexity, but most projects range from 4-16 weeks. We'll provide a detailed timeline during our planning phase."
  },
  {
    question: "Do you provide ongoing support?",
    answer: "Yes! We offer various support and maintenance packages to ensure your solution continues to perform optimally after launch."
  },
  {
    question: "Can you work with our existing team?",
    answer: "Absolutely. We frequently collaborate with in-house teams and can adapt our approach to complement your existing development processes."
  }
]

export default function ContactPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="py-20 md:py-32 bg-gradient-to-br from-background via-muted/20 to-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <FadeIn direction="up">
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                Let's Build Something <span className="gradient-text">Amazing</span>
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground mb-8">
                Ready to transform your ideas into powerful software solutions? 
                We'd love to hear from you and discuss how we can help your business grow.
              </p>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Contact Methods */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <StaggerChildren className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20 max-w-4xl mx-auto">
              {contactMethods.map((method, index) => (
                <Card key={index} className="text-center group hover:shadow-lg transition-all duration-300">
                  <CardContent className="p-8">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                      <method.icon className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">{method.title}</h3>
                    <p className="text-muted-foreground text-sm mb-3">{method.description}</p>
                    {method.action ? (
                      <a 
                        href={method.action}
                        className="text-primary hover:underline font-medium"
                      >
                        {method.value}
                      </a>
                    ) : (
                      <p className="font-medium">{method.value}</p>
                    )}
                  </CardContent>
                </Card>
              ))}
            </StaggerChildren>

            {/* Contact Form */}
            <FadeIn direction="up">
              <ContactForm />
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Calendar Section */}
      <section id="calendar" className="py-20 md:py-32 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <FadeIn direction="up">
              <div className="flex items-center justify-center space-x-3 mb-6">
                <Calendar className="h-8 w-8 text-primary" />
                <h2 className="text-3xl md:text-4xl font-bold">
                  Schedule a <span className="gradient-text">Consultation</span>
                </h2>
              </div>
              <p className="text-lg text-muted-foreground mb-8">
                Prefer to talk? Book a free 30-minute consultation to discuss your project in detail.
              </p>
              
              {/* Cal.com embed */}
              <div className="bg-card rounded-xl border overflow-hidden">
                <ConsultationCalendar />
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 md:py-32">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <FadeIn direction="up" className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Frequently Asked <span className="gradient-text">Questions</span>
              </h2>
              <p className="text-lg text-muted-foreground">
                Quick answers to common questions about working with us.
              </p>
            </FadeIn>

            <StaggerChildren className="space-y-6">
              {faqs.map((faq, index) => (
                <Card key={index} className="group hover:shadow-lg transition-all duration-300">
                  <CardContent className="p-8">
                    <h3 className="text-xl font-bold mb-4 group-hover:text-primary transition-colors">
                      {faq.question}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {faq.answer}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </StaggerChildren>
          </div>
        </div>
      </section>

      {/* Location & Social */}
      <section className="py-20 md:py-32 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <FadeIn direction="up" className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Connect With <span className="gradient-text">Us</span>
              </h2>
            </FadeIn>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <FadeIn direction="left">
                <Card>
                  <CardContent className="p-8">
                    <div className="flex items-center space-x-3 mb-6">
                      <MapPin className="h-6 w-6 text-primary" />
                      <h3 className="text-xl font-bold">Our Location</h3>
                    </div>
                    <p className="text-muted-foreground mb-4">
                      Based in Fort Worth, Texas, we proudly serve our local community while 
                      leveraging remote capabilities to work with clients across the United States.
                    </p>
                    <p className="font-medium">🤠 Fort Worth, Texas</p>
                    <p className="text-sm text-muted-foreground">Serving our local community & clients nationwide.</p>
                  </CardContent>
                </Card>
              </FadeIn>

              <FadeIn direction="right">
                <Card>
                  <CardContent className="p-8">
                    <div className="flex items-center space-x-3 mb-6">
                      <MessageCircle className="h-6 w-6 text-primary" />
                      <h3 className="text-xl font-bold">Follow Us</h3>
                    </div>
                    <p className="text-muted-foreground mb-6">
                      Stay updated with our latest projects, insights, and technology updates.
                    </p>
                    <div className="space-y-3">
                      {Object.entries(SITE_CONFIG.social).map(([platform, url]) => {
                        const IconComponent = socialIcons[platform as keyof typeof socialIcons]
                        return (
                          <a 
                            key={platform}
                            href={url}
                            className="flex items-center space-x-3 text-muted-foreground hover:text-primary transition-colors group"
                          >
                            <div className="w-8 h-8 rounded-full bg-muted group-hover:bg-primary/10 flex items-center justify-center">
                              {IconComponent && <IconComponent className="w-4 h-4" />}
                            </div>
                            <span className="capitalize font-medium">{socialLabels[platform as keyof typeof socialLabels]}</span>
                          </a>
                        )
                      })}
                    </div>
                  </CardContent>
                </Card>
              </FadeIn>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}