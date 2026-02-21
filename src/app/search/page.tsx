import { db } from "@/lib/db";
import type { App } from "@/lib/types";
import AppGrid from "@/components/AppGrid";

export const dynamic = "force-dynamic";

interface SearchPageProps { searchParams: Promise<{ q?: string }> }

async function searchApps(q: string): Promise<App[]> {
  const res = await db.query(
    `SELECT * FROM apps WHERE name ILIKE $1 OR developer ILIKE $1 OR category ILIKE $1 ORDER BY rating DESC NULLS LAST LIMIT 60`,
    [`%${q}%`]
  );
  return res.rows;
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { q } = await searchParams;
  const query = q || "";
  const results = query ? await searchApps(query) : [];

  return (
    <div className="wrap" style={{ paddingTop: 28, paddingBottom: 40 }}>
      <div className="page-header" style={{ flexDirection: "column", alignItems: "flex-start", gap: 4 }}>
        <h1>Search Results</h1>
        {query && <p style={{ fontSize: 13, color: "#999" }}>{results.length} results for &ldquo;{query}&rdquo;</p>}
      </div>
      {results.length > 0 ? (
        <AppGrid apps={results} />
      ) : (
        <div className="empty-state">
          <p>{query ? "No apps found." : "Enter a search term to find apps."}</p>
        </div>
      )}
    </div>
  );
}
