const { Pool } = require('pg');
require('dotenv').config();

const connectionString = process.env.DATABASE_URL || process.env.DB_URL;

const useSsl =
  process.env.DB_SSL === 'true' ||
  (typeof connectionString === 'string' &&
    (/supabase\.co/i.test(connectionString) || /sslmode=require/i.test(connectionString)));

const poolConfig = {
  connectionString,
};

if (useSsl) {
  poolConfig.ssl = { rejectUnauthorized: false };
}

const pool = new Pool(poolConfig);

pool.on('connect', () => {
  console.log('✅ Connected to PostgreSQL');
});

pool.on('error', (err) => {
  console.error('❌ DB error:', err.message);
});

module.exports = pool;