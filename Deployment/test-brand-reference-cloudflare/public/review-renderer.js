// Shared by the Pages Function and the browser so both return the same cards.
const dimensions = [
  ["fun", "Fun"], ["action", "Action"], ["mind_blowing", "Mind-blowing"],
  ["smart", "Smart"], ["feels", "Feels"],
];

// Reuse existing artwork. The API has no artwork field yet.
const artwork = new Map([
  ["fear-and-loathing-in-las-vegas-1998", "/posters/fear-and-loathing-1998.png"],
  ["coherence-2013", "/posters/coherence-2013.svg"],
  ["a-complete-unknown-2024", "/posters/a-complete-unknown-2024.svg"],
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

// Current reviews use Markdown headings and paragraphs. Escape all source text;
// raw HTML is never interpreted, including when rendering on the server.
function renderBody(markdown, headingTag = "h3") {
  return markdown.trim().split(/\r?\n\s*\r?\n/).map(block => {
    const heading = block.match(/^#{1,6}\s+(.+)$/);
    return heading ? `<${headingTag}>${renderInline(heading[1])}</${headingTag}>` : `<p>${renderInline(block)}</p>`;
  }).join("");
}

export function renderReview(review, { detail = false } = {}) {
  const heading = detail ? "h1" : "h2";
  const title = escapeHTML(review.movie_title);
  const permalink = `/reviews/${encodeURIComponent(review.slug)}/`;
  const image = artwork.get(review.movie_slug);
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
    return `<div class="rating"><dt>${label}</dt><dd><span class="rating-value">${score}</span>/5<span class="rating-dots" aria-hidden="true">${dots}</span></dd></div>`;
  }).join("");

  return `<article class="review-card" id="${escapeHTML(review.slug)}">
    <div class="review-header">
      ${image ? `<img class="review-art" src="${image}" alt="" width="144" height="144">` : ""}
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
  return reviews.map(review => renderReview(review)).join("");
}

export function renderReviewPreviews(reviews) {
  return reviews.map(review => {
    const url = `/reviews/${encodeURIComponent(review.slug)}/`;
    const title = escapeHTML(review.movie_title);
    const image = artwork.get(review.movie_slug);
    const overall = Number.isInteger(review.overall) && review.overall >= 1 && review.overall <= 5
      ? `<strong>Overall ${review.overall}/5</strong>` : "";
    return `<article class="review-preview">
      ${image ? `<a class="preview-art" href="${url}" aria-label="Read ${title}"><img src="${image}" alt="" width="600" height="600"></a>` : ""}
      <p class="preview-meta"><span>${escapeHTML(review.release_year)}</span>${overall}</p>
      <h3 class="sr-display"><a href="${url}">${title}</a></h3>
      ${review.tagline ? `<p class="preview-tagline">${escapeHTML(review.tagline)}</p>` : ""}
      <a class="preview-link" href="${url}">Read review<span class="sr-only"> of ${title}</span></a>
    </article>`;
  }).join("");
}
