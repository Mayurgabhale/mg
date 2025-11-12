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