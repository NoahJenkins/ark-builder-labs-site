"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { FadeIn } from "@/components/animations/fade-in"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, ArrowRight } from "lucide-react"
import type { BlogPost } from "@/lib/blog"

interface BlogContentProps {
  blogPosts: BlogPost[]
  categories: string[]
}

export function BlogContent({ blogPosts, categories }: BlogContentProps) {
  const [selectedCategory, setSelectedCategory] = useState("All")

  const filteredPosts = selectedCategory === "All" 
    ? blogPosts 
    : blogPosts.filter(post => post.category === selectedCategory)

  const featuredPosts = filteredPosts.filter(post => post.featured)
  const regularPosts = filteredPosts.filter(post => !post.featured)

  return (
    <div className="max-w-6xl mx-auto">
      {/* Categories Filter */}
      <FadeIn direction="up" className="mb-12">
        <div className="flex flex-wrap gap-3 justify-center">
          {categories.map((category) => (
            <Badge 
              key={category} 
              variant={category === selectedCategory ? "default" : "secondary"}
              className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </Badge>
          ))}
        </div>
      </FadeIn>

      {filteredPosts.length === 0 ? (
        <FadeIn direction="up" className="text-center py-20">
          <div className="max-w-md mx-auto">
            <div className="text-6xl mb-6">🔍</div>
            <h3 className="text-2xl font-semibold mb-4">No Posts Found</h3>
            <p className="text-muted-foreground">
              No posts found in the "{selectedCategory}" category. Try selecting a different category.
            </p>
          </div>
        </FadeIn>
      ) : (
        <>
          {/* Featured Posts */}
          {featuredPosts.map((post) => (
            <FadeIn key={post.id} direction="up" className="mb-16">
              <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-card to-muted/20">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
                  <div className="aspect-video lg:aspect-square bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center relative overflow-hidden">
                    {post.image ? (
                      <Image
                        src={post.image}
                        alt={post.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 1024px) 100vw, 50vw"
                      />
                    ) : (
                      <div className="text-4xl">📝</div>
                    )}
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
                        href={`/blog/${post.slug}`}
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
          {regularPosts.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {regularPosts.map((post, index) => (
                <FadeIn key={post.id} direction="up" delay={index * 0.1}>
                  <Card className="h-full group hover:shadow-xl transition-all duration-300">
                    <div className="aspect-video bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center relative overflow-hidden">
                      {post.image ? (
                        <Image
                          src={post.image}
                          alt={post.title}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                      ) : (
                        <div className="text-2xl">📄</div>
                      )}
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
                          href={`/blog/${post.slug}`}
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
          )}
        </>
      )}
    </div>
  )
}