// npm run test:social -- /absolute/path/to/existing-review-snapshot.json
// The snapshot is an array of existing editorial_reviews, read without DB writes.
import { mkdtemp, readFile, writeFile } from "node:fs/promises";
import { createWriteStream } from "node:fs";
import { tmpdir } from "node:os";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { spawn } from "node:child_process";
import net from "node:net";

const root = fileURLToPath(new URL("../", import.meta.url));
if (!process.argv[2]) throw new Error("Pass a JSON array snapshot of existing local reviews; no database is created or imported.");
const reviews = JSON.parse(await readFile(process.argv[2], "utf8"));
if (!Array.isArray(reviews) || !reviews.length) throw new Error("Expected a nonempty review array.");
const directory = await mkdtemp(path.join(tmpdir(), "stoner-social-checks-"));
const config = path.join(directory, "wrangler.json");
await writeFile(config, JSON.stringify({
  name: "stoner-social-local-checks",
  compatibility_date: "2026-10-12",
  main: path.join(root, "tests/social-worker.mjs"),
  assets: {
    directory: path.join(root, "Deployment/test-brand-reference-cloudflare/public"),
    binding: "ASSETS", not_found_handling: "404-page", run_worker_first: true,
  },
  vars: { TEST_REVIEWS: JSON.stringify(reviews) },
  send_metrics: false,
}, null, 2));

function run(command, args, options = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, { cwd: root, stdio: "inherit", ...options });
    child.on("error", reject);
    child.on("exit", code => code === 0 ? resolve() : reject(new Error(`${command} exited ${code}`)));
  });
}

await run("npm", ["run", "build"], { env: { ...process.env, WRANGLER_LOG_PATH: directory } });
const listener = net.createServer();
await new Promise(resolve => listener.listen(0, "127.0.0.1", resolve));
const port = listener.address().port;
await new Promise(resolve => listener.close(resolve));
const base = `http://127.0.0.1:${port}`;
const logPath = path.join(directory, "server.log");
const log = createWriteStream(logPath);
const server = spawn(process.execPath, [
  path.join(root, "node_modules/wrangler/bin/wrangler.js"), "dev", "--local", "--config", config,
  "--ip", "127.0.0.1", "--port", String(port), "--inspector-port", "0",
  "--persist-to", path.join(directory, "state"),
], { cwd: root, stdio: ["ignore", "pipe", "pipe"], env: { ...process.env, WRANGLER_LOG_PATH: directory } });
server.stdout.pipe(log);
server.stderr.pipe(log);
let serverError;
server.on("error", error => { serverError = error; });
try {
  const deadline = Date.now() + 45000;
  while (true) {
    if (serverError) throw serverError;
    if (server.exitCode !== null) throw new Error(`Worker exited; inspect ${logPath}`);
    try {
      if ((await fetch(base + "/stoner-scores/")).status === 200) break;
    } catch {}
    if (Date.now() > deadline) throw new Error(`Worker did not start; inspect ${logPath}`);
    await new Promise(resolve => setTimeout(resolve, 250));
  }
  console.log(`Testing real compiled Worker at ${base}; local fixtures only, no D1 binding.`);
  await run("python3", ["tests/check_social_metadata.py", base], {
    env: { ...process.env, STONER_TEST_HARNESS: "1" },
  });
  await run("python3", ["tests/check_review_url.py", base]);
  await run("python3", ["tests/check_images.py", base]);
} finally {
  server.kill("SIGTERM");
  await new Promise(resolve => {
    if (server.exitCode !== null) resolve();
    else server.once("exit", resolve);
  });
  console.log(`Local verification evidence: ${directory}`);
}
