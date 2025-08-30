import type { Metadata } from "next"
import Link from "next/link"
import { FadeIn } from "@/components/animations/fade-in"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, ArrowRight } from "lucide-react"

export const metadata: Metadata = {
  title: "Blog",
  description: "Insights, tutorials, and thoughts on web development, cloud engineering, and AI technology from the Ark Builder Labs team.",
}

// Placeholder blog posts - in a real implementation, these would come from a CMS or markdown files
const blogPosts = [
  {
    id: "next-js-15-features",
    title: "Exploring Next.js 15: What's New and Why It Matters",
    excerpt: "A deep dive into the latest features of Next.js 15 and how they can improve your development workflow and application performance.",
    category: "Web Development",
    publishedAt: "2024-01-15",
    readTime: "8 min read",
    featured: true
  },
  {
    id: "cloud-architecture-best-practices",
    title: "Cloud Architecture Best Practices for Growing Businesses",
    excerpt: "Learn the essential principles of designing scalable and cost-effective cloud infrastructure that grows with your business.",
    category: "Cloud Engineering",
    publishedAt: "2024-01-10",
    readTime: "12 min read",
    featured: false
  },
  {
    id: "ai-integration-business-impact",
    title: "The Real Business Impact of AI Integration",
    excerpt: "Beyond the hype: practical examples of how AI integration delivers measurable business value across different industries.",
    category: "AI Consulting",
    publishedAt: "2024-01-05",
    readTime: "10 min read",
    featured: false
  },
  {
    id: "react-performance-optimization",
    title: "React Performance Optimization: A Complete Guide",
    excerpt: "Comprehensive strategies for optimizing React applications, from component-level optimizations to bundle size reduction.",
    category: "Web Development",
    publishedAt: "2023-12-28",
    readTime: "15 min read",
    featured: false
  }
]

const categories = ["All", "Web Development", "Cloud Engineering", "AI Consulting", "Industry Trends"]

export default function BlogPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="py-20 md:py-32 bg-gradient-to-br from-background via-muted/20 to-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <FadeIn direction="up">
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                Insights & <span className="gradient-text">Updates</span>
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground mb-8">
                Stay updated with the latest in web development, cloud engineering, 
                and AI technology through our technical insights and industry analysis.
              </p>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Blog Content */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            {/* Categories Filter */}
            <FadeIn direction="up" className="mb-12">
              <div className="flex flex-wrap gap-3 justify-center">
                {categories.map((category) => (
                  <Badge 
                    key={category} 
                    variant={category === "All" ? "default" : "secondary"}
                    className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                  >
                    {category}
                  </Badge>
                ))}
              </div>
            </FadeIn>

            {/* Featured Post */}
            {blogPosts.filter(post => post.featured).map((post) => (
              <FadeIn key={post.id} direction="up" className="mb-16">
                <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-card to-muted/20">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
                    <div className="aspect-video lg:aspect-square bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                      <div className="text-4xl">📝</div>
                    </div>
                    <div className="p-8 flex flex-col justify-center">
                      <Badge className="w-fit mb-4">{post.category}</Badge>
                      <h2 className="text-2xl md:text-3xl font-bold mb-4 group-hover:text-primary transition-colors">
                        {post.title}
                      </h2>
                      <p className="text-muted-foreground mb-6 leading-relaxed">
                        {post.excerpt}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                          <div className="flex items-center space-x-1">
                            <Calendar className="h-4 w-4" />
                            <span>{new Date(post.publishedAt).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Clock className="h-4 w-4" />
                            <span>{post.readTime}</span>
                          </div>
                        </div>
                        <Link 
                          href={`/blog/${post.id}`}
                          className="inline-flex items-center space-x-2 text-primary hover:underline font-medium group"
                        >
                          <span>Read More</span>
                          <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                        </Link>
                      </div>
                    </div>
                  </div>
                </Card>
              </FadeIn>
            ))}

            {/* Regular Posts Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {blogPosts.filter(post => !post.featured).map((post, index) => (
                <FadeIn key={post.id} direction="up" delay={index * 0.1}>
                  <Card className="h-full group hover:shadow-xl transition-all duration-300">
                    <div className="aspect-video bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center">
                      <div className="text-2xl">📄</div>
                    </div>
                    <CardHeader>
                      <Badge className="w-fit mb-2">{post.category}</Badge>
                      <CardTitle className="group-hover:text-primary transition-colors line-clamp-2">
                        {post.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground mb-6 line-clamp-3">
                        {post.excerpt}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex flex-col space-y-1 text-xs text-muted-foreground">
                          <div className="flex items-center space-x-1">
                            <Calendar className="h-3 w-3" />
                            <span>{new Date(post.publishedAt).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Clock className="h-3 w-3" />
                            <span>{post.readTime}</span>
                          </div>
                        </div>
                        <Link 
                          href={`/blog/${post.id}`}
                          className="text-primary hover:underline text-sm font-medium group/link"
                        >
                          <span className="inline-flex items-center space-x-1">
                            <span>Read</span>
                            <ArrowRight className="h-3 w-3 group-hover/link:translate-x-1 transition-transform" />
                          </span>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                </FadeIn>
              ))}
            </div>

          </div>
        </div>
      </section>
    </div>
  )
}