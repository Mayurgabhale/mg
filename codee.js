APAC
8
Travelers
6 Active
6 VIP
4 Active VIP
🌍
EMEA
15
Travelers
6 Active
11 VIP
4 Active VIP
🌎
LACA
7
Travelers
5 Active
2 VIP
2 Active VIP
🌎
NAMER
93
Travelers
43 Active
64 VIP
26 Active VIP
this is our regin cards, after i am clikc on this reion card i want to diplsy records in 
    this tablea
  {activeTab === "overview" && (
                                <div style={styles.card}>
                                    <div style={styles.tableHeader}>
                                        <h3 style={styles.tableTitle}>All Travel Records</h3>
                                        <span style={styles.tableBadge}>{filtered.length} records</span>
for example i clikc on apac card then after in this table disply   <h3 style={styles.tableTitle}>All Travel Records</h3> only apac records ok 
i hove you understand better..   what i want ok 
{/* 🆕 Region Count Cards */}
                        <div style={styles.regionCardsSection}>

                            <div style={styles.regionCardsGrid}>

                                {/* Total Card */}
                                <div style={styles.regionCard}>
                                    <div style={styles.regionCardHeader}>
                                        <div style={{ ...styles.regionIcon, background: '#3b82f6' }}>
                                            <FiGlobe size={16} />
                                        </div>
                                        <span style={styles.regionName}>Global</span>
                                    </div>

                                    <div style={styles.regionCardStats}>
                                        <span style={styles.regionCount}>{safeItems.length}</span>
                                        <span style={styles.regionLabel}>Total Travelers</span>
                                    </div>

                                    <div style={styles.regionCardActive}>
                                        <div style={styles.activeDot}></div>
                                        <span>{safeItems.filter(r => r.active_now).length} Active</span>
                                        <span style={{ marginLeft: 12, fontWeight: 600 }}>
                                            {safeItems.filter(r => r.is_vip).length} VIP
                                        </span>

                                        {/* ✅ Add this new line for Active VIP count */}
                                        <span style={{ marginLeft: 12, color: '#10b981', fontWeight: 600 }}>
                                            {safeItems.filter(r => r.active_now && r.is_vip).length} Active VIP
                                        </span>
                                    </div>
                                </div>

                                {/* Region Cards */}

                                {/* Region Cards */}
                                {Object.entries(regionsData || {})
                                    .sort(([a], [b]) => {
                                        if (a === 'GLOBAL') return -1;
                                        if (b === 'GLOBAL') return 1;
                                        return a.localeCompare(b);
                                    })
                                    .map(([regionCode, regionData]) => (
                                        <div
                                            key={regionCode}
                                            onClick={() => setSelectedRegion(regionCode)}  // ✅ make clickable
                                            style={{
                                                ...styles.regionCard,
                                                ...(filters.region === regionCode && styles.regionCardActive),
                                            }}
                                        >
                                            <div style={styles.regionCardHeader}>
                                                <div
                                                    style={{
                                                        ...styles.regionIcon,
                                                        background: getRegionColor(regionCode),
                                                    }}
                                                >
                                                    {getRegionIcon(regionCode)}
                                                </div>
                                                <span style={styles.regionName}>{regionCode}</span>
                                            </div>

                                            <div style={styles.regionCardStats}>
                                                <span style={styles.regionCount}>{regionData.total_count ?? 0}</span>
                                                <span style={styles.regionLabel}>Travelers</span>
                                            </div>

                                            <div style={styles.regionCardActive}>
                                                <div
                                                    style={{
                                                        ...styles.activeDot,
                                                        background:
                                                            (regionData.active_count ?? 0) > 0 ? '#10b981' : '#6b7280',
                                                    }}
                                                ></div>

                                                <span>{regionData.active_count ?? 0} Active</span>

                                                <span style={{ marginLeft: 12, fontWeight: 600 }}>
                                                    {regionData.vip_count ?? 0} VIP
                                                </span>

                                                {/* ✅ New Active VIP count */}
                                                <span style={{ marginLeft: 12, color: '#10b981', fontWeight: 600 }}>
                                                    {regionData.active_vip_count ?? 0} Active VIP
                                                </span>
                                            </div>
                                        </div>
                                    ))}

                            </div>
                        </div>

-------------
     {activeTab === "overview" && (
                                <div style={styles.card}>
                                    <div style={styles.tableHeader}>
                                        <h3 style={styles.tableTitle}>All Travel Records</h3>
                                        <span style={styles.tableBadge}>{filtered.length} records</span>
                                    </div>
                                    <div style={styles.tableWrap}>
                                        <table style={styles.table}>
                                            <thead style={styles.thead}>
                                                <tr>
                                                    <th style={styles.th}>Status</th>
                                                    <th style={styles.th}>Traveler</th>
                                                    <th style={styles.th}>Emp ID</th>
                                                    <th style={styles.th}>Email</th>
                                                    <th style={styles.th}>Type</th>
                                                    <th style={styles.th}>From</th>
                                                    <th style={styles.th}>To</th>
                                                    <th style={styles.th}>Start Date</th>
                                                    <th style={styles.th}>End Date</th>
                                                    <th style={styles.th}>Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {filtered.length === 0 ? (
                                                    <tr>
                                                        <td colSpan="9" style={styles.emptyRow}>
                                                            <div style={styles.emptyState}>
                                                                <FiFileText size={32} style={{ color: '#9ca3af', marginBottom: '12px' }} />
                                                                <p>No matching results found</p>
                                                                <p style={styles.emptySubtext}>Upload a file or adjust your filters</p>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ) : (
                                                    filtered.map((r, i) => (
                                                        <tr key={i} style={i % 2 === 0 ? styles.rowEven : styles.rowOdd}>
                                                            <td style={styles.td}>
                                                                {r.active_now ? (
                                                                    <div style={styles.activeBadge}>
                                                                        <FiCheckCircle size={14} />
                                                                        Active
                                                                    </div>
                                                                ) : (
                                                                    <div style={styles.inactiveBadge}>
                                                                        <FiXCircle size={14} />
                                                                        Inactive
                                                                    </div>
                                                                )}
                                                            </td>
                                                            <td style={styles.td}>
                                                                <div style={styles.userCell}>
                                                                    <div style={styles.avatar}>
                                                                        <FiUser size={14} />
                                                                    </div>
                                                                    <span>
                                                                        {r.first_name} {r.last_name}
                                                                    </span>
                                                                </div>
                                                            </td>
                                                            <td style={styles.td}>
                                                                <div style={styles.userCell}>
                                                                    <span style={styles.empId}>
                                                                        {r.emp_id || 'N/A'}
                                                                    </span>
                                                                </div>
                                                            </td>
                                                            <td style={styles.td}>
                                                                <div style={styles.emailCell}>
                                                                    <FiMail size={14} style={{ marginRight: '6px', color: '#6b7280' }} />
                                                                    {r.email}
                                                                </div>
                                                            </td>
                                                            <td style={styles.td}>
                                                                <span style={styles.typeBadge}>{r.leg_type}</span>
                                                            </td>
                                                            <td style={styles.td}>
                                                                <div style={styles.combinedLocationCell}>
                                                                    <div style={styles.locationRow}>
                                                                        <FiMapPin size={12} style={{ marginRight: '4px', color: '#ef4444' }} />
                                                                        <span style={styles.locationText}>
                                                                            {r.from_location || 'N/A'}
                                                                        </span>
                                                                    </div>
                                                                    <div style={styles.countryRow}>
                                                                        <FiGlobe size={10} style={{ marginRight: '4px', color: '#3b82f6' }} />
                                                                        <span style={styles.countryText}>
                                                                            {r.from_country || 'Unknown'}
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                            </td>
                                                            <td style={styles.td}>
                                                                <div style={styles.combinedLocationCell}>
                                                                    <div style={styles.locationRow}>
                                                                        <FiMapPin size={12} style={{ marginRight: '4px', color: '#10b981' }} />
                                                                        <span style={styles.locationText}>
                                                                            {r.to_location || 'N/A'}
                                                                        </span>
                                                                    </div>
                                                                    <div style={styles.countryRow}>
                                                                        <FiGlobe size={10} style={{ marginRight: '4px', color: '#3b82f6' }} />
                                                                        <span style={styles.countryText}>
                                                                            {r.to_country || 'Unknown'}
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                            </td>
                                                            <td style={styles.td}>
                                                                <div style={styles.dateCell}>
                                                                    <FiCalendar size={14} style={{ marginRight: '6px', color: '#6b7280' }} />
                                                                    {fmt(r.begin_dt)}
                                                                </div>
                                                            </td>
                                                            <td style={styles.td}>
                                                                <div style={styles.dateCell}>
                                                                    <FiCalendar size={14} style={{ marginRight: '6px', color: '#6b7280' }} />
                                                                    {fmt(r.end_dt)}
                                                                </div>
                                                            </td>
                                                            <td style={styles.td}>
                                                                <button
                                                                    onClick={() => setSelectedTraveler(r)}
                                                                    style={styles.viewButton}
                                                                >
                                                                    <FiEye size={14} />
                                                                    View
                                                                </button>
                                                            </td>
                                                        </tr>
                                                    ))
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}


read alos this below code carefully..
    const EmployeeTravelDashboard = () => {
    const [file, setFile] = useState(null);
    const [items, setItems] = useState([]);
    const [summary, setSummary] = useState({});
    const [loading, setLoading] = useState(false);

    const [filters, setFilters] = useState({
        country: "",
        location: "",
        legType: "",
        search: "",
        status: "",
        showVIPOnly: false,
    });
    const [selectedTraveler, setSelectedTraveler] = useState(null);
    const [activeTab, setActiveTab] = useState("overview");

    const [showUploadFileSection, setShowUploadFileSection] = useState(false);
    // track which city cards are expanded
    const [expandedCities, setExpandedCities] = useState({});


    // 🆕 Add theme state
    const [isDarkTheme, setIsDarkTheme] = useState(false);
    // 🆕 Toggle theme function
    const toggleTheme = () => {
        setIsDarkTheme(!isDarkTheme);
    };

    // Add to your existing state variables
    const [regionsData, setRegionsData] = useState({});
    const [selectedRegion, setSelectedRegion] = useState(null);
    const [regionDetails, setRegionDetails] = useState(null);
    // 🆕 Helper functions for regions
    const getRegionColor = (regionCode) => {
        const colors = {
            'GLOBAL': '#6b7280',
            'APAC': '#7c3aed',
            'EMEA': '#7c3aed',
            'LACA': '#7c3aed',
            'NAMER': '#7c3aed'
        };
        return colors[regionCode] || '#6b7280';
    };

    const getRegionIcon = (regionCode) => {
        const icons = {
            'GLOBAL': '🌍',
            'APAC': '🌏',
            'EMEA': '🌍',
            'LACA': '🌎',
            'NAMER': '🌎'
        };
        return icons[regionCode] || '📍';
    };


    // 📝📝📝📝📝📝📝

    // State variables - UPDATED
    const [employeeData, setEmployeeData] = useState([]);
    const [monthlyFile, setMonthlyFile] = useState(null);
    const [showUploadPopup, setShowUploadPopup] = useState(false);
    const [hasUploadedData, setHasUploadedData] = useState(false);
    const [uploadTime, setUploadTime] = useState(null);
    const [uploadStatus, setUploadStatus] = useState("");

    // Load data on component mount - UPDATED
    useEffect(() => {
        const savedHasUploadedData = localStorage.getItem('hasUploadedData');
        const savedUploadTime = localStorage.getItem('uploadTime');
        const savedMonthlyFile = localStorage.getItem('monthlyFile');

        if (savedHasUploadedData === 'true') {
            setHasUploadedData(true);
            if (savedUploadTime) {
                setUploadTime(new Date(savedUploadTime));
            }
            if (savedMonthlyFile) {
                setMonthlyFile(JSON.parse(savedMonthlyFile));
            }
            fetchEmployeeData();
        }
    }, []);


    const fetchEmployeeData = async () => {
        try {
            const res = await fetch("http://localhost:8000/monthly_sheet/employees");
            const data = await res.json();

            setEmployeeData(data.employees || []);  // ✅ Fix: use array
            setUploadTime(data.uploaded_at ? new Date(data.uploaded_at) : null);
            setUploadStatus(data.message || "");
        } catch (err) {
            console.error("Failed to fetch employee data:", err);
        }
    };

    // Handle file selection
    const handleMonthlyFileChange = (e) => {
        const selected = e.target.files?.[0];
        setMonthlyFile(selected);
    };

    // Handle upload submission - UPDATED
    const handleUploadSubmit = async () => {
        if (!monthlyFile) return;

        const formData = new FormData();
        formData.append("file", monthlyFile);

        try {
            setUploadStatus("Uploading...");

            const res = await fetch("http://localhost:8000/monthly_sheet/upload_monthly", {
                method: "POST",
                body: formData,
            });

            const result = await res.json();

            if (res.ok) {
                setUploadStatus("Upload successful!");
                setUploadTime(new Date());
                setHasUploadedData(true);
                setShowUploadPopup(false);

                // Save ALL data to localStorage
                localStorage.setItem('hasUploadedData', 'true');
                localStorage.setItem('uploadTime', new Date().toISOString());
                localStorage.setItem('monthlyFile', JSON.stringify({
                    name: monthlyFile.name,
                    size: monthlyFile.size,
                    type: monthlyFile.type,
                    lastModified: monthlyFile.lastModified
                }));

                // Fetch the uploaded data
                await fetchEmployeeData();
                toast.success("File uploaded successfully!");
            } else {
                throw new Error(result.detail || "Upload failed");
            }
        } catch (err) {
            console.error(err);
            setUploadStatus("Upload failed!");
            toast.error("Upload failed!");
        }
    };

    // Delete confirmation
    const confirmDeleteData = () => {
        if (window.confirm("Are you sure you want to delete all employee data? This action cannot be undone.")) {
            deleteEmployeeData();
        }
    };

    // Delete employee data - UPDATED
    const deleteEmployeeData = async () => {
        try {
            // Clear backend data
            await fetch("http://localhost:8000/monthly_sheet/clear_data", {
                method: "DELETE"
            });

            // Clear frontend state
            setEmployeeData([]);
            setMonthlyFile(null);
            setHasUploadedData(false);
            setUploadTime(null);
            setUploadStatus("");

            // Clear localStorage
            localStorage.removeItem('hasUploadedData');
            localStorage.removeItem('uploadTime');
            localStorage.removeItem('monthlyFile');

            toast.success("Employee data cleared successfully.");
        } catch (err) {
            console.error(err);
            toast.error("Failed to clear data.");
        }
    };
    // 📝📝📝📝📝📝📝

    // ⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️
    const [showAddForm, setShowAddForm] = useState(false);
    const [newTraveler, setNewTraveler] = useState({
        first_name: "",
        last_name: "",
        emp_id: "",
        email: "",
        begin_dt: "",   // changed from begin_dt -> begin_dt
        end_dt: "",     // changed from end_dt   -> end_dt
        from_location: "",
        from_country: "",
        to_location: "",
        to_country: "",
        leg_type: "",
    });


    // --- addTraveler: use correct daily_sheet endpoint and payload keys ---

    const addTraveler = async () => {
        try {
            // Ensure payload field names match backend (begin_dt / end_dt)
            const payload = {
                ...newTraveler,
            };

            await axios.post("http://localhost:8000/daily_sheet/add_traveler", payload);
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

            // Refresh data after adding (use the daily_sheet data endpoint)
            const res = await axios.get("http://localhost:8000/daily_sheet/data");
            const respPayload = res.data || {};
            setItems(respPayload.items || []);
            setSummary(respPayload.summary || {});
            if (respPayload.last_updated) setLastUpdated(respPayload.last_updated);
        } catch (err) {
            console.error(err);
            toast.error("Failed to add traveler. Check backend.");
        }
    };
    // ⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️




    const styles = getStyles(isDarkTheme);

    const [lastUpdated, setLastUpdated] = useState(null);

    // ✅ Load saved data immediately on refresh + auto-refresh every 10 seconds
    // --- useEffect: fetchLatest should hit /daily_sheet/data ---
    useEffect(() => {
        const fetchLatest = async (showToast = false) => {
            try {
                // const res = await axios.get("http://localhost:8000/daily_sheet/records");
                const res = await axios.get("http://localhost:8000/daily_sheet/data");
                const payload = res.data || {};
                setItems(payload.items || []);
                setSummary(payload.summary || {});
                if (payload.last_updated) setLastUpdated(payload.last_updated);
                if (showToast) toast.success("Data loaded");
            } catch (err) {
                console.error(err);
                if (showToast) toast.error("Failed to load data");
            }
        };

        // initial load
        fetchLatest(true);

        // keep refreshing every 10s
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
            // NOTE: endpoint changed to /daily_sheet/upload
            const res = await axios.post("http://localhost:8000/daily_sheet/upload", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            const payload = res.data || {};
            const rows = payload.items || [];

            setItems(payload.items || []);
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


    // ✅ Apply filters
    const filtered = safeItems
        .filter((r) => {
            const s = filters.search.toLowerCase();
            if (s) {
                const hay = `${r.first_name ?? ""} ${r.last_name ?? ""} ${r.email ?? ""} ${r.from_location ?? ""} ${r.to_location ?? ""}`.toLowerCase();
                if (!hay.includes(s)) return false;
            }
            if (filters.country && r.from_country !== filters.country) return false;
            if (filters.location) {
                const fromMatch = r.from_location?.toLowerCase().includes(filters.location.toLowerCase());
                const toMatch = r.to_location?.toLowerCase().includes(filters.location.toLowerCase());
                if (!fromMatch && !toMatch) return false;
            }
            if (filters.legType && r.leg_type !== filters.legType) return false;
            if (filters.status === "active" && !r.active_now) return false;
            if (filters.status === "inactive" && r.active_now) return false;

            // ✅ Show only VIPs if toggle is ON
            if (filters.showVIPOnly && !r.is_vip) return false;

            return true;
        });

    // ✅ Remove duplicates only for VIP view (unique by emp_id or email)
    let processed = filters.showVIPOnly
        ? Array.from(new Map(filtered.map((r) => [r.emp_id || r.email, r])).values())
        : filtered;
        

    // ✅ Sort so active travelers always appear first
    processed = processed.sort((a, b) => {
        if (a.active_now === b.active_now) return 0;
        return a.active_now ? -1 : 1;
    });


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


    // /////////////////////
    // Add this useEffect to fetch regions data
    useEffect(() => {
       
        const fetchRegionsData = async () => {
            try {
                const res = await fetch("http://127.0.0.1:8000/daily_sheet/regions");
                if (!res.ok) throw new Error("Failed to fetch regions");
                const payload = await res.json();
                // backend returns { regions: { ... } }
                setRegionsData(payload.regions || {});
            } catch (err) {
                console.error("Failed to fetch regions data:", err);
                toast.error("Failed to load region summary");
            }
        };


        fetchRegionsData();
    }, [safeItems]); // Refresh when items change


  
    // Fetch detail for a single region and show details view
    const fetchRegionDetails = async (regionCode) => {
        try {
            // optional: optimistic UI set so card looks selected immediately
            setSelectedRegion(regionCode);
            setRegionDetails(null); // clear old details while loading

            const res = await fetch(`http://127.0.0.1:8000/daily_sheet/regions/${encodeURIComponent(regionCode)}`);
            if (!res.ok) {
                // revert selection if fetch fails
                setSelectedRegion(null);
                throw new Error(`Failed to fetch details for ${regionCode}`);
            }
            const payload = await res.json();
            // payload is the region object (region_code, total_count, cities, ...)
            setRegionDetails(payload || {});
        } catch (err) {
            console.error("Error fetching region details:", err);
            toast.error(`Failed to load details for ${regionCode}`);
            setSelectedRegion(null);
            setRegionDetails(null);
        }
    };
