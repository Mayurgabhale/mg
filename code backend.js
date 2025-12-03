import IncidentForm from "../components/IncidentForm";
import IncidentList from "../components/IncidentList";

export default function IncidentPage() {
    return (
        <div style={{ padding: 20 }}>
            <h1>Incident Reporting</h1>

            <div style={{
                display: "grid",
                gridTemplateColumns: "1fr 450px",
                gap: 20
            }}>
                <div>
                    <IncidentForm />
                </div>

                <div>
                    <IncidentList />
                </div>
            </div>
        </div>
    );
}