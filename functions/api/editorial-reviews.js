// Pages maps this file to /api/editorial-reviews. No HTML is involved.
export async function onRequest({ request, env }) {
  if (request.method !== "GET") {
    return Response.json(
      { error: "Method not allowed" },
      { status: 405, headers: { Allow: "GET", "Cache-Control": "no-store" } },
    );
  }

  try {
    const { results } = await env.DB.prepare(`
      SELECT id, slug, movie_slug, movie_title, release_year, runtime_minutes,
             tagline, verdict, body_md, why_watch_high_md,
             fun, action, mind_blowing, smart, feels, overall,
             created_at, updated_at
      FROM editorial_reviews
      ORDER BY created_at DESC, id DESC
    `).all();

    return Response.json(
      { editorial_reviews: results },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    console.error("Unable to load editorial reviews:", error);
    return Response.json(
      { error: "Unable to load editorial reviews" },
      { status: 500, headers: { "Cache-Control": "no-store" } },
    );
  }
}
