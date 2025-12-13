C:\Users\W0028758\Desktop\incidenceDashboard\frontend\src\pages\Dashboard.jsx
now i want to desin the dashbord for incedent, ok, so what is the section we add in this, 
  i want full primun level dashbord, alos responive for each and every screen size ok, 
  so create dashbord 
C:\Users\W0028758\Desktop\incidenceDashboard\frontend\src\App.js
import { BrowserRouter, Routes, Route } from "react-router-dom";
import IncidentForm from "./components/IncidentForm";
import IncidentList from "./components/IncidentList";, 
import Dashboard from "./pages/Dashboard"; // main dashboard only

export default function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* MAIN DASHBOARD */}
        <Route path="/" element={<Dashboard />} />

        {/* INCIDENT ROUTES (COMPONENTS ONLY) */}
        <Route path="/incidentList" element={<IncidentList />} />
        <Route path="/incidentsForm" element={<IncidentForm />} />

      </Routes>
    </BrowserRouter>
  );
}
