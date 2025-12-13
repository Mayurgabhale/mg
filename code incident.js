import React, { useEffect, useMemo, useState } from "react";

/**

IncidentListPage

Responsive, corporate-ready incident list and detail viewer


Role-based UI (viewer / editor / admin) controlled by localStorage for demo


Features: search, sort, pagination, export CSV, download proofs, responsive design


Integration:

Place this file under src/components/IncidentList.jsx


Add a route in App.jsx: <Route path="/incidentList" element={<IncidentListPage/>} />


Ensure backend serves uploads at: http://localhost:8000/uploads/<filename>


Notes:

Uses minimal inline styles + Tailwind-friendly classnames. If you use Tailwind, the UI will look better.


Role demo: run localStorage.setItem('role', 'viewer') or 'editor' or 'admin' to see different capabilities. */



const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:8000";

function formatDate(d) { if (!d) return "-"; try { return new Date(d).toLocaleString(); } catch { return d; } }

function csvDownload(filename, text) { const blob = new Blob([text], { type: "text/csv;charset=utf-8;" }); const url = URL.createObjectURL(blob); const a = document.createElement("a"); a.href = url; a.download = filename; document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url); }

function incidentToCsvRows(list) { const header = [ "id", "type_of_incident", "date_of_report", "time_of_report", "impacted_name", "impacted_employee_id", "reported_by_name", "reported_by_email", "location", "date_of_incident", "time_of_incident", "created_at" ]; const rows = list.map(i => (header.map(h => { const v = i[h]; if (Array.isArray(v)) return "${ v.join(';') }"; if (v == null) return ""; return "${String(v).replace(/"/g, '""')}"; })).join(',')); return [header.join(','), ...rows].join('\n'); }

function getRole() { // Demo mechanism: read role from localStorage. In production, replace with actual auth context. return localStorage.getItem("role") || "viewer"; }

export default function IncidentListPage() { const [incidents, setIncidents] = useState([]); const [loading, setLoading] = useState(false); const [selected, setSelected] = useState(null); const [search, setSearch] = useState(""); const [page, setPage] = useState(1); const [pageSize, setPageSize] = useState(10); const [sortBy, setSortBy] = useState({ key: "created_at", dir: "desc" }); const [error, setError] = useState(null);

const role = getRole();

useEffect(() => { fetchIncidents(); // eslint-disable-next-line react-hooks/exhaustive-deps }, []);

const fetchIncidents = async () => { setLoading(true); setError(null); try { const res = await fetch(${API_BASE}/incident/list); if (!res.ok) throw new Error(Server responded ${res.status}); const json = await res.json(); setIncidents(Array.isArray(json) ? json : []); } catch (e) { console.error("Failed to fetch incidents", e); setError("Failed to load incidents — check server or network."); setIncidents([]); } finally { setLoading(false); } };

// filtered + sorted list const processed = useMemo(() => { const s = (search || "").trim().toLowerCase(); let arr = incidents; if (s) { arr = arr.filter(it => ( (it.type_of_incident || "").toLowerCase().includes(s) || (it.impacted_name || "").toLowerCase().includes(s) || (it.reported_by_name || "").toLowerCase().includes(s) || (it.location || "").toLowerCase().includes(s) || (String(it.id) || "").toLowerCase().includes(s) )); }

// sort
arr = [...arr].sort((a, b) => {
  const k = sortBy.key;
  const av = a[k] || "";
  const bv = b[k] || "";
  if (sortBy.dir === "asc") return av > bv ? 1 : av < bv ? -1 : 0;
  return av < bv ? 1 : av > bv ? -1 : 0;
});

return arr;

}, [incidents, search, sortBy]);

const total = processed.length; const totalPages = Math.max(1, Math.ceil(total / pageSize)); const pageData = processed.slice((page - 1) * pageSize, page * pageSize);

useEffect(() => { if (page > totalPages) setPage(1); }, [totalPages]);

const onExportCsv = () => { if (!['editor', 'admin'].includes(role)) return alert('You do not have permission to export.'); const csv = incidentToCsvRows(processed); csvDownload(incidents_${new Date().toISOString().slice(0,10)}.csv, csv); };

const handleViewProof = (filename) => { const url = ${API_BASE}/uploads/${filename}; window.open(url, '_blank'); };

// helper to pretty render incident details in modal const DetailRow = ({ label, value }) => ( <div className="detail-row"> <div className="detail-label">{label}</div> <div className="detail-value">{value ?? '-'}</div> </div> );

return ( <div className="container mx-auto p-4 max-w-6xl"> <div className="header flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4"> <div> <h1 className="text-2xl font-semibold">Incident List</h1> <p className="text-sm text-gray-600">A corporate-grade list of reported incidents. Role: <strong>{role}</strong></p> </div>

<div className="controls flex items-center gap-2">
      <input
        className="border rounded px-3 py-2 w-64"
        placeholder="Search by ID, type, impacted, reporter, location"
        value={search}
        onChange={e => { setSearch(e.target.value); setPage(1); }}
      />

      <select className="border rounded px-2 py-2" value={pageSize} onChange={e => setPageSize(Number(e.target.value))}>
        <option value={5}>5 / page</option>
        <option value={10}>10 / page</option>
        <option value={25}>25 / page</option>
        <option value={50}>50 / page</option>
      </select>

      <button className="btn" onClick={fetchIncidents} aria-label="Refresh">Refresh</button>
      <button className="btn primary" onClick={onExportCsv} disabled={!['editor','admin'].includes(role)}>Export CSV</button>

      {/* Role switcher only for demo */}
      <RoleSwitcher onChange={() => window.location.reload()} />
    </div>
  </div>

  {loading ? (
    <div className="p-8 text-center">Loading incidents…</div>
  ) : error ? (
    <div className="p-4 bg-red-50 text-red-700 rounded">{error}</div>
  ) : (
    <div className="bg-white rounded shadow overflow-hidden">

      {/* Table for md+ screens */}
      <div className="hidden md:block">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-3">ID</th>
              <th className="px-4 py-3">Type</th>
              <th className="px-4 py-3">Impacted</th>
              <th className="px-4 py-3">Reported By</th>
              <th className="px-4 py-3">Date of Incident</th>
              <th className="px-4 py-3">Location</th>
              <th className="px-4 py-3">Proofs</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {pageData.map(row => (
              <tr key={row.id} className="border-t hover:bg-gray-50">
                <td className="px-4 py-3 align-top">#{row.id}</td>
                <td className="px-4 py-3 align-top">{row.type_of_incident}{row.other_type_text ? ` — ${row.other_type_text}` : ''}</td>
                <td className="px-4 py-3 align-top">{row.impacted_name}</td>
                <td className="px-4 py-3 align-top">{row.reported_by_name}<div className="text-xs text-gray-500">{row.reported_by_email}</div></td>
                <td className="px-4 py-3 align-top">{row.date_of_incident}</td>
                <td className="px-4 py-3 align-top">{row.location}</td>
                <td className="px-4 py-3 align-top">
                  {Array.isArray(row.proofs) && row.proofs.length > 0 ? (
                    row.proofs.map((p, i) => (
                      <div key={i}>
                        <button className="link" onClick={() => handleViewProof(p)}>{p}</button>
                      </div>
                    ))
                  ) : <span className="text-gray-400">—</span>}
                </td>
                <td className="px-4 py-3 align-top">
                  <div className="flex gap-2">
                    <button className="btn small" onClick={() => setSelected(row)}>View</button>
                    {['editor','admin'].includes(role) && <button className="btn small" onClick={() => { navigator.clipboard.writeText(window.location.origin + `/incidents/${row.id}`); alert('Incident link copied'); }}>Copy link</button>}
                    {role === 'admin' && <button className="btn small danger" onClick={() => { if (!confirm('Delete incident? This action requires backend support.')) return; alert('Backend delete not implemented'); }}>Delete</button>}
                  </div>
                </td>
              </tr>
            ))}

            {pageData.length === 0 && (
              <tr><td colSpan={8} className="px-4 py-6 text-center text-gray-600">No incidents found</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Cards for small screens */}
      <div className="md:hidden grid gap-3 p-3">
        {pageData.map(row => (
          <div key={row.id} className="card border rounded p-3">
            <div className="flex justify-between items-start gap-2">
              <div>
                <div className="text-sm text-gray-500">#{row.id} • {row.type_of_incident}</div>
                <div className="font-medium">{row.impacted_name}</div>
                <div className="text-xs text-gray-500">{row.reported_by_name} • {row.location}</div>
              </div>
              <div className="flex flex-col gap-2">
                <button className="btn small" onClick={() => setSelected(row)}>View</button>
                {['editor','admin'].includes(role) && <button className="btn tiny" onClick={() => handleViewProof((row.proofs || [])[0])}>Open proof</button>}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="p-3 flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="text-sm text-gray-600">Showing {Math.min((page-1)*pageSize+1, total)}–{Math.min(page*pageSize, total)} of {total}</div>
        <div className="flex items-center gap-2">
          <button className="btn" onClick={() => setPage(1)} disabled={page===1}>First</button>
          <button className="btn" onClick={() => setPage(p => Math.max(1, p-1))} disabled={page===1}>Prev</button>
          <span className="px-3">Page</span>
          <input value={page} onChange={e => setPage(Math.max(1, Math.min(totalPages, Number(e.target.value || 1))))} className="w-12 text-center border rounded" />
          <span>of {totalPages}</span>
          <button className="btn" onClick={() => setPage(p => Math.min(totalPages, p+1))} disabled={page===totalPages}>Next</button>
          <button className="btn" onClick={() => setPage(totalPages)} disabled={page===totalPages}>Last</button>
        </div>
      </div>

    </div>
  )}

  {/* Details modal */}
  {selected && (
    <div className="modal fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center p-4">
      <div className="modal-card bg-white rounded shadow max-w-3xl w-full overflow-auto max-h-[90vh]">
        <div className="p-4 border-b flex items-start justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold">Incident #{selected.id} — {selected.type_of_incident}</h2>
            <div className="text-sm text-gray-500">Reported: {formatDate(selected.created_at)}</div>
          </div>
          <div className="flex gap-2">
            <button className="btn" onClick={() => { navigator.clipboard.writeText(JSON.stringify(selected)); alert('Incident JSON copied'); }}>Copy JSON</button>
            <button className="btn" onClick={() => setSelected(null)}>Close</button>
          </div>
        </div>

        <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <DetailRow label="Type" value={`${selected.type_of_incident}${selected.other_type_text ? ` — ${selected.other_type_text}` : ''}`} />
            <DetailRow label="Date of Report" value={`${selected.date_of_report} ${selected.time_of_report || ''}`} />
            <DetailRow label="Date of Incident" value={`${selected.date_of_incident} ${selected.time_of_incident || ''}`} />
            <DetailRow label="Location" value={selected.location} />
            <DetailRow label="Impacted" value={`${selected.impacted_name} (${selected.impacted_employee_id})`} />
            <DetailRow label="Reported by" value={`${selected.reported_by_name} — ${selected.reported_by_email} — ${selected.reported_by_contact}`} />

            <div className="mt-3">
              <div className="text-sm text-gray-600 mb-1">Accompanying Persons</div>
              {Array.isArray(selected.accompanying_person) && selected.accompanying_person.length > 0 ? (
                <ul className="list-disc ml-5">
                  {selected.accompanying_person.map((p, idx) => (
                    <li key={idx}>{p.name} — {p.contact}</li>
                  ))}
                </ul>
              ) : <div className="text-gray-500">None</div>}
            </div>

            <div className="mt-3">
              <div className="text-sm text-gray-600 mb-1">Witnesses</div>
              {Array.isArray(selected.witnesses) && selected.witnesses.length > 0 ? (
                <ul className="list-disc ml-5">
                  {selected.witnesses.map((w, idx) => (
                    <li key={idx}>{w} — {selected.witness_contacts?.[idx] || '-'}</li>
                  ))}
                </ul>
              ) : <div className="text-gray-500">None</div>}
            </div>
          </div>

          <div>
            <div>
              <div className="text-sm text-gray-600 mb-1">Description</div>
              <div className="whitespace-pre-wrap text-sm bg-gray-50 p-3 rounded">{selected.detailed_description}</div>
            </div>

            <div className="mt-3">
              <div className="text-sm text-gray-600 mb-1">Immediate Actions</div>
              <div className="whitespace-pre-wrap text-sm bg-gray-50 p-3 rounded">{selected.immediate_actions_taken}</div>
            </div>

            <div className="mt-3">
              <div className="text-sm text-gray-600 mb-1">Proofs</div>
              {Array.isArray(selected.proofs) && selected.proofs.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {selected.proofs.map((p, i) => (
                    <button key={i} className="btn" onClick={() => handleViewProof(p)}>{p}</button>
                  ))}
                </div>
              ) : <div className="text-gray-500">None</div>}
            </div>

            <div className="mt-3">
              <div className="text-sm text-gray-600 mb-1">Root cause analysis</div>
              <div className="whitespace-pre-wrap text-sm bg-gray-50 p-3 rounded">{selected.root_cause_analysis || '-'}</div>
            </div>

            <div className="mt-3">
              <div className="text-sm text-gray-600 mb-1">Preventive actions</div>
              <div className="whitespace-pre-wrap text-sm bg-gray-50 p-3 rounded">{selected.preventive_actions || '-'}</div>
            </div>
          </div>
        </div>

        <div className="p-4 border-t flex justify-end gap-2">
          {['editor','admin'].includes(role) && <button className="btn" onClick={() => { alert('Edit flow not implemented in demo.'); }}>Edit</button>}
          {role === 'admin' && <button className="btn danger" onClick={() => { if (!confirm('Delete incident? Backend required.')) return; alert('Delete requires backend endpoint.'); }}>Delete</button>}
          <button className="btn" onClick={() => setSelected(null)}>Close</button>
        </div>
      </div>
    </div>
  )}

  {/* Minimal styles (you can move to your CSS file) */}
  <style jsx>{`
    .btn{ background:#f3f4f6; border:1px solid #e5e7eb; padding:6px 10px; border-radius:6px; cursor:pointer }
    .btn.primary{ background:#0f172a; color:#fff }
    .btn.small{ padding:6px 8px; font-size:13px }
    .btn.tiny{ padding:4px 6px; font-size:12px }
    .btn.danger{ background:#fee2e2; border-color:#fca5a5 }
    .link{ color:#0369a1; text-decoration:underline; background:none; border:none; padding:0; cursor:pointer }
    .detail-row{ display:flex; gap:12px; margin-bottom:8px }
    .detail-label{ width:140px; color:#374151; font-weight:600 }
    .detail-value{ color:#111827 }
    .modal{ }
    .modal-card{ }
  `}</style>
</div>

); }

function RoleSwitcher({ onChange }){ const [r, setR] = useState(getRole()); const setRoleLocal = (v) => { localStorage.setItem('role', v); setR(v); if (typeof onChange === 'function') onChange(); }; return ( <select value={r} onChange={e => setRoleLocal(e.target.value)} className="border rounded px-2 py-2"> <option value="viewer">Viewer (read-only)</option> <option value="editor">Editor (export/copy)</option> <option value="admin">Admin (all actions)</option> </select> ); }