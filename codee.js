@router.get("/regions/{region_code}")
def get_region(region_code: str):
    """Get details for a specific region. Rebuilds region summary to ensure active counts are fresh."""
    # Ensure we have items (either cache or db)
    if previous_data.get("items"):
        items = previous_data["items"]
    else:
        db = SessionLocal()
        rows = db.query(DailyTravel).order_by(DailyTravel.id.asc()).all()
        db.close()
        if not rows:
            raise HTTPException(status_code=404, detail="No travel data available.")
        items = [{k: v for k, v in r.__dict__.items() if k != "_sa_instance_state"} for r in rows]
        previous_data["items"] = items

    # rebuild the regions summary fresh (so active_now is recomputed)
    regions = build_regions_summary(items)
    previous_data["regions_summary"] = regions
    previous_data["last_updated"] = datetime.now().isoformat()

    rc = region_code.upper()
    region_data = regions.get(rc)
    if not region_data:
        raise HTTPException(status_code=404, detail=f"Region {region_code} not found.")
    return JSONResponse(content=region_data)