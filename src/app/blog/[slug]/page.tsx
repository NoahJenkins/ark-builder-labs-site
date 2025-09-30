import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { MDXRemote } from 'next-mdx-remote/rsc'
import { FadeIn } from "@/components/animations/fade-in"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, ArrowLeft } from "lucide-react"
import { getBlogPost, getBlogPosts } from "@/lib/blog"
import type { ComponentPropsWithoutRef } from 'react'

interface BlogPostPageProps {
  params: Promise<{
    slug: string
  }>
}

export async function generateStaticParams() {
  const posts = getBlogPosts()
  return posts.map((post) => ({
    slug: post.slug,
  }))
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params
  const post = getBlogPost(slug)
  
  if (!post) {
    return {
      title: "Post Not Found",
    }
  }

  return {
    title: post.title,
    description: post.excerpt,
  }
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params
  const post = getBlogPost(slug)

  if (!post) {
    notFound()
  }

  const mdxComponents = {
    h1: (props: ComponentPropsWithoutRef<'h1'>) => <h1 className="text-3xl md:text-4xl font-bold mb-6" {...props} />,
    h2: (props: ComponentPropsWithoutRef<'h2'>) => <h2 className="text-2xl md:text-3xl font-semibold mb-4 mt-8" {...props} />,
    h3: (props: ComponentPropsWithoutRef<'h3'>) => <h3 className="text-xl md:text-2xl font-semibold mb-3 mt-6" {...props} />,
    p: (props: ComponentPropsWithoutRef<'p'>) => <p className="mb-4 leading-relaxed" {...props} />,
    ul: (props: ComponentPropsWithoutRef<'ul'>) => <ul className="mb-4 list-disc list-inside space-y-1" {...props} />,
    ol: (props: ComponentPropsWithoutRef<'ol'>) => <ol className="mb-4 list-decimal list-inside space-y-1" {...props} />,
    li: (props: ComponentPropsWithoutRef<'li'>) => <li className="mb-1" {...props} />,
    blockquote: (props: ComponentPropsWithoutRef<'blockquote'>) => (
      <blockquote className="border-l-4 border-primary pl-4 italic mb-4" {...props} />
    ),
    code: (props: ComponentPropsWithoutRef<'code'>) => (
      <code className="bg-muted px-1 py-0.5 rounded text-sm" {...props} />
    ),
    pre: (props: ComponentPropsWithoutRef<'pre'>) => (
      <pre className="bg-muted p-4 rounded-lg overflow-x-auto mb-4" {...props} />
    ),
    a: (props: ComponentPropsWithoutRef<'a'>) => (
      <a className="text-primary hover:underline" {...props} />
    ),
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <section className="py-20 md:py-32 bg-gradient-to-br from-background via-muted/20 to-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <FadeIn direction="up">
              <Link 
                href="/blog" 
                className="inline-flex items-center space-x-2 text-muted-foreground hover:text-primary transition-colors mb-8"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Back to Blog</span>
              </Link>
              
              <Badge className="mb-4 ml-4">{post.category}</Badge>
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                {post.title}
              </h1>
              
              <div className="flex items-center space-x-6 text-muted-foreground mb-8">
                <div className="flex items-center space-x-2">
                  <Calendar className="h-5 w-5" />
                  <span>{new Date(post.publishedAt).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="h-5 w-5" />
                  <span>{post.readTime}</span>
                </div>
              </div>
              
              {post.excerpt && (
                <p className="text-lg md:text-xl text-muted-foreground">
                  {post.excerpt}
                </p>
              )}
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <FadeIn direction="up">
              <div className="prose prose-lg max-w-none dark:prose-invert">
                <MDXRemote 
                  source={post.content} 
                  components={mdxComponents}
                />
              </div>
            </FadeIn>
          </div>
        </div>
      </section>
    </div>
  )
}