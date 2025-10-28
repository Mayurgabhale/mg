I want to update react code.. 
# from fastapi import FastAPI, File, UploadFile, HTTPException
# from fastapi.middleware.cors import CORSMiddleware
# from fastapi.responses import JSONResponse
# import pandas as pd
# import numpy as np
# from io import BytesIO
# from dateutil import parser
# from datetime import datetime
# import re, zoneinfo

# app = FastAPI(title="Employee Travel Dashboard — Parser")

# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=[
#         "http://localhost:5173",
#         "http://localhost:3000",
#         "http://127.0.0.1:5173",
#         "http://127.0.0.1:3000",
#     ],
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )

# SERVER_TZ = zoneinfo.ZoneInfo("Asia/Kolkata")

# def normalize_and_parse(dt_val):
#     if pd.isna(dt_val):
#         return None
#     s = str(dt_val).strip()
#     s = re.sub(r"(\d{1,2})\.(\d{1,2})(?!\d)", r"\1:\2", s)
#     try:
#         dt = parser.parse(s, dayfirst=False)
#         if dt.tzinfo is None:
#             dt = dt.replace(tzinfo=SERVER_TZ)
#         return dt.astimezone(zoneinfo.ZoneInfo("UTC"))
#     except Exception:
#         return None

# @app.post("/upload")
# async def upload_excel(file: UploadFile = File(...)):
#     if not file.filename.lower().endswith((".xlsx", ".xls", ".csv")):
#         raise HTTPException(status_code=400, detail="Unsupported file type")

#     content = await file.read()
#     try:
#         if file.filename.lower().endswith(".csv"):
#             df = pd.read_csv(BytesIO(content))
#         else:
#             df = pd.read_excel(BytesIO(content))
#     except Exception as e:
#         raise HTTPException(status_code=400, detail=f"Failed to read spreadsheet: {e}")

#     expected = [
#         "AGENCY ID","AGENCY NAME","LAST NAME","FIRST NAME","TRAVELER",
#         "EMP ID","EMAIL","PNR","LEG TYPE","BEGIN DATE","FROM LOCATION","FROM COUNTRY",
#         "END DATE","TO LOCATION","TO COUNTRY"
#     ]

#     cols_map = {c.lower().strip(): c for c in df.columns}

#     def get_col(ci):
#         for k,v in cols_map.items():
#             if k == ci.lower():
#                 return v
#         for k,v in cols_map.items():
#             if ci.lower() in k:
#                 return v
#         return None

#     col_get = {c: get_col(c) for c in expected}

#     clean = {}
#     for canon, found in col_get.items():
#         clean[canon] = df[found] if found in df.columns else pd.Series([None]*len(df))

#     clean_df = pd.DataFrame(clean)
#     clean_df['BEGIN_DT'] = clean_df['BEGIN DATE'].apply(normalize_and_parse)
#     clean_df['END_DT'] = clean_df['END DATE'].apply(normalize_and_parse)

#     now_local = datetime.now(tz=SERVER_TZ)
#     now_utc = now_local.astimezone(zoneinfo.ZoneInfo('UTC'))

#     def is_active(row):
#         b, e = row['BEGIN_DT'], row['END_DT']
#         return bool(b and e and b <= now_utc <= e)

#     clean_df['active_now'] = clean_df.apply(is_active, axis=1)

#     # ✅ Replace problematic NaN/inf values
#     clean_df = clean_df.replace([np.nan, np.inf, -np.inf, pd.NaT], None)

#     # 🧹 Smart cleanup: remove empty and footer/metadata rows
#     import re

#     original_row_count = len(clean_df)

#     def is_footer_row(row):
#         combined = " ".join(str(v) for v in row.values if v is not None).lower()
#         footer_patterns = [
#             r"copyright", r"all rights reserved", r"gardaworld", r"utc",
#             r"\b\d{1,2}-[a-z]{3}-\d{4}\b"
#         ]
#         return any(re.search(p, combined) for p in footer_patterns)

#     # Drop completely empty rows
#     clean_df = clean_df.dropna(how="all")

#     # Drop rows that match footer patterns anywhere
#     clean_df = clean_df[~clean_df.apply(is_footer_row, axis=1)]

#     # Drop rows missing all key traveler identifiers
#     clean_df = clean_df[
#         clean_df["FIRST NAME"].notna() |
#         clean_df["LAST NAME"].notna() |
#         clean_df["EMAIL"].notna()
#     ]

#     removed_rows = original_row_count - len(clean_df)

