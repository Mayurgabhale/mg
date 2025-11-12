from datetime import timezone

def _to_utc_dt_for_active(val):
    """
    Parse a datetime-like value and return a timezone-aware UTC datetime.
    - If val is None or unparseable -> returns None
    - If parsed dt has no tzinfo -> assume SERVER_TZ (Asia/Kolkata) to match parsing used on upload
    """
    if not val:
        return None
    try:
        # dateutil.parser.parse handles ISO strings and many formats
        dt = date_parser.parse(str(val))
    except Exception:
        return None

    if dt.tzinfo is None:
        # assume server local timezone (keeps behavior consistent with normalize_and_parse)
        try:
            dt = dt.replace(tzinfo=SERVER_TZ)
        except Exception:
            # fallback: treat naive as UTC
            dt = dt.replace(tzinfo=timezone.utc)

    # convert to UTC-aware datetime
    try:
        return dt.astimezone(timezone.utc)
    except Exception:
        # last-resort: return as-is (may be naive) or None
        return None





...

@router.get("/data")
def get_previous_data():
    """
    Return cached or DB-loaded daily travel data with clean emp_id and upload timestamp.
    VIP is computed dynamically for response (not persisted).
    Also: recompute `active_now` live for each item using begin/end datetimes.
    """
    # 1) load items (memory or DB)
    if previous_data.get("items"):
        items = previous_data["items"]
    else:
        db = SessionLocal()
        rows = db.query(DailyTravel).order_by(DailyTravel.id.asc()).all()
        db.close()
        if not rows:
            raise HTTPException(status_code=404, detail="No travel data found in memory or database.")
        items = [{k: v for k, v in r.__dict__.items() if k != "_sa_instance_state"} for r in rows]
        previous_data["items"] = items

    # 2) Clean up emp_id (remove .0) and ensure string trimming
    for it in items:
        if "emp_id" in it and it["emp_id"] is not None:
            try:
                it["emp_id"] = str(int(float(it["emp_id"])))  # e.g. "308497.0" → "308497"
            except Exception:
                it["emp_id"] = str(it["emp_id"]).strip()

    # 3) recompute is_vip dynamically (reuse one session)
    session_v = SessionLocal()
    try:
        for it in items:
            is_v = check_vip_status(session_v, it.get("emp_id"), it.get("first_name"), it.get("last_name"), it.get("email"))
            it["is_vip"] = bool(is_v)
    finally:
        session_v.close()

    # 4) Recompute active_now for each item using begin/end fields (support multiple key names)
    now_utc = datetime.now(timezone.utc)
    active_count = 0
    for it in items:
        # support both naming variants used in code: begin_date / begin_dt
        b_raw = it.get("begin_date") or it.get("begin_dt") or it.get("BEGIN_DT") or None
        e_raw = it.get("end_date") or it.get("end_dt") or it.get("END_DT") or None

        b_utc = _to_utc_dt_for_active(b_raw)
        e_utc = _to_utc_dt_for_active(e_raw)

        active_flag = 0
        if b_utc and e_utc:
            try:
                if b_utc <= now_utc <= e_utc:
                    active_flag = 1
            except Exception:
                active_flag = 0

        it["active_now"] = active_flag
        # keep boolean alias if some code expects booleans
        it["active_now_bool"] = bool(active_flag)
        if active_flag:
            active_count += 1

    # 5) Safely access old summary if available and update it
    old_summary = previous_data.get("summary") or {}

    summary = {
        "rows_received": len(items),
        "rows_removed_as_footer_or_empty": old_summary.get("rows_removed_as_footer_or_empty", 0),
        "rows_with_parse_errors": sum(1 for r in items if not (r.get("begin_date") or r.get("begin_dt") or r.get("BEGIN_DT")) or not (r.get("end_date") or r.get("end_dt") or r.get("END_DT"))),
        "active_now_count": int(active_count),
        "data_upload_time": old_summary.get("data_upload_time")
            or previous_data.get("last_updated")
            or datetime.now().isoformat(),
    }

    # 6) Update cache metadata (store updated items too)
    previous_data["summary"] = summary
    previous_data["items"] = items
    previous_data["last_updated"] = datetime.now().isoformat()

    # 7) Return response
    return JSONResponse(content=jsonable_encoder({
        "summary": summary,
        "items": items,
        "last_updated": previous_data["last_updated"],
        "message": "Loaded daily sheet data from memory or database (active_now recalculated)"
    }))

