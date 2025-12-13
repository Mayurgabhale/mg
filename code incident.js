this is my incidentdashboard 
but in this 
http://localhost:3000/ in this i dont want to opne IncidentForm, ok
for IncidentForm i watn different route ok,
 http://localhost:3000/ only for this i want to mian dashobrd conteent where we handel all ok 
so how to do this 
    C:\Users\W0028758\Desktop\incidenceDashboard\frontend\src\components\IncidentForm.jsx
C:\Users\W0028758\Desktop\incidenceDashboard\frontend\src\components\IncidentList.jsx

C:\Users\W0028758\Desktop\incidenceDashboard\frontend\src\pages\IncidentDashboard.jsx
 import IncidentForm from "../components/IncidentForm";
 import IncidentList from "../components/IncidentList";
 

 export default function IncidentPage(){
    return (
        <div>
            {/* <h1>Incident Reporting</h1> */}
            <div >
                <div>
                    <IncidentForm/>
                </div>
                <div>
                    <IncidentList/>
                </div>
            </div>
        </div>
    )
 }
