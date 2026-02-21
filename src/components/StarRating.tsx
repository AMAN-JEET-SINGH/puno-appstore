export default function StarRating({ rating, size = "sm" }: { rating: number; size?: "sm" | "md" }) {
  const r = Number(rating) || 0;
  const full = Math.floor(r);
  const half = r - full >= 0.25;
  const sz = size === "sm" ? 14 : 17;
  const stars = [];
  for (let i = 0; i < 5; i++) stars.push(<span key={i} style={{ fontSize: sz, color: i < full || (i === full && half) ? "#d4a017" : "#ddd" }}>&#9733;</span>);
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}>
      <span style={{ display: "flex" }}>{stars}</span>
      <span style={{ fontSize: size === "sm" ? 13 : 15, fontWeight: 600, color: "#888" }}>{r ? r.toFixed(1) : "N/A"}</span>
    </span>
  );
}
