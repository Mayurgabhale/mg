import React, { useState } from 'react';
import { FiUpload, FiUser, FiLock, FiCamera, FiGlobe, FiMap } from 'react-icons/fi';

const TravelLoginModal = ({ isOpen, onClose, onLoginSuccess }) => {
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState('');

  // Demo credentials - replace with your actual authentication
  const validCredentials = {
    username: 'admin',
    password: 'travel2024'
  };

  const handleLogin = (e) => {
    e.preventDefault();
    setError('');

    if (credentials.username === validCredentials.username && 
        credentials.password === validCredentials.password) {
      onLoginSuccess();
      onClose();
    } else {
      setError('Invalid username or password');
    }
  };

  const handleChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value
    });
  };

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000
    }}>
      <div style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: '40px',
        borderRadius: '20px',
        width: '90%',
        maxWidth: '400px',
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Background decorative elements */}
        <div style={{
          position: 'absolute',
          top: -50,
          right: -50,
          width: 120,
          height: 120,
          borderRadius: '50%',
          background: 'rgba(255, 255, 255, 0.1)'
        }}></div>
        <div style={{
          position: 'absolute',
          bottom: -30,
          left: -30,
          width: 100,
          height: 100,
          borderRadius: '50%',
          background: 'rgba(255, 255, 255, 0.1)'
        }}></div>

        {/* Close button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '15px',
            right: '15px',
            background: 'rgba(255, 255, 255, 0.2)',
            border: 'none',
            borderRadius: '50%',
            width: '30px',
            height: '30px',
            color: 'white',
            cursor: 'pointer',
            fontSize: '16px'
          }}
        >
          ×
        </button>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '30px', position: 'relative', zIndex: 1 }}>
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: '15px'
          }}>
            <FiGlobe style={{ fontSize: '32px', color: 'white', marginRight: '10px' }} />
            <FiMap style={{ fontSize: '28px', color: 'white' }} />
          </div>
          <h2 style={{ 
            color: 'white', 
            margin: '0 0 8px 0',
            fontSize: '24px',
            fontWeight: '600'
          }}>
            Travel Explorer
          </h2>
          <p style={{ 
            color: 'rgba(255, 255, 255, 0.8)', 
            margin: 0,
            fontSize: '14px'
          }}>
            Access your travel upload portal
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin} style={{ position: 'relative', zIndex: 1 }}>
          {/* Username Field */}
          <div style={{ marginBottom: '20px', position: 'relative' }}>
            <FiUser style={{
              position: 'absolute',
              left: '15px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'rgba(255, 255, 255, 0.7)',
              fontSize: '18px'
            }} />
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={credentials.username}
              onChange={handleChange}
              style={{
                width: '100%',
                padding: '12px 12px 12px 45px',
                borderRadius: '25px',
                border: '2px solid rgba(255, 255, 255, 0.3)',
                background: 'rgba(255, 255, 255, 0.1)',
                color: 'white',
                fontSize: '16px',
                outline: 'none',
                backdropFilter: 'blur(10px)'
              }}
              placeholderTextColor="rgba(255, 255, 255, 0.6)"
            />
          </div>

          {/* Password Field */}
          <div style={{ marginBottom: '25px', position: 'relative' }}>
            <FiLock style={{
              position: 'absolute',
              left: '15px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'rgba(255, 255, 255, 0.7)',
              fontSize: '18px'
            }} />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={credentials.password}
              onChange={handleChange}
              style={{
                width: '100%',
                padding: '12px 12px 12px 45px',
                borderRadius: '25px',
                border: '2px solid rgba(255, 255, 255, 0.3)',
                background: 'rgba(255, 255, 255, 0.1)',
                color: 'white',
                fontSize: '16px',
                outline: 'none',
                backdropFilter: 'blur(10px)'
              }}
              placeholderTextColor="rgba(255, 255, 255, 0.6)"
            />
          </div>

          {/* Error Message */}
          {error && (
            <div style={{
              color: '#ff6b6b',
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              padding: '10px 15px',
              borderRadius: '10px',
              marginBottom: '15px',
              fontSize: '14px',
              textAlign: 'center',
              fontWeight: '500'
            }}>
              {error}
            </div>
          )}

          {/* Login Button */}
          <button
            type="submit"
            style={{
              width: '100%',
              padding: '14px',
              borderRadius: '25px',
              border: 'none',
              background: 'linear-gradient(45deg, #FFD700, #FFA500)',
              color: '#333',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: '0 4px 15px rgba(255, 215, 0, 0.3)'
            }}
            onMouseOver={(e) => {
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 6px 20px rgba(255, 215, 0, 0.4)';
            }}
            onMouseOut={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 4px 15px rgba(255, 215, 0, 0.3)';
            }}
          >
            Explore & Upload
          </button>
        </form>

        {/* Demo credentials hint */}
        <div style={{
          marginTop: '20px',
          textAlign: 'center',
          fontSize: '12px',
          color: 'rgba(255, 255, 255, 0.6)',
          position: 'relative',
          zIndex: 1
        }}>
          Demo: admin / travel2024
        </div>
      </div>
    </div>
  );
};

// Your updated Upload Button component
const UploadButtonWithLogin = () => {
  const [showUploadFileSection, setShowUploadFileSection] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);

  const handleUploadClick = () => {
    setShowLoginModal(true);
  };

  const handleLoginSuccess = () => {
    setShowUploadFileSection(true);
  };

  return (
    <>
      {/* Upload Button in Sidebar */}
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <button
          onClick={handleUploadClick}
          style={{
            backgroundColor: '#3182ce',
            color: 'white',
            padding: '12px 24px',
            border: 'none',
            borderRadius: '8px',
            fontSize: '16px',
            cursor: 'pointer',
            width: '100%',
            transition: 'all 0.3s ease'
          }}
          onMouseOver={(e) => {
            e.target.style.backgroundColor = '#2c5aa0';
            e.target.style.transform = 'translateY(-2px)';
          }}
          onMouseOut={(e) => {
            e.target.style.backgroundColor = '#3182ce';
            e.target.style.transform = 'translateY(0)';
          }}
        >
          <FiUpload style={{ marginRight: 8 }} />
          Upload Button
        </button>
      </div>

      {/* Login Modal */}
      <TravelLoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onLoginSuccess={handleLoginSuccess}
      />

      {/* Upload File Section (shown after successful login) */}
      {showUploadFileSection && (
        <div style={{
          padding: '20px',
          backgroundColor: '#f7fafc',
          borderRadius: '8px',
          margin: '20px',
          border: '2px dashed #cbd5e0'
        }}>
          <h3 style={{ color: '#2d3748', marginBottom: '15px' }}>
            <FiCamera style={{ marginRight: '8px' }} />
            Upload Your Travel Files
          </h3>
          <p style={{ color: '#4a5568', marginBottom: '15px' }}>
            Welcome! You can now upload your travel photos and documents.
          </p>
          {/* Add your upload functionality here */}
          <button
            onClick={() => setShowUploadFileSection(false)}
            style={{
              backgroundColor: '#e53e3e',
              color: 'white',
              padding: '8px 16px',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer'
            }}
          >
            Close Upload Section
          </button>
        </div>
      )}
    </>
  );
};

export default UploadButtonWithLogin;