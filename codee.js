(.venv) PS C:\Users\W0024618\Desktop\swipeData\Travel-Backend> uvicorn monthly_sheet:app --reload
INFO:     Will watch for changes in these directories: ['C:\\Users\\W0024618\\Desktop\\swipeData\\Travel-Backend']
INFO:     Uvicorn running on http://127.0.0.1:8000 (Press CTRL+C to quit)
INFO:     Started reloader process [22100] using StatReload
Process SpawnProcess-1:
Traceback (most recent call last):
  File "C:\Program Files\Python313\Lib\multiprocessing\process.py", line 313, in _bootstrap
    self.run()
    ~~~~~~~~^^
  File "C:\Program Files\Python313\Lib\multiprocessing\process.py", line 108, in run
    self._target(*self._args, **self._kwargs)
    ~~~~~~~~~~~~^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
  File "C:\Users\W0024618\Desktop\swipeData\Travel-Backend\.venv\Lib\site-packages\uvicorn\_subprocess.py", line 80, in subprocess_started
    target(sockets=sockets)
    ~~~~~~^^^^^^^^^^^^^^^^^
  File "C:\Users\W0024618\Desktop\swipeData\Travel-Backend\.venv\Lib\site-packages\uvicorn\server.py", line 67, in run
    return asyncio_run(self.serve(sockets=sockets), loop_factory=self.config.get_loop_factory())
  File "C:\Program Files\Python313\Lib\asyncio\runners.py", line 195, in run
    return runner.run(main)
           ~~~~~~~~~~^^^^^^
  File "C:\Program Files\Python313\Lib\asyncio\runners.py", line 118, in run
    return self._loop.run_until_complete(task)
           ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~^^^^^^
  File "C:\Program Files\Python313\Lib\asyncio\base_events.py", line 725, in run_until_complete
    return future.result()
           ~~~~~~~~~~~~~^^
  File "C:\Users\W0024618\Desktop\swipeData\Travel-Backend\.venv\Lib\site-packages\uvicorn\server.py", line 71, in serve
    await self._serve(sockets)
  File "C:\Users\W0024618\Desktop\swipeData\Travel-Backend\.venv\Lib\site-packages\uvicorn\server.py", line 78, in _serve
    config.load()
    ~~~~~~~~~~~^^
  File "C:\Users\W0024618\Desktop\swipeData\Travel-Backend\.venv\Lib\site-packages\uvicorn\config.py", line 439, in load
    self.loaded_app = import_from_string(self.app)
                      ~~~~~~~~~~~~~~~~~~^^^^^^^^^^
  File "C:\Users\W0024618\Desktop\swipeData\Travel-Backend\.venv\Lib\site-packages\uvicorn\importer.py", line 22, in import_from_string
    raise exc from None
  File "C:\Users\W0024618\Desktop\swipeData\Travel-Backend\.venv\Lib\site-packages\uvicorn\importer.py", line 19, in import_from_string
    module = importlib.import_module(module_str)
  File "C:\Program Files\Python313\Lib\importlib\__init__.py", line 88, in import_module
    return _bootstrap._gcd_import(name[level:], package, level)
           ~~~~~~~~~~~~~~~~~~~~~~^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
  File "<frozen importlib._bootstrap>", line 1387, in _gcd_import
  File "<frozen importlib._bootstrap>", line 1360, in _find_and_load
  File "<frozen importlib._bootstrap>", line 1331, in _find_and_load_unlocked
  File "<frozen importlib._bootstrap>", line 935, in _load_unlocked
  File "<frozen importlib._bootstrap_external>", line 1026, in exec_module
  File "<frozen importlib._bootstrap>", line 488, in _call_with_frames_removed
  File "C:\Users\W0024618\Desktop\swipeData\Travel-Backend\monthly_sheet.py", line 5, in <module>
    from sqlalchemy import create_engine, Column, String, Integer, Float
ModuleNotFoundError: No module named 'sqlalchemy'

C:\Users\W0024618\Desktop\swipeData\Travel-Backend\monthly_sheet.py
# C:\Users\W0024618\Desktop\swipeData\Travel-Backend\employee_db.py

