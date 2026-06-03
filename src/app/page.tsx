import { HeroSection } from "@/components/sections/hero"
import { ServicesOverview } from "@/components/sections/services-overview"
import { StatsSection } from "@/components/sections/stats"
import { CTASection } from "@/components/sections/cta-section"

export default function Home() {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <ServicesOverview />
      <StatsSection />
      <CTASection />
    </div>
  )
}
