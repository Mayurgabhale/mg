function loadControllersInDetails() {
    const detailsContainer = document.getElementById("device-details");
    const extraContainer = document.getElementById("details-container");

    // Clean loading state
    detailsContainer.innerHTML = `
        <div class="loading-state">
            <div class="spinner"></div>
            <p>Loading controllers...</p>
        </div>
    `;
    
    extraContainer.innerHTML = "";

    fetch("http://localhost/api/controllers/status")
        .then(res => {
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            return res.json();
        })
        .then(data => {
            detailsContainer.innerHTML = "";

            if (!Array.isArray(data) || data.length === 0) {
                detailsContainer.innerHTML = `
                    <div class="empty-state">
                        <div class="empty-icon">🏢</div>
                        <h3>No Controllers</h3>
                        <p>No access controllers found in the system</p>
                    </div>
                `;
                return;
            }

            // Create SPECIFIC controller grid container
            const grid = document.createElement("div");
            grid.className = "controller-grid-container"; // Changed from "controllers-grid"
            
            data.forEach(controller => {
                const card = createControllerCard(controller);
                grid.appendChild(card);
            });
            
            detailsContainer.appendChild(grid);
        })
        .catch(err => {
            console.error("Error loading controllers:", err);
            detailsContainer.innerHTML = `
                <div class="error-state">
                    <div class="error-icon">⚠️</div>
                    <h3>Connection Error</h3>
                    <p>Failed to load controllers from server</p>
                    <button onclick="loadControllersInDetails()" class="retry-btn">Try Again</button>
                </div>
            `;
        });
}

function createControllerCard(controller) {
    const card = document.createElement("div");
    card.className = "controller-card";
    
    const isOnline = controller.controllerStatus === "Online";
    const statusIcon = isOnline ? "🟢" : "🔴";
    
    card.innerHTML = `
        <div class="card-header">
            <div class="controller-icon">🔒</div>
            <div class="status-indicator ${isOnline ? 'online' : 'offline'}"></div>
        </div>
        
        <div class="card-body">
            <h3 class="controller-name">${controller.controllername || "Unnamed Controller"}</h3>
            
            <div class="controller-info">
                <div class="info-item">
                    <span class="info-label">IP Address</span>
                    <span class="info-value">${controller.IP_address || "—"}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">Location</span>
                    <span class="info-value">${controller.City || "Unknown"}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">Status</span>
                    <span class="status ${isOnline ? 'online' : 'offline'}">
                        ${statusIcon} ${controller.controllerStatus}
                    </span>
                </div>
            </div>
        </div>
        
        <div class="card-footer">
            <button class="view-doors-btn">
                View Doors
                <span class="arrow">→</span>
            </button>
        </div>
    `;

    // Add click event to the entire card and button
    const viewBtn = card.querySelector('.view-doors-btn');
    const handleClick = () => showDoorsReaders(controller);
    
    card.addEventListener('click', (e) => {
        if (!e.target.closest('.view-doors-btn')) {
            handleClick();
        }
    });
    
    viewBtn.addEventListener('click', handleClick);

    return card;
}