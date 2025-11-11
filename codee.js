# daily_sheet.py in this file some advanced futue are missiing,,.. that i laread did in main.py file .. so read the main.py file and rewrit daily_sheet.py carefully... ok 


including all future that i alread did in main.py file read belwo main.py file and write correct code for dail_sheet.py ok 
http://127.0.0.1:8000/daily_sheet/records
{
  "count": 102,
  "items": [
    {
      "emp_id": "308497.0",
      "first_name": "ALEJANDRO",
      "email": "alejandro.alganaraz@westernunion.com",
      "to_location": "Buenos Aires, Ciudad de Buenos Aires",
      "end_date": "2025-10-28T18:30:00+00:00",
      "active_now": 0,
      "matched_employee_id": null,
      "match_reason": null,
      "last_name": "ALGANARAS",
      "id": 1,
      "from_location": "Buenos Aires, Ciudad de Buenos Aires",
      "begin_date": null,
      "leg_type": "HOTEL",
      "is_vip": 0,
      "matched_employee_name": null,
      "uploaded_at": "2025-11-11 11:49:06"
    },


# daily_sheet.py
from fastapi import APIRouter, UploadFile, File, HTTPException
from fastapi.responses import JSONResponse
from sqlalchemy import Column, Integer, String, Float, create_engine
from sqlalchemy.orm import sessionmaker
from io import BytesIO, StringIO
import pandas as pd
import numpy as np
from datetime import datetime
import re, zoneinfo, logging

# We'll import the DB Base, engine, SessionLocal, Employee model and VIP_LEVELS from monthly_sheet
# This keeps ONE sqlite database and does NOT duplicate engine/session definitions.
from monthly_sheet import Base, engine, SessionLocal, Employee, VIP_LEVELS

logger = logging.getLogger("uvicorn.error")

router = APIRouter(prefix="/daily_sheet", tags=["daily_sheet"])

# Ensure new table will be created on same Base/engine
# Define a DailyTravel model attached to the same Base used in monthly_sheet
class DailyTravel(Base):
    __tablename__ = "daily_travel"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    emp_id = Column(String, index=True, nullable=True)
    first_name = Column(String, nullable=True)
    last_name = Column(String, nullable=True)
    email = Column(String, nullable=True)
    from_location = Column(String, nullable=True)
    to_location = Column(String, nullable=True)
    begin_date = Column(String, nullable=True)
    end_date = Column(String, nullable=True)
    leg_type = Column(String, nullable=True)
    active_now = Column(Integer, default=0)  # 0/1
    is_vip = Column(Integer, default=0)      # 0/1
    matched_employee_id = Column(String, nullable=True)
    matched_employee_name = Column(String, nullable=True)
    match_reason = Column(String, nullable=True)  # 'emp_id', 'email', 'name' or None
    uploaded_at = Column(String, nullable=True)

# Create table if not exist
Base.metadata.create_all(bind=engine)


# ---------------------------
# utils: normalize headers and parse dates (small helper)
# ---------------------------
SERVER_TZ = zoneinfo.ZoneInfo("Asia/Kolkata")

def normalize_and_parse(dt_val):
    if pd.isna(dt_val) or dt_val is None:
        return None
    s = str(dt_val).strip()
    s = re.sub(r"(\d{1,2})\.(\d{1,2})(?!\d)", r"\1:\2", s)
    try:
        dt = pd.to_datetime(s, errors="coerce")
        if pd.isna(dt):
            return None
        # Ensure timezone-aware using server tz, then convert to UTC string
        if dt.tzinfo is None:
            dt = dt.tz_localize(SERVER_TZ)
        dt_utc = dt.astimezone(zoneinfo.ZoneInfo("UTC"))
        return dt_utc
    except Exception:
        return None


def normalize_cols(cols):
    return [str(c).strip().upper().replace(".", "_").replace(" ", "_") for c in cols]


# Basic flexible mapping of common daily upload columns to canonical names
COMMON_HEADERS = [
    "EMP ID", "EMPID", "EMP_ID", "EMP_ID#", "EMPID#",
    "FIRST NAME", "FIRSTNAME", "FIRST",
    "LAST NAME", "LASTNAME", "LAST",
    "EMAIL", "PNR", "LEG TYPE", "LEG_TYPE",
    "BEGIN DATE", "BEGIN_DT", "START DATE", "START_DT",
    "END DATE", "END_DT", "FROM LOCATION", "FROM_LOCATION",
    "FROM_COUNTRY", "TO LOCATION", "TO_LOCATION", "TO_COUNTRY"
]


def find_header(col_map, variants):
    """Return the actual header in df (col_map keys) that matches any string in variants (case-insensitive)."""
    for v in variants:
        vlow = v.strip().lower()
        for k in col_map.keys():
            if vlow == k.lower() or vlow in k.lower() or k.lower() in vlow:
                return col_map[k]
    return None


# ---------------------------
# Endpoint: upload_daily
# ---------------------------
@router.post("/upload_daily")
async def upload_daily(file: UploadFile = File(...)):
    """
    Upload daily travel Excel/CSV. The endpoint will:
    - parse the file (auto header normalization)
    - create DailyTravel records in DB (replacing previous daily_travel table contents)
    - attempt to match each travel row to monthly employees (emp_id -> email -> first+last)
    - mark is_vip = 1 if matched monthly record is VIP (or has management_level in VIP_LEVELS)
    """
    if not file.filename.lower().endswith((".xlsx", ".xls", ".csv")):
        raise HTTPException(status_code=400, detail="Please upload a valid Excel or CSV file.")

    content = await file.read()

    # read file into dataframe (try CSV first if extension states so)
    try:
        if file.filename.lower().endswith(".csv"):
            text = content.decode(errors="ignore")
            df = pd.read_csv(StringIO(text))
        else:
            df = pd.read_excel(BytesIO(content))
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error reading file: {e}")

    # normalize columns
    orig_cols = list(df.columns)
    df.columns = normalize_cols(df.columns)
    col_map = {c: c for c in df.columns}

    # map canonical names
    emp_col = find_header(col_map, ["EMP ID", "EMPID", "EMP_ID"])
    first_col = find_header(col_map, ["FIRST NAME", "FIRSTNAME", "FIRST"])
    last_col = find_header(col_map, ["LAST NAME", "LASTNAME", "LAST"])
    email_col = find_header(col_map, ["EMAIL"])
    begin_col = find_header(col_map, ["BEGIN DATE","BEGIN_DT","START DATE"])
    end_col = find_header(col_map, ["END DATE","END_DT","END"])
    from_col = find_header(col_map, ["FROM LOCATION","FROM_LOCATION"])
    to_col = find_header(col_map, ["TO LOCATION","TO_LOCATION"])
    leg_col = find_header(col_map, ["LEG TYPE","LEG_TYPE"])
    pnr_col = find_header(col_map, ["PNR"])

    # compute active flag using parsed dates
    def compute_active(row):
        b = normalize_and_parse(row.get(begin_col)) if begin_col else None
        e = normalize_and_parse(row.get(end_col)) if end_col else None
        if b is None or e is None:
            return False
        now_utc = datetime.now(tz=SERVER_TZ).astimezone(zoneinfo.ZoneInfo("UTC"))
        return b <= now_utc <= e

    # Build employee maps from monthly_sheet database
    db = SessionLocal()
    try:
        employees = db.query(Employee).all()
    except Exception as e:
        logger.exception("Failed to load monthly employees from DB: %s", e)
        employees = []
    # maps
    by_empid = {}
    by_email = {}
    by_name = {}
    for emp in employees:
        eid = (emp.employee_id or "").strip()
        em = (emp.employee_email or "").strip().lower()
        fn = (emp.first_name or "").strip().lower()
        ln = (emp.last_name or "").strip().lower()
        if eid:
            by_empid[eid] = emp
        if em:
            by_email[em] = emp
        if fn or ln:
            k = f"{fn} {ln}".strip()
            if k:
                if k not in by_name:
                    by_name[k] = emp

    # Delete existing daily_travel rows (we will replace, preserving the monthly table)
    try:
        db.query(DailyTravel).delete()
        db.commit()
    except Exception as e:
        db.rollback()
        logger.exception("Failed to clear previous daily_travel: %s", e)

    rows_processed = 0
    rows_added = 0
    upload_time = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

    for idx, row in df.iterrows():
        rows_processed += 1
        emp_id = str(row.get(emp_col, "") or "").strip()
        first_name = (str(row.get(first_col, "") or "").strip()) if first_col else ""
        last_name = (str(row.get(last_col, "") or "").strip()) if last_col else ""
        email = (str(row.get(email_col, "") or "").strip().lower()) if email_col else ""
        from_location = row.get(from_col) if from_col else None
        to_location = row.get(to_col) if to_col else None
        begin_dt_obj = normalize_and_parse(row.get(begin_col)) if begin_col else None
        end_dt_obj = normalize_and_parse(row.get(end_col)) if end_col else None
        begin_date_iso = begin_dt_obj.isoformat() if begin_dt_obj is not None else None
        end_date_iso = end_dt_obj.isoformat() if end_dt_obj is not None else None
        leg_type = row.get(leg_col) if leg_col else None

        active_flag = 1 if (begin_dt_obj and end_dt_obj and begin_dt_obj <= datetime.now(tz=SERVER_TZ).astimezone(zoneinfo.ZoneInfo("UTC")) <= end_dt_obj) else 0

        # Matching priority: emp_id -> email -> first+last
        matched_emp = None
        match_reason = None
        if emp_id and emp_id in by_empid:
            matched_emp = by_empid[emp_id]
            match_reason = "emp_id"
        elif email and email in by_email:
            matched_emp = by_email[email]
            match_reason = "email"
        else:
            name_key = f"{(first_name or '').strip().lower()} {(last_name or '').strip().lower()}".strip()
            if name_key and name_key in by_name:
                matched_emp = by_name[name_key]
                match_reason = "name"

        is_vip = 0
        matched_employee_id = None
        matched_employee_name = None
        if matched_emp:
            # monthly_sheet has function to compute VIP by management_level; here we infer similarly
            matched_employee_id = getattr(matched_emp, "employee_id", None)
            matched_employee_name = getattr(matched_emp, "full_name", None) or f"{getattr(matched_emp,'first_name', '')} {getattr(matched_emp,'last_name','')}".strip()
            # prefer explicit is_vip if monthly_sheet provided it as attribute; otherwise infer by management_level membership
            try:
                # monthly Employee class doesn't have an 'is_vip' column but our /employees endpoint adds it on the fly
                mgmt_level = getattr(matched_emp, "management_level", None)
                if mgmt_level and mgmt_level in VIP_LEVELS:
                    is_vip = 1
            except Exception:
                is_vip = 0

        # Save record to DB
        dt = DailyTravel(
            emp_id = emp_id or None,
            first_name = first_name or None,
            last_name = last_name or None,
            email = email or None,
            from_location = from_location,
            to_location = to_location,
            begin_date = begin_date_iso,
            end_date = end_date_iso,
            leg_type = str(leg_type) if leg_type is not None else None,
            active_now = active_flag,
            is_vip = is_vip,
            matched_employee_id = matched_employee_id,
            matched_employee_name = matched_employee_name,
            match_reason = match_reason,
            uploaded_at = upload_time
        )

        try:
            db.add(dt)
            rows_added += 1
        except Exception as e:
            logger.exception("Failed to add DailyTravel row: %s", e)
            db.rollback()

    try:
        db.commit()
    except Exception as e:
        db.rollback()
        logger.exception("Commit failed for daily_travel: %s", e)
    finally:
        db.close()

    # return a user-friendly summary (for frontend)
    return JSONResponse(content={
        "message": f"{rows_added} daily travel records saved successfully.",
        "rows_received": rows_processed,
        "rows_saved": rows_added,
        "uploaded_at": upload_time
    })


# ---------------------------
# GET records, single record, clear daily
# ---------------------------
@router.get("/records")
def get_daily_records(limit: int = 1000, offset: int = 0, only_active: int = None):
    """
    Get stored daily travel records.
    - optional: limit, offset
    - optional: only_active=1 to filter only active_now rows
    """
    db = SessionLocal()
    q = db.query(DailyTravel)
    if only_active is not None:
        q = q.filter(DailyTravel.active_now == (1 if only_active else 0))
    total = q.count()
    rows = q.order_by(DailyTravel.id.asc()).offset(offset).limit(limit).all()
    db.close()
    items = [{k: v for k, v in r.__dict__.items() if k != "_sa_instance_state"} for r in rows]
    return JSONResponse(content={"count": total, "items": items})


@router.get("/records/{record_id}")
def get_daily_record(record_id: int):
    db = SessionLocal()
    r = db.query(DailyTravel).filter(DailyTravel.id == record_id).first()
    db.close()
    if not r:
        raise HTTPException(status_code=404, detail="Daily record not found")
    return JSONResponse(content={k: v for k, v in r.__dict__.items() if k != "_sa_instance_state"})


@router.delete("/clear")
def clear_daily_data():
    db = SessionLocal()
    try:
        n = db.query(DailyTravel).count()
        db.query(DailyTravel).delete()
        db.commit()
        return JSONResponse(content={"message": f"Cleared {n} daily travel records."})
    except Exception as e:
        db.rollback()
        logger.exception("Failed clearing daily_travel: %s", e)
        raise HTTPException(status_code=500, detail="Failed to clear daily data")
    finally:
        db.close()


# ---------------------------
# Regions summary (VIP-aware) for daily_travel
# ---------------------------
# We'll copy a compact COUNTRY->REGION map (keeps parity with your main.py)
COUNTRY_TO_REGION = {
    'india': 'APAC', 'pune': 'APAC', 'mumbai': 'APAC', 'hyderabad': 'APAC', 'chennai': 'APAC',
    'bangalore': 'APAC', 'delhi': 'APAC', 'gurgaon': 'APAC', 'manila': 'APAC',
    'china': 'APAC', 'japan': 'APAC', 'australia': 'APAC', 'singapore': 'APAC',
    'united states': 'NAMER', 'usa': 'NAMER', 'us': 'NAMER', 'denver': 'NAMER',
    'canada': 'NAMER', 'toronto': 'NAMER',
    'brazil': 'LACA', 'argentina': 'LACA', 'mexico': 'LACA',
    'united kingdom': 'EMEA', 'uk': 'EMEA', 'london': 'EMEA', 'france': 'EMEA', 'germany': 'EMEA',
}

def guess_region(country, location):
    text_parts = []
    if country: text_parts.append(str(country).lower())
    if location: text_parts.append(str(location).lower())
    combined = " ".join(text_parts)
    for k, v in COUNTRY_TO_REGION.items():
        if k in combined:
            return v
    return "GLOBAL"

def normalize_city(location):
    if not location: return None
    return str(location).split(",")[0].strip().title()

@router.get("/regions")
def get_daily_regions():
    db = SessionLocal()
    rows = db.query(DailyTravel).all()
    db.close()
    if not rows:
        raise HTTPException(status_code=404, detail="No daily travel data")
    regions = {}
    for r in rows:
        country = r.to_location or r.from_location
        region = guess_region(r.to_location or r.from_location, r.to_location or r.from_location)
        city = normalize_city(r.to_location or r.from_location) or "Unknown"
        if region not in regions:
            regions[region] = {"region_code": region, "total_count": 0, "active_count": 0, "vip_count": 0, "cities": {}}
        regions[region]["total_count"] += 1
        if r.active_now:
            regions[region]["active_count"] += 1
        if r.is_vip:
            regions[region]["vip_count"] += 1
        if city not in regions[region]["cities"]:
            regions[region]["cities"][city] = {"city_name": city, "total_count": 0, "active_count": 0, "vip_count": 0, "sample_items": []}
        regions[region]["cities"][city]["total_count"] += 1
        if r.active_now:
            regions[region]["cities"][city]["active_count"] += 1
        if r.is_vip:
            regions[region]["cities"][city]["vip_count"] += 1
        if len(regions[region]["cities"][city]["sample_items"]) < 10:
            regions[region]["cities"][city]["sample_items"].append({
                "first_name": r.first_name, "last_name": r.last_name, "email": r.email,
                "active_now": bool(r.active_now), "is_vip": bool(r.is_vip), "matched_employee_name": r.matched_employee_name
            })

    # sort cities by count desc
    for reg in regions.values():
        reg["cities"] = dict(sorted(reg["cities"].items(), key=lambda kv: -kv[1]["total_count"]))

    return JSONResponse(content={"regions": regions})

________________________
C:\Users\W0024618\Desktop\swipeData\Travel-Backend\main.py


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


from fastapi.middleware.cors import CORSMiddleware
from monthly_sheet import router as monthly_router


# add this in main.py (near the monthly_router inclusion)
from daily_sheet import router as daily_router
# app.include_router(daily_router)

app = FastAPI(title="Employee Travel Dashboard — Parser")
app.include_router(monthly_router)
app.include_router(daily_router)
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
