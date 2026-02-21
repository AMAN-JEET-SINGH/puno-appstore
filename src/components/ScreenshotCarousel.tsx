"use client";
import { useRef } from "react";

export default function ScreenshotCarousel({ appId, screenshots }: { appId: string; screenshots: string[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const scroll = (d: number) => ref.current?.scrollBy({ left: d, behavior: "smooth" });

  return (
    <div style={{ position: "relative" }}>
      <div ref={ref} className="ss-scroll">
        {screenshots.map((f, i) => (
          <img key={i} src={`/apps/${appId}/${f}`} alt={`Screenshot ${i+1}`} loading="lazy" />
        ))}
      </div>
      {screenshots.length > 2 && (
        <button
          onClick={() => scroll(320)}
          style={{
            position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)",
            width: 44, height: 44, borderRadius: "50%",
            background: "rgba(0,0,0,0.55)", border: "none", cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 2px 8px rgba(0,0,0,0.2)", transition: "background 0.15s",
          }}
          onMouseEnter={e => (e.currentTarget.style.background = "rgba(0,0,0,0.7)")}
          onMouseLeave={e => (e.currentTarget.style.background = "rgba(0,0,0,0.55)")}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><path d="m9 18 6-6-6-6"/></svg>
        </button>
      )}
    </div>
  );
}
