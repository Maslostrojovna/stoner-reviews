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
