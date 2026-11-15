import { ImageResponse } from "next/og"
import { SITE_CONFIG } from "@/lib/constants"

export const alt = SITE_CONFIG.name
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: 80,
          background: "linear-gradient(135deg, #0A1628 0%, #2B5797 100%)",
          color: "#ffffff",
        }}
      >
        <div style={{ fontSize: 88, fontWeight: 700 }}>{SITE_CONFIG.name}</div>
        <div style={{ fontSize: 40, marginTop: 24, color: "#cbd5e1" }}>{SITE_CONFIG.tagline}</div>
      </div>
    ),
    size
  )
}
