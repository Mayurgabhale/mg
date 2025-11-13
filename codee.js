(.venv) PS C:\Users\W0024618\Desktop\Trend Analysis\backend> python app.py
>>
  File "C:\Users\W0024618\Desktop\Trend Analysis\backend\app.py", line 1098
    if not s.get('imageUrl') and s.get('EmployeeID'):
    ^^
SyntaxError: expected 'except' or 'finally' block
(.venv) PS C:\Users\W0024618\Desktop\Trend Analysis\backend> 
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

# ---------- small helpers ----------
def _slug_city(city: str) -> str:
    if not city:
        return "pune"
    return str(city).strip().lower().replace(" ", "_")

# minimal id normalization helper
def _normalize_id_local(v):
    try:
        if v is None:
            return None
        s = str(v).strip()
        if s == '' or s.lower() in ('nan','none','null','-'):
            return None
        if '.' in s:
            try:
                f = float(s)
                if math.isfinite(f) and f.is_integer():
                    return str(int(f))
            except Exception:
                pass
        return s
    except Exception:
        return None


# ---------- overrides file helpers ----------
def _load_overrides():
    if not OVERRIDES_FILE.exists():
        return {}
    try:
        df = pd.read_csv(OVERRIDES_FILE, dtype=str)
        out = {}
        for _, r in df.iterrows():
            emp = str(r.get('EmployeeID') or r.get('person_uid') or '').strip()
            if not emp:
                continue
            out[emp] = {
                'level': str(r.get('OverrideLevel') or '').strip(),
                'reason': str(r.get('Reason') or '').strip(),
                'ts': str(r.get('Timestamp') or '').strip()
            }
        return out
    except Exception:
        logging.exception("Failed reading overrides file")
        return {}

def _save_override(employee_key, level, reason):
    now = datetime.now().isoformat()
    row = {'EmployeeID': employee_key, 'OverrideLevel': level, 'Reason': reason or '', 'Timestamp': now}
    try:
        if OVERRIDES_FILE.exists():
            df = pd.read_csv(OVERRIDES_FILE, dtype=str)
            df = pd.concat([df, pd.DataFrame([row])], ignore_index=True)
        else:
            df = pd.DataFrame([row])
        df.to_csv(OVERRIDES_FILE, index=False)
        return True
    except Exception:
        logging.exception("Failed to save override")
        return False

# ODBC driver (env or default)
ODBC_DRIVER = os.getenv("ODBC_DRIVER", "ODBC Driver 17 for SQL Server")
if not has_cors:
    @app.after_request
    def _add_cors_headers(resp):
        # relaxed for dev — you can tighten this in prod
        resp.headers['Access-Control-Allow-Origin'] = '*'
        resp.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization'
        resp.headers['Access-Control-Allow-Methods'] = 'GET, POST, OPTIONS'
        return resp

# ---------- ACVSCore connection + image helpers ----------
_acvscore_backoff = {"ts": None, "failed": False}
_ACVSCORE_BACKOFF_SECONDS = 20

def _get_acvscore_conn():
    try:
        import pyodbc
    except Exception:
        logging.debug("pyodbc not installed; ACVSCore lookups unavailable.")
        return None

    now = datetime.now().timestamp()
    last = _acvscore_backoff.get("ts")
    if last and _acvscore_backoff.get("failed") and (now - last) < _ACVSCORE_BACKOFF_SECONDS:
        logging.debug("Skipping ACVSCore connection attempt (backoff active).")
        return None

    tried = []
    for region_key, rc in (REGION_CONFIG or {}).items():
        server = rc.get("server")
        user = rc.get("user")
        pwd = rc.get("password")
        if not server:
            continue

        # SQL auth
        if user and pwd:
            tried.append(f"{region_key}@{server}(sql)")
            conn_str = (
                f"DRIVER={{{ODBC_DRIVER}}};SERVER={server};DATABASE=ACVSCore;UID={user};PWD={pwd};TrustServerCertificate=Yes;"
            )
            try:
                conn = pyodbc.connect(conn_str, autocommit=True, timeout=5)
                logging.info("Connected to ACVSCore on server %s using REGION_CONFIG[%s] (sql auth).", server, region_key)
                _acvscore_backoff["ts"] = None
                _acvscore_backoff["failed"] = False
                return conn
            except Exception as e:
                logging.debug("SQL auth to %s failed: %s", server, e)

        # Trusted connection fallback
        tried.append(f"{region_key}@{server}(trusted)")
        conn_str_trusted = (
            f"DRIVER={{{ODBC_DRIVER}}};SERVER={server};DATABASE=ACVSCore;Trusted_Connection=yes;TrustServerCertificate=Yes;"
        )
        try:
            conn = pyodbc.connect(conn_str_trusted, autocommit=True, timeout=5)
            logging.info("Connected to ACVSCore on server %s using REGION_CONFIG[%s] (trusted connection).", server, region_key)
            _acvscore_backoff["ts"] = None
            _acvscore_backoff["failed"] = False
            return conn
        except Exception as e:
            logging.debug("Trusted connection to %s failed: %s", server, e)
            continue

    # fallback to global ACVSCORE_DB_CONFIG if present
    try:
        if 'ACVSCORE_DB_CONFIG' in globals() and isinstance(globals().get('ACVSCORE_DB_CONFIG'), dict):
            cfg = globals().get('ACVSCORE_DB_CONFIG')
            server = cfg.get('server')
            user = cfg.get('user')
            pwd = cfg.get('password')
            database = cfg.get('database', 'ACVSCore')
            tried.append(f"ACVSCORE_DB_CONFIG@{server}")
            try:
                conn_str = (
                    f"DRIVER={{{ODBC_DRIVER}}};SERVER={server};DATABASE={database};UID={user};PWD={pwd};TrustServerCertificate=Yes;"
                )
                conn = pyodbc.connect(conn_str, autocommit=True, timeout=5)
                logging.info("Connected to ACVSCore using ACVSCORE_DB_CONFIG (%s).", server)
                _acvscore_backoff["ts"] = None
                _acvscore_backoff["failed"] = False
                return conn
            except Exception as e:
                logging.debug("ACVSCORE_DB_CONFIG connection failed: %s", e)
    except Exception:
        logging.debug("ACVSCORE_DB_CONFIG fallback not available or failed.")

    _acvscore_backoff["ts"] = now
    _acvscore_backoff["failed"] = True
    logging.error("Failed to connect to ACVSCore. Tried: %s", tried)
    return None

