this is incident report data ok that i want ot store in data base ok 

this beloww is the filed ok, we crete travel dashbord in this i want ot add this form, wher employee fil this form taht data stor in data base ok 
and afte we diplsy this infromation in our travel dasbhoard ok 
in this also 	Yes then If Yes then
7.Incident reported to: 
•	Supervisor
and if no then this 
If No then 
7.Location of Incident or Accident (Specify Office / Branch)
that i mension in below ok 
so werhie code for this 
Incident Reporting Form
When you submit this form, it will not automatically collect your details like name and email address unless you provide it yourself.
*Required
1.Type of Incident / Accident 
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
------------------------------
If Yes then
7.Incident reported to: 
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

----------------------------------------
Read below code only refrence purpose ok 
C:\Users\W0024618\Desktop\swipeData\Travel-Backend\database.db
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

C:\Users\W0024618\Desktop\swipeData\Travel-Backend\daily_sheet.py

# Travel-Backend/daily_sheet.py (UPDATED)
from fastapi import APIRouter, File, UploadFile, HTTPException
from fastapi.responses import JSONResponse
from sqlalchemy import Column, Integer, String
from io import BytesIO, StringIO
import pandas as pd
import numpy as np
from datetime import datetime
from dateutil import parser as date_parser
import re, zoneinfo, logging
from typing import Optional
import math
from datetime import datetime, timezone
from typing import Optional
from functools import lru_cache
import time
from datetime import datetime
from fastapi import HTTPException
from fastapi.responses import JSONRespons
import pycountry
import pycountry_convert
import geonamescache
from geopy.geocoders import Nominatim
from rapidfuzz import process, fuzz
from cachetools import TTLCache, cached
from datetime import datetime, timezone
from dateutil import parser as date_parser

from fastapi.encoders import jsonable_encoder
# Import DB Base/engine/SessionLocal and Employee model + VIP_LEVELS from monthly_sheet
# Make sure monthly_sheet exports: Base, engine, SessionLocal, Employee, VIP_LEVELS
from monthly_sheet import Base, engine, SessionLocal, Employee, VIP_LEVELS
logger = logging.getLogger("uvicorn.error")
router = APIRouter(prefix="/daily_sheet", tags=["daily_sheet"])
# Use same server timezone as main.py
SERVER_TZ = zoneinfo.ZoneInfo("Asia/Kolkata")


class DailyTravel(Base):
    __tablename__ = "daily_travel"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    emp_id = Column(String, index=True, nullable=True)
    first_name = Column(String, nullable=True)
    last_name = Column(String, nullable=True)
    email = Column(String, nullable=True)
    from_location = Column(String, nullable=True)
    from_country = Column(String, nullable=True)   # ✅ add this
    to_location = Column(String, nullable=True)
    to_country = Column(String, nullable=True)     # ✅ add this
    begin_date = Column(String, nullable=True)
    end_date = Column(String, nullable=True)
    leg_type = Column(String, nullable=True)
    active_now = Column(Integer, default=0)
    is_vip = Column(Integer, default=0)  # kept but we will NOT set it on write
    matched_employee_id = Column(String, nullable=True)
    matched_employee_name = Column(String, nullable=True)
    match_reason = Column(String, nullable=True)
    uploaded_at = Column(String, nullable=True)


# Ensure tables exist
Base.metadata.create_all(bind=engine)








def _to_utc_dt_for_active(val):
    """
    Parse a datetime-like value and return a timezone-aware UTC datetime.
    - If val is None or unparseable -> returns None
    - If parsed dt has no tzinfo -> assume SERVER_TZ (Asia/Kolkata) to match parsing used on upload
    """
    if not val:
        return None
    try:
        # dateutil.parser.parse handles ISO strings and many formats
        dt = date_parser.parse(str(val))
    except Exception:
        return None

    if dt.tzinfo is None:
        # assume server local timezone (keeps behavior consistent with normalize_and_parse)
        try:
            dt = dt.replace(tzinfo=SERVER_TZ)
        except Exception:
            # fallback: treat naive as UTC
            dt = dt.replace(tzinfo=timezone.utc)

    # convert to UTC-aware datetime
    try:
        return dt.astimezone(timezone.utc)
    except Exception:
        # last-resort: return as-is (may be naive) or None
        return None

