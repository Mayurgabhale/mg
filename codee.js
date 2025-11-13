{showLogin && (
    <div style={styles.loginOverlay}>
        <div style={styles.loginCard}>
            {/* Background Decoration */}
            <div style={styles.backgroundDecoration}>
                <div style={styles.decorationCircle1}></div>
                <div style={styles.decorationCircle2}></div>
            </div>
            
            {/* Header Section */}
            <div style={styles.loginHeader}>
                <div style={styles.logoContainer}>
                    <div style={styles.logoIcon}>
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 2C13.3132 2 14.6136 2.25866 15.8268 2.7612C17.0401 3.26375 18.1425 4.00035 19.0711 4.92893C19.9997 5.85752 20.7362 6.95991 21.2388 8.17317C21.7413 9.38642 22 10.6868 22 12C22 14.6522 20.9464 17.1957 19.0711 19.0711C17.1957 20.9464 14.6522 22 12 22C9.34784 22 6.8043 20.9464 4.92893 19.0711C3.05357 17.1957 2 14.6522 2 12C2 9.34784 3.05357 6.8043 4.92893 4.92893C6.8043 3.05357 9.34784 2 12 2Z" 
                                stroke="url(#gradient)" strokeWidth="2"/>
                            <path d="M8 12H16M16 12L13 9M16 12L13 15" stroke="url(#gradient)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <defs>
                                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                    <stop offset="0%" stopColor="#667eea" />
                                    <stop offset="100%" stopColor="#764ba2" />
                                </linearGradient>
                            </defs>
                        </svg>
                    </div>
                    <div style={styles.headerText}>
                        <h2 style={styles.loginTitle}>Welcome Back</h2>
                        <p style={styles.loginSubtitle}>Sign in to your account</p>
                    </div>
                </div>
            </div>

            {/* Login Form */}
            <form onSubmit={(e) => e.preventDefault()} style={styles.loginForm}>
                {/* Username Field */}
                <div style={styles.inputGroup}>
                    <div style={styles.inputIcon}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M20 21V19C20 16.7909 18.2091 15 16 15H8C5.79086 15 4 16.7909 4 19V21" 
                                stroke="#667eea" strokeWidth="2" strokeLinecap="round"/>
                            <circle cx="12" cy="7" r="4" stroke="#667eea" strokeWidth="2"/>
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
                            <rect x="3" y="11" width="18" height="11" rx="2" stroke="#667eea" strokeWidth="2"/>
                            <path d="M7 11V7C7 4.23858 9.23858 2 12 2C14.7614 2 17 4.23858 17 7V11" 
                                stroke="#667eea" strokeWidth="2"/>
                        </svg>
                    </div>
                    <input
                        type="password"
                        placeholder="Enter your password"
                        style={styles.input}
                        id="password"
                    />
                </div>

                {/* Remember Me & Forgot Password */}
                <div style={styles.formOptions}>
                    <label style={styles.rememberMe}>
                        <input type="checkbox" style={styles.checkbox}/>
                        <span>Remember me</span>
                    </label>
                    <a href="#" style={styles.forgotPassword}>Forgot password?</a>
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
                        <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" 
                            strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                </button>

                {/* Divider */}
                <div style={styles.divider}>
                    <span style={styles.dividerText}>or</span>
                </div>

                {/* Social Login */}
                <div style={styles.socialLogin}>
                    <button style={styles.socialButton}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M22 12C22 10.6868 21.7413 9.38642 21.2388 8.17317C20.7362 6.95991 19.9997 5.85752 19.0711 4.92893C18.1425 4.00035 17.0401 3.26375 15.8268 2.7612C14.6136 2.25866 13.3132 2 12 2C9.34784 2 6.8043 3.05357 4.92893 4.92893C3.05357 6.8043 2 9.34784 2 12C2 14.6522 3.05357 17.1957 4.92893 19.0711C6.8043 20.9464 9.34784 22 12 22C14.6522 22 17.1957 20.9464 19.0711 19.0711C20.9464 17.1957 22 14.6522 22 12Z" 
                                stroke="currentColor" strokeWidth="2"/>
                            <path d="M12 16C14.2091 16 16 14.2091 16 12C16 9.79086 14.2091 8 12 8C9.79086 8 8 9.79086 8 12C8 14.2091 9.79086 16 12 16Z" 
                                stroke="currentColor" strokeWidth="2"/>
                        </svg>
                        Continue with Google
                    </button>
                </div>
            </form>

            {/* Footer */}
            <div style={styles.loginFooter}>
                <p style={styles.footerText}>
                    Don't have an account? <a href="#" style={styles.signupLink}>Sign up</a>
                </p>
            </div>

            {/* Close Button */}
            <button
                onClick={() => setShowLogin(false)}
                style={styles.closeButton}
            >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
            </button>
        </div>
    </div>
)}





