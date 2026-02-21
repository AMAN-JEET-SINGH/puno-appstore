import dotenv from "dotenv";
dotenv.config();

import gplay from "google-play-scraper";
import { ingestApp } from "./ingestApp";
import { db } from "../lib/db";

async function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const APP_CATEGORIES = [
  "APPLICATION",
  "COMMUNICATION",
  "SOCIAL",
  "FINANCE",
  "TOOLS",
  "PRODUCTIVITY",
  "ENTERTAINMENT",
  "SHOPPING",
  "TRAVEL_AND_LOCAL",
  "FOOD_AND_DRINK",
  "HEALTH_AND_FITNESS",
  "EDUCATION",
  "MUSIC_AND_AUDIO",
  "BUSINESS",
  "LIFESTYLE",
  "NEWS_AND_MAGAZINES",
  "PHOTOGRAPHY",
  "VIDEO_PLAYERS",
  "WEATHER",
  "MAPS_AND_NAVIGATION",
  "PERSONALIZATION",
  "MEDICAL",
  "BOOKS_AND_REFERENCE",
  "DATING",
  "ART_AND_DESIGN",
  "HOUSE_AND_HOME",
  "AUTO_AND_VEHICLES",
  "BEAUTY",
  "EVENTS",
  "PARENTING",
];

const GAME_CATEGORIES = [
  "GAME",
  "GAME_ACTION",
  "GAME_ADVENTURE",
  "GAME_ARCADE",
  "GAME_CASUAL",
  "GAME_PUZZLE",
  "GAME_RACING",
  "GAME_SIMULATION",
  "GAME_STRATEGY",
  "GAME_ROLE_PLAYING",
  "GAME_SPORTS",
  "GAME_WORD",
  "GAME_TRIVIA",
  "GAME_CARD",
  "GAME_BOARD",
  "GAME_EDUCATIONAL",
  "GAME_MUSIC",
  "GAME_CASINO",
];

let totalIngested = 0;
let totalSkipped = 0;

async function fetchAndIngest(category: string, label: string) {
  try {
    console.log(`\n--- Fetching ${label}: ${category} ---`);
    await delay(3000); // Wait 3s before each category fetch

    const apps = await gplay.list({
      collection: (gplay.collection as any).TOP_FREE,
      category: category as any,
      num: 30,
    });

    console.log(`    Found ${apps.length} apps`);

    for (const app of apps) {
      try {
        await ingestApp(app.appId);
        totalIngested++;
        console.log(`    [${totalIngested}] OK: ${app.appId}`);
      } catch (err: any) {
        if (err.message?.includes("already exists") || err.message?.includes("Skipping")) {
          totalSkipped++;
        } else {
          console.error(`    FAIL: ${app.appId} - ${err.message}`);
        }
      }
      await delay(3000); // 3 seconds between each app
    }
  } catch (err: any) {
    console.error(`  Could not fetch ${category}: ${err.message}`);
    await delay(10000); // Wait 10s if category fetch fails
  }
}

async function seed() {
  console.log("=== SEEDING 500+ APPS (slow mode to avoid rate limits) ===");
  console.log("    This will take ~30-45 minutes. Be patient!\n");

  for (const cat of APP_CATEGORIES) {
    await fetchAndIngest(cat, "Apps");
    console.log(`  >> Ingested: ${totalIngested} | Skipped: ${totalSkipped}`);
  }

  for (const cat of GAME_CATEGORIES) {
    await fetchAndIngest(cat, "Games");
    console.log(`  >> Ingested: ${totalIngested} | Skipped: ${totalSkipped}`);
  }

  console.log(`\n=== DONE: ${totalIngested} new apps, ${totalSkipped} skipped ===`);
  await db.end();
}

seed();
