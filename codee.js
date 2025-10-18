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
    at exports.fetchHistoricalData (C:\Users\W0024618\Desktop\laca-occupancy-backend\src\services\occupancy.service.js:190:20)
    at process.processTicksAndRejections (node:internal/process/task_queues:105:5)
TypeError: Cannot read properties of undefined (reading 'request')
    at exports.fetchLiveOccupancy (C:\Users\W0024618\Desktop\laca-occupancy-backend\src\services\occupancy.service.js:110:29)
    at process.processTicksAndRejections (node:internal/process/task_queues:105:5)
    at async exports.getLiveSummary (C:\Users\W0024618\Desktop\laca-occupancy-backend\src\controllers\occupancy.controller.js:69:20)
TypeError: Cannot read properties of undefined (reading 'request')
    at exports.fetchLiveOccupancy (C:\Users\W0024618\Desktop\laca-occupancy-backend\src\services\occupancy.service.js:110:29)
    at process.processTicksAndRejections (node:internal/process/task_queues:105:5)
    at async exports.getLiveSummary (C:\Users\W0024618\Desktop\laca-occupancy-backend\src\controllers\occupancy.controller.js:69:20)
TypeError: Cannot read properties of undefined (reading 'request')
    at exports.fetchLiveOccupancy (C:\Users\W0024618\Desktop\laca-occupancy-backend\src\services\occupancy.service.js:110:29)
    at process.processTicksAndRejections (node:internal/process/task_queues:105:5)
    at async exports.getLiveSummary (C:\Users\W0024618\Desktop\laca-occupancy-backend\src\controllers\occupancy.controller.js:69:20)
TypeError: Cannot read properties of undefined (reading 'request')
    at exports.fetchLiveOccupancy (C:\Users\W0024618\Desktop\laca-occupancy-backend\src\services\occupancy.service.js:110:29)
    at process.processTicksAndRejections (node:internal/process/task_queues:105:5)
    at async exports.getLiveSummary (C:\Users\W0024618\Desktop\laca-occupancy-backend\src\controllers\occupancy.controller.js:69:20)
TypeError: Cannot read properties of undefined (reading 'request')
    at exports.fetchLiveOccupancy (C:\Users\W0024618\Desktop\laca-occupancy-backend\src\services\occupancy.service.js:110:29)
    at process.processTicksAndRejections (node:internal/process/task_queues:105:5)
    at async exports.getLiveSummary (C:\Users\W0024618\Desktop\laca-occupancy-backend\src\controllers\occupancy.controller.js:69:20)
TypeError: Cannot read properties of undefined (reading 'request')
    at exports.fetchLiveOccupancy (C:\Users\W0024618\Desktop\laca-occupancy-backend\src\services\occupancy.service.js:110:29)
    at process.processTicksAndRejections (node:internal/process/task_queues:105:5)
    at async exports.getLiveSummary (C:\Users\W0024618\Desktop\laca-occupancy-backend\src\controllers\occupancy.controller.js:69:20)
TypeError: Cannot read properties of undefined (reading 'request')
    at exports.fetchLiveOccupancy (C:\Users\W0024618\Desktop\laca-occupancy-backend\src\services\occupancy.service.js:110:29)
    at process.processTicksAndRejections (node:internal/process/task_queues:105:5)
    at async exports.getLiveSummary (C:\Users\W0024618\Desktop\laca-occupancy-backend\src\controllers\occupancy.controller.js:69:20)
TypeError: Cannot read properties of undefined (reading 'request')
    at exports.fetchLiveOccupancy (C:\Users\W0024618\Desktop\laca-occupancy-backend\src\services\occupancy.service.js:110:29)
    at process.processTicksAndRejections (node:internal/

                                          
//Abhishek//1//

// // C:\Users\W0024618\Desktop\laca-occupancy-backend\src\config\db.js
// const sql = require('mssql');
// require('dotenv').config();

// const dbConfig = {
//   user:             process.env.DB_USER,
//   password:         process.env.DB_PASSWORD,
//   server:           process.env.DB_SERVER,
//   database:         process.env.DB_DATABASE,
//   port:             parseInt(process.env.DB_PORT, 10),
//   pool: {
//     max:            10,
//     min:            0,
//     idleTimeoutMillis: 30000
//   },
//   options: {
//     // Force TLS 1.2+ and explicit cipher negotiation
//     encrypt:              true,                     // require encryption
//     trustServerCertificate: true,                   // dev only; accept self-signed cert
//     enableArithAbort:     true,                     // recommended for modern SQL Server
//     // cryptoCredentialsDetails: {
//     //   minVersion:         'TLSv1.2',               // enforce minimum TLS 1.2
//     //   maxVersion:         'TLSv1.3'                // allow up to TLS 1.3 if available
//     // }
//   }
// };

// const poolPromise = new sql.ConnectionPool(dbConfig)
//   .connect()
//   .then(pool => {
//     console.log('✅ MSSQL connected');
//     return pool;
//   })
//   .catch(err => {
//     console.error('❌ MSSQL connection failed ➞', err);
//     // crash early so front-end 500s disappear
//     process.exit(1);
//   });

// module.exports = {
//   sql,
//   poolPromise
// };

// ⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️
// Update BY Mayur
// ⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️




// C:\Users\W0024618\Desktop\laca-occupancy-backend\src\config\db.js
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
    trustServerCertificate: true, // dev only
    enableArithAbort: true,
  },
};

let pool; // shared connection pool instance

// connect with automatic retry logic
async function getConnection() {
  try {
    if (pool) {
      // check if pool is still connected
      if (pool.connected) return pool;
      if (pool.connecting) {
        await pool.connecting;
        return pool;
      }
    }

    pool = new sql.ConnectionPool(dbConfig);

    // set up event listeners for connection issues
    pool.on('error', (err) => {
      console.error('❌ SQL pool error', err);
      if (err.code === 'ESOCKET' || err.code === 'ECONNRESET') {
        console.log('🔁 Attempting to reconnect to SQL Server...');
        reconnect();
      }
    });

    await pool.connect();
    console.log('✅ MSSQL connected');
    return pool;
  } catch (err) {
    console.error('❌ MSSQL initial connection failed:', err);
    await new Promise((resolve) => setTimeout(resolve, 5000));
    console.log('🔁 Retrying MSSQL connection...');
    return getConnection(); // recursive retry
  }
}

// reconnect helper
async function reconnect() {
  try {
    await sql.close();
  } catch (e) {
    // ignore
  }
  pool = null;
  await getConnection();
}

// safe query helper
async function query(queryText, params = {}) {
  const conn = await getConnection();
  const request = conn.request();
  for (const [key, value] of Object.entries(params)) {
    request.input(key, value);
  }
  return request.query(queryText);
}

module.exports = {
  sql,
  getConnection,
  query,
};