MODELS_DIR = Path(__file__).parent / "models"
_loaded_models = {}
def load_model(name):
    if name in _loaded_models:
        return _loaded_models[name]
    p = MODELS_DIR / f"{name}.joblib"
    if not p.exists():
        return None
    data = joblib.load(p)
    _loaded_models[name] = data
    return data



def get_personnel_info(candidate_identifier: object) -> Dict[str, Any]:
    """
    Try to resolve personnel record using a flexible lookup.
    Returns dict with keys: ObjectID (may be None), GUID, Name, EmailAddress, EmployeeEmail, ManagerEmail
    If resolution fails returns empty dict.
    """
    out: Dict[str, Any] = {}
    if candidate_identifier is None:
        return out
    conn = _get_acvscore_conn()
    if conn is None:
        return out

    try:
        cur = conn.cursor()
        sql = """
            SELECT TOP 1 ObjectID, GUID, Name, EmailAddress, ManagerEmail
            FROM ACVSCore.Access.Personnel
            WHERE
              (CAST(ObjectID AS NVARCHAR(200)) = ?)
              OR (GUID = ?)
              OR (CAST(Int1 AS NVARCHAR(200)) = ?)
              OR (Text12 = ?)
              OR (Name = ?)
            ORDER BY ObjectID DESC
        """
        cand = str(candidate_identifier).strip()
        params = (cand, cand, cand, cand, cand)
        cur.execute(sql, params)
        row = cur.fetchone()
        if row:
            # defensive: normalize and produce EmployeeEmail alias
            objid = row[0] if len(row) > 0 else None
            guid = row[1] if len(row) > 1 else None
            name = row[2] if len(row) > 2 else None
            email = row[3] if len(row) > 3 else None
            mgr =  row[4] if len(row) > 4 else None

            out['ObjectID'] = objid
            out['GUID'] = guid
            out['Name'] = name
            out['EmailAddress'] = email
            # add alias so callers that expect EmployeeEmail will find it
            out['EmployeeEmail'] = email
            out['ManagerEmail'] = mgr
    except Exception:
        logging.exception("Failed personnel lookup for candidate: %s", candidate_identifier)
    finally:
        try:
            cur.close()
        except Exception:
            pass
        try:
            conn.close()
        except Exception:
            pass

    return out



def get_person_image_bytes(parent_id) -> Optional[bytes]:
    """
    Query ACVSCore.Access.Images for top image where ParentId ~ parent_id and return raw bytes.
    Handles common ParentId variants (numeric, 'emp:<id>' prefix, GUID-containing).
    Returns None if not found or on error.
    """
    conn = _get_acvscore_conn()
    if conn is None:
        return None
    try:
        cur = conn.cursor()

        # Try 1: exact match (most common)
        sql = """
            SELECT TOP 1 AI.Image
            FROM ACVSCore.Access.Images AI
            WHERE AI.ParentId = ?
              AND DATALENGTH(AI.Image) > 0
            ORDER BY AI.ObjectID DESC
        """
        try:
            cur.execute(sql, (str(parent_id),))
            row = cur.fetchone()
            if row and row[0] is not None:
                try:
                    return bytes(row[0])
                except Exception:
                    return row[0]
        except Exception:
            # swallow per-attempt errors and try fallbacks
            logging.debug("get_person_image_bytes: primary query failed for ParentId=%s", parent_id)

        # Try 2: prefixed parent id (common pattern: 'emp:<id>')
        try:
            pref = f"emp:{str(parent_id)}"
            sql2 = """
                SELECT TOP 1 AI.Image
                FROM ACVSCore.Access.Images AI
                WHERE (AI.ParentId = ?)
                  AND DATALENGTH(AI.Image) > 0
                ORDER BY AI.ObjectID DESC
            """
            cur.execute(sql2, (pref,))
            row = cur.fetchone()
            if row and row[0] is not None:
                try:
                    return bytes(row[0])
                except Exception:
                    return row[0]
        except Exception:
            logging.debug("get_person_image_bytes: prefixed query failed for ParentId=%s", parent_id)

        # Try 3: parent id might be embedded or GUID-like; use LIKE (slow but fallback)
        try:
            s = str(parent_id)
            # basic guard: only use LIKE for short tokens or GUID-like values
            if len(s) <= 64:
                sql3 = """
                    SELECT TOP 1 AI.Image
                    FROM ACVSCore.Access.Images AI
                    WHERE AI.ParentId LIKE '%' + ? + '%'
                      AND DATALENGTH(AI.Image) > 0
                    ORDER BY AI.ObjectID DESC
                """
                cur.execute(sql3, (s,))
                row = cur.fetchone()
                if row and row[0] is not None:
                    try:
                        return bytes(row[0])
                    except Exception:
                        return row[0]
        except Exception:
            logging.debug("get_person_image_bytes: LIKE fallback failed for ParentId=%s", parent_id)

    except Exception:
        logging.exception("Failed to fetch image for ParentId=%s", parent_id)
    finally:
        try:
            cur.close()
        except Exception:
            pass
        try:
            conn.close()
        except Exception:
            pass
    return None

# ---------- CORS / App setup ----------
try:
    from flask_cors import CORS
    has_cors = True
except Exception:
    CORS = None
    has_cors = False

app = Flask(__name__, static_folder=None)
if has_cors:
    CORS(app)
else:
    logging.warning("flask_cors not available; continuing without CORS.")

logging.basicConfig(level=logging.INFO)

