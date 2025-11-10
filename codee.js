const deleteEmployeeData = async () => {
    try {
        // Clear backend data first
        try {
            const clearRes = await fetch("http://localhost:8000/monthly_sheet/clear_data", { 
                method: "DELETE" 
            });
            const result = await clearRes.json();
            console.log("Backend clear result:", result);
        } catch (backendErr) {
            console.warn("Backend clear failed, continuing with frontend clear:", backendErr);
        }

        // Clear local state
        setEmployeeData([]);
        setUploadStatus("");
        setUploadTime(null);
        setShowUploadCard(true);
        setMonthlyFile(null);
        setHasUploadedData(false);

        // Clear localStorage
        localStorage.removeItem('uploadStatus');
        localStorage.removeItem('uploadTime');
        localStorage.removeItem('monthlyFile');
        localStorage.removeItem('hasUploadedData');

        toast.success("Employee data cleared successfully.");
    } catch (err) {
        console.error(err);
        toast.error("Failed to clear data.");
    }
};