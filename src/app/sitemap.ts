import type { MetadataRoute } from "next"
import { SERVICES, SITE_CONFIG } from "@/lib/constants"
import { getBlogPosts } from "@/lib/blog"

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPaths = ["", "/about", "/services", "/blog", "/contact"]
  return [
    ...staticPaths.map((path) => ({ url: `${SITE_CONFIG.url}${path}` })),
    ...SERVICES.map((service) => ({ url: `${SITE_CONFIG.url}/services/${service.id}` })),
    ...getBlogPosts().map((post) => ({
      url: `${SITE_CONFIG.url}/blog/${post.slug}`,
      lastModified: new Date(post.publishedAt),
    })),
  ]
}
