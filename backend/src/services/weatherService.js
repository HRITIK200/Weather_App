import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const API_KEY = process.env.OPENWEATHER_API_KEY || 'f0b74ae8c30791db4fe601b6a2f5a1fa';
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

/**
 * Fetch current weather by city name
 */
export const fetchCurrentWeather = async (city) => {
  const response = await axios.get(`${BASE_URL}/weather`, {
    params: {
      q: city,
      appid: API_KEY,
      units: 'metric',
    },
  });
  return response.data;
};

/**
 * Fetch current weather by geographical coordinates
 */
export const fetchCurrentWeatherByCoords = async (lat, lon) => {
  const response = await axios.get(`${BASE_URL}/weather`, {
    params: {
      lat,
      lon,
      appid: API_KEY,
      units: 'metric',
    },
  });
  return response.data;
};

/**
 * Fetch 5-day / 3-hour forecast by city name
 */
export const fetchForecast = async (city) => {
  const response = await axios.get(`${BASE_URL}/forecast`, {
    params: {
      q: city,
      appid: API_KEY,
      units: 'metric',
    },
  });
  return response.data;
};

/**
 * Fetch 5-day / 3-hour forecast by coordinates
 */
export const fetchForecastByCoords = async (lat, lon) => {
  const response = await axios.get(`${BASE_URL}/forecast`, {
    params: {
      lat,
      lon,
      appid: API_KEY,
      units: 'metric',
    },
  });
  return response.data;
};

/**
 * Fetch Air Pollution / AQI data by coordinates
 */
export const fetchAirPollution = async (lat, lon) => {
  const response = await axios.get(`${BASE_URL}/air_pollution`, {
    params: {
      lat,
      lon,
      appid: API_KEY,
    },
  });
  return response.data;
};

/**
 * Global & Hyper-Local Small Area Geocoding Search
 * Resolves small areas, villages, taluks, tehsils, sectors, colonies, PIN codes,
 * and remote corners across India and the globe.
 */
export const searchLocations = async (query) => {
  if (!query || query.trim().length < 2) return [];
  const q = query.trim();
  const results = [];
  const seenKeys = new Set();

  const addResult = (item) => {
    const key = `${item.name.toLowerCase()}|${(item.subtitle || '').toLowerCase()}|${Math.round(item.lat * 100)}|${Math.round(item.lon * 100)}`;
    if (!seenKeys.has(key)) {
      seenKeys.add(key);
      results.push(item);
    }
  };

  // 1. Special check: If 6-digit number (Indian Postal PIN Code)
  if (/^\d{6}$/.test(q)) {
    try {
      const zipRes = await axios.get('http://api.openweathermap.org/geo/1.0/zip', {
        params: { zip: `${q},IN`, appid: API_KEY },
        timeout: 4000,
      });
      if (zipRes.data && zipRes.data.lat) {
        addResult({
          id: `zip-${q}`,
          name: zipRes.data.name || `PIN ${q}`,
          displayName: `${zipRes.data.name || 'Postal Area'} (PIN ${q}), India`,
          subtitle: `PIN Code ${q}, India`,
          postcode: q,
          country: 'India',
          countryCode: 'IN',
          type: 'postal_code',
          lat: zipRes.data.lat,
          lon: zipRes.data.lon,
        });
      }
    } catch (e) {
      // Continue to next providers
    }
  }

  // 2. Primary Engine: Photon Geocoding (OpenStreetMap global indexing)
  try {
    const photonRes = await axios.get('https://photon.komoot.io/api/', {
      params: { q, limit: 10 },
      timeout: 5000,
    });
    if (photonRes.data?.features?.length > 0) {
      photonRes.data.features.forEach((f, idx) => {
        const props = f.properties || {};
        const coords = f.geometry?.coordinates || [];
        if (coords.length < 2) return;

        const name = props.name || props.city || props.district || q;
        const subtitleParts = [
          props.district,
          props.city,
          props.state,
          props.postcode ? `PIN: ${props.postcode}` : null,
          props.country,
        ].filter(Boolean);

        addResult({
          id: `osm-${props.osm_id || idx}-${Math.random()}`,
          name,
          displayName: `${name}${subtitleParts.length > 0 ? ', ' + subtitleParts.join(', ') : ''}`,
          subtitle: [props.district, props.city, props.state, props.country].filter(Boolean).join(', '),
          district: props.district || props.city,
          state: props.state,
          country: props.country,
          postcode: props.postcode,
          type: props.type || 'locality',
          lat: coords[1],
          lon: coords[0],
        });
      });
    }
  } catch (err) {
    console.warn('⚠️ [geocoding]: Photon service fallback:', err.message);
  }

  // 3. Secondary Provider: OpenWeather Direct Geocoding
  if (results.length < 3) {
    try {
      const owRes = await axios.get('http://api.openweathermap.org/geo/1.0/direct', {
        params: { q, limit: 5, appid: API_KEY },
        timeout: 4000,
      });
      if (owRes.data?.length > 0) {
        owRes.data.forEach((item, idx) => {
          addResult({
            id: `ow-${idx}-${item.lat}`,
            name: item.name,
            displayName: [item.name, item.state, item.country].filter(Boolean).join(', '),
            subtitle: [item.state, item.country].filter(Boolean).join(', '),
            state: item.state,
            country: item.country,
            type: 'city',
            lat: item.lat,
            lon: item.lon,
          });
        });
      }
    } catch (err) {
      console.warn('⚠️ [geocoding]: OpenWeather geo fallback:', err.message);
    }
  }

  return results.slice(0, 8);
};
