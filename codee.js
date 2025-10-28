
// EmployeeTravelDashboard.jsx
import React, { useState, useMemo } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Small helper to format ISO datetimes into readable strings (fallback safe)
const fmt = (iso) => {
  if (!iso) return "";
  try {
    const d = new Date(iso);
    return d.toLocaleString();
  } catch {
    return String(iso);
  }
};

const EmployeeTravelDashboard = () => {
  const [file, setFile] = useState(null);
  const [items, setItems] = useState([]); // items array from backend
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    country: "",
    legType: "",
    search: "",
  });

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const uploadFile = async () => {
    if (!file) {
      toast.warn("Please choose an Excel (.xlsx/.xls) or CSV file.");
      return;
    }
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
      setSummary(payload.summary || null);
      toast.success(`File loaded — ${rows.length} rows parsed.`);
    } catch (err) {
      console.error(err);
      // Prefer backend-provided detail, otherwise a friendly message
      const detail = err?.response?.data?.detail || err.message || "Upload failed.";
      toast.error(`Upload failed: ${detail}`);
    } finally {
      setLoading(false);
    }
  };

  // memoized sets for filter dropdowns
  const countries = useMemo(
    () => [...new Set(items.map((r) => r.from_country).filter(Boolean))],
    [items]
  );
  const legTypes = useMemo(
    () => [...new Set(items.map((r) => r.leg_type).filter(Boolean))],
    [items]
  );

  // Make sure items is always an array (defensive)
  const safeItems = Array.isArray(items) ? items : [];

  const filtered = safeItems.filter((row) => {
    const s = filters.search.trim().toLowerCase();
    if (s) {
      const hay = `${row.first_name || ""} ${row.last_name || ""} ${row.email || ""} ${row.pnr || ""}`.toLowerCase();
      if (!hay.includes(s)) return false;
    }
    if (filters.country && row.from_country !== filters.country) return false;
    if (filters.legType && row.leg_type !== filters.legType) return false;
    return true;
  });

  const exportCsv = () => {
    if (filtered.length === 0) {
      toast.info("No rows to export.");
      return;
    }
    const keys = Object.keys(filtered[0]);
    const csvRows = [keys.join(",")];
    for (const r of filtered) {
      csvRows.push(
        keys
          .map((k) => {
            const v = r[k] ?? "";
            // escape quotes
            return `"${String(v).replace(/"/g, '""')}"`;
          })
          .join(",")
      );
    }
    const blob = new Blob([csvRows.join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "employee_travel_export.csv";
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Exported CSV");
  };

  return (
    <div style={page}>
      <ToastContainer position="top-right" autoClose={3500} hideProgressBar />
      <div style={card}>
        <h1 style={title}>Employee Travel Dashboard</h1>

        <div style={uploadRow}>
          <input
            type="file"
            accept=".xlsx,.xls,.csv"
            onChange={handleFileChange}
            style={fileInput}
          />
          <button style={primaryBtn} onClick={uploadFile} disabled={loading}>
            {loading ? "Processing..." : "Upload & Analyze"}
          </button>

          <button
            style={secondaryBtn}
            onClick={() => {
              setItems([]);
              setSummary(null);
              setFile(null);
              toast.info("Cleared current data");
            }}
          >
            Clear
          </button>
        </div>

        <div style={metaRow}>
          <div style={metaCard}>
            <div style={metaLabel}>Rows</div>
            <div style={metaValue}>{summary?.rows_received ?? safeItems.length}</div>
          </div>
          <div style={metaCard}>
            <div style={metaLabel}>Parse Errors</div>
            <div style={metaValue}>{summary?.rows_with_parse_errors ?? "-"}</div>
          </div>
          <div style={metaCard}>
            <div style={metaLabel}>Active Now</div>
            <div style={metaValue}>{summary?.active_now_count ?? safeItems.filter(r => r.active_now).length}</div>
          </div>

          <div style={{ flex: 1 }} />
          <div style={{ display: "flex", gap: 8 }}>
            <button style={ghostBtn} onClick={exportCsv}>
              Export CSV
            </button>
          </div>
        </div>

        <div style={filterRow}>
          <input
            placeholder="Search name, email or PNR..."
            value={filters.search}
            onChange={(e) => setFilters((f) => ({ ...f, search: e.target.value }))}
            style={searchInput}
          />

          <select
            value={filters.country}
            onChange={(e) => setFilters((f) => ({ ...f, country: e.target.value }))}
            style={select}
          >
            <option value="">All Countries</option>
            {countries.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          <select
            value={filters.legType}
            onChange={(e) => setFilters((f) => ({ ...f, legType: e.target.value }))}
            style={select}
          >
            <option value="">All Travel Types</option>
            {legTypes.map((lt) => (
              <option key={lt} value={lt}>
                {lt}
              </option>
            ))}
          </select>
        </div>

        <div style={tableWrap}>
          <table style={table}>
            <thead style={thead}>
              <tr>
                <th style={th}>Active</th>
                <th style={th}>Name</th>
                <th style={th}>Email</th>
                <th style={th}>Type</th>
                <th style={th}>From</th>
                <th style={th}>To</th>
                <th style={th}>Begin</th>
                <th style={th}>End</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={8} style={emptyRow}>
                    No rows. Upload a file to begin or adjust filters.
                  </td>
                </tr>
              )}
              {filtered.map((r, i) => (
                <tr key={r.index ?? i} style={i % 2 === 0 ? rowEven : rowOdd}>
                  <td style={td}>{r.active_now ? "✅" : ""}</td>
                  <td style={td}>{`${r.first_name ?? ""} ${r.last_name ?? ""}`}</td>
                  <td style={td}>{r.email ?? ""}</td>
                  <td style={td}>{r.leg_type ?? ""}</td>
                  <td style={td}>{`${r.from_location ?? ""} (${r.from_country ?? ""})`}</td>
                  <td style={td}>{`${r.to_location ?? ""} (${r.to_country ?? ""})`}</td>
                  <td style={td}>{fmt(r.begin_dt)}</td>
                  <td style={td}>{fmt(r.end_dt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

/* --- Styles --- */
const page = {
  background: "#f3f6f9",
  minHeight: "100vh",
  padding: "36px",
  fontFamily: "'Inter', system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial",
  color: "#0f172a",
};

const card = {
  maxWidth: 1200,
  margin: "0 auto",
  padding: 24,
  borderRadius: 12,
  background: "#fff",
  boxShadow: "0 6px 30px rgba(16,24,40,0.06)",
};

const title = { fontSize: 22, marginBottom: 14, color: "#0b2545" };

const uploadRow = { display: "flex", gap: 12, alignItems: "center", marginBottom: 16 };

const fileInput = { padding: 8, borderRadius: 8, border: "1px solid #e6eef8", background: "#fff" };

const primaryBtn = {
  background: "#0f62fe",
  color: "#fff",
  border: "none",
  padding: "8px 14px",
  borderRadius: 8,
  cursor: "pointer",
  fontWeight: 600,
};

const secondaryBtn = {
  background: "#f1f5f9",
  color: "#0b2545",
  border: "none",
  padding: "8px 12px",
  borderRadius: 8,
  cursor: "pointer",
};

const ghostBtn = {
  background: "transparent",
  border: "1px solid #e6eef8",
  padding: "6px 10px",
  borderRadius: 8,
  cursor: "pointer",
};

const metaRow = { display: "flex", gap: 12, alignItems: "center", marginBottom: 12 };

const metaCard = { padding: 12, borderRadius: 10, background: "#f8fafc", minWidth: 110, textAlign: "center" };
const metaLabel = { fontSize: 12, color: "#475569" };
const metaValue = { fontWeight: 700, fontSize: 18, color: "#0f172a" };

const filterRow = { display: "flex", gap: 12, marginBottom: 12, alignItems: "center" };
const searchInput = { flex: 1, padding: 10, borderRadius: 8, border: "1px solid #e6eef8" };
const select = { padding: 10, borderRadius: 8, border: "1px solid #e6eef8", minWidth: 180 };

const tableWrap = { overflowX: "auto", borderRadius: 10, border: "1px solid #eef2f7" };
const table = { width: "100%", borderCollapse: "collapse", minWidth: 900 };
const thead = { background: "#f8fafc" };
const th = { textAlign: "left", padding: "12px 14px", color: "#334155", fontWeight: 700, borderBottom: "1px solid #eef2f7" };
const td = { padding: "10px 14px", color: "#0f172a", borderBottom: "1px solid #f1f5f9" };
const rowEven = { background: "#ffffff" };
const rowOdd = { background: "#fbfdff" };
const emptyRow = { textAlign: "center", padding: 18, color: "#64748b" };

export default EmployeeTravelDashboard;





.....
.....
...


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