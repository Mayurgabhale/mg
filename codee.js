import React, { useEffect, useMemo, useState } from "react"; import axios from "axios"; import { Dialog, Tab } from "@headlessui/react"; import { ToastContainer, toast } from "react-toastify"; import "react-toastify/dist/ReactToastify.css"; import { FiGlobe, FiUsers, FiMapPin, FiFileText, FiUpload, FiFilter, FiSearch, FiDownload, FiTrash2, FiCheckCircle, FiXCircle, FiCalendar, FiMail, FiUser, FiAward, FiActivity, FiChevronLeft, FiChevronRight, } from "react-icons/fi";

// Recharts import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell, LineChart, Line, CartesianGrid, } from "recharts";

/* Upgraded EmployeeTravelDashboard

Tailwind-based responsive layout

Tabs for multiple sections (Overview, Insights, Records)

Charts (country bar, type pie, trendline)

Clickable table rows open a modal with details

File upload (existing logic) + CSV export

Filters, search, pagination, today & upcoming sections


Usage:

Install dependencies: axios, react-toastify, react-icons, recharts, @headlessui/react

Ensure Tailwind CSS is configured in your project

Replace your existing file with this component or adapt pieces */


const fmt = (iso) => { if (!iso) return ""; try { const d = new Date(iso); return d.toLocaleString(); } catch { return String(iso); } };

const normalizeDate = (d) => { const dt = new Date(d); dt.setHours(0, 0, 0, 0); return dt; };

