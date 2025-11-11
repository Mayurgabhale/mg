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
from typing import Optional, Dict, Any

# Import DB Base/engine/SessionLocal and Employee model + VIP_LEVELS from monthly_sheet
# Make sure monthly_sheet exports: Base, engine, SessionLocal, Employee, VIP_LEVELS
from monthly_sheet import Base, engine, SessionLocal, Employee, VIP_LEVELS

logger = logging.getLogger("uvicorn.error")

router = APIRouter(prefix="/daily_sheet", tags=["daily_sheet"])

# Use same server timezone as main.py
SERVER_TZ = zoneinfo.ZoneInfo("Asia/Kolkata")

# ---------------------------
# Model
# ---------------------------
class DailyTravel(Base):
    __tablename__ = "daily_travel"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    emp_id = Column(String, index=True, nullable=True)
    first_name = Column(String, nullable=True)
    last_name = Column(String, nullable=True)
    email = Column(String, nullable=True)
    from_location = Column(String, nullable=True)
    to_location = Column(String, nullable=True)
    begin_date = Column(String, nullable=True)  # ISO string in UTC
    end_date = Column(String, nullable=True)    # ISO string in UTC
    leg_type = Column(String, nullable=True)
    active_now = Column(Integer, default=0)  # 0/1
    is_vip = Column(Integer, default=0)      # 0/1
    matched_employee_id = Column(String, nullable=True)
    matched_employee_name = Column(String, nullable=True)
    match_reason = Column(String, nullable=True)  # 'emp_id', 'email', 'name' or None
    uploaded_at = Column(String, nullable=True)
    # Optional: store from_country/to_country to simplify region grouping if desired
    # but we keep original schema simple — regions derived at runtime

# Ensure tables exist
Base.metadata.create_all(bind=engine)


# ---------------------------
# Helpers: parsing, reading, header detection
# ---------------------------
def normalize_and_parse(dt_val):
    """Parse a variety of date strings into timezone-aware UTC datetimes (pandas-friendly)."""
    if pd.isna(dt_val) or dt_val is None:
        return None
    s = str(dt_val).strip()
    # common CSV time format like 08.30 -> 08:30
    s = re.sub(r"(\d{1,2})\.(\d{1,2})(?!\d)", r"\1:\2", s)
    try:
        dt = date_parser.parse(s, dayfirst=False)
        if dt.tzinfo is None:
            # attach server tz
            dt = dt.replace(tzinfo=SERVER_TZ)
        # convert to UTC
        return dt.astimezone(zoneinfo.ZoneInfo("UTC"))
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


# ---------------------------
# Region mapping helper (simple, common-country mapping)
# ---------------------------
# This is intentionally conservative — just common countries. Unknown -> GLOBAL
REGION_MAP = {
    # NAMER
    "united states": "NAMER", "usa": "NAMER", "us": "NAMER", "canada": "NAMER", "mexico": "LACA",
    # LACA (Latin America & Caribbean)
    "brazil": "LACA", "argentina": "LACA", "chile": "LACA", "colombia": "LACA", "peru": "LACA", "venezuela": "LACA", "mexico": "LACA",
    # EMEA
    "united kingdom": "EMEA", "uk": "EMEA", "germany": "EMEA", "france": "EMEA", "spain": "EMEA", "italy": "EMEA", "netherlands": "EMEA",
    "switzerland": "EMEA", "sweden": "EMEA", "norway": "EMEA", "poland": "EMEA", "belgium": "EMEA",
    # APAC
    "india": "APAC", "china": "APAC", "japan": "APAC", "australia": "APAC", "new zealand": "APAC", "singapore": "APAC",
    "hong kong": "APAC", "south korea": "APAC", "korea": "APAC",
    # Add a few more common ones
    "united arab emirates": "EMEA", "uae": "EMEA", "saudi arabia": "EMEA", "south africa": "EMEA",
}

def get_region_for_country(country: Optional[str]) -> str:
    if not country:
        return "GLOBAL"
    c = str(country).strip().lower()
    # if value contains comma, take last token (e.g., "City, Country")
    if "," in c:
        # try to extract country portion
        parts = [p.strip() for p in c.split(",")]
        if parts:
            c = parts[-1]
    # remove common words
    c = c.replace("province", "").replace("state", "").strip()
    return REGION_MAP.get(c, "GLOBAL")


