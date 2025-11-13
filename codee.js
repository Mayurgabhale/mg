(.venv) PS C:\Users\W0024618\Desktop\Trend Analysis\backend> python app.py
>>
WARNING:root:Historical profile file current_analysis.csv not found in candidate locations.
 * Serving Flask app 'app'
 * Debug mode: on
INFO:werkzeug:WARNING: This is a development server. Do not use it in a production deployment. Use a production WSGI server instead.
 * Running on all addresses (0.0.0.0)
 * Running on http://127.0.0.1:8002
 * Running on http://10.199.47.235:8002
INFO:werkzeug:Press CTRL+C to quit
INFO:werkzeug: * Restarting with stat
WARNING:root:Historical profile file current_analysis.csv not found in candidate locations.
WARNING:werkzeug: * Debugger is active!
INFO:werkzeug: * Debugger PIN: 134-209-644
INFO:werkzeug:127.0.0.1 - - [13/Nov/2025 10:57:18] "GET /run?start=2025-11-07&end=2025-11-07&full=true&region=laca HTTP/1.1" 200 -
INFO:werkzeug:127.0.0.1 - - [13/Nov/2025 11:02:39] "GET /record?employee_id=322024 HTTP/1.1" 200 -
INFO:werkzeug: * Detected change in 'C:\\Users\\W0024618\\Desktop\\Trend Analysis\\backend\\app.py', reloading
INFO:werkzeug: * Restarting with stat
WARNING:root:Historical profile file current_analysis.csv not found in candidate locations.
WARNING:werkzeug: * Debugger is active!
INFO:werkzeug: * Debugger PIN: 134-209-644
INFO:werkzeug: * Detected change in 'C:\\Users\\W0024618\\Desktop\\Trend Analysis\\backend\\app.py', reloading
INFO:werkzeug: * Restarting with stat
WARNING:root:Historical profile file current_analysis.csv not found in candidate locations.
WARNING:werkzeug: * Debugger is active!
INFO:werkzeug: * Debugger PIN: 134-209-644
INFO:werkzeug: * Detected change in 'C:\\Users\\W0024618\\Desktop\\Trend Analysis\\backend\\app.py', reloading
INFO:werkzeug: * Restarting with stat
  File "C:\Users\W0024618\Desktop\Trend Analysis\backend\app.py", line 1099
    if not s.get('imageUrl') and s.get('EmployeeID'):
SyntaxError: expected 'except' or 'finally' block
(.venv) PS C:\Users\W0024618\Desktop\Trend Analysis\backend> 

  read above error and how to slove it, and why this came
# backend/app.py
from flask import Flask, jsonify, request, send_from_directory, send_file
from datetime import datetime, timedelta, date
from pathlib import Path
import logging
import pandas as pd
import numpy as np
import joblib
import math
import re
import io
import os
import difflib
from typing import Optional, Dict, Any

# ---------- CORS / App setup (moved early to avoid NameError) ----------
try:
    from flask_cors import CORS
    has_cors = True
except Exception:
    CORS = None
    has_cors = False

from flask import Flask  # ensure Flask is available here (already imported at top in your file)

app = Flask(__name__, static_folder=None)
if has_cors:
    CORS(app)
else:
    import logging
    logging.warning("flask_cors not available; continuing without CORS.")


# project imports (may raise if not present; handled later)
from duration_report import REGION_CONFIG
from config.door_zone import map_door_to_zone, BREAK_ZONES, OUT_OF_OFFICE_ZONE

# trend_runner helpers (some may not exist depending on your version)
try:
    from trend_runner import run_trend_for_date, build_monthly_training, OUTDIR, read_90day_cache, compute_violation_days_map, _strip_uid_prefix as _strip_uid_prefix_tr
except Exception:
    # graceful fallback if some helpers are missing
    try:
        from trend_runner import run_trend_for_date, build_monthly_training, OUTDIR
    except Exception:
        run_trend_for_date = None
        build_monthly_training = None
        OUTDIR = None
    # provide safe stubs for optional helpers used later
    compute_violation_days_map = None
    _strip_uid_prefix_tr = (lambda x: x)

# ---------- Ensure outputs directory exists early ----------
BASE_DIR = Path(__file__).parent.resolve()
DEFAULT_OUTDIR = BASE_DIR / "outputs"
DEFAULT_OUTDIR.mkdir(parents=True, exist_ok=True)

