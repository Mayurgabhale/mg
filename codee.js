0k, but know i am gettng this error... 
  
PS C:\Users\W0024618\Desktop\laca-occupancy-backend> npm run dev

> laca-occupancy-backend@1.0.0 dev
> nodemon src/server.js

[nodemon] 3.1.10
[nodemon] to restart at any time, enter `rs`
[nodemon] watching path(s): *.*
[nodemon] watching extensions: js,mjs,cjs,json
[nodemon] starting `node src/server.js`
🚀 Server running on port 3001
TypeError: Cannot read properties of undefined (reading 'request')
    at exports.fetchLiveOccupancy (C:\Users\W0024618\Desktop\laca-occupancy-backend\src\services\occupancy.service.js:110:29)
    at process.processTicksAndRejections (node:internal/process/task_queues:105:5)
    at async exports.getLiveSummary (C:\Users\W0024618\Desktop\laca-occupancy-backend\src\controllers\occupancy.controller.js:409:20)
TypeError: Cannot read properties of undefined (reading 'request')
    at exports.fetchLiveOccupancy (C:\Users\W0024618\Desktop\laca-occupancy-backend\src\services\occupancy.service.js:110:29)
    at process.processTicksAndRejections (node:internal/process/task_queues:105:5)
    at async exports.getLiveSummary (C:\Users\W0024618\Desktop\laca-occupancy-backend\src\controllers\occupancy.controller.js:409:20)
TypeError: Cannot read properties of undefined (reading 'request')
    at exports.fetchLiveOccupancy (C:\Users\W0024618\Desktop\laca-occupancy-backend\src\services\occupancy.service.js:110:29)
    at process.processTicksAndRejections (node:internal/process/task_queues:105:5)
    at async exports.getLiveSummary (C:\Users\W0024618\Desktop\laca-occupancy-backend\src\controllers\occupancy.controller.js:409:20)
TypeError: Cannot read properties of undefined (reading 'request')
    at exports.fetchLiveOccupancy (C:\Users\W0024618\Desktop\laca-occupancy-backend\src\services\occupancy.service.js:110:29)
    at process.processTicksAndRejections (node:internal/process/task_queues:105:5)
    at async exports.getLiveSummary (C:\Users\W0024618\Desktop\laca-occupancy-backend\src\controllers\occupancy.controller.js:409:20)
TypeError: Cannot read properties of undefined (reading 'request')
    at exports.fetchLiveOccupancy (C:\Users\W0024618\Desktop\laca-occupancy-backend\src\services\occupancy.service.js:110:29)
    at process.processTicksAndRejections (node:internal/process/task_queues:105:5)
    at async exports.getLiveSummary (C:\Users\W0024618\Desktop\laca-occupancy-backend\src\controllers\occupancy.controller.js:409:20)

// C:\Users\W0024618\Desktop\laca-occupancy-backend\src\config\db.js
// laca DB connection (mirrors Pune implementation)

require('dotenv').config();
const sql = require('mssql');

// Pull and trim environment variables
const DB_USER = (process.env.DB_USER || '').trim();
const DB_PASSWORD = (process.env.DB_PASSWORD || '').trim();
const DB_SERVER = (process.env.DB_SERVER || '').trim();
const DB_DATABASE = (process.env.DB_DATABASE || '').trim();
const DB_PORT = parseInt((process.env.DB_PORT || '').trim(), 10) || 1433;

// Database configuration
const dbConfig = {
  user: DB_USER,
  password: DB_PASSWORD,
  server: DB_SERVER,
  port: DB_PORT,
  database: DB_DATABASE,
  options: {
    encrypt: true,                // for Azure / secure connections
    trustServerCertificate: true, // allow self-signed certs (disable in prod)
    enableArithAbort: true,
  },
  pool: {
    max: 20,                      // tuneable (same as Pune)
    min: 1,
    idleTimeoutMillis: 30000,
    acquireTimeoutMillis: 60000,
  },
  requestTimeout: 1800000,        // 30 minutes
  connectionTimeout: 60000,       // 1 minute
};

let poolPromise = null;

// Create or retrieve the MSSQL connection pool
async function getPool(attempts = 5) {
  if (poolPromise) return poolPromise;

  poolPromise = (async () => {
    try {
      const pool = await sql.connect(dbConfig);
      console.log('✅ MSSQL pool connected (Laca)');

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

  // Global MSSQL error handler
  sql.on('error', (err) => {
    console.error('❌ MSSQL global error (Laca):', err);
    if (err && err.name === 'TimeoutError') poolPromise = null;
  });

  // Global process-level error handlers
  process.on('unhandledRejection', (reason) => {
    console.error('❌ Unhandled Rejection at (Laca):', reason);
  });

  process.on('uncaughtException', (err) => {
    console.error('❌ Uncaught Exception (will exit) (Laca):', err);
    // optional: process.exit(1);
  });

  return poolPromise;
}

module.exports = { sql, getPool };

--------
  C:\Users\W0024618\Desktop\laca-occupancy-backend\src\server.js
require('dotenv').config();
const app = require('./app');

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});





