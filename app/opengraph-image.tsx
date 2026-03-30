import { ImageResponse } from "next/og"

export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          width: 1200,
          height: 630,
          backgroundColor: "#01255f",
          position: "relative",
          overflow: "hidden",
          fontFamily: "sans-serif",
        }}
      >
        {/* Yellow top bar */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 5,
            backgroundColor: "#fee11b",
          }}
        />

        {/* Yellow left accent */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: 8,
            height: 630,
            backgroundColor: "#fee11b",
          }}
        />

        {/* Content */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            padding: "80px 100px",
            gap: 0,
          }}
        >
          {/* GSA mark */}
          <div
            style={{
              color: "#fee11b",
              fontSize: 100,
              fontWeight: 900,
              lineHeight: 0.85,
              letterSpacing: "-0.02em",
            }}
          >
            GSA
          </div>

          {/* Full name */}
          <div
            style={{
              color: "white",
              fontSize: 36,
              fontWeight: 700,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              marginTop: 20,
            }}
          >
            Gayduo Sports Agency
          </div>

          {/* Divider */}
          <div
            style={{
              width: 60,
              height: 3,
              backgroundColor: "#fee11b",
              marginTop: 32,
              marginBottom: 32,
            }}
          />

          {/* Tagline */}
          <div
            style={{
              color: "rgba(255,255,255,0.6)",
              fontSize: 22,
              lineHeight: 1.5,
              maxWidth: 620,
            }}
          >
            Elite career management for African football talent. Fewer players, more impact.
          </div>

          {/* URL */}
          <div
            style={{
              color: "rgba(255,255,255,0.3)",
              fontSize: 16,
              letterSpacing: "0.1em",
              marginTop: 48,
              textTransform: "uppercase",
            }}
          >
            gayduosa.org
          </div>
        </div>

        {/* Decorative large GSA watermark */}
        <div
          style={{
            position: "absolute",
            right: -20,
            bottom: -40,
            color: "rgba(255,255,255,0.04)",
            fontSize: 340,
            fontWeight: 900,
            lineHeight: 1,
            letterSpacing: "-0.04em",
          }}
        >
          GSA
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  )
}