OVERRIDES_FILE = DEFAULT_OUTDIR / "overrides.csv"

    def _norm_val_for_latest(v):
        try:
            if pd.isna(v):
                return None
        except Exception:
            pass
        if v is None:
            return None
        s = str(v).strip()
        if s == '' or s.lower() == 'nan':
            return None
        try:
            if '.' in s:
                fv = float(s)
                if math.isfinite(fv) and fv.is_integer():
                    s = str(int(fv))
        except Exception:
            pass
        return s

    if id_col is None:
        unique_persons = int(len(df))
    else:
        ids_series = df[id_col].apply(_norm_val_for_latest) if id_col in df.columns else pd.Series([None]*len(df))
        if id_col != 'person_uid' and 'person_uid' in df.columns:
            ids_series = ids_series.fillna(df['person_uid'].astype(str).replace('nan','').replace('None',''))
        unique_persons = int(len(set([x for x in ids_series.unique() if x])))

    # build initial sample (list of dicts)
    sample = _clean_sample_df(df, max_rows=5)  # returns list

    # --- Enrich sample rows with EmployeeEmail and imageUrl (best-effort) ---
    try:
        if isinstance(sample, list) and sample:
            for s in sample:
                try:
                    # prefer EmployeeID / person_uid / EmployeeName as lookup token
                    lookup_token = s.get('EmployeeID') or s.get('person_uid') or s.get('EmployeeName') or s.get('EmployeeIdentity')
                    pi = {}
                    if lookup_token:
                        try:
                            pi = get_personnel_info(lookup_token) or {}
                        except Exception:
                            pi = {}

                    # set email if found from personnel info
                    if pi:
                        email = pi.get('EmailAddress') or pi.get('EmployeeEmail') or pi.get('Email') or None
                        if email:
                            s['EmployeeEmail'] = email

                        # prefer ObjectID then GUID for image parent
                        objid = pi.get('ObjectID') or pi.get('GUID') or None
                        if objid:
                            try:
                                base = (request.url_root or request.host_url).rstrip('/')
                            except Exception:
                                base = ''
                            s['imageUrl'] = f"/employee/{objid}/image"

                            # best-effort flag whether image exists (may be False if DB missing)
                            try:
                                # try raw objid first, then try prefixed pattern (common storage pattern)
                                b = get_person_image_bytes(objid)
                                if not b:
                                    try:
                                        b = get_person_image_bytes(f"emp:{objid}")
                                    except Exception:
                                        b = None
                                s['HasImage'] = True if b else False
                            except Exception:
                                s['HasImage'] = False

                    # fallback: if still no email, try to find the matching row in the loaded DataFrame and pick an email from that row
                    if not s.get('EmployeeEmail'):
                        try:
                            # build mask to find the same person in df (prefer person_uid, then EmployeeID, then name)
                            match_mask = pd.Series(False, index=df.index)
                            try:
                                if s.get('person_uid') and 'person_uid' in df.columns:
                                    match_mask = match_mask | (df['person_uid'].astype(str).str.strip() == str(s.get('person_uid')).strip())
                            except Exception:
                                pass
                            try:
                                if s.get('EmployeeID') and 'EmployeeID' in df.columns:
                                    match_mask = match_mask | (df['EmployeeID'].astype(str).str.strip() == str(s.get('EmployeeID')).strip())
                            except Exception:
                                pass
                            try:
                                if not match_mask.any() and s.get('EmployeeName') and 'EmployeeName' in df.columns:
                                    match_mask = match_mask | (df['EmployeeName'].astype(str).str.strip().str.lower() == str(s.get('EmployeeName')).strip().lower())
                            except Exception:
                                pass

                            if match_mask.any():
                                # pick the first matched row (should be the right person)
                                idx = df[match_mask].index[0]
                                for col in ('Email', 'EmailAddress', 'EmployeeEmail', 'WorkEmail', 'EMail'):
                                    if col in df.columns:
                                        val = df.at[idx, col]
                                        if val not in (None, '', 'nan'):
                                            s['EmployeeEmail'] = val
                                            break
                            else:
                                # last resort: use the first non-empty email-like value from the whole dataframe
                                for col in ('Email', 'EmailAddress', 'EmployeeEmail', 'WorkEmail', 'EMail'):
                                    if col in df.columns:
                                        try:
                                            non_null = df[col].dropna().astype(str).map(lambda x: x.strip())
                                            non_null = non_null[non_null != '']
                                            if len(non_null):
                                                s['EmployeeEmail'] = non_null.iloc[0]
                                                break
                                        except Exception:
                                            continue
                        except Exception:
                            pass

                   # always provide a relative path to avoid duplicated host prefixes
                   if not s.get('imageUrl') and s.get('EmployeeID'):
                    s['imageUrl'] = f"/employee/{s.get('EmployeeID')}/image"


                except Exception:
                    # ensure that an exception for a single sample doesn't break everything
                    continue
    except Exception:
        # defensive: if enrichment fails entirely, continue with original samples
        pass

    resp = {
        "file": latest.name,
        "rows_raw": int(len(df)),
        "rows": unique_persons,
        "sample": sample,
        "start_date": start_date_iso,
        "end_date": end_date_iso,
        "city": city_slug
    }
    return jsonify(resp)