# ---------------------------
# Helpers: parsing, reading, header detection
# ---------------------------
def normalize_and_parse(dt_val):
    """Parse a variety of date strings into timezone-aware local datetimes (no UTC shift)."""
    if pd.isna(dt_val) or dt_val is None:
        return None
    s = str(dt_val).strip()
    s = re.sub(r"(\d{1,2})\.(\d{1,2})(?!\d)", r"\1:\2", s)
    try:
        dt = date_parser.parse(s, dayfirst=False)
        if dt.tzinfo is None:
            dt = dt.replace(tzinfo=SERVER_TZ)  # stay in server tz (Asia/Kolkata)
        # ❌ don’t convert to UTC
        return dt
    except Exception:
        return None


def read_any_format(content: bytes, filename: str) -> pd.DataFrame:
    """
    Robust reader: detects header row (CSV/Excel), normalizes to canonical columns.
    Returns DataFrame with columns:
      "AGENCY ID","AGENCY NAME","LAST NAME","FIRST NAME","TRAVELER",
      "EMP ID","EMAIL","PNR","LEG TYPE","BEGIN DATE","FROM LOCATION",
      "FROM COUNTRY","END DATE","TO LOCATION","TO COUNTRY"
    """
    EXPECTED_COLS = [
        "AGENCY ID","AGENCY NAME","LAST NAME","FIRST NAME","TRAVELER",
        "EMP ID","EMAIL","PNR","LEG TYPE","BEGIN DATE","FROM LOCATION",
        "FROM COUNTRY","END DATE","TO LOCATION","TO COUNTRY"
    ]

    # CSV path
    if filename.lower().endswith(".csv"):
        text = content.decode(errors="ignore").splitlines()
        header_row = None
        for i, line in enumerate(text[:50]):
            if any(h.lower() in line.lower() for h in EXPECTED_COLS):
                header_row = i
                break
        if header_row is None:
            raise ValueError("Header row not found in CSV file")
        df = pd.read_csv(StringIO("\n".join(text)), skiprows=header_row)
    else:
        # Excel path: scan first 50 rows to find header row
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

    # normalize headers
    df.columns = [str(c).strip().upper() for c in df.columns]

    # ensure expected columns exist
    for col in EXPECTED_COLS:
        if col not in df.columns:
            df[col] = None

    # keep canonical order
    df = df[EXPECTED_COLS]

    # drop blank rows and known footers
    def looks_like_footer(row):
        s = " ".join(str(v).lower() for v in row if pd.notna(v))
        return bool(re.search(r"copyright|all rights reserved|gardaworld|utc", s))

    df = df.dropna(how="all")
    df = df[~df.apply(looks_like_footer, axis=1)]

    return df


# ---------------------------
# In-memory cache (parity with main.py)
# ---------------------------
previous_data = {
    "summary": None,
    "items": None,
    "last_updated": None,
    "regions_summary": None
}


