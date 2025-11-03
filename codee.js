import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FiGlobe, FiUsers, FiMapPin, FiUpload, FiFilter, FiSearch, FiDownload, FiTrash2, FiCheckCircle, FiXCircle, FiCalendar, FiMail, FiUser, FiAward, FiActivity } from "react-icons/fi";
import { Dialog, Transition } from "@headlessui/react";
import { motion } from "framer-motion";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

/*
  Enhanced single-file React dashboard (Tailwind + Recharts + HeadlessUI + Framer Motion)
  - Overview KPI cards
  - Today's travelers widget
  - Country breakdown list (click a country to filter)
  - Charts (Travel types, Country counts)
  - Main data table with pagination, row-click opens a modal "popup table" with detailed fields and quick actions
  - Bulk actions, export CSV, upload import
  - Filters: search, country, travel type, date range
  - Accessible and responsive

  NOTE: This file expects these endpoints to exist (same as your original):
    GET  http://localhost:8000/data   -> { items: [], summary: {} }
    POST http://localhost:8000/upload -> form-data file upload -> { items: [], summary: {} }

  Feel free to adapt the endpoints or wire it to your backend/store.
*/

const fmt = (iso) => {
  if (!iso) return "";
  try {
    const d = new Date(iso);
    return d.toLocaleDateString() + " " + d.toLocaleTimeString();
  } catch {
    return String(iso);
  }
};

