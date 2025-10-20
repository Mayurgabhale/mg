// C:\Users\W0024618\Desktop\laca-occupancy-backend\src\config\db.js // laca DB connection (mirrors Pune implementation) require('dotenv').config(); const sql = require('mssql');

// Pull and trim environment variables const DB_USER = (process.env.DB_USER || '').trim(); const DB_PASSWORD = (process.env.DB_PASSWORD || '').trim(); const DB_SERVER = (process.env.DB_SERVER || '').trim(); const DB_DATABASE = (process.env.DB_DATABASE || '').trim(); const DB_PORT = parseInt((process.env.DB_PORT || '').trim(), 10) || 1433;

const dbConfig = { user: DB_USER, password: DB_PASSWORD, server: DB_SERVER, port: DB_PORT, database: DB_DATABASE, options: { encrypt: true, // for Azure / secure connections trustServerCertificate: true, enableArithAbort: true, }, pool: { max: 20, // tuneable (same as Pune) min: 1, idleTimeoutMillis: 30000, acquireTimeoutMillis: 60000, }, requestTimeout: 1800000, // 30 minutes connectionTimeout: 60000, // 1 minute };

let poolPromise = null;

async function getPool(attempts = 5) { if (poolPromise) return poolPromise;

poolPromise = (async () => { try { const pool = await sql.connect(dbConfig); console.log('✅ MSSQL pool connected (Laca)');

pool.on('error', (err) => {
    console.error('❌ MSSQL pool error (Laca):', err);
    poolPromise = null; // reset to allow reconnect
  });

  return pool;
} catch (err) {
  console.error('❌ MSSQL pool connection failed (Laca):', err);
  poolPromise = null;
  if (attempts > 0) {
    console.log(`⏳ Retrying MSSQL connect (Laca) (${attempts} left)…`);
    await new Promise((res) => setTimeout(res, 3000));
    return getPool(attempts - 1);
  }
  throw err;
}

})();

// Global handler for MSSQL pool-level errors sql.on('error', (err) => { console.error('❌ MSSQL global error (Laca):', err); if (err && err.name === 'TimeoutError') poolPromise = null; });

process.on('unhandledRejection', (reason) => { console.error('❌ Unhandled Rejection at (Laca):', reason); });

process.on('uncaughtException', (err) => { console.error('❌ Uncaught Exception (will exit) (Laca):', err); // optional: process.exit(1); });

return poolPromise; }

module.exports = { sql, getPool };

