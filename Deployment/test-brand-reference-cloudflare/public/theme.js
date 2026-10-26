// Runs in the head so a saved preference is applied before the page is painted.
(() => {
  const root = document.documentElement;
  const system = window.matchMedia("(prefers-color-scheme: dark)");
  let preference;
  try { preference = localStorage.getItem("stoner-reviews-theme"); } catch {}
  if (preference !== "teal" && preference !== "dark-teal") preference = null;

  function apply(theme) {
    root.dataset.theme = theme;
    for (const button of document.querySelectorAll("[data-theme-toggle]")) {
      button.hidden = false;
      button.setAttribute("aria-checked", String(theme === "dark-teal"));
      button.querySelector("[data-theme-label]").textContent = theme === "dark-teal" ? "Dark teal" : "Teal";
    }
  }

  apply(preference || (system.matches ? "dark-teal" : "teal"));
  document.addEventListener("DOMContentLoaded", () => apply(root.dataset.theme));
  document.addEventListener("click", event => {
    if (!event.target.closest("[data-theme-toggle]")) return;
    preference = root.dataset.theme === "dark-teal" ? "teal" : "dark-teal";
    try { localStorage.setItem("stoner-reviews-theme", preference); } catch {}
    apply(preference);
  });
  system.addEventListener("change", () => {
    if (!preference) apply(system.matches ? "dark-teal" : "teal");
  });
})();
