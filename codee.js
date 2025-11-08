function attachSummaryCardFilterHandlers() {
  const summaryCards = document.querySelectorAll(".summary .card");
  if (!summaryCards.length) return;

  function mapCardTitleToFilterValue(title) {
    const t = (title || "").toLowerCase();
    if (t.includes("camera")) return "cameras";
    if (t.includes("archiver")) return "archivers";
    if (t.includes("controller")) return "controllers";
    if (t.includes("ccure")) return "servers";
    if (t.includes("db")) return "dbdetails";
    if (t.includes("desktop")) return "pcdetails";
    return "all";
  }

  summaryCards.forEach((card) => {
    card.style.cursor = "pointer";

    let clickTimer = null;
    const clickDelay = 100;

    card.addEventListener("click", (ev) => {
      if (clickTimer) clearTimeout(clickTimer);
      clickTimer = setTimeout(() => {
        const h3 = card.querySelector("h3");
        const titleText = h3 ? h3.innerText.trim() : card.innerText.trim();
        const filterValue = mapCardTitleToFilterValue(titleText);

        const deviceFilterElem = document.getElementById("device-filter");
        if (!deviceFilterElem) return;

        deviceFilterElem.value = filterValue;
        deviceFilterElem.dispatchEvent(new Event("change", { bubbles: true }));

        // Highlight clicked card
        document.querySelectorAll(".summary .card").forEach(c => c.classList.remove("active"));
        if (filterValue !== "all") card.classList.add("active");
      }, clickDelay);
    });

    card.addEventListener("dblclick", () => {
      if (clickTimer) {
        clearTimeout(clickTimer);
        clickTimer = null;
      }

      const deviceFilterElem = document.getElementById("device-filter");
      if (!deviceFilterElem) return;
      deviceFilterElem.value = "all";
      deviceFilterElem.dispatchEvent(new Event("change", { bubbles: true }));
      document.querySelectorAll(".summary .card").forEach(c => c.classList.remove("active"));
    });
  });
}