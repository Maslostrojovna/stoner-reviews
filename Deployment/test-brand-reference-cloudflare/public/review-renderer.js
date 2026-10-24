// Shared by the Pages Function and the browser so both return the same cards.
const dimensions = [
  ["fun", "Fun"], ["action", "Action"], ["mind_blowing", "Mind-blowing"],
  ["smart", "Smart"], ["feels", "Feels"],
];

// Reuse existing artwork. The API has no artwork field yet.
const artwork = new Map([
  ["fear-and-loathing-in-las-vegas-1998", "/references/fear-and-loathing.png"],
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
function renderBody(markdown) {
  return markdown.trim().split(/\r?\n\s*\r?\n/).map(block => {
    const heading = block.match(/^#{1,6}\s+(.+)$/);
    return heading ? `<h3>${renderInline(heading[1])}</h3>` : `<p>${renderInline(block)}</p>`;
  }).join("");
}

function renderCard(review) {
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
      ${image ? `<img class="review-art" src="${image}" alt="" width="128" height="150">` : ""}
      <div class="review-heading">
        ${review.release_year != null ? `<p class="review-year">${escapeHTML(review.release_year)}</p>` : ""}
        <h2 class="review-title sr-display">${escapeHTML(review.movie_title)}</h2>
        ${watchTime ? `<p class="review-watch-time">Watch time: <time datetime="PT${runtime}M">${watchTime}</time></p>` : ""}
        ${review.tagline ? `<p class="review-tagline">${escapeHTML(review.tagline)}</p>` : ""}
      </div>
    </div>
    ${review.verdict ? `<p class="review-verdict">${escapeHTML(review.verdict)}</p>` : ""}
    ${Number.isInteger(review.overall) && review.overall >= 1 && review.overall <= 5 ? `<p class="review-overall">Overall: <strong>${review.overall}/5</strong></p>` : ""}
    ${ratings ? `<dl class="ratings">${ratings}</dl>` : ""}
    ${review.body_md ? `<details>
      <summary><span class="open-label">Read review</span><span class="close-label">Close review</span></summary>
      <div class="review-body">${renderBody(review.body_md)}</div>
    </details>` : ""}
  </article>`;
}

export function renderReviews(reviews) {
  return reviews.map(renderCard).join("");
}
