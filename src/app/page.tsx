import { CTASection } from "@/components/sections/cta-section"
import { HeroSection } from "@/components/sections/hero"
import { ServicesOverview } from "@/components/sections/services-overview"
import { StatsSection } from "@/components/sections/stats"

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <HeroSection />
      <ServicesOverview />
      <StatsSection />
      <CTASection />
    </div>
  )
}
