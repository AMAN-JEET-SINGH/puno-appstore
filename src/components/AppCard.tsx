import Link from "next/link";
import StarRating from "./StarRating";
import type { App } from "@/lib/types";

export default function AppCard({ app }: { app: App }) {
  return (
    <Link href={`/app/${app.slug}`} className="acard">
      <div className="acard-icon">
        <img src={`/apps/${app.app_id}/${app.icon_file}`} alt={app.name} loading="lazy" />
      </div>
      <div className="acard-name">{app.name}</div>
      <div className="acard-dev">{app.developer}</div>
      <div className="acard-rating">
        <StarRating rating={app.rating} />
      </div>
    </Link>
  );
}
