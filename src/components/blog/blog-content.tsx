"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { ArrowRight, Calendar, Clock } from "lucide-react"
import { FadeIn } from "@/components/animations/fade-in"
import { Badge } from "@/components/ui/badge"
import type { BlogPost } from "@/lib/blog"
import { encodePathSegment } from "@/lib/security"
import { cn } from "@/lib/utils"

interface BlogContentProps {
  blogPosts: BlogPost[]
  categories: string[]
}

function formatPostDate(value: string) {
  const [year, month, day] = value.split("-").map(Number)

  if (year && month && day) {
    return new Intl.DateTimeFormat("en-US", {
      month: "numeric",
      day: "numeric",
      year: "numeric",
      timeZone: "UTC",
    }).format(new Date(Date.UTC(year, month - 1, day)))
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "numeric",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value))
}

function PostImage({ post, featured = false }: { post: BlogPost; featured?: boolean }) {
  if (post.image) {
    return (
      <Image
        src={post.image}
        alt={post.title}
        fill
        className="object-cover transition duration-500 group-hover:scale-[1.025]"
        sizes={featured ? "(max-width: 1024px) 100vw, 46vw" : "(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"}
      />
    )
  }

  return (
    <div className="flex h-full min-h-48 flex-col justify-between bg-[linear-gradient(135deg,var(--paper-warm),var(--card))] p-5">
      <span className="text-sm font-medium text-primary">Field note</span>
      <div className="space-y-3" aria-hidden="true">
        <div className="h-px w-3/4 bg-primary/30" />
        <div className="h-px w-1/2 bg-border" />
        <div className="h-px w-2/3 bg-border" />
      </div>
    </div>
  )
}

function PostMeta({ post, className }: { post: BlogPost; className?: string }) {
  return (
    <div className={cn("flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted-foreground", className)}>
      <span className="inline-flex items-center gap-2">
        <Calendar className="h-4 w-4 text-primary/70" aria-hidden="true" />
        {formatPostDate(post.publishedAt)}
      </span>
      <span className="inline-flex items-center gap-2">
        <Clock className="h-4 w-4 text-primary/70" aria-hidden="true" />
        {post.readTime}
      </span>
    </div>
  )
}

function ReadLink({ post, compact = false }: { post: BlogPost; compact?: boolean }) {
  return (
    <Link
      href={`/blog/${encodePathSegment(post.slug)}`}
      aria-label={`Read field note: ${post.title}`}
      className={cn(
        "group/link inline-flex min-h-11 items-center gap-2 font-medium text-primary underline-offset-4 transition hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        compact ? "text-sm" : "text-base"
      )}
    >
      <span>Read field note<span className="sr-only">: {post.title}</span></span>
      <ArrowRight className="h-4 w-4 transition-transform group-hover/link:translate-x-1" aria-hidden="true" />
    </Link>
  )
}

export function BlogContent({ blogPosts, categories }: BlogContentProps) {
  const [selectedCategory, setSelectedCategory] = useState("All")

  const filteredPosts = selectedCategory === "All"
    ? blogPosts
    : blogPosts.filter((post) => post.category === selectedCategory)

  const featuredPosts = filteredPosts.filter((post) => post.featured)
  const regularPosts = filteredPosts.filter((post) => !post.featured)
  const archivePosts = featuredPosts.length > 0 ? regularPosts : filteredPosts

  return (
    <div className="mx-auto max-w-6xl">
      <FadeIn direction="up" className="mb-12">
        <div className="flex flex-col gap-4 border-b border-border/80 pb-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="mb-2 text-sm font-medium text-primary">Notebook index</p>
            <h2 className="text-2xl font-semibold md:text-3xl">Browse the field notes</h2>
          </div>

          <div className="flex flex-wrap gap-2" aria-label="Filter blog posts by category">
            {categories.map((category) => {
              const isSelected = category === selectedCategory

              return (
                <button
                  key={category}
                  type="button"
                  aria-pressed={isSelected}
                  onClick={() => setSelectedCategory(category)}
                  className={cn(
                    "min-h-10 rounded-full border px-4 text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                    isSelected
                      ? "border-primary bg-primary text-primary-foreground shadow-sm"
                      : "border-border bg-background text-muted-foreground hover:border-primary/40 hover:text-primary"
                  )}
                >
                  {category}
                </button>
              )
            })}
          </div>
        </div>
      </FadeIn>

      {filteredPosts.length === 0 ? (
        <FadeIn direction="up" className="py-16">
          <div className="mx-auto max-w-lg border-y border-border/80 py-10 text-center">
            <p className="mb-2 text-sm font-medium text-primary">No notes in this drawer</p>
            <h3 className="mb-3 text-2xl font-semibold">No Posts Found</h3>
            <p className="text-muted-foreground">
              No posts found in the "{selectedCategory}" category. Try selecting a different category.
            </p>
          </div>
        </FadeIn>
      ) : (
        <>
          {featuredPosts.map((post) => (
            <FadeIn key={post.id} direction="up" className="mb-14 md:mb-20">
              <article className="group overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
                <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1fr)]">
                  <div className="relative min-h-72 overflow-hidden border-b border-border bg-muted lg:min-h-[30rem] lg:border-b-0 lg:border-r">
                    <PostImage post={post} featured />
                  </div>

                  <div className="flex flex-col justify-between gap-10 p-6 md:p-10">
                    <div>
                      <div className="mb-6 flex flex-wrap items-center gap-3">
                        <span className="rounded-full border border-primary/20 bg-primary/7 px-3 py-1 text-sm font-medium text-primary">
                          Latest field note
                        </span>
                        <Badge variant="secondary" className="bg-secondary/80 text-secondary-foreground">
                          {post.category}
                        </Badge>
                      </div>
                      <h2 className="mb-5 max-w-2xl text-3xl font-semibold leading-tight text-foreground md:text-4xl">
                        {post.title}
                      </h2>
                      <p className="max-w-2xl text-base leading-8 text-muted-foreground md:text-lg">
                        {post.excerpt}
                      </p>
                    </div>

                    <div className="flex flex-col gap-5 border-t border-border/80 pt-6 sm:flex-row sm:items-center sm:justify-between">
                      <PostMeta post={post} />
                      <ReadLink post={post} />
                    </div>
                  </div>
                </div>
              </article>
            </FadeIn>
          ))}

          {archivePosts.length > 0 && (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
              {archivePosts.map((post, index) => (
                <FadeIn key={post.id} direction="up" delay={index * 0.08}>
                  <article className="group flex h-full flex-col overflow-hidden rounded-xl border border-border bg-card shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-md">
                    <div className="relative aspect-[16/10] overflow-hidden border-b border-border bg-muted">
                      <PostImage post={post} />
                    </div>

                    <div className="flex flex-1 flex-col p-6">
                      <Badge variant="secondary" className="mb-4 w-fit bg-secondary/80 text-secondary-foreground">
                        {post.category}
                      </Badge>
                      <h3 className="mb-3 line-clamp-2 text-xl font-semibold leading-snug">
                        {post.title}
                      </h3>
                      <p className="mb-6 line-clamp-3 text-sm leading-6 text-muted-foreground">
                        {post.excerpt}
                      </p>
                      <div className="mt-auto space-y-4 border-t border-border/80 pt-5">
                        <PostMeta post={post} className="text-xs" />
                        <ReadLink post={post} compact />
                      </div>
                    </div>
                  </article>
                </FadeIn>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}
