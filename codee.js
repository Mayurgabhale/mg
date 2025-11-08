design this ok 
function loadControllersInDetails() {
    const detailsContainer = document.getElementById("device-details");
    const extraContainer = document.getElementById("details-container");

    detailsContainer.innerHTML = "<p>Loading controllers...</p>";
    extraContainer.innerHTML = "";

    fetch("http://localhost/api/controllers/status")
        .then(res => res.json())
        .then(data => {
            detailsContainer.innerHTML = "";
            if (!Array.isArray(data) || data.length === 0) {
                detailsContainer.innerHTML = "<p>No controllers found.</p>";
                return;
            }

            data.forEach(ctrl => {
                const card = document.createElement("div");
                card.className = "door-device-card";
                card.style.border = "1px solid #ddd";
                card.style.borderRadius = "10px";
                card.style.padding = "10px";
                card.style.marginBottom = "10px";
                card.style.cursor = "pointer";

                card.innerHTML = `
          <h3 style="font-size:18px; font-weight:600; margin-bottom:8px;">
            ${ctrl.controllername || "Unknown Controller"}
          </h3>
          <p><strong>IP:</strong> ${ctrl.IP_address || "N/A"}</p>
          <p><strong>City:</strong> ${ctrl.City || "Unknown"}</p>
          <p>Status:
            <span style="color:${ctrl.controllerStatus === "Online" ? "green" : "red"};">
              ${ctrl.controllerStatus}
            </span>
          </p>
        `;

                // When a controller is clicked, show its doors + readers
                card.addEventListener("click", () => showDoorsReaders(ctrl));
                detailsContainer.appendChild(card);
            });
        })
        .catch(err => {
            console.error("Error loading controllers:", err);
            detailsContainer.innerHTML = "<p style='color:red;'>Failed to load controllers.</p>";
        });
}
