import { CANONICAL_ORIGIN, reviewMetadata, withSocialMetadata } from "../../lib/social-metadata.js";
import { onRequest as getEditorialReviews } from "../api/editorial-reviews.js";
import { REVIEW_AUTHOR, renderReview } from "../../Deployment/test-brand-reference-cloudflare/public/review-renderer.js";

// The unique editorial slug is the permalink key; no new table or client router.
export async function onRequestGet(context) {
  const url = new URL(context.request.url);
  const dataResponse = await getEditorialReviews(context);
  const data = await dataResponse.json();
  const review = dataResponse.ok
    ? data.editorial_reviews.find(review => review.slug === context.params.slug)
    : null;
  const status = !dataResponse.ok ? 503 : review ? 200 : 404;

  if (status === 404) {
    const page = await context.env.ASSETS.fetch(new Request(new URL("/404", url)));
    const response = new Response(page.body, { status: 404, headers: page.headers });
    response.headers.set("X-Robots-Tag", "noindex");
    response.headers.set("Cache-Control", "no-store");
    return response;
  }

  if (review && !url.pathname.endsWith("/")) {
    url.pathname += "/";
    return Response.redirect(url, 308);
  }

  const metadata = review ? reviewMetadata(review) : null;
  const title = review
    ? metadata.title
    : "Review unavailable — Stoner Reviews";
  const description = review
    ? metadata.description
    : "This review is temporarily unavailable. Please try again shortly.";

  const template = await context.env.ASSETS.fetch(new Request(new URL("/review", url)));
  const response = new Response(template.body, { status, headers: template.headers });
  response.headers.set("Cache-Control", "no-store");
  if (status === 503) response.headers.set("Retry-After", "60");
  if (status !== 200) response.headers.set("X-Robots-Tag", "noindex");

  const rewriter = new HTMLRewriter();
  if (review) {
    const structuredReview = {
      "@context": "https://schema.org",
      "@type": "Review",
      url: CANONICAL_ORIGIN + metadata.path,
      itemReviewed: {
        "@type": review.media_type === "tv" ? "TVSeries" : "Movie",
        name: review.movie_title,
      },
      author: { "@type": "Person", name: REVIEW_AUTHOR },
      publisher: { "@type": "Organization", name: "Stoner Reviews" },
    };
    if (Number.isInteger(review.overall) && review.overall >= 1 && review.overall <= 5) {
      structuredReview.reviewRating = {
        "@type": "Rating", ratingValue: review.overall, worstRating: 1, bestRating: 5,
      };
    }
    const json = JSON.stringify(structuredReview).replaceAll("<", "\\u003c");
    rewriter.on("head", { element(element) {
      element.append(`<script type="application/ld+json">${json}</script>`, { html: true });
    } });
  }

  return withSocialMetadata(rewriter, metadata)
    .on("title", { element(element) { if (!metadata) element.setInnerContent(title); } })
    .on('meta[name="description"]', { element(element) { if (!metadata) element.setAttribute("content", description); } })
    .on("#review", { element(element) {
      if (review) element.setInnerContent(renderReview(review, { detail: true }), { html: true });
      else element.setInnerContent(
        "<h1>Review unavailable</h1><p>We couldn’t load this review. Please try again shortly.</p>", { html: true }
      );
    } })
    .transform(response);
}
