{/* HEADER */}
<header style={styles.header}>
    <div style={styles.headerContent}>
        <div style={styles.headerIcon}>
            <FiGlobe size={32} />
        </div>
        <div style={{ flex: 1 }}>
            <h1 style={styles.title}>Employee Travel Analytics Dashboard</h1>
            <p style={styles.subtitle}>Comprehensive travel management and monitoring system</p>
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