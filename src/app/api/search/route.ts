import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q")?.trim();
  if (!q || q.length < 1) return NextResponse.json([]);

  const res = await db.query(
    `SELECT app_id, name, developer, icon_file, slug, rating FROM apps
     WHERE name ILIKE $1 OR developer ILIKE $1 OR category ILIKE $1
     ORDER BY rating DESC NULLS LAST LIMIT 8`,
    [`%${q}%`]
  );
  return NextResponse.json(res.rows);
}
