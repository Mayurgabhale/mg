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
                detailsContainer.innerHTML = `
                    <div style="
                        text-align: center;
                        padding: 40px 20px;
                        background: #f8fafc;
                        border-radius: 12px;
                        border: 2px dashed #e2e8f0;
                        color: #64748b;
                    ">
                        <div style="font-size: 48px; margin-bottom: 16px;">🔍</div>
                        <h3 style="color: #475569; margin-bottom: 8px; font-weight: 600;">No Controllers Found</h3>
                        <p style="margin: 0;">No access controllers available in the system</p>
                    </div>
                `;
                return;
            }

            // Create a grid container
            const gridContainer = document.createElement("div");
            gridContainer.style.cssText = `
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
                gap: 20px;
                padding: 20px 0;
            `;

            data.forEach(ctrl => {
                const card = document.createElement("div");
                const isOnline = ctrl.controllerStatus === "Online";
                
                card.style.cssText = `
                    background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
                    border: 1px solid ${isOnline ? '#d1fae5' : '#fecaca'};
                    border-radius: 16px;
                    padding: 24px;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
                    position: relative;
                    overflow: hidden;
                `;

                card.innerHTML = `
                    <div style="
                        display: flex;
                        align-items: flex-start;
                        justify-content: space-between;
                        margin-bottom: 16px;
                    ">
                        <div style="
                            display: flex;
                            align-items: center;
                            gap: 12px;
                        ">
                            <div style="
                                width: 44px;
                                height: 44px;
                                background: ${isOnline ? '#d1fae5' : '#fef2f2'};
                                border-radius: 12px;
                                display: flex;
                                align-items: center;
                                justify-content: center;
                                font-size: 20px;
                                color: ${isOnline ? '#059669' : '#dc2626'};
                            ">🔒</div>
                            <div>
                                <h3 style="
                                    font-size: 18px;
                                    font-weight: 700;
                                    margin: 0 0 4px 0;
                                    color: #1f2937;
                                    line-height: 1.3;
                                ">${ctrl.controllername || "Unknown Controller"}</h3>
                                <div style="
                                    display: flex;
                                    align-items: center;
                                    gap: 6px;
                                    font-size: 14px;
                                    color: #6b7280;
                                ">
                                    <span style="
                                        width: 8px;
                                        height: 8px;
                                        border-radius: 50%;
                                        background: ${isOnline ? '#10b981' : '#ef4444'};
                                        display: inline-block;
                                    "></span>
                                    ${ctrl.controllerStatus}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div style="
                        display: flex;
                        flex-direction: column;
                        gap: 12px;
                        margin-bottom: 20px;
                    ">
                        <div style="display: flex; align-items: center; gap: 12px;">
                            <div style="
                                width: 32px;
                                height: 32px;
                                background: #eff6ff;
                                border-radius: 8px;
                                display: flex;
                                align-items: center;
                                justify-content: center;
                                font-size: 14px;
                                color: #3b82f6;
                            ">🌐</div>
                            <div>
                                <div style="font-size: 12px; color: #6b7280; font-weight: 500;">IP ADDRESS</div>
                                <div style="font-size: 14px; color: #374151; font-weight: 600;">${ctrl.IP_address || "N/A"}</div>
                            </div>
                        </div>

                        <div style="display: flex; align-items: center; gap: 12px;">
                            <div style="
                                width: 32px;
                                height: 32px;
                                background: #f0fdf4;
                                border-radius: 8px;
                                display: flex;
                                align-items: center;
                                justify-content: center;
                                font-size: 14px;
                                color: #16a34a;
                            ">🏢</div>
                            <div>
                                <div style="font-size: 12px; color: #6b7280; font-weight: 500;">LOCATION</div>
                                <div style="font-size: 14px; color: #374151; font-weight: 600;">${ctrl.City || "Unknown"}</div>
                            </div>
                        </div>
                    </div>

                    <div style="
                        display: flex;
                        align-items: center;
                        justify-content: space-between;
                        padding-top: 16px;
                        border-top: 1px solid #f3f4f6;
                    ">
                        <span style="
                            font-size: 14px;
                            color: #6b7280;
                            font-weight: 500;
                        ">Click to view doors</span>
                        <div style="
                            width: 32px;
                            height: 32px;
                            background: #3b82f6;
                            border-radius: 8px;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            color: white;
                            font-size: 16px;
                            transition: transform 0.2s ease;
                        ">→</div>
                    </div>

                    <div style="
                        position: absolute;
                        top: 0;
                        right: 0;
                        width: 60px;
                        height: 60px;
                        background: ${isOnline ? 
                            'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, transparent 100%)' : 
                            'linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, transparent 100%)'};
                        border-radius: 0 16px 0 60px;
                    "></div>
                `;

                // Hover effects
                card.addEventListener('mouseenter', function() {
                    this.style.transform = 'translateY(-4px)';
                    this.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)';
                    this.querySelector('div[style*="background: #3b82f6"]').style.transform = 'translateX(4px)';
                });

                card.addEventListener('mouseleave', function() {
                    this.style.transform = 'translateY(0)';
                    this.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)';
                    this.querySelector('div[style*="background: #3b82f6"]').style.transform = 'translateX(0)';
                });

                // When a controller is clicked, show its doors + readers
                card.addEventListener("click", () => showDoorsReaders(ctrl));
                gridContainer.appendChild(card);
            });

            detailsContainer.appendChild(gridContainer);
        })
        .catch(err => {
            console.error("Error loading controllers:", err);
            detailsContainer.innerHTML = `
                <div style="
                    text-align: center;
                    padding: 40px 20px;
                    background: #fef2f2;
                    border-radius: 12px;
                    border: 1px solid #fecaca;
                    color: #dc2626;
                ">
                    <div style="font-size: 48px; margin-bottom: 16px;">⚠️</div>
                    <h3 style="color: #dc2626; margin-bottom: 8px; font-weight: 600;">Failed to Load Controllers</h3>
                    <p style="margin: 0; color: #991b1b;">Unable to connect to the server. Please try again.</p>
                </div>
            `;
        });
}