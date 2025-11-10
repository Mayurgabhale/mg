const [monthlyFile, setMonthlyFile] = useState(null);
const [uploadStatus, setUploadStatus] = useState("");

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
  } catch (err) {
    console.error(err);
    setUploadStatus("Upload failed.");
  }
};

return (
  <div>
    <input type="file" onChange={handleMonthlyFileChange} />
    <button onClick={uploadMonthlySheet} disabled={!monthlyFile}>
      Upload
    </button>
    <p>{uploadStatus}</p>
  </div>
);