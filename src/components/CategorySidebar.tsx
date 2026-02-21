import Link from "next/link";
import { APP_CATEGORIES, GAME_CATEGORIES, slugify } from "@/lib/categories";

export default function CategorySidebar({ active }: { active?: string }) {
  return (
    <div style={{ width: 280, flexShrink: 0 }}>
      {/* Apps Category */}
      <div className="cat-sidebar-box">
        <div className="cat-sidebar-header">Apps Category</div>
        <div className="cat-sidebar-tabs">
          <Link href="/category/trending-apps" className={`cat-tab ${active === "trending-apps" ? "active" : ""}`}>Trending</Link>
          <Link href="/category/ec-apps" className={`cat-tab ${active === "ec-apps" ? "active" : ""}`}>Editor Choice</Link>
        </div>
        <div className="cat-sidebar-list">
          {APP_CATEGORIES.slice(0, 14).map(cat => (
            <Link key={cat} href={`/category/${slugify(cat)}`} className={`cat-sidebar-link ${active === slugify(cat) ? "active" : ""}`}>
              {cat}
            </Link>
          ))}
        </div>
      </div>

      {/* Games Category */}
      <div className="cat-sidebar-box" style={{ marginTop: 20 }}>
        <div className="cat-sidebar-header">Games Category</div>
        <div className="cat-sidebar-tabs">
          <Link href="/category/trending-games" className={`cat-tab ${active === "trending-games" ? "active" : ""}`}>Trending</Link>
          <Link href="/category/ec-games" className={`cat-tab ${active === "ec-games" ? "active" : ""}`}>Editor Choice</Link>
        </div>
        <div className="cat-sidebar-list">
          {GAME_CATEGORIES.slice(0, 12).map(cat => (
            <Link key={cat} href={`/category/${slugify(cat)}`} className={`cat-sidebar-link ${active === slugify(cat) ? "active" : ""}`}>
              {cat}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
