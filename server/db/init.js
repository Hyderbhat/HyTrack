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


async function initDatabase() {
  if (!initPromise) {
    initPromise = (async () => {

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
