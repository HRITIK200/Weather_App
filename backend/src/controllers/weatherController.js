import * as weatherService from '../services/weatherService.js';
import * as aiInsightService from '../services/aiInsightService.js';
import * as historyModel from '../models/historyModel.js';

// Helper to normalize weather data response
const formatWeatherResponse = async (weatherData) => {
  const timezoneOffset = weatherData.timezone; // in seconds
  const localTimestamp = Date.now() + timezoneOffset * 1000;
  const localDate = new Date(localTimestamp);

  const timeOptions = { hour: 'numeric', minute: '2-digit', hour12: true, timeZone: 'UTC' };
  const formattedLocalTime = new Intl.DateTimeFormat('en-US', timeOptions).format(localDate);

  // Sunrise and Sunset formatted to local city time
  const sunriseDate = new Date((weatherData.sys.sunrise + timezoneOffset) * 1000);
  const sunsetDate = new Date((weatherData.sys.sunset + timezoneOffset) * 1000);

  const sunriseTime = new Intl.DateTimeFormat('en-US', timeOptions).format(sunriseDate);
  const sunsetTime = new Intl.DateTimeFormat('en-US', timeOptions).format(sunsetDate);

  // Daylight progress percentage (0 - 100)
  const nowUtc = Math.floor(Date.now() / 1000);
  const totalDaylight = weatherData.sys.sunset - weatherData.sys.sunrise;
  const elapsedDaylight = nowUtc - weatherData.sys.sunrise;
  const daylightProgress = Math.max(0, Math.min(100, Math.round((elapsedDaylight / totalDaylight) * 100)));

  const normalized = {
    name: weatherData.name,
    country: weatherData.sys.country,
    coord: weatherData.coord,
    temp: Math.round(weatherData.main.temp),
    temp_min: Math.round(weatherData.main.temp_min),
    temp_max: Math.round(weatherData.main.temp_max),
    feels_like: Math.round(weatherData.main.feels_like),
    humidity: weatherData.main.humidity,
    pressure: weatherData.main.pressure, // hPa
    wind_speed: Math.round(weatherData.wind.speed * 3.6), // Convert m/s to km/h
    wind_deg: weatherData.wind.deg,
    visibility: Math.round((weatherData.visibility || 10000) / 1000), // in km
    cloudiness: weatherData.clouds ? weatherData.clouds.all : 0, // %
    description: weatherData.weather[0].description,
    main: weatherData.weather[0].main,
    icon: weatherData.weather[0].icon,
    local_time: formattedLocalTime,
    sunrise: sunriseTime,
    sunset: sunsetTime,
    daylight_progress: daylightProgress,
  };

  // Fetch Live Air Pollution (AQI) Data
  let aqiData = null;
  try {
    const rawPollution = await weatherService.fetchAirPollution(
      weatherData.coord.lat,
      weatherData.coord.lon
    );
    aqiData = aiInsightService.parseAirQuality(rawPollution);
  } catch (err) {
    console.warn('⚠️ [aqi]: Could not fetch pollution data:', err.message);
  }

  normalized.aqi = aqiData;

  // Detect Severe Weather Alerts & Advisories
  normalized.alerts = aiInsightService.detectSevereWeatherAlerts(normalized, aqiData);

  // Generate AI Insights with AQI awareness
  normalized.ai_insight = aiInsightService.generateWeatherInsight(normalized, aqiData);

  return normalized;
};

/**
 * GET /api/weather/search-locations?q=...
 * Search villages, taluks, tehsils, sectors, PIN codes, and global corners
 */
export const searchLocationsHandler = async (req, res, next) => {
  try {
    const { q } = req.query;
    if (!q || q.trim().length < 2) {
      return res.status(200).json({ success: true, data: [] });
    }
    const locations = await weatherService.searchLocations(q.trim());
    return res.status(200).json({
      success: true,
      data: locations,
    });
  } catch (error) {
    return next(error);
  }
};

/**
 * GET /api/weather?city=...
 */
