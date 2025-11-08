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

            // Create grid with inline styles
            const grid = document.createElement("div");
            grid.style.display = "grid";
            grid.style.gridTemplateColumns = "repeat(4, 1fr)";
            grid.style.gap = "20px";
            grid.style.padding = "20px";
            grid.className = "controller-grid-container";
            
            // Add responsive inline styles
            const style = document.createElement('style');
            style.textContent = `
                @media (max-width: 1400px) {
                    .controller-grid-container {
                        grid-template-columns: repeat(3, 1fr) !important;
                    }
                }
                @media (max-width: 1024px) {
                    .controller-grid-container {
                        grid-template-columns: repeat(2, 1fr) !important;
                    }
                }
                @media (max-width: 768px) {
                    .controller-grid-container {
                        grid-template-columns: 1fr !important;
                    }
                }
            `;
            document.head.appendChild(style);
            
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
    
    // Add inline styles to override existing CSS
    card.style.cssText = `
        background: white !important;
        border-radius: 12px !important;
        padding: 20px !important;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08) !important;
        border: 1px solid #e5e7eb !important;
        transition: all 0.3s ease !important;
        cursor: pointer !important;
        position: relative !important;
        overflow: hidden !important;
        min-height: 220px !important;
        display: flex !important;
        flex-direction: column !important;
        margin: 0 !important;
        width: auto !important;
    `;
    
    const isOnline = controller.controllerStatus === "Online";
    const statusIcon = isOnline ? "🟢" : "🔴";
    
    card.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 16px;">
            <div style="font-size: 24px; background: #eff6ff; padding: 12px; border-radius: 8px; color: #3b82f6;">🔒</div>
            <div style="width: 12px; height: 12px; border-radius: 50%; background: ${isOnline ? '#10b981' : '#ef4444'}; box-shadow: 0 0 0 3px ${isOnline ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)'}"></div>
        </div>
        
        <div style="flex-grow: 1;">
            <h3 style="font-size: 18px; font-weight: 600; color: #1f2937; margin: 0 0 16px 0; line-height: 1.3;">${controller.controllername || "Unnamed Controller"}</h3>
            
            <div style="display: flex; flex-direction: column; gap: 12px; margin-bottom: 20px;">
                <div style="display: flex; justify-content: space-between; align-items: center; padding: 8px 0;">
                    <span style="color: #6b7280; font-size: 14px; font-weight: 500;">IP Address</span>
                    <span style="color: #374151; font-weight: 500; font-size: 14px;">${controller.IP_address || "—"}</span>
                </div>
                <div style="display: flex; justify-content: space-between; align-items: center; padding: 8px 0;">
                    <span style="color: #6b7280; font-size: 14px; font-weight: 500;">Location</span>
                    <span style="color: #374151; font-weight: 500; font-size: 14px;">${controller.City || "Unknown"}</span>
                </div>
                <div style="display: flex; justify-content: space-between; align-items: center; padding: 8px 0;">
                    <span style="color: #6b7280; font-size: 14px; font-weight: 500;">Status</span>
                    <span style="font-size: 14px; font-weight: 500; padding: 4px 8px; border-radius: 6px; color: ${isOnline ? '#065f46' : '#991b1b'}; background: ${isOnline ? '#d1fae5' : '#fee2e2'}">
                        ${statusIcon} ${controller.controllerStatus}
                    </span>
                </div>
            </div>
        </div>
        
        <div style="border-top: 1px solid #f3f4f6; padding-top: 16px; margin-top: auto;">
            <button class="view-doors-btn" style="width: 100%; background: #f8fafc; border: 1px solid #e2e8f0; color: #374151; padding: 10px 16px; border-radius: 8px; cursor: pointer; font-weight: 500; display: flex; justify-content: space-between; align-items: center; transition: all 0.2s;">
                View Doors
                <span class="arrow" style="transition: transform 0.2s;">→</span>
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
    
    // Add hover effects
    card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-2px)';
        card.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.12)';
        card.style.borderColor = '#3b82f6';
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(0)';
        card.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.08)';
        card.style.borderColor = '#e5e7eb';
    });

    return card;
}