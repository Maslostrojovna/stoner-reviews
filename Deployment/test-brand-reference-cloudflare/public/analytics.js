(() => {
  const key = "stoner-reviews-analytics";
  const settings = document.querySelector("#analytics-settings");
  const panel = document.querySelector("#analytics-choice");
  const accept = document.querySelector("#analytics-accept");
  const decline = document.querySelector("#analytics-decline");
  let choice;
  let loaded = false;
  try { choice = localStorage.getItem(key); } catch {}

  function loadAnalytics() {
    if (loaded) return;
    loaded = true;
    const dataLayer = window.dataLayer = window.dataLayer || [];
    function gtag() { dataLayer.push(arguments); }
    gtag("consent", "default", {
      analytics_storage: "denied",
      ad_storage: "denied",
      ad_user_data: "denied",
      ad_personalization: "denied",
    });
    gtag("consent", "update", { analytics_storage: "granted" });
    dataLayer.push({ "gtm.start": Date.now(), event: "gtm.js" });
    const script = document.createElement("script");
    script.async = true;
    script.src = "https://www.googletagmanager.com/gtm.js?id=GTM-PH6TBRX2";
    document.head.append(script);
  }

  function save(value) {
    try { localStorage.setItem(key, value); } catch {
      // Avoid loading analytics when we cannot reliably persist withdrawal.
      return false;
    }
    choice = value;
    panel.hidden = true;
    settings.setAttribute("aria-expanded", "false");
    settings.focus();
    return true;
  }

  settings.hidden = false;
  settings.setAttribute("aria-controls", panel.id);
  panel.hidden = choice === "granted" || choice === "denied";
  settings.setAttribute("aria-expanded", String(!panel.hidden));
  if (choice === "granted") loadAnalytics();

  settings.addEventListener("click", () => {
    panel.hidden = !panel.hidden;
    settings.setAttribute("aria-expanded", String(!panel.hidden));
    if (!panel.hidden) decline.focus();
  });
  accept.addEventListener("click", () => {
    if (save("granted")) loadAnalytics();
  });
  decline.addEventListener("click", () => {
    if (save("denied") && loaded) location.reload();
  });
  window.addEventListener("storage", event => {
    if (loaded && (event.key === key || event.key === null) && event.newValue !== "granted") {
      location.reload();
    }
  });
})();
