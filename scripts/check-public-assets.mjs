import { readdir, lstat } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

// An explicit website-only upload boundary. Keep source docs and experiments out.
const allowed = new Set([
  "_headers", "index.html", "404.html", "reviews.html", "review.html",
  "site.css", "home.css", "reviews.css", "site-nav.css", "theme.js",
  "review-renderer.js", "reviews.js",
  "scores.html", "scores.css",
  "logos/stoner-reviews-v7-transparent.svg",
  "logos/stoner-reviews-wizard-teal-400.png",
  "posters/fear-and-loathing-1998.png", "posters/coherence-2013.svg",
  "posters/a-complete-unknown-2024.svg",
  "posters/the-wolf-of-wall-street-2013.svg",
  "posters/predator-badlands-2025.svg",
  "posters/fear-and-loathing-1998-thumbnail-stoner-reviews.webp",
  "posters/fear-and-loathing-1998-stoner-reviews.webp",
  "posters/fear-and-loathing-1998-large-stoner-reviews.webp",
  "posters/coherence-2013-thumbnail-stoner-reviews.webp",
  "posters/coherence-2013-stoner-reviews.webp",
  "posters/coherence-2013-large-stoner-reviews.webp",
  "posters/a-complete-unknown-2024-thumbnail-stoner-reviews.webp",
  "posters/a-complete-unknown-2024-stoner-reviews.webp",
  "posters/a-complete-unknown-2024-large-stoner-reviews.webp",
  "posters/the-wolf-of-wall-street-2013-thumbnail-stoner-reviews.webp",
  "posters/the-wolf-of-wall-street-2013-stoner-reviews.webp",
  "posters/the-wolf-of-wall-street-2013-large-stoner-reviews.webp",
  "posters/predator-badlands-2025-thumbnail-stoner-reviews.webp",
  "posters/predator-badlands-2025-stoner-reviews.webp",
  "posters/predator-badlands-2025-large-stoner-reviews.webp",
  "social/homepage-stoner-reviews.png",
  "social/fear-and-loathing-1998-stoner-reviews.png",
  "social/coherence-2013-stoner-reviews.png",
  "social/a-complete-unknown-2024-stoner-reviews.png",
  "social/the-wolf-of-wall-street-2013-stoner-reviews.png",
  "social/predator-badlands-2025-stoner-reviews.png",
]);
const root = fileURLToPath(new URL("../Deployment/test-brand-reference-cloudflare/public/", import.meta.url));
const actual = new Set();
async function inspect(directory = "") {
  for (const name of await readdir(path.join(root, directory))) {
    const relative = path.posix.join(directory, name);
    const stat = await lstat(path.join(root, relative));
    if (stat.isSymbolicLink()) throw new Error(`Public symlinks are not allowed: ${relative}`);
    if (stat.isDirectory()) await inspect(relative);
    else actual.add(relative);
  }
}
await inspect();
const unexpected = [...actual].filter(file => !allowed.has(file));
const missing = [...allowed].filter(file => !actual.has(file));
if (unexpected.length || missing.length) {
  throw new Error(`Public asset check failed. Unexpected: ${unexpected.join(", ") || "none"}. Missing: ${missing.join(", ") || "none"}. Keep work files outside public/.`);
}
console.log(`Public asset check passed: ${actual.size} website files; no work files.`);