export const getCurrentWeather = async (req, res, next) => {
  try {
    const { city } = req.query;

    if (!city || city.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'City or location parameter is required',
      });
    }

    const cleanQuery = city.trim();
    let weatherData = null;
    let customLocation = null;

    // 1. Try direct city search
    try {
      weatherData = await weatherService.fetchCurrentWeather(cleanQuery);
    } catch (directErr) {
      // 2. If 404 (small area, village, sector, colony, PIN code), resolve via Geocoding
      if (directErr.response && directErr.response.status === 404) {
        const locations = await weatherService.searchLocations(cleanQuery);
        if (locations && locations.length > 0) {
          customLocation = locations[0];
          weatherData = await weatherService.fetchCurrentWeatherByCoords(
            customLocation.lat,
            customLocation.lon
          );
        } else {
          return res.status(404).json({
            success: false,
            message: `Location "${cleanQuery}" not found. Try searching by PIN code or nearby town.`,
          });
        }
      } else {
        throw directErr;
      }
    }

    const formatted = await formatWeatherResponse(weatherData);

    // If custom small area / locality was resolved, enrich metadata
    if (customLocation) {
      formatted.displayName = customLocation.name;
      formatted.fullLocation = customLocation.displayName;
      formatted.subtitle = customLocation.subtitle;
      formatted.stationName = formatted.name;
      formatted.areaType = customLocation.type;
      if (customLocation.postcode) formatted.postcode = customLocation.postcode;
    }

    // Record into Search History
    try {
      await historyModel.createHistoryEntry(
        formatted.displayName || formatted.name,
        formatted.country,
        formatted.temp,
        formatted.description,
        formatted.icon
      );
    } catch (dbErr) {
      console.warn('⚠️ [history]: Could not record search log:', dbErr.message);
    }

    return res.status(200).json({
      success: true,
      data: formatted,
    });
  } catch (error) {
    if (error.response && error.response.status === 404) {
      return res.status(404).json({
        success: false,
        message: 'Location not found. Please check spelling or enter a PIN code.',
      });
    }
    return next(error);
  }
};

/**
 * GET /api/weather/coordinates?lat=...&lon=...
 */
export const getWeatherByCoords = async (req, res, next) => {
  try {
    const { lat, lon, customName, subtitle, areaType, postcode } = req.query;

    if (!lat || !lon) {
      return res.status(400).json({
        success: false,
        message: 'Latitude and Longitude parameters are required',
      });
    }

    const weatherData = await weatherService.fetchCurrentWeatherByCoords(lat, lon);
    const formatted = await formatWeatherResponse(weatherData);

    if (customName) {
      formatted.displayName = customName;
      formatted.stationName = formatted.name;
      formatted.subtitle = subtitle || '';
      formatted.areaType = areaType || 'locality';
      if (postcode) formatted.postcode = postcode;
    }

    // Record search history
    try {
      await historyModel.createHistoryEntry(
        formatted.displayName || formatted.name,
        formatted.country,
        formatted.temp,
        formatted.description,
        formatted.icon
      );
    } catch (dbErr) {
      console.warn('⚠️ [history]: Could not record search log:', dbErr.message);
    }

    return res.status(200).json({
      success: true,
      data: formatted,
    });
  } catch (error) {
    return next(error);
  }
};

/**
 * GET /api/weather/forecast?city=... or ?lat=...&lon=...
 */
