// Apply a saved theme before paint without a blocking external script request.
// CSS already handles system preference; theme.js retains controls/listeners.
const themeBootstrap = 'try{const t=localStorage.getItem("stoner-reviews-theme");if(t==="teal"||t==="dark-teal")document.documentElement.dataset.theme=t}catch{}';
const stylesheets = new Set([
  "/site.css", "/site-nav.css", "/home.css", "/reviews.css", "/scores.css",
]);

export function inlinePageAssets(response, context) {
  if (!response.headers.get("Content-Type")?.includes("text/html")) return response;
  return new HTMLRewriter()
    .on('script[src="/theme.js"]', { element(element) {
      element.before(`<script data-theme-bootstrap>${themeBootstrap}</script>`, { html: true });
      element.setAttribute("defer", "");
    } })
    .on("footer.page-footer", { element(element) {
      element.append('<a href="/privacy">Privacy</a>', { html: true });
      if (response.status !== 200) return;
      element.append('<button type="button" id="analytics-settings" hidden>Analytics settings</button>', { html: true });
      element.after(`<section id="analytics-choice" aria-labelledby="analytics-title" hidden>
        <h2 id="analytics-title">Cookie, perhaps? <span aria-hidden="true">🍪</span></h2>
        <p>Just Google Analytics. It helps us figure out how to get more stoners in the house. Cookies are optional.</p>
        <p class="analytics-note">Change your choice anytime in Analytics settings.</p>
        <div class="analytics-actions">
          <button type="button" id="analytics-accept" aria-label="Sure, why not. Allow analytics.">Sure, why not</button>
          <button type="button" id="analytics-decline" aria-label="Nah, I’m good. Decline analytics.">Nah, I’m good</button>
        </div>
      </section><script src="/analytics.js" defer></script>`, { html: true });
    } })
    .on('link[rel="stylesheet"]', { async element(element) {
      const path = element.getAttribute("href");
      if (!stylesheets.has(path)) return;
      try {
        const asset = await context.env.ASSETS.fetch(new Request(new URL(path, context.request.url)));
        if (!asset.ok || !asset.headers.get("Content-Type")?.includes("text/css")) return;
        const css = await asset.text();
        // The allowlisted source CSS is trusted; guard an accidental closing tag
        // in future CSS comments/strings from terminating the inline element.
        element.replace(`<style data-stylesheet="${path}">${css.replace(/<\/style/gi, "<\\/style")}</style>`, { html: true });
      } catch {
        // Keep the original stylesheet link if inlining is unavailable.
      }
    } })
    .transform(response);
}