#     def row_to_obj(i, row):
#         return {
#             'index': int(i),
#             'agency_id': row.get('AGENCY ID'),
#             'agency_name': row.get('AGENCY NAME'),
#             'first_name': row.get('FIRST NAME'),
#             'last_name': row.get('LAST NAME'),
#             'emp_id': row.get('EMP ID'),
#             'email': row.get('EMAIL'),
#             'pnr': row.get('PNR'),
#             'leg_type': row.get('LEG TYPE'),
#             'begin_dt': row.get('BEGIN_DT').isoformat() if row.get('BEGIN_DT') else None,
#             'end_dt': row.get('END_DT').isoformat() if row.get('END_DT') else None,
#             'from_location': row.get('FROM LOCATION'),
#             'from_country': row.get('FROM COUNTRY'),
#             'to_location': row.get('TO LOCATION'),
#             'to_country': row.get('TO COUNTRY'),
#             'active_now': bool(row.get('active_now'))
#         }

#     items = [row_to_obj(i, r) for i, r in clean_df.iterrows()]

#     summary = {
#         'rows_received': len(clean_df),
#         'rows_removed_as_footer_or_empty': removed_rows,
#         'rows_with_parse_errors': int(clean_df['BEGIN_DT'].isna().sum() + clean_df['END_DT'].isna().sum()),
#         'active_now_count': int(clean_df['active_now'].sum())
#     }

#     # ✅ Ensure JSON-safe output
#     return JSONResponse(content={'summary': summary, 'items': items})


****  commented above is old code ****

......................
  this is new 

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



and react code is 
old as per this  ****  commented above is old code ****
  no update 
know i want to updae 
......................
  this is new 
-----
  import React, { useState, useMemo } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Player } from "@lottiefiles/react-lottie-player"; 

// Import real icons
import {
    FiGlobe,
    FiUsers,
    FiMapPin,
    FiFileText,
    FiUpload,
    FiFilter,
    FiSearch,
    FiDownload,
    FiTrash2,
    FiCheckCircle,
    FiXCircle,
    FiCalendar,
    FiMail,
    FiUser,
    FiAward,
    FiActivity
} from "react-icons/fi";

const fmt = (iso) => {
    if (!iso) return "";
    try {
        const d = new Date(iso);
        return d.toLocaleDateString() + " " + d.toLocaleTimeString();
    } catch {
        return String(iso);
    }
};