# optional excel styling
try:
    from openpyxl import load_workbook
    from openpyxl.styles import Font, Alignment, Border, Side
    OPENPYXL_AVAILABLE = True
except Exception:
    OPENPYXL_AVAILABLE = False

# ---------- small utilities ----------
def _to_python_scalar(x):
    try:
        import pandas as _pd
        if isinstance(x, _pd.Timestamp):
            return x.to_pydatetime().isoformat()
    except Exception:
        pass
    try:
        import numpy as _np
        if isinstance(x, _np.generic):
            v = x.item()
            if isinstance(v, float) and _np.isnan(v):
                return None
            return v
    except Exception:
        pass
    try:
        if isinstance(x, float) and math.isnan(x):
            return None
    except Exception:
        pass
    if isinstance(x, (datetime,)):
        return x.isoformat()
    if isinstance(x, (bool, int, str, type(None), float)):
        return x
    try:
        return str(x)
    except Exception:
        return None

def format_seconds_to_hms(seconds) -> str:
    """
    Convert seconds (float/int/None) -> HH:MM:SS string.
    Accepts None or non-numeric and returns None.
    """
    try:
        if seconds is None:
            return None
        s = float(seconds)
        if not (s is not None and (s == s) and s >= 0):  # NaN check
            return None
        total = int(round(s))
        hh = total // 3600
        mm = (total % 3600) // 60
        ss = total % 60
        return f"{hh:02d}:{mm:02d}:{ss:02d}"
    except Exception:
        return None


_uuid_like_re = re.compile(r'^[0-9a-fA-F]{8}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{12}$')
def _looks_like_guid(s):
    try:
        if not s or not isinstance(s, str):
            return False
        s = s.strip()
        return bool(_uuid_like_re.match(s)) or s.startswith('name:') or s.startswith('emp:') or s.startswith('uid:')
    except Exception:
        return False

_PLACEHOLDER_STRS = set(['', 'nan', 'na', 'n/a', '-', '—', '–', 'none', 'null'])
def _is_placeholder_str(s: object) -> bool:
    try:
        if s is None:
            return True
        st = str(s).strip().lower()
        return st in _PLACEHOLDER_STRS
    except Exception:
        return False

def _replace_placeholder_strings(df: pd.DataFrame) -> pd.DataFrame:
    if df is None or df.empty:
        return df
    for col in df.columns:
        try:
            if df[col].dtype == object:
                df[col] = df[col].apply(lambda x: None if (isinstance(x, str) and x.strip().lower() in _PLACEHOLDER_STRS) else x)
        except Exception:
            continue
    return df

_CARD_XML_RE = re.compile(r'<Card>([^<]+)</Card>', re.IGNORECASE | re.DOTALL)
def _extract_card_from_xml_text(txt):
    try:
        if not txt or not isinstance(txt, str):
            return None
        m = _CARD_XML_RE.search(txt)
        if m:
            return m.group(1).strip()
        m2 = re.search(r'CHUID.*?Card.*?[:=]\s*([0-9A-Za-z\-\_]+)', txt, re.IGNORECASE | re.DOTALL)
        if m2:
            return m2.group(1).strip()
    except Exception:
        pass
    return None

def _find_swipe_files(outdir: Path, date_obj: Optional[date] = None, city_slug: Optional[str] = None):
    p = Path(outdir)
    if not p.exists():
        return []
    candidates = []
    if date_obj:
        target = date_obj.strftime("%Y%m%d")
        patterns = [
            f"swipes_*_{target}.csv",
            f"swipes_{city_slug}_*_{target}.csv" if city_slug else None,
            f"swipe_*_{target}.csv",
            f"*_{target}.csv"
        ]
    else:
        patterns = [
            "swipes_*.csv",
            f"swipes_{city_slug}_*.csv" if city_slug else None,
            "swipe_*.csv",
            "swipes_*.csv"
        ]
    seen = set()
    for pat in patterns:
        if not pat:
            continue
        for fp in sorted(p.glob(pat), reverse=True):
            if fp.name not in seen:
                seen.add(fp.name)
                candidates.append(fp)
    if not candidates:
        for fp in sorted(p.glob("*.csv"), reverse=True):
            ln = fp.name.lower()
            if 'swipe' in ln or 'card' in ln or 'locale' in ln or 'localemessagetime' in ln:
                if fp.name not in seen:
                    seen.add(fp.name)
                    candidates.append(fp)
    return candidates

def _resolve_field_from_record(record: dict, candidate_tokens: list):
    if record is None:
        return None
    for key in candidate_tokens:
        if key in record:
            v = record.get(key)
            if v is None:
                continue
            if isinstance(v, float) and math.isnan(v):
                continue
            sval = str(v).strip()
            if sval and not _is_placeholder_str(sval):
                return _to_python_scalar(v)
    lower_keys = {k.lower(): k for k in record.keys()}
    for tok in candidate_tokens:
        tok_l = tok.lower()
        for lk, orig_key in lower_keys.items():
            if tok_l in lk:
                v = record.get(orig_key)
                if v is None:
                    continue
                if isinstance(v, float) and math.isnan(v):
                    continue
                sval = str(v).strip()
                if sval and not _is_placeholder_str(sval):
                    return _to_python_scalar(v)
    card_like = any(tok.lower() in ('cardnumber', 'chuid', 'card') for tok in candidate_tokens)
    if card_like:
        for lk, orig_key in lower_keys.items():
            if 'xml' in lk or 'xmlmessage' in lk or 'xml_msg' in lk or 'msg' in lk or 'value' == lk:
                v = record.get(orig_key)
                if v is None:
                    continue
                try:
                    txt = str(v)
                    extracted = _extract_card_from_xml_text(txt)
                    if extracted and not _is_placeholder_str(extracted):
                        return _to_python_scalar(extracted)
                except Exception:
                    continue
    for k, v in record.items():
        if v is None:
            continue
        if isinstance(v, float) and math.isnan(v):
            continue
        sval = str(v).strip()
        if sval and not _is_placeholder_str(sval):
            return _to_python_scalar(v)
    return None






