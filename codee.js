pip install geopy pycountry pycountry-convert geonamescache rapidfuzz cachetools



from typing import Optional
from functools import lru_cache
import time

import pycountry
import pycountry_convert
import geonamescache
from geopy.geocoders import Nominatim
from rapidfuzz import process, fuzz
from cachetools import TTLCache, cached

# small persistent/short-term in-memory cache to avoid geocoding too often
GEOCODE_CACHE = TTLCache(maxsize=10000, ttl=60*60*24)  # 24h TTL

gc = geonamescache.GeonamesCache()
CITY_DB = {c['name'].lower(): c for c in gc.get_cities().values()}  # name -> city record
COUNTRY_DB = {c.alpha_2: c for c in pycountry.countries}

# geocoder (user-agent required)
GEOCODER = Nominatim(user_agent="region-mapper/1.0", timeout=10)

# Map continent (pycountry_convert 2-letter continent code) -> your region labels
CONTINENT_TO_REGION = {
    'AS': 'APAC',
    'OC': 'APAC',   # Oceania -> APAC
    'EU': 'EMEA',
    'AF': 'EMEA',   # Africa -> EMEA
    'NA': 'NAMER',
    'SA': 'LACA',
    # 'AN' Antarctica -> UNKNOWN or EMEA depending on your needs
}

# Some country code overrides (countries you want to force to EMEA/other)
COUNTRY_CODE_OVERRIDES = {
    'AE': 'EMEA',  # United Arab Emirates
    'SA': 'EMEA',  # Saudi Arabia
    'EG': 'EMEA',  # Egypt
    'IL': 'EMEA',  # Israel mapped to EMEA if you want
    # add other exceptions as needed
}

DEFAULT_REGION = 'UNKNOWN'


def country_code_to_region(alpha2: str) -> str:
    """Map an ISO alpha2 country code to your region label, with overrides."""
    if not alpha2:
        return DEFAULT_REGION
    alpha2 = alpha2.upper()
    if alpha2 in COUNTRY_CODE_OVERRIDES:
        return COUNTRY_CODE_OVERRIDES[alpha2]
    try:
        continent_code = pycountry_convert.country_alpha2_to_continent_code(alpha2)
        return CONTINENT_TO_REGION.get(continent_code, DEFAULT_REGION)
    except Exception:
        return DEFAULT_REGION


def normalize_text(s: Optional[str]) -> Optional[str]:
    if not s:
        return None
    return s.strip().lower()


def try_country_field(country_field: Optional[str]) -> Optional[str]:
    """Try to parse a user-supplied country string into an ISO alpha2 and then region."""
    if not country_field:
        return None
    s = normalize_text(country_field)
    # accept raw alpha2 or alpha3
    try:
        # try alpha_2 direct (e.g. 'US' or 'IN')
        c = pycountry.countries.get(alpha_2=s.upper())
        if not c:
            # try by name or common name
            c = pycountry.countries.get(name=country_field)
        if not c:
            # fuzzy match country names
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
    """Try geonamescache for a direct city match (fast, offline)."""
    if not city:
        return None
    key = city.strip().lower()
    rec = CITY_DB.get(key)
    if rec and rec.get('countrycode'):
        return country_code_to_region(rec['countrycode'])
    # fuzzy search top N matches
    choices = list(CITY_DB.keys())
    best = process.extractOne(key, choices, scorer=fuzz.ratio)
    if best and best[1] > 92:  # very tight threshold for names
        rec = CITY_DB.get(best[0])
        if rec and rec.get('countrycode'):
            return country_code_to_region(rec['countrycode'])
    return None


@cached(GEOCODE_CACHE)
def geocode_city_to_country_code(city: str) -> Optional[str]:
    """Use geopy/Nominatim to resolve a city -> country code (alpha2). Cached."""
    if not city:
        return None
    try:
        # be conservative: ask for address details to get country_code
        loc = GEOCODER.geocode(city, addressdetails=True, exactly_one=True)
        if not loc:
            # try adding common qualifiers (city + country) not available here,
            # calling client code again could append context like "city, europe"
            return None
        address = loc.raw.get('address', {})
        cc = address.get('country_code')
        if cc:
            return cc.upper()
    except Exception:
        # respect rate-limits and network blips
        time.sleep(1)
    return None


def resolve_region(country: Optional[str], location: Optional[str]) -> str:
    """
    Robust resolver:
      1) if country field provided -> parse it
      2) try local city db (geonamescache)
      3) geocode (Nominatim) with caching
      4) fallback to DEFAULT_REGION
    """
    # 1) Try country field (fast)
    region = try_country_field(country)
    if region:
        return region

    # normalize location -> we often have "City, State" or "City"
    city_only = None
    if location:
        city_only = location.split(',')[0].strip()

    # 2) local city db
    region = try_local_city_db(city_only or "")
    if region:
        return region

    # 3) geocode with caching
    cc = geocode_city_to_country_code(city_only or location or "")
    if cc:
        return country_code_to_region(cc)

    # optional: attempt fuzzy match against your existing COUNTRY_TO_REGION keys (if you still keep it)
    # else return UNKNOWN
    return DEFAULT_REGION



