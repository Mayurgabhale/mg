for idx, row in df.iterrows():
    emp_id = str(row.get('EMP ID') or "").strip()
    first_name = (str(row.get('FIRST NAME') or "").strip()) if 'FIRST NAME' in df.columns else ""
    last_name = (str(row.get('LAST NAME') or "").strip()) if 'LAST NAME' in df.columns else ""
    email = (str(row.get('EMAIL') or "").strip().lower()) if 'EMAIL' in df.columns else None
    from_location = row.get('FROM LOCATION') if 'FROM LOCATION' in df.columns else None
    to_location = row.get('TO LOCATION') if 'TO LOCATION' in df.columns else None
    from_country = row.get('FROM COUNTRY') if 'FROM COUNTRY' in df.columns else None  # ✅ new
    to_country = row.get('TO COUNTRY') if 'TO COUNTRY' in df.columns else None        # ✅ new
    begin_dt_obj = row.get('BEGIN_DT') if 'BEGIN_DT' in df.columns else None
    end_dt_obj = row.get('END_DT') if 'END_DT' in df.columns else None
    begin_date_iso = begin_dt_obj.isoformat() if begin_dt_obj is not None else None
    end_date_iso = end_dt_obj.isoformat() if end_dt_obj is not None else None
    leg_type = row.get('LEG TYPE') if 'LEG TYPE' in df.columns else None
    active_flag = 1 if bool(row.get('active_now')) else 0