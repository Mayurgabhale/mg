import math

def clean_nans(obj):
    """Recursively replace NaN/inf with None in dicts/lists."""
    if isinstance(obj, dict):
        return {k: clean_nans(v) for k, v in obj.items()}
    elif isinstance(obj, list):
        return [clean_nans(v) for v in obj]
    elif isinstance(obj, float):
        if math.isnan(obj) or math.isinf(obj):
            return None
        return obj
    else:
        return obj

summary = clean_nans(summary)
items = clean_nans(items)