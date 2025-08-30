import type { Metadata } from "next"
import { FadeIn } from "@/components/animations/fade-in"
import { BlogContent } from "@/components/blog/blog-content"
import { getBlogPosts, getBlogCategories } from "@/lib/blog"

export const metadata: Metadata = {
  title: "Blog",
  description: "Insights, tutorials, and thoughts on web development, cloud engineering, and AI technology from the Ark Builder Labs team.",
}

const blogPosts = getBlogPosts()
const categories = getBlogCategories()

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
          {blogPosts.length === 0 ? (
            <FadeIn direction="up" className="text-center py-20">
              <div className="max-w-md mx-auto">
                <div className="text-6xl mb-6">✍️</div>
                <h3 className="text-2xl font-semibold mb-4">Coming Soon</h3>
                <p className="text-muted-foreground">
                  We're working on some great content. Check back soon for insights on web development, cloud engineering, and AI technology.
                </p>
              </div>
            </FadeIn>
          ) : (
            <BlogContent blogPosts={blogPosts} categories={categories} />
          )}
        </div>
      </section>
    </div>
  )
}