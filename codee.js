const styles = {
  loginOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(15, 23, 42, 0.8)',
    backdropFilter: 'blur(8px)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
    padding: '20px'
  },
  loginCard: {
    background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
    padding: '40px',
    borderRadius: '20px',
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    width: '100%',
    maxWidth: '420px',
    border: '1px solid rgba(255, 255, 255, 0.2)'
  },
  loginHeader: {
    textAlign: 'center',
    marginBottom: '32px'
  },
  logoContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '12px',
    marginBottom: '16px'
  },
  logoIcon: {
    background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
    padding: '12px',
    borderRadius: '12px',
    color: 'white'
  },
  loginTitle: {
    fontSize: '24px',
    fontWeight: '700',
    color: '#1e293b',
    margin: '0 0 4px 0'
  },
  loginSubtitle: {
    fontSize: '14px',
    color: '#64748b',
    margin: 0
  },
  loginForm: {
    marginBottom: '24px'
  },
  inputGroup: {
    position: 'relative',
    marginBottom: '20px'
  },
  inputIcon: {
    position: 'absolute',
    left: '16px',
    top: '50%',
    transform: 'translateY(-50%)',
    color: '#64748b',
    zIndex: 2
  },
  input: {
    width: '100%',
    padding: '14px 16px 14px 48px',
    borderRadius: '12px',
    border: '2px solid #e2e8f0',
    backgroundColor: 'white',
    fontSize: '16px',
    outline: 'none',
    transition: 'all 0.2s ease',
    boxSizing: 'border-box',
    ':focus': {
      borderColor: '#3b82f6',
      boxShadow: '0 0 0 3px rgba(59, 130, 246, 0.1)'
    }
  },
  loginButton: {
    width: '100%',
    padding: '14px 20px',
    background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
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
    boxShadow: '0 4px 15px rgba(59, 130, 246, 0.3)',
    ':hover': {
      transform: 'translateY(-2px)',
      boxShadow: '0 8px 25px rgba(59, 130, 246, 0.4)'
    }
  },
  buttonIcon: {
    transition: 'transform 0.2s ease'
  },
  demoSection: {
    backgroundColor: '#f1f5f9',
    padding: '16px',
    borderRadius: '12px',
    marginBottom: '20px',
    border: '1px solid #e2e8f0'
  },
  demoHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '14px',
    fontWeight: '600',
    color: '#475569',
    marginBottom: '8px'
  },
  demoCredentials: {
    fontSize: '13px',
    color: '#64748b'
  },
  credentialItem: {
    marginBottom: '4px'
  },
  cancelButton: {
    width: '100%',
    padding: '12px 20px',
    backgroundColor: 'transparent',
    color: '#64748b',
    border: '2px solid #e2e8f0',
    borderRadius: '12px',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s ease',
    ':hover': {
      backgroundColor: '#f8fafc',
      borderColor: '#cbd5e1'
    }
  }
};