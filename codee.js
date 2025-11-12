from fastapi.encoders import jsonable_encoder
import numpy as np
import pandas as pd

def clean_nans(obj):
    """
    Recursively convert problematic values to JSON-safe Python types:
      - np.nan, np.inf, -np.inf -> None
      - numpy / pandas scalar types -> native Python scalars
      - pandas.Timestamp -> ISO string
    Works for dicts, lists, scalars.
    """
    # dict
    if isinstance(obj, dict):
        return {str(k): clean_nans(v) for k, v in obj.items()}

    # list/tuple
    if isinstance(obj, (list, tuple)):
        return [clean_nans(v) for v in obj]

    # pandas Timestamp / datetime-like
    if isinstance(obj, pd.Timestamp):
        if pd.isna(obj):
            return None
        return obj.isoformat()

    # numpy scalar (int64, float64, bool_)
    if isinstance(obj, (np.integer, np.int64, np.int32)):
        return int(obj)
    if isinstance(obj, (np.floating, np.float64, np.float32)):
        # check NaN / inf
        f = float(obj)
        if math.isnan(f) or math.isinf(f):
            return None
        return f
    if isinstance(obj, (np.bool_,)):
        return bool(obj)

    # float (python float) -> check nan/inf
    if isinstance(obj, float):
        if math.isnan(obj) or math.isinf(obj):
            return None
        return obj

    # None or already-JSON-safe primitive (str, int, bool)
    if obj is None or isinstance(obj, (str, int, bool)):
        return obj

    # For other unsupported numeric-like objects, try to coerce via float/int
    try:
        if hasattr(obj, "item"):   # numpy/pandas scalars
            val = obj.item()
            return clean_nans(val)
    except Exception:
        pass

    # Fallback: convert to string (safe) — but prefer None for unknown floats
    try:
        return str(obj)
    except Exception:
        return None