give me below code wiht this above update verstin ok but carefully.. 
    
# 🌍 Region mapping (includes common cities, states, and countries)
COUNTRY_TO_REGION = {
    # ---------------- APAC ----------------
    'india': 'APAC', 'pune': 'APAC', 'mumbai': 'APAC', 'hyderabad': 'APAC', 'chennai': 'APAC',
    'bangalore': 'APAC', 'bengaluru': 'APAC', 'delhi': 'APAC', 'gurgaon': 'APAC',
    'quezon city': 'APAC', 'taguig city': 'APAC', 'manila': 'APAC', 'philippines': 'APAC',
    'china': 'APAC', 'shanghai': 'APAC', 'beijing': 'APAC', 'hong kong': 'APAC', 'shenzhen': 'APAC',
    'japan': 'APAC', 'tokyo': 'APAC', 'osaka': 'APAC',
    'australia': 'APAC', 'sydney': 'APAC', 'melbourne': 'APAC', 'hobart': 'APAC',
    'singapore': 'APAC', 'singapore city': 'APAC',
    'malaysia': 'APAC', 'kuala lumpur': 'APAC',
    'indonesia': 'APAC', 'jakarta': 'APAC', 'bali': 'APAC',
    'thailand': 'APAC', 'bangkok': 'APAC',
    'vietnam': 'APAC', 'hanoi': 'APAC', 'ho chi minh': 'APAC', 'ho chi minh city': 'APAC',
    'south korea': 'APAC', 'seoul': 'APAC',
    'pakistan': 'APAC', 'karachi': 'APAC',
    'bangladesh': 'APAC', 'dhaka': 'APAC',
    'new zealand': 'APAC', 'auckland': 'APAC',

    # ---------------- NAMER ----------------
    'united states': 'NAMER', 'usa': 'NAMER', 'us': 'NAMER', 'america': 'NAMER',
    'new york': 'NAMER', 'los angeles': 'NAMER', 'houston': 'NAMER', 'denver': 'NAMER',
    'boston': 'NAMER', 'atlanta': 'NAMER', 'newark': 'NAMER',
    'miami': 'NAMER', 'las vegas': 'NAMER', 'washington': 'NAMER', 'washington d.c.': 'NAMER',
    'saint louis': 'NAMER', 'st. louis': 'NAMER', 'baltimore': 'NAMER', 'oakland': 'NAMER',
    'fort lauderdale': 'NAMER', 'annapolis': 'NAMER',
    'canada': 'NAMER', 'toronto': 'NAMER', 'vancouver': 'NAMER', 'montreal': 'NAMER', 'regina': 'NAMER',
    'mexico': 'NAMER', 'mexico city': 'NAMER',
    'chicago': 'NAMER', 'seattle': 'NAMER', 'phoenix': 'NAMER', 'dallas': 'NAMER',

    # ---------------- LACA ----------------
    'brazil': 'LACA', 'são paulo': 'LACA', 'sao paulo': 'LACA', 'rio de janeiro': 'LACA',
    'argentina': 'LACA', 'buenos aires': 'LACA', 'cordoba': 'LACA', 'salta': 'LACA',
    'chile': 'LACA', 'santiago': 'LACA',
    'colombia': 'LACA', 'bogotá': 'LACA', 'bogota': 'LACA',
    'peru': 'LACA', 'lima': 'LACA',
    'venezuela': 'LACA', 'caracas': 'LACA',
    'panama': 'LACA', 'panama city': 'LACA',
    'costa rica': 'LACA', 'san josé': 'LACA', 'san jose': 'LACA',
    'guatemala': 'LACA', 'guatemala city': 'LACA',
    'paraguay': 'LACA', 'asunción': 'LACA', 'asuncion': 'LACA',
    'uruguay': 'LACA', 'montevideo': 'LACA',
    'ecuador': 'LACA', 'quito': 'LACA',

    # ---------------- EMEA ----------------
    'united kingdom': 'EMEA', 'uk': 'EMEA', 'england': 'EMEA', 'london': 'EMEA', 'manchester': 'EMEA',
    'ireland': 'EMEA', 'dublin': 'EMEA', 'cork': 'EMEA',
    'spain': 'EMEA', 'madrid': 'EMEA', 'valencia': 'EMEA', 'bilbao': 'EMEA', 'barcelona': 'EMEA',
    'zaragoza': 'EMEA', 'palma de mallorca': 'EMEA', 'ibiza': 'EMEA',
    'italy': 'EMEA', 'rome': 'EMEA', 'milan': 'EMEA', 'trieste': 'EMEA', 'ancona': 'EMEA',
    'france': 'EMEA', 'paris': 'EMEA', 'perpignan': 'EMEA',
    'germany': 'EMEA', 'berlin': 'EMEA', 'munich': 'EMEA', 'frankfurt': 'EMEA',
    'austria': 'EMEA', 'vienna': 'EMEA', 'graz': 'EMEA',
    'lithuania': 'EMEA', 'vilnius': 'EMEA',
    'romania': 'EMEA', 'oradea': 'EMEA', 'bucharest': 'EMEA',
    'greece': 'EMEA', 'athens': 'EMEA',
    'portugal': 'EMEA', 'lisbon': 'EMEA',
    'russia': 'EMEA', 'moscow': 'EMEA',
    'uae': 'EMEA', 'abu dhabi': 'EMEA', 'dubai': 'EMEA',
    'morocco': 'EMEA', 'casablanca': 'EMEA',
    'netherlands': 'EMEA', 'amsterdam': 'EMEA',
    'poland': 'EMEA', 'warsaw': 'EMEA',
    'saudi arabia': 'EMEA', 'riyadh': 'EMEA',
    'south africa': 'EMEA', 'johannesburg': 'EMEA',
    'egypt': 'EMEA', 'cairo': 'EMEA',
    'luton': 'EMEA', 'doncaster': 'EMEA',
}
DEFAULT_REGION = 'UNKNOWN'


