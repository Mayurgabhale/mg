document.addEventListener("DOMContentLoaded", () => {
  fetchData("global");
  startAutoRefresh("global");

  // Attach Door click
  const doorCard = document.getElementById("door-card");
  if (doorCard) {
    doorCard.style.cursor = "pointer";
    doorCard.title = "Click to view Controllers";
    doorCard.addEventListener("click", loadControllersInDetails);
  }

  // Attach all region and summary card logic
  attachSummaryCardFilterHandlers();
});