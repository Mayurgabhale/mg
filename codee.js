know i want to create VIP travel in this ok 
we dont any list,,, we have monthly list active sheet,
ok, now this monthly active sheet we store in data base,, python data base ok ,
this monthly sheet upload only in monthly,, 
  this is excle sheet header ok:: 
  Employee ID	Last Name	First Name	Preferred First Name	Middle Name	Full Name	Worker has Photo	Current Status	Employee Type	Hire Date	Original Hire Date	Continuous Service Date	End Employment Date	Job Code	Position ID	Business Title	Job Family Group Code	Job Family Group	Job Family Code	Job Family	FLA Y/N	Department Code	Department Name	Oracle Account	WUIB Cost Center	Company Code	Company Name	Work Country	Location Code	Location Description	Location City	Location State / Province	Region Code	Talent Center Region Code	Business Region	People Manager (Y/N)	Management Level	Manager ID	Manager Name	Manager Country	Reporting Level 6 Name	Reporting Level 5 Name	Reporting Level 4 Name	Reporting Level 3 Name	EVP / Business Leader	Employee's Email	Manager's Email	Work Phone	Standard Hours	Scheduled Hours	FTE	Time Type	Reporting Level from CEO (N-level)	WUPSIL Cost Center	Time in Position	Tenure	Tenure Category	Supervisory Organization	ET Supervisory Org	Years of Service	Length of Service in Months	Time in Position (Days)	Time in Position (Months)

in this we match the Employee ID or name wiht dalily travel sheet and 
and in monthly sheet we chekc there 
Business Title
Director, Treasury
and 
Management Level
Upper Mid Mgmt / Director
do define the empyee is VIP ok  


Management Level

Chief Exec Officer
Executive Vice President
Middle Mgmt / Sr. Professional
Senior Vice President
Supervisory / Professional
Upper Mid Mgmt / Director
Vice President
this all VIP ok 
so how to do this 
  can you do this, and more that you want 

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

app = FastAPI(title="Employee Travel Dashboard — Parser")

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