def clean_nans(obj):
    """
    Recursively convert problematic values to JSON-safe Python types:
      - np.nan, np.inf, -np.inf -> None
      - numpy / pandas scalar types -> native Python scalars
      - pandas.Timestamp -> ISO string
    Works for dicts, lists, scalars.
    """
    # dict
    if isinstance(obj, dict):
        return {str(k): clean_nans(v) for k, v in obj.items()}

    # list/tuple
    if isinstance(obj, (list, tuple)):
        return [clean_nans(v) for v in obj]

    # pandas Timestamp / datetime-like
    if isinstance(obj, pd.Timestamp):
        if pd.isna(obj):
            return None
        return obj.isoformat()

    # numpy scalar (int64, float64, bool_)
    if isinstance(obj, (np.integer, np.int64, np.int32)):
        return int(obj)
    if isinstance(obj, (np.floating, np.float64, np.float32)):
        # check NaN / inf
        f = float(obj)
        if math.isnan(f) or math.isinf(f):
            return None
        return f
    if isinstance(obj, (np.bool_,)):
        return bool(obj)

    # float (python float) -> check nan/inf
    if isinstance(obj, float):
        if math.isnan(obj) or math.isinf(obj):
            return None
        return obj

    # None or already-JSON-safe primitive (str, int, bool)
    if obj is None or isinstance(obj, (str, int, bool)):
        return obj

    # For other unsupported numeric-like objects, try to coerce via float/int
    try:
        if hasattr(obj, "item"):   # numpy/pandas scalars
            val = obj.item()
            return clean_nans(val)
    except Exception:
        pass

    # Fallback: convert to string (safe) — but prefer None for unknown floats
    try:
        return str(obj)
    except Exception:
        return None


# ---------------------------
# VIP helper (DO NOT persist VIP into DB — compute dynamically)
# ---------------------------
def check_vip_status(session, emp_id: Optional[str], first_name: Optional[str], last_name: Optional[str], email: Optional[str]) -> bool:
    """
    Match Employee in monthly_sheet with priority:
      1) employee_id
      2) email
      3) full name (first + last)
    Return True if management_level in VIP_LEVELS.
    session: SQLAlchemy session (required) — caller should open/close session.
    """
    if session is None:
        return False

    emp = None
    if emp_id:
        emp = session.query(Employee).filter(Employee.employee_id == str(emp_id).strip()).first()
    if not emp and email:
        emp = session.query(Employee).filter(Employee.employee_email == (email or "").strip().lower()).first()
    if not emp and first_name and last_name:
        full_name = f"{(first_name or '').strip()} {(last_name or '').strip()}"
        # use ilike for case-insensitive match; some full_name fields may differ in spacing/casing
        emp = session.query(Employee).filter(Employee.full_name.ilike(full_name)).first()
    if not emp:
        return False
    return emp.management_level in VIP_LEVELS if emp.management_level else False


