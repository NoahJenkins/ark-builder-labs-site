"use client"

import Cal, { getCalApi } from "@calcom/embed-react"
import { useEffect } from "react"

export function ConsultationCalendar() {
  useEffect(() => {
    (async function () {
      const cal = await getCalApi({ namespace: "consultation" })
      cal("ui", {
        hideEventTypeDetails: false,
        layout: "month_view",
        styles: {
          branding: {
            brandColor: "transparent"
          }
        }
      })
    })()
  }, [])

  return (
    <div className="w-full cal-container overflow-hidden">
      <Cal
        namespace="consultation"
        calLink="noahjenkins/consultation"
        style={{
          width: "100%",
          height: "auto",
          minHeight: "500px",
          overflow: "hidden"
        }}
        config={{
          layout: "month_view"
        }}
      />
      <style jsx>{`
        .cal-container {
          /* Hide all possible branding elements */
          --cal-brand-color: transparent;
        }
        
        .cal-container :global(.cal-branding),
        .cal-container :global([data-testid="branding"]),
        .cal-container :global(.powered-by),
        .cal-container :global(a[href*="cal.com"]),
        .cal-container :global([href*="cal.com"]),
        .cal-container :global(.cal-brand),
        .cal-container :global(.branding),
        .cal-container :global(footer),
        .cal-container :global(.footer),
        .cal-container :global([data-cal-branding]),
        .cal-container :global(.cal-embed-footer),
        .cal-container :global(.cal-embed-branding) {
          display: none !important;
          visibility: hidden !important;
          opacity: 0 !important;
          height: 0 !important;
          overflow: hidden !important;
        }
        
        /* Remove extra spacing at bottom */
        .cal-container :global(iframe) {
          margin-bottom: 0 !important;
          padding-bottom: 0 !important;
        }
        
        /* Ensure no scrollbars on the container */
        .cal-container {
          overflow: hidden !important;
        }
        
        /* Hide any potential bottom padding or margins */
        .cal-container :global(*:last-child) {
          margin-bottom: 0 !important;
          padding-bottom: 0 !important;
        }
        
        /* Custom brand color override */
        .cal-container :global(*) {
          --cal-brand: transparent !important;
          --cal-brand-emphasis: transparent !important;
          --cal-brand-subtle: transparent !important;
        }
      `}</style>
    </div>
  )
}