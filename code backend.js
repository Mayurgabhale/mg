Backend/
│
├── venv/                         ← Python virtual environment
│
├── main.py                       ← FastAPI main entry point
├── incident_report.py            ← Your incident routes + models
├── monthly_sheet.py              ← DB engine + Base + SessionLocal
│
├── requirements.txt              ← All dependency packages
│
└── __init__.py                   ← Makes folder a module



cd C:\Users\W0024618\Desktop\IncidentDashboard\Backend
python -m venv venv




venv\Scripts\activate


pip install fastapi uvicorn sqlalchemy pydantic zoneinfo python-multipart

pip freeze > requirements.txt