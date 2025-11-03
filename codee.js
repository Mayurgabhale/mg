how to fix this,
because each day exvle or csv file has different format 
thats way we not disply any data.. 
    can do this 
in files chekc only this 
AGENCY ID	AGENCY NAME	LAST NAME	FIRST NAME	TRAVELER 	EMP ID	EMAIL	PNR	LEG TYPE	BEGIN DATE	FROM LOCATION	FROM COUNTRY	END DATE	TO LOCATION	TO COUNTRY
728775	Western Union - Argentina	GORRASSI	IVANA	TRAVELER		ivana.gorrassi@westernunion.com	MAFNNB	HOTEL	4/15/2024 0:00	Bahia Blanca, Buenos Aires	Argentina	1/1/2000 0:00	Bahia Blanca, Buenos Aires	Argentina 
for mat anything, i want only this data. ok  
some time as a  as comnarp differnet for mat next day, so we getting error, 
    so how to fix this...  

    filx format anythi, but we want only this data  
AGENCY ID	AGENCY NAME	LAST NAME	FIRST NAME	TRAVELER 	EMP ID	EMAIL	PNR	LEG TYPE	BEGIN DATE	FROM LOCATION	FROM COUNTRY	END DATE	TO LOCATION	TO COUNTRY
http://127.0.0.1:8000/upload

{
  "summary": {
    "rows_received": 0,
    "rows_removed_as_footer_or_empty": 78,
    "rows_with_parse_errors": 0,
    "active_now_count": 0
  },
  "items": [],
  "message": "New file uploaded and processed"
}

EMPLOYEES TRAVELING TODAY - Monday, November 3, 2025														
														
AGENCY ID	AGENCY NAME	LAST NAME	FIRST NAME	TRAVELER 	EMP ID	EMAIL	PNR	LEG TYPE	BEGIN DATE	FROM LOCATION	FROM COUNTRY	END DATE	TO LOCATION	TO COUNTRY
728775	Western Union - Argentina	GORRASSI	IVANA	TRAVELER		ivana.gorrassi@westernunion.com	MAFNNB	HOTEL	4/15/2024 0:00	Bahia Blanca, Buenos Aires	Argentina	1/1/2000 0:00	Bahia Blanca, Buenos Aires	Argentina
728775	Western Union - Argentina	LIBERTINI	GUILLERMO	TRAVELER	236853	guillermo.libertini@westernunion.com	CKYUYI	HOTEL	11/3/2025 0:00	Buenos Aires, Ciudad de Buenos Aires	Argentina	11/5/2025 0:00	Buenos Aires, Ciudad de Buenos Aires	Argentina
728671	Western Union - United States	WITHAM	AMY	TRAVELER	302674	amy.witham@westernunion.com	HRNPHV	HOTEL	11/3/2025 0:00	Atlanta, Georgia	United States	11/4/2025 0:00	Atlanta, Georgia	United States
728671	Western Union - United States	WITHAM	AMY	TRAVELER	302674	amy.witham@westernunion.com	HRNPHV	AIR	11/3/2025 6:00	Denver, Colorado	United States	11/3/2025 10:54	Atlanta, Georgia	United States
728671	Western Union - United States	WITHAM	AMY	TRAVELER	302674	amy.witham@westernunion.com	HRNPHV	STOP	11/3/2025 10:54	Atlanta, Georgia	United States	11/7/2025 16:35	Atlanta, Georgia	United States
728671	Western Union - United States	WITHAM	AMY	TRAVELER	302674	amy.witham@westernunion.com	HRNPHV	CAR	11/3/2025 11:00	Atlanta, Georgia	United States	11/7/2025 16:00	Atlanta, Georgia	United States
														
03-Nov-2025 10:00 UTC Copyright GardaWorld 2000-2025. All rights reserved.														


from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import pandas as pd
import numpy as np
from io import BytesIO
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

# ✅ Global variable to store previous data
previous_data = {
    "summary": None,
    "items": None
}

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


@app.post("/upload")
async def upload_excel(file: UploadFile = File(None)):
    global previous_data

    # ✅ If no new file uploaded, return previous data
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
        if file.filename.lower().endswith(".csv"):
            df = pd.read_csv(BytesIO(content))
        else:
            df = pd.read_excel(BytesIO(content))
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Failed to read spreadsheet: {e}")

    expected = [
        "AGENCY ID","AGENCY NAME","LAST NAME","FIRST NAME","TRAVELER",
        "EMP ID","EMAIL","PNR","LEG TYPE","BEGIN DATE","FROM LOCATION","FROM COUNTRY",
        "END DATE","TO LOCATION","TO COUNTRY"
    ]

    cols_map = {c.lower().strip(): c for c in df.columns}

    def get_col(ci):
        for k,v in cols_map.items():
            if k == ci.lower():
                return v
        for k,v in cols_map.items():
            if ci.lower() in k:
                return v
        return None

    col_get = {c: get_col(c) for c in expected}

    clean = {}
    for canon, found in col_get.items():
        clean[canon] = df[found] if found in df.columns else pd.Series([None]*len(df))

    clean_df = pd.DataFrame(clean)
    clean_df['BEGIN_DT'] = clean_df['BEGIN DATE'].apply(normalize_and_parse)
    clean_df['END_DT'] = clean_df['END DATE'].apply(normalize_and_parse)

    now_local = datetime.now(tz=SERVER_TZ)
    now_utc = now_local.astimezone(zoneinfo.ZoneInfo('UTC'))

    def is_active(row):
        b, e = row['BEGIN_DT'], row['END_DT']
        return bool(b and e and b <= now_utc <= e)

    clean_df['active_now'] = clean_df.apply(is_active, axis=1)

    # ✅ Replace problematic NaN/inf values
    clean_df = clean_df.replace([np.nan, np.inf, -np.inf, pd.NaT], None)

    # 🧹 Smart cleanup: remove empty and footer/metadata rows
    original_row_count = len(clean_df)

    def is_footer_row(row):
        combined = " ".join(str(v) for v in row.values if v is not None).lower()
        footer_patterns = [
            r"copyright", r"all rights reserved", r"gardaworld", r"utc",
            r"\b\d{1,2}-[a-z]{3}-\d{4}\b"
        ]
        return any(re.search(p, combined) for p in footer_patterns)

    clean_df = clean_df.dropna(how="all")
    clean_df = clean_df[~clean_df.apply(is_footer_row, axis=1)]
    clean_df = clean_df[
        clean_df["FIRST NAME"].notna() |
        clean_df["LAST NAME"].notna() |
        clean_df["EMAIL"].notna()
    ]

    removed_rows = original_row_count - len(clean_df)

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

    # ✅ Save to memory for future reuse
    previous_data["summary"] = summary
    previous_data["items"] = items

    return JSONResponse(content={'summary': summary, 'items': items, 'message': 'New file uploaded and processed'})






@app.get("/data")
async def get_previous_data():
    """Return previously uploaded data if available."""
    if previous_data["items"] is not None:
        return JSONResponse(content={
            "summary": previous_data["summary"],
            "items": previous_data["items"],
            "message": "Loaded saved data from memory"
        })
    else:
        raise HTTPException(status_code=404, detail="No previously uploaded data found.")
