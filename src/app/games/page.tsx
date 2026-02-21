import { db } from "@/lib/db";
import type { App } from "@/lib/types";
import AppGrid from "@/components/AppGrid";

export const dynamic = "force-dynamic";
export const metadata = { title: "All Games - PunoAppStore", description: "Browse and download the best free Android games on PunoAppStore." };

async function getAllGames(): Promise<App[]> {
  const res = await db.query(
    `SELECT * FROM apps WHERE app_type = 'game' ORDER BY
       CASE WHEN installs LIKE '%B+' THEN 10 WHEN installs LIKE '%M+' THEN 9 WHEN installs LIKE '%K+' THEN 8 ELSE 0 END DESC,
       CAST(REGEXP_REPLACE(installs, '[^0-9]', '', 'g') AS BIGINT) DESC NULLS LAST,
       rating DESC NULLS LAST`
  );
  return res.rows;
}

export default async function GamesPage() {
  const games = await getAllGames();
  return (
    <div className="wrap" style={{ paddingTop: 28, paddingBottom: 40 }}>
      <div className="page-header">
        <h1>All Games</h1>
        <span className="count">{games.length} games</span>
      </div>
      <AppGrid apps={games} variant="dense" />
    </div>
  );
}