def _clean_sample_df(df: pd.DataFrame,max_rows: int = 100):
    if df is None or df.empty:
        return []
    df = df.copy()
    cols_to_fix = [c for c in df.columns if c.endswith('_x') or c.endswith('_y')]
    for c in cols_to_fix:
        base = c[:-2]
        if base in df.columns:
            try:
                df.drop(columns=[c], inplace=True)
            except Exception:
                pass
        else:
            try:
                df.rename(columns={c: base}, inplace=True)
            except Exception:
                pass
    if 'Date' in df.columns:
        try:
            df['Date'] = pd.to_datetime(df['Date'], errors='coerce').dt.date
            df['Date'] = df['Date'].apply(lambda d: d.isoformat() if pd.notna(d) else None)
        except Exception:
            pass
    for dtcol in ('FirstSwipe', 'LastSwipe', 'LocaleMessageTime'):
        if dtcol in df.columns:
            try:
                df[dtcol] = pd.to_datetime(df[dtcol], errors='coerce')
                df[dtcol] = df[dtcol].apply(lambda t: t.to_pydatetime().isoformat() if pd.notna(t) else None)
            except Exception:
                try:
                    df[dtcol] = df[dtcol].astype(str).replace('NaT', None)
                except Exception:
                    pass
    df = df.where(pd.notnull(df), None)
    rows = df.head(max_rows).to_dict(orient='records')
    cleaned = []

    # helper regex to find GUIDs inside text
    GUID_IN_TEXT_RE = re.compile(r'[0-9a-fA-F]{8}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{12}')

    for r in rows:
        out = {}
        # copy existing columns with scalar conversion
        for k, v in r.items():
            out[k] = _to_python_scalar(v)

        # Prefer feature/duration-derived name fields if present in the raw record
        # Candidate tokens in order:
        name_tokens = ['EmployeeName_feat', 'EmployeeName_dur', 'EmployeeName', 'ObjectName1', 'objectname1', 'employee_name', 'name']
        resolved_name = _resolve_field_from_record(r, name_tokens)
        if resolved_name:
            out['EmployeeName'] = resolved_name
        else:
            # if name is placeholder or looks like guid, try to use EmployeeID as fallback name only if no better name
            maybe_name = out.get('EmployeeName')
            emp_id = out.get('EmployeeID') or out.get('EmployeeIdentity') or out.get('person_uid')
            if (maybe_name in (None, '', 'nan')) or (_looks_like_guid(maybe_name) if isinstance(maybe_name, str) else False):
                if emp_id and not _looks_like_guid(emp_id):
                    out['EmployeeName'] = str(emp_id)

        # --- NEW: Ensure EmployeeID surfaced from best candidates (feat/dur/int/text12) ---
        try:
            emp_candidates = ['EmployeeID_feat', 'EmployeeID_dur', 'EmployeeID', 'Int1', 'Text12']
            emp_val = _resolve_field_from_record(r, emp_candidates)
            if emp_val:
                # normalize floats like '320172.0' -> '320172'
                try:
                    s = str(emp_val).strip()
                    if '.' in s:
                        f = float(s)
                        if math.isfinite(f) and f.is_integer():
                            s = str(int(f))
                    emp_val = s
                except Exception:
                    pass
                # avoid GUID-looking values for EmployeeID
                if not _looks_like_guid(str(emp_val)):
                    out['EmployeeID'] = emp_val
        except Exception:
            pass

        # Ensure EmployeeID normalized as string where possible (keep existing logic)
        if 'EmployeeID' in out and isinstance(out['EmployeeID'], str) and _looks_like_guid(out['EmployeeID']):
            out['EmployeeID'] = None

        # Duration: prefer explicit Duration strings, then _dur/_feat, then compute from seconds/minutes
        dur_val = _resolve_field_from_record(r, ['Duration', 'Duration_dur', 'Duration_feat'])
        if dur_val:
            out['Duration'] = str(dur_val)
        else:
            # try DurationSeconds
            ds = r.get('DurationSeconds') if 'DurationSeconds' in r else None
            dm = r.get('DurationMinutes') if 'DurationMinutes' in r else None
            try:
                if ds not in (None, '', 'nan') and not (isinstance(ds, float) and math.isnan(ds)):
                    out['Duration'] = format_seconds_to_hms(float(ds))
                elif dm not in (None, '', 'nan') and not (isinstance(dm, float) and math.isnan(dm)):
                    out['Duration'] = format_seconds_to_hms(float(dm) * 60.0)
            except Exception:
                out['Duration'] = out.get('Duration') or None

        # Also include DurationSeconds/Minutes explicitly when present for front-end use
        if 'DurationSeconds' in r and r.get('DurationSeconds') not in (None, '', 'nan'):
            try:
                out['DurationSeconds'] = float(r.get('DurationSeconds'))
            except Exception:
                out['DurationSeconds'] = _to_python_scalar(r.get('DurationSeconds'))
        if 'DurationMinutes' in r and r.get('DurationMinutes') not in (None, '', 'nan'):
            try:
                out['DurationMinutes'] = float(r.get('DurationMinutes'))
            except Exception:
                out['DurationMinutes'] = _to_python_scalar(r.get('DurationMinutes'))

        # --- NEW: coalesce CardNumber from feat/dur/raw columns ---
        try:
            card_val = _resolve_field_from_record(r, ['CardNumber_feat', 'CardNumber_dur', 'CardNumber', 'Card', 'CHUID', 'card', 'value', 'xmlmessage'])
            if card_val:
                cs = str(card_val).strip()
                if _looks_like_guid(cs) or _is_placeholder_str(cs):
                    card_val = None
                else:
                    card_val = cs
            out['CardNumber'] = card_val
        except Exception:
            out['CardNumber'] = out.get('CardNumber') or None

        # --- NEW: ensure EmployeeID is normalized also as string and present in out (fallbacks) ---
        try:
            if not out.get('EmployeeID'):
                emp_val2 = _resolve_field_from_record(r, ['EmployeeID_feat', 'EmployeeID_dur', 'EmployeeID', 'Int1', 'Text12'])
                if emp_val2:
                    s = str(emp_val2).strip()
                    try:
                        if '.' in s:
                            f = float(s)
                            if math.isfinite(f) and f.is_integer():
                                s = str(int(f))
                    except Exception:
                        pass
                    if not _looks_like_guid(s) and not _is_placeholder_str(s):
                        out['EmployeeID'] = s
        except Exception:
            pass

        # --- NEW: Replace GUIDs inside ViolationExplanation/Explanation using EmployeeName + EmployeeID if present ---
        try:
            expl = out.get('ViolationExplanation') or out.get('Explanation') or None
            if expl and isinstance(expl, str) and GUID_IN_TEXT_RE.search(expl):
                # compose best display identity: prefer name then id
                name_part = out.get('EmployeeName') or ''
                id_part = out.get('EmployeeID') or ''
                display = None
                if name_part and id_part:
                    display = f"{name_part} ({id_part})"
                elif name_part:
                    display = f"{name_part}"
                elif id_part:
                    display = f"{id_part}"
                if display:
                    out['ViolationExplanation'] = GUID_IN_TEXT_RE.sub(str(display), expl)
                    out['Explanation'] = out.get('ViolationExplanation')
        except Exception:
            pass

        cleaned.append(out)
    return cleaned


