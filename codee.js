const [lastUpdated, setLastUpdated] = useState(null);

useEffect(() => {
    const fetchLatest = async () => {
        try {
            const res = await axios.get("http://localhost:8000/data");
            const payload = res.data || {};

            // Only update UI if new data detected
            if (payload.last_updated && payload.last_updated !== lastUpdated) {
                setLastUpdated(payload.last_updated);
                setItems(payload.items || []);
                setSummary(payload.summary || {});
                toast.info("Dashboard auto-updated with new upload data.");
            }
        } catch {
            console.warn("No data yet or backend not responding...");
        }
    };

    const interval = setInterval(fetchLatest, 10000);
    return () => clearInterval(interval);
}, [lastUpdated]);