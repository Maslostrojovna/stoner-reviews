import { sitePages, withSocialMetadata } from "../lib/social-metadata.js";
export async function onRequestGet(context) {
  const url = new URL(context.request.url);
  if (url.pathname === "/stoner-scores") {
    return Response.redirect(new URL("/stoner-scores/", url), 308);
  }
  const template = await context.env.ASSETS.fetch(new Request(new URL("/scores", url)));
  const response = new Response(template.body, { headers: template.headers });
  response.headers.set("Cache-Control", "no-store");
  return withSocialMetadata(new HTMLRewriter(), sitePages.scores)
    .transform(response);
}