def build_regions_summary_from_items(items: list) -> Dict[str, dict]:
    """
    Build a regions summary structure:
    { "GLOBAL": {"total_count": int, "active_count": int, "countries": {country:count}}, ... }
    """
    regions: Dict[str, Dict[str, Any]] = {}
    for it in items:
        country = (it.get("from_country") or it.get("to_country") or "") or ""
        region = get_region_for_country(country)
        if region not in regions:
            regions[region] = {"total_count": 0, "active_count": 0, "countries": {}}
        regions[region]["total_count"] += 1
        if it.get("active_now"):
            regions[region]["active_count"] += 1
        ckey = (country or "Unknown").strip()
        regions[region]["countries"].setdefault(ckey, 0)
        regions[region]["countries"][ckey] += 1

    # Convert countries map to list and keep most useful fields
    summary = {}
    for rc, v in regions.items():
        countries_list = [{"country": k, "count": cnt} for k, cnt in v["countries"].items()]
        countries_list = sorted(countries_list, key=lambda x: x["count"], reverse=True)
        summary[rc] = {
            "total_count": v["total_count"],
            "active_count": v["active_count"],
            "top_countries": countries_list[:10],
        }
    return summary


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
    - Updates previous_data cache (including region summaries and vip counts)
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

    # Iterate rows and add to DB
    for idx, row in df.iterrows():
        emp_id = str(row.get('EMP ID') or "").strip()
        first_name = (str(row.get('FIRST NAME') or "").strip()) if 'FIRST NAME' in df.columns else ""
        last_name = (str(row.get('LAST NAME') or "").strip()) if 'LAST NAME' in df.columns else ""
        email = (str(row.get('EMAIL') or "").strip().lower()) if 'EMAIL' in df.columns else None
        from_location = row.get('FROM LOCATION') if 'FROM LOCATION' in df.columns else None
        to_location = row.get('TO LOCATION') if 'TO LOCATION' in df.columns else None
        from_country = row.get('FROM COUNTRY') if 'FROM COUNTRY' in df.columns else None
        to_country = row.get('TO COUNTRY') if 'TO COUNTRY' in df.columns else None
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

    # Build previous_data cache (items & summary & regions) like main.py
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

    # summary
    vip_count = 0
    for it in items:
        # attempt to find matching employee using DB lookups we already created
        email = (it.get('email') or "").strip().lower()
        empid = (it.get('emp_id') or "")
        mp = None
        if empid and empid in by_empid:
            mp = by_empid[empid]
        elif email and email in by_email:
            mp = by_email[email]
        if mp:
            if getattr(mp, "management_level", None) in VIP_LEVELS:
                vip_count += 1

    summary = {
        'rows_received': len(df),
        'rows_removed_as_footer_or_empty': removed_rows,
        'rows_with_parse_errors': int(df['BEGIN_DT'].isna().sum() + df['END_DT'].isna().sum()),
        'active_now_count': int(df['active_now'].sum()),
        'vip_count': int(vip_count)
    }

    regions_summary = build_regions_summary_from_items(items)

    previous_data["summary"] = summary
    previous_data["items"] = items
    previous_data["last_updated"] = datetime.now().isoformat()
    previous_data["regions_summary"] = regions_summary

    return JSONResponse(content={
        'summary': summary,
        'items': items,
        'regions': regions_summary,
        'message': f'{rows_added} daily travel records saved and cached'
    })


# ---------------------------
# data endpoint (return cached previous_data)
# ---------------------------
@router.get("/data")
def get_previous_data():
    if previous_data["items"] is not None:
        return JSONResponse(content={
            "summary": previous_data["summary"],
            "items": previous_data["items"],
            "regions": previous_data.get("regions_summary"),
            "last_updated": previous_data.get("last_updated"),
            "message": "Loaded saved data from memory"
        })
    else:
        raise HTTPException(status_code=404, detail="No previously uploaded data found.")


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

    # Attempt to match against monthly employees to determine VIP (same logic as upload)
    db = SessionLocal()
    try:
        employees = db.query(Employee).all()
    except Exception:
        employees = []
    finally:
        db.close()

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

    matched_emp = None
    match_reason = None
    if traveler.emp_id and traveler.emp_id in by_empid:
        matched_emp = by_empid[traveler.emp_id]
        match_reason = "emp_id"
    elif traveler.email and traveler.email.strip().lower() in by_email:
        matched_emp = by_email[traveler.email.strip().lower()]
        match_reason = "email"
    else:
        name_key = f"{(traveler.first_name or '').strip().lower()} {(traveler.last_name or '').strip().lower()}".str