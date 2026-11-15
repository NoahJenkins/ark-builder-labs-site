import type { Metadata } from "next"
import { pageMetadata } from "@/lib/metadata"
import { ServicesPageContent } from "@/components/pages/services-page"

export const metadata: Metadata = pageMetadata({
  title: "Our Services",
  description: "Comprehensive technology solutions including Web/Mobile Development, Cloud Engineering, and AI Consulting services.",
  path: "/services",
})

export default function ServicesPage() {
  return <ServicesPageContent />
}