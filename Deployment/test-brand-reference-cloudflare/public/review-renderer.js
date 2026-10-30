// Shared by the Pages Function and the browser so both return the same cards.
const dimensions = [
  ["fun", "Fun"], ["action", "Action"], ["mind_blowing", "Mind-blowing"],
  ["smart", "Smart"], ["feels", "Feels"], ["brain_effort", "Brain Effort"],
];

// Offline derivatives of the approved artwork. Original PNG/SVG URLs remain valid.
// The API stays independent of artwork/presentation paths.
const artwork = new Map([
  ["fear-and-loathing-in-las-vegas-1998", "fear-and-loathing-1998"],
  ["coherence-2013", "coherence-2013"],
  ["a-complete-unknown-2024", "a-complete-unknown-2024"],
  ["the-wolf-of-wall-street-2013", "the-wolf-of-wall-street-2013"],
  ["predator-badlands-2025", "predator-badlands-2025"],
]);

function escapeHTML(value) {
  return String(value ?? "").replace(/[&<>"']/g, character => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
  })[character]);
}

function renderInline(value) {
  // Escape first: emphasis never enables raw HTML from review text.
  return escapeHTML(value).replace(/\*([^*\n]+)\*/g, "<em>$1</em>");
}

function renderArtwork(review, { preview = false, eager = true, priority = "auto" } = {}) {
  const stem = artwork.get(review.movie_slug);
  if (!stem) return "";
  const image = role => `/posters/${stem}${role}-stoner-reviews.webp`;
  const film = `${review.movie_title}${review.release_year != null ? ` (${review.release_year})` : ""}`;
  // Match home.css's single-column breakpoint, gutters, grid gaps and max width.
  const sizes = preview
    ? "(max-width: 600px) calc(100vw - 36px), (max-width: 800px) calc((100vw - 108px) / 3), (max-width: 1184px) calc((100vw - 128px) / 3), 352px"
    : "(max-width: 540px) 88px, 144px";
  const width = preview ? 720 : 320;
  return `<img${preview ? "" : ' class="review-art"'} src="${image(preview ? "" : "-thumbnail")}" srcset="${image("-thumbnail")} 320w, ${image("")} 720w, ${image("-large")} 1152w" sizes="${sizes}" alt="${escapeHTML(`Illustrated poster for ${film}.`)}" width="${width}" height="${width}" loading="${eager ? "eager" : "lazy"}" fetchpriority="${priority}" decoding="async">`;
}

// Current reviews use Markdown headings and paragraphs. Escape all source text;
// raw HTML is never interpreted, including when rendering on the server.
function renderBody(markdown, headingTag = "h3") {
  return markdown.trim().split(/\r?\n\s*\r?\n/).map(block => {
    const heading = block.match(/^#{1,6}\s+(.+)$/);
    return heading ? `<${headingTag}>${renderInline(heading[1])}</${headingTag}>` : `<p>${renderInline(block)}</p>`;
  }).join("");
}

export function renderReview(review, { detail = false, eager = true } = {}) {
  const heading = detail ? "h1" : "h2";
  const title = escapeHTML(review.movie_title);
  const permalink = `/reviews/${encodeURIComponent(review.slug)}/`;
  const runtime = review.runtime_minutes;
  const watchTime = Number.isInteger(runtime) && runtime > 0
    ? [Math.floor(runtime / 60) ? `${Math.floor(runtime / 60)}h` : "", runtime % 60 ? `${runtime % 60}m` : ""].filter(Boolean).join(" ")
    : "";
  const ratings = dimensions.map(([key, label]) => {
    const score = review[key];
    if (!Number.isInteger(score) || score < 1 || score > 5) return "";
    const dots = Array.from({ length: 5 }, (_, index) =>
      `<span class="sr-rating-dot${index < score ? " sr-rating-dot--filled" : ""}"></span>`
    ).join("");
    return `<div class="rating"><dt>${label}</dt><dd><span class="rating-value">${score}</span>/5<span class="rating-dots" aria-hidden="true">${dots}</span>${key === "brain_effort" ? '<span class="rating-note">Attention required</span>' : ""}</dd></div>`;
  }).join("");

  return `<article class="review-card" id="${escapeHTML(review.slug)}">
    <div class="review-header">
      ${renderArtwork(review, { eager })}
      <div class="review-heading">
        ${review.release_year != null ? `<p class="review-year">${escapeHTML(review.release_year)}</p>` : ""}
        <${heading} class="review-title sr-display">${detail ? title : `<a class="sr-review-link" href="${permalink}">${title}</a>`}</${heading}>
        ${watchTime ? `<p class="review-watch-time">Watch time: <time datetime="PT${runtime}M">${watchTime}</time></p>` : ""}
        ${review.tagline ? `<p class="review-tagline">${escapeHTML(review.tagline)}</p>` : ""}
      </div>
    </div>
    ${review.verdict ? `<p class="review-verdict">${escapeHTML(review.verdict)}</p>` : ""}
    ${Number.isInteger(review.overall) && review.overall >= 1 && review.overall <= 5 ? `<p class="review-overall">Overall: <strong>${review.overall}/5</strong></p>` : ""}
    ${ratings ? `<dl class="ratings">${ratings}</dl>` : ""}
    <p class="score-guide-link"><a href="/stoner-scores/">About Stoner Scores</a></p>
    ${detail ? '<p>Published by Stoner Reviews</p>' : ""}
    ${review.body_md ? (detail ? `<div class="review-body">${renderBody(review.body_md, "h2")}</div>` : `<details>
      <summary><span class="open-label">Read review</span><span class="close-label">Close review</span></summary>
      <div class="review-body">${renderBody(review.body_md)}</div>
    </details>`) : ""}
  </article>`;
}

export function renderReviews(reviews) {
  return reviews.map((review, index) => renderReview(review, { eager: index === 0 })).join("");
}

export function renderReviewPreviews(reviews) {
  return reviews.map((review, index) => {
    const url = `/reviews/${encodeURIComponent(review.slug)}/`;
    const title = escapeHTML(review.movie_title);
    // The first poster can be LCP at the wide single-column breakpoint.
    const image = renderArtwork(review, { preview: true, eager: index < 3, priority: index === 0 ? "high" : "auto" });
    const overall = Number.isInteger(review.overall) && review.overall >= 1 && review.overall <= 5
      ? `<strong>Overall ${review.overall}/5</strong>` : "";
    return `<article class="review-preview">
      ${image ? `<a class="preview-art" href="${url}" aria-label="Read ${title}">${image}</a>` : ""}
      <p class="preview-meta"><span>${escapeHTML(review.release_year)}</span>${overall}</p>
      <h3 class="sr-display"><a href="${url}">${title}</a></h3>
      ${review.tagline ? `<p class="preview-tagline">${escapeHTML(review.tagline)}</p>` : ""}
      <a class="preview-link" href="${url}">Read review<span class="sr-only"> of ${title}</span></a>
    </article>`;
  }).join("");
}
