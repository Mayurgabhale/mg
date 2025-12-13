import { BrowserRouter, Routes, Route } from "react-router-dom";

import IncidentForm from "./components/IncidentForm";
import IncidentList from "./components/IncidentList";
import Dashboard from "./pages/Dashboard"; // main dashboard only

export default function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* MAIN DASHBOARD */}
        <Route path="/" element={<Dashboard />} />

        {/* INCIDENT ROUTES (COMPONENTS ONLY) */}
        <Route path="/incidents" element={<IncidentList />} />
        <Route path="/incidents/new" element={<IncidentForm />} />

      </Routes>
    </BrowserRouter>
  );
}