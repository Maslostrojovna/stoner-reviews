import { inlinePageAssets } from "../lib/page-assets.js";

export async function onRequest(context) {
  const url = new URL(context.request.url);
  if (url.hostname === "stoner.danimaslo.dev") {
    url.protocol = "https:";
    url.host = "stoner.reviews";
    return Response.redirect(url, 308);
  }
  return inlinePageAssets(await context.next(), context);
}
