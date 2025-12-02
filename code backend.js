Incident Reporting Form
When you submit this form, it will not automatically collect your details like name and email address unless you provide it yourself.
*Required
1.Type of Incident / Accident (select option )
•	Medical 
•	Theft 
•	Fire 
•	HR Related Incident 
•	Outside Work Place Violence 
•	Threat 
•	Death 
•	Fraud 
•	Any Other Safety / Security Related Incident 
•	Other – Enter your answer
2.Date of Report 
3.Time of Report (HH:MM)
4.Name of Impacted Employee / Person
5.Employee ID of Impacted Employee
6.Was this incident reported verbally before submitting this report?
 ** In case of medical emergency inform local HR
•	Yes
•	No

If Yes then
7.Incident reported to: (select option )
•	Supervisor
•	Manager
•	HR
•	Other Employee
•	Not Reported
8.If Yes, to whom ( Name and Department ):
9.Location of Incident or Accident (Specify Office / Branch)
10.Reported By - Name:
11.Reported By - Employee ID #
12.Reported By - Contact Number
13.Date of Incident Occurred
14.Time of Incident 
15.Detailed Description of Incident (long ans)
16.Immediate Actions Taken: (long ans)
17.Accompanying Person Name and Contact Details
18.Name of Witnesses or Employee present during the incident/accident:
19.Contact Number - Witness or Employee
20.Root cause analysis of the incident/accident:
21.Preventive actions taken during or after incident/accident (If any):
Submit 


If No then 
7.Location of Incident or Accident (Specify Office / Branch)
8.Reported By - Name:
9.Reported By - Employee ID #
10.Reported By - Contact Number
11.Date of Incident Occurred
12.Time of Incident 
13.Detailed Description of Incident  (long ans)
14.Immediate Actions Taken: (long ans)
15.Accompanying Person Name and Contact Details
16.Name of Witnesses or Employee present during the incident/accident:
17.Contact Number - Witness or Employee
18.Root cause analysis of the incident/accident:
19.Preventive actions taken during or after incident/accident (If any):

now create a from ok 
read the below code carefullym and add thei new future in travel dasbhoad ok, read above all above in includein fomr ok 
give me code step step ok 
C:\Users\W0024618\Desktop\swipeData\client\src\pages\EmployeeTravelDashboard.jsx
from "react-icons/fi";
import { IoIosAddCircle } from "react-icons/io";
import { BsPersonWalking } from "react-icons/bs";
import {
    FaCar,
    FaTruck,
    FaTrain,
    FaPlane,
    FaShip,
    FaBicycle, FaHotel, FaBuilding
} from "react-icons/fa";

import { FaLocationArrow } from 'react-icons/fa6';

import './EmployeeTravelDashboard.css';

const fmt = (iso) => {
    if (!iso) return "";
    try {
        const d = new Date(iso);
        return d.toLocaleDateString() + " " + d.toLocaleTimeString();
    } catch {
        return String(iso);
    }
};

