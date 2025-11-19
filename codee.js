CITY_LIST.forEach(city => {
                if (city.offices && city.offices.length > 1) {
                    // Draw dotted lines connecting offices
                    const officeCoords = city.offices.map(office => [office.lat, office.lon]);
                    
                    // Create a convex hull or simple polygon to connect offices
                    const polygon = L.polyline(officeCoords, {
                        color: regionColors[city.region],
                        weight: 2,
                        opacity: 0.7,
                        dashArray: '5, 10',
                        className: 'city-dotted-path'
                    }).addTo(realMap);
                    
                    dottedLines.push(polygon);

                    // Add markers for each office
                    city.offices.forEach(office => {
                        const html = `
                            <div style="
                                background:${regionColors[city.region]};
                                width: 12px;
                                height: 12px;
                                border-radius: 50%;
                                border: 2px solid white;
                                box-shadow: 0 0 10px rgba(0,0,0,0.3);
                            "></div>
                        `;

                        const icon = L.divIcon({
                            html,
                            className: "office-marker",
                            iconSize: [16, 16],
                            iconAnchor: [8, 8]
                        });

                        const marker = L.marker([office.lat, office.lon], { icon }).addTo(realMap);
                        officeMarkers.push(marker);

                        // Add tooltip with office name
                        marker.bindTooltip(office.name, {
                            permanent: false,
                            direction: 'top',
                            offset: [0, -8]
                        });
                    });
                }
            });
        }

        // Draw city highlight with dotted line to label
        function drawCityHighlight(cityObj) {
            const { city, lat, lon } = cityObj;

            // Remove any existing highlights
            dottedLines.forEach(line => {
                if (line._city === city) realMap.removeLayer(line);
            });
            dottedLines = dottedLines.filter(line => line._city !== city);

            // Offset point slightly to place the label
            const labelLat = lat + 1.5;
            const labelLon = lon + 2;

            // Draw dotted connection line
            const dotted = L.polyline(
                [
                    [lat, lon],
                    [labelLat, labelLon]
                ],
                {
                    color: regionColors[cityObj.region],
                    weight: 2,
                    opacity: 0.7,
                    dashArray: '5, 5',
                    className: 'city-dotted-path'
                }
            ).addTo(realMap);
            
            dotted._city = city;
            dottedLines.push(dotted);

            // Create enhanced label box
            const total = cityObj.devices.camera + cityObj.devices.controller + 
                         cityObj.devices.server + cityObj.devices.archiver;

            const html = `
                <div class="city-label-box">
                    <b>${city}</b><br>
                    TOTAL: ${total}<br>
                    OFFICES: ${cityObj.offices ? cityObj.offices.length : 1}
                </div>
            `;

            const labelMarker = L.marker([labelLat, labelLon], {
                icon: L.divIcon({
                    html,
                    className: "city-label-marker",
                    iconAnchor: [0, 0]
                })
            }).addTo(realMap);
            
            cityMarkers.push(labelMarker);
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
            realMap.fitBounds(bounds.pad(0.25));
        }

        // Populate global city list in sidebar
        function populateGlobalCityList() {
            const panel = document.getElementById("region-panel-content");
            
            let html = '';
            CITY_LIST.forEach(c => {
                const total = c.devices.camera + c.devices.controller + c.devices.server + c.devices.archiver;
                const officeCount = c.offices ? c.offices.length : 1;
                
                html += `
                    <div class="city-item" data-city="${c.city}">
                        <div class="city-header">
                            <div class="city-name">${c.city}</div>
                            <div class="city-region">${c.region}</div>
                        </div>
                        <div class="city-stats">
                            <div class="device-count">
                                <span class="device-type">Devices:</span>
                                <span>${total}</span>
                            </div>
                            <div class="device-count">
                                <span class="device-type">Offices:</span>
                                <span>${officeCount}</span>
                            </div>
                            <div class="device-count">
                                <span class="device-type">Cameras:</span>
                                <span>${c.devices.camera}</span>
                            </div>
                            <div class="device-count">
                                <span class="device-type">Controllers:</span>
                                <span>${c.devices.controller}</span>
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
                realMap.setView([c.lat, c.lon], 10);
                populateCityPanel(cityName);
                highlightCityItem(cityName);
                drawCityHighlight(c);
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
            const officeCount = c.offices ? c.offices.length : 1;

            let officesHtml = '';
            if (c.offices) {
                officesHtml = '<div style="margin-top: 12px;"><strong>Offices:</strong><ul style="margin-top: 8px; padding-left: 20px;">';
                c.offices.forEach(office => {
                    officesHtml += `<li>${office.name}</li>`;
                });
                officesHtml += '</ul></div>';
            }

            panel.innerHTML = `
                <div class="city-item active">
                    <div class="city-header">
                        <div class="city-name">${cityName}</div>
                        <div class="city-region">${c.region}</div>
                    </div>
                    <div style="margin-top: 12px;">
                        <div style="font-size: 14px; margin-bottom: 8px;"><strong>Total Devices:</strong> ${total}</div>
                        <div style="font-size: 14px; margin-bottom: 8px;"><strong>Office Locations:</strong> ${officeCount}</div>
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
                        ${officesHtml}
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
                    <div style="
                        background: ${regionColors[region]};
                        padding: 8px 12px;
                        color: white;
                        border-radius: 8px;
                        font-size: 13px;
                        text-align: center;
                        font-weight: 600;
                        box-shadow: 0 4px 12px rgba(0,0,0,0.2);
                    ">
                        ${region}<br>${devices} devices
                    </div>
                `;

                const marker = L.marker(regionCenter[region], {
                    icon: L.divIcon({ 
                        html, 
                        className: "", 
                        iconSize: [120, 60], 
                        iconAnchor: [60, 30] 
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