# -----------------------
# Routes
# -----------------------
@app.route('/')
def root():
    return "Trend Analysis API — Multi-city"

@app.route('/run', methods=['GET', 'POST'])
def run_trend():
    params = {}
    if request.method == 'GET':
        params = request.args.to_dict()
    else:
        if request.is_json:
            params = request.get_json(force=True) or {}
        else:
            try:
                params = request.form.to_dict() or {}
            except Exception:
                params = {}

    date_str = (params.get('date') or params.get('Date') or '').strip() or None
    start_str = (params.get('start') or params.get('Start') or '').strip() or None
    end_str = (params.get('end') or params.get('End') or '').strip() or None

    dates = []
    try:
        if date_str:
            dt = datetime.strptime(date_str, "%Y-%m-%d").date()
            dates = [dt]
        elif start_str and end_str:
            s = datetime.strptime(start_str, "%Y-%m-%d").date()
            e = datetime.strptime(end_str, "%Y-%m-%d").date()
            if e < s:
                return jsonify({"error":"end must be >= start"}), 400
            cur = s
            while cur <= e:
                dates.append(cur)
                cur = cur + timedelta(days=1)
        else:
            today = datetime.now().date()
            yesterday = today - timedelta(days=1)
            dates = [yesterday, today]
    except Exception as e:
        return jsonify({"error": f"Invalid date format: {e}"}), 400

    regions_param = params.get('regions') or params.get('region') or ''
    if regions_param:
        regions = [r.strip().lower() for r in re.split(r'[;,|]', str(regions_param)) if r.strip()]
    else:
        try:
            regions = [k.lower() for k in list(REGION_CONFIG.keys())]
        except Exception:
            regions = ['apac']

    valid_regions = []
    for r in regions:
        if r in (REGION_CONFIG or {}):
            valid_regions.append(r)
        else:
            logging.debug("Requested region '%s' not in REGION_CONFIG - skipping", r)
    if not valid_regions:
        valid_regions = [k.lower() for k in REGION_CONFIG.keys()] if REGION_CONFIG else ['apac']
    params['_regions_to_run'] = valid_regions

    city_param = params.get('city') or params.get('site') or params.get('site_name') or None
    city_slug = _slug_city(city_param) if city_param else None
    params['_city'] = city_slug

    combined_rows = []
    files = []

    for d in dates:
        try:
            if run_trend_for_date is None:
                raise RuntimeError("run_trend_for_date helper not available in trend_runner")
            try:
                df = run_trend_for_date(d, regions=valid_regions, outdir=str(DEFAULT_OUTDIR), city=city_slug)
            except TypeError:
                try:
                    df = run_trend_for_date(d, outdir=str(DEFAULT_OUTDIR))
                except Exception:
                    # Last-resort: try duration_report fallback if available
                    try:
                        from duration_report import run_for_date as _dr_run_for_date
                        region_results = _dr_run_for_date(d, valid_regions, str(DEFAULT_OUTDIR), city_param)
                        combined_list = []
                        for rkey, res in (region_results or {}).items():
                            try:
                                df_dur = res.get('durations')
                                if df_dur is not None and not df_dur.empty:
                                    combined_list.append(df_dur)
                            except Exception:
                                continue
                        df = pd.concat(combined_list, ignore_index=True) if combined_list else pd.DataFrame()
                    except Exception:
                        raise
        except Exception as e:
            logging.exception("run_trend_for_date failed for %s", d)
            return jsonify({"error": f"runner failed for {d}: {e}"}), 500

        csv_path = DEFAULT_OUTDIR / f"trend_{city_slug}_{d.strftime('%Y%m%d')}.csv"
        if csv_path.exists():
            files.append(csv_path.name)

        if df is None or (hasattr(df, 'empty') and df.empty):
            continue

        try:
            df = _replace_placeholder_strings(df)
        except Exception:
            pass

        if 'IsFlagged' not in df.columns:
            df['IsFlagged'] = False
        if 'Reasons' not in df.columns:
            df['Reasons'] = None

        combined_rows.append(df)

    combined_df = pd.concat(combined_rows, ignore_index=True) if combined_rows else pd.DataFrame()
    combined_df = _replace_placeholder_strings(combined_df)

    try:
        if not combined_df.empty:
            if 'person_uid' in combined_df.columns:
                raw_unique_person_uids = int(combined_df['person_uid'].dropna().astype(str).nunique())
            elif 'EmployeeID' in combined_df.columns:
                raw_unique_person_uids = int(combined_df['EmployeeID'].dropna().astype(str).nunique())
            else:
                raw_unique_person_uids = int(len(combined_df))
        else:
            raw_unique_person_uids = 0
    except Exception:
        raw_unique_person_uids = int(len(combined_df)) if combined_df is not None else 0

    try:
        if not combined_df.empty and 'IsFlagged' in combined_df.columns:
            flagged_df = combined_df[combined_df['IsFlagged'] == True].copy()
        else:
            flagged_df = pd.DataFrame()
    except Exception:
        flagged_df = pd.DataFrame()

    try:
        analysis_count = int(raw_unique_person_uids)
    except Exception:
        analysis_count = int(len(combined_df)) if combined_df is not None else 0

    try:
        flagged_count = int(len(flagged_df))
        flagged_rate_pct = float((flagged_count / analysis_count * 100.0) if analysis_count and analysis_count > 0 else 0.0)
    except Exception:
        flagged_count = int(len(flagged_df))
        flagged_rate_pct = 0.0

    try:
        sample_source = flagged_df if not flagged_df.empty else combined_df
        samples = _clean_sample_df(sample_source.head(10), max_rows=10) if sample_source is not None and not sample_source.empty else []
    except Exception:
        samples = []

    resp = {
        "start_date": dates[0].isoformat() if dates else None,
        "end_date": dates[-1].isoformat() if dates else None,
        "aggregated_rows_total_raw": int(len(combined_df)),
        "aggregated_unique_persons": int(analysis_count),
        "rows": int(analysis_count),
        "flagged_rows": int(flagged_count),
        "flagged_rate_percent": float(flagged_rate_pct),
        "files": files,
        "sample": (samples[:10] if isinstance(samples, list) else samples),
        "reasons_count": {},
        "risk_counts": {},
        "flagged_persons": (samples if samples else []),
        "_raw_unique_person_uids": int(raw_unique_person_uids),
        "regions_run": params.get('_regions_to_run', []),
        "city_used": city_slug
    }

    return jsonify(resp)



