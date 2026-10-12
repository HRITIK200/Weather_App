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

/**
 * Helper to map WMO Weather interpretation codes to OpenWeather icons & descriptions
 */
const mapWmoCode = (code, isDay = true) => {
  if (code === 0) return { main: 'Clear', description: 'Clear sky', icon: isDay ? '01d' : '01n' };
  if (code === 1) return { main: 'Clear', description: 'Mainly clear', icon: isDay ? '01d' : '01n' };
  if (code === 2) return { main: 'Clouds', description: 'Partly cloudy', icon: isDay ? '02d' : '02n' };
  if (code === 3) return { main: 'Clouds', description: 'Overcast', icon: isDay ? '04d' : '04n' };
  if ([45, 48].includes(code)) return { main: 'Fog', description: 'Foggy', icon: '50d' };
  if ([51, 53, 55].includes(code)) return { main: 'Drizzle', description: 'Light drizzle', icon: '09d' };
  if ([61, 63, 65].includes(code)) return { main: 'Rain', description: 'Rain showers', icon: '10d' };
  if ([66, 67].includes(code)) return { main: 'Rain', description: 'Freezing rain', icon: '10d' };
  if ([71, 73, 75, 77].includes(code)) return { main: 'Snow', description: 'Snowfall', icon: '13d' };
  if ([80, 81, 82].includes(code)) return { main: 'Rain', description: 'Heavy showers', icon: '09d' };
  if ([85, 86].includes(code)) return { main: 'Snow', description: 'Snow showers', icon: '13d' };
  if ([95, 96, 99].includes(code)) return { main: 'Thunderstorm', description: 'Thunderstorm', icon: '11d' };
  return { main: 'Clouds', description: 'Scattered clouds', icon: '03d' };
};

/**
 * Fetch True 1-Hour Resolution Hourly Forecast (Every Single Hour for next 24-48 hours)
 */
export const fetchHourlyOneHourForecast = async (lat, lon) => {
  try {
    const res = await axios.get('https://api.open-meteo.com/v1/forecast', {
      params: {
        latitude: lat,
        longitude: lon,
        hourly: 'temperature_2m,relative_humidity_2m,apparent_temperature,precipitation_probability,weather_code,wind_speed_10m',
        timezone: 'auto',
        forecast_days: 2,
      },
      timeout: 5000,
    });

    const data = res.data?.hourly;
    if (!data || !data.time || data.time.length === 0) return null;

    const nowMs = Date.now();
    let startIndex = 0;
    let minDiff = Infinity;

    for (let i = 0; i < data.time.length; i++) {
      const itemTime = new Date(data.time[i]).getTime();
      const diff = Math.abs(itemTime - nowMs);
      if (diff < minDiff) {
        minDiff = diff;
        startIndex = i;
      }
    }

    const hourly1h = [];
    for (let i = startIndex; i < data.time.length && hourly1h.length < 24; i++) {
      const dt = new Date(data.time[i]);
      const hours = dt.getHours();
      const label = hours === 0 ? '12 AM' : hours < 12 ? `${hours} AM` : hours === 12 ? '12 PM' : `${hours - 12} PM`;
      const isDay = hours >= 6 && hours <= 18;
      const weatherInfo = mapWmoCode(data.weather_code[i], isDay);

      hourly1h.push({
        time: label,
        fullTime: data.time[i],
        hourIndex: hourly1h.length,
        isNow: hourly1h.length === 0,
        temp: Math.round(data.temperature_2m[i]),
        feels_like: Math.round(data.apparent_temperature[i]),
        humidity: Math.round(data.relative_humidity_2m[i] || 0),
        pop: Math.round(data.precipitation_probability[i] || 0),
        wind_speed: Math.round(data.wind_speed_10m[i]),
        description: weatherInfo.description,
        main: weatherInfo.main,
        icon: weatherInfo.icon,
      });
    }

    return hourly1h;
  } catch (err) {
    console.warn('⚠️ [hourly-1h]: Open-Meteo fallback:', err.message);
    return null;
  }
};

/**
 * Fallback: Smooth 1-hour interpolation from 3-hour slots
 */
export const interpolateHourlySlots = (threeHourSlots) => {
  if (!threeHourSlots || threeHourSlots.length === 0) return [];
  const result = [];

  for (let i = 0; i < threeHourSlots.length; i++) {
    const cur = threeHourSlots[i];
    result.push({
      ...cur,
      hourIndex: result.length,
      isNow: result.length === 0,
    });

    // Interpolate 2 in-between hours if there is a next slot
    if (i < threeHourSlots.length - 1 && result.length < 24) {
      const next = threeHourSlots[i + 1];

      for (let step = 1; step <= 2; step++) {
        const factor = step / 3;
        const curDate = new Date(cur.fullTime || Date.now() + i * 3 * 3600000);
        const interpDate = new Date(curDate.getTime() + step * 3600000);
        const h = interpDate.getHours();
        const label = h === 0 ? '12 AM' : h < 12 ? `${h} AM` : h === 12 ? '12 PM' : `${h - 12} PM`;

        result.push({
          time: label,
          hourIndex: result.length,
          isNow: false,
          temp: Math.round(cur.temp + (next.temp - cur.temp) * factor),
          feels_like: Math.round(cur.feels_like + (next.feels_like - cur.feels_like) * factor),
          humidity: Math.round((cur.humidity || 60) + ((next.humidity || 60) - (cur.humidity || 60)) * factor),
          pop: Math.round(cur.pop + (next.pop - cur.pop) * factor),
          wind_speed: Math.round(cur.wind_speed + (next.wind_speed - cur.wind_speed) * factor),
          description: factor > 0.5 ? next.description : cur.description,
          main: factor > 0.5 ? next.main : cur.main,
          icon: factor > 0.5 ? next.icon : cur.icon,
        });

        if (result.length >= 24) break;
      }
    }
  }

  return result.slice(0, 24);
};

