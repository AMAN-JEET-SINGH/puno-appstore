import Link from "next/link";

export default function NotFound() {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "60vh", padding: 24 }}>
      <span style={{ fontSize: 64, fontWeight: 800, color: "#c8a015", marginBottom: 12 }}>404</span>
      <h2 style={{ fontSize: 18, fontWeight: 600, color: "#333", marginBottom: 4 }}>Page Not Found</h2>
      <p style={{ fontSize: 14, color: "#999", marginBottom: 24 }}>The page you&apos;re looking for doesn&apos;t exist.</p>
      <Link href="/" style={{ padding: "10px 24px", background: "#5b8def", color: "#fff", fontSize: 14, fontWeight: 600, borderRadius: 8, display: "inline-block" }}>
        Back to Home
      </Link>
    </div>
  );
}
