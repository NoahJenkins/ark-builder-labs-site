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
    description: "Custom web applications, PWAs, and mobile-first development with React and Next.js",
    icon: "Code2",
    technologies: ["React", "Next.js", "React Native", "TypeScript"],
    features: [
      "Custom web applications",
      "Progressive Web Apps (PWAs)",
      "Mobile-first development",
      "E-commerce solutions",
      "API development"
    ]
  },
  {
    id: "cloud-engineering",
    title: "Cloud Engineering & Consulting",
    description: "Cloud architecture, migration strategies, and optimization for Azure, AWS, and Vercel",
    icon: "Cloud",
    technologies: ["Azure", "AWS", "Vercel", "Docker", "Kubernetes"],
    features: [
      "Cloud architecture design",
      "Migration strategies",
      "Performance optimization",
      "Cost optimization",
      "DevOps implementation"
    ]
  },
  {
    id: "ai-consulting",
    title: "AI Technology Consulting",
    description: "AI integration strategies, machine learning implementation, and ethical AI practices",
    icon: "Brain",
    technologies: ["Gemini", "Azure AI", "OpenAI", "LangChain", "Hugging Face"],
    features: [
      "Custom Agent Solutions",
      "Training/finetuning LLMs",
      "AI integration strategies"
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