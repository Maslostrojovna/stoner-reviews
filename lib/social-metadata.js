// Shared server-only metadata. Never derive public identities from request hosts.
export const CANONICAL_ORIGIN = "https://stoner.reviews";
const brandImage = {
  path: "/social/homepage-stoner-reviews.png",
  alt: "Cream wizard mascot and Stoner Reviews wordmark on dark teal.",
};

export const sitePages = {
  home: {
    path: "/",
    title: "Stoner Reviews – Movie Reviews & Recommendations",
    description: "What should I watch high tonight? Movie reviews, new perspectives, and inspiration for your next film.",
  },
  reviews: {
    path: "/reviews/",
    title: "Movie reviews — Stoner Reviews",
    description: "Movie recommendations for watching high, with honest reviews and five independent mood ratings.",
  },
  scores: {
    path: "/stoner-scores/",
    title: "Stoner Scores — Our movie rating system | Stoner Reviews",
    description: "How Stoner Scores work: seven independent movie ratings, including Brain Effort and our Overall recommendation.",
  },
};

const reviewImages = new Map([
  ["fear-and-loathing-in-las-vegas-1998", "/social/fear-and-loathing-1998-stoner-reviews.png"],
  ["coherence-2013", "/social/coherence-2013-stoner-reviews.png"],
  ["a-complete-unknown-2024", "/social/a-complete-unknown-2024-stoner-reviews.png"],
  ["the-wolf-of-wall-street-2013", "/social/the-wolf-of-wall-street-2013-stoner-reviews.png"],
  ["predator-badlands-2025", "/social/predator-badlands-2025-stoner-reviews.png"],
]);

export function reviewMetadata(review) {
  const film = `${review.movie_title}${review.release_year != null ? ` (${review.release_year})` : ""}`;
  const image = reviewImages.get(review.movie_slug);
  return {
    path: `/reviews/${encodeURIComponent(review.slug)}/`,
    title: `${film} review — Stoner Reviews`,
    // Stored editorial copy only. A missing verdict/tagline must not invent a synopsis.
    description: review.verdict?.trim() || review.tagline?.trim() || "",
    type: "article",
    image: image ? { path: image, alt: `Illustrated Stoner Reviews poster for ${film}.` } : brandImage,
  };
}

function escapeAttribute(value) {
  return String(value).replace(/[&<>"']/g, character => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
  })[character]);
}

function socialTags(metadata) {
  const image = metadata.image || brandImage;
  const imageURL = CANONICAL_ORIGIN + image.path;
  const tags = [
    ["property", "og:title", metadata.title],
    ["property", "og:description", metadata.description],
    ["property", "og:type", metadata.type || "website"],
    ["property", "og:url", CANONICAL_ORIGIN + metadata.path],
    ["property", "og:image", imageURL],
    ["property", "og:image:width", "1200"],
    ["property", "og:image:height", "630"],
    ["property", "og:image:alt", image.alt],
    ["property", "og:image:type", "image/png"],
    ["property", "og:site_name", "Stoner Reviews"],
    ["name", "twitter:card", "summary_large_image"],
    ["name", "twitter:title", metadata.title],
    ["name", "twitter:description", metadata.description],
    ["name", "twitter:image", imageURL],
    ["name", "twitter:image:alt", image.alt],
  ];
  return tags.map(([attribute, key, value]) =>
    `<meta ${attribute}="${key}" content="${escapeAttribute(value)}">`
  ).join("\n  ");
}

// HTMLRewriter escapes title/attribute mutations; generated tag strings are
// escaped above. Null metadata removes identities on 404/503 responses.
export function withSocialMetadata(rewriter, metadata) {
  return rewriter
    .on("title", { element(element) {
      if (metadata) element.setInnerContent(metadata.title);
    } })
    .on('meta[name="description"]', { element(element) {
      if (metadata) element.setAttribute("content", metadata.description);
    } })
    .on('link[rel="canonical"]', { element(element) {
      if (metadata) element.setAttribute("href", CANONICAL_ORIGIN + metadata.path);
      else element.remove();
    } })
    .on('meta[name="robots"]', { element(element) {
      // The static detail template is noindex; the marker below supplies the
      // single final directive for errors, while successful reviews remove it.
      element.remove();
    } })
    .on('meta[name="social-metadata"]', { element(element) {
      if (metadata) element.replace(socialTags(metadata), { html: true });
      else element.replace('<meta name="robots" content="noindex">', { html: true });
    } });
}
