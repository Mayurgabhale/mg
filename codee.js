
require('dotenv').config();
const sql = require('mssql');

// Pull in and trim env-vars
const DB_USER     = (process.env.DB_USER     || '').trim();
const DB_PASSWORD = (process.env.DB_PASSWORD || '').trim();
const DB_SERVER   = (process.env.DB_SERVER   || '').trim();
const DB_DATABASE = (process.env.DB_DATABASE || '').trim();
const DB_PORT     = parseInt((process.env.DB_PORT || '').trim(), 10);

const dbConfig = {
  user: DB_USER,
  password: DB_PASSWORD,
  server: DB_SERVER,
  port: DB_PORT,
  database: DB_DATABASE,   // we keep it for compatibility, but not required for dynamic DB queries
  options: { 
    encrypt: false, 
    trustServerCertificate: true, 
    enableArithAbort: true 
  },
  pool: { 
    max: 10, 
    min: 0, 
    idleTimeoutMillis: 30000 
  },
  requestTimeout: 1800000,     // 30 minutes query timeout
  connectionTimeout: 60000    // 1 minute connection timeout
};

const poolPromise = sql.connect(dbConfig)
  .then(pool => {
    console.log('✅ MSSQL (APAC) connected');
    return pool;
  })
  .catch(err => {
    console.error('❌ MSSQL (APAC) connection failed', err);
    process.exit(1);
  });

module.exports = { sql, poolPromise };
+=================
  REad above config file and 
and use same logic for below pune filse ok 
carefully, 
  
// config/db.js — updated
const sql    = require('mssql');
const dotenv = require('dotenv');
dotenv.config();

const config = {
  server:   process.env.DB_SERVER,
  user:     process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,

  // connection & request timeouts
  connectionTimeout: 30000,   // 30s to establish TCP + handshake
  requestTimeout:    30_000,  // 30s per query (increase if queries may legitimately take longer)

  pool: {
    max:                  20,     // increase if DB can handle more concurrent connections (tune)
    min:                  1,      // keep at least 1 warm connection to reduce acquire latency
    idleTimeoutMillis:    30_000,
    acquireTimeoutMillis: 60_000  // wait up to 60s when trying to acquire a connection
  },

  options: {
    encrypt:               true,
    trustServerCertificate: true
  }
};

let poolPromise = null;

async function getPool(attempts = 5) {
  if (poolPromise) return poolPromise;

  poolPromise = (async () => {
    try {
      const pool = await sql.connect(config);
      console.log('✅ MSSQL pool connected (Pune)');

      pool.on('error', err => {
        console.error('❌ MSSQL pool error (Pune):', err);
        // free the cached promise so next call will recreate the pool
        poolPromise = null;
      });

      return pool;
    } catch (err) {
      console.error('❌ MSSQL pool connection failed (Pune) :', err);
      poolPromise = null;
      if (attempts > 0) {
        console.log(`⏳ Retrying MSSQL connect (Pune) (${attempts} left)…`);
        await new Promise(res => setTimeout(res, 3000));
        return getPool(attempts - 1);
      }
      throw err;
    }
  })();

  // Global handler: reset pool on fatal pool-level errors such as Tarn TimeoutError
  sql.on('error', err => {
    console.error('❌ MSSQL global error (Pune) :', err);
    // If it's a timeout / pool acquisition issue, reset poolPromise so we reconnect
    if (err && err.name === 'TimeoutError') {
      poolPromise = null;
    }
  });

  process.on('unhandledRejection', (reason) => {
    console.error('❌ Unhandled Rejection at (Pune) :', reason);
    // do not crash — but you could choose to exit(1) if desired and rely on a process manager
  });

  process.on('uncaughtException', (err) => {
    console.error('❌ Uncaught Exception (will exit) (Pune):', err);
    // prefer letting a process manager restart the process if it's a truly fatal error
    // process.exit(1);
  });

  return poolPromise;
}

module.exports = { sql, getPool };
