// 🕒 Auto-refresh data every 10 seconds
useEffect(() => {
    const fetchLatest = async () => {
        try {
            const res = await axios.get("http://localhost:8000/data");
            const payload = res.data || {};
            setItems(payload.items || []);
            setSummary(payload.summary || {});
        } catch (err) {
            console.warn("No data yet or backend not responding...");
        }
    };

    const interval = setInterval(fetchLatest, 10000); // refresh every 10 seconds
    return () => clearInterval(interval);
}, []);