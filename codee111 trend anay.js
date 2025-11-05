this is frontend i want to add this in ok, 
    where to add and create more atractive wiht click bale ok 
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
 =

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
         =

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
                             =

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
                              =
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
                =
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
                =
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
                     =
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
                           =
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
                           =
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
                            =
                            </div>

                            {/* Form Container */}
                            <div style={styles.formMainContainer}>
                                <div style={styles.formCard}>
                                    {/* Form Header */}
                                    <div style={styles.formHeader}>
                                    =iUser, required: true },
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
                                      =

                                {/* Quick Tips Sidebar */}
                                <div style={styles.tipsCard}>
                                    <h4 style={styles.tipsTitle}>
                                        <FiInfo size={18} />
                        =
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                    {/* //////// */}

                    {activeTab === "overview" && (
