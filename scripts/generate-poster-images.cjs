// Offline authoring only. Requires Sharp; not a build step/runtime dependency.
// Originals stay unchanged. Filename roles keep pixel dimensions out of URLs.
const sharp = require("sharp");
const fs = require("node:fs/promises");
const path = require("node:path");
const directory = path.resolve(__dirname, "../Deployment/test-brand-reference-cloudflare/public/posters");
const sources = [
  "fear-and-loathing-1998.png", "coherence-2013.svg", "a-complete-unknown-2024.svg",
  "the-wolf-of-wall-street-2013.svg", "predator-badlands-2025.svg",
];
const variants = [["-thumbnail", 320], ["", 720], ["-large", 1152]];

async function main() {
  for (const source of sources) {
    const input = await fs.readFile(path.join(directory, source));
    const stem = path.parse(source).name;
    for (const [role, width] of variants) {
      const target = `${stem}${role}-stoner-reviews.webp`;
      const info = await sharp(input).resize(width, width, { fit: "inside", withoutEnlargement: true })
        .webp({ quality: 85, effort: 6 }).toFile(path.join(directory, target));
      console.log(`${target}: ${info.width}×${info.height}, ${info.size} bytes`);
    }
  }
}
main().catch(error => { console.error(error); process.exitCode = 1; });
