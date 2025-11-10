 {activeTab === "uploadMonthly" && (
                        <div style={styles.uploadContainer}>
                            {/* Header */}
                            <div style={styles.uploadHeader}>
                                <div style={styles.headerLeft}>
                                    <FiUpload size={32} style={{ color: '#3b82f6', marginRight: 10 }} />
                                    <div>
                                        <h2 style={styles.uploadTitle}>Upload Monthly Active Sheet</h2>
                                        <p style={styles.uploadSubtitle}>
                                            Upload the latest monthly employee file to update active staff records.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Upload Form */}
                            <div>
                                <input type="file" onChange={handleMonthlyFileChange} style={styles.fileInput}  />
                                <button onClick={uploadMonthlySheet} disabled={!monthlyFile} style={styles.uploadButton} >
                                    Upload
                                </button>
                                
                            </div>

                            {/* Upload Status */}
                            {uploadStatus && (
                                <div style={styles.uploadStatus}>
                                    <p>{uploadStatus}</p>
                                </div>
                            )}

                            {/* Uploaded Data Table */}
                            {employeeData.length > 0 && (
                                <div style={styles.tableContainer}>
                                    <h3 style={styles.tableTitle}>Uploaded Employee Data</h3>
                                    <table style={styles.table}>
                                        <thead>
                                            <tr>
                                                <th>Employee ID</th>
                                                <th>Full Name</th>
                                                <th>Department</th>
                                                <th>Company</th>
                                                <th>Location</th>
                                                <th>Years of Service</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {employeeData.map((emp, idx) => (
                                                <tr key={idx}>
                                                    <td>{emp.employee_id}</td>
                                                    <td>{emp.full_name}</td>
                                                    <td>{emp.department_name}</td>
                                                    <td>{emp.company_name}</td>
                                                    <td>{emp.location_city}</td>
                                                    <td>{emp.years_of_service}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    )}

this part i want to make more future..
all like when uplod the file  date upload this file all details i want,, one better format ok 

const styles = {
    // Upload Container
    uploadContainer: {
        padding: "20px",
        maxWidth: "1000px",
        margin: "0 auto",
    },

    // Upload Header
    uploadHeader: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "24px",
        background: isDark ?
            "linear-gradient(135deg, #1e293b, #0f172a)" :
            "linear-gradient(135deg, #f8fafc, #e2e8f0)",
        borderRadius: "12px",
        marginBottom: "24px",
        border: isDark ? "1px solid rgba(255,255,255,0.1)" : "1px solid rgba(0,0,0,0.05)",
    },

    headerLeft: {
        display: "flex",
        alignItems: "center",
        gap: "12px",
    },

    uploadTitle: {
        fontSize: "24px",
        fontWeight: "700",
        color: isDark ? "#f1f5f9" : "#0f172a",
        margin: "0 0 4px 0",
    },

    uploadSubtitle: {
        fontSize: "14px",
        color: isDark ? "#94a3b8" : "#64748b",
        margin: "0",
    },

    // Upload Form
    uploadForm: {
        background: isDark ? "#1e293b" : "white",
        padding: "24px",
        borderRadius: "12px",
        border: isDark ? "1px solid rgba(255,255,255,0.1)" : "1px solid #e2e8f0",
        marginBottom: "20px",
    },

    fileInput: {
        width: "100%",
        padding: "12px",
        border: isDark ? "1px solid rgba(255,255,255,0.2)" : "1px solid #d1d5db",
        borderRadius: "8px",
        background: isDark ? "#334155" : "#f9fafb",
        color: isDark ? "#f1f5f9" : "#111827",
        marginBottom: "16px",
        fontSize: "14px",
    },

    uploadButton: {
        background: "#3b82f6",
        color: "white",
        border: "none",
        padding: "12px 24px",
        borderRadius: "8px",
        fontSize: "14px",
        fontWeight: "600",
        cursor: "pointer",
        transition: "all 0.2s ease",
        ':disabled': {
            background: "#9ca3af",
            cursor: "not-allowed",
            opacity: 0.6,
        },
        ':hover:not(:disabled)': {
            background: "#2563eb",
            transform: "translateY(-1px)",
        }
    },

    // Upload Status
    uploadStatus: {
        padding: "16px",
        borderRadius: "8px",
        marginBottom: "20px",
        fontSize: "14px",
        fontWeight: "500",
        background: isDark ? "rgba(34, 197, 94, 0.1)" : "#dcfce7",
        color: isDark ? "#4ade80" : "#166534",
        border: isDark ? "1px solid rgba(34, 197, 94, 0.3)" : "1px solid #bbf7d0",
    },

    // Error Status
    uploadError: {
        background: isDark ? "rgba(239, 68, 68, 0.1)" : "#fef2f2",
        color: isDark ? "#f87171" : "#dc2626",
        border: isDark ? "1px solid rgba(239, 68, 68, 0.3)" : "1px solid #fecaca",
    },

    // Table Container
    tableContainer: {
        background: isDark ? "#1e293b" : "white",
        borderRadius: "12px",
        border: isDark ? "1px solid rgba(255,255,255,0.1)" : "1px solid #e2e8f0",
        overflow: "hidden",
        marginTop: "24px",
    },

    tableTitle: {
        fontSize: "18px",
        fontWeight: "600",
        color: isDark ? "#f1f5f9" : "#0f172a",
        padding: "20px 24px",
        margin: "0",
        background: isDark ? 
            "linear-gradient(135deg, #1e293b, #0f172a)" : 
            "linear-gradient(135deg, #f8fafc, #e2e8f0)",
        borderBottom: isDark ? "1px solid rgba(255,255,255,0.1)" : "1px solid #e2e8f0",
    },

    // Table Styles
    table: {
        width: "100%",
        borderCollapse: "collapse",
        fontSize: "14px",
    },

    tableHead: {
        background: isDark ? "#334155" : "#f8fafc",
    },

    tableHeader: {
        padding: "12px 16px",
        textAlign: "left",
        fontWeight: "600",
        color: isDark ? "#e2e8f0" : "#374151",
        borderBottom: isDark ? "1px solid rgba(255,255,255,0.1)" : "1px solid #e5e7eb",
        fontSize: "12px",
        textTransform: "uppercase",
        letterSpacing: "0.05em",
    },

    tableRow: {
        borderBottom: isDark ? "1px solid rgba(255,255,255,0.05)" : "1px solid #f3f4f6",
        transition: "background-color 0.2s ease",
        ':hover': {
            background: isDark ? "rgba(255,255,255,0.05)" : "#f9fafb",
        }
    },

    tableCell: {
        padding: "12px 16px",
        color: isDark ? "#e2e8f0" : "#374151",
        borderBottom: isDark ? "1px solid rgba(255,255,255,0.05)" : "1px solid #f3f4f6",
    },

    // Empty State
    emptyState: {
        padding: "40px 24px",
        textAlign: "center",
        color: isDark ? "#94a3b8" : "#6b7280",
    },

    emptyStateIcon: {
        fontSize: "48px",
        marginBottom: "16px",
        opacity: 0.5,
    },

    emptyStateText: {
        fontSize: "16px",
        margin: "0",
    },

    // Loading State
    loadingState: {
        padding: "40px 24px",
        textAlign: "center",
        color: isDark ? "#94a3b8" : "#6b7280",
    },

    // Responsive
    '@media (max-width: 768px)': {
        uploadContainer: {
            padding: "12px",
        },
        uploadHeader: {
            padding: "16px",
            flexDirection: "column",
            alignItems: "flex-start",
            gap: "16px",
        },
        tableContainer: {
            overflowX: "auto",
        },
        table: {
            minWidth: "600px",
        }
    }
};


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
