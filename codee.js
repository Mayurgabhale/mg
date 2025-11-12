# Travel-Backend/daily_sheet.py
from fastapi import APIRouter, HTTPException
from sqlalchemy import create_engine, Column, Integer, String, Boolean, DateTime
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from datetime import datetime
from fastapi.responses import JSONResponse

# region-mapping imports (your robust resolver)
from .region_mapper import resolve_region, normalize_text

# ✅ import Employee + VIP_LEVELS from monthly sheet
from .monthly_sheet import Employee, VIP_LEVELS

# =======================
#   ROUTER CONFIG
# =======================
router = APIRouter(prefix="/daily_sheet", tags=["daily_sheet"])

# =======================
#   DATABASE CONFIG
# =======================
DATABASE_URL = "sqlite:///./database.db"
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(bind=engine, autocommit=False, autoflush=False)
Base = declarative_base()

# =======================
#   DAILY TRAVEL MODEL
# =======================
class DailyTravel(Base):
    __tablename__ = "daily_travel"

    id = Column(Integer, primary_key=True, index=True)
    pnr = Column(String, index=True)
    first_name = Column(String)
    last_name = Column(String)
    email = Column(String)
    emp_id = Column(String, index=True)
    from_country = Column(String)
    to_country = Column(String)
    from_location = Column(String)
    to_location = Column(String)
    begin_dt = Column(DateTime)
    end_dt = Column(DateTime)
    active_now = Column(Boolean, default=False)
    uploaded_at = Column(String, nullable=True)

Base.metadata.create_all(bind=engine)

# =======================
#   GLOBAL MEMORY CACHE
# =======================
previous_data = {"items": None, "regions_summary": None, "last_updated": None}

# =======================
#   HELPER: VIP LOOKUP
# =======================
def check_vip_status(session, emp_id: str, first_name: str, last_name: str, email: str) -> bool:
    """
    Dynamically determine if a traveler is VIP by matching with Employee table.
    Match priority: employee_id → email → full_name.
    """
    query = session.query(Employee)
    emp = None

    if emp_id:
        emp = query.filter(Employee.employee_id == emp_id).first()

    if not emp and email:
        emp = query.filter(Employee.employee_email == email).first()

    if not emp and first_name and last_name:
        full_name = f"{first_name.strip()} {last_name.strip()}"
        emp = (
            query.filter(Employee.full_name.ilike(full_name))
            .first()
        )

    if not emp:
        return False

    return emp.management_level in VIP_LEVELS if emp.management_level else False


# =======================
#   BUILD REGIONAL SUMMARY
# =======================
def build_regions_summary(items: list):
    """Group all items by region → city, with total_count, active_count, vip_count, active_vip_count."""
    session = SessionLocal()
    regions = {}

    for it in items:
        country = (it.get("to_country") or it.get("from_country") or "").strip()
        location = (it.get("to_location") or it.get("from_location") or "").strip()
        region = resolve_region(country, location)
        city = (location.split(",")[0].strip().title() if location else "Unknown")

        # dynamically compute VIP
        is_vip = check_vip_status(session, it.get("emp_id"), it.get("first_name"), it.get("last_name"), it.get("email"))

        if region not in regions:
            regions[region] = {
                "region_code": region,
                "total_count": 0,
                "active_count": 0,
                "vip_count": 0,
                "active_vip_count": 0,
                "cities": {}
            }

        reg = regions[region]
        reg["total_count"] += 1
        if it.get("active_now"):
            reg["active_count"] += 1
        if is_vip:
            reg["vip_count"] += 1
        if it.get("active_now") and is_vip:
            reg["active_vip_count"] += 1

        # --- city-level ---
        if city not in reg["cities"]:
            reg["cities"][city] = {
                "city_name": city,
                "total_count": 0,
                "active_count": 0,
                "vip_count": 0,
                "active_vip_count": 0,
                "sample_items": []
            }

        c = reg["cities"][city]
        c["total_count"] += 1
        if it.get("active_now"):
            c["active_count"] += 1
        if is_vip:
            c["vip_count"] += 1
        if it.get("active_now") and is_vip:
            c["active_vip_count"] += 1

        if len(c["sample_items"]) < 10:
            c["sample_items"].append({
                "first_name": it.get("first_name"),
                "last_name": it.get("last_name"),
                "email": it.get("email"),
                "pnr": it.get("pnr"),
                "active_now": it.get("active_now"),
                "is_vip": is_vip,
                "begin_dt": it.get("begin_dt"),
                "end_dt": it.get("end_dt"),
            })

    session.close()

    # sort city order
    for reg_data in regions.values():
        reg_data["cities"] = dict(sorted(reg_data["cities"].items(), key=lambda kv: -kv[1]["total_count"]))

    return regions


# =======================
#   API ENDPOINTS
# =======================
@router.get("/regions")
def get_regions():
    """
    Return regional travel summary grouped by region (APAC, EMEA, NAMER, LACA, UNKNOWN).
    Uses memory cache if available, else loads from DB.
    """
    if previous_data.get("items"):
        items = previous_data["items"]
    else:
        session = SessionLocal()
        rows = session.query(DailyTravel).all()
        session.close()
        if not rows:
            raise HTTPException(status_code=404, detail="No travel data available in memory or database.")
        items = [{k: v for k, v in r.__dict__.items() if k != "_sa_instance_state"} for r in rows]
        previous_data["items"] = items

    regions = build_regions_summary(items)
    previous_data["regions_summary"] = regions
    previous_data["last_updated"] = datetime.now().isoformat()

    return JSONResponse(content={
        "regions": regions,
        "last_updated": previous_data["last_updated"],
        "message": "Loaded region summary from memory or database"
    })


@router.get("/regions/{region_code}")
def get_region(region_code: str):
    """Return a single region's travel data."""
    regions = previous_data.get("regions_summary")
    if not regions:
        raise HTTPException(status_code=404, detail="No regional summary found. Generate with /regions first.")

    region_data = regions.get(region_code.upper()) or regions.get(region_code)
    if not region_data:
        raise HTTPException(status_code=404, detail=f"Region '{region_code}' not found.")

    return region_data