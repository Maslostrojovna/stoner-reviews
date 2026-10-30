// LOCAL TEST ENTRY ONLY. Production still builds functions/ and never imports this.
// Run the real compiled Worker with a SELECT-only fixture binding, not a new D1.
import worker from "../.wrangler/build/worker/index.js";

export default {
  fetch(request, env, context) {
    const scenario = request.headers.get("x-test-scenario");
    const rows = JSON.parse(env.TEST_REVIEWS);
    if (scenario === "escaping") {
      rows.unshift({
        ...rows[0], slug: "metadata-escaping", movie_slug: "unmapped-film",
        movie_title: 'A "quote" & <script id="injected">alert(1)</script>',
        verdict: 'A "verdict" & </title><meta name="injected" content="yes">',
        tagline: "Stored tagline", body_md: "Stored review text.",
      });
    }
    if (scenario === "tagline" || scenario === "empty-description") {
      rows[0].verdict = "  ";
      if (scenario === "empty-description") rows[0].tagline = null;
    }
    const DB = { prepare() { return { async all() {
      if (scenario === "database-error") throw new Error("Simulated local database failure");
      return { results: rows };
    } }; } };
    const host = request.headers.get("x-test-request-host");
    if (host) {
      const url = new URL(request.url);
      url.hostname = host;
      url.port = ""; // Simulate public-domain requests, not the loopback server's port.
      url.protocol = "https:";
      request = new Request(url, request);
    }
    const ASSETS = scenario === "css-unavailable" ? { fetch(assetRequest) {
      if (new URL(assetRequest.url).pathname.endsWith(".css")) return new Response("", { status: 503 });
      return env.ASSETS.fetch(assetRequest);
    } } : env.ASSETS;
    return worker.fetch(request, { ...env, DB, ASSETS }, context);
  },
};
