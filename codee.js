// ✅ Load saved data immediately on refresh + auto-refresh every 10 seconds
useEffect(() => {
    const fetchLatest = async (showToast = false) => {
        try {
            const res = await axios.get("http://localhost:8000/data");
            const payload = res.data || {};
            const rows = payload.items || [];

            // On first load or new data
            if (rows.length > 0) {
                setItems(rows);
                setSummary(payload.summary || {});

                // show toast only when we want (e.g., initial page load)
                if (showToast) {
                    toast.info(`Loaded ${rows.length} saved records from previous session.`);
                }

                // track update timestamp
                if (payload.last_updated) {
                    setLastUpdated(payload.last_updated);
                }
            }
        } catch (err) {
            console.warn("No saved data yet — upload a file to start.");
        }
    };

    // 🔹 Load previous data once when page loads
    fetchLatest(true);

    // 🔹 Keep refreshing every 10 seconds
    const interval = setInterval(() => fetchLatest(false), 10000);
    return () => clearInterval(interval);
}, []);