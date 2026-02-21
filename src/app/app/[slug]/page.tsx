import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import type { App, Screenshot } from "@/lib/types";
import StarRating from "@/components/StarRating";
import ScreenshotCarousel from "@/components/ScreenshotCarousel";
import SidebarApp from "@/components/SidebarApp";
import AppGrid from "@/components/AppGrid";

export const dynamic = "force-dynamic";

interface PageProps { params: Promise<{ slug: string }> }

async function getApp(slug: string): Promise<App | null> {
  const res = await db.query("SELECT * FROM apps WHERE slug = $1", [slug]);
  return res.rows[0] || null;
}
async function getScreenshots(appId: string): Promise<Screenshot[]> {
  const res = await db.query("SELECT * FROM screenshots WHERE app_id = $1 ORDER BY id", [appId]);
  return res.rows;
}
async function getSidebarApps(excludeId: string, type: string): Promise<App[]> {
  const res = await db.query("SELECT * FROM apps WHERE app_id != $1 AND app_type = $2 ORDER BY rating DESC NULLS LAST LIMIT 10", [excludeId, type]);
  return res.rows;
}
async function getRecommended(excludeId: string): Promise<App[]> {
  const res = await db.query("SELECT * FROM apps WHERE app_id != $1 ORDER BY RANDOM() LIMIT 15", [excludeId]);
  return res.rows;
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const app = await getApp(slug);
  if (!app) return { title: "Not Found - PunoAppStore" };
  return { title: `${app.name} APK Download - PunoAppStore`, description: `Download ${app.name} by ${app.developer} on PunoAppStore.` };
}

export default async function AppDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const app = await getApp(slug);
  if (!app) notFound();

  const playUrl = `https://play.google.com/store/apps/details?id=${app.app_id}`;
  const [screenshots, sidebar, recommended] = await Promise.all([
    getScreenshots(app.app_id),
    getSidebarApps(app.app_id, app.app_type),
    getRecommended(app.app_id),
  ]);

  const rows = [
    { l: "Category", v: app.category },
    { l: "Installs", v: app.installs },
    { l: "Content Rating", v: app.content_rating },
    { l: "Developer Email", v: app.developer_email },
    { l: "Privacy Policy", v: app.privacy_policy ? "link" : null, link: app.privacy_policy },
    { l: "Price", v: app.price },
    { l: "Size", v: app.size },
  ].filter((r) => r.v);

  return (
    <div className="detail-bg">
      <div className="wrap" style={{ paddingTop: 28, paddingBottom: 40 }}>
        <div className="detail-grid">
          {/* Main Column */}
          <div className="detail-main">

            {/* App Header Card */}
            <div className="dcard">
              <div style={{ display: "flex", gap: 20, alignItems: "flex-start" }}>
                <img
                  src={`/apps/${app.app_id}/${app.icon_file}`}
                  alt={app.name}
                  style={{ width: 96, height: 96, borderRadius: 22, objectFit: "cover", flexShrink: 0, border: "1px solid #e8e8e8" }}
                />
                <div style={{ minWidth: 0, paddingTop: 4 }}>
                  <h1 style={{ fontSize: 24, fontWeight: 700, color: "#333", lineHeight: 1.2 }}>{app.name}</h1>
                  <p style={{ fontSize: 14, color: "#5b8def", fontWeight: 500, marginTop: 6 }}>{app.developer}</p>
                  <div style={{ marginTop: 8 }}><StarRating rating={app.rating} size="md" /></div>
                </div>
              </div>
            </div>

            {/* Screenshots */}
            {screenshots.length > 0 && (
              <div className="dcard">
                <h2 style={{ fontSize: 17, fontWeight: 700, color: "#333", marginBottom: 16 }}>Screenshots</h2>
                <ScreenshotCarousel appId={app.app_id} screenshots={screenshots.map((s) => s.file_name)} />
              </div>
            )}

            {/* Download Button */}
            <a href={playUrl} target="_blank" rel="noopener noreferrer" className="dl-btn">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              Download Latest APK
            </a>

            {/* About This App */}
            <div className="dcard">
              <h2 style={{ fontSize: 17, fontWeight: 700, color: "#333", marginBottom: 12 }}>About This App</h2>
              <table className="about-table">
                <tbody>
                  {rows.map((r) => (
                    <tr key={r.l}>
                      <td className="label">{r.l}</td>
                      <td className="value">
                        {r.l === "Privacy Policy" && r.link ? (
                          <a href={r.link} target="_blank" rel="noopener noreferrer" style={{ color: "#5b8def", fontWeight: 500 }}>{r.link.length > 50 ? r.link.slice(0, 50) + "..." : r.link}</a>
                        ) : r.v}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Description */}
            {app.description && (
              <div className="dcard">
                <h2 style={{ fontSize: 17, fontWeight: 700, color: "#333", marginBottom: 12 }}>Description</h2>
                <div
                  style={{ fontSize: 14, color: "#555", lineHeight: 1.8, whiteSpace: "pre-line" }}
                  dangerouslySetInnerHTML={{ __html: app.description.replace(/\n/g, "<br/>") }}
                />
              </div>
            )}

            {/* Recommended */}
            {recommended.length > 0 && (
              <div className="dcard">
                <h2 style={{ fontSize: 17, fontWeight: 700, color: "#333", marginBottom: 20 }}>You May Also Like</h2>
                <AppGrid apps={recommended} variant="five" />
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="detail-side">
            <div className="dcard" style={{ position: "sticky", top: 76 }}>
              <h3 style={{ fontSize: 14, fontWeight: 700, color: "#333", marginBottom: 8, paddingBottom: 10, borderBottom: "1px solid #f0f0f0" }}>
                Popular {app.app_type === "game" ? "Games" : "Apps"}
              </h3>
              {sidebar.map((s) => <SidebarApp key={s.app_id} app={s} />)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
