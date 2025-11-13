can you do this more atractive wiht usng image i wnat his page UI mor and more profesal desin ok 
{showLogin && (
                        <div style={styles.loginOverlay}>
                            <div style={styles.loginCard}>
                                {/* Header Section */}
                                <div style={styles.loginHeader}>
                                    <div style={styles.logoContainer}>
                                        <div style={styles.logoIcon}>
                                           
                                        </div>
                                        <div>
                                            <h2 style={styles.loginTitle}>Login</h2>
                                            <p style={styles.loginSubtitle}>Secure Access </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Login Form */}
                                <form onSubmit={(e) => e.preventDefault()} style={styles.loginForm}>
                                    {/* Username Field */}
                                    <div style={styles.inputGroup}>
                                        <div style={styles.inputIcon}>
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M20 21V19C20 16.7909 18.2091 15 16 15H8C5.79086 15 4 16.7909 4 19V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                                <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="2" />
                                            </svg>
                                        </div>
                                        <input
                                            type="text"
                                            placeholder="Enter your username"
                                            style={styles.input}
                                            id="username"
                                        />
                                    </div>

                                    {/* Password Field */}
                                    <div style={styles.inputGroup}>
                                        <div style={styles.inputIcon}>
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <rect x="3" y="11" width="18" height="11" rx="2" stroke="currentColor" strokeWidth="2" />
                                                <path d="M7 11V7C7 4.23858 9.23858 2 12 2C14.7614 2 17 4.23858 17 7V11" stroke="currentColor" strokeWidth="2" />
                                            </svg>
                                        </div>
                                        <input
                                            type="password"
                                            placeholder="Enter your password"
                                            style={styles.input}
                                            id="password"
                                        />
                                    </div>

                                    {/* Login Button */}
                                    <button
                                        onClick={() => {
                                            const username = document.getElementById('username').value;
                                            const password = document.getElementById('password').value;

                                            if (username === 'test' && password === 'Test@098') {
                                                setIsAuthenticated(true);
                                                setShowLogin(false);
                                                setShowUploadFileSection(true);
                                            } else {
                                                alert('Invalid credentials. Please try again!');
                                            }
                                        }}
                                        style={styles.loginButton}
                                    >
                                        <span>Sign In</span>
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={styles.buttonIcon}>
                                            <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    </button>
                                </form>

                               

                                {/* Cancel Button */}
                                <button
                                    onClick={() => setShowLogin(false)}
                                    style={styles.cancelButton}
                                >
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginRight: '8px' }}>
                                        <path d="M6 18L18 6M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                    </svg>
                                    Cancel
                                </button>
                            </div>
                        </div>
                    )}
