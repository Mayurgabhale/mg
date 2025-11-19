const icon = L.divIcon({
                    html,
                    className: "city-marker-icon",
                    iconSize: [180, 100],
                    iconAnchor: [90, 50]
                });

                const marker = L.marker([c.lat, c.lon], { icon }).addTo(realMap);
                cityMarkers.push(marker);

                // Add click event to zoom to city
                marker.on("click", () => {
                    realMap.setView([c.lat, c.lon], 8);
                    populateCityPanel(c.city);
                    highlightCityItem(c.city);
                });
            });

            fitAllCities();
        }

        // Draw heatmap
        function drawHeatmap() {
            const heatPoints = CITY_LIST.map(c => [
                c.lat,
                c.lon,
                0.8 // intensity
            ]);

            if (heatLayer) realMap.removeLayer(heatLayer);

            heatLayer = L.heatLayer(heatPoints, { 
                radius: 35, 
                blur: 25,
                gradient: {
                    0.4: 'blue',
                    0.6: 'cyan',
                    0.7: 'lime',
                    0.8: 'yellow',
                    1.0: 'red'
                }
            }).addTo(realMap);
        }

        // Toggle heatmap visibility
        function toggleHeat() {
            if (!heatLayer) return;
            if (realMap.hasLayer(heatLayer)) {
                realMap.removeLayer(heatLayer);
                document.getElementById('toggle-heat').classList.remove('btn-primary');
                document.getElementById('toggle-heat').classList.add('btn-secondary');
            } else {
                realMap.addLayer(heatLayer);
                document.getElementById('toggle-heat').classList.remove('btn-secondary');
                document.getElementById('toggle-heat').classList.add('btn-primary');
            }
        }

        // Fit all cities in view
        function fitAllCities() {
            const bounds = L.latLngBounds(
                CITY_LIST.map(c => [c.lat, c.lon])
            );
            realMap.fitBounds(bounds.pad(0.1));
        }

        // Populate global city list in sidebar
        function populateGlobalCityList() {
            const panel = document.getElementById("region-panel-content");
            
            let html = '';
            CITY_LIST.forEach(c => {
                const total = c.devices.camera + c.devices.controller + c.devices.server + c.devices.archiver;
                html += `
                    <div class="city-item" data-city="${c.city}">
                        <div class="city-header">
                            <div class="city-name">${c.city}</div>
                            <div class="city-region">${c.region}</div>
                        </div>
                        <div class="city-stats">
                            <div class="device-count">
                                <span class="device-type">Cameras:</span>
                                <span>${c.devices.camera}</span>
                            </div>
                            <div class="device-count">
                                <span class="device-type">Controllers:</span>
                                <span>${c.devices.controller}</span>
                            </div>
                            <div class="device-count">
                                <span class="device-type">Servers:</span>
                                <span>${c.devices.server}</span>
                            </div>
                            <div class="device-count">
                                <span class="device-type">Archivers:</span>
                                <span>${c.devices.archiver}</span>
                            </div>
                        </div>
                    </div>
                `;
            });
            
            panel.innerHTML = html;
            
            // Add click events to city items
            document.querySelectorAll('.city-item').forEach(item => {
                item.addEventListener('click', function() {
                    const cityName = this.getAttribute('data-city');
                    onCityItemClick(cityName);
                });
            });
        }

        // Handle city item click
        function onCityItemClick(cityName) {
            const c = CITY_LIST.find(x => x.city === cityName);
            if (c) {
                realMap.setView([c.lat, c.lon], 8);
                populateCityPanel(cityName);
                highlightCityItem(cityName);
            }
        }

        // Highlight active city in sidebar
        function highlightCityItem(cityName) {
            document.querySelectorAll('.city-item').forEach(item => {
                item.classList.remove('active');
            });
            
            const activeItem = document.querySelector(`.city-item[data-city="${cityName}"]`);
            if (activeItem) {
                activeItem.classList.add('active');
            }
        }

        // Populate city details in panel
        function populateCityPanel(cityName) {
            const panel = document.getElementById("region-panel-content");
            const c = CITY_LIST.find(x => x.city === cityName);
            if (!c) return;

            const total = c.devices.camera + c.devices.controller + c.devices.server + c.devices.archiver;

            panel.innerHTML = `
                <div class="city-item active">
                    <div class="city-header">
                        <div class="city-name">${cityName}</div>
                        <div class="city-region">${c.region}</div>
                    </div>
                    <div style="margin-top: 12px;">
                        <div style="font-size: 14px; margin-bottom: 8px;"><strong>Total Devices:</strong> ${total}</div>
                        <div class="city-stats">
                            <div class="device-count">
                                <span class="device-type">Cameras:</span>
                                <span>${c.devices.camera}</span>
                            </div>
                            <div class="device-count">
                                <span class="device-type">Controllers:</span>
                                <span>${c.devices.controller}</span>
                            </div>
                            <div class="device-count">
                                <span class="device-type">Servers:</span>
                                <span>${c.devices.server}</span>
                            </div>
                            <div class="device-count">
                                <span class="device-type">Archivers:</span>
                                <span>${c.devices.archiver}</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div style="margin-top: 16px;">
                    <button class="btn btn-primary" onclick="populateGlobalCityList()" style="width: 100%;">
                        Back to Global View
                    </button>
                </div>
            `;
        }

        // Draw region badges on map
        const regionCenter = {
            APAC: [20, 100],
            EMEA: [30, 10],
            NAMER: [40, -100],
            LACA: [-10, -60]
        };

        function drawRegionBadges() {
            Object.keys(regionCenter).forEach(region => {
                const devices = CITY_LIST
                    .filter(c => c.region === region)
                    .reduce((sum, c) => {
                        return sum +
                            c.devices.camera +
                            c.devices.controller +
                            c.devices.server +
                            c.devices.archiver;
                    }, 0);

                const html = `
                    <div class="region-badge" style="background: ${regionColors[region]}">
                        ${region}: ${devices} devices
                    </div>
                `;

                const marker = L.marker(regionCenter[region], {
                    icon: L.divIcon({ 
                        html, 
                        className: "", 
                        iconSize: [150, 40], 
                        iconAnchor: [75, 20] 
                    })
                }).addTo(realMap);

                marker.on("click", () => populateRegionPanel(region));
            });
        }

        // Populate region panel
        function populateRegionPanel(region) {
            const panel = document.getElementById("region-panel-content");
            const cities = CITY_LIST.filter(c => c.region === region);

            let html = `<h3 style="margin-bottom: 16px;">${region} Region</h3>`;

            cities.forEach(c => {
                const total = c.devices.camera + c.devices.controller + c.devices.server + c.devices.archiver;
                html += `
                    <div class="city-item" data-city="${c.city}">
                        <div class="city-header">
                            <div class="city-name">${c.city}</div>
                            <div class="city-region">${total} devices</div>
                        </div>
                    </div>
                `;
            });

            panel.innerHTML = html;
            
            // Add click events to city items
            document.querySelectorAll('.city-item').forEach(item => {
                item.addEventListener('click', function() {
                    const cityName = this.getAttribute('data-city');
                    onCityItemClick(cityName);
                });
            });
        }

        // Set up event listeners
        document.addEventListener("DOMContentLoaded", function() {
            initRealMap();
            
            document.getElementById("toggle-heat").addEventListener("click", toggleHeat);
            document.getElementById("fit-all").addEventListener("click", fitAllCities);
            document.getElementById("show-global").addEventListener("click", function() {
                fitAllCities();
                populateGlobalCityList();
            });
            
            // Filter functionality (placeholder)
            document.getElementById("apply-filters").addEventListener("click", function() {
                alert("Filters applied! (This is a UI demonstration)");
            });
            
            document.getElementById("reset-filters").addEventListener("click", function() {
                document.getElementById("filter-type").value = "all";
                document.getElementById("filter-status").value = "all";
                alert("Filters reset! (This is a UI demonstration)");
            });
        });
    </script>
</body>
</html>