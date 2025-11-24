<script>
document.getElementById("mapCityOverviewBtn").addEventListener("click", function() {
    const panel = document.getElementById("region-panel");

    if (panel.style.display === "block") {
        panel.style.display = "none";
    } else {
        panel.style.display = "block";
    }
});
</script>