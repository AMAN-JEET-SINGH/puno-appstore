"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface Result {
  app_id: string;
  name: string;
  developer: string;
  icon_file: string;
  slug: string;
  rating: number;
}

export default function Hero() {
  const [q, setQ] = useState("");
  const [results, setResults] = useState<Result[]>([]);
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const wrapRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout>>(null);

  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    const val = q.trim();
    if (!val) { setResults([]); setOpen(false); return; }

    timerRef.current = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(val)}`);
        const data = await res.json();
        setResults(data);
        setOpen(data.length > 0);
      } catch { setResults([]); setOpen(false); }
    }, 200);

    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [q]);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  function go(e: React.FormEvent) {
    e.preventDefault();
    if (q.trim()) { setOpen(false); router.push(`/search?q=${encodeURIComponent(q.trim())}`); }
  }

  return (
    <div className="hero">
      <h1>PunoAppStore.com</h1>
      <div ref={wrapRef} style={{ position: "relative", zIndex: 10, width: "100%", maxWidth: 540 }}>
        <form onSubmit={go} className="hero-search">
          <input
            value={q}
            onChange={e => { setQ(e.target.value); setOpen(true); }}
            onFocus={() => { if (results.length > 0) setOpen(true); }}
            placeholder="Search..."
          />
        </form>
        {open && results.length > 0 && (
          <div style={{
            position: "absolute", top: "100%", left: 0, right: 0,
            background: "#fff", borderRadius: "0 0 8px 8px",
            boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
            maxHeight: 400, overflowY: "auto",
          }}>
            {results.map(app => (
              <Link
                key={app.app_id}
                href={`/app/${app.slug}`}
                onClick={() => setOpen(false)}
                style={{
                  display: "flex", alignItems: "center", gap: 12,
                  padding: "10px 16px", borderBottom: "1px solid #f0f0f0",
                  transition: "background 0.1s",
                }}
                onMouseEnter={e => (e.currentTarget.style.background = "#f8f8f8")}
                onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
              >
                <img
                  src={`/apps/${app.app_id}/${app.icon_file}`}
                  alt={app.name}
                  style={{ width: 40, height: 40, borderRadius: 10, objectFit: "cover", flexShrink: 0, border: "1px solid #eee" }}
                />
                <div style={{ minWidth: 0, flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: "#333", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{app.name}</div>
                  <div style={{ fontSize: 12, color: "#888" }}>{app.developer}</div>
                </div>
                <span style={{ fontSize: 12, color: "#999", flexShrink: 0 }}>
                  <span style={{ color: "#d4a017" }}>&#9733;</span> {app.rating ? Number(app.rating).toFixed(1) : "N/A"}
                </span>
              </Link>
            ))}
            <Link
              href={`/search?q=${encodeURIComponent(q.trim())}`}
              onClick={() => setOpen(false)}
              style={{
                display: "block", textAlign: "center", padding: "10px 16px",
                fontSize: 13, fontWeight: 600, color: "#5b8def",
              }}
            >
              See all results &raquo;
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
