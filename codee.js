
ERROR in [eslint]
src\pages\EmployeeTravelDashboard.jsx
  Line 352:32:  'themeToggleBtn' is not defined  no-undef

Search for the keywords to learn more about each error.

webpack compiled with 1 error and 1 warning

we got this error 
{/* HEADER */}
            <header style={header}>
                <div style={headerContent}>
                    <div style={headerIcon}>
                        <FiGlobe size={32} />
                    </div>
                    <div style={{ flex: 1 }}>
                        <h1 style={title}>Employee Travel Analytics Dashboard</h1>
                        <p style={subtitle}>Comprehensive travel management and monitoring system</p>
                    </div>
                    {/* 🆕 Theme Toggle Button */}
                    <button
                        onClick={toggleTheme}
                        style={themeToggleBtn}
                        title={isDarkTheme ? "Switch to light mode" : "Switch to dark mode"}
                    >
                        {isDarkTheme ? <FiSun size={20} /> : <FiMoon size={20} />}
                    </button>
                </div>
