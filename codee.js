require('dotenv').config();
const sql = require('mssql');

const DB_USER     = (process.env.DB_USER || '').trim();
const DB_PASSWORD = (process.env.DB_PASSWORD || '').trim();
const DB_SERVER   = (process.env.DB_SERVER || '').trim();
const DB_DATABASE = (process.env.DB_DATABASE || '').trim();
const DB_PORT     = parseInt(process.env.DB_PORT || '1433', 10);

const dbConfig = {
  user: DB_USER,
  password: DB_PASSWORD,
  server: DB_SERVER,
  database: DB_DATABASE,
  port: DB_PORT,
  options: {
    encrypt: false, // set true if using Azure SQL
    trustServerCertificate: true,
    enableArithAbort: true
  },
  pool: {
    max: 20,
    min: 2,
    idleTimeoutMillis: 60000,
    acquireTimeoutMillis: 60000
  },
  requestTimeout: 300000,    // 5 minutes for long queries
  connectionTimeout: 60000   // 1 minute connection timeout
};

let poolPromise = null;
let reconnecting = false;

// Function to initialize connection
async function connectToDatabase() {
  try {
    const pool = await sql.connect(dbConfig);
    console.log('✅ MSSQL connected');
    return pool;
  } catch (err) {
    console.error('❌ MSSQL connection failed:', err.message);
    throw err;
  }
}

// Function to get pool — will reconnect automatically if needed
async function getPool() {
  if (poolPromise) {
    try {
      const pool = await poolPromise;
      if (pool.connected) return pool;
    } catch {
      poolPromise = null;
    }
  }

  if (!reconnecting) {
    reconnecting = true;
    console.log('🔁 Reconnecting MSSQL...');
    poolPromise = connectToDatabase()
      .finally(() => { reconnecting = false; });
  }

  return poolPromise;
}

// Global error listener — if connection is lost, reset pool
sql.on('error', err => {
  console.error('⚠️ SQL global error:', err.message);
  poolPromise = null;
});

// Optional keep-alive ping (every 2 minutes)
setInterval(async () => {
  try {
    const pool = await getPool();
    await pool.request().query('SELECT 1 AS alive');
    // console.log('✅ DB alive');
  } catch (err) {
    console.error('💀 Keep-alive failed:', err.message);
    poolPromise = null; // triggers reconnect next time
  }
}, 120000); // every 2 minutes

module.exports = { sql, getPool };