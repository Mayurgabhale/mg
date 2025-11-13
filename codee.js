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