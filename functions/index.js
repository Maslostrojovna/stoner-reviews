import { onRequest as getEditorialReviews } from "./api/editorial-reviews.js";
import { renderReviewPreviews } from "../Deployment/test-brand-reference-cloudflare/public/review-renderer.js";

export async function onRequestGet(context) {
  const url = new URL(context.request.url);
  const dataResponse = await getEditorialReviews(context);
  const data = await dataResponse.json();
  const template = await context.env.ASSETS.fetch(new Request(new URL("/", url)));
  const response = new Response(template.body, {
    status: dataResponse.ok ? 200 : 503,
    headers: template.headers,
  });
  response.headers.set("Cache-Control", "no-store");
  if (!dataResponse.ok) response.headers.set("Retry-After", "60");

  return new HTMLRewriter()
    .on('link[rel="canonical"]', { element(element) {
      element.setAttribute("href", new URL("/", url).href);
    } })
    .on("#review-previews", { element(element) {
      element.setInnerContent(dataResponse.ok ? renderReviewPreviews(data.editorial_reviews) : "", { html: true });
    } })
    .on("#status", { element(element) {
      element.setInnerContent(!dataResponse.ok ? "Reviews couldn’t load. Please refresh to try again."
        : data.editorial_reviews.length ? "" : "No reviews published yet.");
    } })
    .transform(response);
}
