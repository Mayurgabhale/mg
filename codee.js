// Before:
const { poolPromise, sql } = require('../config/db');

// After:
const { getPool, sql } = require('../config/db');




......



// Before:
const pool = await poolPromise;

// After:
const pool = await getPool();