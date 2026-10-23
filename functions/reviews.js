import { onRequest as getEditorialReviews } from "./api/editorial-reviews.js";
import { renderReviews } from "../Deployment/test-brand-reference-cloudflare/public/review-renderer.js";

// Use the same data handler as GET /api/editorial-reviews. Every visitor receives
// the full review text in HTML, without JavaScript or bot-specific rendering.
export async function onRequestGet(context) {
  const url = new URL(context.request.url);
  if (url.pathname === "/reviews") {
    return Response.redirect(new URL("/reviews/", url), 308);
  }

  const dataResponse = await getEditorialReviews(context);
  const data = await dataResponse.json();
  const loaded = dataResponse.ok;
  const cards = loaded ? renderReviews(data.editorial_reviews) : "";

  // The ASSETS binding reads the existing template without invoking Functions.
  const templateURL = new URL("/reviews", context.request.url);
  const template = await context.env.ASSETS.fetch(new Request(templateURL));
  const response = new Response(template.body, {
    status: loaded ? 200 : 503,
    headers: template.headers,
  });
  response.headers.set("Cache-Control", "no-store");
  if (!loaded) response.headers.set("Retry-After", "60");

  return new HTMLRewriter()
    .on('link[rel="canonical"]', { element(element) {
      element.setAttribute("href", new URL("/reviews/", url).href);
    } })
    .on("#reviews", { element(element) {
      element.setInnerContent(cards, { html: true });
      element.setAttribute("aria-busy", "false");
      element.setAttribute("data-rendered", String(loaded));
    } })
    .on("#status", { element(element) {
      element.setInnerContent(loaded
        ? (data.editorial_reviews.length ? "" : "No reviews published yet.")
        : "Reviews couldn’t load. Please try again.");
    } })
    .on("#retry", { element(element) {
      if (!loaded) element.removeAttribute("hidden");
    } })
    .transform(response);
}
