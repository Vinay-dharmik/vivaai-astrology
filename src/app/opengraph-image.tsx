import { ImageResponse } from "next/og";

// Site-wide default Open Graph image. Next.js uses this for og:image on every
// route that doesn't define its own — fixes blank WhatsApp/Twitter/FB share cards.
export const runtime = "edge";
export const alt = "VivaAI Astrology — Free Vedic Kundali & Birth Chart";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #0a0b14 0%, #1a1230 55%, #30203f 100%)",
          color: "#fff7ea",
          fontFamily: "sans-serif",
          position: "relative",
        }}
      >
        {/* Decorative glow */}
        <div
          style={{
            position: "absolute",
            top: 120,
            width: 520,
            height: 520,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(255,179,71,0.25) 0%, rgba(255,179,71,0) 70%)",
            display: "flex",
          }}
        />
        <div style={{ display: "flex", alignItems: "center", gap: 18, marginBottom: 24 }}>
          <div style={{ fontSize: 64, display: "flex" }}>✦</div>
          <div
            style={{
              fontSize: 72,
              fontWeight: 800,
              background: "linear-gradient(120deg, #fff9ef, #ffd4a1)",
              backgroundClip: "text",
              color: "transparent",
              display: "flex",
            }}
          >
            VivaAI Astrology
          </div>
        </div>
        <div style={{ fontSize: 40, color: "#dfd2bf", display: "flex", textAlign: "center", maxWidth: 900 }}>
          Free Vedic Kundali, Horoscope & Compatibility
        </div>
        <div
          style={{
            marginTop: 40,
            fontSize: 26,
            color: "#9d8f80",
            display: "flex",
            gap: 28,
          }}
        >
          <span style={{ display: "flex" }}>Lagna</span>
          <span style={{ display: "flex", color: "#ffb347" }}>•</span>
          <span style={{ display: "flex" }}>Nakshatra</span>
          <span style={{ display: "flex", color: "#ffb347" }}>•</span>
          <span style={{ display: "flex" }}>Dasha</span>
          <span style={{ display: "flex", color: "#ffb347" }}>•</span>
          <span style={{ display: "flex" }}>Remedies</span>
        </div>
        <div
          style={{
            position: "absolute",
            bottom: 48,
            fontSize: 28,
            color: "#ffb347",
            fontWeight: 600,
            display: "flex",
          }}
        >
          vivaai.in
        </div>
      </div>
    ),
    { ...size }
  );
}
