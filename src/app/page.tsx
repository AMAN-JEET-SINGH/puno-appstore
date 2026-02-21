import { db } from "@/lib/db";
import type { App } from "@/lib/types";
import Hero from "@/components/Hero";
import AppGrid from "@/components/AppGrid";
import SectionHeader from "@/components/SectionHeader";

export const dynamic = "force-dynamic";

const TRENDING_ORDER = `
  CASE WHEN installs LIKE '%B+' THEN 10 WHEN installs LIKE '%M+' THEN 9 WHEN installs LIKE '%K+' THEN 8 ELSE 0 END DESC,
  CAST(REGEXP_REPLACE(installs, '[^0-9]', '', 'g') AS BIGINT) DESC NULLS LAST,
  rating DESC NULLS LAST`;

async function getTrendingApps(): Promise<App[]> {
  const res = await db.query(`SELECT * FROM apps WHERE app_type = 'app' ORDER BY ${TRENDING_ORDER} LIMIT 12`);
  return res.rows;
}

async function getTrendingGames(): Promise<App[]> {
  const res = await db.query(`SELECT * FROM apps WHERE app_type = 'game' ORDER BY ${TRENDING_ORDER} LIMIT 12`);
  return res.rows;
}

async function getEcApps(): Promise<App[]> {
  const res = await db.query(`SELECT * FROM apps WHERE app_type = 'app' AND rating >= 4.0 ORDER BY rating DESC NULLS LAST LIMIT 12`);
  return res.rows;
}

async function getEcGames(): Promise<App[]> {
  const res = await db.query(`SELECT * FROM apps WHERE app_type = 'game' AND rating >= 4.0 ORDER BY rating DESC NULLS LAST LIMIT 12`);
  return res.rows;
}

export default async function HomePage() {
  const [tApps, tGames, ecApps, ecGames] = await Promise.all([
    getTrendingApps(), getTrendingGames(), getEcApps(), getEcGames(),
  ]);

  return (
    <div>
      <Hero />
      <div className="wrap" style={{ paddingTop: 32, paddingBottom: 40 }}>
        <div className="content-card">
          <SectionHeader title="Trending Apps" href="/category/trending-apps" />
          <AppGrid apps={tApps} />
        </div>
        <div className="content-card">
          <SectionHeader title="Trending Games" href="/category/trending-games" />
          <AppGrid apps={tGames} />
        </div>
        <div className="content-card">
          <SectionHeader title="Editor's Choice Apps" href="/category/ec-apps" />
          <AppGrid apps={ecApps} />
        </div>
        <div className="content-card">
          <SectionHeader title="Editor's Choice Games" href="/category/ec-games" />
          <AppGrid apps={ecGames} />
        </div>
      </div>
    </div>
  );
}
