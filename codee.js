this buttion is not work 
          <h2 style={styles.uploadTitle}>Upload Monthly Active Sheet</h2>
                                        <p style={styles.uploadSubtitle}>
                                            Upload the latest monthly employee file to update active staff records.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Upload Form */}
                            <div style={styles.uploadForm}>
                                <input
                                    type="file"
                                    accept=".xlsx,.xls,.csv"
                                    onChange={(e) => setMonthlyFile(e.target.files[0])}
                                    style={styles.fileInput}
                                />
                                <button
                                    onClick={uploadMonthlySheet}
                                    style={styles.uploadButton}
                                    disabled={!monthlyFile}
                                >
                                    <FiUpload style={{ marginRight: 8 }} /> Upload File
                                </button>
                            </div>
not getting any file. not happing anythig, just looking one text 

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

    // Add to your existing state variables
    const [regionsData, setRegionsData] = useState({});
    const [selectedRegion, setSelectedRegion] = useState(null);
    const [regionDetails, setRegionDetails] = useState(null);
    // 🆕 Helper functions for regions
    const getRegionColor = (regionCode) => {
        const colors = {
            'GLOBAL': '#6b7280',
            'APAC': '#dc2626',
            'EMEA': '#2563eb',
            'LACA': '#16a34a',
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


    const [monthlyFile, setMonthlyFile] = useState(null);
const [uploadStatus, setUploadStatus] = useState("");
const [employeeData, setEmployeeData] = useState([]);

const uploadMonthlySheet = async () => {
    if (!monthlyFile) {
        setUploadStatus("Please select a file first.");
        return;
    }

    const formData = new FormData();
    formData.append("file", monthlyFile);

    try {
        setUploadStatus("Uploading...");

        const response = await fetch("http://127.0.0.1:8000/monthly_sheet/upload_monthly", {
            method: "POST",
            body: formData,
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.detail || "Upload failed.");
        }

        const result = await response.json();
        setUploadStatus(result.message || "Upload successful!");

        // Optionally fetch employee data after upload
        const dataRes = await fetch("http://127.0.0.1:8000/monthly_sheet/employees");
        const data = await dataRes.json();
        setEmployeeData(data);

    } catch (err) {
        console.error("Upload error:", err);
        setUploadStatus(`Error: ${err.message}`);
    }
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


    // /////////////////////
    // Add this useEffect to fetch regions data
    useEffect(() => {
        const fetchRegionsData = async () => {
            if (safeItems.length > 0) {
                try {
                    const response = await axios.get('http://localhost:8000/regions');
                    setRegionsData(response.data.regions || {});
                } catch (error) {
                    console.error('Error fetching regions data:', error);
                }
            }
        };

        fetchRegionsData();
    }, [safeItems]); // Refresh when items change

    // Function to fetch specific region details
    const fetchRegionDetails = async (regionCode) => {
        try {
            const response = await axios.get(`http://localhost:8000/regions/${regionCode}`);
            setRegionDetails(response.data.region);
            setSelectedRegion(regionCode);
        } catch (error) {
            console.error('Error fetching region details:', error);
            toast.error('Failed to load region details');
        }
    };

    // /////////////////////

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

                            { id: "regions", label: "Global", icon: FiGlobe }, // 🆕 New tab
                            { id: "AddNewTraveler", label: "Add New Traveler", icon: IoIosAddCircle },
                            { id: "overview", label: "Overview", icon: FiActivity },
                            { id: "analytics", label: "Analytics", icon: FiBarChart2 },
                            { id: "recent", label: "Recent Travels", icon: FiClock },
                            { id: "countries", label: "Country Analysis", icon: FiMapPin },
                            { id: "types", label: "Travel Types", icon: FiAward },
                            { id: "uploadMonthly", label: "Upload Monthly Active Sheet", icon: FiUpload },
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
                        {/* Compact Upload Section */}
                        <div style={styles.compactUploadRow}>
                            <div style={styles.compactFileUpload}>
                                <input
                                    type="file"
                                    accept=".xlsx,.xls,.csv"
                                    onChange={handleFileChange}
                                    style={styles.fileInput}
                                    id="file-upload"
                                />
                                <label htmlFor="file-upload" style={styles.compactFileLabel}>
                                    <FiUpload size={16} />
                                    {file ? file.name : "Choose File"}
                                </label>
                            </div>
                            <div style={styles.compactButtonGroup}>
                                <button
                                    onClick={uploadFile}
                                    disabled={loading}
                                    style={loading ? styles.disabledCompactBtn : styles.compactPrimaryBtn}
                                >
                                    {loading ? (
                                        <div style={styles.smallSpinner}></div>
                                    ) : (
                                        <FiUpload size={14} />
                                    )}
                                </button>
                                <button
                                    onClick={() => {
                                        setItems([]);
                                        setSummary({});
                                        setFile(null);
                                        toast.info("Data cleared successfully.");
                                    }}
                                    style={styles.compactSecondaryBtn}
                                >
                                    <FiTrash2 size={14} />
                                </button>
                                <button onClick={exportCsv} style={styles.compactGhostBtn}>
                                    <FiDownload size={14} />
                                </button>
                            </div>
                        </div>
