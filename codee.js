# --- Enrich sample rows with EmployeeEmail and imageUrl (best-effort) ---
try:
    if isinstance(sample, list) and sample:
        for s in sample:
            try:
                # prefer EmployeeID / person_uid / EmployeeName as lookup token
                lookup_token = (
                    s.get('EmployeeID')
                    or s.get('person_uid')
                    or s.get('EmployeeName')
                    or s.get('EmployeeIdentity')
                )
                pi = {}
                if lookup_token:
                    try:
                        pi = get_personnel_info(lookup_token) or {}
                    except Exception:
                        pi = {}

                # set email if found from personnel info
                if pi:
                    email = (
                        pi.get('EmailAddress')
                        or pi.get('EmployeeEmail')
                        or pi.get('Email')
                        or None
                    )
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
                            b = get_person_image_bytes(objid)
                            if not b:
                                try:
                                    b = get_person_image_bytes(f"emp:{objid}")
                                except Exception:
                                    b = None
                            s['HasImage'] = True if b else False
                        except Exception:
                            s['HasImage'] = False

                # fallback: if still no email, try to find the matching row
                if not s.get('EmployeeEmail'):
                    try:
                        match_mask = pd.Series(False, index=df.index)
                        if s.get('person_uid') and 'person_uid' in df.columns:
                            match_mask |= df['person_uid'].astype(str).str.strip() == str(s.get('person_uid')).strip()
                        if s.get('EmployeeID') and 'EmployeeID' in df.columns:
                            match_mask |= df['EmployeeID'].astype(str).str.strip() == str(s.get('EmployeeID')).strip()
                        if (
                            not match_mask.any()
                            and s.get('EmployeeName')
                            and 'EmployeeName' in df.columns
                        ):
                            match_mask |= (
                                df['EmployeeName'].astype(str)
                                .str.strip()
                                .str.lower()
                                == str(s.get('EmployeeName')).strip().lower()
                            )

                        if match_mask.any():
                            idx = df[match_mask].index[0]
                            for col in ('Email', 'EmailAddress', 'EmployeeEmail', 'WorkEmail', 'EMail'):
                                if col in df.columns:
                                    val = df.at[idx, col]
                                    if val not in (None, '', 'nan'):
                                        s['EmployeeEmail'] = val
                                        break
                        else:
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

                # ✅ This must be *inside* the try block
                # always provide a relative path to avoid duplicated host prefixes
                if not s.get('imageUrl') and s.get('EmployeeID'):
                    s['imageUrl'] = f"/employee/{s.get('EmployeeID')}/image"

            except Exception:
                # ensure that an exception for a single sample doesn't break everything
                continue
except Exception:
    # defensive: if enrichment fails entirely, continue with original samples
    pass