const EmployeeTravelDashboard = () => {
    const [file, setFile] = useState(null);
    const [items, setItems] = useState([]);
    const [summary, setSummary] = useState({});
    const [loading, setLoading] = useState(false);

    const [filters, setFilters] = useState({
        country: "",
        location: "",
        legType: "",
        search: "",
        status: "",
        showVIPOnly: false,
    });
    const [selectedTraveler, setSelectedTraveler] = useState(null);
    const [activeTab, setActiveTab] = useState("overview");

    const [showUploadFileSection, setShowUploadFileSection] = useState(false);
    // track which city cards are expanded
    const [expandedCities, setExpandedCities] = useState({});


    // login start
    const [showLogin, setShowLogin] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    // login end


    // 🆕 Add theme state
    const [isDarkTheme, setIsDarkTheme] = useState(false);
    // 🆕 Toggle theme function
    const toggleTheme = () => {
        setIsDarkTheme(!isDarkTheme);
    };

    // Add to your existing state variables
    const [regionsData, setRegionsData] = useState({});
    const [selectedRegion, setSelectedRegion] = useState(null);
    const [regionDetails, setRegionDetails] = useState(null);
    // 🆕 Helper functions for regions
    const getRegionColor = (regionCode) => {
        const colors = {
            'GLOBAL': '#6b7280',
            'APAC': '#7c3aed',
            'EMEA': '#7c3aed',
            'LACA': '#7c3aed',
            'NAMER': '#7c3aed'
        };
        return colors[regionCode] || '#6b7280';
    };

    const getRegionIcon = (regionCode) => {
        const icons = {
            'GLOBAL': '🌍',
            'APAC': '🌏',
            'EMEA': '🌍',
            'LACA': '🌎',
            'NAMER': '🌎'
        };
        return icons[regionCode] || '📍';
    };

    const [regionData, setRegionData] = useState({});

    // 📝📝📝📝📝📝📝

    // State variables - UPDATED
    const [employeeData, setEmployeeData] = useState([]);
    const [monthlyFile, setMonthlyFile] = useState(null);
    const [showUploadPopup, setShowUploadPopup] = useState(false);
    const [hasUploadedData, setHasUploadedData] = useState(false);
    const [uploadTime, setUploadTime] = useState(null);
    const [uploadStatus, setUploadStatus] = useState("");

    // Load data on component mount - UPDATED
    useEffect(() => {
        const savedHasUploadedData = localStorage.getItem('hasUploadedData');
        const savedUploadTime = localStorage.getItem('uploadTime');
        const savedMonthlyFile = localStorage.getItem('monthlyFile');

        if (savedHasUploadedData === 'true') {
            setHasUploadedData(true);
            if (savedUploadTime) {
                setUploadTime(new Date(savedUploadTime));
            }
            if (savedMonthlyFile) {
                setMonthlyFile(JSON.parse(savedMonthlyFile));
            }
            fetchEmployeeData();
        }
    }, []);


    const fetchEmployeeData = async () => {
        try {
            const res = await fetch("http://localhost:8000/monthly_sheet/employees");
            const data = await res.json();

            setEmployeeData(data.employees || []);  // ✅ Fix: use array
            setUploadTime(data.uploaded_at ? new Date(data.uploaded_at) : null);
            setUploadStatus(data.message || "");
        } catch (err) {
            console.error("Failed to fetch employee data:", err);
        }
    };

    // Handle file selection
    const handleMonthlyFileChange = (e) => {
        const selected = e.target.files?.[0];
        setMonthlyFile(selected);
    };

    // Handle upload submission - UPDATED
    const handleUploadSubmit = async () => {
        if (!monthlyFile) return;

        const formData = new FormData();
        formData.append("file", monthlyFile);

        try {
            setUploadStatus("Uploading...");

            const res = await fetch("http://localhost:8000/monthly_sheet/upload_monthly", {
                method: "POST",
                body: formData,
            });

            const result = await res.json();

            if (res.ok) {
                setUploadStatus("Upload successful!");
                setUploadTime(new Date());
                setHasUploadedData(true);
                setShowUploadPopup(false);

                // Save ALL data to localStorage
                localStorage.setItem('hasUploadedData', 'true');
                localStorage.setItem('uploadTime', new Date().toISOString());
                localStorage.setItem('monthlyFile', JSON.stringify({
                    name: monthlyFile.name,
                    size: monthlyFile.size,
                    type: monthlyFile.type,
                    lastModified: monthlyFile.lastModified
                }));

                // Fetch the uploaded data
                await fetchEmployeeData();
                toast.success("File uploaded successfully!");
            } else {
                throw new Error(result.detail || "Upload failed");
            }
        } catch (err) {
            console.error(err);
            setUploadStatus("Upload failed!");
            toast.error("Upload failed!");
        }
    };

    // Delete confirmation
    const confirmDeleteData = () => {
        if (window.confirm("Are you sure you want to delete all employee data? This action cannot be undone.")) {
            deleteEmployeeData();
        }
    };

    // Delete employee data - UPDATED
    const deleteEmployeeData = async () => {
        try {
            // Clear backend data
            await fetch("http://localhost:8000/monthly_sheet/clear_data", {
                method: "DELETE"
            });

            // Clear frontend state
            setEmployeeData([]);
            setMonthlyFile(null);
            setHasUploadedData(false);
            setUploadTime(null);
            setUploadStatus("");

            // Clear localStorage
            localStorage.removeItem('hasUploadedData');
            localStorage.removeItem('uploadTime');
            localStorage.removeItem('monthlyFile');

            toast.success("Employee data cleared successfully.");
        } catch (err) {
            console.error(err);
            toast.error("Failed to clear data.");
        }
    };
   <aside style={styles.sidebar}>
                    <nav style={styles.nav}>
                        {[

                            { id: "regions", label: "Global", icon: FiGlobe }, // 🆕 New tab
                            { id: "AddNewTraveler", label: "Add New Traveler", icon: IoIosAddCircle },
                            { id: "overview", label: "Overview", icon: FiActivity },
                            { id: "analytics", label: "Analytics", icon: FiBarChart2 },
                            { id: "recent", label: "Recent Travels", icon: FiClock },
                            { id: "countries", label: "Country Analysis", icon: FiMapPin },
                            { id: "types", label: "Travel Types", icon: FiAward },

                        ].map(item => (
                            <button
                                key={item.id}
                                onClick={() => setActiveTab(item.id)}
                                style={{
                                    ...styles.navItem,
                                    ...(activeTab === item.id ? styles.navItemActive : {})
                                }}
                            >
                                <item.icon style={styles.navIcon} />
                                {item.label}
                            </button>
                        ))}
                    </nav>

                    {/* Quick Stats */}
                    <div style={styles.sideCard}>
                        <div style={styles.cardHeader}>
                            <FiTrendingUp style={styles.cardIcon} />
                            <h3 style={styles.sideTitle}>Quick Stats</h3>
                        </div>

                            {activeTab === "overview" && (
                                <div style={styles.card}>
                                    <div style={styles.tableHeader}>

                                        <h3 style={styles.tableTitle}>
                                            {filters.region ? `${filters.region} - Travel Records` : "All Travel Records"}
                                        </h3>
                                        <div style={styles.tableHeaderRight}>
                                            {filters.region && (
                                                <button
                                                    onClick={() => setFilters(prev => ({ ...prev, region: "" }))}
                                                    style={styles.clearRegionButton}
                                                >
                                                    Clear Region
                                                </button>
                                            )}
                                            <span style={styles.tableBadge}>{filtered.length} records</span>
                                        </div>
                                    </div>
                                    <div style={styles.tableWrap}>
                                        <table style={styles.table}>
                                            <thead style={styles.thead}>
                                                <tr>
                                                    <th style={styles.th}>Status</th>
                                                    <th style={styles.th}>Traveler</th>
 {activeTab === "analytics" && (
                                <div style={styles.analyticsGrid}>
                                    <div style={styles.analyticsCard}>
                                        <h4 style={styles.analyticsTitle}>Travel Analytics</h4>
                                        <div style={styles.analyticsStats}>
                                            <div style={styles.analyticsStat}>
                                                <span style={styles.analyticsLabel}>Average Duration</span>
                                                <strong style={styles.analyticsValue}>{analy
both themme
                                                                                       
// 🆕 Theme-aware style functions
const getStyles = (isDark) => ({


    // new card
    regionCard: {
        padding: "12px 16px",
        borderRadius: "16px",
        backgroundColor: isDark ? "#1
                                                                                       
# incident_report.py
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, validator
from typing import Optional, List, Any
from sqlalchemy import Column, Integer, String, DateTime, Text
from sqlalchemy.dialects.sqlite import JSON as SQLITE_JSON  # maps to TEXT in SQLite
from datetime import datetime, date
import zoneinfo
import json

# reuse DB Base/engine/SessionLocal exported from monthly_sheet
from monthly_sheet import Base, engine, SessionLocal

router = APIRouter(prefix="/incident", tags=["incident"])

SERVER_TZ = zoneinfo.ZoneInfo("Asia/Kolkata")

# -------------------------
# SQLAlchemy model
# -------------------------
class IncidentReport(Base):
    __tablename__ = "incident_reports"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    type_of_incident = Column(String, nullable=True)   # Medical / Theft / ...
    date_of_report = Column(String, nullable=True)     # stored as ISO date string
    time_of_report = Column(String, nullable=True)     # HH:MM
    impacted_name = Column(String, nullable=True)
    impacted_employee_id = Column(String, nullable=True)
    was_reported_verbally = Column(Integer, default=0)  # 1 = Yes, 0 = No
    # if yes: who it was reported to (list of choices) and details about to-whom
    incident_reported_to = Column(String, nullable=True)   # CSV or JSON string
    reported_to_details = Column(String, nullable=True)    # "If yes, to whom (Name and Department)"
    # common fields
    location = Column(String, nullable=True)  # Location of Incident or Accident (Office / Branch)
    reported_by_name = Column(String, nullable=True)
    reported_by_employee_id = Column(String, nullable=True)
    reported_by_contact = Column(String, nullable=True)
    date_of_incident = Column(String, nullable=True)    # ISO date string
    time_of_incident = Column(String, nullable=True)
    detailed_description = Column(Text, nullable=True)
    immediate_actions_taken = Column(Text, nullable=True)
    accompanying_person = Column(SQLITE_JSON, nullable=True)   # JSON array or null
    witnesses = Column(SQLITE_JSON, nullable=True)            # JSON array
    witness_contacts = Column(SQLITE_JSON, nullable=True)     # JSON array
    root_cause_analysis = Column(Text, nullable=True)
    preventive_actions = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.now)

# ensure table exists
Base.metadata.create_all(bind=engine)

# -------------------------
# Pydantic Schemas
# -------------------------
class IncidentCreate(BaseModel):
    type_of_incident: Optional[str]
    date_of_report: Optional[str]      # allow ISO string or plain date string
    time_of_report: Optional[str]      # "HH:MM"
    impacted_name: Optional[str]
    impacted_employee_id: Optional[str]
    was_reported_verbally: bool
    # if was_reported_verbally == True:
    incident_reported_to: Optional[List[str]] = None
    reported_to_details: Optional[str] = None

    # fields used in both branches
    location: Optional[str] = None
    reported_by_name: Optional[str] = None
    reported_by_employee_id: Optional[str] = None
    reported_by_contact: Optional[str] = None
    date_of_incident: Optional[str] = None
    time_of_incident: Optional[str] = None
    detailed_description: Optional[str] = None
    immediate_actions_taken: Optional[str] = None
    accompanying_person: Optional[List[dict]] = None
    witnesses: Optional[List[str]] = None
    witness_contacts: Optional[List[str]] = None
    root_cause_analysis: Optional[str] = None
    preventive_actions: Optional[str] = None

    @validator("incident_reported_to", always=True)
    def validate_reported_to(cls, v, values):
        # When was_reported_verbally is True, incident_reported_to must be provided (at least one)
        if values.get("was_reported_verbally"):
            if not v or not isinstance(v, list) or len(v) == 0:
                raise ValueError("When was_reported_verbally is True, provide incident_reported_to (list of options).")
        return v

    @validator("reported_to_details", always=True)
    def validate_reported_to_details(cls, v, values):
        # recommended to provide details when was_reported_verbally is True
        if values.get("was_reported_verbally"):
            # not strictly required, but warn/require: here we require at least an empty string allowed
            if v is None:
                return ""  # keep DB field non-null if caller omits
        return v

class IncidentOut(BaseModel):
    id: int
    type_of_incident: Optional[str]
    date_of_report: Optional[str]
    time_of_report: Optional[str]
    impacted_name: Optional[str]
    impacted_employee_id: Optional[str]
    was_reported_verbally: bool
    incident_reported_to: Optional[List[str]] = None
    reported_to_details: Optional[str] = None
    location: Optional[str] = None
    reported_by_name: Optional[str] = None
    reported_by_employee_id: Optional[str] = None
    reported_by_contact: Optional[str] = None
    date_of_incident: Optional[str] = None
    time_of_incident: Optional[str] = None
    detailed_description: Optional[str] = None
    immediate_actions_taken: Optional[str] = None
    accompanying_person: Optional[List[dict]] = None
    witnesses: Optional[List[str]] = None
    witness_contacts: Optional[List[str]] = None
    root_cause_analysis: Optional[str] = None
    preventive_actions: Optional[str] = None
    created_at: Optional[datetime]

    class Config:
        orm_mode = True

# -------------------------
# Endpoints
# -------------------------
@router.post("/create", response_model=IncidentOut)
def create_incident(payload: IncidentCreate):
    """
    Create a new incident record.
    Validation: enforces incident_reported_to when was_reported_verbally is True.
    """
    db = SessionLocal()
    try:
        inst = IncidentReport(
            type_of_incident = payload.type_of_incident,
            date_of_report = payload.date_of_report,
            time_of_report = payload.time_of_report,
            impacted_name = payload.impacted_name,
            impacted_employee_id = payload.impacted_employee_id,
            was_reported_verbally = 1 if payload.was_reported_verbally else 0,
            incident_reported_to = json.dumps(payload.incident_reported_to) if payload.incident_reported_to else None,
            reported_to_details = payload.reported_to_details,
            location = payload.location,
            reported_by_name = payload.reported_by_name,
            reported_by_employee_id = payload.reported_by_employee_id,
            reported_by_contact = payload.reported_by_contact,
            date_of_incident = payload.date_of_incident,
            time_of_incident = payload.time_of_incident,
            detailed_description = payload.detailed_description,
            immediate_actions_taken = payload.immediate_actions_taken,
            accompanying_person = payload.accompanying_person,
            witnesses = payload.witnesses,
            witness_contacts = payload.witness_contacts,
            root_cause_analysis = payload.root_cause_analysis,
            preventive_actions = payload.preventive_actions,
            created_at = datetime.now(tz=SERVER_TZ)
        )
        db.add(inst)
        db.commit()
        db.refresh(inst)

        # convert JSON-string fields back to Python lists for response_model
        out = inst
        try:
            if out.incident_reported_to:
                out.incident_reported_to = json.loads(out.incident_reported_to)
        except Exception:
            out.incident_reported_to = None

        return out
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        db.close()


@router.get("/list", response_model=List[IncidentOut])
def list_incidents(limit: int = 200):
    db = SessionLocal()
    try:
        rows = db.query(IncidentReport).order_by(IncidentReport.created_at.desc()).limit(limit).all()
        # convert JSON-string incident_reported_to to list
        for r in rows:
            try:
                if isinstance(r.incident_reported_to, str):
                    r.incident_reported_to = json.loads(r.incident_reported_to)
            except Exception:
                r.incident_reported_to = None
        return rows
    finally:
        db.close()


@router.get("/{incident_id}", response_model=IncidentOut)
def get_incident(incident_id: int):
    db = SessionLocal()
    try:
        row = db.query(IncidentReport).filter(IncidentReport.id == incident_id).first()
        if not row:
            raise HTTPException(status_code=404, detail="Incident not found")
        try:
            if isinstance(row.incident_reported_to, str):
                row.incident_reported_to = json.loads(row.incident_reported_to)
        except Exception:
            row.incident_reported_to = None
        return row
    finally:
        db.close()
