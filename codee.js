# ---------- REGION HELPERS & ENDPOINTS ----------

COUNTRY_TO_REGION = {
    # your mapping...
}

DEFAULT_REGION = 'UNKNOWN'

def guess_region(country: Optional[str], location: Optional[str]) -> str:
    ...
    
def normalize_city(location: Optional[str]) -> Optional[str]:
    ...

def build_regions_summary(items: list) -> dict:
    ...
    
@router.get("/regions")
async def get_regions():
    """Return region summary (APAC / EMEA / NAMER / LACA)."""
    if previous_data.get("items") is None:
        raise HTTPException(status_code=404, detail="No travel data available")
    regions = build_regions_summary(previous_data["items"])
    previous_data["regions_summary"] = regions
    return JSONResponse(content={"regions": regions})

@router.get("/regions/{region_code}")
async def get_region(region_code: str):
    """Return details of one specific region."""
    if previous_data.get("items") is None:
        raise HTTPException(status_code=404, detail="No travel data available")
    regions = previous_data.get("regions_summary") or build_regions_summary(previous_data["items"])
    rc = region_code.upper()
    if rc not in regions:
        raise HTTPException(status_code=404, detail=f"Region {rc} not found")
    return JSONResponse(content={"region": regions[rc]})