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
  // The complete lockup stays inside the central 630px square, with 15px
  // horizontal breathing room even under a centered square crop. No slogans.
  await canvas(await fs.readFile(path.join(publicRoot, "logos/stoner-reviews-v7-transparent.svg")),
    600, 400, path.join(output, "homepage-stoner-reviews.png"));
  for (const [source, target] of [
    ["fear-and-loathing-1998.png", "fear-and-loathing-1998-stoner-reviews.png"],
    ["coherence-2013.svg", "coherence-2013-stoner-reviews.png"],
    ["a-complete-unknown-2024.svg", "a-complete-unknown-2024-stoner-reviews.png"],
    ["the-wolf-of-wall-street-2013.svg", "the-wolf-of-wall-street-2013-stoner-reviews.png"],
    ["predator-badlands-2025.svg", "predator-badlands-2025-stoner-reviews.png"],
  ]) {
    // Contain the entire approved poster, including title/tagline, without crops.
    await canvas(await fs.readFile(path.join(publicRoot, "posters", source)),
      570, 570, path.join(output, target));
  }
}
main().catch(error => { console.error(error); process.exitCode = 1; });
