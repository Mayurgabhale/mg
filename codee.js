const uploadMonthlySheet = async () => {
    if (!monthlyFile) {
        setUploadStatus("Please select a file first.");
        return;
    }

    const formData = new FormData();
    formData.append("file", monthlyFile);

    try {
        setUploadStatus("Uploading...");

        const response = await fetch("http://127.0.0.1:8000/monthly_sheet/upload_monthly", {
            method: "POST",
            body: formData,
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.detail || "Upload failed.");
        }

        const result = await response.json();
        setUploadStatus(result.message || "Upload successful!");

        // Optionally fetch employee data after upload
        const dataRes = await fetch("http://127.0.0.1:8000/monthly_sheet/employees");
        const data = await dataRes.json();
        setEmployeeData(data);

    } catch (err) {
        console.error("Upload error:", err);
        setUploadStatus(`Error: ${err.message}`);
    }
};