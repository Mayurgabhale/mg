ok. good,
  but i want this in propar format,
wiht full screen,  and alos responsive, 
wiht more future, or count 
and and propar dasbhoard, 
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

