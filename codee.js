from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import pandas as pd
import numpy as np
from io import BytesIO
from dateutil import parser
from datetime import datetime
import re, zoneinfo, os, hashlib, json

app = FastAPI(title="Employee Travel Dashboard — Parser")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:3000",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

UPLOAD_DIR = "uploaded_files"
os.makedirs(UPLOAD_DIR, exist_ok=True)

SERVER_TZ = zoneinfo.ZoneInfo("Asia/Kolkata")

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


def extract_date_from_filename(filename: str):
    # Match pattern like EMPLOYEES_TRAVELING_TODAY-202510280514.csv
    match = re.search(r"(\d{8})", filename)
    if match:
        d = match.group(1)
        try:
            return datetime.strptime(d, "%Y%m%d").date()
        except ValueError:
            pass
    return None


def hash_bytes(data: bytes):
    """Compute SHA256 hash of bytes for quick comparison"""
    return hashlib.sha256(data).hexdigest()


@app.post("/upload")
async def upload_excel(file: UploadFile = File(...)):
    if not file.filename.lower().endswith((".xlsx", ".xls", ".csv")):
        raise HTTPException(status_code=400, detail="Unsupported file type")

    # Extract date from filename
    file_date = extract_date_from_filename(file.filename)
    if not file_date:
        raise HTTPException(status_code=400, detail="Filename missing valid date")

    content = await file.read()
    file_hash = hash_bytes(content)
    date_key = file_date.isoformat()
    meta_path = os.path.join(UPLOAD_DIR, f"{date_key}.meta.json")

    # 🧠 Check if already uploaded
    if os.path.exists(meta_path):
        with open(meta_path, "r") as f:
            meta = json.load(f)
        if meta.get("hash") == file_hash:
            return JSONResponse(
                content={
                    "status": "already_uploaded",
                    "message": f"✅ File for {date_key} already uploaded (same data).",
                    "summary": meta.get("summary"),
                }
            )

    # Parse spreadsheet
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
        for k, v in cols_map.items():
            if k == ci.lower():
                return v
        for k, v in cols_map.items():
            if ci.lower() in k:
                return v
        return None

    col_get = {c: get_col(c) for c in expected}
    clean = {}
    for canon, found in col_get.items():
        clean[canon] = df[found] if found in df.columns else pd.Series([None] * len(df))

    clean_df = pd.DataFrame(clean)
    clean_df["BEGIN_DT"] = clean_df["BEGIN DATE"].apply(normalize_and_parse)
    clean_df["END_DT"] = clean_df["END DATE"].apply(normalize_and_parse)

    now_local = datetime.now(tz=SERVER_TZ)
    now_utc = now_local.astimezone(zoneinfo.ZoneInfo("UTC"))

    def is_active(row):
        b, e = row["BEGIN_DT"], row["END_DT"]
        return bool(b and e and b <= now_utc <= e)

    clean_df["active_now"] = clean_df.apply(is_active, axis=1)

    clean_df = clean_df.replace([np.nan, np.inf, -np.inf, pd.NaT], None)
    original_row_count = len(clean_df)

    def is_footer_row(row):
        combined = " ".join(str(v) for v in row.values if v is not None).lower()
        footer_patterns = [
            r"copyright", r"all rights reserved", r"gardaworld", r"utc",
            r"\b\d{1,2}-[a-z]{3}-\d{4}\b",
        ]
        return any(re.search(p, combined) for p in footer_patterns)

    clean_df = clean_df.dropna(how="all")
    clean_df = clean_df[~clean_df.apply(is_footer_row, axis=1)]
    clean_df = clean_df[
        clean_df["FIRST NAME"].notna()
        | clean_df["LAST NAME"].notna()
        | clean_df["EMAIL"].notna()
    ]

    removed_rows = original_row_count - len(clean_df)

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
            "active_now": bool(row.get("active_now")),
        }

    items = [row_to_obj(i, r) for i, r in clean_df.iterrows()]

    summary = {
        "file_date": date_key,
        "rows_received": len(clean_df),
        "rows_removed_as_footer_or_empty": removed_rows,
        "rows_with_parse_errors": int(
            clean_df["BEGIN_DT"].isna().sum() + clean_df["END_DT"].isna().sum()
        ),
        "active_now_count": int(clean_df["active_now"].sum()),
    }

    # Save metadata
    with open(meta_path, "w") as f:
        json.dump({"hash": file_hash, "summary": summary}, f, indent=2)

    return JSONResponse(
        content={
            "status": "uploaded",
            "message": f"✅ File for {date_key} uploaded successfully.",
            "summary": summary,
            "items": items,
        }
    )


@app.get("/uploads")
def list_uploads():
    """List all uploaded dates and summaries"""
    files = []
    for name in sorted(os.listdir(UPLOAD_DIR)):
        if name.endswith(".meta.json"):
            with open(os.path.join(UPLOAD_DIR, name), "r") as f:
                meta = json.load(f)
            files.append(meta["summary"])
    return {"uploads": files}