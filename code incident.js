/**
 * =========================================================
 * IncidentList.jsx
 * =========================================================
 *
 * Corporate-grade Incident List & Viewer
 *
 * Features:
 *  - Responsive table (desktop) + cards (mobile)
 *  - Search, pagination, sorting-ready
 *  - Role-based UI (viewer / editor / admin)
 *  - CSV export (editor/admin)
 *  - Proof file viewer
 *  - Detailed modal view
 *
 * Backend:
 *  - GET /incident/list
 *  - Static files served from /uploads/
 *
 * Demo Role Control:
 *  localStorage.setItem("role", "viewer" | "editor" | "admin")
 *
 * =========================================================
 */

import React, { useEffect, useMemo, useState } from "react";

/* ------------------------------------------------------------------ */
/* Configuration */
/* ------------------------------------------------------------------ */

const API_BASE =
  process.env.REACT_APP_API_URL || "http://localhost:8000";

/* ------------------------------------------------------------------ */
/* Utility helpers */
/* ------------------------------------------------------------------ */

const getRole = () => localStorage.getItem("role") || "viewer";

const formatDateTime = (value) => {
  if (!value) return "-";
  try {
    return new Date(value).toLocaleString();
  } catch {
    return value;
  }
};

const downloadCSV = (filename, content) => {
  const blob = new Blob([content], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
};

const incidentsToCSV = (incidents) => {
  const headers = [
    "id",
    "type_of_incident",
    "impacted_name",
    "reported_by_name",
    "location",
    "date_of_incident",
    "created_at",
  ];

  const rows = incidents.map((i) =>
    headers
      .map((h) => `"${(i[h] ?? "").toString().replace(/"/g, '""')}"`)
      .join(",")
  );

  return [headers.join(","), ...rows].join("\n");
};

/* ------------------------------------------------------------------ */
/* Reusable components */
/* ------------------------------------------------------------------ */

const DetailRow = ({ label, value }) => (
  <div className="detail-row">
    <div className="detail-label">{label}</div>
    <div className="detail-value">{value ?? "-"}</div>
  </div>
);

const RoleSwitcher = () => {
  const [role, setRole] = useState(getRole());

  const onChange = (e) => {
    localStorage.setItem("role", e.target.value);
    setRole(e.target.value);
    window.location.reload();
  };

  return (
    <select value={role} onChange={onChange} className="input">
      <option value="viewer">Viewer</option>
      <option value="editor">Editor</option>
      <option value="admin">Admin</option>
    </select>
  );
};

/* ------------------------------------------------------------------ */
/* Main Component */
/* ------------------------------------------------------------------ */

export default function IncidentList() {
  const role = getRole();

  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 10;

  /* ---------------- Fetch ---------------- */

  useEffect(() => {
    fetchIncidents();
  }, []);

  const fetchIncidents = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/incident/list`);
      const data = await res.json();
      setIncidents(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to fetch incidents", err);
      setIncidents([]);
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- Search & Pagination ---------------- */

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

  const totalPages = Math.ceil(filtered.length / pageSize);
  const pageData = filtered.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  /* ---------------- Actions ---------------- */

  const exportCSV = () => {
    if (!["editor", "admin"].includes(role)) return;
    const csv = incidentsToCSV(filtered);
    downloadCSV(`incidents_${Date.now()}.csv`, csv);
  };

  const openProof = (file) =>
    window.open(`${API_BASE}/uploads/${file}`, "_blank");

  /* ---------------- Render ---------------- */

  return (
    <div className="container">
      <header className="header">
        <h1>Incident List</h1>
        <p className="subtitle">
          Corporate incident reporting overview — Role: <b>{role}</b>
        </p>
      </header>

      <div className="toolbar">
        <input
          className="input"
          placeholder="Search incidents..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
        />

        <button className="btn" onClick={fetchIncidents}>
          Refresh
        </button>

        <button
          className="btn primary"
          disabled={!["editor", "admin"].includes(role)}
          onClick={exportCSV}
        >
          Export CSV
        </button>

        <RoleSwitcher />
      </div>

      {loading ? (
        <div className="loading">Loading incidents…</div>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Type</th>
              <th>Impacted</th>
              <th>Reported By</th>
              <th>Date</th>
              <th>Location</th>
              <th>Proofs</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {pageData.map((row) => (
              <tr key={row.id}>
                <td>#{row.id}</td>
                <td>{row.type_of_incident}</td>
                <td>{row.impacted_name}</td>
                <td>{row.reported_by_name}</td>
                <td>{row.date_of_incident}</td>
                <td>{row.location}</td>
                <td>
                  {row.proofs?.map((p, i) => (
                    <button
                      key={i}
                      className="link"
                      onClick={() => openProof(p)}
                    >
                      View
                    </button>
                  ))}
                </td>
                <td>
                  <button
                    className="btn small"
                    onClick={() => setSelected(row)}
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
            {pageData.length === 0 && (
              <tr>
                <td colSpan="8" className="empty">
                  No incidents found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}

      {/* ---------------- Modal ---------------- */}
      {selected && (
        <div className="modal">
          <div className="modal-card">
            <h2>
              Incident #{selected.id} — {selected.type_of_incident}
            </h2>

            <DetailRow label="Reported On" value={formatDateTime(selected.created_at)} />
            <DetailRow label="Location" value={selected.location} />
            <DetailRow label="Impacted" value={selected.impacted_name} />
            <DetailRow label="Description" value={selected.detailed_description} />

            <div className="modal-actions">
              <button className="btn" onClick={() => setSelected(null)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}