export default function EmployeeTravelDashboardEnhanced() {
  const [items, setItems] = useState([]);
  const [summary, setSummary] = useState({});
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  // Filters
  const [filters, setFilters] = useState({ search: "", country: "", legType: "", dateFrom: "", dateTo: "" });

  // Table (pagination + selection)
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const [selected, setSelected] = useState(new Set());

  // Modal (popup table) when a row is clicked
  const [openRow, setOpenRow] = useState(null);

  useEffect(() => {
    // load previous data if available from backend
    const load = async () => {
      try {
        const res = await axios.get("http://localhost:8000/data");
        const payload = res.data || {};
        setItems(payload.items || []);
        setSummary(payload.summary || {});
        if ((payload.items || []).length) toast.info(`Loaded ${(payload.items || []).length} saved records.`);
      } catch (e) {
        console.log("No saved data or backend not running yet.");
      }
    };
    load();
  }, []);

  // upload handler (reuses your backend endpoint)
  const handleFileChange = (e) => setFile(e.target.files?.[0] ?? null);

  const uploadFile = async () => {
    if (!file) return toast.warn("Select a file first");
    setLoading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await axios.post("http://localhost:8000/upload", fd, { headers: { "Content-Type": "multipart/form-data" } });
      const payload = res.data || {};
      setItems(payload.items || []);
      setSummary(payload.summary || {});
      toast.success("File uploaded and parsed.");
      setPage(1);
    } catch (err) {
      console.error(err);
      toast.error("Upload failed. Check backend or file format.");
    } finally {
      setLoading(false);
    }
  };

  // derived lists
  const safeItems = Array.isArray(items) ? items : [];
  const countries = useMemo(() => [...new Set(safeItems.map((r) => r.from_country).filter(Boolean))], [safeItems]);
  const legTypes = useMemo(() => [...new Set(safeItems.map((r) => r.leg_type).filter(Boolean))], [safeItems]);

  // Today's travelers
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayTravelers = safeItems.filter((r) => {
    if (!r.begin_dt) return false;
    const s = new Date(r.begin_dt);
    s.setHours(0, 0, 0, 0);
    return s.getTime() === today.getTime();
  });

  // Filtering pipeline
  const filtered = useMemo(() => {
    return safeItems
      .filter((r) => {
        const s = filters.search.toLowerCase().trim();
        if (s) {
          const hay = `${r.first_name ?? ""} ${r.last_name ?? ""} ${r.email ?? ""}`.toLowerCase();
          if (!hay.includes(s)) return false;
        }
        if (filters.country && r.from_country !== filters.country) return false;
        if (filters.legType && r.leg_type !== filters.legType) return false;
        if (filters.dateFrom) {
          const from = new Date(filters.dateFrom);
          if (!r.begin_dt || new Date(r.begin_dt) < from) return false;
        }
        if (filters.dateTo) {
          const to = new Date(filters.dateTo);
          // include entire day
          to.setHours(23, 59, 59, 999);
          if (!r.begin_dt || new Date(r.begin_dt) > to) return false;
        }
        return true;
      })
      // active first
      .sort((a, b) => (b.active_now === true) - (a.active_now === true));
  }, [safeItems, filters]);

  // pagination slice
  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));
  const pageItems = filtered.slice((page - 1) * pageSize, page * pageSize);

  // quick CSV export for the filtered dataset
  const exportCsv = () => {
    if (!filtered.length) return toast.info("No data to export.");
    const keys = Object.keys(filtered[0]);
    const csv = [keys.join(",")];
    filtered.forEach((r) => csv.push(keys.map((k) => `"${String(r[k] ?? "").replace(/"/g, '""')}"`).join(",")));
    const blob = new Blob([csv.join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "EmployeeTravelData.csv";
    a.click();
    URL.revokeObjectURL(url);
    toast.success("CSV exported.");
  };

  // charts data
  const countryStats = useMemo(() => {
    const map = {};
    for (const r of safeItems) {
      const c = r.from_country || "Unknown";
      map[c] = (map[c] || 0) + 1;
    }
    return Object.entries(map).map(([k, v]) => ({ country: k, count: v })).sort((a, b) => b.count - a.count);
  }, [safeItems]);

  const typeStats = useMemo(() => {
    const map = {};
    for (const r of safeItems) {
      const t = r.leg_type || "Unknown";
      map[t] = (map[t] || 0) + 1;
    }
    return Object.entries(map).map(([k, v]) => ({ type: k, count: v }));
  }, [safeItems]);

  // helper: click a row open modal
  const onRowClick = (row) => setOpenRow(row);

  // bulk action example: mark selected as active
  const toggleSelect = (id) => {
    const ns = new Set(selected);
    if (ns.has(id)) ns.delete(id);
    else ns.add(id);
    setSelected(ns);
  };

  const markSelectedActive = () => {
    if (!selected.size) return toast.info("No rows selected");
    const ids = new Set(selected);
    setItems((prev) => prev.map((r) => (ids.has(r.id) ? { ...r, active_now: true } : r)));
    toast.success("Marked selected as active.");
    setSelected(new Set());
  };

  // small analytic: find long trips (>30 days)
  const longTrips = safeItems.filter((r) => {
    if (!r.begin_dt || !r.end_dt) return false;
    const b = new Date(r.begin_dt);
    const e = new Date(r.end_dt);
    return (e - b) / (1000 * 60 * 60 * 24) > 30;
  });

  // UI colors for pie
  const COLORS = ["#6366f1", "#06b6d4", "#f59e0b", "#10b981", "#ef4444", "#8b5cf6"];

  return (
    <div className="min-h-screen bg-slate-50 p-6 text-slate-900 font-sans">
      <ToastContainer position="top-right" autoClose={3000} />

      {/* HEADER */}
      <header className="mb-6 flex items-center gap-4">
        <div className="bg-gradient-to-br from-indigo-500 to-indigo-700 text-white p-3 rounded-lg">
          <FiGlobe size={28} />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Employee Travel Dashboard</h1>
          <p className="text-sm text-slate-500">Summary, charts and a clickable popup table — all in one place.</p>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT: KPIs + Today's travelers + country list */}
        <aside className="lg:col-span-3 space-y-4">
          {/* KPI cards */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white p-4 rounded-lg shadow">
              <div className="flex items-center gap-3">
                <div className="bg-slate-100 p-2 rounded">
                  <FiUsers />
                </div>
                <div>
                  <div className="text-xs text-slate-500">Total Travelers</div>
                  <div className="text-lg font-semibold">{safeItems.length}</div>
                </div>
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <div className="flex items-center gap-3">
                <div className="bg-emerald-50 p-2 rounded">
                  <FiCheckCircle />
                </div>
                <div>
                  <div className="text-xs text-slate-500">Active Now</div>
                  <div className="text-lg font-semibold">{safeItems.filter((r) => r.active_now).length}</div>
                </div>
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <div className="flex items-center gap-3">
                <div className="bg-sky-50 p-2 rounded">
                  <FiMapPin />
                </div>
                <div>
                  <div className="text-xs text-slate-500">Countries</div>
                  <div className="text-lg font-semibold">{countries.length}</div>
                </div>
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <div className="flex items-center gap-3">
                <div className="bg-amber-50 p-2 rounded">
                  <FiAward />
                </div>
                <div>
                  <div className="text-xs text-slate-500">Travel Types</div>
                  <div className="text-lg font-semibold">{legTypes.length}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Today's travelers */}
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-semibold">Today's Travelers</h3>
              <div className="text-xs text-slate-400">{new Date().toLocaleDateString()}</div>
            </div>
            {todayTravelers.length === 0 ? (
              <div className="text-sm text-slate-400">No travelers starting today</div>
            ) : (
              <ul className="space-y-2 max-h-48 overflow-y-auto">
                {todayTravelers.map((t, i) => (
                  <li key={i} className="flex items-center justify-between">
                    <div>
                      <div className="text-sm font-medium">{t.first_name} {t.last_name}</div>
                      <div className="text-xs text-slate-500">{t.from_country} → {t.to_country}</div>
                    </div>
                    <div className="text-xs text-slate-400">{fmt(t.begin_dt)}</div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Country list - click to filter */}
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-semibold">Country Breakdown</h3>
              <button className="text-xs text-indigo-600" onClick={() => { setFilters({ ...filters, country: "" }); toast.info('Cleared country filter'); }}>Clear</button>
            </div>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {countryStats.length === 0 ? (
                <div className="text-sm text-slate-400">No data</div>
              ) : (
                countryStats.slice(0, 20).map((c) => (
                  <button
                    key={c.country}
                    className={`w-full text-left flex items-center justify-between py-2 px-2 rounded hover:bg-slate-50 ${filters.country === c.country ? 'bg-indigo-50' : ''}`}
                    onClick={() => setFilters({ ...filters, country: c.country })}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700">{String(c.country).charAt(0).toUpperCase()}</div>
                      <div className="text-sm">{c.country}</div>
                    </div>
                    <div className="text-sm font-semibold">{c.count}</div>
                  </button>
                ))
              )}
            </div>
          </div>
        </aside>

        {/* MAIN: filters, charts, table */}
        <main className="lg:col-span-9 space-y-4">
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
              <div className="flex items-center gap-2 w-full md:w-2/3">
                <div className="relative flex-1">
                  <FiSearch className="absolute left-3 top-3 text-slate-400" />
                  <input className="w-full pl-10 pr-3 py-2 border rounded" placeholder="Search by name/email" value={filters.search} onChange={(e) => setFilters({ ...filters, search: e.target.value })} />
                </div>
                <select className="border rounded px-2 py-2" value={filters.legType} onChange={(e) => setFilters({ ...filters, legType: e.target.value })}>
                  <option value="">All Types</option>
                  {legTypes.map((t) => <option key={t}>{t}</option>)}
                </select>
                <select className="border rounded px-2 py-2" value={filters.country} onChange={(e) => setFilters({ ...filters, country: e.target.value })}>
                  <option value="">All Countries</option>
                  {countries.map((c) => <option key={c}>{c}</option>)}
                </select>
              </div>

              <div className="flex items-center gap-2">
                <label className="flex items-center gap-2">
                  <input type="file" onChange={handleFileChange} className="hidden" id="upload" />
                  <label htmlFor="upload" className="px-3 py-2 border rounded cursor-pointer inline-flex items-center gap-2"><FiUpload /> {file ? file.name : 'Choose file'}</label>
                </label>
                <button className="px-3 py-2 bg-indigo-600 text-white rounded" onClick={uploadFile} disabled={loading}>{loading ? 'Uploading...' : 'Upload'}</button>
                <button className="px-3 py-2 border rounded" onClick={() => { setItems([]); setSummary({}); toast.info('Cleared data'); }}>Clear</button>
                <button className="px-3 py-2 border rounded" onClick={exportCsv}><FiDownload /> Export</button>
              </div>
            </div>

            {/* small analytics row */}
            <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="p-3 border rounded">
                <div className="text-xs text-slate-500">Long Trips (&gt;30 days)</div>
                <div className="text-lg font-semibold">{longTrips.length}</div>
                {longTrips.length > 0 && <div className="text-xs text-slate-400">Example: {longTrips[0].first_name} {longTrips[0].last_name}</div>}
              </div>
              <div className="p-3 border rounded">
                <div className="text-xs text-slate-500">Unique Emails</div>
                <div className="text-lg font-semibold">{new Set(safeItems.map((r) => r.email)).size}</div>
              </div>
              <div className="p-3 border rounded">
                <div className="text-xs text-slate-500">Saved Summary</div>
                <div className="text-lg font-semibold">{summary.total || '-'}</div>
              </div>
            </div>

            {/* charts */}
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 h-64">
              <div className="bg-white border rounded p-2">
                <div className="text-sm font-semibold px-2">By Travel Type</div>
                <div className="w-full h-48">
                  <ResponsiveContainer>
                    <BarChart data={typeStats}>
                      <XAxis dataKey="type" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="count" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
              <div className="bg-white border rounded p-2">
                <div className="text-sm font-semibold px-2">Top Countries</div>
                <div className="w-full h-48 flex items-center justify-center">
                  <ResponsiveContainer>
                    <PieChart>
                      <Pie data={countryStats.slice(0, 6)} dataKey="count" nameKey="country" innerRadius={30} outerRadius={70} label>
                        {countryStats.slice(0, 6).map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>

          {/* DATA TABLE CARD */}
          <div className="bg-white p-4 rounded-lg shadow overflow-x-auto">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <button className="px-3 py-2 border rounded" onClick={() => { setSelected(new Set(safeItems.map(s => s.id))); toast.info('All rows selected'); }}>Select All</button>
                <button className="px-3 py-2 border rounded" onClick={() => setSelected(new Set())}>Clear Sel</button>
                <button className="px-3 py-2 bg-emerald-500 text-white rounded" onClick={markSelectedActive}>Mark Active</button>
              </div>

              <div className="text-sm text-slate-500">Showing {filtered.length} records</div>
            </div>

            <table className="w-full table-auto text-sm">
              <thead className="text-left text-slate-600">
                <tr>
                  <th className="p-2">#</th>
                  <th className="p-2">Status</th>
                  <th className="p-2">Traveler</th>
                  <th className="p-2">Email</th>
                  <th className="p-2">Type</th>
                  <th className="p-2">From</th>
                  <th className="p-2">To</th>
                  <th className="p-2">Start</th>
                  <th className="p-2">End</th>
                </tr>
              </thead>
              <tbody>
                {pageItems.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="p-6 text-center text-slate-400">No results — try relaxing filters or upload data</td>
                  </tr>
                ) : (
                  pageItems.map((r, i) => (
                    <tr key={r.id ?? i} className={`hover:bg-slate-50 cursor-pointer ${r.active_now ? 'bg-emerald-50' : ''}`} onClick={() => onRowClick(r)}>
                      <td className="p-2">{(page - 1) * pageSize + i + 1}</td>
                      <td className="p-2">{r.active_now ? <span className="inline-flex items-center gap-1 text-emerald-700"><FiCheckCircle /> Active</span> : <span className="inline-flex items-center gap-1 text-slate-500"><FiXCircle /> Inactive</span>}</td>
                      <td className="p-2 flex items-c