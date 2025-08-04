import type { Metadata } from "next"
import { ServicesPageContent } from "@/components/pages/services-page"

export const metadata: Metadata = {
  title: "Our Services",
  description: "Comprehensive technology solutions including Web/Mobile Development, Cloud Engineering, and AI Consulting services.",
}

export default function ServicesPage() {
  return <ServicesPageContent />
}