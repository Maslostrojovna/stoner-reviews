// Offline asset authoring only; not part of build/deploy and no runtime dependency.
// Requires Sharp (e.g. NODE_PATH pointing to the bundled Codex image libraries).
const sharp = require("sharp");
const fs = require("node:fs/promises");
const path = require("node:path");
const root = path.resolve(__dirname, "..");
const publicRoot = path.join(root, "Deployment/test-brand-reference-cloudflare/public");
const background = "#002A2F";

async function canvas(buffer, width, height, output) {
  const image = await sharp(buffer, { density: 300 }).resize(width, height, { fit: "inside" }).png().toBuffer();
  const size = await sharp(image).metadata();
  await sharp({ create: { width: 1200, height: 630, channels: 3, background } })
    .composite([{ input: image, left: Math.round((1200 - size.width) / 2), top: Math.round((630 - size.height) / 2) }])
    .png({ compressionLevel: 9 }).toFile(output);
}

async function main() {
  const output = path.join(publicRoot, "social");
  await fs.mkdir(output, { recursive: true });
  if (!process.argv.includes("--reviews-only")) {
    // The complete lockup stays inside the central 630px square, with 15px
    // horizontal breathing room even under a centered square crop. No slogans.
    await canvas(await fs.readFile(path.join(publicRoot, "logos/stoner-reviews-v7-transparent.svg")),
      600, 400, path.join(output, "homepage-stoner-reviews.png"));
  }

  // Use the approved PNGs from the shared editorial library.
  const reviews = path.resolve(root, "../../Reviews");
  for (const [folder, stem] of [
    ["fear-and-loathing-in-las-vegas-1998", "fear-and-loathing-1998"],
    ["coherence-2013", "coherence-2013"],
    ["a-complete-unknown-2024", "a-complete-unknown-2024"],
    ["the-wolf-of-wall-street-2013", "the-wolf-of-wall-street-2013"],
    ["predator-badlands-2025", "predator-badlands-2025"],
    ["paradise-2025", "paradise-2025"],
  ]) {
    // Keep the full poster, with 10px above and below it.
    await canvas(await fs.readFile(path.join(reviews, folder, stem + ".png")),
      610, 610, path.join(output, stem + "-stoner-reviews.png"));
  }
}
main().catch(error => { console.error(error); process.exitCode = 1; });
