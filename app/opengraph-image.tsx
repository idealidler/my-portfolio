import { ImageResponse } from "next/og";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          background:
            "radial-gradient(circle at top left, rgba(129,140,248,0.45), transparent 28%), linear-gradient(135deg, #f8fbff, #eef4fb 60%, #ffffff)",
          color: "#0f172a",
          display: "flex",
          flexDirection: "column",
          height: "100%",
          justifyContent: "space-between",
          padding: "56px",
          width: "100%",
        }}
      >
        <div
          style={{
            alignItems: "center",
            display: "flex",
            gap: "20px",
          }}
        >
          <div
            style={{
              alignItems: "center",
              background: "#0f172a",
              borderRadius: "9999px",
              color: "white",
              display: "flex",
              fontSize: 38,
              fontWeight: 700,
              height: "88px",
              justifyContent: "center",
              width: "88px",
            }}
          >
            AJ
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
            }}
          >
            <div style={{ color: "#526077", fontSize: 26, letterSpacing: "0.26em", textTransform: "uppercase" }}>
              Akshay Jain
            </div>
            <div style={{ fontSize: 30 }}>Analytics Engineer and Data Product Builder</div>
          </div>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "18px",
            maxWidth: "860px",
          }}
        >
          <div style={{ fontSize: 72, fontWeight: 700, lineHeight: 1.06 }}>
            Portfolio, AkshayGPT, and recruiter-ready role-fit analysis.
          </div>
          <div style={{ color: "#526077", fontSize: 30, lineHeight: 1.35 }}>
            Enterprise BI impact, modern data products, and honest recruiter-focused evaluation.
          </div>
        </div>
      </div>
    ),
    size,
  );
}