export default function EmployeeTravelDashboard() { const [file, setFile] = useState(null); const [items, setItems] = useState([]); const [summary, setSummary] = useState({}); const [loading, setLoading] = useState(false);

// UI state const [filters, setFilters] = useState({ search: "", country: "", type: "", dateFrom: "", dateTo: "" }); const [selectedTraveler, setSelectedTraveler] = useState(null); const [page, setPage] = useState(1); const [pageSize, setPageSize] = useState(12);

// Load saved data on mount useEffect(() => { const loadPreviousData = async () => { try { const res = await axios.get("http://localhost:8000/data"); const payload = res.data || {}; const rows = payload.items || []; setItems(rows); setSummary(payload.summary || {}); if (rows.length > 0) toast.info(Loaded ${rows.length} saved records); } catch (err) { // silently ignore if backend not available console.log("No saved data found or backend unreachable"); } }; loadPreviousData(); }, []);

const handleFileChange = (e) => setFile(e.target.files?.[0] ?? null);

const uploadFile = async () => { if (!file) return toast.warn("Please select an Excel or CSV file first."); setLoading(true); try { const formData = new FormData(); formData.append("file", file); const res = await axios.post("http://localhost:8000/upload", formData, { headers: { "Content-Type": "multipart/form-data" }, }); const payload = res.data || {}; const rows = payload.items || []; setItems(rows); setSummary(payload.summary || {}); toast.success(Uploaded successfully. ${rows.length} records found.); } catch (err) { console.error(err); toast.error("Upload failed. Please check backend or file format."); } finally { setLoading(false); } };

const safeItems = Array.isArray(items) ? items : [];

// Derived lists const countries = useMemo(() => [...new Set(safeItems.map((r) => r.from_country).filter(Boolean))], [safeItems]); const legTypes = useMemo(() => [...new Set(safeItems.map((r) => r.leg_type).filter(Boolean))], [safeItems]);

// Today and upcoming const today = new Date(); today.setHours(0, 0, 0, 0);

const todayTravelers = useMemo(() => { return safeItems.filter((r) => { if (!r.begin_dt) return false; const start = normalizeDate(r.begin_dt); return start.getTime() === today.getTime(); }); }, [safeItems]);

const upcomingTravelers = useMemo(() => { return safeItems.filter((r) => { if (!r.begin_dt) return false; const start = normalizeDate(r.begin_dt); return start.getTime() > today.getTime(); }).slice(0, 6); }, [safeItems]);

// Filtered & sorted records const filtered = useMemo(() => { return safeItems .filter((r) => { const s = filters.search.toLowerCase(); if (s) { const hay = ${r.first_name ?? ""} ${r.last_name ?? ""} ${r.email ?? ""}.toLowerCase(); if (!hay.includes(s)) return false; } if (filters.country && r.from_country !== filters.country) return false; if (filters.type && r.leg_type !== filters.type) return false; if (filters.dateFrom) { const from = normalizeDate(filters.dateFrom); if (!r.begin_dt) return false; if (normalizeDate(r.begin_dt) < from) return false; } if (filters.dateTo) { const to = normalizeDate(filters.dateTo); if (!r.end_dt) return false; if (normalizeDate(r.end_dt) > to) return false; } return true; }) .sort((a, b) => (b.active_now === true ? 1 : 0) - (a.active_now === true ? 1 : 0)); }, [safeItems, filters]);

// Country stats for charts const countryStats = useMemo(() => { const map = {}; for (const r of safeItems) { const c = r.from_country || "Unknown"; map[c] = (map[c] || 0) + 1; } return Object.entries(map).map(([country, count]) => ({ country, count })).sort((a, b) => b.count - a.count); }, [safeItems]);

const typeStats = useMemo(() => { const map = {}; for (const r of safeItems) { const t = r.leg_type || "Unknown"; map[t] = (map[t] || 0) + 1; } return Object.entries(map).map(([type, count]) => ({ type, count })); }, [safeItems]);

const trendData = useMemo(() => { // simple monthly bucket of trips by begin_dt const map = {}; for (const r of safeItems) { if (!r.begin_dt) continue; const d = new Date(r.begin_dt); const key = ${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}; map[key] = (map[key] || 0) + 1; } return Object.entries(map) .map(([k, v]) => ({ month: k, trips: v })) .sort((a, b) => (a.month > b.month ? 1 : -1)); }, [safeItems]);

// Export CSV const exportCsv = () => { if (!filtered.length) return toast.info("No data to export."); const keys = Object.keys(filtered[0]); const csv = [keys.join(",")]; filtered.forEach((r) => csv.push(keys.map((k) => "${String(r[k] ?? "").replace(/"/g, '""')}").join(","))); const blob = new Blob([csv.join("\n")], { type: "text/csv" }); const url = URL.createObjectURL(blob); const a = document.createElement("a"); a.href = url; a.download = "EmployeeTravelData.csv"; a.click(); URL.revokeObjectURL(url); toast.success("CSV exported successfully."); };

// Pagination helpers const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize)); const pageSlice = filtered.slice((page - 1) * pageSize, page * pageSize);

// Colors for pie const COLORS = ["#60a5fa", "#34d399", "#fbbf24", "#f87171", "#a78bfa", "#fb7185"];

return ( <div className="min-h-screen bg-gray-50 p-6"> <ToastContainer />

{/* Header */}
  <header className="flex items-center justify-between mb-6">
    <div className="flex items-center gap-3">
      <div className="bg-white p-3 rounded-lg shadow"><FiGlobe size={22} /></div>
      <div>
        <h1 className="text-2xl font-semibold text-gray-800">Employee Travel Dashboard</h1>
        <p className="text-sm text-gray-500">Insights, trends and quick actions — click rows to view details</p>
      </div>
    </div>

    <div className="flex items-center gap-3">
      <label className="text-sm text-gray-600">Upload</label>
      <input id="file-upload" type="file" accept=".xlsx,.xls,.csv" onChange={handleFileChange} className="hidden" />
      <label htmlFor="file-upload" className="inline-flex items-center gap-2 bg-white px-3 py-2 rounded-lg shadow cursor-pointer">
        <FiUpload /> <span className="text-sm">{file ? file.name : "Choose file"}</span>
      </label>

      <button onClick={uploadFile} disabled={loading} className="bg-blue-600 text-white px-3 py-2 rounded-lg shadow-sm">
        {loading ? "Processing..." : "Upload"}
      </button>

      <button onClick={() => { setItems([]); setSummary({}); setFile(null); toast.info("Data cleared."); }} className="bg-white border px-3 py-2 rounded-lg">
        <FiTrash2 />
      </button>
    </div>
  </header>

  <div className="grid grid-cols-12 gap-6">
    {/* LEFT COLUMN - Sidebar */}
    <aside className="col-span-3">
      <div className="space-y-4 sticky top-6">
        {/* Overview Card */}
        <div className="bg-white p-4 rounded-2xl shadow">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">Overview</h3>
            <FiActivity />
          </div>
          <div className="grid grid-cols-2 gap-3 mt-4">
            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-xs text-gray-500">Total Travelers</p>
              <p className="font-semibold text-lg">{safeItems.length}</p>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-xs text-gray-500">Active Now</p>
              <p className="font-semibold text-lg">{safeItems.filter((r) => r.active_now).length}</p>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-xs text-gray-500">Countries</p>
              <p className="font-semibold text-lg">{countries.length}</p>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-xs text-gray-500">Travel Types</p>
              <p className="font-semibold text-lg">{legTypes.length}</p>
            </div>
          </div>
        </div>

        {/* Today's Travelers */}
        <div className="bg-white p-4 rounded-2xl shadow">
          <div className="flex items-center justify-between">
            <h4 className="font-semibold">Today's Travelers</h4>
            <span className="text-sm text-gray-400">{today.toLocaleDateString()}</span>
          </div>
          <div className="mt-3 space-y-2">
            {todayTravelers.length === 0 ? (
              <div className="text-sm text-gray-500 flex items-center gap-2"><FiFileText />No one starts today</div>
            ) : (
              todayTravelers.slice(0, 6).map((t, i) => (
                <button key={i} onClick={() => setSelectedTraveler(t)} className="w-full text-left rounded-lg px-3 py-2 hover:bg-gray-50 flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium">{t.first_name} {t.last_name}</div>
                    <div className="text-xs text-gray-400">{t.from_country} → {t.to_country}</div>
                  </div>
                  <div className="text-xs text-gray-400">{new Date(t.begin_dt).toLocaleDateString()}</div>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Upcoming Trips */}
        <div className="bg-white p-4 rounded-2xl shadow">
          <h4 className="font-semibold">Upcoming Trips</h4>
          <div className="mt-3 space-y-2">
            {upcomingTravelers.length === 0 ? (
              <div className="text-sm text-gray-500">No upcoming trips</div>
            ) : (
              upcomingTravelers.map((t, i) => (
                <div key={i} className="flex items-center justify-between text-sm">
                  <div>
                    <div className="font-medium">{t.first_name} {t.last_name}</div>
                    <div className="text-gray-400">{t.from_country} → {t.to_country}</div>
                  </div>
                  <div className="text-gray-400">{new Date(t.begin_dt).toLocaleDateString()}</div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Quick Filters */}
        <div className="bg-white p-4 rounded-2xl shadow">
          <h4 className="font-semibold">Quick Filters</h4>
          <div className="mt-3 space-y-2">
            <input value={filters.search} onChange={(e) => { setFilters({ ...filters, search: e.target.value }); setPage(1); }} placeholder="Search name or email" className="w-full border rounded-lg px-3 py-2 text-sm" />
            <select value={filters.country} onChange={(e) => { setFilters({ ...filters, country: e.target.value }); setPage(1); }} className="w-full border rounded-lg px-3 py-2 text-sm">
              <option value="">All Countries</option>
              {countries.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
            <select value={filters.type} onChange={(e) => { setFilters({ ...filters, type: e.target.value }); setPage(1); }} className="w-full border rounded-lg px-3 py-2 text-sm">
              <option value="">All Types</option>
              {legTypes.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
            <div className="flex gap-2">
              <input type="date" value={filters.dateFrom} onChange={(e) => setFilters({ ...filters, dateFrom: e.target.value })} className="w-1/2 border rounded-lg px-2 py-2 text-sm" />
              <input type="date" value={filters.dateTo} onChange={(e) => setFilters({ ...filters, dateTo: e.target.value })} className="w-1/2 border rounded-lg px-2 py-2 text-sm" />
            </div>
            <div className="flex gap-2">
              <button onClick={() => { setFilters({ search: "", country: "", type: "", dateFrom: "", dateTo: "" }); toast.info("Filters cleared"); }} className="flex-1 border rounded-lg px-3 py-2 text-sm">Clear</button>
              <button onClick={() => exportCsv()} className="flex-1 bg-green-600 text-white rounded-lg px-3 py-2 text-sm">Export CSV</button>
            </div>
          </div>
        </div>

      </div>
    </aside>

    {/* RIGHT COLUMN - Main content */}
    <main className="col-span-9">
      <Tab.Group>
        <Tab.List className="flex gap-2 mb-4">
          <Tab className={({ selected }) => `px-4 py-2 rounded-lg ${selected ? "bg-white shadow" : "bg-gray-100"}`}>Overview</Tab>
          <Tab className={({ selected }) => `px-4 py-2 rounded-lg ${selected ? "bg-white shadow" : "bg-gray-100"}`}>Insights</Tab>
          <Tab className={({ selected }) => `px-4 py-2 rounded-lg ${selected ? "bg-white shadow" : "bg-gray-100"}`}>Records</Tab>
        </Tab.List>

        <Tab.Panels>
          {/* OVERVIEW PANEL */}
          <Tab.Panel>
            <div className="grid grid-cols-3 gap-6">
              <div className="bg-white p-4 rounded-2xl shadow col-span-2">
                <h3 className="font-semibold mb-2">Travel Records ({filtered.length})</h3>
                <div className="overflow-x-auto mt-3">
                  <table className="w-full text-sm border-collapse">
                    <thead className="text-left text-gray-600">
                      <tr>
                        <th className="p-2">Name</th>
                        <th className="p-2">From</th>
                        <th className="p-2">To</th>
                        <th className="p-2">Start</th>
                        <th className="p-2">End</th>
                        <th className="p-2">Type</th>
                        <th className="p-2">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {pageSlice.map((r, i) => (
                        <tr key={i} onClick={() => setSelectedTraveler(r)} className="cursor-pointer hover:bg-gray-50 border-b">
                          <td className="p-2">{r.first_name} {r.last_name}</td>
                          <td className="p-2">{r.from_country}</td>
                          <td className="p-2">{r.to_country}</td>
                          <td className="p-2">{r.begin_dt ? new Date(r.begin_dt).toLocaleDateString() : "-"}</td>
                          <td className="p-2">{r.end_dt ? new Date(r.end_dt).toLocaleDateString() : "-"}</td>
                          <td className="p-2">{r.leg_type}</td>
                          <td className="p-2">{r.active_now ? <span className="text-green-600 flex items-center gap-1"><FiCheckCircle />Active</span> : <span className="text-gray-400 flex items-center gap-1"><FiXCircle />Inactive</span>}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                <div className="flex items-center justify-between mt-3">
                  <div className="text-sm text-gray-500">Showing {(page - 1) * pageSize + 1} - {Math.min(page * pageSize, filtered.length)} of {filtered.length}</div>
                  <div className="flex items-center gap-2">
                    <select value={pageSize} onChange={(e) => { setPageSize(Number(e.target.value)); setPage(1); }} className="border rounded-lg px-2 py-1 text-sm">
                      <option value={6}>6</option>
                      <option value={12}>12</option>
                      <option value={24}>24</option>
                    </select>
                    <button onClick={() => setPage((p) => Math.max(1, p - 1))} className="p-2 bg-white rounded-lg border"><FiChevronLeft /></button>
                    <span className="text-sm">{page} / {totalPages}</span>
                    <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} className="p-2 bg-white rounded-lg border"><FiChevronRight /></button>
                  </div>
                </div>

              </div>

              <div className="bg-white p-4 rounded-2xl shadow">
                <h3 className="font-semibold mb-3">Quick Insights</h3>
                <div className="space-y-3">
                  <div className="text-sm text-gray-700">Active travelers: <strong>{safeItems.filter((r) => r.active_now).length}</strong></div>
                  <div className="text-sm text-gray-700">Countries covered: <strong>{countries.length}</strong></div>
                  <div className="text-sm text-gray-700">Unique travel types: <strong>{legTypes.length}</strong></div>
                  <div className="text-sm text-gray-700">Today starts: <strong>{todayTravelers.length}</strong></div>
                </div>
              </div>
            </div>
          </Tab.Panel>

          {/* INSIGHTS PANEL */}
          <Tab.Panel>
            <div className="grid grid-cols-3 gap-6">
              <div className="col-span-2 bg-white p-4 rounded-2xl shadow">
                <h3 className="font-semibold mb-3">Travelers per Country</h3>
                <div style={{ width: "100%", height: 320 }}>
                  <ResponsiveContainer>
                    <BarChart data={countryStats}>
                      <XAxis dataKey="country" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="count" fill="#60a5fa" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <h4 className="text-sm font-medium mb-2">Travel Type Distribution</h4>
                    <div style={{ width: "100%", height: 180 }}>
                      <ResponsiveContainer>
                        <PieChart>
                          <Pie data={typeStats} dataKey="count" nameKey="type" outerRadius={60} label>
                            {typeStats.map((entry, idx) => (
                              <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-3 rounded-lg">
                    <h4 className="text-sm font-medium mb-2">Active vs Inactive</h4>
                    <div style={{ width: "100%", height: 180 }}>
                      <ResponsiveContainer>
                        <PieChart>
                          <Pie data={[{ name: "Active", value: safeItems.filter((i) => i.active_now).length }, { name: "Inactive", value: safeItems.filter((i) => !i.active_now).length }]} dataKey="value" nameKey="name" outerRadius={60} label>
                            {[0, 1].map((idx) => (
 