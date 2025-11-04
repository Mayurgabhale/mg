from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import pandas as pd
import numpy as np
from io import BytesIO, StringIO
from dateutil import parser
from datetime import datetime
import re, zoneinfo

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
previous_data = {"summary": None, "items": None}


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


# ✅ 3. Main upload endpoint
@app.post("/upload")
async def upload_excel(file: UploadFile = File(None)):
    global previous_data

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

    try:
        df = read_any_format(content, file.filename)
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"File parsing failed: {e}")

    # --- Date parsing ---
    df['BEGIN_DT'] = df['BEGIN DATE'].apply(normalize_and_parse)
    df['END_DT'] = df['END DATE'].apply(normalize_and_parse)

    now_local = datetime.now(tz=SERVER_TZ)
    now_utc = now_local.astimezone(zoneinfo.ZoneInfo('UTC'))

    def is_active(row):
        b, e = row['BEGIN_DT'], row['END_DT']
        return bool(b and e and b <= now_utc <= e)

    df['active_now'] = df.apply(is_active, axis=1)
    df = df.replace([np.nan, np.inf, -np.inf, pd.NaT], None)

    # --- Convert to response-friendly structure ---
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

    items = [row_to_obj(i, r) for i, r in df.iterrows()]

    summary = {
        'rows_received': len(df),
        'rows_removed_as_footer_or_empty': 0,  # already cleaned
        'rows_with_parse_errors': int(df['BEGIN_DT'].isna().sum() + df['END_DT'].isna().sum()),
        'active_now_count': int(df['active_now'].sum())
    }

    previous_data["summary"] = summary
    previous_data["items"] = items

    return JSONResponse(content={
        'summary': summary,
        'items': items,
        'message': 'New file uploaded and processed successfully'
    })


# ✅ 4. Reuse endpoint
@app.get("/data")
async def get_previous_data():
    if previous_data["items"] is not None:
        return JSONResponse(content={
            "summary": previous_data["summary"],
            "items": previous_data["items"],
            "message": "Loaded saved data from memory"
        })
    else:
        raise HTTPException(status_code=404, detail="No previously uploaded data found.")