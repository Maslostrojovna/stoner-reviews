import { onRequest as getEditorialReviews } from "../api/editorial-reviews.js";
import { renderReview } from "../../Deployment/test-brand-reference-cloudflare/public/review-renderer.js";

// The unique editorial slug is the permalink key; no new table or client router.
export async function onRequestGet(context) {
  const url = new URL(context.request.url);
  const dataResponse = await getEditorialReviews(context);
  const data = await dataResponse.json();
  const review = dataResponse.ok
    ? data.editorial_reviews.find(review => review.slug === context.params.slug)
    : null;
  const status = !dataResponse.ok ? 503 : review ? 200 : 404;

  if (review && !url.pathname.endsWith("/")) {
    url.pathname += "/";
    return Response.redirect(url, 308);
  }

  const title = review
    ? `${review.movie_title}${review.release_year != null ? ` (${review.release_year})` : ""} review — Stoner Reviews`
    : status === 404 ? "Review not found — Stoner Reviews" : "Review unavailable — Stoner Reviews";
  const description = review
    ? review.verdict || review.tagline || `Read our review of ${review.movie_title} on Stoner Reviews.`
    : status === 404 ? "This review could not be found. Browse the movie reviews on Stoner Reviews."
      : "This review is temporarily unavailable. Please try again shortly.";

  const template = await context.env.ASSETS.fetch(new Request(new URL("/review", url)));
  const response = new Response(template.body, { status, headers: template.headers });
  response.headers.set("Cache-Control", "no-store");
  if (status === 503) response.headers.set("Retry-After", "60");
  if (status !== 200) response.headers.set("X-Robots-Tag", "noindex");

  return new HTMLRewriter()
    .on("title", { element(element) { element.setInnerContent(title); } })
    .on('meta[name="description"]', { element(element) { element.setAttribute("content", description); } })
    .on('link[rel="canonical"]', { element(element) {
      if (review) element.setAttribute("href", new URL(`/reviews/${encodeURIComponent(review.slug)}/`, url).href);
      else element.remove();
    } })
    .on("#review", { element(element) {
      if (review) element.setInnerContent(renderReview(review, { detail: true }), { html: true });
      else element.setInnerContent(status === 404
        ? "<h1>Review not found</h1><p>We couldn’t find that review. Choose another from all reviews.</p>"
        : "<h1>Review unavailable</h1><p>We couldn’t load this review. Please try again shortly.</p>", { html: true });
    } })
    .transform(response);
}
