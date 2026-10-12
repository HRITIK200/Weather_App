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
 * Fetch True 1-Hour Resolution Hourly Forecast (with Past Hours from earlier today & Future 24-36 Hours)
 */
export const fetchHourlyOneHourForecast = async (lat, lon, cityOffsetSeconds = 0) => {
  try {
    const res = await axios.get('https://api.open-meteo.com/v1/forecast', {
      params: {
        latitude: lat,
        longitude: lon,
        hourly: 'temperature_2m,relative_humidity_2m,apparent_temperature,precipitation_probability,weather_code,wind_speed_10m',
        timezone: 'auto',
        past_days: 1,
        forecast_days: 2,
      },
      headers: {
        'User-Agent': 'WeatherAppPro/2.0 (contact@weatherapp.dev)',
      },
      timeout: 6500,
    });

    const data = res.data?.hourly;
    if (!data || !data.time || data.time.length === 0) return null;

    // Use Open-Meteo's reported offset or the city's verified timezone offset in seconds
    const offsetSec = (typeof res.data.utc_offset_seconds === 'number')
      ? res.data.utc_offset_seconds
      : (cityOffsetSeconds || 0);

    // Calculate city local date & time by shifting UTC ms by offset
    const localNow = new Date(Date.now() + offsetSec * 1000);
    const yyyy = localNow.getUTCFullYear();
    const mm = String(localNow.getUTCMonth() + 1).padStart(2, '0');
    const dd = String(localNow.getUTCDate()).padStart(2, '0');
    const hh = String(localNow.getUTCHours()).padStart(2, '0');
    const targetHourStr = `${yyyy}-${mm}-${dd}T${hh}:00`;
    const nowDatePart = `${yyyy}-${mm}-${dd}`;

    let currentIdx = data.time.indexOf(targetHourStr);
    if (currentIdx === -1) {
      // Find closest hour slot on the same date or closest in the array
      let minDiff = Infinity;
      currentIdx = 24; // default near today's start
      for (let i = 0; i < data.time.length; i++) {
        if (data.time[i].startsWith(nowDatePart)) {
          const slotHour = parseInt(data.time[i].slice(11, 13), 10);
          const diff = Math.abs(slotHour - parseInt(hh, 10));
          if (diff < minDiff) {
            minDiff = diff;
            currentIdx = i;
          }
        }
      }
    }

    // Determine current hour of day in local time (0 - 23)
    const currentLocalHour = parseInt(data.time[currentIdx].slice(11, 13), 10);

    // Start from today's midnight (12 AM) so earlier hours of today are fully available
    const startIdx = Math.max(0, currentIdx - currentLocalHour);
    // Include up to 28 hours into the future
    const endIdx = Math.min(data.time.length, currentIdx + 28);

    const hourly1h = [];
    for (let i = startIdx; i < endIdx; i++) {
      const hours = parseInt(data.time[i].slice(11, 13), 10);
      const label = hours === 0 ? '12 AM' : hours < 12 ? `${hours} AM` : hours === 12 ? '12 PM' : `${hours - 12} PM`;
      const isDay = hours >= 6 && hours <= 18;
      const weatherInfo = mapWmoCode(data.weather_code[i], isDay);

      const isCurrent = (i === currentIdx);
      const isPast = (i < currentIdx);
      const isFuture = (i > currentIdx);
      const diffFromNow = i - currentIdx;

      const datePart = data.time[i].slice(0, 10);
      let dayLabel = 'Today';
      if (datePart < nowDatePart) dayLabel = 'Yesterday';
      else if (datePart > nowDatePart) dayLabel = 'Tomorrow';

      hourly1h.push({
        time: label,
        fullTime: data.time[i],
        hourIndex: hourly1h.length,
        hourOfDay: hours,
        isNow: isCurrent,
        isCurrent,
        isPast,
        isFuture,
        diffFromNow,
        dayLabel,
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
 * Fallback: Smooth 1-hour interpolation from 3-hour slots with accurate city timezone alignment
 */
export const interpolateHourlySlots = (threeHourSlots, cityOffsetSeconds = 0) => {
  if (!threeHourSlots || threeHourSlots.length === 0) return [];
  const result = [];
  const nowMs = Date.now();
  const cityNow = new Date(nowMs + cityOffsetSeconds * 1000);
  const currentCityHour = cityNow.getUTCHours();
  const nowDatePart = `${cityNow.getUTCFullYear()}-${String(cityNow.getUTCMonth() + 1).padStart(2, '0')}-${String(cityNow.getUTCDate()).padStart(2, '0')}`;

  for (let i = 0; i < threeHourSlots.length; i++) {
    const cur = threeHourSlots[i];
    const curDt = cur.dt ? cur.dt * 1000 : nowMs + i * 3 * 3600000;
    const curLocalDate = new Date(curDt + cityOffsetSeconds * 1000);
    const curHours = curLocalDate.getUTCHours();
    const curLabel = curHours === 0 ? '12 AM' : curHours < 12 ? `${curHours} AM` : curHours === 12 ? '12 PM' : `${curHours - 12} PM`;

    const itemDatePart = `${curLocalDate.getUTCFullYear()}-${String(curLocalDate.getUTCMonth() + 1).padStart(2, '0')}-${String(curLocalDate.getUTCDate()).padStart(2, '0')}`;
    let dayLabel = 'Today';
    if (itemDatePart < nowDatePart) dayLabel = 'Yesterday';
    else if (itemDatePart > nowDatePart) dayLabel = 'Tomorrow';

    result.push({
      ...cur,
      time: curLabel,
      hourOfDay: curHours,
      hourIndex: result.length,
      dayLabel,
      temp: cur.temp,
      feels_like: cur.feels_like,
      humidity: cur.humidity,
      pop: cur.pop,
      wind_speed: cur.wind_speed,
      description: cur.description,
      main: cur.main,
      icon: cur.icon,
    });

    // Interpolate 2 in-between hours if there is a next slot
    if (i < threeHourSlots.length - 1 && result.length < 24) {
      const next = threeHourSlots[i + 1];
      const nextDt = next.dt ? next.dt * 1000 : curDt + 3 * 3600000;

      for (let step = 1; step <= 2; step++) {
        const factor = step / 3;
        const interpDt = curDt + step * 3600000;
        const interpLocalDate = new Date(interpDt + cityOffsetSeconds * 1000);
        const h = interpLocalDate.getUTCHours();
        const label = h === 0 ? '12 AM' : h < 12 ? `${h} AM` : h === 12 ? '12 PM' : `${h - 12} PM`;

        const interpDatePart = `${interpLocalDate.getUTCFullYear()}-${String(interpLocalDate.getUTCMonth() + 1).padStart(2, '0')}-${String(interpLocalDate.getUTCDate()).padStart(2, '0')}`;
        let interpDayLabel = 'Today';
        if (interpDatePart < nowDatePart) interpDayLabel = 'Yesterday';
        else if (interpDatePart > nowDatePart) interpDayLabel = 'Tomorrow';

        result.push({
          time: label,
          hourOfDay: h,
          hourIndex: result.length,
          dayLabel: interpDayLabel,
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

  // Find slot closest to city's current local hour and set isCurrent
  let bestIdx = 0;
  let minDiff = Infinity;
  result.forEach((slot, idx) => {
    const diff = Math.abs((slot.hourOfDay ?? 0) - currentCityHour);
    if (diff < minDiff) {
      minDiff = diff;
      bestIdx = idx;
    }
  });

  result.forEach((slot, idx) => {
    slot.isCurrent = (idx === bestIdx);
    slot.isNow = (idx === bestIdx);
    slot.isPast = (idx < bestIdx);
    slot.isFuture = (idx > bestIdx);
  });

  return result.slice(0, 24);
};

