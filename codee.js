write the correct for this tab 
    { id: "regions", label: "Global", icon: FiGlobe }, // 🆕 New tab 
ok 
    for ths tab    {/* ................. */}
                            {/* Region Analysis Tab */}
                            {activeTab === "regions" && (

read below all code carefully, and correct it ok..
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
        begin_date: "",   // changed from begin_date -> begin_date
        end_date: "",     // changed from end_date   -> end_date
        from_location: "",
        from_country: "",
        to_location: "",
        to_country: "",
        leg_type: "",
    });


    // --- addTraveler: use correct daily_sheet endpoint and payload keys ---

    const addTraveler = async () => {
        try {
            // Ensure payload field names match backend (begin_date / end_date)
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
                begin_date: "",
                end_date: "",
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
            if (!r.begin_date || !r.end_date) return 0;
            const start = new Date(r.begin_date);
            const end = new Date(r.end_date);
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
            .filter(r => r.begin_date && new Date(r.begin_date) >= sevenDaysAgo)
            .sort((a, b) => new Date(b.begin_date) - new Date(a.begin_date))
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
        if (!r.begin_date) return false;
        const start = new Date(r.begin_date);
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
            if (safeItems.length > 0) {
                try {
                    const response = await axios.get('http://localhost:8000/daily_sheet/regions');
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
            const response = await axios.get(`http://localhost:8000/daily_sheet/regions/${regionCode}`);
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
            if (!traveler.begin_date || !traveler.end_date) return 'Unknown';
            const start = new Date(traveler.begin_date);
            const end = new Date(traveler.end_date);
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
                                            {fmt(traveler.begin_date) || 'Not Set'}
                                        </span>
                                    </div>
                                    <div style={styles.detailRow}>
                                        <span style={styles.detailLabel}>End Date</span>
                                        <span style={styles.detailValue}>
                                            <FiClock size={14} style={styles.inlineIcon} />
                                            {fmt(traveler.end_date) || 'Not Set'}
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

                            {/* ................. */}
                            {/* Region Analysis Tab */}
                            {activeTab === "regions" && (
                                <div style={styles.regionsContainer}>
                                    {/* Header */}
                                    <div style={styles.regionsHeader}>
                                        <div style={styles.headerLeft}>
                                            <div style={styles.headerIconLarge}>
                                                <FiGlobe size={32} />
                                            </div>
                                            <div>
                                                <h2 style={styles.regionsTitle}>Region Analysis</h2>
                                                <p style={styles.regionsSubtitle}>Travel distribution across global regions</p>
                                            </div>
                                        </div>
                                        <div style={styles.headerStats}>
                                            <div style={styles.statCard}>
                                                <FiMap size={20} style={{ color: '#3b82f6' }} />
                                                <div>
                                                    <span style={styles.statNumber}>{Object.keys(regionsData).length}</span>
                                                    <span style={styles.statLabel}>Regions</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {selectedRegion ? (
                                        /* Region Details View */
                                        <div style={styles.regionDetailsContainer}>
                                            <div style={styles.regionDetailsHeader}>
                                                <button
                                                    onClick={() => {
                                                        setSelectedRegion(null);
                                                        setRegionDetails(null);
                                                    }}
                                                    style={styles.backButton}
                                                >
                                                    <FiArrowLeft size={16} />
                                                    Back to Regions
                                                </button>
                                                <h3 style={styles.regionDetailsTitle}>
                                                    {selectedRegion} Region Details
                                                </h3>
                                                <div style={styles.regionStats}>
                                                    <div style={styles.regionStat}>
                                                        <span style={styles.regionStatValue}>{regionDetails?.total_count || 0}</span>
                                                        <span style={styles.regionStatLabel}>Total Travelers</span>
                                                    </div>
                                                    <div style={styles.regionStat}>
                                                        <span style={styles.regionStatValue}>{regionDetails?.active_count || 0}</span>
                                                        <span style={styles.regionStatLabel}>Active Now</span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Cities in this Region */}
                                            <div style={styles.citiesGrid}>
                                                {Object.entries(regionDetails?.cities || {}).map(([cityName, cityData]) => (
                                                    <div key={cityName} style={styles.cityCard}>
                                                        <div style={styles.cityHeader}>
                                                            <FiMapPin style={styles.cityIcon} />
                                                            <h4 style={styles.cityName}>{cityName}</h4>
                                                            <div style={styles.cityStats}>
                                                                <span style={styles.cityCount}>{cityData.total_count}</span>
                                                                <span style={styles.cityLabel}>travelers</span>
                                                            </div>
                                                        </div>
                                                        <div style={styles.cityDetails}>
                                                            <div style={styles.cityStat}>
                                                                <FiUsers size={14} />
                                                                <span>Total: {cityData.total_count}</span>
                                                            </div>
                                                            <div style={styles.cityStat}>
                                                                <FiActivity size={14} />
                                                                <span>Active: {cityData.active_count}</span>
                                                            </div>
                                                        </div>

                                                        {/* Sample Travelers */}
                                                        <div style={styles.sampleTravelers}>
                                                            <h5 style={styles.sampleTitle}>Recent Travelers:</h5>
                                                            {cityData.sample_items?.slice(0, 3).map((traveler, index) => (
                                                                <div key={index} style={styles.travelerItem}>
                                                                    <div style={styles.travelerInfo}>
                                                                        <span style={styles.travelerName}>
                                                                            {traveler.first_name} {traveler.last_name}
                                                                        </span>
                                                                        <span style={styles.travelerId}>{traveler.emp_id}</span>
                                                                    </div>
                                                                    <div style={traveler.active_now ? styles.activeStatusSmall : styles.inactiveStatusSmall}>
                                                                        {traveler.active_now ? 'Active' : 'Completed'}
                                                                    </div>
                                                                </div>
                                                            ))}
                                                            {cityData.sample_items?.length > 3 && (
                                                                <div style={styles.moreTravelers}>
                                                                    +{cityData.sample_items.length - 3} more travelers
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ) : (
                                        /* Regions Overview View */
                                        <div style={styles.regionsGrid}>
                                            {Object.entries(regionsData).map(([regionCode, regionData]) => (
                                                <div
                                                    key={regionCode}
                                                    style={styles.regionCard}
                                                    onClick={() => fetchRegionDetails(regionCode)}
                                                >
                                                    <div style={styles.regionHeader}>
                                                        <div style={styles.regionIcon}>
                                                            <FiGlobe size={20} />
                                                        </div>
                                                        <h3 style={styles.regionName}>{regionCode}</h3>
                                                        <div style={styles.regionStats}>
                                                            <div style={styles.regionStat}>
                                                                <span style={styles.regionStatValue}>{regionData.total_count}</span>
                                                                <span style={styles.regionStatLabel}>Total</span>
                                                            </div>
                                                            <div style={styles.regionStat}>
                                                                <span style={{
                                                                    ...styles.regionStatValue,
                                                                    color: regionData.active_count > 0 ? '#16a34a' : '#6b7280'
                                                                }}>
                                                                    {regionData.active_count}
                                                                </span>
                                                                <span style={styles.regionStatLabel}>Active</span>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Top Cities Preview */}
                                                    <div style={styles.citiesPreview}>
                                                        <span style={styles.citiesLabel}>Top Cities:</span>
                                                        <div style={styles.citiesList}>
                                                            {Object.keys(regionData.cities || {}).slice(0, 3).map(city => (
                                                                <span key={city} style={styles.cityTag}>{city}</span>
                                                            ))}
                                                            {Object.keys(regionData.cities || {}).length > 3 && (
                                                                <span style={styles.moreCities}>
                                                                    +{Object.keys(regionData.cities || {}).length - 3} more
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>

                                                    <div style={styles.viewDetails}>
                                                        Click to view details →
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}
