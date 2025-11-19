CITY_LIST.forEach(c => drawCityHighlight(c));




function initRealMap() {
    ...
    renderCitySummary();
    populateGlobalCityList();
    drawRegionBadges();
    drawHeatmap();

    // ADD THIS LINE
    CITY_LIST.forEach(c => drawCityHighlight(c));
}