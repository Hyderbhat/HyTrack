require('dotenv').config();
const fs = require('fs/promises');
const path = require('path');
const { Client } = require('pg');

let initPromise;

function getDbConfig(database) {
  return {
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT) || 5432,
    database,
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || '',
  };
}

async function ensureDatabaseExists() {
  const targetDatabase = process.env.DB_NAME || 'hyTrack';
  const adminClient = new Client(getDbConfig(process.env.DB_ADMIN_DB || 'postgres'));

  await adminClient.connect();

  try {
    const existing = await adminClient.query(
      'SELECT 1 FROM pg_database WHERE datname = $1',
      [targetDatabase]
    );

    if (existing.rowCount === 0) {
      await adminClient.query(`CREATE DATABASE "${targetDatabase.replace(/"/g, '""')}"`);
      console.log(`Created database "${targetDatabase}"`);
    }
  } finally {
    await adminClient.end();
  }
}

async function initDatabase() {
  if (!initPromise) {
    initPromise = (async () => {
      await ensureDatabaseExists();

      const pool = require('./pool');
      const schemaPath = path.join(__dirname, 'schema.sql');
      const schemaSql = await fs.readFile(schemaPath, 'utf8');
      await pool.query(schemaSql);
      console.log('Database schema ready');
    })().catch((error) => {
      initPromise = null;
      throw error;
    });
  }

  return initPromise;
}

module.exports = { initDatabase };
