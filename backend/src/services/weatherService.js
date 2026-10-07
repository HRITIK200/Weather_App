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
