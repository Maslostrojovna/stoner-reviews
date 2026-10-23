import { renderReviews } from "/review-renderer.js";

const reviews = document.querySelector("#reviews");
const status = document.querySelector("#status");
const retry = document.querySelector("#retry");

async function loadReviews() {
  reviews.setAttribute("aria-busy", "true");
  retry.hidden = true;
  status.textContent = "Loading reviews…";
  try {
    const response = await fetch("/api/editorial-reviews", { cache: "no-store", signal: AbortSignal.timeout(10000) });
    if (!response.ok) throw new Error("Request failed");
    const data = await response.json();
    if (!Array.isArray(data.editorial_reviews)) throw new Error("Invalid response");
    reviews.innerHTML = renderReviews(data.editorial_reviews);
    status.textContent = data.editorial_reviews.length ? "" : "No reviews published yet.";
  } catch {
    status.textContent = "Reviews couldn’t load. Please try again.";
    retry.hidden = false;
  } finally {
    reviews.setAttribute("aria-busy", "false");
  }
}

retry.addEventListener("click", loadReviews);
// Server-rendered cards already contain the complete review, even without JS.
if (reviews.dataset.rendered !== "true") loadReviews();
