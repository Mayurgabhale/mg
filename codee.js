const mapCityOverviewBtn = document.getElementById("mapCityOverviewBtn");

if (mapCityOverviewBtn) {
    mapCityOverviewBtn.addEventListener("click", function () {
        const panel = document.getElementById("region-panel");
        if (!panel) return;

        const isOpen = panel.style.display === "block";

        panel.style.display = isOpen ? "none" : "block";

        // ✅ IMPORTANT: Recalculate map after layout change
        if (window.realMap) {
            setTimeout(() => {
                window.realMap.invalidateSize(true);
            }, 250);   // allow DOM to finish reflow
        }
    });
}