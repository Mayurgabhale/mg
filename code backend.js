import React, { useEffect, useState } from "react";
import "./IncidentForm.css";

export default function IncidentList() {
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState(null);
  const [search, setSearch] = useState("");

  const fetchIncidents = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:8000/incident/list");
      const json = await res.json();
      setIncidents(Array.isArray(json) ? json : []);
    } catch (e) {
      console.error("Failed to fetch incidents", e);
      setIncidents([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIncidents();
  }, []);

  const filtered = incidents.filter(it => {
    if (!search) return true;
    const s = search.toLowerCase();
    return (it.type_of_incident || "").toLowerCase().includes(s) ||
           (it.impacted_name || "").toLowerCase().includes(s) ||
           (it.reported_by_name || "").toLowerCase().includes(s) ||
           (it.location || "").toLowerCase().includes(s);
  });

  return (
    <div className="incident-list">
      <div className="list-header">
        <h3>Recent Incidents</h3>
        <div>
          <input placeholder="Search by type, name, reporter, location" value={search} onChange={e => setSearch(e.target.value)} />
          <button className="btn" onClick={fetchIncidents}>Refresh</button>
        </div>
      </div>

      {loading ? <div>Loading...</div> : (
        <table className="inc-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Type</th>
              <th>Impacted</th>
              <th>Reported By</th>
              <th>Date of Incident</th>
              <th>Location</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(row => (
              <tr key={row.id}>
                <td>{row.id}</td>
                <td>{row.type_of_incident}</td>
                <td>{row.impacted_name || "-"}</td>
                <td>{row.reported_by_name || "-"}</td>
                <td>{row.date_of_incident || row.date_of_report || "-"}</td>
                <td>{row.location || "-"}</td>
                <td><button className="btn small" onClick={() => setSelected(row)}>View</button></td>
              </tr>
            ))}
            {filtered.length === 0 && <tr><td colSpan={7}>No incidents</td></tr>}
          </tbody>
        </table>
      )}

      {selected && (
        <div className="modal">
          <div className="modal-inner">
            <button className="modal-close" onClick={() => setSelected(null)}>Close</button>
            <h3>Incident #{selected.id} — {selected.type_of_incident}</h3>
            <pre className="detail-json">{JSON.stringify(selected, null, 2)}</pre>
          </div>
        </div>
      )}
    </div>
  );
}