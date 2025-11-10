const [employeeData, setEmployeeData] = useState([]);
const [monthlyFile, setMonthlyFile] = useState(null);
const [uploadStatus, setUploadStatus] = useState("");
const [uploadTime, setUploadTime] = useState(null); // Add this state
const [showUploadCard, setShowUploadCard] = useState(true); // Add this state

const handleMonthlyFileChange = (e) => {
    const selected = e.target.files?.[0];
    console.log("Selected:", selected);
    setMonthlyFile(selected);
};

const uploadMonthlySheet = async () => {
    if (!monthlyFile) return alert("Please select a file first.");

    const formData = new FormData();
    formData.append("file", monthlyFile);

    try {
        setUploadStatus("Uploading...");
        const res = await fetch("http://localhost:8000/monthly_sheet/upload_monthly", {
            method: "POST",
            body: formData,
        });
        const result = await res.json();
        setUploadStatus(result.message || "Upload success!");
        setUploadTime(new Date()); // Set upload time
        
        // Hide upload card after successful upload
        setShowUploadCard(false);
        
        // Fetch employee data after successful upload
        const employeesRes = await fetch("http://localhost:8000/monthly_sheet/employees");
        const employeesData = await employeesRes.json();
        setEmployeeData(employeesData);
        
    } catch (err) {
        console.error(err);
        setUploadStatus("Upload failed.");
    }
};

// Add delete confirmation function
const confirmDeleteData = () => {
    if (window.confirm("Are you sure you want to delete all employee data? This action cannot be undone.")) {
        deleteEmployeeData();
    }
};

const deleteEmployeeData = async () => {
    try {
        // Clear local state
        setEmployeeData([]);
        setUploadStatus("");
        setUploadTime(null);
        setShowUploadCard(true);
        setMonthlyFile(null);
        
        // You might want to add a backend endpoint to clear the data
        // await fetch("http://localhost:8000/monthly_sheet/clear_data", { method: "DELETE" });
        
        toast.success("Employee data cleared successfully.");
    } catch (err) {
        console.error(err);
        toast.error("Failed to clear data.");
    }
};