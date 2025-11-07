  <img src="images/home-svgrepo-com.svg" alt="Home" /> this img not disppy in heder 
// C:\Users\W0024618\Desktop\NewFrontend\Device Dashboard\script.js
const baseUrl = "http://localhost:80/api/regions";
let refreshInterval = 300000; // 5 minutes
let pingInterval = 60000; // 30 seconds
let countdownTime = refreshInterval / 1000; // Convert to seconds
let currentRegion = "global";
let deviceDetailsCache = {}; // Store previous details to prevent redundant updates
let latestDetails = null; // Cache the latest fetched details

document.addEventListener("DOMContentLoaded", () => {
    fetchData("global"); // Load initial data
    startAutoRefresh("global");

    document.querySelectorAll(".region-button").forEach((button) => {
        button.addEventListener("click", () => {
            const region = button.getAttribute("data-region");
            document.getElementById("region-title").textContent = `${region.toUpperCase()} Summary`;
            switchRegion(region);
        });
    });


  
                detailsContainer.innerHTML = "";

                const filteredDevices = allDevices.filter((device) =>
                    (selectedType === "all" || device.dataset.type === selectedType) &&
                    (selectedStatus === "all" || device.dataset.status === selectedStatus) &&
                    (selectedCity === "all" || device.dataset.city === selectedCity) &&
                    (selectedVendor === "all" || (device.dataset.vendor || "") === selectedVendor) &&
                    (
                        !searchTerm ||
                        device.innerText.toLowerCase().includes(searchTerm)
                    )
                );

                filteredDevices.forEach((deviceCard) => {
                    detailsContainer.appendChild(deviceCard);
                });

                const region = currentRegion?.toUpperCase() || "GLOBAL";
                const titleElement = document.getElementById("region-title");

                const logoHTML = `
                    <span class="region-logo">
                        <img src="" alt=""
                        style="height: 37px; width: auto; object-fit: contain;" />
                    </span>
                    `;
                if (selectedCity !== "all") {
                    titleElement.innerHTML = `${logoHTML}<span>${region}, ${selectedCity} Summary</span>`;
                } else {
                    titleElement.innerHTML = `${logoHTML}<span>${region} Summary</span>`;
                }


    <div id="region-title" class="dashboard-header">

        <div class="region-logo">
            <a href="http://10.199.22.57:3014/">
                <img src="images/home-svgrepo-com.svg" alt="Home" />
            </a>
        </div>
    </div>


                          

/* === Default (Desktop) === */
#region-title {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 70px;
  background-color: #000000;
  color: #ffdd00;
  border-bottom: 3px solid #ffdd00;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 24px;
  font-size: 35px;
  /* border-bottom: 1px solid #000000; */
  /* border-top: 1px solid #000000; */
  font-family: "PP Right Grotesk";
  font-weight: 600;

}

#region-title img {
  height: 40px;
  object-fit: contain;
}
#region-title .region-logo {
  position: absolute;
  top: 10px;
  left: 20px; /* Adjust as needed */
}

#region-title .region-logo img {
  display: block;
  height: 40px;
  width: auto;
  cursor: pointer; /* Makes it look clickable */
  fill: #f6f5f5;
}
