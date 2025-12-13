
import { useEffect, useMemo, useState } from "react"; import { Card, CardContent } from "@/components/ui/card"; import { Button } from "@/components/ui/button"; import { Input } from "@/components/ui/input"; import { Badge } from "@/components/ui/badge"; import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"; import { Search, Eye, RefreshCcw } from "lucide-react"; import { motion } from "framer-motion";

const API_BASE = "http://localhost:8000/incident";

export default function IncidentList() { const [incidents, setIncidents] = useState([]); const [loading, setLoading] = useState(false); const [search, setSearch] = useState(""); const [selected, setSelected] = useState(null);

const fetchIncidents = async () => { setLoading(true); try { const res = await fetch(${API_BASE}/list); const data = await res.json(); setIncidents(data || []); } catch (e) { console.error("Failed to load incidents", e); } finally { setLoading(false); } };

useEffect(() => { fetchIncidents(); }, []);

const filtered = useMemo(() => { if (!search) return incidents; return incidents.filter((i) => [ i.type_of_incident, i.impacted_name, i.impacted_employee_id, i.location, ] .join(" ") .toLowerCase() .includes(search.toLowerCase()) ); }, [search, incidents]);

return ( <div className="p-6 space-y-6"> {/* Header */} <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4"> <div> <h1 className="text-2xl font-semibold">Incident Reports</h1> <p className="text-sm text-muted-foreground"> Corporate incident management & audit trail </p> </div>

<div className="flex items-center gap-2">
      <div className="relative">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          className="pl-8 w-64"
          placeholder="Search incidents…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      <Button variant="outline" onClick={fetchIncidents}>
        <RefreshCcw className="h-4 w-4 mr-2" /> Refresh
      </Button>
    </div>
  </div>

  {/* Table */}
  <Card className="rounded-2xl shadow-sm">
    <CardContent className="p-0 overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="bg-muted">
          <tr className="text-left">
            <th className="p-4">ID</th>
            <th className="p-4">Type</th>
            <th className="p-4">Impacted</th>
            <th className="p-4">Location</th>
            <th className="p-4">Incident Date</th>
            <th className="p-4">Status</th>
            <th className="p-4 text-right">Action</th>
          </tr>
        </thead>
        <tbody>
          {loading && (
            <tr>
              <td colSpan={7} className="p-6 text-center text-muted-foreground">
                Loading incidents…
              </td>
            </tr>
          )}

          {!loading && filtered.length === 0 && (
            <tr>
              <td colSpan={7} className="p-6 text-center text-muted-foreground">
                No incidents found
              </td>
            </tr>
          )}

          {filtered.map((row) => (
            <motion.tr
              key={row.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="border-b last:border-none hover:bg-muted/40"
            >
              <td className="p-4 font-medium">#{row.id}</td>
              <td className="p-4">
                <Badge variant="secondary">{row.type_of_incident}</Badge>
              </td>
              <td className="p-4">
                <div className="font-medium">{row.impacted_name}</div>
                <div className="text-xs text-muted-foreground">
                  {row.impacted_employee_id}
                </div>
              </td>
              <td className="p-4">{row.location}</td>
              <td className="p-4">{row.date_of_incident}</td>
              <td className="p-4">
                {row.was_reported_verbally ? (
                  <Badge className="bg-green-100 text-green-700">Reported</Badge>
                ) : (
                  <Badge className="bg-yellow-100 text-yellow-700">Logged</Badge>
                )}
              </td>
              <td className="p-4 text-right">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setSelected(row)}
                >
                  <Eye className="h-4 w-4 mr-1" /> View
                </Button>
              </td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </CardContent>
  </Card>

  {/* Detail Dialog */}
  <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
    <DialogContent className="max-w-3xl">
      {selected && (
        <>
          <DialogHeader>
            <DialogTitle>Incident #{selected.id}</DialogTitle>
          </DialogHeader>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <Info label="Type" value={selected.type_of_incident} />
            <Info label="Location" value={selected.location} />
            <Info label="Incident Date" value={selected.date_of_incident} />
            <Info label="Reported By" value={selected.reported_by_name} />
            <Info label="Impacted Person" value={selected.impacted_name} />
            <Info label="Employee ID" value={selected.impacted_employee_id} />
          </div>

          <Section title="Description" text={selected.detailed_description} />
          <Section title="Immediate Actions" text={selected.immediate_actions_taken} />

          {selected.root_cause_analysis && (
            <Section title="Root Cause Analysis" text={selected.root_cause_analysis} />
          )}
          {selected.preventive_actions && (
            <Section title="Preventive Actions" text={selected.preventive_actions} />
          )}
        </>
      )}
    </DialogContent>
  </Dialog>
</div>

); }

function Info({ label, value }) { return ( <div className="bg-muted rounded-xl p-3"> <div className="text-xs text-muted-foreground">{label}</div> <div className="font-medium">{value || "—"}</div> </div> ); }

function Section({ title, text }) { return ( <div className="mt-4"> <h3 className="font-semibold mb-1">{title}</h3> <p className="text-muted-foreground leading-relaxed">{text}</p> </div> ); }