
this is not a correct format.. 
    Upload Monthly Active Sheet
Upload the latest monthly employee file
this i want one one side i mens left side ok 

Drop your file here
Supports .xlsx, .xls, .csv files up to 10MB

Choose File
Process Upload
this section is hide.. after the file is upload succefully,,, not show

one foramt i want to show 

8587 employee records saved successfully to SQLite database.

File Name
Excel 2025-10-09 16_03 GMT+5_30.xlsx
File Size
4.30 MB
Upload Date
11/10/2025 at 3:25:57 PM
Records Processed
0 employees
and this section not only this i want in this more 
Upload Date
11/10/2025 at 3:27:47 PM 
and thsi time show only when we upload the file.. upload file time  ok .. 
    read belwo all code how carefully and how to do this 
for more information  .. and also uploade file delete option wiht confmartion ok .. 
              

    const [employeeData, setEmployeeData] = useState([]);

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


{activeTab === "uploadMonthly" && (
                        <div style={styles.uploadContainer}>
                            {/* Header */}
                            <div style={styles.uploadHeader}>
                                <div style={styles.headerLeft}>
                                    <div style={styles.uploadIcon}>
                                        <FiUpload size={32} />
                                    </div>
                                    <div>
                                        <h2 style={styles.uploadTitle}>Upload Monthly Active Sheet</h2>
                                        <p style={styles.uploadSubtitle}>
                                            Upload the latest monthly employee file
                                        </p>
                                    </div>
                                </div>
                               
                            </div>

                            {/* Upload Card */}
                            <div style={styles.uploadCard}>
                                <div style={styles.uploadArea}>
                                    <FiUploadCloud size={48} style={styles.uploadCloudIcon} />
                                    <h3 style={styles.uploadAreaTitle}>Drop your file here</h3>
                                    <p style={styles.uploadAreaSubtitle}>Supports .xlsx, .xls, .csv files up to 10MB</p>

                                      <label htmlFor="monthly-file-upload" style={styles.fileInputLabel}>
                                        <FiFolder style={{ marginRight: 8 }} />
                                        Choose File
                                    </label>
                                    <input
                                        // id="file-upload"
                                         id="monthly-file-upload"
                                        type="file"
                                        onChange={handleMonthlyFileChange}
                                        style={styles.hiddenFileInput}
                                        accept=".xlsx,.xls,.csv"
                                    />

                                    {monthlyFile && (
                                        <div style={styles.filePreview}>
                                            <FiFile style={styles.fileIcon} />
                                            <div style={styles.fileInfo}>
                                                <span style={styles.fileName}>{monthlyFile.name}</span>
                                                <span style={styles.fileSize}>
                                                    {(monthlyFile.size / 1024 / 1024).toFixed(2)} MB
                                                </span>
                                            </div>
                                            <button
                                                onClick={() => setMonthlyFile(null)}
                                                style={styles.removeFileButton}
                                            >
                                                <FiX />
                                            </button>
                                        </div>
                                    )}
                                </div>

                                {/* Upload Button */}
                                <button
                                    onClick={uploadMonthlySheet}
                                    disabled={!monthlyFile || uploadStatus?.includes('Uploading')}
                                    style={!monthlyFile ? styles.uploadButtonDisabled : styles.uploadButton}
                                >
                                    {uploadStatus?.includes('Uploading') ? (
                                        <>
                                            <FiLoader size={16} style={{ marginRight: 8, animation: 'spin 1s linear infinite' }} />
                                            Uploading...
                                        </>
                                    ) : (
                                        <>
                                            <FiUpload style={{ marginRight: 8 }} />
                                            Process Upload
                                        </>
                                    )}
                                </button>
                            </div>

                            {/* Upload Status & Metadata */}
                            {uploadStatus && (
                                <div style={uploadStatus.includes('Error') ? styles.uploadStatusError : styles.uploadStatusSuccess}>
                                    <div style={styles.statusHeader}>
                                        {uploadStatus.includes('Error') ? <FiAlertCircle size={20} /> : <FiCheckCircle size={20} />}
                                        <span style={styles.statusTitle}>
                                            {uploadStatus.includes('Error') ? 'Upload Failed' : 'Upload Successful'}
                                        </span>
                                    </div>
                                    <p style={styles.statusMessage}>{uploadStatus}</p>

                                    {/* Upload Metadata */}
                                    {!uploadStatus.includes('Error') && monthlyFile && (
                                        <div style={styles.metadataGrid}>
                                            <div style={styles.metadataItem}>
                                                <span style={styles.metadataLabel}>File Name</span>
                                                <span style={styles.metadataValue}>{monthlyFile.name}</span>
                                            </div>
                                            <div style={styles.metadataItem}>
                                                <span style={styles.metadataLabel}>File Size</span>
                                                <span style={styles.metadataValue}>
                                                    {(monthlyFile.size / 1024 / 1024).toFixed(2)} MB
                                                </span>
                                            </div>
                                            <div style={styles.metadataItem}>
                                                <span style={styles.metadataLabel}>Upload Date</span>
                                                <span style={styles.metadataValue}>
                                                    {new Date().toLocaleDateString()} at {new Date().toLocaleTimeString()}
                                                </span>
                                            </div>
                                            <div style={styles.metadataItem}>
                                                <span style={styles.metadataLabel}>Records Processed</span>
                                                <span style={styles.metadataValue}>{employeeData.length} employees</span>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Uploaded Data Summary */}
                            {employeeData.length > 0 && (
                                <div style={styles.summaryCard}>
                                    <div style={styles.summaryHeader}>
                                        <h3 style={styles.summaryTitle}>Upload Summary</h3>
                                        <div style={styles.summaryStats}>
                                            <div style={styles.summaryStat}>
                                                <FiUsers style={styles.summaryIcon} />
                                                <span style={styles.summaryNumber}>{employeeData.length}</span>
                                                <span style={styles.summaryLabel}>Total Employees</span>
                                            </div>
                                            <div style={styles.summaryStat}>
                                                <FiMapPin style={styles.summaryIcon} />
                                                <span style={styles.summaryNumber}>
                                                    {new Set(employeeData.map(emp => emp.location_city)).size}
                                                </span>
                                                <span style={styles.summaryLabel}>Locations</span>
                                            </div>
                                            <div style={styles.summaryStat}>
                                                <FiBriefcase style={styles.summaryIcon} />
                                                <span style={styles.summaryNumber}>
                                                    {new Set(employeeData.map(emp => emp.department_name)).size}
                                                </span>
                                                <span style={styles.summaryLabel}>Departments</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Uploaded Data Table */}
                            {employeeData.length > 0 && (
                                <div style={styles.tableContainer}>
                                    <div style={styles.tableHeader}>
                                        <h3 style={styles.tableTitle}>Employee Records</h3>
                                        <div style={styles.tableActions}>
                                            <button style={styles.exportButton}>
                                                <FiDownload style={{ marginRight: 6 }} />
                                                Export CSV
                                            </button>
                                            <div style={styles.searchBox}>
                                                <FiSearch style={styles.searchIcon} />
                                                <input
                                                    type="text"
                                                    placeholder="Search employees..."
                                                    style={styles.searchInput}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div style={styles.tableWrapper}>
                                        <table style={styles.table}>
                                            <thead style={styles.tableHead}>
                                                <tr>
                                                    <th style={styles.tableHeader}>Employee ID</th>
                                                    <th style={styles.tableHeader}>Full Name</th>
                                                    <th style={styles.tableHeader}>Department</th>
                                                    <th style={styles.tableHeader}>Company</th>
                                                    <th style={styles.tableHeader}>Location</th>
                                                    <th style={styles.tableHeader}>Years of Service</th>
                                                    <th style={styles.tableHeader}>Status</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {employeeData.map((emp, idx) => (
                                                    <tr key={idx} style={styles.tableRow}>
                                                        <td style={styles.tableCell}>
                                                            <div style={styles.employeeId}>
                                                                <FiUser style={{ marginRight: 6 }} />
                                                                {emp.employee_id}
                                                            </div>
                                                        </td>
                                                        <td style={styles.tableCell}>
                                                            <div style={styles.employeeName}>
                                                                <span style={styles.name}>{emp.full_name}</span>
                                                                <span style={styles.email}>{emp.employee_email}</span>
                                                            </div>
                                                        </td>
                                                        <td style={styles.tableCell}>
                                                            <span style={styles.department}>{emp.department_name}</span>
                                                        </td>
                                                        <td style={styles.tableCell}>
                                                            <span style={styles.company}>{emp.company_name}</span>
                                                        </td>
                                                        <td style={styles.tableCell}>
                                                            <div style={styles.location}>
                                                                <FiMapPin size={12} style={{ marginRight: 4 }} />
                                                                {emp.location_city}
                                                            </div>
                                                        </td>
                                                        <td style={styles.tableCell}>
                                                            <div style={styles.serviceBadge}>
                                                                {emp.years_of_service} years
                                                            </div>
                                                        </td>
                                                        <td style={styles.tableCell}>
                                                            <div style={emp.current_status === 'Active' ? styles.statusActive : styles.statusInactive}>
                                                                {emp.current_status || 'Active'}
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>

                                    {/* Table Footer */}
                                    <div style={styles.tableFooter}>
                                        <span style={styles.footerText}>
                                            Showing {employeeData.length} of {employeeData.length} records
                                        </span>
                                        <div style={styles.pagination}>
                                            <button style={styles.paginationButton} disabled>
                                                <FiChevronLeft />
                                            </button>
                                            <span style={styles.paginationInfo}>Page 1 of 1</span>
                                            <button style={styles.paginationButton} disabled>
                                                <FiChevronRight />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}




from fastapi import APIRouter, UploadFile, File, HTTPException
from sqlalchemy import create_engine, Column, String, Integer, Float
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from io import BytesIO
import pandas as pd

# =======================
#   ROUTER CONFIG
# =======================
router = APIRouter(prefix="/monthly_sheet", tags=["monthly_sheet"])

# =======================
#   DATABASE CONFIG
# =======================
DATABASE_URL = "sqlite:///./database.db"
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(bind=engine, autocommit=False, autoflush=False)
Base = declarative_base()


# =======================
#   EMPLOYEE MODEL
# =======================
class Employee(Base):
    __tablename__ = "employees"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    employee_id = Column(String, index=True)
    last_name = Column(String)
    first_name = Column(String)
    preferred_first_name = Column(String)
    middle_name = Column(String)
    full_name = Column(String)
    current_status = Column(String)
    employee_type = Column(String)
    hire_date = Column(String)
    job_code = Column(String)
    position_id = Column(String)
    business_title = Column(String)
    department_name = Column(String)
    company_name = Column(String)
    work_country = Column(String)
    location_description = Column(String)
    location_city = Column(String)
    management_level = Column(String)
    manager_name = Column(String)
    employee_email = Column(String)
    manager_email = Column(String)
    fte = Column(Float)
    tenure = Column(String)
    years_of_service = Column(Float)
    length_of_service_months = Column(Float)
    time_in_position_months = Column(Float)

# Create table if not exists
Base.metadata.create_all(bind=engine)


# =======================
#   API ENDPOINTS
# =======================
@router.post("/upload_monthly")
async def upload_monthly(file: UploadFile = File(...)):
    """Upload the monthly employee Excel or CSV sheet and store data into SQLite."""
    if not file.filename.lower().endswith((".xlsx", ".xls", ".csv")):
        raise HTTPException(status_code=400, detail="Please upload a valid Excel or CSV file.")

    content = await file.read()

    try:
        if file.filename.lower().endswith(".csv"):
            df = pd.read_csv(BytesIO(content))
        else:
            df = pd.read_excel(BytesIO(content))
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error reading file: {e}")

    # Normalize column names
    df.columns = [c.strip().replace(" ", "_").replace("/", "_").replace("-", "_") for c in df.columns]

    session = SessionLocal()
    session.query(Employee).delete()  # optional: clear old data

    for _, row in df.iterrows():
        emp = Employee(
            employee_id=str(row.get("Employee_ID", "")),
            last_name=row.get("Last_Name"),
            first_name=row.get("First_Name"),
            preferred_first_name=row.get("Preferred_First_Name"),
            full_name=row.get("Full_Name"),
            business_title=row.get("Business_Title"),
            management_level=row.get("Management_Level"),
            employee_email=row.get("Employee_s_Email"),
            manager_email=row.get("Manager_s_Email"),
            department_name=row.get("Department_Name"),
            company_name=row.get("Company_Name"),
            work_country=row.get("Work_Country"),
            location_description=row.get("Location_Description"),
            location_city=row.get("Location_City"),
            fte=float(row.get("FTE", 0)) if pd.notna(row.get("FTE")) else None,
            tenure=row.get("Tenure"),
            years_of_service=float(row.get("Years_of_Service", 0)) if pd.notna(row.get("Years_of_Service")) else None,
            length_of_service_months=float(row.get("Length_of_Service_in_Months", 0)) if pd.notna(row.get("Length_of_Service_in_Months")) else None,
            time_in_position_months=float(row.get("Time_in_Position_(Months)", 0)) if pd.notna(row.get("Time_in_Position_(Months)")) else None,
        )
        session.add(emp)

    session.commit()
    session.close()

    return {"message": f"{len(df)} employee records saved successfully to SQLite database."}


@router.get("/employees")
def get_all_employees():
    session = SessionLocal()
    employees = session.query(Employee).all()
    session.close()
    return [
        {k: v for k, v in e.__dict__.items() if k != "_sa_instance_state"}
        for e in employees
    ]


@router.get("/employee/{emp_id}")
def get_employee(emp_id: str):
    session = SessionLocal()
    emp = session.query(Employee).filter(Employee.employee_id == emp_id).first()
    session.close()
    if not emp:
        raise HTTPException(status_code=404, detail="Employee not found")
    return {k: v for k, v in emp.__dict__.items() if k != "_sa_instance_state"}