const styles = {
    loginOverlay: {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
        padding: '20px',
    },
    loginCard: {
        backgroundColor: 'white',
        borderRadius: '20px',
        padding: '40px',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        width: '100%',
        maxWidth: '440px',
        position: 'relative',
        overflow: 'hidden',
    },
    backgroundDecoration: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        pointerEvents: 'none',
        overflow: 'hidden',
    },
    decorationCircle1: {
        position: 'absolute',
        top: '-50px',
        right: '-50px',
        width: '150px',
        height: '150px',
        borderRadius: '50%',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        opacity: 0.1,
    },
    decorationCircle2: {
        position: 'absolute',
        bottom: '-30px',
        left: '-30px',
        width: '100px',
        height: '100px',
        borderRadius: '50%',
        background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
        opacity: 0.1,
    },
    loginHeader: {
        textAlign: 'center',
        marginBottom: '32px',
    },
    logoContainer: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '16px',
    },
    logoIcon: {
        width: '64px',
        height: '64px',
        borderRadius: '16px',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        boxShadow: '0 10px 25px -5px rgba(102, 126, 234, 0.4)',
    },
    headerText: {
        textAlign: 'center',
    },
    loginTitle: {
        fontSize: '28px',
        fontWeight: '700',
        color: '#1a202c',
        margin: '0 0 8px 0',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
    },
    loginSubtitle: {
        fontSize: '14px',
        color: '#718096',
        margin: 0,
        fontWeight: '500',
    },
    loginForm: {
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
    },
    inputGroup: {
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
    },
    inputIcon: {
        position: 'absolute',
        left: '16px',
        zIndex: 1,
        color: '#667eea',
    },
    input: {
        width: '100%',
        padding: '16px 16px 16px 48px',
        border: '2px solid #e2e8f0',
        borderRadius: '12px',
        fontSize: '14px',
        fontWeight: '500',
        color: '#2d3748',
        backgroundColor: '#fafafa',
        transition: 'all 0.3s ease',
        outline: 'none',
    },
    inputFocus: {
        borderColor: '#667eea',
        backgroundColor: 'white',
        boxShadow: '0 0 0 3px rgba(102, 126, 234, 0.1)',
    },
    formOptions: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        fontSize: '14px',
    },
    rememberMe: {
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        color: '#4a5568',
        cursor: 'pointer',
    },
    checkbox: {
        width: '16px',
        height: '16px',
        accentColor: '#667eea',
    },
    forgotPassword: {
        color: '#667eea',
        textDecoration: 'none',
        fontWeight: '600',
        transition: 'color 0.2s ease',
    },
    loginButton: {
        padding: '16px 24px',
        backgroundColor: '#667eea',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        border: 'none',
        borderRadius: '12px',
        fontSize: '16px',
        fontWeight: '600',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        transition: 'all 0.3s ease',
        boxShadow: '0 10px 25px -5px rgba(102, 126, 234, 0.4)',
    },
    buttonIcon: {
        transition: 'transform 0.2s ease',
    },
    divider: {
        position: 'relative',
        textAlign: 'center',
        margin: '20px 0',
    },
    dividerText: {
        backgroundColor: 'white',
        padding: '0 16px',
        color: '#a0aec0',
        fontSize: '14px',
        fontWeight: '500',
    },
    socialLogin: {
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
    },
    socialButton: {
        padding: '12px 16px',
        border: '2px solid #e2e8f0',
        backgroundColor: 'white',
        borderRadius: '12px',
        fontSize: '14px',
        fontWeight: '600',
        color: '#4a5568',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        transition: 'all 0.2s ease',
    },
    loginFooter: {
        textAlign: 'center',
        marginTop: '24px',
        paddingTop: '24px',
        borderTop: '1px solid #e2e8f0',
    },
    footerText: {
        fontSize: '14px',
        color: '#718096',
        margin: 0,
    },
    signupLink: {
        color: '#667eea',
        textDecoration: 'none',
        fontWeight: '600',
        transition: 'color 0.2s ease',
    },
    closeButton: {
        position: 'absolute',
        top: '20px',
        right: '20px',
        background: 'none',
        border: 'none',
        color: '#a0aec0',
        cursor: 'pointer',
        padding: '8px',
        borderRadius: '8px',
        transition: 'all 0.2s ease',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
};

// Add hover effects
const addHoverEffects = `
    .login-button:hover {
        transform: translateY(-2px);
        box-shadow: 0 15px 30px -5px rgba(102, 126, 234, 0.5);
    }
    
    .login-button:hover .button-icon {
        transform: translateX(3px);
    }
    
    .input:hover {
        border-color: #cbd5e0;
        background-color: white;
    }
    
    .input:focus {
        border-color: #667eea;
        background-color: white;
        box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
    }
    
    .social-button:hover {
        border-color: #667eea;
        color: #667eea;
    }
    
    .forgot-password:hover,
    .signup-link:hover {
        color: #764ba2;
    }
    
    .close-button:hover {
        color: #4a5568;
        background-color: #f7fafc;
    }
`;