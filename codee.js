// config/siteConfig.js
const denverConfig = {
  user:     'GSOC_Test',
  password: 'Westernccure@2025',
  server:   'SRVWUDEN0891V',
  database: 'ACVSUJournal_00010028',
  options: { 
    encrypt: true,
    trustServerCertificate: true,
    enableArithAbort: true,
    connectTimeout: 30000,      // 30s connection timeout
    requestTimeout: 120000,     // 2min request timeout
    cancelTimeout: 30000        // 30s cancel timeout
  },
  pool: {
    max: 15,                    // Increased max connections
    min: 2,                     // Keep some connections ready
    idleTimeoutMillis: 60000,   // 1min idle timeout
    acquireTimeoutMillis: 120000, // 2min acquire timeout
    createTimeoutMillis: 30000, // 30s create timeout
    destroyTimeoutMillis: 30000, // 30s destroy timeout
    reapIntervalMillis: 1000,   // Check every second
    createRetryIntervalMillis: 200 // Retry quickly
  }
};