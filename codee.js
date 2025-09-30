const { sql } = require('./db'); // reuse your shared sql module
const sqlModule = require('mssql'); 

// Denver pool configuration
const denverConfig = {
  user:     'GSOC_Test',
  password: 'Westernccure@2025',
  server:   'SRVWUDEN0891V',
  database: 'ACVSUJournal_00010028',
  options: {
    encrypt: true,
    trustServerCertificate: true
  },
  pool: {
    max: 6,
    min: 0,
    idleTimeoutMillis: 30_000,
    acquireTimeoutMillis: 30_000
  },
  connectionTimeout: 30_000,
  requestTimeout: 15_000
};

// -----------------------
// Denver pool promise
// -----------------------
let denverPoolPromise = null;

function getDenverPool() {
  if (denverPoolPromise) return denverPoolPromise;

  denverPoolPromise = sqlModule.connect(denverConfig)
    .then(pool => {
      console.log('✅ Denver MSSQL connected');
      return pool;
    })
    .catch(err => {
      console.error('❌ Denver MSSQL connection failed:', err);
      denverPoolPromise = null; // reset so next attempt will retry
      throw err;
    });

  return denverPoolPromise;
}

// Ping Denver every 5 minutes to keep pool alive
setInterval(async () => {
  try {
    const pool = await getDenverPool();
    if (pool) await pool.request().query('SELECT 1');
  } catch (err) {
    console.warn('⚠️ Denver keep-alive failed, resetting poolPromise:', err);
    denverPoolPromise = null;
  }
}, 5 * 60 * 1000);

// -----------------------
// Export
// -----------------------
module.exports = {
  denver: {
    poolPromise: getDenverPool(),
    sql: sqlModule
  }
};