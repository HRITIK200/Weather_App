import pool from '../config/db.js';

// Pre-seeded Indian States & Major Cities
export const INDIAN_STATES_AND_CITIES = [
  { id: 101, city_name: 'Delhi', state: 'Delhi NCT', country: 'IN', region: 'india', lat: 28.6139, lon: 77.209 },
  { id: 102, city_name: 'Mumbai', state: 'Maharashtra', country: 'IN', region: 'india', lat: 19.076, lon: 72.8777 },
  { id: 103, city_name: 'Bengaluru', state: 'Karnataka', country: 'IN', region: 'india', lat: 12.9716, lon: 77.5946 },
  { id: 104, city_name: 'Hyderabad', state: 'Telangana', country: 'IN', region: 'india', lat: 17.385, lon: 78.4867 },
  { id: 105, city_name: 'Chennai', state: 'Tamil Nadu', country: 'IN', region: 'india', lat: 13.0827, lon: 80.2707 },
  { id: 106, city_name: 'Kolkata', state: 'West Bengal', country: 'IN', region: 'india', lat: 22.5726, lon: 88.3639 },
  { id: 107, city_name: 'Jaipur', state: 'Rajasthan', country: 'IN', region: 'india', lat: 26.9124, lon: 75.7873 },
  { id: 108, city_name: 'Ahmedabad', state: 'Gujarat', country: 'IN', region: 'india', lat: 23.0225, lon: 72.5714 },
  { id: 109, city_name: 'Pune', state: 'Maharashtra', country: 'IN', region: 'india', lat: 18.5204, lon: 73.8567 },
  { id: 110, city_name: 'Lucknow', state: 'Uttar Pradesh', country: 'IN', region: 'india', lat: 26.8467, lon: 80.9462 },
  { id: 111, city_name: 'Chandigarh', state: 'Punjab / Haryana', country: 'IN', region: 'india', lat: 30.7333, lon: 76.7794 },
  { id: 112, city_name: 'Kochi', state: 'Kerala', country: 'IN', region: 'india', lat: 9.9312, lon: 76.2673 },
  { id: 113, city_name: 'Panaji', state: 'Goa', country: 'IN', region: 'india', lat: 15.4909, lon: 73.8278 },
  { id: 114, city_name: 'Bhopal', state: 'Madhya Pradesh', country: 'IN', region: 'india', lat: 23.2599, lon: 77.4126 },
  { id: 115, city_name: 'Patna', state: 'Bihar', country: 'IN', region: 'india', lat: 25.5941, lon: 85.1376 },
  { id: 116, city_name: 'Bhubaneswar', state: 'Odisha', country: 'IN', region: 'india', lat: 20.2961, lon: 85.8245 },
  { id: 117, city_name: 'Guwahati', state: 'Assam', country: 'IN', region: 'india', lat: 26.1445, lon: 91.7362 },
  { id: 118, city_name: 'Shimla', state: 'Himachal Pradesh', country: 'IN', region: 'india', lat: 31.1048, lon: 77.1734 },
  { id: 119, city_name: 'Srinagar', state: 'Jammu & Kashmir', country: 'IN', region: 'india', lat: 34.0837, lon: 74.7973 },
  { id: 120, city_name: 'Dehradun', state: 'Uttarakhand', country: 'IN', region: 'india', lat: 30.3165, lon: 78.0322 },
  { id: 121, city_name: 'Amritsar', state: 'Punjab', country: 'IN', region: 'india', lat: 31.634, lon: 74.8723 },
  { id: 122, city_name: 'Indore', state: 'Madhya Pradesh', country: 'IN', region: 'india', lat: 22.7196, lon: 75.8577 },
  { id: 123, city_name: 'Surat', state: 'Gujarat', country: 'IN', region: 'india', lat: 21.1702, lon: 72.8311 },
];

export const GLOBAL_HUBS = [
  { id: 1, city_name: 'London', state: 'England', country: 'GB', region: 'global', lat: 51.5074, lon: -0.1278 },
  { id: 2, city_name: 'New York', state: 'New York', country: 'US', region: 'global', lat: 40.7128, lon: -74.006 },
  { id: 3, city_name: 'Tokyo', state: 'Tokyo', country: 'JP', region: 'global', lat: 35.6762, lon: 139.6503 },
  { id: 4, city_name: 'Paris', state: 'Île-de-France', country: 'FR', region: 'global', lat: 48.8566, lon: 2.3522 },
  { id: 5, city_name: 'Dubai', state: 'Dubai', country: 'AE', region: 'global', lat: 25.2048, lon: 55.2708 },
  { id: 6, city_name: 'Singapore', state: 'Singapore', country: 'SG', region: 'global', lat: 1.3521, lon: 103.8198 },
];

let memoryFavorites = [
  ...INDIAN_STATES_AND_CITIES.slice(0, 10), // Top 10 Indian cities by default
  ...GLOBAL_HUBS,
];

export const getAllFavorites = async (regionFilter) => {
  if (pool) {
    try {
      let query = `
        SELECT id, city_name, state, country, region, lat, lon, created_at 
        FROM favorite_cities 
      `;
      const values = [];

      if (regionFilter && regionFilter !== 'all') {
        query += ` WHERE region = $1 `;
        values.push(regionFilter.toLowerCase());
      }
      query += ` ORDER BY city_name ASC; `;

      const { rows } = await pool.query(query, values);
      if (rows.length > 0) return rows;
    } catch (err) {
      console.warn('⚠️ [database]: Reading favorites from fallback store:', err.message);
    }
  }

  if (regionFilter && regionFilter !== 'all') {
    return memoryFavorites.filter((item) => (item.region || '').toLowerCase() === regionFilter.toLowerCase());
  }
  return memoryFavorites;
};

export const addFavorite = async (cityName, country, lat, lon, state = '', region = 'custom') => {
  if (pool) {
    try {
      const query = `
        INSERT INTO favorite_cities (city_name, state, country, region, lat, lon)
        VALUES ($1, $2, $3, $4, $5, $6)
        ON CONFLICT (city_name) DO UPDATE 
        SET state = EXCLUDED.state, country = EXCLUDED.country, lat = EXCLUDED.lat, lon = EXCLUDED.lon
        RETURNING *;
      `;
      const values = [cityName, state, country, region, lat, lon];
      const { rows } = await pool.query(query, values);
      return rows[0];
    } catch (err) {
      console.warn('⚠️ [database]: Storing favorite in fallback store:', err.message);
    }
  }

  const existing = memoryFavorites.find(
    (item) => item.city_name.toLowerCase() === cityName.toLowerCase()
  );
  if (existing) return existing;

  const newFav = {
    id: Date.now(),
    city_name: cityName,
    state: state || '',
    country: country || '',
    region: region || 'custom',
    lat: lat || null,
    lon: lon || null,
  };
  memoryFavorites.push(newFav);
  return newFav;
};

export const deleteFavorite = async (id) => {
  if (pool) {
    try {
      const query = `
        DELETE FROM favorite_cities 
        WHERE id = $1 
        RETURNING id;
      `;
      const { rows } = await pool.query(query, [id]);
      return rows[0] || null;
    } catch (err) {
      console.warn('⚠️ [database]: Deleting favorite from fallback store:', err.message);
    }
  }

  const index = memoryFavorites.findIndex((item) => item.id == id);
  if (index !== -1) {
    const deleted = memoryFavorites.splice(index, 1);
    return deleted[0];
  }
  return null;
};
