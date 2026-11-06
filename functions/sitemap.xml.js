import { onRequest as getEditorialReviews } from "./api/editorial-reviews.js";
import { CANONICAL_ORIGIN, reviewMetadata, sitePages } from "../lib/social-metadata.js";

export async function onRequestGet(context) {
  const dataResponse = await getEditorialReviews(context);
  if (!dataResponse.ok) {
    return new Response("Sitemap temporarily unavailable", {
      status: 503,
      headers: { "Retry-After": "60", "Cache-Control": "no-store" },
    });
  }

  const { editorial_reviews } = await dataResponse.json();
  const paths = [
    ...Object.values(sitePages).map(page => page.path),
    ...editorial_reviews.map(review => reviewMetadata(review).path),
  ];
  const entries = paths.map(path => `  <url><loc>${CANONICAL_ORIGIN}${path}</loc></url>`);
  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...entries,
    "</urlset>",
    "",
  ].join("\n");
  return new Response(xml, {
    headers: { "Content-Type": "application/xml; charset=utf-8", "Cache-Control": "no-store" },
  });
}
