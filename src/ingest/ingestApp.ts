import gplay from "google-play-scraper";
import path from "path";
import slugify from "slugify";
import { db } from "../lib/db";
import { downloadImage } from "./downloadImage";

const GAME_CATEGORIES = [
  "GAME",
  "GAME_ACTION",
  "GAME_ADVENTURE",
  "GAME_ARCADE",
  "GAME_BOARD",
  "GAME_CARD",
  "GAME_CASINO",
  "GAME_CASUAL",
  "GAME_EDUCATIONAL",
  "GAME_MUSIC",
  "GAME_PUZZLE",
  "GAME_RACING",
  "GAME_ROLE_PLAYING",
  "GAME_SIMULATION",
  "GAME_SPORTS",
  "GAME_STRATEGY",
  "GAME_TRIVIA",
  "GAME_WORD",
];

export async function ingestApp(appId: string) {
  // 1. Check if already exists
  const exists = await db.query("SELECT 1 FROM apps WHERE app_id = $1", [
    appId,
  ]);
  if (exists.rowCount && exists.rowCount > 0) {
    console.log("Skipping (already exists):", appId);
    return;
  }

  // 2. Fetch Google Play data
  const app = await gplay.app({ appId });

  const slug = slugify(app.title, { lower: true, strict: true });
  const appDir = path.join("public/apps", appId);

  // 3. Download icon
  await downloadImage(app.icon, path.join(appDir, "icon.png"));

  // 4. Download screenshots
  for (let i = 0; i < app.screenshots.length; i++) {
    await downloadImage(
      app.screenshots[i],
      path.join(appDir, `s${i + 1}.jpg`)
    );
  }

  // 5. Determine app type
  const appType = GAME_CATEGORIES.includes(app.genreId) ? "game" : "app";

  // 6. Insert app
  await db.query(
    `INSERT INTO apps (
      app_id, name, developer, category,
      platforms, price, rating, installs,
      size, updated, description, icon_file, slug,
      content_rating, developer_email, privacy_policy, app_type
    )
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17)`,
    [
      appId,
      app.title,
      app.developer,
      app.genre,
      ["Android"],
      app.free ? "Free" : app.priceText,
      app.score,
      app.installs,
      app.size,
      app.updated ? new Date(app.updated) : null,
      app.description,
      "icon.png",
      slug,
      app.contentRating,
      app.developerEmail,
      (app as any).privacyPolicy || null,
      appType,
    ]
  );

  // 7. Insert screenshots
  for (let i = 0; i < app.screenshots.length; i++) {
    await db.query(
      `INSERT INTO screenshots (app_id, file_name)
       VALUES ($1, $2)`,
      [appId, `s${i + 1}.jpg`]
    );
  }

  console.log(`Inserted [${appType}]: ${app.title}`);
}
