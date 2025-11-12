export const SITE_CONFIG = {
  name: "Ark Builder Labs",
  description: "Building software for every season. Professional Web/Mobile Development, Cloud Engineering, and AI Consulting services.",
  url: "https://arkbuilderlabs.com",
  tagline: "Building software for every season.",
  mission: "Our mission at Ark Builder Labs is to serve our clients with honesty, integrity, a servant's heart, and a steward's attitude, creating lasting value and forging enduring relationships.",
  email: "contact@arkbuilderlabs.com",
  social: {
    linkedin: "https://www.linkedin.com/company/arkbuilderlabs",
    twitter: "https://x.com/arkbuilderlabs",
    instagram: "https://www.instagram.com/arkbuilderlabs",
    facebook: "https://www.facebook.com/people/Ark-Builder-Labs/61578219340498/"
  }
} as const

export const SERVICES = [
  {
    id: "web-mobile",
    title: "Web & Mobile Development",
    description: "Need a landing page for your business, a custom website, or even a mobile app? We've got you covered.",
    icon: "Code2",
    technologies: ["Next.js", "React Native", "Expo", "Node JS", "Express", "TypeScript", "Tailwind CSS", "Jest", "Playwright"],
    features: [
      "Full Stack Web Application",
      "Mobile App Development",
      "Landing Pages",
      "E-commerce Solution",
      "SEO Optimization",
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
    title: "AI and Automation Consulting",
    description: "Automate your business processes with AI-powered solutions, from custom chatbots and intelligent agents to workflow automation and AI integration.",
    icon: "Brain",
    technologies: ["Gemini", "Azure AI", "OpenAI", "CrewAI", "Ollama", "n8n", "Logic Apps"],
    features: [
      "Automate Buisness Workflows",
      "AI Integration Strategies",
      "Custom Agent Solutions",
      "Cost Optimizations"
    ]
  }
] as const

export const PARTNERS = [
  {
    name: "Microsoft",
    description: "Azure cloud solutions and enterprise development",
    logo: "/assets/images/Microsoft_logo.svg.png"
  },
  {
    name: "Vercel",
    description: "Next.js hosting and edge computing",
    logo: "/assets/images/logo-vercel.svg"
  },
  {
    name: "Google",
    description: "Gemini models powered by Google Cloud",
    logo: "/assets/images/gcp.png"
  }
] as const

export const NAVIGATION_ITEMS = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
  { name: "Services", href: "/services" },
  { name: "Blog", href: "/blog" },
  { name: "Contact", href: "/contact" }
] as const