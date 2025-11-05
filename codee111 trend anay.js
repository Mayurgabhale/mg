now we add this new futue in backned.
    now how ot do this in freontend.. 
    i want  this dynamic updation ok. 
    and clikc bale ok 

can you add this new futue in frontend.... 

# ⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️
# ---------- START: REGION HELPERS & ENDPOINTS ----------
# (Insert into your FastAPI app file)
COUNTRY_TO_REGION = {
    # APAC (not exhaustive)
    'india': 'APAC', 'philippines': 'APAC', 'china': 'APAC', 'japan': 'APAC', 'australia': 'APAC',
    'singapore': 'APAC', 'malaysia': 'APAC', 'indonesia': 'APAC', 'thailand': 'APAC', 'vietnam': 'APAC',
    'south korea': 'APAC', 'hong kong': 'APAC', 'taiwan': 'APAC', 'pakistan': 'APAC', 'bangladesh': 'APAC',

    # NAMER (North America)
    'united states': 'NAMER', 'usa': 'NAMER', 'canada': 'NAMER', 'mexico': 'NAMER',

    # LACA (Latin America & Caribbean)
    'brazil': 'LACA', 'argentina': 'LACA', 'chile': 'LACA', 'colombia': 'LACA', 'peru': 'LACA',
    'venezuela': 'LACA', 'panama': 'LACA', 'costa rica': 'LACA',

    # EMEA
    'united kingdom': 'EMEA', 'uk': 'EMEA', 'germany': 'EMEA', 'france': 'EMEA', 'spain': 'EMEA',
    'italy': 'EMEA', 'netherlands': 'EMEA', 'sweden': 'EMEA', 'norway': 'EMEA', 'denmark': 'EMEA',
    'switzerland': 'EMEA', 'belgium': 'EMEA', 'austria': 'EMEA', 'poland': 'EMEA', 'greece': 'EMEA',
    'turkey': 'EMEA', 'uae': 'EMEA', 'saudi arabia': 'EMEA', 'south africa': 'EMEA', 'egypt': 'EMEA'
}

DEFAULT_REGION = 'UNKNOWN'


def guess_region(country: Optional[str], location: Optional[str]) -> str:
    """Try country first, then look for location token matches, else return DEFAULT_REGION."""
    if country:
        c = str(country).strip().lower()
        if c in COUNTRY_TO_REGION:
            return COUNTRY_TO_REGION[c]
        # also try common short iso forms (USA -> united states)
        if c.replace('.', '').replace(' ', '') in COUNTRY_TO_REGION:
            return COUNTRY_TO_REGION[c]
    if location:
        s = str(location).strip().lower()
        # check if any known country name is present in the location string
        for name, reg in COUNTRY_TO_REGION.items():
            if name in s:
                return reg
        # city heuristics (simple tokens)
        if any(tok in s for tok in ('pune', 'mumbai', 'hyderabad', 'delhi', 'manila')):
            return 'APAC'
    return DEFAULT_REGION


def normalize_city(location: Optional[str]) -> Optional[str]:
    if not location or pd.isna(location):
        return None
    s = str(location).strip()
    if ',' in s:
        s = s.split(',')[0]
    return s.title().strip()


def build_regions_summary(items: list) -> dict:
    """Build nested summary from items list.
    Returns: dict keyed by region code with counts, cities and sample travelers.
    """
    regions = {}
    for it in items:
        # prefer "to_" fields, fallback to from_
        country = it.get('to_country') or it.get('from_country')
        loc = it.get('to_location') or it.get('from_location')
        region = guess_region(country, loc) or DEFAULT_REGION
        city = normalize_city(loc) or 'Unknown'

        if region not in regions:
            regions[region] = {
                'region_code': region,
                'total_count': 0,
                'active_count': 0,
                'cities': {}
            }

        regions[region]['total_count'] += 1
        if it.get('active_now'):
            regions[region]['active_count'] += 1

        city_bucket = regions[region]['cities'].setdefault(city, {
            'city_name': city,
            'total_count': 0,
            'active_count': 0,
            'sample_items': []
        })
        city_bucket['total_count'] += 1
        if it.get('active_now'):
            city_bucket['active_count'] += 1

        # Keep a small sample of items (full items are available in previous_data['items'])
        if len(city_bucket['sample_items']) < 10:
            city_bucket['sample_items'].append({
                'first_name': it.get('first_name'),
                'last_name': it.get('last_name'),
                'emp_id': it.get('emp_id'),
                'email': it.get('email'),
                'pnr': it.get('pnr'),
                'begin_dt': it.get('begin_dt'),
                'end_dt': it.get('end_dt'),
                'active_now': it.get('active_now')
            })

    # Sort cities by count for each region
    for reg in regions.values():
        reg['cities'] = dict(sorted(reg['cities'].items(), key=lambda kv: -kv[1]['total_count']))

    return regions

# New endpoints
@app.get('/regions')
async def get_regions():
    if previous_data.get('items') is None:
        raise HTTPException(status_code=404, detail='No travel data available')
    # compute on the fly (fast) or use cached copy
    regions = build_regions_summary(previous_data['items'])
    previous_data['regions_summary'] = regions
    return JSONResponse(content={'regions': regions})


