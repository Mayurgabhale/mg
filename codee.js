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