// **Fetch summary, details and controllers together**
function fetchData(regionName) {
    Promise.all([
        fetch(`${baseUrl}/summary/${regionName}`).then(res => res.json()),
        fetch(`${baseUrl}/details/${regionName}`).then(res => res.json()),
        fetch(`http://localhost/api/controllers/status`).then(res => res.json()) // <-- controllers endpoint
    ])
    .then(([summary, details, controllerData]) => {
        console.log("Summary Data:", summary);
        console.log("Details Data:", details);
        console.log("Controller Data:", controllerData);

        // Compute door + reader summary from controllers API
        const controllerExtras = processDoorAndReaderData(controllerData);

        // Attach extras into the same structure updateSummary expects:
        // updateSummary expects an object with a .summary property, so keep that shape.
        if (!summary.summary) summary.summary = {};
        summary.summary.controllerExtras = controllerExtras;

        // Update UI and details
        updateSummary(summary);

        if (JSON.stringify(details) !== JSON.stringify(deviceDetailsCache)) {
            updateDetails(details);
            deviceDetailsCache = details; // Update cache
        }
        latestDetails = details;
    })
    .catch((error) => console.error("Error fetching data:", error));
}