document.addEventListener("DOMContentLoaded", () => {
  const doorCard = document.getElementById("door-card");
  if (doorCard) {
    doorCard.style.cursor = "pointer";
    doorCard.title = "Click to view Controllers";
    doorCard.addEventListener("click", loadControllersInDetails);
  }
});