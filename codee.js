Regions Overview
know i want to create VIP section ok,  
  the employee is  VIp or no ok 
  Global
100
VIP -30
Total Travelers
5 Active
20
🌏
APAC
13
VIp 77
Travelers
1 Active
vip 7 like ok 
🌍
EMEA
10
Travelers
0 Active
🌎
LACA
17
Travelers
1 Active
🌎
NAMER
60
Travelers
3 Active
http://127.0.0.1:8000/monthly_sheet/employees
{
  "message": "8587 employee records saved successfully.",
  "uploaded_at": "2025-11-11 11:03:31",
  "employees": [
    {
      "job_code": null,
      "management_level": "Vice President",
      "length_of_service_months": 345,
      "first_name": "Michelle",
      "position_id": null,
      "manager_name": null,
      "time_in_position_months": 0,
      "preferred_first_name": "Michelle",
      "business_title": "Vice President, Executive Finance",
      "employee_email": null,
      "uploaded_at": "2025-11-11 11:03:31",
      "middle_name": null,
      "department_name": "CFO Exec/Admin",
      "manager_email": null,
      "id": 1,
      "full_name": "Galligan, Michelle L",
      "company_name": "Western Union, LLC",
      "fte": 1,
      "current_status": null,
      "work_country": "United States of America",
      "tenure": "28 year(s), 9 month(s), 9 day(s)",
      "employee_id": "72072",
      "employee_type": null,
      "location_description": "Denver - WU HQ",
      "years_of_service": 28,
      "last_name": "Galligan",
      "hire_date": null,
      "location_city": "Denver",
      "is_vip": true
    },
    {
      

from datetime import datetime
from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import pandas as pd
import numpy as np
from io import BytesIO, StringIO
from dateutil import parser
from datetime import datetime
import re, zoneinfo
from pydantic import BaseModel
from typing import Optional


# #################

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from monthly_sheet import router as monthly_router


app = FastAPI(title="Employee Travel Dashboard — Parser")
app.include_router(monthly_router)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:3000",
        "http://localhost:3001",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:3001",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

SERVER_TZ = zoneinfo.ZoneInfo("Asia/Kolkata")

# ✅ Global variable to store previous data
previous_data = {
    "summary": None,
    "items": None
}

# ✅ 1. Normalizes and parses date safely
def normalize_and_parse(dt_val):
    if pd.isna(dt_val):
        return None
    s = str(dt_val).strip()
    s = re.sub(r"(\d{1,2})\.(\d{1,2})(?!\d)", r"\1:\2", s)
    try:
        dt = parser.parse(s, dayfirst=False)
        if dt.tzinfo is None:
            dt = dt.replace(tzinfo=SERVER_TZ)
        return dt.astimezone(zoneinfo.ZoneInfo("UTC"))
    except Exception:
        return None
    

    # ✅ 2. Smart universal reader for Excel/CSV (auto-detect header row)
def read_any_format(content: bytes, filename: str) -> pd.DataFrame:
    EXPECTED_COLS = [
        "AGENCY ID","AGENCY NAME","LAST NAME","FIRST NAME","TRAVELER",
        "EMP ID","EMAIL","PNR","LEG TYPE","BEGIN DATE","FROM LOCATION",
        "FROM COUNTRY","END DATE","TO LOCATION","TO COUNTRY"
    ]

    # --- CSV ---
    if filename.lower().endswith(".csv"):
        text = content.decode(errors="ignore").splitlines()
        header_row = None
        for i, line in enumerate(text[:50]):  # check first 50 lines
            if any(h.lower() in line.lower() for h in EXPECTED_COLS):
                header_row = i
                break
        if header_row is None:
            raise ValueError("Header row not found in CSV file")
        df = pd.read_csv(StringIO("\n".join(text)), skiprows=header_row)

    # --- Excel ---
    else:
        bio = BytesIO(content)
        preview = pd.read_excel(bio, header=None, nrows=50)
        header_row = None
        for i in range(len(preview)):
            joined = " ".join(str(v).strip().lower() for v in preview.iloc[i].values if pd.notna(v))
            if any(h.lower() in joined for h in EXPECTED_COLS):
                header_row = i
                break
        if header_row is None:
            raise ValueError("Header row not found in Excel file")
        bio.seek(0)
        df = pd.read_excel(bio, header=header_row)

    # --- Normalize headers ---
    df.columns = [str(c).strip().upper() for c in df.columns]

    # --- Ensure all expected columns exist ---
    for col in EXPECTED_COLS:
        if col not in df.columns:
            df[col] = None

    df = df[EXPECTED_COLS]

    # --- Drop empty & footer rows ---
    def looks_like_footer(row):
        s = " ".join(str(v).lower() for v in row if pd.notna(v))
        return bool(re.search(r"copyright|all rights reserved|gardaworld|utc", s))

    df = df.dropna(how="all")
    df = df[~df.apply(looks_like_footer, axis=1)]

    return df


@app.post("/upload")
async def upload_excel(file: UploadFile = File(None)):
    global previous_data
    previous_data["last_updated"] = datetime.now().isoformat()

    # ✅ Return cached data if no new file uploaded
    if file is None:
        if previous_data["items"] is not None:
            return JSONResponse(content={
                "summary": previous_data["summary"],
                "items": previous_data["items"],
                "message": "Returned previously uploaded data (no new file uploaded)"
            })
        else:
            raise HTTPException(status_code=400, detail="No file uploaded and no previous data found.")

    if not file.filename.lower().endswith((".xlsx", ".xls", ".csv")):
        raise HTTPException(status_code=400, detail="Unsupported file type")

    content = await file.read()
    expected_headers = [
        "AGENCY ID","AGENCY NAME","LAST NAME","FIRST NAME","TRAVELER",
        "EMP ID","EMAIL","PNR","LEG TYPE","BEGIN DATE","FROM LOCATION",
        "FROM COUNTRY","END DATE","TO LOCATION","TO COUNTRY"
    ]

    # 🧠 STEP 1: Find the real header row (files often include titles or junk rows)
    if file.filename.lower().endswith(".csv"):
        text_lines = content.decode(errors="ignore").splitlines()
        header_row_idx = None
        for i, line in enumerate(text_lines[:40]):  # Scan first 40 lines
            if any(h.lower() in line.lower() for h in expected_headers):
                header_row_idx = i
                break

        if header_row_idx is None:
            raise HTTPException(status_code=400, detail="No valid header row found in CSV file")

        df = pd.read_csv(StringIO("\n".join(text_lines)), skiprows=header_row_idx)
    else:
        file_stream = BytesIO(content)
        preview = pd.read_excel(file_stream, header=None, nrows=40)
        header_row_idx = None
        for i in range(len(preview)):
            joined = " ".join(str(v).strip().lower() for v in preview.iloc[i].values if pd.notna(v))
            if any(h.lower() in joined for h in expected_headers):
                header_row_idx = i
                break

        if header_row_idx is None:
            raise HTTPException(status_code=400, detail="No valid header row found in Excel file")

        file_stream.seek(0)
        df = pd.read_excel(file_stream, header=header_row_idx)

    # 🧹 STEP 2: Normalize column names (ignore case, trim spaces)
    df.columns = [str(c).strip().upper() for c in df.columns]

    # 🧩 STEP 3: Map columns flexibly
    cols_map = {c.lower().strip(): c for c in df.columns}
    def get_col(ci):
        for k,v in cols_map.items():
            if k == ci.lower():
                return v
        for k,v in cols_map.items():
            if ci.lower() in k:
                return v
        return None

    col_get = {c: get_col(c) for c in expected_headers}

    clean = {}
    for canon, found in col_get.items():
        clean[canon] = df[found] if found in df.columns else pd.Series([None]*len(df))

    clean_df = pd.DataFrame(clean)

    # 🕒 STEP 4: Parse and normalize dates
    clean_df['BEGIN_DT'] = clean_df['BEGIN DATE'].apply(normalize_and_parse)
    clean_df['END_DT'] = clean_df['END DATE'].apply(normalize_and_parse)

    now_local = datetime.now(tz=SERVER_TZ)
    now_utc = now_local.astimezone(zoneinfo.ZoneInfo('UTC'))

    def is_active(row):
        b, e = row['BEGIN_DT'], row['END_DT']
        return bool(b and e and b <= now_utc <= e)

    clean_df['active_now'] = clean_df.apply(is_active, axis=1)
    clean_df = clean_df.replace([np.nan, np.inf, -np.inf, pd.NaT], None)

    # 🚫 STEP 5: Remove junk/footer rows
    original_row_count = len(clean_df)

    def is_footer_row(row):
        combined = " ".join(str(v) for v in row.values if v is not None).lower()
        patterns = [r"copyright", r"all rights reserved", r"gardaworld", r"utc", r"\b\d{1,2}-[a-z]{3}-\d{4}\b"]
        return any(re.search(p, combined) for p in patterns)

    clean_df = clean_df.dropna(how="all")
    clean_df = clean_df[~clean_df.apply(is_footer_row, axis=1)]
    clean_df = clean_df[
        clean_df["FIRST NAME"].notna() |
        clean_df["LAST NAME"].notna() |
        clean_df["EMAIL"].notna()
    ]

    removed_rows = original_row_count - len(clean_df)

    # 🧾 STEP 6: Convert to output objects
    def row_to_obj(i, row):
        return {
            'index': int(i),
            'agency_id': row.get('AGENCY ID'),
            'agency_name': row.get('AGENCY NAME'),
            'first_name': row.get('FIRST NAME'),
            'last_name': row.get('LAST NAME'),
            'emp_id': row.get('EMP ID'),
            'email': row.get('EMAIL'),
            'pnr': row.get('PNR'),
            'leg_type': row.get('LEG TYPE'),
            'begin_dt': row.get('BEGIN_DT').isoformat() if row.get('BEGIN_DT') else None,
            'end_dt': row.get('END_DT').isoformat() if row.get('END_DT') else None,
            'from_location': row.get('FROM LOCATION'),
            'from_country': row.get('FROM COUNTRY'),
            'to_location': row.get('TO LOCATION'),
            'to_country': row.get('TO COUNTRY'),
            'active_now': bool(row.get('active_now'))
        }

    items = [row_to_obj(i, r) for i, r in clean_df.iterrows()]

    summary = {
        'rows_received': len(clean_df),
        'rows_removed_as_footer_or_empty': removed_rows,
        'rows_with_parse_errors': int(clean_df['BEGIN_DT'].isna().sum() + clean_df['END_DT'].isna().sum()),
        'active_now_count': int(clean_df['active_now'].sum())
    }

    # 💾 STEP 7: Save for reuse
    previous_data["summary"] = summary
    previous_data["items"] = items

    return JSONResponse(content={
        'summary': summary,
        'items': items,
        'message': 'New file uploaded and processed'
    })


@app.get("/data")
async def get_previous_data():
    """Return previously uploaded data if available."""
    if previous_data["items"] is not None:
        # return JSONResponse(content={
        #     "summary": previous_data["summary"],
        #     "items": previous_data["items"],
        #     "message": "Loaded saved data from memory"
        # })
        return JSONResponse(content={
        "summary": previous_data["summary"],
        "items": previous_data["items"],
        "last_updated": previous_data.get("last_updated"),
        "message": "Loaded saved data from memory"
    })
    else:
        raise HTTPException(status_code=404, detail="No previously uploaded data found.")
    

    # ⬇️⬇️⬇️⬇️⬇️⬇️⬇️



class TravelerInput(BaseModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    emp_id: Optional[str] = None
    email: Optional[str] = None
    begin_dt: Optional[str] = None
    end_dt: Optional[str] = None
    from_location: Optional[str] = None
    from_country: Optional[str] = None
    to_location: Optional[str] = None
    to_country: Optional[str] = None
    leg_type: Optional[str] = None
    agency_id: Optional[str] = None
    agency_name: Optional[str] = None
    pnr: Optional[str] = None


@app.post("/add_traveler")
async def add_traveler(traveler: TravelerInput):
    global previous_data
    now_utc = datetime.now(tz=zoneinfo.ZoneInfo('UTC'))
    begin_dt = normalize_and_parse(traveler.begin_dt) if traveler.begin_dt else None
    end_dt = normalize_and_parse(traveler.end_dt) if traveler.end_dt else None

    active_now = bool(begin_dt and end_dt and begin_dt <= now_utc <= end_dt)

    new_item = {
        'index': len(previous_data["items"]) + 1 if previous_data["items"] else 1,
        'agency_id': traveler.agency_id,
        'agency_name': traveler.agency_name,
        'first_name': traveler.first_name,
        'last_name': traveler.last_name,
        'emp_id': traveler.emp_id,
        'email': traveler.email,
        'pnr': traveler.pnr,
        'leg_type': traveler.leg_type,
        'begin_dt': begin_dt.isoformat() if begin_dt else None,
        'end_dt': end_dt.isoformat() if end_dt else None,
        'from_location': traveler.from_location,
        'from_country': traveler.from_country,
        'to_location': traveler.to_location,
        'to_country': traveler.to_country,
        'active_now': active_now
    }

    # Initialize previous_data if empty
    if previous_data["items"] is None:
        previous_data["items"] = []
    previous_data["items"].append(new_item)

    # Update summary
    items = previous_data["items"]
    summary = {
        'rows_received': len(items),
        'rows_removed_as_footer_or_empty': previous_data["summary"].get("rows_removed_as_footer_or_empty", 0) if previous_data["summary"] else 0,
        'rows_with_parse_errors': sum(1 for r in items if not r["begin_dt"] or not r["end_dt"]),
        'active_now_count': sum(1 for r in items if r["active_now"]),
    }

    previous_data["summary"] = summary
    previous_data["last_updated"] = datetime.now().isoformat()

    return JSONResponse(content={
        "message": "Traveler added successfully",
        "summary": summary,
        "items": items
    })



# ⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️
# ---------- START: REGION HELPERS & ENDPOINTS ----------

# 🌍 Region mapping (includes common cities, states, and countries)
COUNTRY_TO_REGION = {
    # ---------------- APAC ----------------
    'india': 'APAC', 'pune': 'APAC', 'mumbai': 'APAC', 'hyderabad': 'APAC', 'chennai': 'APAC',
    'bangalore': 'APAC', 'delhi': 'APAC', 'gurgaon': 'APAC', 'quezon city': 'APAC',
    'taguig city': 'APAC', 'manila': 'APAC', 'philippines': 'APAC',
    'china': 'APAC', 'shanghai': 'APAC', 'beijing': 'APAC', 'hong kong': 'APAC',
    'japan': 'APAC', 'tokyo': 'APAC', 'osaka': 'APAC',
    'australia': 'APAC', 'sydney': 'APAC', 'melbourne': 'APAC', 'hobart': 'APAC',
    'singapore': 'APAC', 'singapore city': 'APAC',
    'malaysia': 'APAC', 'kuala lumpur': 'APAC',
    'indonesia': 'APAC', 'jakarta': 'APAC', 'bali': 'APAC',
    'thailand': 'APAC', 'bangkok': 'APAC',
    'vietnam': 'APAC', 'hanoi': 'APAC',
    'south korea': 'APAC', 'seoul': 'APAC',
    'pakistan': 'APAC', 'karachi': 'APAC',
    'bangladesh': 'APAC', 'dhaka': 'APAC',
    'new zealand': 'APAC', 'auckland': 'APAC',

    # ---------------- NAMER ----------------
    'united states': 'NAMER', 'usa': 'NAMER', 'us': 'NAMER',
    'new york': 'NAMER', 'los angeles': 'NAMER', 'houston': 'NAMER', 'denver': 'NAMER',
    'boston': 'NAMER', 'atlanta': 'NAMER', 'newark': 'NAMER',
    'canada': 'NAMER', 'toronto': 'NAMER', 'vancouver': 'NAMER', 'montreal': 'NAMER', 'regina': 'NAMER',
    'mexico': 'NAMER', 'mexico city': 'NAMER',

    # ---------------- LACA ----------------
    'brazil': 'LACA', 'são paulo': 'LACA', 'rio de janeiro': 'LACA',
    'argentina': 'LACA', 'buenos aires': 'LACA',
    'chile': 'LACA', 'santiago': 'LACA',
    'colombia': 'LACA', 'bogotá': 'LACA',
    'peru': 'LACA', 'lima': 'LACA',
    'venezuela': 'LACA', 'caracas': 'LACA',
    'panama': 'LACA', 'panama city': 'LACA',
    'costa rica': 'LACA', 'san josé': 'LACA', 'san jose': 'LACA',
    'guatemala': 'LACA', 'guatemala city': 'LACA',
    'paraguay': 'LACA', 'asunción': 'LACA', 'asuncion': 'LACA',
    'uruguay': 'LACA', 'montevideo': 'LACA',
    'ecuador': 'LACA', 'quito': 'LACA',

    # ---------------- EMEA ----------------
    'united kingdom': 'EMEA', 'uk': 'EMEA', 'london': 'EMEA', 'manchester': 'EMEA',
    'ireland': 'EMEA', 'dublin': 'EMEA', 'cork': 'EMEA',
    'spain': 'EMEA', 'madrid': 'EMEA', 'valencia': 'EMEA', 'bilbao': 'EMEA',
    'palma de mallorca': 'EMEA', 'ibiza': 'EMEA',
    'italy': 'EMEA', 'rome': 'EMEA', 'milan': 'EMEA', 'trieste': 'EMEA',
    'france': 'EMEA', 'paris': 'EMEA',
    'germany': 'EMEA', 'berlin': 'EMEA', 'munich': 'EMEA', 'frankfurt': 'EMEA',
    'austria': 'EMEA', 'vienna': 'EMEA',
    'lithuania': 'EMEA', 'vilnius': 'EMEA',
    'romania': 'EMEA', 'oradea': 'EMEA', 'bucharest': 'EMEA',
    'greece': 'EMEA', 'athens': 'EMEA',
    'portugal': 'EMEA', 'lisbon': 'EMEA',
    'russia': 'EMEA', 'moscow': 'EMEA',
    'uae': 'EMEA', 'abu dhabi': 'EMEA', 'dubai': 'EMEA',
    'morocco': 'EMEA', 'casablanca': 'EMEA',
    'netherlands': 'EMEA', 'amsterdam': 'EMEA',
    'poland': 'EMEA', 'warsaw': 'EMEA',
    'saudi arabia': 'EMEA', 'riyadh': 'EMEA',
    'south africa': 'EMEA', 'johannesburg': 'EMEA',
    'egypt': 'EMEA', 'cairo': 'EMEA',
}

DEFAULT_REGION = 'UNKNOWN'

def guess_region(country: Optional[str], location: Optional[str]) -> str:
    """Guess a region using either country or location (case-insensitive, fuzzy matching)."""
    text_parts = []
    if country: text_parts.append(str(country).lower())
    if location: text_parts.append(str(location).lower())
    combined = " ".join(text_parts)

    for key, region in COUNTRY_TO_REGION.items():
        if key in combined:
            return region
    return DEFAULT_REGION


def normalize_city(location: Optional[str]) -> Optional[str]:
    """Simplify city name for grouping."""
    if not location:
        return None
    s = str(location).strip().split(',')[0]
    return s.title()


def build_regions_summary(items: list) -> dict:
    """Group all items by region -> city, with counts and sample travelers."""
    regions = {}
    for it in items:
        country = it.get('to_country') or it.get('from_country')
        location = it.get('to_location') or it.get('from_location')
        region = guess_region(country, location)
        city = normalize_city(location) or "Unknown"

        if region not in regions:
            regions[region] = {
                "region_code": region,
                "total_count": 0,
                "active_count": 0,
                "cities": {}
            }

        regions[region]["total_count"] += 1
        if it.get("active_now"):
            regions[region]["active_count"] += 1

        cities = regions[region]["cities"]
        if city not in cities:
            cities[city] = {
                "city_name": city,
                "total_count": 0,
                "active_count": 0,
                "sample_items": []
            }

        cities[city]["total_count"] += 1
        if it.get("active_now"):
            cities[city]["active_count"] += 1

        if len(cities[city]["sample_items"]) < 10:
            cities[city]["sample_items"].append({
                "first_name": it.get("first_name"),
                "last_name": it.get("last_name"),
                "email": it.get("email"),
                "pnr": it.get("pnr"),
                "active_now": it.get("active_now"),
                "begin_dt": it.get("begin_dt"),
                "end_dt": it.get("end_dt")
            })

    # Sort by descending counts
    for reg_data in regions.values():
        reg_data["cities"] = dict(
            sorted(reg_data["cities"].items(), key=lambda kv: -kv[1]["total_count"])
        )

    return regions


@app.get("/regions")
async def get_regions():
    """Return region summary (APAC / EMEA / NAMER / LACA)."""
    if previous_data.get("items") is None:
        raise HTTPException(status_code=404, detail="No travel data available")
    regions = build_regions_summary(previous_data["items"])
    previous_data["regions_summary"] = regions
    return JSONResponse(content={"regions": regions})


@app.get("/regions/{region_code}")
async def get_region(region_code: str):
    """Return details of one specific region."""
    if previous_data.get("items") is None:
        raise HTTPException(status_code=404, detail="No travel data available")
    regions = previous_data.get("regions_summary") or build_regions_summary(previous_data["items"])
    rc = region_code.upper()
    if rc not in regions:
        raise HTTPException(status_code=404, detail=f"Region {rc} not found")
    return JSONResponse(content={"region": regions[rc]})

# ---------- END: REGION HELPERS & ENDPOINTS ----------


we plodat hsi file  in this match the employe Id and name or emplaoyt wiht  http://127.0.0.1:8000/monthly_sheet/employees and chekc this 
    {/* Compact Upload Section */}
                        <div style={styles.compactUploadRow}>
                            <div style={styles.compactFileUpload}>
                                <input
                                    type="file"
                                    accept=".xlsx,.xls,.csv"
                                    onChange={handleFileChange}
                                    style={styles.fileInput}
                                    id="file-upload"
                                />
                                <label htmlFor="file-upload" style={styles.compactFileLabel}>
                                    <FiUpload size={16} />
                                    {file ? file.name : "Choose File"}
                                </label>
                            </div>
                            <div style={styles.compactButtonGroup}>
                                <button
                                    onClick={uploadFile}
                                    disabled={loading}
                                    style={loading ? styles.disabledCompactBtn : styles.compactPrimaryBtn}
                                >
                                    {loading ? (
                                        <div style={styles.smallSpinner}></div>
                                    ) : (
                                        <FiUpload size={14} />
                                    )}
                                </button>
                                <button
                                    onClick={() => {
                                        setItems([]);
                                        setSummary({});
                                        setFile(null);
                                        toast.info("Data cleared successfully.");
                                    }}
                                    style={styles.compactSecondaryBtn}
                                >
                                    <FiTrash2 size={14} />
                                </button>
                                <button onClick={exportCsv} style={styles.compactGhostBtn}>
                                    <FiDownload size={14} />
                                </button>
                            </div>
                        </div>

                                     

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
        status: ""
    });
    const [selectedTraveler, setSelectedTraveler] = useState(null);
    const [activeTab, setActiveTab] = useState("overview");

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
            'APAC': '#dc2626',
            'EMEA': '#2563eb',
            'LACA': '#16a34a',
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
    // 📝📝📝📝📝📝📝

    // ⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️
    const [showAddForm, setShowAddForm] = useState(false);
    const [newTraveler, setNewTraveler] = useState({
        first_name: "",
        last_name: "",
        emp_id: "",
        email: "",
        begin_dt: "",
        end_dt: "",
        from_location: "",
        from_country: "",
        to_location: "",
        to_country: "",
        leg_type: "",
    })

    const addTraveler = async () => {
        try {
            await axios.post("http://localhost:8000/add_traveler", newTraveler);
            toast.success("Traveler added successfully!");
            setShowAddForm(false);
            setNewTraveler({
                first_name: "",
                last_name: "",
                emp_id: "",
                email: "",
                begin_dt: "",
                end_dt: "",
                from_location: "",
                from_country: "",
                to_location: "",
                to_country: "",
                leg_type: "",
            });
            // Refresh data after adding
            const res = await axios.get("http://localhost:8000/data");
            const payload = res.data || {};
            setItems(payload.items || []);
            setSummary(payload.summary || {});
        } catch (err) {
            toast.error("Failed to add traveler. Check backend.");
        }
    };
    // ⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️




    const styles = getStyles(isDarkTheme);

    const [lastUpdated, setLastUpdated] = useState(null);

    // ✅ Load saved data immediately on refresh + auto-refresh every 10 seconds
    useEffect(() => {
        const fetchLatest = async (showToast = false) => {
            try {
                const res = await axios.get("http://localhost:8000/data");
                const payload = res.data || {};
                const rows = payload.items || [];

                // On first load or new data
                if (rows.length > 0) {
                    setItems(rows);
                    setSummary(payload.summary || {});

                    // show toast only when we want (e.g., initial page load)
                    if (showToast) {
                        toast.info(`Loaded ${rows.length} saved records from previous session.`);
                    }

                    // track update timestamp
                    if (payload.last_updated) {
                        setLastUpdated(payload.last_updated);
                    }
                }
            } catch (err) {
                console.warn("No saved data yet — upload a file to start.");
            }
        };

        // 🔹 Load previous data once when page loads
        fetchLatest(true);

        // 🔹 Keep refreshing every 10 seconds
        const interval = setInterval(() => fetchLatest(false), 10000);
        return () => clearInterval(interval);
    }, []);



    const handleFileChange = (e) => setFile(e.target.files[0]);

    const uploadFile = async () => {
        if (!file) return toast.warn("Please select an Excel or CSV file first.");
        setLoading(true);
        try {
            const formData = new FormData();
            formData.append("file", file);
            const res = await axios.post("http://localhost:8000/upload", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            const payload = res.data || {};
            const rows = payload.items || [];
            setItems(rows);
            setSummary(payload.summary || {});
            toast.success(`Uploaded successfully. ${rows.length} records found.`);
        } catch (err) {
            console.error(err);
            toast.error("Upload failed. Please check the backend or file format.");
        } finally {
            setLoading(false);
        }
    };

    const safeItems = Array.isArray(items) ? items : [];

    const analytics = useMemo(() => {
        const active = safeItems.filter(r => r.active_now).length;

        const countries = [...new Set(safeItems.map(r => r.from_country).filter(Boolean))];
        const legTypes = [...new Set(safeItems.map(r => r.leg_type).filter(Boolean))];

        // Travel duration analysis
        const durations = safeItems.map(r => {
            if (!r.begin_dt || !r.end_dt) return 0;
            const start = new Date(r.begin_dt);
            const end = new Date(r.end_dt);
            return Math.max(0, (end - start) / (1000 * 60 * 60 * 24)); // days
        }).filter(d => d > 0);

        const avgDuration = durations.length > 0 ?
            durations.reduce((a, b) => a + b, 0) / durations.length : 0;

        return {
            active,
            totalCountries: countries.length,
            totalTypes: legTypes.length,
            avgDuration: avgDuration.toFixed(1),
            totalTravelers: safeItems.length
        };
    }, [safeItems]);

    // 🆕 Country Statistics with enhanced data
    const countryStats = useMemo(() => {
        const map = {};
        safeItems.forEach(r => {
            const c = r.from_country || "Unknown";
            if (!map[c]) {
                map[c] = { count: 0, active: 0, travelers: new Set() };
            }
            map[c].count++;
            if (r.active_now) map[c].active++;
            map[c].travelers.add(`${r.first_name} ${r.last_name}`);
        });

        return Object.entries(map)
            .map(([country, data]) => ({
                country,
                count: data.count,
                active: data.active,
                travelerCount: data.travelers.size
            }))
            .sort((a, b) => b.count - a.count);
    }, [safeItems]);

    // 🆕 Travel Type Analysis
    const travelTypeStats = useMemo(() => {
        const map = {};
        safeItems.forEach(r => {
            const type = r.leg_type || "Unknown";
            if (!map[type]) {
                map[type] = { count: 0, active: 0, countries: new Set() };
            }
            map[type].count++;
            if (r.active_now) map[type].active++;
            if (r.from_country) map[type].countries.add(r.from_country);
        });

        return Object.entries(map)
            .map(([type, data]) => ({
                type,
                count: data.count,
                active: data.active,
                countryCount: data.countries.size
            }))
            .sort((a, b) => b.count - a.count);
    }, [safeItems]);

    // 🆕 Recent Travelers (last 7 days)
    const recentTravelers = useMemo(() => {
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        return safeItems
            .filter(r => r.begin_dt && new Date(r.begin_dt) >= sevenDaysAgo)
            .sort((a, b) => new Date(b.begin_dt) - new Date(a.begin_dt))
            .slice(0, 10);
    }, [safeItems]);

    const countries = useMemo(
        () => [...new Set(safeItems.map((r) => r.from_country).filter(Boolean))],
        [safeItems]
    );
    const locations = useMemo(() => {
        const allLocations = [
            ...new Set([
                ...safeItems.map((r) => r.from_location).filter(Boolean),
                ...safeItems.map((r) => r.to_location).filter(Boolean)
            ])
        ];
        return allLocations.sort();
    }, [safeItems]);
    const legTypes = useMemo(
        () => [...new Set(safeItems.map((r) => r.leg_type).filter(Boolean))],
        [safeItems]
    );


    // 🆕 Travel Type Icons Mapping
    const getTravelTypeIcon = (type) => {
        if (!type) return FiGlobe;

        const typeLower = type.toLowerCase();
        if (typeLower.includes('car') || typeLower.includes('vehicle')) return FaCar;
        if (typeLower.includes('truck') || typeLower.includes('bus')) return FaTruck;
        if (typeLower.includes('train') || typeLower.includes('rail')) return FaTrain;
        if (typeLower.includes('plane') || typeLower.includes('air') || typeLower.includes('flight')) return FaPlane;
        if (typeLower.includes('ship') || typeLower.includes('boat') || typeLower.includes('sea')) return FaShip;
        if (typeLower.includes('bike') || typeLower.includes('cycle')) return FaBicycle;
        if (typeLower.includes('hotel') || typeLower.includes('HOTEL')) return FaHotel;
        if (typeLower.includes('stop') || typeLower.includes('stop')) return BsPersonWalking;
        return FaLocationArrow;
    };

    // 🆕 Travel Type Color Mapping
    const getTravelTypeColor = (type) => {
        if (!type) return '#6b7280';

        const typeLower = type.toLowerCase();
        if (typeLower.includes('car') || typeLower.includes('vehicle')) return '#dc2626';
        if (typeLower.includes('truck') || typeLower.includes('bus')) return '#ea580c';
        if (typeLower.includes('train') || typeLower.includes('rail')) return '#16a34a';
        if (typeLower.includes('plane') || typeLower.includes('air') || typeLower.includes('flight')) return '#2563eb';
        if (typeLower.includes('ship') || typeLower.includes('boat') || typeLower.includes('sea')) return '#7c3aed';
        if (typeLower.includes('bike') || typeLower.includes('cycle')) return '#ca8a04';
        return '#2465c1ff';
    };

    // 🆕 Today's Travelers
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayTravelers = safeItems.filter((r) => {
        if (!r.begin_dt) return false;
        const start = new Date(r.begin_dt);
        start.setHours(0, 0, 0, 0);
        return start.getTime() === today.getTime();
    });

    const filtered = safeItems
        .filter((r) => {
            const s = filters.search.toLowerCase();
            if (s) {
                const hay = `${r.first_name ?? ""} ${r.last_name ?? ""} ${r.email ?? ""} ${r.from_location ?? ""} ${r.to_location ?? ""}`.toLowerCase();
                if (!hay.includes(s)) return false;
            }
            if (filters.country && r.from_country !== filters.country) return false;
            if (filters.location) {
                const fromLocationMatch = r.from_location && r.from_location.toLowerCase().includes(filters.location.toLowerCase());
                const toLocationMatch = r.to_location && r.to_location.toLowerCase().includes(filters.location.toLowerCase());
                if (!fromLocationMatch && !toLocationMatch) return false;
            }
            if (filters.legType && r.leg_type !== filters.legType) return false;
            if (filters.status === "active" && !r.active_now) return false;
            if (filters.status === "inactive" && r.active_now) return false;
            return true;
        })
        .sort((a, b) => (b.active_now === true) - (a.active_now === true));

    const exportCsv = () => {
        if (!filtered.length) return toast.info("No data to export.");
        const keys = Object.keys(filtered[0]);
        const csv = [keys.join(",")];
        filtered.forEach((r) =>
            csv.push(keys.map((k) => `"${String(r[k] ?? "").replace(/"/g, '""')}"`).join(","))
        );
        const blob = new Blob([csv.join("\n")], { type: "text/csv" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "EmployeeTravelData.csv";
        a.click();
        URL.revokeObjectURL(url);
        toast.success("CSV exported successfully.");
    };


    // /////////////////////
    // Add this useEffect to fetch regions data
    useEffect(() => {
        const fetchRegionsData = async () => {
            if (safeItems.length > 0) {
                try {
                    const response = await axios.get('http://localhost:8000/regions');
                    setRegionsData(response.data.regions || {});
                } catch (error) {
                    console.error('Error fetching regions data:', error);
                }
            }
        };

        fetchRegionsData();
    }, [safeItems]); // Refresh when items change

    // Function to fetch specific region details
    const fetchRegionDetails = async (regionCode) => {
        try {
            const response = await axios.get(`http://localhost:8000/regions/${regionCode}`);
            setRegionDetails(response.data.region);
            setSelectedRegion(regionCode);
        } catch (error) {
            console.error('Error fetching region details:', error);
            toast.error('Failed to load region details');
        }
    };

    // /////////////////////

    // Enhanced Traveler Detail Popup Component
    const TravelerDetailPopup = ({ traveler, onClose }) => {
        if (!traveler) return null;

        const TravelTypeIcon = getTravelTypeIcon(traveler.leg_type);
        const travelTypeColor = getTravelTypeColor(traveler.leg_type);

        // Calculate duration
        const getDuration = () => {
            if (!traveler.begin_dt || !traveler.end_dt) return 'Unknown';
            const start = new Date(traveler.begin_dt);
            const end = new Date(traveler.end_dt);
            const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
            return `${days} day${days !== 1 ? 's' : ''}`;
        };
      

                        {/* 🆕 Region Count Cards */}
                        <div style={styles.regionCardsSection}>
                            <div style={styles.sectionHeader}>
                                <FiGlobe style={styles.sectionIcon} />
                                <h3 style={styles.sectionTitle}>Regions Overview</h3>
                            </div>
                            <div style={styles.regionCardsGrid}>
                                {/* Total Card */}
                                <div style={styles.regionCard}>
                                    <div style={styles.regionCardHeader}>
                                        <div style={{ ...styles.regionIcon, background: '#3b82f6' }}>
                                            <FiGlobe size={16} />
                                        </div>
                                        <span style={styles.regionName}>Global</span>
                                    </div>
                                    <div style={styles.regionCardStats}>
                                        <span style={styles.regionCount}>{safeItems.length}</span>
                                        <span style={styles.regionLabel}>Total Travelers</span>
                                    </div>
                                    <div style={styles.regionCardActive}>
                                        <div style={styles.activeDot}></div>
                                        <span>{safeItems.filter(r => r.active_now).length} Active</span>
                                    </div>
                                </div>

                                {/* Region Cards */}
                                {Object.entries(regionsData)
                                    .sort(([a], [b]) => {
                                        // Sort: GLOBAL first, then alphabetically
                                        if (a === 'GLOBAL') return -1;
                                        if (b === 'GLOBAL') return 1;
                                        return a.localeCompare(b);
                                    })
                                    .map(([regionCode, regionData]) => (
                                        <div
                                            key={regionCode}
                                            style={{
                                                ...styles.regionCard,
                                                ...(filters.region === regionCode && styles.regionCardActive),
                                            }}
                                        >
                                            <div style={styles.regionCardHeader}>
                                                <div
                                                    style={{
                                                        ...styles.regionIcon,
                                                        background: getRegionColor(regionCode),
                                                    }}
                                                >
                                                    {getRegionIcon(regionCode)}
                                                </div>
                                                <span style={styles.regionName}>{regionCode}</span>
                                            </div>
                                            <div style={styles.regionCardStats}>
                                                <span style={styles.regionCount}>{regionData.total_count}</span>
                                                <span style={styles.regionLabel}>Travelers</span>
                                            </div>
                                            <div style={styles.regionCardActive}>
                                                <div
                                                    style={{
                                                        ...styles.activeDot,
                                                        background:
                                                            regionData.active_count > 0 ? '#10b981' : '#6b7280',
                                                    }}
                                                ></div>
                                                <span>{regionData.active_count} Active</span>
                                            </div>
                                        </div>
                                    ))}
                            </div>
                        </div>
