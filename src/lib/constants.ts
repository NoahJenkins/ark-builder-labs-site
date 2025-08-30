export const SITE_CONFIG = {
  name: "Ark Builder Labs",
  description: "Building software for every season. Professional Web/Mobile Development, Cloud Engineering, and AI Consulting services.",
  url: "https://arkbuilderlabs.com",
  tagline: "Building software for every season.",
  mission: "Our mission at Ark Builder Labs is to serve our clients with honesty, integrity, a servant's heart, and a steward's attitude, creating lasting value and forging enduring relationships.",
  email: "noah@arkbuilderlabs.com",
  social: {
    linkedin: "#",
    twitter: "#",
    instagram: "#",
    facebook: "#"
  }
} as const

export const SERVICES = [
  {
    id: "web-mobile",
    title: "Web & Mobile Development",
    description: "Need a landing page for your business, a custom website, or even a mobile app? We've got you covered.",
    icon: "Code2",
    technologies: ["React", "Next.js", "React Native", "TypeScript", "Tailwind CSS", "Jest", "Playwright"],
    features: [
      "Full Stack Web Application",
      "Progressive Web Apps",
      "SEO Optimization",
      "E-commerce Solution",
      "Landing Pages",
      "API Development"
    ]
  },
  {
    id: "cloud-engineering",
    title: "Cloud Engineering & Consulting",
    description: "Need hosting for your website or a complete infrastructure setup for your enterprise application? We build custom solutions tailored to your specific needs.",
    icon: "Cloud",
    technologies: ["Azure", "AWS", "Vercel", "Docker", "GitHub Actions", "Terraform"],
    features: [
      "Cloud Architecture Design",
      "Security Enhancements",
      "Performance Optimization",
      "Cost Optimization",
      "DevOps Implementation"
    ]
  },
  {
    id: "ai-consulting",
    title: "AI Technology Consulting",
    description: "Whether you need a custom chatbot, an agent to respond to emails or manage phone calls, or you just want to learn how to use ChatGPT for your business, we can help.",
    icon: "Brain",
    technologies: ["Gemini", "Azure AI", "OpenAI", "CrewAI", "Ollama"],
    features: [
      "Custom Agent Solutions",
      "Training/finetuning LLMs",
      "AI Integration Strategies",
      "Cost Optimization"
    ]
  }
] as const

export const PARTNERS = [
  {
    name: "Microsoft",
    description: "Azure cloud solutions and enterprise development",
    logo: "/partners/microsoft.svg"
  },
  {
    name: "Vercel",
    description: "Next.js hosting and edge computing",
    logo: "/partners/vercel.svg"
  },
  {
    name: "HashiCorp",
    description: "Infrastructure as Code expertise",
    logo: "/partners/hashicorp.svg"
  },
  {
    name: "GitHub",
    description: "DevOps and collaboration tools",
    logo: "/partners/github.svg"
  },
  {
    name: "Wix",
    description: "Website solutions for small businesses",
    logo: "/partners/wix.svg"
  }
] as const

export const NAVIGATION_ITEMS = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
  { name: "Services", href: "/services" },
  { name: "Partnerships", href: "/partnerships" },
  { name: "Blog", href: "/blog" },
  { name: "Contact", href: "/contact" }
] as const