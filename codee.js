import React, { useState, useMemo } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  Upload,
  FileSpreadsheet,
  Download,
  Trash2,
  Search,
  Plane,
  Users,
  Globe,
  MapPin,
} from "lucide-react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";

const fmt = (iso) => {
  if (!iso) return "";
  try {
    const d = new Date(iso);
    return d.toLocaleDateString() + " " + d.toLocaleTimeString();
  } catch {
    return String(iso);
  }
};

export default function EmployeeTravelDashboard() {
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
      setItems(payload.items || []);
      setSummary(payload.summary || {});
      toast.success(`✅ Uploaded successfully. ${payload.items.length} records found.`);
    } catch (err) {
      console.error(err);
      toast.error("❌ Upload failed. Please check the backend or file format.");
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
    toast.success("📁 CSV exported.");
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 p-6">
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />

      {/* HEADER */}
      <header className="text-center mb-8">
        <h1 className="text-3xl font-bold flex items-center justify-center gap-2 text-slate-900">
          <Globe className="w-8 h-8 text-blue-600" />
          Employee Travel Dashboard
        </h1>
        <p className="text-slate-500 text-sm mt-1">Monitor, filter, and export employee travel data easily.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* SIDEBAR */}
        <div className="space-y-6 md:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-blue-700">
                <Users className="w-5 h-5" />
                Overview
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex justify-between"><span>Total Travelers</span><strong>{safeItems.length}</strong></div>
              <div className="flex justify-between"><span>Active Now</span><strong>{safeItems.filter((r) => r.active_now).length}</strong></div>
              <div className="flex justify-between"><span>Countries</span><strong>{countries.length}</strong></div>
              <div className="flex justify-between"><span>Travel Types</span><strong>{legTypes.length}</strong></div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-blue-700">
                <MapPin className="w-5 h-5" />
                Country-wise Travelers
              </CardTitle>
            </CardHeader>
            <CardContent>
              {countryStats.length === 0 ? (
                <p className="text-slate-400 text-sm italic">No data yet</p>
              ) : (
                <ul className="divide-y divide-slate-100 text-sm">
                  {countryStats.map((c) => (
                    <li key={c.country} className="flex justify-between py-1">
                      <span>{c.country}</span>
                      <strong>{c.count}</strong>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        </div>

        {/* MAIN CONTENT */}
        <main className="md:col-span-3 space-y-6">
          {/* Upload + Buttons */}
          <div className="flex flex-wrap gap-3">
            <Input
              type="file"
              accept=".xlsx,.xls,.csv"
              onChange={handleFileChange}
              className="flex-1 min-w-[220px]"
            />
            <Button onClick={uploadFile} disabled={loading} className="bg-blue-600 hover:bg-blue-700">
              <Upload className="w-4 h-4 mr-1" /> {loading ? "Processing..." : "Upload File"}
            </Button>
            <Button variant="secondary" onClick={() => { setItems([]); setSummary({}); setFile(null); toast.info("Data cleared."); }}>
              <Trash2 className="w-4 h-4 mr-1" /> Clear
            </Button>
            <Button variant="outline" onClick={exportCsv}>
              <Download className="w-4 h-4 mr-1" /> Export CSV
            </Button>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-3">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-2.5 text-slate-400 w-4 h-4" />
              <Input
                placeholder="Search name or email..."
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                className="pl-9"
              />
            </div>

            <Select
              value={filters.country}
              onValueChange={(v) => setFilters({ ...filters, country: v })}
            >
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="All Countries" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Countries</SelectItem>
                {countries.map((c) => (
                  <SelectItem key={c} value={c}>{c}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={filters.legType}
              onValueChange={(v) => setFilters({ ...filters, legType: v })}
            >
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="All Travel Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Travel Types</SelectItem>
                {legTypes.map((t) => (
                  <SelectItem key={t} value={t}>{t}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Data Table */}
          <div className="overflow-x-auto rounded-xl shadow bg-white">
            <table className="w-full text-sm">
              <thead className="bg-slate-100 text-slate-700 text-left">
                <tr>
                  <th className="px-4 py-3">Active</th>
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Email</th>
                  <th className="px-4 py-3">Type</th>
                  <th className="px-4 py-3">From</th>
                  <th className="px-4 py-3">To</th>
                  <th className="px-4 py-3">Begin</th>
                  <th className="px-4 py-3">End</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="text-center py-6 text-slate-400">
                      No matching results. Upload a file or adjust filters.
                    </td>
                  </tr>
                ) : (
                  filtered.map((r, i) => (
                    <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-slate-50"}>
                      <td className="px-4 py-2">{r.active_now ? "✅" : ""}</td>
                      <td className="px-4 py-2 font-medium">
                        {r.first_name} {r.last_name}
                      </td>
                      <td className="px-4 py-2">{r.email}</td>
                      <td className="px-4 py-2">{r.leg_type}</td>
                      <td className="px-4 py-2">{r.from_country}</td>
                      <td className="px-4 py-2">{r.to_country}</td>
                      <td className="px-4 py-2">{fmt(r.begin_dt)}</td>
                      <td className="px-4 py-2">{fmt(r.end_dt)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </main>
      </div>
    </div>
  );
}