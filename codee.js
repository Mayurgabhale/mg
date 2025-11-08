// === Popup Modal Helper Functions ===
function openDoorModal(htmlContent) {
  const modal = document.getElementById("door-modal");
  const content = document.getElementById("door-modal-content");
  content.innerHTML = htmlContent;
  modal.style.display = "flex"; // show the modal
}

function closeDoorModal() {
  document.getElementById("door-modal").style.display = "none";
}

// Attach close button event once
document.addEventListener("DOMContentLoaded", () => {
  const closeBtn = document.getElementById("close-door-modal");
  if (closeBtn) closeBtn.addEventListener("click", closeDoorModal);
});