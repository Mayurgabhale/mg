const [showLogin, setShowLogin] = useState(false);
const [isAuthenticated, setIsAuthenticated] = useState(false);




...

<button
  onClick={() => {
    if (isAuthenticated) {
      setShowUploadFileSection(true);
    } else {
      setShowLogin(true);
    }
  }}
  style={{
    backgroundColor: '#3182ce',
    color: 'white',
    padding: '12px 24px',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    cursor: 'pointer',
    width: '100%'
  }}
>
  <FiUpload style={{ marginRight: 8 }} />
  Upload Button
</button>



...

{showLogin && (
  <div style={styles.loginOverlay}>
    <div style={styles.loginCard}>
      <h2 style={styles.loginTitle}>🌍 Travel Portal Login</h2>
      <p style={styles.loginSubtitle}>Access secure upload section</p>

      <input
        type="text"
        placeholder="Username"
        style={styles.input}
        id="username"
      />
      <input
        type="password"
        placeholder="Password"
        style={styles.input}
        id="password"
      />

      <button
        onClick={() => {
          const username = document.getElementById('username').value;
          const password = document.getElementById('password').value;

          if (username === 'admin' && password === 'travel123') {
            setIsAuthenticated(true);
            setShowLogin(false);
            setShowUploadFileSection(true);
          } else {
            alert('Invalid credentials. Try again!');
          }
        }}
        style={styles.loginButton}
      >
        Login
      </button>

      <button
        onClick={() => setShowLogin(false)}
        style={styles.cancelButton}
      >
        Cancel
      </button>
    </div>
  </div>
)}





...
const styles = {
  loginOverlay: {
    position: "fixed",
    top: 0, left: 0, right: 0, bottom: 0,
    background: "rgba(0,0,0,0.6)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 999,
  },
  loginCard: {
    background: "linear-gradient(135deg, #3b82f6, #06b6d4)",
    padding: "40px",
    borderRadius: "20px",
    boxShadow: "0 8px 20px rgba(0,0,0,0.3)",
    width: "350px",
    textAlign: "center",
    color: "white",
    animation: "fadeIn 0.4s ease-in-out",
  },
  loginTitle: {
    fontSize: "24px",
    marginBottom: "8px",
    fontWeight: "700",
  },
  loginSubtitle: {
    fontSize: "14px",
    marginBottom: "24px",
    opacity: 0.9,
  },
  input: {
    width: "100%",
    padding: "10px 14px",
    marginBottom: "16px",
    borderRadius: "8px",
    border: "none",
    outline: "none",
    fontSize: "14px",
  },
  loginButton: {
    width: "100%",
    background: "#fff",
    color: "#2563eb",
    fontWeight: "600",
    border: "none",
    borderRadius: "8px",
    padding: "10px",
    cursor: "pointer",
    marginBottom: "10px",
    transition: "0.3s",
  },
  cancelButton: {
    width: "100%",
    background: "transparent",
    color: "#fff",
    border: "1px solid #fff",
    borderRadius: "8px",
    padding: "10px",
    cursor: "pointer",
  },
};