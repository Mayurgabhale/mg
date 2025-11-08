.footer-logo {
  height: 25px;
  /* width: 120px; */
  margin-bottom: 10px;
}

/* ===== Responsive Adjustments ===== */
@media (max-width: 768px) {
  .container {
    flex-direction: column;
  }

  #sidebar {
    width: 100%;
    border-right: none;
    border-bottom: 1px solid #2c2c3e;
  }

  .summary {
    grid-template-columns: 1fr;
  }

  .device-grid {
    grid-template-columns: 1fr;
  }
}


}

.details-header h2 i {
  color: #00adb5;
}

#device-search {
  padding: 10px;
  border-radius: 6px;
  background-color: #ffffff;
  border: 1px solid #000000;
  color: #000000;
  width: 340px;
  font-size: 15px;
  outline: none;
}

/* ===== Device Grid ===== */
.device-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(380px, 1fr));
  gap: 20px;
  padding: 20px;
}

/* ===== Device Card Styling ===== */
.device-card {

  background: #f0f8fc;

  border: 1px solid #e0e0e0;
  padding: 20px;
  border-radius: 12px;
  transition: transform 0.2s ease, box-shadow 0.3s ease;
  position: relative;
  color: #212529;

}

.device-card:hover {
  transform: translateY(-4px);
}
above is my other css 


already has this code for my different cared thats way below is not woirk or not dipsly in one row ok 

not show because
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



/* ///////// */


/* Loading States */
.loading-state {
    text-align: center;
    padding: 60px 20px;
    color: #6b7280;
}

.spinner {
    width: 40px;
    height: 40px;
    border: 4px solid #e5e7eb;
    border-left: 4px solid #3b82f6;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin: 0 auto 20px;
}

@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}

/* Empty & Error States */
.empty-state, .error-state {
    text-align: center;
    padding: 60px 20px;
    background: white;
    border-radius: 12px;
    margin: 20px 0;
}

.empty-icon, .error-icon {
    font-size: 48px;
    margin-bottom: 16px;
}

.empty-state h3, .error-state h3 {
    color: #374151;
    margin-bottom: 8px;
    font-weight: 600;
}

.empty-state p, .error-state p {
    color: #6b7280;
    margin-bottom: 20px;
}

.retry-btn {
    background: #3b82f6;
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 6px;
    cursor: pointer;
    font-weight: 500;
    transition: background 0.2s;
}

.retry-btn:hover {
    background: #2563eb;
}

/* Controller Grid */
.controllers-grid {

  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(380px, 1fr));
  gap: 20px;
  padding: 20px;
}

/* Controller Card */
.controller-card {
    background: white;
    border-radius: 12px;
    padding: 20px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
    border: 1px solid #e5e7eb;
    transition: all 0.3s ease;
    cursor: pointer;
    position: relative;
    overflow: hidden;
}

.controller-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.12);
    border-color: #3b82f6;
}

.card-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 16px;
}

.controller-icon {
    font-size: 24px;
    background: #eff6ff;
    padding: 12px;
    border-radius: 8px;
    color: #3b82f6;
}

.status-indicator {
    width: 12px;
    height: 12px;
    border-radius: 50%;
}

.status-indicator.online {
    background: #10b981;
    box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.2);
}

.status-indicator.offline {
    background: #ef4444;
    box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.2);
}

.controller-name {
    font-size: 18px;
    font-weight: 600;
    color: #1f2937;
    margin: 0 0 16px 0;
    line-height: 1.3;
}

.controller-info {
    display: flex;
    flex-direction: column;
    gap: 12px;
    margin-bottom: 20px;
}

.info-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8px 0;
}

.info-label {
    color: #6b7280;
    font-size: 14px;
    font-weight: 500;
}

.info-value {
    color: #374151;
    font-weight: 500;
    font-size: 14px;
}

.status {
    font-size: 14px;
    font-weight: 500;
    padding: 4px 8px;
    border-radius: 6px;
}

.status.online {
    color: #065f46;
    background: #d1fae5;
}

.status.offline {
    color: #991b1b;
    background: #fee2e2;
}

.card-footer {
    border-top: 1px solid #f3f4f6;
    padding-top: 16px;
}

.view-doors-btn {
    width: 100%;
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    color: #374151;
    padding: 10px 16px;
    border-radius: 8px;
    cursor: pointer;
    font-weight: 500;
    display: flex;
    justify-content: space-between;
    align-items: center;
    transition: all 0.2s;
}

.view-doors-btn:hover {
    background: #3b82f6;
    color: white;
    border-color: #3b82f6;
}

.arrow {
    transition: transform 0.2s;
}

.view-doors-btn:hover .arrow {
    transform: translateX(3px);
}

/* ///////// */