@app.route('/latest', methods=['GET'])
def latest_results():
    city_param = request.args.get('city') or request.args.get('site') or 'pune'
    city_slug = _slug_city(city_param)

    p = Path(DEFAULT_OUTDIR)
    csvs = sorted(p.glob(f"trend_{city_slug}_*.csv"), reverse=True)
    if not csvs:
        csvs = sorted(p.glob("trend_*.csv"), reverse=True)
    if not csvs:
        return jsonify({"error": "no outputs found"}), 404
    latest = csvs[0]

    start_date_iso = None
    end_date_iso = None
    try:
        m = re.search(r'(\d{8})', latest.name)
        if m:
            ymd = m.group(1)
            dt = datetime.strptime(ymd, "%Y%m%d").date()
            start_date_iso = dt.isoformat()
            end_date_iso = dt.isoformat()
    except Exception:
        start_date_iso = None
        end_date_iso = None

    try:
        df = pd.read_csv(latest)
    except Exception:
        df = pd.read_csv(latest, dtype=str)

    df = _replace_placeholder_strings(df)

    id_candidates = ['person_uid', 'EmployeeID', 'EmployeeIdentity', 'Int1']
    id_col = next((c for c in id_candidates if c in df.columns), None)

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

# old..... start👇👇👇👇
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
        # defensive: if enrichment fails entirely, continue with original samples
        pass
# old..... start end 👆👆👆
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



