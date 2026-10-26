export async function onRequestGet(context) {
  const url = new URL(context.request.url);
  if (url.pathname === "/stoner-scores") {
    return Response.redirect(new URL("/stoner-scores/", url), 308);
  }
  const template = await context.env.ASSETS.fetch(new Request(new URL("/scores", url)));
  const response = new Response(template.body, { headers: template.headers });
  response.headers.set("Cache-Control", "no-store");
  return new HTMLRewriter()
    .on('link[rel="canonical"]', { element(element) {
      element.setAttribute("href", new URL("/stoner-scores/", url).href);
    } })
    .transform(response);
}
