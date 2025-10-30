dont changy anythikg,
  i want only anything is happen or issue, or errom i want auto connect again ok 
dont chagne anythikg carefyllym 
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
    console.log('✅ MSSQL  connected');
    return pool;
  })
  .catch(err => {
    console.error('❌ MSSQL  connection failed', err);
    process.exit(1);
  });

module.exports = { sql, poolPromise };
