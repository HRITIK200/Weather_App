import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

let pool = null;
let isConnected = false;

try {
  pool = new Pool({
    user: process.env.PGUSER || 'postgres',
    host: process.env.PGHOST || 'localhost',
    database: process.env.PGDATABASE || 'weather_db',
    password: process.env.PGPASSWORD || 'postgres',
    port: parseInt(process.env.PGPORT || '5432', 10),
    connectionTimeoutMillis: 3000,
  });

  pool.on('connect', () => {
    isConnected = true;
    console.log('✅ [database]: Connected to PostgreSQL successfully.');
  });

  pool.on('error', (err) => {
    isConnected = false;
    console.warn('⚠️ [database]: PostgreSQL connection issue:', err.message);
  });
} catch (error) {
  console.warn('⚠️ [database]: Could not initialize PostgreSQL pool:', error.message);
}

// Function to check connection status
export const checkDbConnection = async () => {
  if (!pool) return false;
  try {
    const res = await pool.query('SELECT NOW()');
    isConnected = true;
    return true;
  } catch (err) {
    isConnected = false;
    return false;
  }
};

export const getDbStatus = () => isConnected;

export default pool;