const EmployeeTravelDashboard = () => {
    const [file, setFile] = useState(null);
    const [items, setItems] = useState([]);
    const [summary, setSummary] = useState({});
    const [loading, setLoading] = useState(false);
    const [filters, setFilters] = useState({
        country: "",
        legType: "",
        search: "",
    });

    const handleFileChange = (e) => setFile(e.target.files[0]);

    const uploadFile = async () => {
        if (!file) return toast.warn("Please select an Excel or CSV file first.");
        setLoading(true);
        try {
            const formData = new FormData();
            formData.append("file", file);
            const res = await axios.post("http://localhost:8000/upload", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            const payload = res.data || {};
            const rows = payload.items || [];
            setItems(rows);
            setSummary(payload.summary || {});
            toast.success(`Uploaded successfully. ${rows.length} records found.`);
        } catch (err) {
            console.error(err);
            toast.error("Upload failed. Please check the backend or file format.");
        } finally {
            setLoading(false);
        }
    };

    const safeItems = Array.isArray(items) ? items : [];
    const countries = useMemo(
        () => [...new Set(safeItems.map((r) => r.from_country).filter(Boolean))],
        [safeItems]
    );
    const legTypes = useMemo(
        () => [...new Set(safeItems.map((r) => r.leg_type).filter(Boolean))],
        [safeItems]
    );

    const filtered = safeItems.filter((r) => {
        const s = filters.search.toLowerCase();
        if (s) {
            const hay = `${r.first_name ?? ""} ${r.last_name ?? ""} ${r.email ?? ""}`.toLowerCase();
            if (!hay.includes(s)) return false;
        }
        if (filters.country && r.from_country !== filters.country) return false;
        if (filters.legType && r.leg_type !== filters.legType) return false;
        return true;
    });

    const countryStats = useMemo(() => {
        const map = {};
        for (const r of safeItems) {
            const c = r.from_country || "Unknown";
            map[c] = (map[c] || 0) + 1;
        }
        return Object.entries(map)
            .map(([k, v]) => ({ country: k, count: v }))
            .sort((a, b) => b.count - a.count);
    }, [safeItems]);

    const exportCsv = () => {
        if (!filtered.length) return toast.info("No data to export.");
        const keys = Object.keys(filtered[0]);
        const csv = [keys.join(",")];
        filtered.forEach((r) =>
            csv.push(keys.map((k) => `"${String(r[k] ?? "").replace(/"/g, '""')}"`).join(","))
        );
        const blob = new Blob([csv.join("\n")], { type: "text/csv" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "EmployeeTravelData.csv";
        a.click();
        URL.revokeObjectURL(url);
        toast.success("CSV exported successfully.");
    };

    return (
        <div style={page}>
            <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
            />
            {loading && (
                <div style={style.overlay}>
                    <span style={style.loader}></span>
                   
                    <style>{keyframes}</style>
                </div>
            )}
            {/* HEADER */}
            <header style={header}>
                <div style={headerContent}>
                    <div style={headerIcon}>
                        <FiGlobe size={32} />
                    </div>
                    <div>
                        <h1 style={title}>Travel Details</h1>
                        <p style={subtitle}>Manage and monitor employee travel activities</p>
                    </div>
                </div>
            </header>

            <div style={layout}>
                {/* LEFT PANEL */}
                <aside style={sidebar}>
                    <div style={sideCard}>
                        <div style={cardHeader}>
                            <FiActivity style={cardIcon} />
                            <h3 style={sideTitle}>Overview</h3>
                        </div>
                        <div style={statsGrid}>
                            <div style={statItem}>
                                <div style={statIconWrapper}>
                                    <FiUsers style={statIcon} />
                                </div>
                                <div style={statContent}>
                                    <span style={statLabel}>Total Travelers</span>
                                    <strong style={statValue}>{safeItems.length}</strong>
                                </div>
                            </div>
                            <div style={statItem}>
                                <div style={{ ...statIconWrapper, background: '#dcfce7' }}>
                                    <FiCheckCircle style={{ ...statIcon, color: '#16a34a' }} />
                                </div>
                                <div style={statContent}>
                                    <span style={statLabel}>Active Now</span>
                                    <strong style={statValue}>{safeItems.filter((r) => r.active_now).length}</strong>
                                </div>
                            </div>
                            <div style={statItem}>
                                <div style={{ ...statIconWrapper, background: '#dbeafe' }}>
                                    <FiMapPin style={{ ...statIcon, color: '#2563eb' }} />
                                </div>
                                <div style={statContent}>
                                    <span style={statLabel}>Countries</span>
                                    <strong style={statValue}>{countries.length}</strong>
                                </div>
                            </div>
                            <div style={statItem}>
                                <div style={{ ...statIconWrapper, background: '#fef3c7' }}>
                                    <FiAward style={{ ...statIcon, color: '#d97706' }} />
                                </div>
                                <div style={statContent}>
                                    <span style={statLabel}>Travel Types</span>
                                    <strong style={statValue}>{legTypes.length}</strong>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div style={sideCard}>
                        <div style={cardHeader}>
                            <FiMapPin style={cardIcon} />
                            <h3 style={sideTitle}>Country-wise Travelers</h3>
                        </div>
                        {countryStats.length === 0 ? (
                            <div style={emptyState}>
                                <FiFileText size={24} style={{ color: '#9ca3af', marginBottom: '8px' }} />
                                <p style={sideEmpty}>No data available</p>
                            </div>
                        ) : (
                            <ul style={countryList}>
                                {countryStats.slice().map((c, index) => (
                                    <li key={c.country} style={countryItem}>
                                        <div style={countryInfo}>
                                            <span style={countryRank}>#{index + 1}</span>
                                            <span style={countryName}>{c.country}</span>
                                        </div>
                                        <strong style={countryCount}>{c.count}</strong>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </aside>

                {/* RIGHT PANEL */}
                <main style={main}>
                    <div style={card}>
                        <div style={uploadRow}>
                            <div style={fileUploadWrapper}>
                                <input
                                    type="file"
                                    accept=".xlsx,.xls,.csv"
                                    onChange={handleFileChange}
                                    style={fileInput}
                                    id="file-upload"
                                />
                                <label htmlFor="file-upload" style={fileInputLabel}>
                                    <FiUpload style={{ marginRight: '8px' }} />
                                    {file ? file.name : "Choose File"}
                                </label>
                            </div>
                            <div style={buttonGroup}>
                                <button
                                    onClick={uploadFile}
                                    disabled={loading}
                                    style={loading ? disabledPrimaryBtn : primaryBtn}
                                >
                                    {loading ? (
                                        <>
                                            <div style={spinner}></div>
                                            Processing...
                                        </>
                                    ) : (
                                        <>
                                            <FiUpload style={{ marginRight: '8px' }} />
                                            Upload File
                                        </>
                                    )}
                                </button>
                                <button
                                    onClick={() => {
                                        setItems([]);
                                        setSummary({});
                                        setFile(null);
                                        toast.info("Data cleared successfully.");
                                    }}
                                    style={secondaryBtn}
                                >
                                    <FiTrash2 style={{ marginRight: '8px' }} />
                                    Clear
                                </button>
                                <button onClick={exportCsv} style={ghostBtn}>
                                    <FiDownload style={{ marginRight: '8px' }} />
                                    Export CSV
                                </button>
                            </div>
                        </div>

                        <div style={filtersSection}>
                            <div style={filtersHeader}>
                                <FiFilter style={{ marginRight: '8px', color: '#6b7280' }} />
                                <span style={filtersTitle}>Filters</span>
                            </div>
                            <div style={filtersRow}>
                                <div style={searchWrapper}>
                                    <FiSearch style={searchIcon} />
                                    <input
                                        placeholder="Search by name or email..."
                                        value={filters.search}
                                        onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                                        style={searchInput}
                                    />
                                </div>
                                <select
                                    value={filters.country}
                                    onChange={(e) => setFilters({ ...filters, country: e.target.value })}
                                    style={select}
                                >
                                    <option value="">All Countries</option>
                                    {countries.map((c) => (
                                        <option key={c}>{c}</option>
                                    ))}
                                </select>
                                <select
                                    value={filters.legType}
                                    onChange={(e) => setFilters({ ...filters, legType: e.target.value })}
                                    style={select}
                                >
                                    <option value="">All Travel Types</option>
                                    {legTypes.map((t) => (
                                        <option key={t}>{t}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div style={tableSection}>
                            <div style={tableHeader}>
                                <h3 style={tableTitle}>Travel Records</h3>
                                <span style={tableBadge}>{filtered.length} records</span>
                            </div>
                            <div style={tableWrap}>
                                <table style={table}>
                                    <thead style={thead}>
                                        <tr>
                                            <th style={th}>Status</th>
                                            <th style={th}>Traveler</th>
                                            <th style={th}>Email</th>
                                            <th style={th}>Type</th>
                                            <th style={th}>From</th>
                                            <th style={th}>To</th>
                                            <th style={th}>Start Date</th>
                                            <th style={th}>End Date</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filtered.length === 0 ? (
                                            <tr>
                                                <td colSpan="8" style={emptyRow}>
                                                    <div style={emptyState}>
                                                        <FiFileText size={32} style={{ color: '#9ca3af', marginBottom: '12px' }} />
                                                        <p>No matching results found</p>
                                                        <p style={emptySubtext}>Upload a file or adjust your filters</p>
                                                    </div>
                                                </td>
                                            </tr>
                                        ) : (
                                            filtered.map((r, i) => (
                                                <tr key={i} style={i % 2 === 0 ? rowEven : rowOdd}>
                                                    <td style={td}>
                                                        {r.active_now ? (
                                                            <div style={activeBadge}>
                                                                <FiCheckCircle size={14} />
                                                                Active
                                                            </div>
                                                        ) : (
                                                            <div style={inactiveBadge}>
                                                                <FiXCircle size={14} />
                                                                Inactive
                                                            </div>
                                                        )}
                                                    </td>
                                                    <td style={td}>
                                                        <div style={userCell}>
                                                            <div style={avatar}>
                                                                <FiUser size={14} />
                                                            </div>
                                                            <span>
                                                                {r.first_name} {r.last_name}
                                                            </span>
                                                        </div>
                                                    </td>
                                                    <td style={td}>
                                                        <div style={emailCell}>
                                                            <FiMail size={14} style={{ marginRight: '6px', color: '#6b7280' }} />
                                                            {r.email}
                                                        </div>
                                                    </td>
                                                    <td style={td}>
                                                        <span style={typeBadge}>{r.leg_type}</span>
                                                    </td>
                                                    <td style={td}>{r.from_country}</td>
                                                    <td style={td}>{r.to_country}</td>
                                                    <td style={td}>
                                                        <div style={dateCell}>
                                                            <FiCalendar size={14} style={{ marginRight: '6px', color: '#6b7280' }} />
                                                            {fmt(r.begin_dt)}
                                                        </div>
                                                    </td>
                                                    <td style={td}>
                                                        <div style={dateCell}>
                                                            <FiCalendar size={14} style={{ marginRight: '6px', color: '#6b7280' }} />
                                                            {fmt(r.end_dt)}
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};






/* === ENHANCED STYLES === */


const page = {
    backgroundColor: "#f8fafc",
    // backgroundColor: "#19191aff",
    minHeight: "100vh",
    padding: "24px",
    color: "#1e293b",
    // color: "#e7eaeeff",
    fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif",
    lineHeight: "1.5",
};

const header = {
    marginBottom: "32px",
};

const headerContent = {
    display: "flex",
    alignItems: "center",
    gap: "16px",
};

const headerIcon = {
    background: "linear-gradient(135deg, #3b82f6, #1d4ed8)",
