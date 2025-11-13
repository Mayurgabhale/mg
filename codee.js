try:
    if isinstance(sample, list) and sample:
        for s in sample:
            try:
                # ... all your existing logic above

                # always provide a relative path to avoid duplicated host prefixes
                if not s.get('imageUrl') and s.get('EmployeeID'):
                    s['imageUrl'] = f"/employee/{s.get('EmployeeID')}/image"

            except Exception:
                # ensure that an exception for a single sample doesn't break everything
                continue
except Exception:
    # defensive: if enrichment fails entirely, continue with original samples
    pass