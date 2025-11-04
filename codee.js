Quick Stats
Total Travelers
74
Active Now
52
Upcoming
0
0r


Active
Inactive

i want ot update auto.. 

    this count is update but when i upload new sheet i want to upload auto 
how to do this 
from datetime import datetime
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

# ✅ Global variable to store previous data
previous_data = {
    "summary": None,
    "items": None
}

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


@app.post("/upload")
async def upload_excel(file: UploadFile = File(None)):
    global previous_data

    # ✅ Return cached data if no new file uploaded
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
    expected_headers = [
        "AGENCY ID","AGENCY NAME","LAST NAME","FIRST NAME","TRAVELER",
        "EMP ID","EMAIL","PNR","LEG TYPE","BEGIN DATE","FROM LOCATION",
        "FROM COUNTRY","END DATE","TO LOCATION","TO COUNTRY"
    ]

    # 🧠 STEP 1: Find the real header row (files often include titles or junk rows)
    if file.filename.lower().endswith(".csv"):
        text_lines = content.decode(errors="ignore").splitlines()
        header_row_idx = None
        for i, line in enumerate(text_lines[:40]):  # Scan first 40 lines
            if any(h.lower() in line.lower() for h in expected_headers):
                header_row_idx = i
                break

        if header_row_idx is None:
            raise HTTPException(status_code=400, detail="No valid header row found in CSV file")

        df = pd.read_csv(StringIO("\n".join(text_lines)), skiprows=header_row_idx)
    else:
        file_stream = BytesIO(content)
        preview = pd.read_excel(file_stream, header=None, nrows=40)
        header_row_idx = None
        for i in range(len(preview)):
            joined = " ".join(str(v).strip().lower() for v in preview.iloc[i].values if pd.notna(v))
            if any(h.lower() in joined for h in expected_headers):
                header_row_idx = i
                break

        if header_row_idx is None:
            raise HTTPException(status_code=400, detail="No valid header row found in Excel file")

        file_stream.seek(0)
        df = pd.read_excel(file_stream, header=header_row_idx)

    # 🧹 STEP 2: Normalize column names (ignore case, trim spaces)
    df.columns = [str(c).strip().upper() for c in df.columns]

    # 🧩 STEP 3: Map columns flexibly
    cols_map = {c.lower().strip(): c for c in df.columns}
    def get_col(ci):
        for k,v in cols_map.items():
            if k == ci.lower():
                return v
        for k,v in cols_map.items():
            if ci.lower() in k:
                return v
        return None

    col_get = {c: get_col(c) for c in expected_headers}

    clean = {}
    for canon, found in col_get.items():
        clean[canon] = df[found] if found in df.columns else pd.Series([None]*len(df))

    clean_df = pd.DataFrame(clean)

    # 🕒 STEP 4: Parse and normalize dates
    clean_df['BEGIN_DT'] = clean_df['BEGIN DATE'].apply(normalize_and_parse)
    clean_df['END_DT'] = clean_df['END DATE'].apply(normalize_and_parse)

    now_local = datetime.now(tz=SERVER_TZ)
    now_utc = now_local.astimezone(zoneinfo.ZoneInfo('UTC'))

    def is_active(row):
        b, e = row['BEGIN_DT'], row['END_DT']
        return bool(b and e and b <= now_utc <= e)

    clean_df['active_now'] = clean_df.apply(is_active, axis=1)
    clean_df = clean_df.replace([np.nan, np.inf, -np.inf, pd.NaT], None)

    # 🚫 STEP 5: Remove junk/footer rows
    original_row_count = len(clean_df)

    def is_footer_row(row):
        combined = " ".join(str(v) for v in row.values if v is not None).lower()
        patterns = [r"copyright", r"all rights reserved", r"gardaworld", r"utc", r"\b\d{1,2}-[a-z]{3}-\d{4}\b"]
        return any(re.search(p, combined) for p in patterns)

    clean_df = clean_df.dropna(how="all")
    clean_df = clean_df[~clean_df.apply(is_footer_row, axis=1)]
    clean_df = clean_df[
        clean_df["FIRST NAME"].notna() |
        clean_df["LAST NAME"].notna() |
        clean_df["EMAIL"].notna()
    ]

    removed_rows = original_row_count - len(clean_df)

    # 🧾 STEP 6: Convert to output objects
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

    # 💾 STEP 7: Save for reuse
    previous_data["summary"] = summary
    previous_data["items"] = items

    return JSONResponse(content={
        'summary': summary,
        'items': items,
        'message': 'New file uploaded and processed'
    })


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





   {/* Quick Stats */}
                    <div style={styles.sideCard}>
                        <div style={styles.cardHeader}>
                            <FiTrendingUp style={styles.cardIcon} />
                            <h3 style={styles.sideTitle}>Quick Stats</h3>
                        </div>
                        <div style={styles.statsGrid}>
                            <div style={styles.statItem}>
                                <div style={styles.statIconWrapper}>
                                    <FiUsers style={styles.statIcon} />
                                </div>
                                <div style={styles.statContent}>
                                    <span style={styles.statLabel}>Total Travelers</span>
                                    <strong style={styles.statValue}>{analytics.totalTravelers}</strong>
                                </div>
                            </div>
                            <div style={styles.statItem}>
                                <div style={{ ...styles.statIconWrapper, background: '#dcfce7' }}>
                                    <FiCheckCircle style={{ ...styles.statIcon, color: '#16a34a' }} />
                                </div>
                                <div style={statContent}>
                                    <span style={styles.statLabel}>Active Now</span>
                                    <strong style={styles.statValue}>{analytics.active}</strong>
                                </div>
                            </div>
                            <div style={styles.statItem}>
                                <div style={{ ...styles.statIconWrapper, background: '#dbeafe' }}>
                                    <FiClock style={{ ...styles.statIcon, color: '#2563eb' }} />
                                </div>
                                <div style={statContent}>
                                    <span style={styles.statLabel}>Upcoming</span>
                                    <strong style={styles.statValue}>{analytics.upcoming}</strong>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Dynamic Content based on Active Tab */}
                    {activeTab === "overview" && (
                        <div style={styles.card}>
                            <div style={styles.tableHeader}>
                                <h3 style={styles.tableTitle}>All Travel Records</h3>
                                <span style={styles.tableBadge}>{filtered.length} records</span>
                            </div>
                            <div style={styles.tableWrap}>
                                <table style={styles.table}>
                                    <thead style={styles.thead}>
                                        <tr>
                                            <th style={styles.th}>Status</th>
                                            <th style={styles.th}>Traveler</th>
                                            <th style={styles.th}>Emp ID</th>
                                            <th style={styles.th}>Email</th>
                                            <th style={styles.th}>Type</th>
                                            <th style={styles.th}>From</th>
                                            <th style={styles.th}>To</th>
                                            <th style={styles.th}>Start Date</th>
                                            <th style={styles.th}>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filtered.length === 0 ? (
                                            <tr>
                                                <td colSpan="9" style={styles.emptyRow}>
                                                    <div style={styles.emptyState}>
                                                        <FiFileText size={32} style={{ color: '#9ca3af', marginBottom: '12px' }} />
                                                        <p>No matching results found</p>
                                                        <p style={styles.emptySubtext}>Upload a file or adjust your filters</p>
                                                    </div>
                                                </td>
                                            </tr>
                                        ) : (
                                            filtered.map((r, i) => (
                                                <tr key={i} style={i % 2 === 0 ? styles.rowEven : styles.rowOdd}>
                                                    <td style={styles.td}>
                                                        {r.active_now ? (
                                                            <div style={styles.activeBadge}>
                                                                <FiCheckCircle size={14} />
                                                                Active
                                                            </div>
                                                        ) : (
                                                            <div style={styles.inactiveBadge}>
                                                                <FiXCircle size={14} />
                                                                Inactive
                                                            </div>
                                                        )}
                                                    </td>
                                                    <td style={styles.td}>
                                                        <div style={styles.userCell}>
                                                            <div style={styles.avatar}>
                                                                <FiUser size={14} />
                                                            </div>
                                                            <span>
                                                                {r.first_name} {r.last_name}
                                                            </span>
                                                        </div>
                                                    </td>
                                                    <td style={styles.td}>
                                                        <div style={styles.userCell}>
                                                            <span style={styles.empId}>
                                                                {r.emp_id || 'N/A'}
                                                            </span>
                                                        </div>
                                                    </td>
                                                    <td style={styles.td}>
                                                        <div style={styles.emailCell}>
                                                            <FiMail size={14} style={{ marginRight: '6px', color: '#6b7280' }} />
                                                            {r.email}
                                                        </div>
                                                    </td>
                                                    <td style={styles.td}>
                                                        <span style={styles.typeBadge}>{r.leg_type}</span>
                                                    </td>
                                                    <td style={styles.td}>
                                                        <div style={styles.combinedLocationCell}>
                                                            <div style={styles.locationRow}>
                                                                <FiMapPin size={12} style={{ marginRight: '4px', color: '#ef4444' }} />
                                                                <span style={styles.locationText}>
                                                                    {r.from_location || 'N/A'}
                                                                </span>
                                                            </div>
                                                            <div style={styles.countryRow}>
                                                                <FiGlobe size={10} style={{ marginRight: '4px', color: '#3b82f6' }} />
                                                                <span style={styles.countryText}>
                                                                    {r.from_country || 'Unknown'}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td style={styles.td}>
                                                        <div style={styles.combinedLocationCell}>
                                                            <div style={styles.locationRow}>
                                                                <FiMapPin size={12} style={{ marginRight: '4px', color: '#10b981' }} />
                                                                <span style={styles.locationText}>
                                                                    {r.to_location || 'N/A'}
                                                                </span>
                                                            </div>
                                                            <div style={styles.countryRow}>
                                                                <FiGlobe size={10} style={{ marginRight: '4px', color: '#3b82f6' }} />
                                                                <span style={styles.countryText}>
                                                                    {r.to_country || 'Unknown'}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td style={styles.td}>
                                                        <div style={styles.dateCell}>
                                                            <FiCalendar size={14} style={{ marginRight: '6px', color: '#6b7280' }} />
                                                            {fmt(r.begin_dt)}
                                                        </div>
                                                    </td>
                                                    <td style={styles.td}>
                                                        <button
                                                            onClick={() => setSelectedTraveler(r)}
                                                            style={styles.viewButton}
                                                        >
                                                            <FiEye size={14} />
                                                            View
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                    {activeTab === "analytics" && (
                        <div style={styles.analyticsGrid}>
                            <div style={styles.analyticsCard}>
                                <h4 style={styles.analyticsTitle}>Travel Analytics</h4>
                                <div style={styles.analyticsStats}>
                                    <div style={styles.analyticsStat}>
                                        <span style={styles.analyticsLabel}>Average Duration</span>
                                        <strong style={styles.analyticsValue}>{analytics.avgDuration} days</strong>
                                    </div>
                                    <div style={styles.analyticsStat}>
                                        <span style={styles.analyticsLabel}>Total Countries</span>
                                        <strong style={styles.analyticsValue}>{analytics.totalCountries}</strong>
                                    </div>
                                    <div style={styles.analyticsStat}>
                                        <span style={styles.analyticsLabel}>Travel Types</span>
                                        <strong style={styles.analyticsValue}>{analytics.totalTypes}</strong>
                                    </div>
                                </div>
                            </div>

                            <div style={styles.analyticsCard}>
                                <h4 style={styles.analyticsTitle}>Country Distribution</h4>
                                <div style={styles.countryChart}>
                                    {countryStats.slice(0, 5).map((stat, index) => (
                                        <div key={stat.country} style={chartBarWrapper}>
                                            <div style={chartBarLabel}>
                                                <span>{stat.country}</span>
                                                <span>{stat.count}</span>
                                            </div>
                                            <div style={styles.chartBarTrack}>
                                                <div
                                                    style={{
                                                        ...styles.chartBarFill,
                                                        width: `${(stat.count / Math.max(...countryStats.map(s => s.count))) * 100}%`
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === "recent" && (
                        <div style={styles.card}>
                            <div style={styles.tableHeader}>
                                <h3 style={styles.tableTitle}>Recent Travels (Last 7 Days)</h3>
                            </div>
                            <div style={styles.tableWrap}>
                                <table style={styles.table}>
                                    <thead style={styles.thead}>
                                        <tr>
                                            <th style={styles.th}>Traveler</th>
                                            <th style={styles.th}>Destination</th>
                                            <th style={styles.th}>Type</th>
                                            <th style={styles.th}>Start Date</th>
                                            <th style={styles.th}>Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {recentTravelers.map((r, i) => (
                                            <tr key={i} style={i % 2 === 0 ? rowEven : rowOdd}>
                                                <td style={styles.td}>
                                                    <div style={styles.userCell}>
                                                        <div style={styles.avatar}>
                                                            <FiUser size={14} />
                                                        </div>
                                                        {r.first_name} {r.last_name}
                                                    </div>
                                                </td>
                                                <td style={styles.td}>{r.to_country}</td>
                                                <td style={styles.td}>
                                                    <span style={styles.typeBadge}>{r.leg_type}</span>
                                                </td>
                                                <td style={styles.td}>{fmt(r.begin_dt)}</td>
                                                <td style={styles.td}>
                                                    {r.active_now ? (
                                                        <div style={styles.activeBadge}>
                                                            <FiCheckCircle size={14} />
                                                            Active
                                                        </div>
                                                    ) : (
                                                        <div style={styles.inactiveBadge}>
                                                            <FiXCircle size={14} />
                                                            Completed
                                                        </div>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {activeTab === "countries" && (
                        <div style={styles.card}>
                            <div style={styles.tableHeader}>
                                <h3 style={styles.tableTitle}>Country-wise Analysis</h3>
                            </div>
                            <div style={styles.tableWrap}>
                                <table style={styles.table}>
                                    <thead style={styles.thead}>
                                        <tr>
                                            <th style={styles.th}>Country</th>
                                            <th style={styles.th}>Total Travels</th>
                                            <th style={styles.th}>Active</th>
                                            <th style={styles.th}>Unique Travelers</th>
                                            <th style={styles.th}>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {countryStats.map((stat, i) => (
                                            <tr key={i} style={i % 2 === 0 ? rowEven : rowOdd}>
                                                <td style={styles.td}>
                                                    <strong>{stat.country}</strong>
                                                </td>
                                                <td style={styles.td}>{stat.count}</td>
                                                <td style={styles.td}>
                                                    <span style={{ color: stat.active > 0 ? '#16a34a' : '#6b7280' }}>
                                                        {stat.active}
                                                    </span>
                                                </td>
                                                <td style={styles.td}>{stat.travelerCount}</td>
                                                <td style={styles.td}>
                                                    <button style={viewButton}>
                                                        <FiEye size={14} />
                                                        Details
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {activeTab === "types" && (
                        <div style={styles.card}>
                            <div style={styles.tableHeader}>
                                <h3 style={styles.tableTitle}>Travel Type Analysis</h3>
                            </div>
                            <div style={styles.tableWrap}>
                                <table style={styles.table}>
                                    <thead style={styles.thead}>
                                        <tr>
                                            <th style={styles.th}>Travel Type</th>
                                            <th style={styles.th}>Total</th>
                                            <th style={styles.th}>Active</th>
                                            <th style={styles.th}>Countries</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {travelTypeStats.map((stat, i) => (
                                            <tr key={i} style={i % 2 === 0 ? rowEven : rowOdd}>
                                                <td style={styles.td}>
                                                    <strong>{stat.type}</strong>
                                                </td>
                                                <td style={styles.td}>{stat.count}</td>
                                                <td style={styles.td}>
                                                    <span style={{ color: stat.active > 0 ? '#16a34a' : '#6b7280' }}>
                                                        {stat.active}
                                                    </span>
                                                </td>
                                                <td style={styles.td}>{stat.countryCount}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </main>
            </div>
        </div>