def guess_region(country: Optional[str], location: Optional[str]) -> str:
    """Guess a region using either country or location (case-insensitive, fuzzy matching)."""
    text_parts = []
    if country: text_parts.append(str(country).lower())
    if location: text_parts.append(str(location).lower())
    combined = " ".join(text_parts)

    for key, region in COUNTRY_TO_REGION.items():
        if key in combined:
            return region
    return DEFAULT_REGION



def normalize_city(location: Optional[str]) -> Optional[str]:
    """Simplify city name for grouping."""
    if not location:
        return None
    s = str(location).strip().split(',')[0]
    return s.title()


def build_regions_summary(items: list) -> dict:
    """Group all items by region -> city, with total_count, active_count, vip_count, and active_vip_count."""
    regions = {}
    for it in items:
        country = (it.get('to_country') or it.get('from_country') or "").strip()
        location = (it.get('to_location') or it.get('from_location') or "").strip()
        region = guess_region(country, location)
        city = normalize_city(location) or "Unknown"

        if region not in regions:
            regions[region] = {
                "region_code": region,
                "total_count": 0,
                "active_count": 0,
                "vip_count": 0,
                "active_vip_count": 0,  # ✅ new
                "cities": {}
            }

        # --- Region-level aggregation ---
        regions[region]["total_count"] += 1
        if it.get("active_now"):
            regions[region]["active_count"] += 1
        if it.get("is_vip"):
            regions[region]["vip_count"] += 1
        if it.get("active_now") and it.get("is_vip"):
            regions[region]["active_vip_count"] += 1  # ✅ new line

        # --- City-level aggregation ---
        cities = regions[region]["cities"]
        if city not in cities:
            cities[city] = {
                "city_name": city,
                "total_count": 0,
                "active_count": 0,
                "vip_count": 0,
                "active_vip_count": 0,  # ✅ new
                "sample_items": []
            }

        cities[city]["total_count"] += 1
        if it.get("active_now"):
            cities[city]["active_count"] += 1
        if it.get("is_vip"):
            cities[city]["vip_count"] += 1
        if it.get("active_now") and it.get("is_vip"):
            cities[city]["active_vip_count"] += 1  # ✅ new

        if len(cities[city]["sample_items"]) < 10:
            cities[city]["sample_items"].append({
                "first_name": it.get("first_name"),
                "last_name": it.get("last_name"),
                "email": it.get("email"),
                "pnr": it.get("pnr"),
                "active_now": it.get("active_now"),
                "is_vip": bool(it.get("is_vip")),
                "begin_dt": it.get("begin_dt"),
                "end_dt": it.get("end_dt")
            })

    # Sort cities by descending counts for nicer output
    for reg_data in regions.values():
        reg_data["cities"] = dict(
            sorted(reg_data["cities"].items(), key=lambda kv: -kv[1]["total_count"])
        )

    return regions



@router.get("/regions")
def get_regions():
    """
    Return regional travel summary grouped by region (APAC, EMEA, NAMER, LACA, UNKNOWN).
    Uses memory cache if available, else loads from DB.
    """

    # 1️⃣ Try using memory first
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

    # 3️⃣ Use the region builder you defined earlier
    regions = build_regions_summary(items)

    # 4️⃣ Cache + timestamp
    previous_data["regions_summary"] = regions
    previous_data["last_updated"] = datetime.now().isoformat()

    # 5️⃣ Return the summary
    return JSONResponse(content={
        "regions": regions,
        "last_updated": previous_data["last_updated"],
        "message": "Loaded region summary from memory or database"
    })



@router.get("/regions/{region_code}")
async def get_region(region_code: str):
