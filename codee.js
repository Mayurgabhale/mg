# main.py
from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import pandas as pd
import numpy as np
from io import BytesIO
from dateutil import parser
from datetime import datetime
import re
import zoneinfo

app = FastAPI(title="Employee Travel Dashboard — Parser")

# Allow local dev frontends (adjust in production)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

SERVER_TZ = zoneinfo.ZoneInfo("Asia/Kolkata")

def normalize_and_parse(dt_val):
    """Normalize common formats and parse to UTC-aware datetime."""
    if pd.isna(dt_val):
        return None
    s = str(dt_val).strip()
    # convert 23.00 to 23:00
    s = re.sub(r"(\d{1,2})\.(\d{1,2})(?!\d)", r"\1:\2", s)
    try:
        dt = parser.parse(s, dayfirst=False)
        if dt.tzinfo is None:
            dt = dt.replace(tzinfo=SERVER_TZ)
        return dt.astimezone(zoneinfo.ZoneInfo("UTC"))
    except Exception:
        return None

@app.post("/upload")
async def upload_excel(file: UploadFile = File(...)):
    # Accept xlsx/xls/csv
    filename = (file.filename or "").lower()
    if not filename.endswith((".xlsx", ".xls", ".csv")):
        raise HTTPException(status_code=400, detail="Unsupported file type")

    content = await file.read()
    try:
        if filename.endswith(".csv"):
            # attempt to guess encoding and delimiter using pandas defaults
            df = pd.read_csv(BytesIO(content))
        else:
            df = pd.read_excel(BytesIO(content))
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Failed to read spreadsheet: {e}")

    # Expected canonical columns (we'll try to map case-insensitively)
    expected = [
        "AGENCY ID","AGENCY NAME","LAST NAME","FIRST NAME","TRAVELER",
        "EMP ID","EMAIL","PNR","LEG TYPE","BEGIN DATE","FROM LOCATION","FROM COUNTRY",
        "END DATE","TO LOCATION","TO COUNTRY"
    ]

    # Map incoming columns case-insensitively
    cols_map = {c.lower().strip(): c for c in df.columns}

    def find_col(ci):
        # exact match
        key = ci.lower()
        if key in cols_map:
            return cols_map[key]
        # fallback: find any column name that contains the canonical token
        for k, v in cols_map.items():
            if key in k:
                return v
        return None

    build = {}
    for col in expected:
        found = find_col(col)
        if found is not None and found in df.columns:
            build[col] = df[found]
        else:
            # fill column with None values if not present
            build[col] = pd.Series([None] * len(df))

    clean_df = pd.DataFrame(build)

    # Convert NaN-ish values to Python None early to avoid JSON serialization issues
    clean_df = clean_df.replace([np.nan, np.inf, -np.inf], None)

    # Parse dates to UTC-aware datetimes (or None)
    clean_df["BEGIN_DT"] = clean_df["BEGIN DATE"].apply(normalize_and_parse)
    clean_df["END_DT"] = clean_df["END DATE"].apply(normalize_and_parse)

    # now() in server timezone -> to UTC for comparison
    now_local = datetime.now(tz=SERVER_TZ)
    now_utc = now_local.astimezone(zoneinfo.ZoneInfo("UTC"))

    def is_active(row):
        b = row.get("BEGIN_DT")
        e = row.get("END_DT")
        if not b or not e:
            return False
        return (b <= now_utc) and (e >= now_utc)

    clean_df["active_now"] = clean_df.apply(is_active, axis=1)

    # Replace any leftover pandas NA/NaT with None
    clean_df = clean_df.replace({pd.NaT: None})

    # Build items with safe JSON serializable types
    def row_to_obj(i, row):
        return {
            "index": int(i),
            "agency_id": row.get("AGENCY ID"),
            "agency_name": row.get("AGENCY NAME"),
            "first_name": row.get("FIRST NAME"),
            "last_name": row.get("LAST NAME"),
            "emp_id": row.get("EMP ID"),
            "email": row.get("EMAIL"),
            "pnr": row.get("PNR"),
            "leg_type": row.get("LEG TYPE"),
            "begin_dt": row.get("BEGIN_DT").isoformat() if row.get("BEGIN_DT") else None,
            "end_dt": row.get("END_DT").isoformat() if row.get("END_DT") else None,
            "from_location": row.get("FROM LOCATION"),
            "from_country": row.get("FROM COUNTRY"),
            "to_location": row.get("TO LOCATION"),
            "to_country": row.get("TO COUNTRY"),
            "active_now": bool(row.get("active_now"))
        }

    items = [row_to_obj(i, r) for i, r in clean_df.iterrows()]

    summary = {
        "rows_received": len(clean_df),
        "rows_with_parse_errors": int(clean_df["BEGIN_DT"].isna().sum() + clean_df["END_DT"].isna().sum()),
        "active_now_count": int(clean_df["active_now"].sum()),
    }

    return JSONResponse(content={"summary": summary, "items": items})