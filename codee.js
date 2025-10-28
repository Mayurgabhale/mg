const uploadFile = async () => {
    if (!file) return toast.warn("Please select an Excel or CSV file first.");
    setLoading(true);
    try {
        const formData = new FormData();
        formData.append("file", file);
        const res = await axios.post("http://localhost:8000/upload", formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });

        const data = res.data || {};
        const rows = data.items || [];
        setItems(rows);
        setSummary(data.summary || {});

        if (data.status === "already_uploaded") {
            toast.info(data.message || "File already uploaded earlier.");
        } else {
            toast.success(data.message || "File uploaded successfully.");
        }
    } catch (err) {
        console.error(err);
        toast.error(err.response?.data?.detail || "Upload failed. Please check the backend or file format.");
    } finally {
        setLoading(false);
    }
};