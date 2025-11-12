active count not diplsy chech why ;;
http://127.0.0.1:8000/daily_sheet/regions
{
  "regions": {
    "LACA": {
      "region_code": "LACA",
      "total_count": 7,
      "active_count": 0,
      "vip_count": 2,
      "active_vip_count": 0,
      "cities": {
        "Buenos Aires": {
          "city_name": "Buenos Aires",
          "total_count": 3,
          "active_count": 0,
          "vip_count": 2,
          "active_vip_count": 0,
          "sample_items": [
            {
              "first_name": "SANTIAGO",
              "last_name": "CASTRO",
              "email": "santiago.castrofeijoo@wu.com",
              "pnr": null,
              "active_now": false,
              "is_vip": true,
              "begin_dt": null,
              "end_dt": null
            },
            {
              "first_name": "ESTEBAN",
              "last_name": "CRESPO",
              "email": "esteban.crespo@westernunion.com",
              "pnr": null,
              "active_now": false,
              "is_vip": true,
              "begin_dt": null,
              "end_dt": null
            },
            {
              "first_name": "DIEGO",
              "last_name": "LONGO",
              "email": "diego.longo@westernunion.com",
              "pnr": null,
              "active_now": false,
              "is_vip": false,
              "begin_dt": null,
              "end_dt": null
            }
          ]
        },
        "Asunción": {
          "city_name": "Asunción",
          "total_count": 3,
          "active_count": 0,
          "vip_count": 0,
          "active_vip_count": 0,

            

# ⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️
# ---------- START: REGION HELPERS & ENDPOINTS ----------

# ----------------------------------------------------------
# 🌍 Modern ML / Geo-based Region Resolver (no hardcoding)
# ----------------------------------------------------------

# In-memory cache for geocoding (24h TTL)
GEOCODE_CACHE = TTLCache(maxsize=10000, ttl=60 * 60 * 24)

gc = geonamescache.GeonamesCache()
CITY_DB = {c['name'].lower(): c for c in gc.get_cities().values()}  # city name -> record
COUNTRY_DB = {c.alpha_2: c for c in pycountry.countries}

# Geocoder setup
GEOCODER = Nominatim(user_agent="region-mapper/1.0", timeout=10)

# Continent → Region mapping
CONTINENT_TO_REGION = {
    'AS': 'APAC',
    'OC': 'APAC',
    'EU': 'EMEA',
    'AF': 'EMEA',
    'NA': 'NAMER',
    'SA': 'LACA',
}

# Country overrides (manual region adjustments)
COUNTRY_CODE_OVERRIDES = {
    'AE': 'EMEA', 'SA': 'EMEA', 'EG': 'EMEA', 'IL': 'EMEA',
}

DEFAULT_REGION = 'UNKNOWN'


def country_code_to_region(alpha2: str) -> str:
    """Map ISO alpha2 code → region label."""
    if not alpha2:
        return DEFAULT_REGION
    alpha2 = alpha2.upper()
    if alpha2 in COUNTRY_CODE_OVERRIDES:
        return COUNTRY_CODE_OVERRIDES[alpha2]
    try:
        cont = pycountry_convert.country_alpha2_to_continent_code(alpha2)
        return CONTINENT_TO_REGION.get(cont, DEFAULT_REGION)
    except Exception:
        return DEFAULT_REGION


def normalize_text(s: Optional[str]) -> Optional[str]:
    return s.strip().lower() if s else None


def try_country_field(country_field: Optional[str]) -> Optional[str]:
    """If country name/ISO provided → get region quickly."""
    if not country_field:
        return None
    s = normalize_text(country_field)
    try:
        c = pycountry.countries.get(alpha_2=s.upper())
        if not c:
            c = pycountry.countries.get(name=country_field)
        if not c:
            choices = [c.name for c in pycountry.countries]
            best = process.extractOne(country_field, choices, scorer=fuzz.token_sort_ratio)
            if best and best[1] > 80:
                c = pycountry.countries.get(name=best[0])
        if c:
            return country_code_to_region(c.alpha_2)
    except Exception:
        pass
    return None


def try_local_city_db(city: str) -> Optional[str]:
    """Offline city lookup via geonamescache."""
    if not city:
        return None
    key = city.strip().lower()
    rec = CITY_DB.get(key)
    if rec and rec.get('countrycode'):
        return country_code_to_region(rec['countrycode'])

    # fuzzy match for close names
    best = process.extractOne(key, CITY_DB.keys(), scorer=fuzz.ratio)
    if best and best[1] > 92:
        rec = CITY_DB.get(best[0])
        if rec and rec.get('countrycode'):
            return country_code_to_region(rec['countrycode'])
    return None


@cached(GEOCODE_CACHE)
def geocode_city_to_country_code(city: str) -> Optional[str]:
    """Online geocoding (Nominatim) city → ISO country code."""
    if not city:
        return None
    try:
        loc = GEOCODER.geocode(city, addressdetails=True, exactly_one=True)
        if not loc:
            return None
        address = loc.raw.get('address', {})
        cc = address.get('country_code')
        if cc:
            return cc.upper()
    except Exception:
        time.sleep(1)
    return None


def resolve_region(country: Optional[str], location: Optional[str]) -> str:
    """
    Smart region resolver:
      1. Try country name
      2. Try offline city DB
      3. Try online geocoding
      4. Else → UNKNOWN
    """
    # 1️⃣ Country field
    region = try_country_field(country)
    if region:
        return region

    # 2️⃣ Try local city DB
    city_only = (location or "").split(",")[0].strip()
    region = try_local_city_db(city_only)
    if region:
        return region

    # 3️⃣ Online geocode
    cc = geocode_city_to_country_code(city_only or location or "")
    if cc:
        return country_code_to_region(cc)

    # 4️⃣ Fallback
    return DEFAULT_REGION


# ----------------------------------------------------------
# 🧩 Existing logic (but now uses resolve_region)
# ----------------------------------------------------------

def normalize_city(location: Optional[str]) -> Optional[str]:
    """Simplify city name for grouping."""
    if not location:
        return None
    s = str(location).strip().split(',')[0]
    return s.title()


# def build_regions_summary(items: list) -> dict:
#     """Group all items by region → city, with totals."""
#     regions = {}
#     for it in items:
#         country = (it.get('to_country') or it.get('from_country') or "").strip()
#         location = (it.get('to_location') or it.get('from_location') or "").strip()
#         region = resolve_region(country, location)
#         city = normalize_city(location) or "Unknown"

#         if region not in regions:
#             regions[region] = {
#                 "region_code": region,
#                 "total_count": 0,
#                 "active_count": 0,
#                 "vip_count": 0,
#                 "active_vip_count": 0,
#                 "cities": {}
#             }

#         # --- Region-level totals ---
#         reg = regions[region]
#         reg["total_count"] += 1
#         # if it.get("active_now"):
#         b, e = it.get("begin_dt"), it.get("end_dt")
#         active_now = False
#         if b and e:
#             try:
#                 if isinstance(b, str): b = datetime.fromisoformat(b)
#                 if isinstance(e, str): e = datetime.fromisoformat(e)
#                 now_local = datetime.now(tz=SERVER_TZ)
#                 active_now = b <= now_local <= e
#             except Exception:
#                  active_now = False
#         if active_now:  
#             reg["active_count"] += 1
#         if it.get("is_vip"):
#             reg["vip_count"] += 1
#         if it.get("active_now") and it.get("is_vip"):
#             reg["active_vip_count"] += 1

#         # --- City-level totals ---
#         if city not in reg["cities"]:
#             reg["cities"][city] = {
#                 "city_name": city,
#                 "total_count": 0,
#                 "active_count": 0,
#                 "vip_count": 0,
#                 "active_vip_count": 0,
#                 "sample_items": []
#             }

#         cty = reg["cities"][city]
#         cty["total_count"] += 1
#         if it.get("active_now"):
#             cty["active_count"] += 1
#         if it.get("is_vip"):
#             cty["vip_count"] += 1
#         if it.get("active_now") and it.get("is_vip"):
#             cty["active_vip_count"] += 1

    
#                 # ✅ Append all travelers (no limit)
#         cty["sample_items"].append({
#             "first_name": it.get("first_name"),
#             "last_name": it.get("last_name"),
#             "email": it.get("email"),
#             "pnr": it.get("pnr"),
#             # "active_now": it.get("active_now"),
#             "active_now": active_count,
#             "is_vip": bool(it.get("is_vip")),
#             "begin_dt": it.get("begin_dt"),
#             "end_dt": it.get("end_dt"),
#         })

#     # sort cities by count
#     for reg_data in regions.values():
#         reg_data["cities"] = dict(sorted(reg_data["cities"].items(),
#                                          key=lambda kv: -kv[1]["total_count"]))
#     return regions



def _parse_dt_for_compare(val):
    """Parse datetime-like value for comparison.
    Returns (dt, aware) where dt is either:
      - timezone-aware in UTC (if original had tzinfo)
      - naive UTC-based datetime (if original was naive)
    """
    if val is None:
        return None, None
    if isinstance(val, datetime):
        dt = val
    else:
        try:
            dt = date_parser.parse(str(val))
        except Exception:
            return None, None

    if dt.tzinfo is not None:
        # convert to UTC-aware
        return dt.astimezone(timezone.utc), True
    else:
        # naive — interpret as UTC-equivalent naive for comparison
        # use datetime.utcnow() (naive) for comparison
        return dt, False


def build_regions_summary(items: list) -> dict:
    """Group all items by region → city, with live active_now calculation."""
    regions = {}

    for it in items:
        country = (it.get('to_country') or it.get('from_country') or "").strip()
        location = (it.get('to_location') or it.get('from_location') or "").strip()
        region = resolve_region(country, location)
        city = normalize_city(location) or "Unknown"

        # --- parse begin/end robustly ---
        b_raw, e_raw = it.get("begin_dt"), it.get("end_dt")
        b_dt, b_aware = _parse_dt_for_compare(b_raw)
        e_dt, e_aware = _parse_dt_for_compare(e_raw)

        # Decide comparison mode:
        # - if either side is timezone-aware, compare in UTC-aware mode
        # - otherwise compare naive with datetime.utcnow()
        active_now = False
        try:
            if b_dt and e_dt:
                if b_aware or e_aware:
                    # make both aware UTC datetimes (if one side naive, treat it as UTC)
                    if not b_aware:
                        b_dt = b_dt.replace(tzinfo=timezone.utc)
                    if not e_aware:
                        e_dt = e_dt.replace(tzinfo=timezone.utc)
                    now_utc = datetime.utcnow().replace(tzinfo=timezone.utc)
                    active_now = (b_dt <= now_utc <= e_dt)
                else:
                    # naive comparison using UTC-equivalent naive
                    now_naive = datetime.utcnow()
                    active_now = (b_dt <= now_naive <= e_dt)
        except Exception:
            active_now = False

        # --- Initialize region if missing ---
        if region not in regions:
            regions[region] = {
                "region_code": region,
                "total_count": 0,
                "active_count": 0,
                "vip_count": 0,
                "active_vip_count": 0,
                "cities": {}
            }

        reg = regions[region]

        # --- Region-level counters ---
        reg["total_count"] += 1
        if active_now:
            reg["active_count"] += 1
        if it.get("is_vip"):
            reg["vip_count"] += 1
        if active_now and it.get("is_vip"):
            reg["active_vip_count"] += 1

        # --- Initialize city if missing ---
        if city not in reg["cities"]:
            reg["cities"][city] = {
                "city_name": city,
                "total_count": 0,
                "active_count": 0,
                "vip_count": 0,
                "active_vip_count": 0,
                "sample_items": []
            }

        cty = reg["cities"][city]

        # --- City-level counters ---
        cty["total_count"] += 1
        if active_now:
            cty["active_count"] += 1
        if it.get("is_vip"):
            cty["vip_count"] += 1
        if active_now and it.get("is_vip"):
            cty["active_vip_count"] += 1

        # --- Append all travelers (no limit) ---
        cty["sample_items"].append({
            "first_name": it.get("first_name"),
            "last_name": it.get("last_name"),
            "email": it.get("email"),
            "pnr": it.get("pnr"),
            "active_now": bool(active_now),
            "is_vip": bool(it.get("is_vip")),
            "begin_dt": it.get("begin_dt"),
            "end_dt": it.get("end_dt"),
        })

    # --- Sort cities by traveler count ---
    for reg_data in regions.values():
        reg_data["cities"] = dict(
            sorted(reg_data["cities"].items(), key=lambda kv: -kv[1]["total_count"])
        )

    return regions

# ----------------------------------------------------------
# 🚀 FastAPI endpoints
# ----------------------------------------------------------

@router.get("/regions")
def get_regions():
    """
    Return regional travel summary grouped by region (APAC, EMEA, NAMER, LACA, UNKNOWN).
    Uses memory cache if available, else loads from DB.
    """
    # 1️⃣ From memory
    if previous_data.get("items"):
        items = previous_data["items"]
    else:
        # 2️⃣ Fallback to DB
        db = SessionLocal()
        rows = db.query(DailyTravel).all()
        db.close()
        if not rows:
            raise HTTPException(status_code=404, detail="No travel data available in memory or database.")
        items = [{k: v for k, v in r.__dict__.items() if k != "_sa_instance_state"} for r in rows]
        previous_data["items"] = items

    # 3️⃣ Use new resolver-based region builder
    regions = build_regions_summary(items)

    # 4️⃣ Cache + timestamp
    previous_data["regions_summary"] = regions
    previous_data["last_updated"] = datetime.now().isoformat()

    # 5️⃣ Response
    return JSONResponse(content={
        "regions": regions,
        "last_updated": previous_data["last_updated"],
        "message": "Loaded region summary from memory or database"
    })


# @router.get("/regions/{region_code}")
# async def get_region(region_code: str):
#     """Get details for a specific region."""
#     regions = previous_data.get("regions_summary")
#     if not regions:
#         raise HTTPException(status_code=404, detail="Region summary not yet generated.")
#     region_code = region_code.upper()
#     region_data = regions.get(region_code)
#     if not region_data:
#         raise HTTPException(status_code=404, detail=f"Region {region_code} not found.")
#     return JSONResponse(content=region_data)




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




