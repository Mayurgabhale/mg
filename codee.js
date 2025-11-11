@router.get("/data")
def get_previous_data():
    """
    Return cached or DB-loaded daily travel data with clean emp_id and upload timestamp.
    """
    # ✅ Try using in-memory cache first
    if previous_data.get("items"):
        items = previous_data["items"]
    else:
        # ✅ Fallback: load from DB
        db = SessionLocal()
        rows = db.query(DailyTravel).order_by(DailyTravel.id.asc()).all()
        db.close()
        if not rows:
            raise HTTPException(status_code=404, detail="No travel data found in memory or database.")
        items = [
            {k: v for k, v in r.__dict__.items() if k != "_sa_instance_state"}
            for r in rows
        ]
        previous_data["items"] = items

    # ✅ Clean up emp_id (remove .0)
    for it in items:
        if "emp_id" in it and it["emp_id"] is not None:
            try:
                # if numeric-like (e.g. '308497.0'), convert to int then str
                it["emp_id"] = str(int(float(it["emp_id"])))
            except Exception:
                it["emp_id"] = str(it["emp_id"]).strip()

    # ✅ Add summary info
    summary = {
        "rows_received": len(items),
        "rows_removed_as_footer_or_empty": previous_data.get("summary", {}).get("rows_removed_as_footer_or_empty", 0),
        "rows_with_parse_errors": sum(1 for r in items if not r.get("begin_date") or not r.get("end_date")),
        "active_now_count": sum(1 for r in items if r.get("active_now")),
        "data_upload_time": previous_data.get("summary", {}).get("data_upload_time") 
            or previous_data.get("last_updated") 
            or datetime.now().isoformat(),  # ✅ add upload time
    }

    # ✅ Update cache metadata
    previous_data["summary"] = summary
    previous_data["last_updated"] = datetime.now().isoformat()

    return JSONResponse(content={
        "summary": summary,
        "items": items,
        "last_updated": previous_data["last_updated"],
        "message": "Loaded daily sheet data from memory or database"
    })