@app.route('/record', methods=['GET'])
def get_record():
    q = request.args.get('employee_id') or request.args.get('person_uid')
    include_unflagged = str(request.args.get('include_unflagged', '')).lower() in ('1', 'true', 'yes')
    city_param = request.args.get('city') or request.args.get('site') or 'pune'
    city_slug = _slug_city(city_param)

    p = Path(DEFAULT_OUTDIR)
    csvs = sorted(p.glob(f"trend_{city_slug}_*.csv"), reverse=True)
    if not csvs:
        csvs = sorted(p.glob("trend_*.csv"), reverse=True)
    if not csvs:
        return jsonify({'aggregated_rows': [], 'raw_swipe_files': [], 'raw_swipes': []}), 200

    df_list = []
    for fp in csvs:
        try:
            tmp = pd.read_csv(fp, parse_dates=['Date', 'FirstSwipe', 'LastSwipe'])
        except Exception:
            try:
                tmp = pd.read_csv(fp, dtype=str)
                if 'Date' in tmp.columns:
                    tmp['Date'] = pd.to_datetime(tmp['Date'], errors='coerce').dt.date
            except Exception:
                continue
        df_list.append(tmp)
    if not df_list:
        return jsonify({'aggregated_rows': [], 'raw_swipe_files': [], 'raw_swipes': []}), 200
    df = pd.concat(df_list, ignore_index=True)

    df = _replace_placeholder_strings(df)

    if q is None:
        cleaned = _clean_sample_df(df, max_rows=10)
        return jsonify({'aggregated_rows': cleaned, 'raw_swipe_files': [], 'raw_swipes': []}), 200

    q_str = str(q).strip()
    def normalize_series(s):
        if s is None:
            return pd.Series([''] * len(df))
        s = s.fillna('').astype(str).str.strip()
        def _norm_val(v):
            if not v:
                return ''
            try:
                if '.' in v:
                    fv = float(v)
                    if fv.is_integer():
                        return str(int(fv))
            except Exception:
                pass
            return v
        return s.map(_norm_val)

    found_mask = pd.Series(False, index=df.index)
    if 'EmployeeID' in df.columns:
        emp_series = normalize_series(df['EmployeeID'])
        found_mask = found_mask | (emp_series == q_str)
    if 'person_uid' in df.columns:
        uid_series = normalize_series(df['person_uid'])
        found_mask = found_mask | (uid_series == q_str)
    if 'Int1' in df.columns and not found_mask.any():
        int1_series = normalize_series(df['Int1'])
        found_mask = found_mask | (int1_series == q_str)

    if not found_mask.any():
        try:
            q_numeric = float(q_str)
            if 'EmployeeID' in df.columns:
                emp_numeric = pd.to_numeric(df['EmployeeID'], errors='coerce')
                found_mask = found_mask | (emp_numeric == q_numeric)
            if 'Int1' in df.columns and not found_mask.any():
                int_numeric = pd.to_numeric(df['Int1'], errors='coerce')
                found_mask = found_mask | (int_numeric == q_numeric)
        except Exception:
            pass

    matched = df[found_mask].copy()
    if matched.empty:
        return jsonify({'aggregated_rows': [], 'raw_swipe_files': [], 'raw_swipes': []}), 200

    cleaned_matched = _clean_sample_df(matched, max_rows=len(matched))



    # enrich aggregated rows (email, image, violation days, explanation)
    try:
        try:
            # lazy import from trend_runner (avoid import-time circular issues)
            from trend_runner import compute_violation_days_map, _strip_uid_prefix as _strip_uid_prefix_tr
            violation_map = compute_violation_days_map(str(DEFAULT_OUTDIR), 90, datetime.now().date())
        except Exception:
            violation_map = {}
            _strip_uid_prefix_tr = (lambda x: x)
    except Exception:
        violation_map = {}
        _strip_uid_prefix_tr = (lambda x: x)

    matched_indexed = matched.reset_index(drop=True)
  

    # more robust candidate resolution + explanation/email/image enrichment
    GUID_IN_TEXT_RE = re.compile(
        r'[0-9a-fA-F]{8}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{12}'
    )

    for idx_c, cleaned in enumerate(cleaned_matched):
        candidate_row = None
        try:
            # 1) try exact matches by person_uid, EmployeeID, EmployeeName
            if cleaned.get('person_uid') and 'person_uid' in matched_indexed.columns:
                mr = matched_indexed[matched_indexed['person_uid'].astype(str).str.strip() == str(cleaned['person_uid']).strip()]
                if not mr.empty:
                    candidate_row = mr.iloc[0].to_dict()

            if candidate_row is None and cleaned.get('EmployeeID') and 'EmployeeID' in matched_indexed.columns:
                mr = matched_indexed[matched_indexed['EmployeeID'].astype(str).str.strip() == str(cleaned['EmployeeID']).strip()]
                if not mr.empty:
                    candidate_row = mr.iloc[0].to_dict()

            if candidate_row is None and cleaned.get('EmployeeName') and 'EmployeeName' in matched_indexed.columns:
                mr = matched_indexed[matched_indexed['EmployeeName'].astype(str).str.strip().str.lower() == str(cleaned['EmployeeName']).strip().lower()]
                if not mr.empty:
                    candidate_row = mr.iloc[0].to_dict()

            # 2) try other useful columns (CardNumber, EmployeeIdentity, Int1, Text12, ObjectIdentity1, ObjectID)
            if candidate_row is None and not matched_indexed.empty:
                for ccol in ('CardNumber', 'EmployeeIdentity', 'Int1', 'Text12', 'ObjectIdentity1', 'ObjectID', 'GUID'):
                    if ccol in matched_indexed.columns and cleaned.get(ccol) not in (None, '', 'nan'):
                        mr = matched_indexed[matched_indexed[ccol].astype(str).str.strip() == str(cleaned.get(ccol)).strip()]
                        if not mr.empty:
                            candidate_row = mr.iloc[0].to_dict()
                            break

            # 3) last resort - take the first matched row (if any)
            if candidate_row is None and not matched_indexed.empty:
                candidate_row = matched_indexed.iloc[0].to_dict()
        except Exception:
            candidate_row = None

        # Build Explanation: prefer explicit Explanation, else build from Reasons
        violation_expl = None
        try:
            if candidate_row:
                violation_expl = candidate_row.get('Explanation') or candidate_row.get('explanation') or None

            if not violation_expl:
                reasons = cleaned.get('Reasons') or (candidate_row.get('Reasons') if candidate_row else None)
                if reasons:
                    parts = [p.strip() for p in re.split(r'[;,\|]', str(reasons)) if p.strip()]
                    mapped = []
                    for p in parts:
                        try:
                            if 'SCENARIO_EXPLANATIONS' in globals() and p in SCENARIO_EXPLANATIONS:
                                mapped.append(SCENARIO_EXPLANATIONS[p](candidate_row or {}))
                            else:
                                mapped.append(p.replace("_", " ").replace(">=", "≥"))
                        except Exception:
                            mapped.append(p)
                    violation_expl = " ".join(mapped) if mapped else None

            # Replace GUIDS that appear inside longer text with a human name (if available)
            if violation_expl:
                try:
                    # prefer candidate_row name, then cleaned name
                    emp_name_for_expl = None
                    if candidate_row:
                        emp_name_for_expl = candidate_row.get('EmployeeName') or candidate_row.get('employee_name') or candidate_row.get('ObjectName1')
                    if not emp_name_for_expl:
                        emp_name_for_expl = cleaned.get('EmployeeName')
                    if emp_name_for_expl:
                        violation_expl = GUID_IN_TEXT_RE.sub(str(emp_name_for_expl), str(violation_expl))
                except Exception:
                    pass
        except Exception:
            violation_expl = None

        # Violation days lookup (unchanged logic)
        try:
            candidates = []
            for k in ('EmployeeID', 'person_uid', 'EmployeeIdentity', 'CardNumber', 'Int1', 'Text12'):
                if cleaned.get(k) not in (None, '', 'nan'):
                    candidates.append(cleaned.get(k))
            if candidate_row:
                for k in ('EmployeeID','person_uid','EmployeeIdentity','CardNumber','Int1','Text12'):
                    if candidate_row.get(k) not in (None,'','nan'):
                        candidates.append(candidate_row.get(k))
            vdays = 0
            if violation_map:
                for c in candidates:
                    if c is None:
                        continue
                    n = _normalize_id_local(c)
                    if n and n in violation_map:
                        vdays = int(violation_map.get(n, 0))
                        break
                    try:
                        stripped = _strip_uid_prefix_tr(str(n))
                        if stripped != n and stripped in violation_map:
                            vdays = int(violation_map.get(stripped, 0))
                            break
                    except Exception:
                        pass
        except Exception:
            vdays = 0

        # personnel lookup (try many tokens)
        personnel_info = {}
        try:
            lookup_candidates = []
            if candidate_row:
                for k in ('EmployeeObjID','EmployeeObjId','EmployeeIdentity','ObjectID','GUID','EmployeeID','Int1','Text12','EmployeeName'):
                    if candidate_row.get(k) not in (None,'','nan'):
                        lookup_candidates.append(candidate_row.get(k))
            for k in ('EmployeeID','person_uid','EmployeeName'):
                if cleaned.get(k) not in (None,'','nan'):
                    lookup_candidates.append(cleaned.get(k))

            # try each candidate till we get a useful personnel_info
            for cand in lookup_candidates:
                if cand is None:
                    continue
                try:
                    info = get_personnel_info(cand)
                    if info and (info.get('ObjectID') is not None or info.get('EmailAddress') is not None or info.get('ManagerEmail') is not None):
                        personnel_info = info
                        break
                except Exception:
                    continue

            # Extra fallback: if still empty and cleaned has EmployeeID, attempt lookup explicitly by EmployeeID
            if not personnel_info:
                try:
                    cand = cleaned.get('EmployeeID') or cleaned.get('EmployeeIdentity')
                    if cand:
                        info = get_personnel_info(cand)
                        if info and (info.get('ObjectID') is not None or info.get('EmailAddress') is not None):
                            personnel_info = info
                except Exception:
                    pass
        except Exception:
            personnel_info = {}

        # Attach computed fields
        try:
            cleaned['ViolationDaysLast90'] = int(vdays or 0)
            cleaned['ViolationExplanation'] = violation_expl
            cleaned['Explanation'] = violation_expl or cleaned.get('ViolationExplanation') or None

            # Ensure EmployeeName is present (prefer cleaned, then candidate_row, then personnel_info Name)
            try:
                if (not cleaned.get('EmployeeName')) or _looks_like_guid(cleaned.get('EmployeeName')):
                    if candidate_row and candidate_row.get('EmployeeName') and not _looks_like_guid(candidate_row.get('EmployeeName')):
                        cleaned['EmployeeName'] = candidate_row.get('EmployeeName')
                    elif personnel_info and personnel_info.get('Name'):
                        cleaned['EmployeeName'] = personnel_info.get('Name')
                # final pass: remove any GUIDs remaining in Explanation
                if cleaned.get('Explanation') and GUID_IN_TEXT_RE.search(str(cleaned.get('Explanation'))):
                    ename = cleaned.get('EmployeeName') or ''
                    cleaned['Explanation'] = GUID_IN_TEXT_RE.sub(str(ename), str(cleaned.get('Explanation')))
            except Exception:
                pass

            # Populate email from personnel_info OR candidate_row OR common columns in matched_indexed
            if personnel_info:
                cleaned['EmployeeObjID'] = personnel_info.get('ObjectID')
                cleaned['EmployeeEmail'] = personnel_info.get('EmailAddress')
                cleaned['ManagerEmail'] = personnel_info.get('ManagerEmail')
            else:
                # try to pick an email-like column from candidate_row
                if not cleaned.get('EmployeeEmail') and candidate_row:
                    for fk in ('Email', 'EmailAddress', 'EmployeeEmail', 'WorkEmail', 'EMail'):
                        if candidate_row.get(fk) not in (None, '', 'nan'):
                            cleaned['EmployeeEmail'] = candidate_row.get(fk)
                            break
                # final attempt: look in matched_indexed columns (if candidate_row didn't have it)
                if not cleaned.get('EmployeeEmail'):
                    for col in ('Email', 'EmailAddress', 'EmployeeEmail', 'WorkEmail', 'EMail'):
                        if col in matched_indexed.columns:
                            try:
                                val = matched_indexed.iloc[0].get(col)
                                if val not in (None, '', 'nan'):
                                    cleaned['EmployeeEmail'] = val
                                    break
                            except Exception:
                                continue

                # image resolution: prefer personnel_info.ObjectID, then candidate_row.ObjectID/EmployeeObjID, otherwise None
                try:
                    img_obj = None
                    if personnel_info and personnel_info.get('ObjectID') is not None:
                        img_obj = personnel_info.get('ObjectID')
                    elif candidate_row:
                        for k in ('EmployeeObjID', 'EmployeeObjId', 'ObjectID', 'ObjectIdentity1'):
                            if candidate_row.get(k) not in (None, '', 'nan'):
                                img_obj = candidate_row.get(k)
                                break

                    if img_obj:
                        # make the image URL absolute so frontend can fetch it regardless of page origin
                        try:
                            base = (request.url_root or request.host_url).rstrip('/')
                        except Exception:
                            base = ''

                       cleaned['imageUrl'] = f"/employee/{img_obj}/image"

                        try:
                            b = get_person_image_bytes(img_obj)
                            cleaned['HasImage'] = True if b else False
                        except Exception:
                            cleaned['HasImage'] = False
                    else:
                        cleaned['imageUrl'] = None
                        cleaned['HasImage'] = False
                except Exception:
                    # if anything went wrong in the image resolution logic, ensure safe defaults
                    cleaned['imageUrl'] = None
                    cleaned['HasImage'] = False
                   
            # ensure EmployeeID surfaced if present in candidate_row
            if not cleaned.get('EmployeeID') and candidate_row:
                for k in ('EmployeeID','Int1','Text12','EmployeeIdentity'):
                    if candidate_row.get(k) not in (None, '', 'nan'):
                        cleaned['EmployeeID'] = candidate_row.get(k)
                        break
        except Exception:
            pass

