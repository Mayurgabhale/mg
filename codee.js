const fetchLatest = async (showToast = false) => {
  try {
    const res = await axios.get("http://localhost:8000/daily_sheet/data");
    const payload = res.data || {};
    setItems(payload.items || []);
    setSummary(payload.summary || {});
    if (payload.last_updated) setLastUpdated(payload.last_updated);
    if (showToast) toast.success("Data loaded");
  } catch (err) {
    console.error(err);
    if (showToast) toast.error("Failed to load data");
  }
};