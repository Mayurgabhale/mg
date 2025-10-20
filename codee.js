// Database configuration
const dbConfig = {
  user: DB_USER,
  password: DB_PASSWORD,
  server: DB_SERVER,
  port: DB_PORT,
  database: DB_DATABASE,
  options: {
    encrypt: true,                // Enable encryption
    trustServerCertificate: true, // Allow self-signed certificates
    enableArithAbort: true,
    trustedConnection: false,
    useUTC: true,
    // Add TLS-specific options
    cryptoCredentialsDetails: {
      minVersion: 'TLSv1.2'
    }
  },
  pool: {
    max: 20,
    min: 1,
    idleTimeoutMillis: 30000,
    acquireTimeoutMillis: 60000,
  },
  requestTimeout: 1800000,
  connectionTimeout: 60000,
};