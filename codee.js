in this alos update auto  "active_now": ok
http://127.0.0.1:8000/daily_sheet/data

{
  "summary": {
    "rows_received": 123,
    "rows_removed_as_footer_or_empty": 0,
    "rows_with_parse_errors": 0,
    "active_now_count": 84,
    "data_upload_time": "2025-11-12T16:37:04.682202"
  },
  "items": [
    {
      "first_name": "SANTIAGO",
      "last_name": "CASTRO",
      "emp_id": "311107",
      "from_location": "Buenos Aires, Ciudad de Buenos Aires",
      "to_country": "Argentina",
      "end_date": "2025-11-14T00:00:00+05:30",
      "active_now": 1,
      "matched_employee_id": null,
      "match_reason": null,
      "email": "santiago.castrofeijoo@wu.com",
      "id": 1,
      "from_country": "Argentina",
      "to_location": "Buenos Aires, Ciudad de Buenos Aires",
      "begin_date": "2025-11-12T00:00:00+05:30",
      "leg_type": "HOTEL",
      "is_vip": true,
      "matched_employee_name": null,
      "uploaded_at": "2025-11-12 13:32:33"
    },
    {
      "first_name": "ESTEBAN",
      "last_name": "CRESPO",
      "emp_id": "237072",
      "from_location": "Buenos Aires, Ciudad de Buenos Aires",
      "to_country": "Argentina",
      "end_date": "2025-11-14T00:00:00+05:30",
      "active_now": 1,
      "matched_employee_id": null,
      "match_reason": null,
      "email": "esteban.crespo@westernunion.com",
      "id": 2,
      "from_country": "Argentina",
      "to_location": "Buenos Aires, Ciudad de Buenos Aires",
      "begin_date": "2025-11-12T00:00:00+05:30",
      "leg_type": "HOTEL",
      "is_vip": true,
      "matched_employee_name": null,
      "uploaded_at": "2025-11-12 13:32:33"
    },
    {
      "first_name": "DENISE",
      "last_name": "GOLDSTEIN",
      "emp_id": "316505",
      "from_location": "Asunción",
      "to_country": "Paraguay",
        

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
from fastapi.responses import JSONResponse

import pycountry
import pycountry_convert
import geonamescache
from geopy.geocoders import Nominatim
from rapidfuzz import process, fuzz
from cachetools import TTLCache, cached

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
    df['BEGIN_DT'] = df['BEGIN DATE'].apply(normalize_and_parse)
    df['END_DT'] = df['END DATE'].apply(normalize_and_parse)

    now_local = datetime.now(tz=SERVER_TZ)
    now_utc = now_local.astimezone(zoneinfo.ZoneInfo('UTC'))

    def is_active_row(row):
        b, e = row['BEGIN_DT'], row['END_DT']
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
        begin_dt_obj = row.get('BEGIN_DT') if 'BEGIN_DT' in df.columns else None
        end_dt_obj = row.get('END_DT') if 'END_DT' in df.columns else None
        begin_date_iso = begin_dt_obj.isoformat() if begin_dt_obj is not None else None
        end_date_iso = end_dt_obj.isoformat() if end_dt_obj is not None else None
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

    # Build previous_data cache (items & summary) like main.py
    # We'll compute dynamic is_vip for each item using a new session (read-only)
    items = []
    session_for_vip = SessionLocal()
    try:
        for i, row in df.iterrows():
            first_name = (str(row.get('FIRST NAME') or "").strip()) if 'FIRST NAME' in df.columns else ""
            last_name = (str(row.get('LAST NAME') or "").strip()) if 'LAST NAME' in df.columns else ""
            email = (str(row.get('EMAIL') or "").strip().lower()) if 'EMAIL' in df.columns else None
            emp_id = str(row.get('EMP ID') or "").strip()

            is_vip_flag = check_vip_status(session_for_vip, emp_id, first_name, last_name, email)

            items.append({
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
                'active_now': bool(row.get('active_now')),
                'is_vip': bool(is_vip_flag),
            })
    finally:
        session_for_vip.close()

    summary = {
        'rows_received': len(df),
        'rows_removed_as_footer_or_empty': removed_rows,
        'rows_with_parse_errors': int(df['BEGIN_DT'].isna().sum() + df['END_DT'].isna().sum()),
        'active_now_count': int(df['active_now'].sum())
    }

    # sanitize before storing / returning
    items = clean_nans(items)
    summary = clean_nans(summary)

    previous_data["summary"] = summary
    previous_data["items"] = items
    previous_data["last_updated"] = datetime.now().isoformat()

    return JSONResponse(content=jsonable_encoder({
        'summary': summary,
        'items': items,
        'message': f'{rows_added} daily travel records saved and cached'
    }))


# ---------------------------
# data endpoint (return cached previous_data)
# ---------------------------

@router.get("/data")
def get_previous_data():
    """
    Return cached or DB-loaded daily travel data with clean emp_id and upload timestamp.
    VIP is computed dynamically for response (not persisted).
    """
    # Try using in-memory cache first
    if previous_data.get("items"):
        items = previous_data["items"]
    else:
        # Fallback: load from DB
        db = SessionLocal()
        rows = db.query(DailyTravel).order_by(DailyTravel.id.asc()).all()
        db.close()
        if not rows:
            raise HTTPException(status_code=404, detail="No travel data found in memory or database.")
        items = [
            {k: v for k, v in r.__dict__.items() if k != "_sa_instance_state"}
            for r in rows
        ]
        # store items in cache
        previous_data["items"] = items

    # Clean up emp_id (remove .0)
    for it in items:
        if "emp_id" in it and it["emp_id"] is not None:
            try:
                it["emp_id"] = str(int(float(it["emp_id"])))  # e.g. "308497.0" → "308497"
            except Exception:
                it["emp_id"] = str(it["emp_id"]).strip()

    # compute dynamic VIP flag for each item (reuse one session)
    session_v = SessionLocal()
    try:
        for it in items:
            is_v = check_vip_status(session_v, it.get("emp_id"), it.get("first_name"), it.get("last_name"), it.get("email"))
            it["is_vip"] = bool(is_v)
    finally:
        session_v.close()

    # Safely access old summary if available
    old_summary = previous_data.get("summary") or {}

    # Add summary info
    summary = {
        "rows_received": len(items),
        "rows_removed_as_footer_or_empty": old_summary.get("rows_removed_as_footer_or_empty", 0),
        "rows_with_parse_errors": sum(1 for r in items if not r.get("begin_date") or not r.get("end_date")),
        "active_now_count": sum(1 for r in items if r.get("active_now")),
        "data_upload_time": old_summary.get("data_upload_time")
            or previous_data.get("last_updated")
            or datetime.now().isoformat(),
    }

    # Update cache metadata
    previous_data["summary"] = summary
    previous_data["last_updated"] = datetime.now().isoformat()

    # Return response (this was missing and caused `null`)
    return JSONResponse(content=jsonable_encoder({
        "summary": summary,
        "items": items,
        "last_updated": previous_data["last_updated"],
        "message": "Loaded daily sheet data from memory or database"
    }))


