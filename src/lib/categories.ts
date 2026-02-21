export const APP_CATEGORIES = [
  "Lifestyle",
  "Health & Fitness",
  "Books & Reference",
  "Business",
  "Education",
  "Entertainment",
  "Food & Drink",
  "Parenting",
  "Shopping",
  "Sports",
  "Travel & Local",
  "Finance",
  "Communication",
  "Social",
  "Tools",
  "Productivity",
  "Music & Audio",
  "News & Magazines",
  "Photography",
  "Video Players",
  "Weather",
  "Maps & Navigation",
  "Personalization",
  "Medical",
  "Dating",
  "Art & Design",
  "House & Home",
  "Auto & Vehicles",
  "Beauty",
  "Events",
];

export const GAME_CATEGORIES = [
  "Adventure",
  "Casual",
  "Educational",
  "Strategy",
  "Puzzle",
  "Music",
  "Word",
  "Racing",
  "Role Playing",
  "Action",
  "Trivia",
  "Card",
  "Arcade",
  "Simulation",
  "Sports",
  "Board",
  "Casino",
];

export function slugify(name: string): string {
  return name.toLowerCase().replace(/&/g, "and").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export interface CategoryMeta {
  title: string;
  slug: string;
  query: string;
  type: "app" | "game";
  sort: "trending" | "rating";
}

export function getCategoryMeta(slug: string): CategoryMeta | null {
  if (slug === "trending-apps") return { title: "Trending Apps", slug, query: "", type: "app", sort: "trending" };
  if (slug === "trending-games") return { title: "Trending Games", slug, query: "", type: "game", sort: "trending" };
  if (slug === "ec-apps") return { title: "Editor's Choice Apps", slug, query: "", type: "app", sort: "rating" };
  if (slug === "ec-games") return { title: "Editor's Choice Games", slug, query: "", type: "game", sort: "rating" };

  for (const cat of APP_CATEGORIES) {
    if (slugify(cat) === slug) return { title: cat, slug, query: cat, type: "app", sort: "trending" };
  }
  for (const cat of GAME_CATEGORIES) {
    if (slugify(cat) === slug) return { title: cat, slug, query: cat, type: "game", sort: "trending" };
  }
  return null;
}
