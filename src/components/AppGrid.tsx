import AppCard from "./AppCard";
import type { App } from "@/lib/types";

export default function AppGrid({ apps, variant = "normal" }: { apps: App[]; variant?: "normal" | "dense" | "five" | "dense-5" }) {
  const cls =
    variant === "dense" ? "agrid-dense" :
    variant === "five" ? "agrid-5" :
    variant === "dense-5" ? "agrid-dense-5" :
    "agrid";
  return (
    <div className={cls}>
      {apps.map(app => <AppCard key={app.app_id} app={app} />)}
    </div>
  );
}