@app.get('/regions/{region_code}')
async def get_region(region_code: str):
    if previous_data.get('items') is None:
        raise HTTPException(status_code=404, detail='No travel data available')
    regions = previous_data.get('regions_summary') or build_regions_summary(previous_data['items'])
    rc = region_code.upper()
    if rc not in regions:
        raise HTTPException(status_code=404, detail=f'Region {rc} not found')
    return JSONResponse(content={'region': regions[rc]})

# ---------- END: REGION HELPERS & ENDPOINTS ----------

onst EmployeeTravelDashboard = () => {
    const [file, setFile] = useState(null);
    const [items, setItems] = useState([]);
    const [summary, setSummary] = useState({});
    const [loading, setLoading] = useState(false);
    const [filters, setFilters] = useState({
        country: "",
        location: "",
        legType: "",
        search: "",
        status: ""
    });
    const [selectedTraveler, setSelectedTraveler] = useState(null);
    const [activeTab, setActiveTab] = useState("overview");

    // 🆕 Add theme state
    const [isDarkTheme, setIsDarkTheme] = useState(false);
    // 🆕 Toggle theme function
    const toggleTheme = () => {
        setIsDarkTheme(!isDarkTheme);
    };


    // ⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️
    const [showAddForm, setShowAddForm] = useState(false);
    const [newTraveler, setNewTraveler] = useState({
        first_name: "",
        last_name: "",
        emp_id: "",
        email: "",
        begin_dt: "",
        end_dt: "",
        from_location: "",
        from_country: "",
        to_location: "",
        to_country: "",
        leg_type: "",
    });




    const addTraveler = async () => {
        try {
            await axios.post("http://localhost:8000/add_traveler", newTraveler);
            toast.success("Traveler added successfully!");
            setShowAddForm(false);
            setNewTraveler({
                first_name: "",
                last_name: "",
                emp_id: "",
                email: "",
                begin_dt: "",
                end_dt: "",
                from_location: "",
                from_country: "",
                to_location: "",
                to_country: "",
                leg_type: "",
            });
            // Refresh data after adding
            const res = await axios.get("http://localhost:8000/data");
            const payload = res.data || {};
            setItems(payload.items || []);
            setSummary(payload.summary || {});
        } catch (err) {
            toast.error("Failed to add traveler. Check backend.");
        }
    };
    // ⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️



    const styles = getStyles(isDarkTheme);

    const [lastUpdated, setLastUpdated] = useState(null);



    // 🆕 Load saved data on page reload
    // useEffect(() => {
    //     const loadPreviousData = async () => {
    //         try {
    //             const res = await axios.get("http://localhost:8000/data");
    //             const payload = res.data || {};
    //             const rows = payload.items || [];
    //             setItems(rows);
    //             setSummary(payload.summary || {});
    //             if (rows.length > 0) {
    //                 toast.info(`Loaded ${rows.length} saved records from previous session.`);
    //             }
    //         } catch (err) {
    //             console.log("No saved data found yet.");
    //         }
    //     };
    //     loadPreviousData();
    // }, []);


    // useEffect(() => {
    //     const fetchLatest = async () => {
    //         try {
    //             const res = await axios.get("http://localhost:8000/data");
    //             const payload = res.data || {};
    //             setItems(payload.items || []);
    //             setSummary(payload.summary || {});
    //         } catch (err) {
    //             console.warn("No data yet or backend not responding...");
    //         }
    //     };

    //     const interval = setInterval(fetchLatest, 10000); // refresh every 10 seconds
    //     return () => clearInterval(interval);
    // }, []);




    // useEffect(() => {
    //     const fetchLatest = async () => {
    //         try {
    //             const res = await axios.get("http://localhost:8000/data");
    //             const payload = res.data || {};

    //             // Only update UI if new data detected
    //             if (payload.last_updated && payload.last_updated !== lastUpdated) {
    //                 setLastUpdated(payload.last_updated);
    //                 setItems(payload.items || []);
    //                 setSummary(payload.summary || {});
    //                 toast.info("Dashboard auto-updated with new upload data.");
    //             }
    //         } catch {
    //             console.warn("No data yet or backend not responding...");
    //         }
    //     };

    //     const interval = setInterval(fetchLatest, 10000);
    //     return () => clearInterval(interval);
    // }, [lastUpdated]);

    // ✅ Load saved data immediately on refresh + auto-refresh every 10 seconds
    useEffect(() => {
        const fetchLatest = async (showToast = false) => {
            try {
                const res = await axios.get("http://localhost:8000/data");
                const payload = res.data || {};
                const rows = payload.items || [];

                // On first load or new data
                if (rows.length > 0) {
                    setItems(rows);
                    setSummary(payload.summary || {});

                    // show toast only when we want (e.g., initial page load)
                    if (showToast) {
                        toast.info(`Loaded ${rows.length} saved records from previous session.`);
                    }

                    // track update timestamp
                    if (payload.last_updated) {
                        setLastUpdated(payload.last_updated);
                    }
                }
            } catch (err) {
                console.warn("No saved data yet — upload a file to start.");
            }
        };

        // 🔹 Load previous data once when page loads
        fetchLatest(true);

        // 🔹 Keep refreshing every 10 seconds
        const interval = setInterval(() => fetchLatest(false), 10000);
        return () => clearInterval(interval);
    }, []);




    const handleFileChange = (e) => setFile(e.target.files[0]);

    const uploadFile = async () => {
        if (!file) return toast.warn("Please select an Excel or CSV file first.");
        setLoading(true);
        try {
            const formData = new FormData();
            formData.append("file", file);
            const res = await axios.post("http://localhost:8000/upload", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            const payload = res.data || {};
            const rows = payload.items || [];
            setItems(rows);
            setSummary(payload.summary || {});
            toast.success(`Uploaded successfully. ${rows.length} records found.`);
        } catch (err) {
            console.error(err);
            toast.error("Upload failed. Please check the backend or file format.");
        } finally {
            setLoading(false);
        }
    };

    const safeItems = Array.isArray(items) ? items : [];

    const analytics = useMemo(() => {
        const active = safeItems.filter(r => r.active_now).length;

        const countries = [...new Set(safeItems.map(r => r.from_country).filter(Boolean))];
        const legTypes = [...new Set(safeItems.map(r => r.leg_type).filter(Boolean))];

        // Travel duration analysis
        const durations = safeItems.map(r => {
            if (!r.begin_dt || !r.end_dt) return 0;
            const start = new Date(r.begin_dt);
            const end = new Date(r.end_dt);
            return Math.max(0, (end - start) / (1000 * 60 * 60 * 24)); // days
        }).filter(d => d > 0);

        const avgDuration = durations.length > 0 ?
            durations.reduce((a, b) => a + b, 0) / durations.length : 0;

        return {
            active,
            totalCountries: countries.length,
            totalTypes: legTypes.length,
            avgDuration: avgDuration.toFixed(1),
            totalTravelers: safeItems.length
        };
    }, [safeItems]);

    // 🆕 Country Statistics with enhanced data
    const countryStats = useMemo(() => {
        const map = {};
        safeItems.forEach(r => {
            const c = r.from_country || "Unknown";
            if (!map[c]) {
                map[c] = { count: 0, active: 0, travelers: new Set() };
            }
            map[c].count++;
            if (r.active_now) map[c].active++;
            map[c].travelers.add(`${r.first_name} ${r.last_name}`);
        });

        return Object.entries(map)
            .map(([country, data]) => ({
                country,
                count: data.count,
                active: data.active,
                travelerCount: data.travelers.size
            }))
            .sort((a, b) => b.count - a.count);
    }, [safeItems]);

    // 🆕 Travel Type Analysis
    const travelTypeStats = useMemo(() => {
        const map = {};
        safeItems.forEach(r => {
            const type = r.leg_type || "Unknown";
            if (!map[type]) {
                map[type] = { count: 0, active: 0, countries: new Set() };
            }
            map[type].count++;
            if (r.active_now) map[type].active++;
            if (r.from_country) map[type].countries.add(r.from_country);
        });

        return Object.entries(map)
            .map(([type, data]) => ({
                type,
                count: data.count,
                active: data.active,
                countryCount: data.countries.size
            }))
            .sort((a, b) => b.count - a.count);
    }, [safeItems]);

    // 🆕 Recent Travelers (last 7 days)
    const recentTravelers = useMemo(() => {
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        return safeItems
            .filter(r => r.begin_dt && new Date(r.begin_dt) >= sevenDaysAgo)
            .sort((a, b) => new Date(b.begin_dt) - new Date(a.begin_dt))
            .slice(0, 10);
    }, [safeItems]);

    const countries = useMemo(
        () => [...new Set(safeItems.map((r) => r.from_country).filter(Boolean))],
        [safeItems]
    );
    const locations = useMemo(() => {
        const allLocations = [
            ...new Set([
                ...safeItems.map((r) => r.from_location).filter(Boolean),
                ...safeItems.map((r) => r.to_location).filter(Boolean)
            ])
        ];
        return allLocations.sort();
    }, [safeItems]);
    const legTypes = useMemo(
        () => [...new Set(safeItems.map((r) => r.leg_type).filter(Boolean))],
        [safeItems]
    );


    // 🆕 Travel Type Icons Mapping
    const getTravelTypeIcon = (type) => {
        if (!type) return FiGlobe;

        const typeLower = type.toLowerCase();
        if (typeLower.includes('car') || typeLower.includes('vehicle')) return FaCar;
        if (typeLower.includes('truck') || typeLower.includes('bus')) return FaTruck;
        if (typeLower.includes('train') || typeLower.includes('rail')) return FaTrain;
        if (typeLower.includes('plane') || typeLower.includes('air') || typeLower.includes('flight')) return FaPlane;
        if (typeLower.includes('ship') || typeLower.includes('boat') || typeLower.includes('sea')) return FaShip;
        if (typeLower.includes('bike') || typeLower.includes('cycle')) return FaBicycle;
        if (typeLower.includes('hotel') || typeLower.includes('HOTEL')) return FaHotel;
        if (typeLower.includes('stop') || typeLower.includes('stop')) return BsPersonWalking;
        return FaLocationArrow;
    };

    // 🆕 Travel Type Color Mapping
    const getTravelTypeColor = (type) => {
        if (!type) return '#6b7280';

        const typeLower = type.toLowerCase();
        if (typeLower.includes('car') || typeLower.includes('vehicle')) return '#dc2626';
        if (typeLower.includes('truck') || typeLower.includes('bus')) return '#ea580c';
        if (typeLower.includes('train') || typeLower.includes('rail')) return '#16a34a';
        if (typeLower.includes('plane') || typeLower.includes('air') || typeLower.includes('flight')) return '#2563eb';
        if (typeLower.includes('ship') || typeLower.includes('boat') || typeLower.includes('sea')) return '#7c3aed';
        if (typeLower.includes('bike') || typeLower.includes('cycle')) return '#ca8a04';
        return '#2465c1ff';
    };

    // 🆕 Today's Travelers
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayTravelers = safeItems.filter((r) => {
        if (!r.begin_dt) return false;
        const start = new Date(r.begin_dt);
        start.setHours(0, 0, 0, 0);
        return start.getTime() === today.getTime();
    });

    const filtered = safeItems
        .filter((r) => {
            const s = filters.search.toLowerCase();
            if (s) {
                const hay = `${r.first_name ?? ""} ${r.last_name ?? ""} ${r.email ?? ""} ${r.from_location ?? ""} ${r.to_location ?? ""}`.toLowerCase();
                if (!hay.includes(s)) return false;
            }
            if (filters.country && r.from_country !== filters.country) return false;
            if (filters.location) {
                const fromLocationMatch = r.from_location && r.from_location.toLowerCase().includes(filters.location.toLowerCase());
                const toLocationMatch = r.to_location && r.to_location.toLowerCase().includes(filters.location.toLowerCase());
                if (!fromLocationMatch && !toLocationMatch) return false;
            }
            if (filters.legType && r.leg_type !== filters.legType) return false;
            if (filters.status === "active" && !r.active_now) return false;
            if (filters.status === "inactive" && r.active_now) return false;
            return true;
        })
        .sort((a, b) => (b.active_now === true) - (a.active_now === true));

    const exportCsv = () => {
        if (!filtered.length) return toast.info("No data to export.");
        const keys = Object.keys(filtered[0]);
        const csv = [keys.join(",")];
        filtered.forEach((r) =>
            csv.push(keys.map((k) => `"${String(r[k] ?? "").replace(/"/g, '""')}"`).join(","))
        );
        const blob = new Blob([csv.join("\n")], { type: "text/csv" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "EmployeeTravelData.csv";
        a.click();
        URL.revokeObjectURL(url);
        toast.success("CSV exported successfully.");
    };

    // Enhanced Traveler Detail Popup Component
    const TravelerDetailPopup = ({ traveler, onClose }) => {
        if (!traveler) return null;

        const TravelTypeIcon = getTravelTypeIcon(traveler.leg_type);
        const travelTypeColor = getTravelTypeColor(traveler.leg_type);

        // Calculate duration
        const getDuration = () => {
            if (!traveler.begin_dt || !traveler.end_dt) return 'Unknown';
            const start = new Date(traveler.begin_dt);
            const end = new Date(traveler.end_dt);
            const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
            return `${days} day${days !== 1 ? 's' : ''}`;
        };

        return (
            <div style={styles.popupOverlay}>
                <div style={styles.popupContent}>
                    {/* Header */}
                    <div style={styles.popupHeader}>
                        <div style={styles.headerContent}>
                            <div style={styles.avatarSection}>
                                <div style={styles.avatarLarge}>
                                    <FiUser size={24} />
                                </div>
                            </div>
                            <div style={styles.headerInfo}>
                                <h3 style={styles.popupTitle}>
                                    {traveler.first_name} {traveler.last_name}
                                </h3>
                                <p style={styles.employeeId}>Employee ID: {traveler.emp_id || 'N/A'}</p>
                            </div>
                        </div>
                        <button onClick={onClose} style={styles.popupCloseBtn}>
                            <FiX size={20} />
                        </button>
                    </div>

                    {/* Body */}
                    <div style={styles.popupBody}>
                        {/* Status Banner */}
                        <div style={styles.statusBanner}>
                            <div style={{
                                ...styles.statusBadge,
                                ...(traveler.active_now ? styles.activeStatus : styles.inactiveStatus)
                            }}>
                                <div style={{
                                    ...styles.statusDot,
                                    ...(traveler.active_now ? styles.activeDot : styles.inactiveDot)
                                }}></div>
                                {traveler.active_now ? "Currently Traveling" : "Travel Completed"}
                            </div>

                            <div style={{
                                ...styles.travelTypeBadge,
                                background: `${travelTypeColor}15`,
                                border: `1px solid ${travelTypeColor}30`,
                                color: travelTypeColor
                            }}>
                                <TravelTypeIcon size={16} />
                                <span style={styles.travelTypeText}>
                                    {traveler.leg_type || 'Unknown Type'}
                                </span>
                            </div>
                        </div>

                        {/* Details Container */}
                        <div style={styles.detailsContainer}>
                            {/* Personal Info */}
                            <div style={styles.detailSection}>
                                <div style={styles.sectionHeader}>
                                    <FiUser style={styles.sectionIcon} />
                                    <h4 style={styles.sectionTitle}>Personal Information</h4>
                                </div>
                                <div style={styles.detailList}>
                                    <div style={styles.detailRow}>
                                        <span style={styles.detailLabel}>Employee ID</span>
                                        <span style={styles.detailValue}>{traveler.emp_id || 'Not Provided'}</span>
                                    </div>
                                    <div style={styles.detailRow}>
                                        <span style={styles.detailLabel}>Full Name</span>
                                        <span style={styles.detailValue}>{traveler.first_name} {traveler.last_name}</span>
                                    </div>
                                    <div style={styles.detailRow}>
                                        <span style={styles.detailLabel}>Email</span>
                                        <span style={styles.detailValue}>
                                            <FiMail size={14} style={styles.inlineIcon} />
                                            {traveler.email || 'Not Provided'}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Travel Info - From */}
                            <div style={styles.detailSection}>
                                <div style={styles.sectionHeader}>
                                    <FiMapPin style={{ ...styles.sectionIcon, color: '#ef4444' }} />
                                    <h4 style={styles.sectionTitle}>Departure Details</h4>
                                </div>
                                <div style={styles.detailList}>
                                    <div style={styles.detailRow}>
                                        <span style={styles.detailLabel}>From Location</span>
                                        <span style={styles.detailValue}>
                                            <FiMapPin size={14} style={{ ...styles.inlineIcon, color: '#ef4444' }} />
                                            {traveler.from_location || 'Not specified'}
                                        </span>
                                    </div>
                                    <div style={styles.detailRow}>
                                        <span style={styles.detailLabel}>From Country</span>
                                        <span style={styles.detailValue}>
                                            <FiGlobe size={14} style={{ ...styles.inlineIcon, color: '#3b82f6' }} />
                                            {traveler.from_country || 'Unknown'}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Travel Info - To */}
                            <div style={styles.detailSection}>
                                <div style={styles.sectionHeader}>
                                    <FiMapPin style={{ ...styles.sectionIcon, color: '#10b981' }} />
                                    <h4 style={styles.sectionTitle}>Destination Details</h4>
                                </div>
                                <div style={styles.detailList}>
                                    <div style={styles.detailRow}>
                                        <span style={styles.detailLabel}>To Location</span>
                                        <span style={styles.detailValue}>
                                            <FiMapPin size={14} style={{ ...styles.inlineIcon, color: '#10b981' }} />
                                            {traveler.to_location || 'Not specified'}
                                        </span>
                                    </div>
                                    <div style={styles.detailRow}>
                                        <span style={styles.detailLabel}>To Country</span>
                                        <span style={styles.detailValue}>
                                            <FiGlobe size={14} style={{ ...styles.inlineIcon, color: '#3b82f6' }} />
                                            {traveler.to_country || 'Unknown'}
                                        </span>
                                    </div>
                                    <div style={styles.detailRow}>
                                        <span style={styles.detailLabel}>Travel Type</span>
                                        <span style={{
                                            ...styles.detailValue,
                                            color: travelTypeColor,
                                            fontWeight: '600'
                                        }}>
                                            <TravelTypeIcon size={14} style={styles.inlineIcon} />
                                            {traveler.leg_type || 'Unknown'}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Timeline */}
                            <div style={styles.detailSection}>
                                <div style={styles.sectionHeader}>
                                    <FiCalendar style={styles.sectionIcon} />
                                    <h4 style={styles.sectionTitle}>Travel Timeline</h4>
                                </div>
                                <div style={styles.detailList}>
                                    <div style={styles.detailRow}>
                                        <span style={styles.detailLabel}>Start Date</span>
                                        <span style={styles.detailValue}>
                                            <FiClock size={14} style={styles.inlineIcon} />
                                            {fmt(traveler.begin_dt) || 'Not Set'}
                                        </span>
                                    </div>
                                    <div style={styles.detailRow}>
                                        <span style={styles.detailLabel}>End Date</span>
                                        <span style={styles.detailValue}>
                                            <FiClock size={14} style={styles.inlineIcon} />
                                            {fmt(traveler.end_dt) || 'Not Set'}
                                        </span>
                                    </div>
                                    <div style={styles.detailRow}>
                                        <span style={styles.detailLabel}>Duration</span>
                                        <span style={styles.detailValue}>
                                            {getDuration()}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Additional Info */}
                            <div style={styles.detailSection}>
                                <div style={styles.sectionHeader}>
                                    <FiAward style={styles.sectionIcon} />
                                    <h4 style={styles.sectionTitle}>Additional Details</h4>
                                </div>
                                <div style={styles.detailList}>
                                    <div style={styles.detailRow}>
                                        <span style={styles.detailLabel}>Status</span>
                                        <span style={{
                                            ...styles.statusTag,
                                            ...(traveler.active_now ? styles.activeTag : styles.inactiveTag)
                                        }}>
                                            {traveler.active_now ? 'Active' : 'Completed'}
                                        </span>
                                    </div>
                                    <div style={styles.detailRow}>
                                        <span style={styles.detailLabel}>Last Updated</span>
                                        <span style={styles.detailValue}>
                                            {new Date().toLocaleDateString()}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    return (
        // <div style={page}>
        <div style={styles.page}>
            <ToastContainer position="top-right" autoClose={3000} theme={isDarkTheme ? "dark" : "light"} />
            {loading && (
                <div style={style.overlay}>
                    <span style={style.loader}></span>
                    <style>{keyframes}</style>
                </div>
            )}

            {/* Traveler Detail Popup */}
            <TravelerDetailPopup
                traveler={selectedTraveler}
                onClose={() => setSelectedTraveler(null)}
            />

            {/* HEADER */}
            {/* HEADER */}
            <header style={styles.header}>
                <div style={styles.headerContent}>
                    <div style={styles.headerIcon}>
                        <FiGlobe size={32} />
                    </div>
                    <div style={{ flex: 1 }}>
                        <h1 style={styles.title}>Employee Travel Details Dashboard</h1>

                    </div>
                    {/* 🆕 Theme Toggle Button */}
                    <button
                        onClick={toggleTheme}
                        style={styles.themeToggleBtn}
                        title={isDarkTheme ? "Switch to light mode" : "Switch to dark mode"}
                    >
                        {isDarkTheme ? <FiSun size={20} /> : <FiMoon size={20} />}
                    </button>
                </div>
            </header>

            <div style={layout}>
                {/* LEFT PANEL - Navigation */}
                <aside style={styles.sidebar}>
                    <nav style={styles.nav}>
                        {[

                            { id: "AddNewTraveler", label: "Add New Traveler", icon: IoIosAddCircle },
                            { id: "overview", label: "Overview", icon: FiActivity },
                            { id: "analytics", label: "Analytics", icon: FiBarChart2 },
                            { id: "recent", label: "Recent Travels", icon: FiClock },
                            { id: "countries", label: "Country Analysis", icon: FiMapPin },
                            { id: "types", label: "Travel Types", icon: FiAward }
                        ].map(item => (
                            <button
                                key={item.id}
                                onClick={() => setActiveTab(item.id)}
                                style={{
                                    ...styles.navItem,
                                    ...(activeTab === item.id ? styles.navItemActive : {})
                                }}
                            >
                                <item.icon style={styles.navIcon} />
                                {item.label}
                            </button>
                        ))}
                    </nav>

                    {/* Quick Stats */}
                    <div style={styles.sideCard}>
                        <div style={styles.cardHeader}>
                            <FiTrendingUp style={styles.cardIcon} />
                            <h3 style={styles.sideTitle}>Quick Stats</h3>
                        </div>
                        <div style={styles.statsGrid}>
                            <div style={styles.statItem}>
                                <div style={styles.statIconWrapper}>
                                    <FiUsers style={styles.statIcon} />
                                </div>
                                <div style={styles.statContent}>
                                    <span style={styles.statLabel}>Total Travelers</span>
                                    <strong style={styles.statValue}>{analytics.totalTravelers}</strong>
                                </div>
                            </div>
                            <div style={styles.statItem}>
                                <div style={{ ...styles.statIconWrapper, background: '#dcfce7' }}>
                                    <FiCheckCircle style={{ ...styles.statIcon, color: '#16a34a' }} />
                                </div>
                                <div style={statContent}>
                                    <span style={styles.statLabel}>Active Now</span>
                                    <strong style={styles.statValue}>{analytics.active}</strong>
                                </div>
                            </div>

                        </div>
                    </div>

                    {/* Today's Travelers */}
                    <div style={styles.sideCard}>
                        <div style={styles.cardHeader}>
                            <FiCalendar style={styles.cardIcon} />
                            <h3 style={styles.sideTitle}>Today's Travelers</h3>
                        </div>
                        {todayTravelers.length === 0 ? (
                            <div style={styles.emptyState}>
                                <FiFileText size={24} style={{ color: '#9ca3af', marginBottom: '8px' }} />
                                <p style={styles.sideEmpty}>No travels today</p>
                            </div>
                        ) : (
                            <ul style={styles.countryList}>
                                {todayTravelers.slice(0, 5).map((t, i) => (
                                    <li key={i} style={styles.countryItem}>
                                        <div style={styles.countryInfo}>
                                            <span style={styles.countryRank}>{i + 1}</span>
                                            <span style={styles.countryName}>
                                                {t.first_name} {t.last_name}
                                            </span>
                                        </div>
                                        <div style={{ fontSize: '12px', color: '#6b7280' }}>
                                            {t.from_country} → {t.to_country}
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </aside>

                {/* MAIN CONTENT */}
                <main style={styles.main}>
                    {/* File Upload Section */}
                    <div style={styles.card}>
                        <div style={styles.uploadRow}>
                            <div style={styles.fileUploadWrapper}>
                                <input
                                    type="file"
                                    accept=".xlsx,.xls,.csv"
                                    onChange={handleFileChange}
                                    style={styles.fileInput}
                                    id="file-upload"
                                />
                                <label htmlFor="file-upload" style={styles.fileInputLabel}>
                                    <FiUpload style={{ marginRight: '8px' }} />
                                    {file ? file.name : "Choose File"}
                                </label>
                            </div>
                            <div style={styles.buttonGroup}>
                                <button
                                    onClick={uploadFile}
                                    disabled={loading}
                                    style={loading ? styles.disabledPrimaryBtn : styles.primaryBtn}
                                >
                                    {loading ? (
                                        <>
                                            <div style={styles.spinner}></div>
                                            Processing...
                                        </>
                                    ) : (
                                        <>
                                            <FiUpload style={{ marginRight: '8px' }} />
                                            Upload File
                                        </>
                                    )}
                                </button>
                                <button
                                    onClick={() => {
                                        setItems([]);
                                        setSummary({});
                                        setFile(null);
                                        toast.info("Data cleared successfully.");
                                    }}
                                    style={styles.secondaryBtn}
                                >
                                    <FiTrash2 style={{ marginRight: '8px' }} />
                                    Clear
                                </button>
                                <button onClick={exportCsv} style={styles.ghostBtn}>
                                    <FiDownload style={{ marginRight: '8px' }} />
                                    Export CSV
                                </button>
                            </div>
                        </div>

                        {/* Filters Section */}
                        <div style={styles.filtersSection}>
                            <div style={styles.filtersHeader}>
                                <FiFilter style={{ marginRight: '8px', color: '#6b7280' }} />
                                <span style={styles.filtersTitle}>Filters & Search</span>
                            </div>
                            <div style={styles.filtersRow}>
                                <div style={styles.searchWrapper}>
                                    <FiSearch style={styles.searchIcon} />
                                    <input
                                        placeholder="Search by name, email, or location..."
                                        value={filters.search}
                                        onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                                        style={styles.searchInput}
                                    />
                                </div>
                                <select
                                    value={filters.country}
                                    onChange={(e) => setFilters({ ...filters, country: e.target.value })}
                                    style={styles.select}
                                >
                                    <option value="">All Countries</option>
                                    {countries.map((c) => (
                                        <option key={c}>{c}</option>
                                    ))}
                                </select>
                                <select
                                    value={filters.location}
                                    onChange={(e) => setFilters({ ...filters, location: e.target.value })}
                                    style={styles.select}
                                >
                                    <option value="">All Locations</option>
                                    {locations.map((loc) => (
                                        <option key={loc}>{loc}</option>
                                    ))}
                                </select>
                                <select
                                    value={filters.legType}
                                    onChange={(e) => setFilters({ ...filters, legType: e.target.value })}
                                    style={styles.select}
                                >
                                    <option value="">All Travel Types</option>
                                    {legTypes.map((t) => (
                                        <option key={t}>{t}</option>
                                    ))}
                                </select>
                                <select
                                    value={filters.status}
                                    onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                                    style={styles.select}
                                >
                                    <option value="">All Status</option>
                                    <option value="active">Active Only</option>
                                    <option value="inactive">Inactive Only</option>
                                </select>
                            </div>
                        </div>


                    </div>

                    {/* Dynamic Content based on Active Tab */}


                    {/* //////// */}
                    {/* Add New Traveler Tab */}
                    {activeTab === "AddNewTraveler" && (
                        <div style={styles.addTravelContainer}>
                            {/* Header Section */}
                            <div style={styles.addTravelHeader}>
                                <div style={styles.headerLeft}>
                                    <div style={styles.headerIconLarge}>
                                        <FiUserPlus size={32} />
                                    </div>
                                    <div>
                                        <h2 style={styles.addTravelTitle}>Add New Traveler</h2>
                                        <p style={styles.addTravelSubtitle}>Enter details for the new travel record</p>
                                    </div>
                                </div>
                                <div style={styles.headerStats}>
                                    <div style={styles.statCard}>
                                        <FiUsers size={20} style={{ color: '#3b82f6' }} />
                                        <div>
                                            <span style={styles.statNumber}>{analytics.totalTravelers}</span>
                                            <span style={styles.statLabel}>Total Travelers</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Form Container */}
                            <div style={styles.formMainContainer}>
                                <div style={styles.formCard}>
                                    {/* Form Header */}
                                    <div style={styles.formHeader}>
                                        <div style={styles.formIcon}>
                                            <FiUserPlus size={24} />
                                        </div>
                                        <div>
                                            <h3 style={styles.formTitle}>Traveler Information</h3>
                                            <p style={styles.formSubtitle}>Fill in all required details</p>
                                        </div>
                                    </div>

                                    {/* Form Sections */}
                                    <div style={styles.formSections}>
                                        {/* Personal Information */}
                                        <div style={styles.formSection}>
                                            <h4 style={styles.sectionTitle}>
                                                <FiUser style={styles.sectionIcon} />
                                                Personal Information
                                            </h4>
                                            <div style={styles.sectionGrid}>
                                                {[
                                                    { key: 'first_name', label: 'First Name', type: 'text', icon: FiUser, required: true },
                                                    { key: 'last_name', label: 'Last Name', type: 'text', icon: FiUser, required: true },
                                                    { key: 'emp_id', label: 'Employee ID', type: 'text', icon: FiAward, required: true },
                                                    { key: 'email', label: 'Email Address', type: 'email', icon: FiMail, required: true },
                                                ].map(({ key, label, type, icon: Icon, required }) => (
                                                    <div key={key} style={styles.inputGroup}>
                                                        <label style={styles.inputLabel}>
                                                            <Icon size={16} style={styles.labelIcon} />
                                                            {label}
                                                            {required && <span style={styles.required}>*</span>}
                                                        </label>
                                                        <input
                                                            type={type}
                                                            value={newTraveler[key] || ''}
                                                            onChange={(e) => setNewTraveler({ ...newTraveler, [key]: e.target.value })}
                                                            style={styles.formInput}
                                                            placeholder={`Enter ${label.toLowerCase()}`}
                                                        />
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Travel Details */}
                                        <div style={styles.formSection}>
                                            <h4 style={styles.sectionTitle}>
                                                <FiGlobe style={styles.sectionIcon} />
                                                Travel Details
                                            </h4>
                                            <div style={styles.sectionGrid}>
                                                {[
                                                    { key: 'leg_type', label: 'Travel Type', type: 'text', icon: FiNavigation, required: true },
                                                    { key: 'from_location', label: 'From Location', type: 'text', icon: FiMapPin, required: true },
                                                    { key: 'from_country', label: 'From Country', type: 'text', icon: FiGlobe, required: true },
                                                    { key: 'to_location', label: 'To Location', type: 'text', icon: FiMapPin, required: true },
                                                    { key: 'to_country', label: 'To Country', type: 'text', icon: FiGlobe, required: true },
                                                ].map(({ key, label, type, icon: Icon, required }) => (
                                                    <div key={key} style={styles.inputGroup}>
                                                        <label style={styles.inputLabel}>
                                                            <Icon size={16} style={styles.labelIcon} />
                                                            {label}
                                                            {required && <span style={styles.required}>*</span>}
                                                        </label>
                                                        <input
                                                            type={type}
                                                            value={newTraveler[key] || ''}
                                                            onChange={(e) => setNewTraveler({ ...newTraveler, [key]: e.target.value })}
                                                            style={styles.formInput}
                                                            placeholder={`Enter ${label.toLowerCase()}`}
                                                        />
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Timeline */}
                                        <div style={styles.formSection}>
                                            <h4 style={styles.sectionTitle}>
                                                <FiCalendar style={styles.sectionIcon} />
                                                Travel Timeline
                                            </h4>
                                            <div style={styles.sectionGrid}>
                                                {[
                                                    { key: 'begin_dt', label: 'Start Date & Time', type: 'datetime-local', icon: FiCalendar, required: true },
                                                    { key: 'end_dt', label: 'End Date & Time', type: 'datetime-local', icon: FiCalendar, required: true },
                                                ].map(({ key, label, type, icon: Icon, required }) => (
                                                    <div key={key} style={styles.inputGroup}>
                                                        <label style={styles.inputLabel}>
                                                            <Icon size={16} style={styles.labelIcon} />
                                                            {label}
                                                            {required && <span style={styles.required}>*</span>}
                                                        </label>
                                                        <input
                                                            type={type}
                                                            value={newTraveler[key] || ''}
                                                            onChange={(e) => setNewTraveler({ ...newTraveler, [key]: e.target.value })}
                                                            style={styles.formInput}
                                                        />
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Form Actions */}
                                    <div style={styles.formActions}>
                                        <button
                                            onClick={() => setActiveTab('overview')}
                                            style={styles.secondaryButton}
                                        >
                                            <FiArrowLeft size={16} />
                                            Back to Overview
                                        </button>
                                        <div style={styles.primaryActions}>
                                            <button
                                                onClick={() => setNewTraveler({})}
                                                style={styles.clearButton}
                                            >
                                                <FiRefreshCw size={16} />
                                                Clear Form
                                            </button>
                                            <button
                                                onClick={addTraveler}
                                                style={styles.saveButton}
                                            >
                                                <FiSave size={16} />
                                                Save Traveler
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* Quick Tips Sidebar */}
                                <div style={styles.tipsCard}>
                                    <h4 style={styles.tipsTitle}>
                                        <FiInfo size={18} />
                                        Quick Tips
                                    </h4>
                                    <div style={styles.tipsList}>
                                        <div style={styles.tipItem}>
                                            <FiCheckCircle size={14} style={{ color: '#10b981' }} />
                                            <span>Fill all required fields marked with *</span>
                                        </div>
                                        <div style={styles.tipItem}>
                                            <FiCheckCircle size={14} style={{ color: '#10b981' }} />
                                            <span>Use proper date and time format</span>
                                        </div>
                                        <div style={styles.tipItem}>
                                            <FiCheckCircle size={14} style={{ color: '#10b981' }} />
                                            <span>Double-check email addresses</span>
                                        </div>
                                        <div style={styles.tipItem}>
                                            <FiCheckCircle size={14} style={{ color: '#10b981' }} />
                                            <span>Ensure employee ID is unique</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                    {/* //////// */}

                    {activeTab === "overview" && (
