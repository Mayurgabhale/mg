now we getting small issue...
 now we chekc VIP.. in monlthy sheet..  
    in montly sheet we defin the VIP ok,,

in daily, sheet i dont want to store vip in dabase... 
    but we want to show this in api 
i mean this
{
  "summary": {
    "rows_received": 123,
    "rows_removed_as_footer_or_empty": 0,
    "rows_with_parse_errors": 123,
    "active_now_count": 84,
    "data_upload_time": "2025-11-12T12:43:55.027693"
  },
  "items": [
    {
      "index": 0,
      "agency_id": "728775",
      "agency_name": "Western Union - Argentina",
      "first_name": "SANTIAGO",
      "last_name": "CASTRO",
      "emp_id": "311107",
      "email": "santiago.castrofeijoo@wu.com",
      "pnr": "QDYNNA",
      "leg_type": "HOTEL",
      "begin_dt": "2025-11-12T00:00:00+05:30",
      "end_dt": "2025-11-14T00:00:00+05:30",
      "from_location": "Buenos Aires, Ciudad de Buenos Aires",
      "from_country": "Argentina",
      "to_location": "Buenos Aires, Ciudad de Buenos Aires",
      "to_country": "Argentina",
      "active_now": true
    },

    ok.. 
# daily_sheet.py
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
    is_vip = Column(Integer, default=0)
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

    # Build employee lookup maps from monthly_sheet DB
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
        

        # matching priority
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
            matched_employee_id = getattr(matched_emp, "employee_id", None)
            matched_employee_name = getattr(matched_emp, "full_name", None) or f"{getattr(matched_emp,'first_name','')} {getattr(matched_emp,'last_name','')}".strip()
            mgmt_level = getattr(matched_emp, "management_level", None)
            if mgmt_level and mgmt_level in VIP_LEVELS:
                is_vip = 1

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

    # Build previous_data cache (items & summary) like main.py
    items = []
    for i, row in df.iterrows():
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
        })

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

    previous_data["summary"] = summary
    previous_data["items"] = items
    previous_data["last_updated"] = datetime.now().isoformat()

    # return JSONResponse(content={
    #     'summary': summary,
    #     'items': items,
    #     'message': f'{rows_added} daily travel records saved and cached'
    # })

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
    """
    # ✅ Try using in-memory cache first
    if previous_data.get("items"):
        items = previous_data["items"]
    else:
        # ✅ Fallback: load from DB
        db = SessionLocal()
        rows = db.query(DailyTravel).order_by(DailyTravel.id.asc()).all()
        db.close()
        if not rows:
            raise HTTPException(status_code=404, detail="No travel data found in memory or database.")
        items = [
            {k: v for k, v in r.__dict__.items() if k != "_sa_instance_state"}
            for r in rows
        ]
        previous_data["items"] = items

    # ✅ Clean up emp_id (remove .0)
    for it in items:
        if "emp_id" in it and it["emp_id"] is not None:
            try:
                it["emp_id"] = str(int(float(it["emp_id"])))  # e.g. "308497.0" → "308497"
            except Exception:
                it["emp_id"] = str(it["emp_id"]).strip()

    # ✅ Safely access old summary if available
    old_summary = previous_data.get("summary") or {}

    # ✅ Add summary info
    summary = {
        "rows_received": len(items),
        "rows_removed_as_footer_or_empty": old_summary.get("rows_removed_as_footer_or_empty", 0),
        "rows_with_parse_errors": sum(1 for r in items if not r.get("begin_date") or not r.get("end_date")),
        "active_now_count": sum(1 for r in items if r.get("active_now")),
        "data_upload_time": old_summary.get("data_upload_time")
            or previous_data.get("last_updated")
            or datetime.now().isoformat(),
    }

    # ✅ Update cache metadata
    previous_data["summary"] = summary
    previous_data["last_updated"] = datetime.now().isoformat()

    return JSONResponse(content={
        "summary": summary,
        "items": items,
        "last_updated": previous_data["last_updated"],
        "message": "Loaded daily sheet data from memory or database"
    })


# ---------------------------
# add_traveler endpoint (append to previous_data)
# ---------------------------
from pydantic import BaseModel
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

@router.post("/add_traveler")
def add_traveler(traveler: TravelerInput):
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

    if previous_data["items"] is None:
        previous_data["items"] = []
    previous_data["items"].append(new_item)

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


# ---------------------------
# DB-backed records endpoints (parity with earlier daily_sheet)
# ---------------------------
@router.get("/records")
def get_daily_records(limit: int = 1000, offset: int = 0, only_active: Optional[int] = None):
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
        # also clear cache
        previous_data["items"] = None
        previous_data["summary"] = None
        previous_data["regions_summary"] = None
        previous_data["last_updated"] = None
        return JSONResponse(content={"message": f"Cleared {n} daily travel records."})
    except Exception as e:
        db.rollback()
        logger.exception("Failed clearing daily_travel: %s", e)
        raise HTTPException(status_code=500, detail="Failed to clear daily data")
    finally:
        db.close()



# ⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️
# ---------- START: REGION HELPERS & ENDPOINTS ----------

# ----------------------------------------------------------
# 🌍 Modern ML / Geo-based Region Resolver (no hardcoding)
# ----------------------------------------------------------

# In-memory cache for geocoding (24h TTL)
GEOCODE_CACHE = TTLCache(maxsize=10000, ttl=60 * 60 * 24)

gc = geonamescache.GeonamesCache()
CITY_DB = {c['name'].lower(): c for c in gc.get_cities().values()}  # city name -> record
COUNTRY_DB = {c.alpha_2: c for c in pycountry.countries}

# Geocoder setup
GEOCODER = Nominatim(user_agent="region-mapper/1.0", timeout=10)

# Continent → Region mapping
CONTINENT_TO_REGION = {
    'AS': 'APAC',
    'OC': 'APAC',
    'EU': 'EMEA',
    'AF': 'EMEA',
    'NA': 'NAMER',
    'SA': 'LACA',
}

# Country overrides (manual region adjustments)
COUNTRY_CODE_OVERRIDES = {
    'AE': 'EMEA', 'SA': 'EMEA', 'EG': 'EMEA', 'IL': 'EMEA',
}

DEFAULT_REGION = 'UNKNOWN'


def country_code_to_region(alpha2: str) -> str:
    """Map ISO alpha2 code → region label."""
    if not alpha2:
        return DEFAULT_REGION
    alpha2 = alpha2.upper()
    if alpha2 in COUNTRY_CODE_OVERRIDES:
        return COUNTRY_CODE_OVERRIDES[alpha2]
    try:
        cont = pycountry_convert.country_alpha2_to_continent_code(alpha2)
        return CONTINENT_TO_REGION.get(cont, DEFAULT_REGION)
    except Exception:
        return DEFAULT_REGION


def normalize_text(s: Optional[str]) -> Optional[str]:
    return s.strip().lower() if s else None


def try_country_field(country_field: Optional[str]) -> Optional[str]:
    """If country name/ISO provided → get region quickly."""
    if not country_field:
        return None
    s = normalize_text(country_field)
    try:
        c = pycountry.countries.get(alpha_2=s.upper())
        if not c:
            c = pycountry.countries.get(name=country_field)
        if not c:
            choices = [c.name for c in pycountry.countries]
            best = process.extractOne(country_field, choices, scorer=fuzz.token_sort_ratio)
            if best and best[1] > 80:
                c = pycountry.countries.get(name=best[0])
        if c:
            return country_code_to_region(c.alpha_2)
    except Exception:
        pass
    return None


def try_local_city_db(city: str) -> Optional[str]:
    """Offline city lookup via geonamescache."""
    if not city:
        return None
    key = city.strip().lower()
    rec = CITY_DB.get(key)
    if rec and rec.get('countrycode'):
        return country_code_to_region(rec['countrycode'])

    # fuzzy match for close names
    best = process.extractOne(key, CITY_DB.keys(), scorer=fuzz.ratio)
    if best and best[1] > 92:
        rec = CITY_DB.get(best[0])
        if rec and rec.get('countrycode'):
            return country_code_to_region(rec['countrycode'])
    return None


@cached(GEOCODE_CACHE)
def geocode_city_to_country_code(city: str) -> Optional[str]:
    """Online geocoding (Nominatim) city → ISO country code."""
    if not city:
        return None
    try:
        loc = GEOCODER.geocode(city, addressdetails=True, exactly_one=True)
        if not loc:
            return None
        address = loc.raw.get('address', {})
        cc = address.get('country_code')
        if cc:
            return cc.upper()
    except Exception:
        time.sleep(1)
    return None


def resolve_region(country: Optional[str], location: Optional[str]) -> str:
    """
    Smart region resolver:
      1. Try country name
      2. Try offline city DB
      3. Try online geocoding
      4. Else → UNKNOWN
    """
    # 1️⃣ Country field
    region = try_country_field(country)
    if region:
        return region

    # 2️⃣ Try local city DB
    city_only = (location or "").split(",")[0].strip()
    region = try_local_city_db(city_only)
    if region:
        return region

    # 3️⃣ Online geocode
    cc = geocode_city_to_country_code(city_only or location or "")
    if cc:
        return country_code_to_region(cc)

    # 4️⃣ Fallback
    return DEFAULT_REGION


# ----------------------------------------------------------
# 🧩 Existing logic (but now uses resolve_region)
# ----------------------------------------------------------

def normalize_city(location: Optional[str]) -> Optional[str]:
    """Simplify city name for grouping."""
    if not location:
        return None
    s = str(location).strip().split(',')[0]
    return s.title()


def build_regions_summary(items: list) -> dict:
    """Group all items by region → city, with totals."""
    regions = {}
    for it in items:
        country = (it.get('to_country') or it.get('from_country') or "").strip()
        location = (it.get('to_location') or it.get('from_location') or "").strip()
        region = resolve_region(country, location)
        city = normalize_city(location) or "Unknown"

        if region not in regions:
            regions[region] = {
                "region_code": region,
                "total_count": 0,
                "active_count": 0,
                "vip_count": 0,
                "active_vip_count": 0,
                "cities": {}
            }

        # --- Region-level totals ---
        reg = regions[region]
        reg["total_count"] += 1
        if it.get("active_now"):
            reg["active_count"] += 1
        if it.get("is_vip"):
            reg["vip_count"] += 1
        if it.get("active_now") and it.get("is_vip"):
            reg["active_vip_count"] += 1

        # --- City-level totals ---
        if city not in reg["cities"]:
            reg["cities"][city] = {
                "city_name": city,
                "total_count": 0,
                "active_count": 0,
                "vip_count": 0,
                "active_vip_count": 0,
                "sample_items": []
            }

        cty = reg["cities"][city]
        cty["total_count"] += 1
        if it.get("active_now"):
            cty["active_count"] += 1
        if it.get("is_vip"):
            cty["vip_count"] += 1
        if it.get("active_now") and it.get("is_vip"):
            cty["active_vip_count"] += 1

        if len(cty["sample_items"]) < 10:
            cty["sample_items"].append({
                "first_name": it.get("first_name"),
                "last_name": it.get("last_name"),
                "email": it.get("email"),
                "pnr": it.get("pnr"),
                "active_now": it.get("active_now"),
                "is_vip": bool(it.get("is_vip")),
                "begin_dt": it.get("begin_dt"),
                "end_dt": it.get("end_dt"),
            })

    # sort cities by count
    for reg_data in regions.values():
        reg_data["cities"] = dict(sorted(reg_data["cities"].items(),
                                         key=lambda kv: -kv[1]["total_count"]))
    return regions


# ----------------------------------------------------------
# 🚀 FastAPI endpoints (unchanged)
# ----------------------------------------------------------

@router.get("/regions")
def get_regions():
    """
    Return regional travel summary grouped by region (APAC, EMEA, NAMER, LACA, UNKNOWN).
    Uses memory cache if available, else loads from DB.
    """
    # 1️⃣ From memory
    if previous_data.get("items"):
        items = previous_data["items"]
    else:
        # 2️⃣ Fallback to DB
        db = SessionLocal()
        rows = db.query(DailyTravel).all()
        db.close()
        if not rows:
            raise HTTPException(status_code=404, detail="No travel data available in memory or database.")
        items = [{k: v for k, v in r.__dict__.items() if k != "_sa_instance_state"} for r in rows]
        previous_data["items"] = items

    # 3️⃣ Use new resolver-based region builder
    regions = build_regions_summary(items)

    # 4️⃣ Cache + timestamp
    previous_data["regions_summary"] = regions
    previous_data["last_updated"] = datetime.now().isoformat()

    # 5️⃣ Response
    return JSONResponse(content={
        "regions": regions,
        "last_updated": previous_data["last_updated"],
        "message": "Loaded region summary from memory or database"
    })


@router.get("/regions/{region_code}")
async def get_region(region_code: str):
    """Get details for a specific region."""
    regions = previous_data.get("regions_summary")
    if not regions:
        raise HTTPException(status_code=404, detail="Region summary not yet generated.")
    region_code = region_code.upper()
    region_data = regions.get(region_code)
    if not region_data:
        raise HTTPException(status_code=404, detail=f"Region {region_code} not found.")
    return JSONResponse(content=region_data)

