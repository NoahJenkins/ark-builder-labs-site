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
    <div className="min-h-screen bg-background">
      <section className="relative overflow-hidden border-b border-border/70 py-20 md:py-28">
        <div className="absolute inset-0 blog-ledger-grid opacity-80" aria-hidden="true" />
        <div className="absolute right-0 top-16 hidden h-56 w-56 rounded-full bg-primary/8 blur-3xl md:block" aria-hidden="true" />
        <div className="container relative mx-auto px-4">
          <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_340px] lg:items-end">
            <FadeIn direction="up" className="max-w-3xl">
              <p className="mb-5 inline-flex rounded-full border border-primary/20 bg-primary/7 px-3 py-1 text-sm font-medium text-primary">
                Workshop notes for durable software
              </p>
              <h1 className="mb-6 text-4xl font-bold leading-[1.05] text-foreground md:text-6xl">
                Field Notes
              </h1>
              <p className="max-w-2xl text-lg leading-8 text-muted-foreground md:text-xl">
                Practical writing on web development, cloud engineering, AI integration, and the stewardship decisions that keep software useful after launch.
              </p>
            </FadeIn>

            <FadeIn direction="up" delay={0.1}>
              <figure className="border-y border-border/80 py-6 text-muted-foreground">
                <blockquote className="font-ledger text-lg leading-8 text-foreground/85">
                  "A fool vents all his feelings, But a wise man holds them back."
                </blockquote>
                <figcaption className="mt-4 text-sm font-medium text-primary">
                  Proverbs 29:11
                </figcaption>
              </figure>
            </FadeIn>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          {blogPosts.length === 0 ? (
            <FadeIn direction="up" className="py-16">
              <div className="mx-auto max-w-xl border-y border-border/80 py-12 text-center">
                <p className="mb-3 text-sm font-medium text-primary">The notebook is open</p>
                <h2 className="mb-4 text-3xl font-semibold">Field notes are coming soon</h2>
                <p className="text-muted-foreground">
                  We are preparing practical writing on web development, cloud engineering, and AI technology.
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
