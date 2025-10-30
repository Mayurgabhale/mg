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

// ---- ORIGINAL CODE ----
let poolPromise = sql.connect(dbConfig)
  .then(pool => {
    console.log('✅ MSSQL  connected');
    return pool;
  })
  .catch(err => {
    console.error('❌ MSSQL  connection failed', err);
    process.exit(1);
  });

// ---- AUTO-RECONNECT ADDED BELOW ----

// 1️⃣ Reconnect automatically if connection is lost
sql.on('error', err => {
  console.error('⚠️  SQL global error:', err.message);
  console.log('🔁 Attempting MSSQL reconnection...');
  poolPromise = sql.connect(dbConfig)
    .then(pool => {
      console.log('✅ MSSQL reconnected successfully');
      return pool;
    })
    .catch(e => {
      console.error('❌ MSSQL reconnection failed:', e.message);
    });
});

// 2️⃣ Optional: keep-alive ping every 2 minutes
setInterval(async () => {
  try {
    const pool = await poolPromise;
    await pool.request().query('SELECT 1');
    // console.log('✅ DB keep-alive OK');
  } catch (err) {
    console.error('💀 Keep-alive failed, reconnecting...', err.message);
    poolPromise = sql.connect(dbConfig)
      .then(pool => {
        console.log('✅ MSSQL reconnected after keep-alive failure');
        return pool;
      })
      .catch(e => console.error('❌ Reconnect after keep-alive failed:', e.message));
  }
}, 120000); // every 2 minutes

module.exports = { sql, poolPromise };