# ---------------------------
# Upload endpoint (stores DB and previous_data)
# ---------------------------
@router.post("/upload")
async def upload(file: UploadFile = File(...)):
    """
    Upload daily travel Excel/CSV.
    - Detects header row robustly
    - Parses/normalizes dates
    - Saves records into `daily_travel` (replacing previous daily_travel rows)
    - Attempts to match each row to monthly employees (emp_id -> email -> name)
    - Updates previous_data cache
    """
    if not file.filename.lower().endswith((".xlsx", ".xls", ".csv")):
        raise HTTPException(status_code=400, detail="Please upload a valid Excel or CSV file.")

    content = await file.read()

    try:
        df = read_any_format(content, file.filename)
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error reading file: {e}")

    # normalize columns to uppercase (already done in read_any_format)
    # Parse dates
    df['begin_date'] = df['BEGIN DATE'].apply(normalize_and_parse)
    df['end_date'] = df['END DATE'].apply(normalize_and_parse)

    now_local = datetime.now(tz=SERVER_TZ)
    now_utc = now_local.astimezone(zoneinfo.ZoneInfo('UTC'))

    def is_active_row(row):
        b, e = row['begin_date'], row['end_date']
        return bool(b and e and b <= now_utc <= e)

    df['active_now'] = df.apply(is_active_row, axis=1)

    # Remove blank/footer rows (again) and keep rows with some identifying info
    original_count = len(df)
    def is_footer_row(row):
        combined = " ".join(str(v) for v in row.values if v is not None).lower()
        patterns = [r"copyright", r"all rights reserved", r"gardaworld", r"utc", r"\b\d{1,2}-[a-z]{3}-\d{4}\b"]
        return any(re.search(p, combined) for p in patterns)

    df = df.dropna(how="all")
    df = df[~df.apply(is_footer_row, axis=1)]
    df = df[
        df["FIRST NAME"].notna() |
        df["LAST NAME"].notna() |
        df["EMAIL"].notna()
    ]
    removed_rows = original_count - len(df)

    # Build employee lookup maps from monthly_sheet DB (used to speed matching during insert)
    db = SessionLocal()
    try:
        employees = db.query(Employee).all()
    except Exception as e:
        logger.exception("Failed to load monthly employees: %s", e)
        employees = []
    by_empid = {}
    by_email = {}
    by_name = {}
    for emp in employees:
        eid = (getattr(emp, "employee_id", "") or "").strip()
        em = (getattr(emp, "employee_email", "") or "").strip().lower()
        fn = (getattr(emp, "first_name", "") or "").strip().lower()
        ln = (getattr(emp, "last_name", "") or "").strip().lower()
        if eid:
            by_empid[eid] = emp
        if em:
            by_email[em] = emp
        if fn or ln:
            k = f"{fn} {ln}".strip()
            if k:
                if k not in by_name:
                    by_name[k] = emp

    # Replace existing daily_travel rows
    try:
        db.query(DailyTravel).delete()
        db.commit()
    except Exception as e:
        db.rollback()
        logger.exception("Failed to clear previous daily_travel: %s", e)

    rows_added = 0
    upload_time = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

    # Insert rows into DB — note: we DO NOT persist VIP into DB (leave is_vip default)
    for idx, row in df.iterrows():
        emp_id = str(row.get('EMP ID') or "").strip()
        first_name = (str(row.get('FIRST NAME') or "").strip()) if 'FIRST NAME' in df.columns else ""
        last_name = (str(row.get('LAST NAME') or "").strip()) if 'LAST NAME' in df.columns else ""
        email = (str(row.get('EMAIL') or "").strip().lower()) if 'EMAIL' in df.columns else None
        from_location = row.get('FROM LOCATION') if 'FROM LOCATION' in df.columns else None
        to_location = row.get('TO LOCATION') if 'TO LOCATION' in df.columns else None
        from_country = row.get('FROM COUNTRY') if 'FROM COUNTRY' in df.columns else None  # ✅ new
        to_country = row.get('TO COUNTRY') if 'TO COUNTRY' in df.columns else None        # ✅ new
        begin_date_obj = row.get('begin_date') if 'begin_date' in df.columns else None
        end_date_obj = row.get('end_date') if 'end_date' in df.columns else None
        begin_date_iso = begin_date_obj.isoformat() if begin_date_obj is not None else None
        end_date_iso = end_date_obj.isoformat() if end_date_obj is not None else None
        leg_type = row.get('LEG TYPE') if 'LEG TYPE' in df.columns else None
        active_flag = 1 if bool(row.get('active_now')) else 0

        # matching priority (local maps for speed)
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

        matched_employee_id = None
        matched_employee_name = None
        # we compute is_vip for API only — do not persist
        if matched_emp:
            matched_employee_id = getattr(matched_emp, "employee_id", None)
            matched_employee_name = getattr(matched_emp, "full_name", None) or f"{getattr(matched_emp,'first_name','')} {getattr(matched_emp,'last_name','')}".strip()

        dt = DailyTravel(
            emp_id = emp_id or None,
            first_name = first_name or None,
            last_name = last_name or None,
            email = email or None,
            from_country=from_country,
            to_country=to_country,
            from_location = from_location,
            to_location = to_location,
            begin_date = begin_date_iso,
            end_date = end_date_iso,
            leg_type = str(leg_type) if leg_type is not None else None,
            active_now = active_flag,
            # is_vip intentionally NOT set here (we don't persist VIP)
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