export const getWeatherForecast = async (req, res, next) => {
  try {
    const { city, lat, lon } = req.query;

    let forecastRaw = null;
    if (city && city.trim() !== '') {
      try {
        forecastRaw = await weatherService.fetchForecast(city.trim());
      } catch (forecastErr) {
        // Fallback geocode if city forecast fails with 404
        if (forecastErr.response && forecastErr.response.status === 404) {
          const locs = await weatherService.searchLocations(city.trim());
          if (locs && locs.length > 0) {
            forecastRaw = await weatherService.fetchForecastByCoords(locs[0].lat, locs[0].lon);
          } else {
            throw forecastErr;
          }
        } else {
          throw forecastErr;
        }
      }
    } else if (lat && lon) {
      forecastRaw = await weatherService.fetchForecastByCoords(lat, lon);
    } else {
      return res.status(400).json({
        success: false,
        message: 'Either city or lat & lon parameters are required',
      });
    }

    // Determine coordinates for high-precision 1-hour forecast
    const targetLat = lat ? parseFloat(lat) : forecastRaw.city?.coord?.lat;
    const targetLon = lon ? parseFloat(lon) : forecastRaw.city?.coord?.lon;

    // 1. 3-Hour Interval Slots from OpenWeather (Classical synoptic 8 slots)
    const hourly_3h = forecastRaw.list.slice(0, 8).map((item, idx) => {
      const dt = new Date(item.dt * 1000);
      const hours = dt.getHours();
      const label = hours === 0 ? '12 AM' : hours < 12 ? `${hours} AM` : hours === 12 ? '12 PM' : `${hours - 12} PM`;

      return {
        time: label,
        fullTime: item.dt_txt,
        hourIndex: idx,
        isNow: idx === 0,
        temp: Math.round(item.main.temp),
        feels_like: Math.round(item.main.feels_like),
        humidity: item.main.humidity,
        pop: Math.round((item.pop || 0) * 100), // Probability of precipitation %
        description: item.weather[0].description,
        main: item.weather[0].main,
        icon: item.weather[0].icon,
        wind_speed: Math.round(item.wind.speed * 3.6),
      };
    });

    // 2. True 1-Hour Resolution Forecast (Every single hour for 24 hours)
    let hourly_1h = null;
    if (targetLat && targetLon) {
      try {
        hourly_1h = await weatherService.fetchHourlyOneHourForecast(targetLat, targetLon);
      } catch (e) {
        console.warn('⚠️ [forecast]: 1h fetch error, using interpolation');
      }
    }

    // Fallback: smooth cubic/linear interpolation if needed
    if (!hourly_1h || hourly_1h.length === 0) {
      hourly_1h = weatherService.interpolateHourlySlots(hourly_3h);
    }

    // Default 'hourly' is the 1-hour sequence (every hour)
    const hourly = hourly_1h;

    // 2. Daily Forecast (grouping by date for next 5 days)
    const dailyMap = {};
    forecastRaw.list.forEach((item) => {
      const dateStr = item.dt_txt.split(' ')[0];
      if (!dailyMap[dateStr]) {
        dailyMap[dateStr] = {
          dateStr,
          temps: [],
          weather: item.weather[0],
          pop: item.pop || 0,
        };
      }
      dailyMap[dateStr].temps.push(item.main.temp);
      if (item.pop > dailyMap[dateStr].pop) {
        dailyMap[dateStr].pop = item.pop;
      }
    });

    const daily = Object.values(dailyMap).slice(0, 5).map((entry) => {
      const dateObj = new Date(entry.dateStr);
      const dayName = dateObj.toLocaleDateString('en-US', { weekday: 'short' });

      return {
        date: entry.dateStr,
        day: dayName,
        temp_min: Math.round(Math.min(...entry.temps)),
        temp_max: Math.round(Math.max(...entry.temps)),
        pop: Math.round(entry.pop * 100),
        description: entry.weather.description,
        icon: entry.weather.icon,
        main: entry.weather.main,
      };
    });

    return res.status(200).json({
      success: true,
      data: {
        hourly,
        hourly_1h,
        hourly_3h,
        daily,
      },
    });
  } catch (error) {
    if (error.response && error.response.status === 404) {
      return res.status(404).json({
        success: false,
        message: 'City not found',
      });
    }
    return next(error);
  }
};

/**
 * GET /api/weather/compare?city1=...&city2=...
 * Side-by-side comparison between two cities
 */
export const compareCitiesWeather = async (req, res, next) => {
  try {
    const { city1, city2 } = req.query;

    if (!city1 || !city2) {
      return res.status(400).json({
        success: false,
        message: 'Both city1 and city2 query parameters are required for comparison',
      });
    }

    const [data1, data2] = await Promise.all([
      weatherService.fetchCurrentWeather(city1.trim()),
      weatherService.fetchCurrentWeather(city2.trim()),
    ]);

    const [formatted1, formatted2] = await Promise.all([
      formatWeatherResponse(data1),
      formatWeatherResponse(data2),
    ]);

    const tempDiff = formatted1.temp - formatted2.temp;
    const warmerCity = tempDiff > 0 ? formatted1.name : tempDiff < 0 ? formatted2.name : 'Both cities have identical temperature';
    const humidityDiff = formatted1.humidity - formatted2.humidity;

    const verdict = `${formatted1.name} is ${Math.abs(tempDiff)}°C ${tempDiff > 0 ? 'warmer' : 'cooler'} than ${formatted2.name}. ` +
      (Math.abs(humidityDiff) > 10 ? `${humidityDiff > 0 ? formatted1.name : formatted2.name} is significantly more humid.` : 'Humidity is comparable in both locations.');

    return res.status(200).json({
      success: true,
      data: {
        city1: formatted1,
        city2: formatted2,
        metrics: {
          temp_diff: Math.abs(tempDiff),
          warmer_city: warmerCity,
          humidity_diff: humidityDiff,
          verdict,
        },
      },
    });
  } catch (err) {
    if (err.response && err.response.status === 404) {
      return res.status(404).json({
        success: false,
        message: 'One or both cities could not be found for comparison',
      });
    }
    return next(err);
  }
};
