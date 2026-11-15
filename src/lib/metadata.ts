import type { Metadata } from "next"
import { SITE_CONFIG } from "@/lib/constants"

interface PageMetadataInput {
  title: string
  description: string
  /** Path starting with "/", resolved against metadataBase. */
  path: string
  type?: "website" | "article"
  images?: string[]
}

/** Per-page metadata with a matching canonical URL, Open Graph and Twitter card. */
export function pageMetadata({ title, description, path, type = "website", images }: PageMetadataInput): Metadata {
  // A child openGraph/twitter object replaces the root one, including the
  // file-based image, so default to the shared card image explicitly.
  const ogImages = images ?? ["/opengraph-image"]
  const twitterImages = images ?? ["/twitter-image"]
  const fullTitle = `${title} | ${SITE_CONFIG.name}`
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type,
      locale: "en_US",
      url: path,
      title: fullTitle,
      description,
      siteName: SITE_CONFIG.name,
      images: ogImages,
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: twitterImages,
    },
  }
}
