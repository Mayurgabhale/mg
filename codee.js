from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
from io import BytesIO
from dateutil import parser
import re
from datetime import datetime
import zoneinfo

app = FastAPI(title="Employee Travel Dashboard — Parser")

# Allow local dev frontend (adjust origin in production)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure server timezone here
SERVER_TZ = zoneinfo.ZoneInfo("Asia/Kolkata")

# Helpful date parser that normalizes "23.00" -> "23:00" etc.
def normalize_and_parse(dt_val):
    if pd.isna(dt_val):
        return None
    s = str(dt_val).strip()
    # convert 23.00 to 23:00
    s = re.sub(r"(\d{1,2})\.(\d{1,2})(?!\d)", r"\1:\2", s)
    try:
        dt = parser.parse(s, dayfirst=False)
        # if naive, attach server timezone then convert to UTC
        if dt.tzinfo is None:
            dt = dt.replace(tzinfo=SERVER_TZ)
        # return ISO UTC
        return dt.astimezone(zoneinfo.ZoneInfo("UTC"))
    except Exception:
        return None


@app.post("/upload")
async def upload_excel(file: UploadFile = File(...)):
    # Accept xlsx/xls
    if not file.filename.lower().endswith((".xlsx", ".xls", ".csv")):
        raise HTTPException(status_code=400, detail="Unsupported file type")

    content = await file.read()
    try:
        if file.filename.lower().endswith(".csv"):
            df = pd.read_csv(BytesIO(content))
        else:
            df = pd.read_excel(BytesIO(content))
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Failed to read spreadsheet: {e}")

    # Expected columns (case-insensitive match)
    expected = [
        "AGENCY ID","AGENCY NAME","LAST NAME","FIRST NAME","TRAVELER",
        "EMP ID","EMAIL","PNR","LEG TYPE","BEGIN DATE","FROM LOCATION","FROM COUNTRY",
        "END DATE","TO LOCATION","TO COUNTRY"
    ]

    # Normalize column names to canonical
    cols_map = {c.lower().strip(): c for c in df.columns}

    # Quick check — attempt to map fields
    def get_col(ci):
        # case-insensitive
        for k,v in cols_map.items():
            if k == ci.lower():
                return v
        # fallback: try contains
        for k,v in cols_map.items():
            if ci.lower() in k:
                return v
        return None

    col_get = {c: get_col(c) for c in expected}

    # Build a cleaned DataFrame with canonical column names (if present)
    clean = {}
    for canon, found in col_get.items():
        clean[canon] = df[found] if found in df.columns else pd.Series([None]*len(df))

    clean_df = pd.DataFrame(clean)

    # Parse dates
    clean_df['BEGIN_DT'] = clean_df['BEGIN DATE'].apply(normalize_and_parse)
    clean_df['END_DT'] = clean_df['END DATE'].apply(normalize_and_parse)

    # Compute active_now (compare against server local time normalized to UTC)
    now_local = datetime.now(tz=SERVER_TZ)
    now_utc = now_local.astimezone(zoneinfo.ZoneInfo('UTC'))

    def is_active(row):
        b = row['BEGIN_DT']
        e = row['END_DT']
        if b is None or e is None:
            return False
        return (b <= now_utc) and (e >= now_utc)

    clean_df['active_now'] = clean_df.apply(is_active, axis=1)

    # Build minimal JSON-serializable response
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
            'begin_dt': row.get('BEGIN_DT').isoformat() if row.get('BEGIN_DT') is not None else None,
            'end_dt': row.get('END_DT').isoformat() if row.get('END_DT') is not None else None,
            'from_location': row.get('FROM LOCATION'),
            'from_country': row.get('FROM COUNTRY'),
            'to_location': row.get('TO LOCATION'),
            'to_country': row.get('TO COUNTRY'),
            'active_now': bool(row.get('active_now'))
        }

    items = [row_to_obj(i, r) for i,r in clean_df.iterrows()]

    summary = {
        'rows_received': len(clean_df),
        'rows_with_parse_errors': int(clean_df['BEGIN_DT'].isna().sum() + clean_df['END_DT'].isna().sum()),
        'active_now_count': int(clean_df['active_now'].sum())
    }

    return { 'summary': summary, 'items': items }