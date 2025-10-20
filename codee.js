// src/config/db.js
const sql = require('mssql');
require('dotenv').config();

const dbConfig = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER,
  database: process.env.DB_DATABASE,
  port: parseInt(process.env.DB_PORT, 10),
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000,
  },
  options: {
    encrypt: true,
    trustServerCertificate:
      process.env.DB_TRUST_CERT === 'true' || process.env.NODE_ENV !== 'production',
    enableArithAbort: true,
  },
  requestTimeout: 300000,
  connectionTimeout: 30000,
};

let poolPromise = null;

async function getPool() {
  if (poolPromise) return poolPromise;
  poolPromise = sql
    .connect(dbConfig)
    .then((pool) => {
      console.log('✅ MSSQL connected');
      pool.on('error', (err) => {
        console.error('⚠️  MSSQL pool error — resetting connection:', err.message);
        poolPromise = null; // force reconnect on next request
      });
      return pool;
    })
    .catch((err) => {
      console.error('❌ MSSQL connection failed ➞', err.message);
      poolPromise = null;
      throw err;
    });
  return poolPromise;
}

module.exports = { sql, getPool };