from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import create_engine, Column, String, Integer, Float
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from io import BytesIO
import pandas as pd

# =======================
#   APP CONFIG
# =======================
app = FastAPI(title="Employee Master Sheet — SQLite Storage")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:3000",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# =======================
#   DATABASE CONFIG
# =======================
DATABASE_URL = "sqlite:///./database.db"

engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(bind=engine, autocommit=False, autoflush=False)
Base = declarative_base()


# =======================
#   EMPLOYEE MODEL
# =======================
class Employee(Base):
    __tablename__ = "employees"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    employee_id = Column(String, index=True)
    last_name = Column(String)
    first_name = Column(String)
    preferred_first_name = Column(String)
    middle_name = Column(String)
    full_name = Column(String)
    current_status = Column(String)
    employee_type = Column(String)
    hire_date = Column(String)
    job_code = Column(String)
    position_id = Column(String)
    business_title = Column(String)
    department_name = Column(String)
    company_name = Column(String)
    work_country = Column(String)
    location_description = Column(String)
    location_city = Column(String)
    management_level = Column(String)
    manager_name = Column(String)
    employee_email = Column(String)
    manager_email = Column(String)
    fte = Column(Float)
    tenure = Column(String)
    years_of_service = Column(Float)
    length_of_service_months = Column(Float)
    time_in_position_months = Column(Float)

# Create tables
Base.metadata.create_all(bind=engine)


# =======================
#   API ENDPOINTS
# =======================

@app.post("/upload_monthly")
async def upload_monthly(file: UploadFile = File(...)):
    """
    Upload the monthly employee Excel or CSV sheet and store data into SQLite.
    """
    if not file.filename.lower().endswith((".xlsx", ".xls", ".csv")):
        raise HTTPException(status_code=400, detail="Please upload a valid Excel or CSV file.")

    content = await file.read()

    try:
        if file.filename.lower().endswith(".csv"):
            df = pd.read_csv(BytesIO(content))
        else:
            df = pd.read_excel(BytesIO(content))
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error reading file: {e}")

    # Normalize column names
    df.columns = [c.strip().replace(" ", "_").replace("/", "_").replace("-", "_") for c in df.columns]

    session = SessionLocal()

    # Optional: clear old data before inserting new
    session.query(Employee).delete()

    # Insert new data
    for _, row in df.iterrows():
        emp = Employee(
            employee_id=str(row.get("Employee_ID", "")),
            last_name=row.get("Last_Name"),
            first_name=row.get("First_Name"),
            preferred_first_name=row.get("Preferred_First_Name"),
            full_name=row.get("Full_Name"),
            business_title=row.get("Business_Title"),
            management_level=row.get("Management_Level"),
            employee_email=row.get("Employee_s_Email"),
            manager_email=row.get("Manager_s_Email"),
            department_name=row.get("Department_Name"),
            company_name=row.get("Company_Name"),
            work_country=row.get("Work_Country"),
            location_description=row.get("Location_Description"),
            location_city=row.get("Location_City"),
            fte=float(row.get("FTE", 0)) if pd.notna(row.get("FTE")) else None,
            tenure=row.get("Tenure"),
            years_of_service=float(row.get("Years_of_Service", 0)) if pd.notna(row.get("Years_of_Service")) else None,
            length_of_service_months=float(row.get("Length_of_Service_in_Months", 0)) if pd.notna(row.get("Length_of_Service_in_Months")) else None,
            time_in_position_months=float(row.get("Time_in_Position_(Months)", 0)) if pd.notna(row.get("Time_in_Position_(Months)")) else None,
        )
        session.add(emp)

    session.commit()
    session.close()

    return {"message": f"{len(df)} employee records saved successfully to SQLite database."}


@app.get("/employees")
def get_all_employees():
    session = SessionLocal()
    employees = session.query(Employee).all()
    session.close()
    return [e.__dict__ for e in employees]


@app.get("/employee/{emp_id}")
def get_employee(emp_id: str):
    session = SessionLocal()
    emp = session.query(Employee).filter(Employee.employee_id == emp_id).first()
    session.close()
    if not emp:
        raise HTTPException(status_code=404, detail="Employee not found")
    return emp.__dict__
