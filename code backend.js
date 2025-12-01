
pip install fastapi uvicorn apscheduler icmplib

Backend/
│
├── src/                    ← Your existing Node.js backend
│   ├── controllers/
│   ├── services/
│   ├── routes/
│   ├── data/
│   └── app.js
│
└── python-service/         ← New Python microservice
    ├── api.py              (FastAPI server)
    ├── db.py               (SQLite init + helpers)
    ├── ping_worker.py      (Ping scheduler)
    ├── devices.db          (SQLite database)