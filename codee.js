

document.getElementById("toggle-main-btn").addEventListener("click", function () {
    const mainContent = document.getElementById("content");

    if (mainContent.style.display === "none") {
        mainContent.style.display = "block";   // Show
    } else {
        mainContent.style.display = "none";    // Hide
    }
});



<button class="nav-button" id="toggle-main-btn">
  <i class="fas fa-window-maximize"></i> Show / Hide Device Details
</button>