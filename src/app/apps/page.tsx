import { db } from "@/lib/db";
import type { App } from "@/lib/types";
import AppGrid from "@/components/AppGrid";

export const dynamic = "force-dynamic";
export const metadata = { title: "All Apps - PunoAppStore", description: "Browse and download the best free Android apps on PunoAppStore." };

async function getAllApps(): Promise<App[]> {
  const res = await db.query(
    `SELECT * FROM apps WHERE app_type = 'app' ORDER BY
       CASE WHEN installs LIKE '%B+' THEN 10 WHEN installs LIKE '%M+' THEN 9 WHEN installs LIKE '%K+' THEN 8 ELSE 0 END DESC,
       CAST(REGEXP_REPLACE(installs, '[^0-9]', '', 'g') AS BIGINT) DESC NULLS LAST,
       rating DESC NULLS LAST`
  );
  return res.rows;
}

export default async function AppsPage() {
  const apps = await getAllApps();
  return (
    <div className="wrap" style={{ paddingTop: 28, paddingBottom: 40 }}>
      <div className="page-header">
        <h1>All Apps</h1>
        <span className="count">{apps.length} apps</span>
      </div>
      <AppGrid apps={apps} variant="dense" />
    </div>
  );
}
