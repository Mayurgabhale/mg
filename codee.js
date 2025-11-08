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
                card.style.cssText = `
                    background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
                    border: 1px solid #e5e7eb;
                    border-radius: 12px;
                    padding: 20px;
                    margin-bottom: 16px;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.08);
                `;

                card.innerHTML = `
                    <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px;">
                        <h3 style="font-size: 18px; font-weight: 700; margin: 0; color: #1f2937;">
                            ${ctrl.controllername || "Unknown Controller"}
                        </h3>
                        <div style="display: flex; align-items: center; gap: 8px;">
                            <div style="width: 8px; height: 8px; border-radius: 50%; background: ${ctrl.controllerStatus === "Online" ? "#10b981" : "#ef4444"};"></div>
                            <span style="font-size: 14px; color: ${ctrl.controllerStatus === "Online" ? "#059669" : "#dc2626"}; font-weight: 600;">
                                ${ctrl.controllerStatus}
                            </span>
                        </div>
                    </div>
                    
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
                        <div style="display: flex; align-items: center; gap: 8px;">
                            <span style="font-size: 14px; color: #6b7280;">🌐</span>
                            <div>
                                <div style="font-size: 12px; color: #6b7280;">IP Address</div>
                                <div style="font-size: 14px; color: #374151; font-weight: 500;">${ctrl.IP_address || "N/A"}</div>
                            </div>
                        </div>
                        
                        <div style="display: flex; align-items: center; gap: 8px;">
                            <span style="font-size: 14px; color: #6b7280;">🏢</span>
                            <div>
                                <div style="font-size: 12px; color: #6b7280;">Location</div>
                                <div style="font-size: 14px; color: #374151; font-weight: 500;">${ctrl.City || "Unknown"}</div>
                            </div>
                        </div>
                    </div>
                `;

                // Hover effects
                card.addEventListener('mouseenter', function() {
                    this.style.transform = 'translateY(-2px)';
                    this.style.boxShadow = '0 8px 25px rgba(0,0,0,0.15)';
                    this.style.borderColor = '#3b82f6';
                });

                card.addEventListener('mouseleave', function() {
                    this.style.transform = 'translateY(0)';
                    this.style.boxShadow = '0 2px 8px rgba(0,0,0,0.08)';
                    this.style.borderColor = '#e5e7eb';
                });

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