import Link from "next/link";
import StarRating from "./StarRating";
import type { App } from "@/lib/types";

export default function SidebarApp({ app }: { app: App }) {
  return (
    <Link href={`/app/${app.slug}`} className="sb-item">
      <img src={`/apps/${app.app_id}/${app.icon_file}`} alt={app.name} loading="lazy" />
      <div style={{ minWidth: 0, flex: 1 }}>
        <div className="sb-name">{app.name}</div>
        <div className="sb-dev">{app.developer}</div>
        <StarRating rating={app.rating} />
      </div>
    </Link>
  );
}
