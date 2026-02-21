import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import type { App } from "@/lib/types";
import { getCategoryMeta } from "@/lib/categories";
import AppGrid from "@/components/AppGrid";
import CategorySidebar from "@/components/CategorySidebar";

export const dynamic = "force-dynamic";

interface PageProps { params: Promise<{ slug: string }> }

const TRENDING_ORDER = `
  CASE WHEN installs LIKE '%B+' THEN 10 WHEN installs LIKE '%M+' THEN 9 WHEN installs LIKE '%K+' THEN 8 ELSE 0 END DESC,
  CAST(REGEXP_REPLACE(installs, '[^0-9]', '', 'g') AS BIGINT) DESC NULLS LAST,
  rating DESC NULLS LAST`;

const RATING_ORDER = `rating DESC NULLS LAST, installs DESC NULLS LAST`;

async function getApps(meta: NonNullable<ReturnType<typeof getCategoryMeta>>): Promise<App[]> {
  const order = meta.sort === "rating" ? RATING_ORDER : TRENDING_ORDER;

  if (meta.query) {
    // Specific category
    const res = await db.query(
      `SELECT * FROM apps WHERE category ILIKE $1 ORDER BY ${order}`,
      [`%${meta.query}%`]
    );
    return res.rows;
  }
  // All apps/games of that type
  const res = await db.query(
    `SELECT * FROM apps WHERE app_type = $1 ORDER BY ${order}`,
    [meta.type]
  );
  return res.rows;
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const meta = getCategoryMeta(slug);
  if (!meta) return { title: "Not Found - PunoAppStore" };
  return { title: `${meta.title} - PunoAppStore`, description: `Browse ${meta.title} on PunoAppStore.` };
}

export default async function CategoryPage({ params }: PageProps) {
  const { slug } = await params;
  const meta = getCategoryMeta(slug);
  if (!meta) notFound();

  const apps = await getApps(meta);

  return (
    <div className="wrap" style={{ paddingTop: 28, paddingBottom: 40 }}>
      <div className="cat-layout">
        <div className="cat-main">
          <h1 style={{ fontSize: 22, fontWeight: 700, color: "#333", marginBottom: 24 }}>{meta.title}</h1>
          {apps.length > 0 ? (
            <AppGrid apps={apps} variant="dense-5" />
          ) : (
            <div className="empty-state">
              <p>No apps found in this category.</p>
            </div>
          )}
        </div>
        <CategorySidebar active={slug} />
      </div>
    </div>
  );
}
