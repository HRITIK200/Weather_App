import pool from '../config/db.js';

// In-memory fallback if PostgreSQL is not active
const memoryHistory = [];

/**
 * Retrieve recent search history (latest 15)
 */
export const getAllHistory = async () => {
  if (pool) {
    try {
      const query = `
        SELECT id, city_name, country, temperature, weather_desc, icon, searched_at 
        FROM search_history 
        ORDER BY searched_at DESC 
        LIMIT 15;
      `;
      const { rows } = await pool.query(query);
      return rows;
    } catch (err) {
      console.warn('⚠️ [database]: Reading from in-memory fallback store:', err.message);
    }
  }
  return memoryHistory.slice(0, 15);
};

/**
 * Insert new search history record
 */
export const createHistoryEntry = async (cityName, country, temperature, weatherDesc, icon) => {
  if (pool) {
    try {
      const query = `
        INSERT INTO search_history (city_name, country, temperature, weather_desc, icon)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *;
      `;
      const values = [cityName, country, temperature, weatherDesc, icon];
      const { rows } = await pool.query(query, values);
      return rows[0];
    } catch (err) {
      console.warn('⚠️ [database]: Storing in in-memory fallback store:', err.message);
    }
  }

  const newEntry = {
    id: Date.now(),
    city_name: cityName,
    country: country || '',
    temperature: parseFloat(temperature),
    weather_desc: weatherDesc,
    icon,
    searched_at: new Date().toISOString(),
  };
  memoryHistory.unshift(newEntry);
  return newEntry;
};

/**
 * Delete a history record by ID
 */
export const deleteHistoryEntry = async (id) => {
  if (pool) {
    try {
      const query = `
        DELETE FROM search_history 
        WHERE id = $1 
        RETURNING id;
      `;
      const { rows } = await pool.query(query, [id]);
      return rows[0] || null;
    } catch (err) {
      console.warn('⚠️ [database]: Deleting from fallback store:', err.message);
    }
  }

  const index = memoryHistory.findIndex((item) => item.id == id);
  if (index !== -1) {
    const deleted = memoryHistory.splice(index, 1);
    return deleted[0];
  }
  return null;
};
