import { inlinePageAssets } from "../lib/page-assets.js";

import { CANONICAL_ORIGIN } from "../lib/social-metadata.js";

export async function onRequest(context) {
  const url = new URL(context.request.url);
  const canonical = new URL(CANONICAL_ORIGIN);
  if (url.hostname === "stoner.danimaslo.dev" ||
      (url.hostname === canonical.hostname && url.protocol === "http:")) {
    canonical.pathname = url.pathname;
    canonical.search = url.search;
    return Response.redirect(canonical, 308);
  }
  return inlinePageAssets(await context.next(), context);
}
