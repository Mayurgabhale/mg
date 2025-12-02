import React, { useState, useEffect } from "react";
import IncidentForm from "../components/IncidentForm";
import IncidentList from "../components/IncidentList";


...
{ id: "incidents", label: "Incidents", icon: FiAlertTriangle } // choose an icon import or use any existing one


..
{activeTab === "incidents" && (
  <div style={{ padding: 16 }}>
    <h2>Incident Reporting</h2>
    <div style={{ display: "grid", gridTemplateColumns: "1fr 420px", gap: 16 }}>
      <div>
        <IncidentForm onSubmitted={() => {
          // optional: refresh list if shown
          console.log("incident submitted");
        }} />
      </div>
      <div>
        <IncidentList />
      </div>
    </div>
  </div>
)}