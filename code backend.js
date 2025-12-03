cd C:\Users\W0024618\Desktop\IncidentDashboard
npx create-react-app Frontend
cd Frontend
npm install react-router-dom react-icons axios



C:\Users\W0024618\Desktop\IncidentDashboard\Frontend
│
├── package.json
├── public/
│   └── index.html
│
└── src/
    ├── index.js
    ├── App.js
    ├── App.css
    │
    ├── pages/
    │   └── incidents/
    │       ├── IncidentDashboard.jsx
    │       ├── ViewIncident.jsx      (optional)
    │       ├── EditIncident.jsx      (optional)
    │       └── index.js
    │
    ├── components/
    │   └── incidents/
    │       ├── IncidentForm.jsx
    │       └── IncidentList.jsx
    │
    ├── styles/
    │   └── incidents.css
    │
    ├── api/
    │   └── incidentApi.js
    │
    └── routes/
        └── IncidentRoutes.jsx