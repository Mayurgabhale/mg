import React, { useEffect, useMemo, useState } from "react";

/**
 * ==========================================================
 * IncidentListPage
 * ==========================================================
 *
 * Responsive, corporate-ready incident list and detail viewer.
 *
 * Role-based UI:
 *  - viewer : Read-only access
 *  - editor : Export / copy actions
 *  - admin  : Full access (demo only)
 *
 * Features:
 *  - Search, sort, pagination
 *  - CSV export
 *  - Proof file download / view
 *  - Responsive table (desktop) + cards (mobile)
 *
 * Integration:
 *  - File location:
 *      src/components/IncidentList.jsx
 *
 *  - Route:
 *      <Route path="/incidentList" element={<IncidentListPage />} />
 *
 *  - Backend:
 *      GET  http://localhost:8000/incident/list
 *      FILE http://localhost:8000/uploads/<filename>
 *
 * Demo Role Switch:
 *  localStorage.setItem("role", "viewer" | "editor" | "admin")
 *
 * ==========================================================
 */

const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:8000";

/* -------------------- Utilities -------------------- */

function formatDate(value) {
  if (!value) return "-";
  try {
    return new Date(value).toLocaleString();
  } catch {
    return value;
  }
}

function getRole() {
  return localStorage.getItem("role") || "viewer";
}

function downloadCSV(filename, content) {
  const blob = new Blob([content], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function incidentToCsvRows(list) {
  const headers = [
    "id",
    "type_of_incident",
    "date_of_report",
    "time_of_report",
    "impacted_name",
    "impacted_employee_id",
    "reported_by_name",
    "reported_by_email",
    "location",
    "date_of_incident",
    "time_of_incident",
    "created_at",
  ];

  const rows = list.map((i) =>
    headers
      .map((h) => `"${String(i[h] ?? "").replace(/"/g, '""')}"`)
      .join(",")
  );

  return [headers.join(","), ...rows].join("\n");
}

/* -------------------- Sub Components -------------------- */

const DetailRow = ({ label, value }) => (
  <div className="detail-row">
    <div className="detail-label">{label}</div>
    <div className="detail-value">{value ?? "-"}</div>
  </div>
);

const RoleSwitcher = () => {
  const [role, setRole] = useState(getRole());

  const changeRole = (e) => {
    localStorage.setItem("role", e.target.value);
    setRole(e.target.value);
    window.location.reload();
  };

  return (
    <select value={role} onChange={changeRole} className="border rounded px-2 py-2">
      <option value="viewer">Viewer</option>
      <option value="editor">Editor</option>
      <option value="admin">Admin</option>
    </select>
  );
};

/* -------------------- Main Component -------------------- */

export default function IncidentListPage() {
  const role = getRole();

  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [error, setError] = useState(null);

  const pageSize = 10;

  /* ---------------- Fetch ---------------- */

  useEffect(() => {
    fetchIncidents();
  }, []);

  const fetchIncidents = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/incident/list`);
      if (!res.ok) throw new Error("Server error");
      const data = await res.json();
      setIncidents(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setError("Failed to load incidents");
      setIncidents([]);
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- Search + Pagination ---------------- */

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return incidents.filter(
      (i) =>
        i.type_of_incident?.toLowerCase().includes(q) ||
        i.impacted_name?.toLowerCase().includes(q) ||
        i.reported_by_name?.toLowerCase().includes(q) ||
        i.location?.toLowerCase().includes(q) ||
        String(i.id).includes(q)
    );
  }, [incidents, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const pageData = filtered.slice((page - 1) * pageSize, page * pageSize);

  useEffect(() => {
    if (page > totalPages) setPage(1);
  }, [totalPages]);

  /* ---------------- Actions ---------------- */

  const exportCSV = () => {
    if (!["editor", "admin"].includes(role)) return;
    const csv = incidentToCsvRows(filtered);
    downloadCSV(`incidents_${Date.now()}.csv`, csv);
  };

  const openProof = (file) => {
    window.open(`${API_BASE}/uploads/${file}`, "_blank");
  };

  /* ---------------- Render ---------------- */

  return (
    <div className="container mx-auto p-4 max-w-6xl">
      <h1 className="text-2xl font-semibold mb-1">Incident List</h1>
      <p className="text-sm text-gray-600 mb-4">
        Corporate incident dashboard — Role: <b>{role}</b>
      </p>

      <div className="flex gap-2 mb-4 flex-wrap">
        <input
          className="border rounded px-3 py-2 w-64"
          placeholder="Search incidents..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
        />
        <button className="btn" onClick={fetchIncidents}>Refresh</button>
        <button
          className="btn primary"
          onClick={exportCSV}
          disabled={!["editor", "admin"].includes(role)}
        >
          Export CSV
        </button>
        <RoleSwitcher />
      </div>

      {loading ? (
        <div>Loading…</div>
      ) : error ? (
        <div className="text-red-600">{error}</div>
      ) : (
        <table className="w-full border-collapse bg-white shadow">
          <thead className="bg-gray-100">
            <tr>
              <th>ID</th>
              <th>Type</th>
              <th>Impacted</th>
              <th>Reported By</th>
              <th>Date</th>
              <th>Location</th>
              <th>Proofs</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {pageData.map((row) => (
              <tr key={row.id} className="border-t">
                <td>#{row.id}</td>
                <td>{row.type_of_incident}</td>
                <td>{row.impacted_name}</td>
                <td>{row.reported_by_name}</td>
                <td>{row.date_of_incident}</td>
                <td>{row.location}</td>
                <td>
                  {row.proofs?.map((p, i) => (
                    <button key={i} className="link" onClick={() => openProof(p)}>
                      View
                    </button>
                  ))}
                </td>
                <td>
                  <button className="btn small" onClick={() => setSelected(row)}>
                    View
                  </button>
                </td>
              </tr>
            ))}
            {pageData.length === 0 && (
              <tr>
                <td colSpan="8" className="text-center p-4">
                  No incidents found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}

      {/* ---------------- Modal ---------------- */}
      {selected && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center p-4">
          <div className="bg-white rounded shadow p-4 max-w-3xl w-full">
            <h2 className="text-lg font-semibold mb-2">
              Incident #{selected.id}
            </h2>

            <DetailRow label="Type" value={selected.type_of_incident} />
            <DetailRow label="Location" value={selected.location} />
            <DetailRow label="Reported On" value={formatDate(selected.created_at)} />
            <DetailRow label="Description" value={selected.detailed_description} />

            <div className="text-right mt-4">
              <button className="btn" onClick={() => setSelected(null)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .btn { background:#f3f4f6; border:1px solid #e5e7eb; padding:6px 10px; border-radius:6px }
        .btn.primary { background:#0f172a; color:#fff }
        .btn.small { font-size:13px }
        .link { color:#0369a1; text-decoration:underline; background:none; border:none }
        .detail-row { display:flex; gap:12px; margin-bottom:6px }
        .detail-label { width:140px; font-weight:600 }
      `}</style>
    </div>
  );
}