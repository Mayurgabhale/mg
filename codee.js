// C:UsersW0024618Desktoplaca-occupancy-backendsrcconfigdb.js
const sql = require('mssql');
require('dotenv').config();

const dbConfig = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER,
  database: process.env.DB_DATABASE,
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : undefined,
  options: {
    encrypt: true, // set to true if using Azure or a TLS-enabled server
    trustServerCertificate: true, // set false in production with valid certs
    enableArithAbort: true
  },
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000
  }
};

// Create a pool and export both the sql module and a poolPromise that resolves to a connected pool
const poolPromise = new sql.ConnectionPool(dbConfig)
  .connect()
  .then(pool => {
    console.log('✅ MSSQL connected');
    return pool;
  })
  .catch(err => {
    // Do not crash the whole app in production; log and rethrow for higher-level handling
    console.error('❌ MSSQL connection failed ➞', err);
    throw err;
  });

module.exports = {
  sql,
  poolPromise
};