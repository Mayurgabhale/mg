

we have two upload sectin that why we geetng one issue is,, 
   Upload Monthly Active Sheet
Upload the latest monthly employee file to update active staff records

0
Employees
Drop your file here
Supports .xlsx, .xls, .csv files up to 10MB

file is not upload i measn this buttion Process Upload show disabaled not wokr 
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



                        {/* 📝📝📝📝📝 */}

                        {/* 🆕 Region Count Cards */}
                        <div style={styles.regionCardsSection}>
                            <div style={styles.sectionHeader}>
                                <FiGlobe style={styles.sectionIcon} />
                                <h3 style={styles.sectionTitle}>Regions Overview</h3>
                            </div>
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
                                    </div>
                                </div>

                                {/* Region Cards */}
                                {Object.entries(regionsData)
                                    .sort(([a], [b]) => {
                                        // Sort: GLOBAL first, then alphabetically
                                        if (a === 'GLOBAL') return -1;
                                        if (b === 'GLOBAL') return 1;
                                        return a.localeCompare(b);
                                    })
                                    .map(([regionCode, regionData]) => (
                                        <div
                                            key={regionCode}
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
                                                <span style={styles.regionCount}>{regionData.total_count}</span>
                                                <span style={styles.regionLabel}>Travelers</span>
                                            </div>
                                            <div style={styles.regionCardActive}>
                                                <div
                                                    style={{
                                                        ...styles.activeDot,
                                                        background:
                                                            regionData.active_count > 0 ? '#10b981' : '#6b7280',
                                                    }}
                                                ></div>
                                                <span>{regionData.active_count} Active</span>
                                            </div>
                                        </div>
                                    ))}
                            </div>
                        </div>
                        {/* 📝📝📝📝📝 */}



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
                                        placeholder="Search travelers..."
                                        value={filters.search}
                                        onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                                        style={styles.searchInput}
                                    />
                                </div>

                                {/* Region Filter Dropdown */}
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

                    {activeTab === "uploadMonthly" && (
                        <div style={styles.uploadContainer}>
                            {/* Header */}
                            <div style={styles.uploadHeader}>
                                <div style={styles.headerLeft}>
                                    <div style={styles.uploadIcon}>
                                        <FiUpload size={32} />
                                    </div>
                                    <div>
                                        <h2 style={styles.uploadTitle}>Upload Monthly Active Sheet</h2>
                                        <p style={styles.uploadSubtitle}>
                                            Upload the latest monthly employee file to update active staff records
                                        </p>
                                    </div>
                                </div>
                                <div style={styles.headerStats}>
                                    <div style={styles.statCard}>
                                        <FiDatabase size={20} />
                                        <div>
                                            <span style={styles.statNumber}>{employeeData.length}</span>
                                            <span style={styles.statLabel}>Employees</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Upload Card */}
                            <div style={styles.uploadCard}>
                                <div style={styles.uploadArea}>
                                    <FiUploadCloud size={48} style={styles.uploadCloudIcon} />
                                    <h3 style={styles.uploadAreaTitle}>Drop your file here</h3>
                                    <p style={styles.uploadAreaSubtitle}>Supports .xlsx, .xls, .csv files up to 10MB</p>

                                    <label htmlFor="file-upload" style={styles.fileInputLabel}>
                                        <FiFolder style={{ marginRight: 8 }} />
                                        Choose File
                                    </label>
                                    <input
                                        id="file-upload"
                                        type="file"
                                        onChange={handleMonthlyFileChange}
                                        style={styles.hiddenFileInput}
                                        accept=".xlsx,.xls,.csv"
                                    />

                                    {monthlyFile && (
                                        <div style={styles.filePreview}>
                                            <FiFile style={styles.fileIcon} />
                                            <div style={styles.fileInfo}>
                                                <span style={styles.fileName}>{monthlyFile.name}</span>
                                                <span style={styles.fileSize}>
                                                    {(monthlyFile.size / 1024 / 1024).toFixed(2)} MB
                                                </span>
                                            </div>
                                            <button
                                                onClick={() => setMonthlyFile(null)}
                                                style={styles.removeFileButton}
                                            >
                                                <FiX />
                                            </button>
                                        </div>
                                    )}
                                </div>

                                {/* Upload Button */}
                                <button
                                    onClick={uploadMonthlySheet}
                                    disabled={!monthlyFile || uploadStatus?.includes('Uploading')}
                                    style={!monthlyFile ? styles.uploadButtonDisabled : styles.uploadButton}
                                >
                                    {uploadStatus?.includes('Uploading') ? (
                                        <>
                                            <FiLoader size={16} style={{ marginRight: 8, animation: 'spin 1s linear infinite' }} />
                                            Uploading...
                                        </>
                                    ) : (
                                        <>
                                            <FiUpload style={{ marginRight: 8 }} />
                                            Process Upload
                                        </>
                                    )}
                                </button>
                            </div>

                            {/* Upload Status & Metadata */}
                            {uploadStatus && (
                                <div style={uploadStatus.includes('Error') ? styles.uploadStatusError : styles.uploadStatusSuccess}>
                                    <div style={styles.statusHeader}>
                                        {uploadStatus.includes('Error') ? <FiAlertCircle size={20} /> : <FiCheckCircle size={20} />}
                                        <span style={styles.statusTitle}>
                                            {uploadStatus.includes('Error') ? 'Upload Failed' : 'Upload Successful'}
                                        </span>
                                    </div>
                                    <p style={styles.statusMessage}>{uploadStatus}</p>

                                    {/* Upload Metadata */}
                                    {!uploadStatus.includes('Error') && monthlyFile && (
                                        <div style={styles.metadataGrid}>
                                            <div style={styles.metadataItem}>
                                                <span style={styles.metadataLabel}>File Name</span>
                                                <span style={styles.metadataValue}>{monthlyFile.name}</span>
                                            </div>
                                            <div style={styles.metadataItem}>
                                                <span style={styles.metadataLabel}>File Size</span>
                                                <span style={styles.metadataValue}>
                                                    {(monthlyFile.size / 1024 / 1024).toFixed(2)} MB
                                                </span>
                                            </div>
                                            <div style={styles.metadataItem}>
                                                <span style={styles.metadataLabel}>Upload Date</span>
                                                <span style={styles.metadataValue}>
                                                    {new Date().toLocaleDateString()} at {new Date().toLocaleTimeString()}
                                                </span>
                                            </div>
                                            <div style={styles.metadataItem}>
                                                <span style={styles.metadataLabel}>Records Processed</span>
                                                <span style={styles.metadataValue}>{employeeData.length} employees</span>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Uploaded Data Summary */}
                            {employeeData.length > 0 && (
                                <div style={styles.summaryCard}>
                                    <div style={styles.summaryHeader}>
                                        <h3 style={styles.summaryTitle}>Upload Summary</h3>
                                        <div style={styles.summaryStats}>
                                            <div style={styles.summaryStat}>
                                                <FiUsers style={styles.summaryIcon} />
                                                <span style={styles.summaryNumber}>{employeeData.length}</span>
                                                <span style={styles.summaryLabel}>Total Employees</span>
                                            </div>
                                            <div style={styles.summaryStat}>
                                                <FiMapPin style={styles.summaryIcon} />
                                                <span style={styles.summaryNumber}>
                                                    {new Set(employeeData.map(emp => emp.location_city)).size}
                                                </span>
                                                <span style={styles.summaryLabel}>Locations</span>
                                            </div>
                                            <div style={styles.summaryStat}>
                                                <FiBriefcase style={styles.summaryIcon} />
                                                <span style={styles.summaryNumber}>
                                                    {new Set(employeeData.map(emp => emp.department_name)).size}
                                                </span>
                                                <span style={styles.summaryLabel}>Departments</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Uploaded Data Table */}
                            {employeeData.length > 0 && (
                                <div style={styles.tableContainer}>
                                    <div style={styles.tableHeader}>
                                        <h3 style={styles.tableTitle}>Employee Records</h3>
                                        <div style={styles.tableActions}>
                                            <button style={styles.exportButton}>
                                                <FiDownload style={{ marginRight: 6 }} />
                                                Export CSV
                                            </button>
                                            <div style={styles.searchBox}>
                                                <FiSearch style={styles.searchIcon} />
                                                <input
                                                    type="text"
                                                    placeholder="Search employees..."
                                                    style={styles.searchInput}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div style={styles.tableWrapper}>
                                        <table style={styles.table}>
                                            <thead style={styles.tableHead}>
                                                <tr>
                                                    <th style={styles.tableHeader}>Employee ID</th>
                                                    <th style={styles.tableHeader}>Full Name</th>
                                                    <th style={styles.tableHeader}>Department</th>
                                                    <th style={styles.tableHeader}>Company</th>
                                                    <th style={styles.tableHeader}>Location</th>
                                                    <th style={styles.tableHeader}>Years of Service</th>
                                                    <th style={styles.tableHeader}>Status</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {employeeData.map((emp, idx) => (
                                                    <tr key={idx} style={styles.tableRow}>
                                                        <td style={styles.tableCell}>
                                                            <div style={styles.employeeId}>
                                                                <FiUser style={{ marginRight: 6 }} />
                                                                {emp.employee_id}
                                                            </div>
                                                        </td>
                                                        <td style={styles.tableCell}>
                                                            <div style={styles.employeeName}>
                                                                <span style={styles.name}>{emp.full_name}</span>
                                                                <span style={styles.email}>{emp.employee_email}</span>
                                                            </div>
                                                        </td>
                                                        <td style={styles.tableCell}>
                                                            <span style={styles.department}>{emp.department_name}</span>
                                                        </td>
                                                        <td style={styles.tableCell}>
                                                            <span style={styles.company}>{emp.company_name}</span>
                                                        </td>
                                                        <td style={styles.tableCell}>
                                                            <div style={styles.location}>
                                                                <FiMapPin size={12} style={{ marginRight: 4 }} />
                                                                {emp.location_city}
                                                            </div>
                                                        </td>
                                                        <td style={styles.tableCell}>
                                                            <div style={styles.serviceBadge}>
                                                                {emp.years_of_service} years
                                                            </div>
                                                        </td>
                                                        <td style={styles.tableCell}>
                                                            <div style={emp.current_status === 'Active' ? styles.statusActive : styles.statusInactive}>
                                                                {emp.current_status || 'Active'}
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>

                                    {/* Table Footer */}
                                    <div style={styles.tableFooter}>
                                        <span style={styles.footerText}>
                                            Showing {employeeData.length} of {employeeData.length} records
                                        </span>
                                        <div style={styles.pagination}>
                                            <button style={styles.paginationButton} disabled>
                                                <FiChevronLeft />
                                            </button>
                                            <span style={styles.paginationInfo}>Page 1 of 1</span>
                                            <button style={styles.paginationButton} disabled>
                                                <FiChevronRight />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}


read this code and how to slov ths isseu 

const fmt = (iso) => {
    if (!iso) return "";
    try {
        const d = new Date(iso);
        return d.toLocaleDateString() + " " + d.toLocaleTimeString();
    } catch {
        return String(iso);
    }
};

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



    const [employeeData, setEmployeeData] = useState([]);

    const [monthlyFile, setMonthlyFile] = useState(null);
    const [uploadStatus, setUploadStatus] = useState("");



    const handleMonthlyFileChange = (e) => {
        const selected = e.target.files?.[0];
        console.log("Selected:", selected);
        setMonthlyFile(selected);
    };

    const uploadMonthlySheet = async () => {
        if (!monthlyFile) return alert("Please select a file first.");

        const formData = new FormData();
        formData.append("file", monthlyFile);

        try {
            setUploadStatus("Uploading...");
            const res = await fetch("http://localhost:8000/monthly_sheet/upload_monthly", {
                method: "POST",
                body: formData,
            });
            const result = await res.json();
            setUploadStatus(result.message || "Upload success!");
        } catch (err) {
            console.error(err);
            setUploadStatus("Upload failed.");
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
