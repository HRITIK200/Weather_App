import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  timeout: 10000,
});

export const fetchWeatherByCity = async (city) => {
  const res = await api.get('/weather', { params: { city } });
  return res.data.data;
};

export const fetchWeatherByCoords = async (lat, lon) => {
  const res = await api.get('/weather/coordinates', { params: { lat, lon } });
  return res.data.data;
};

export const fetchForecast = async (city) => {
  const res = await api.get('/weather/forecast', { params: { city } });
  return res.data.data;
};

export const compareCities = async (city1, city2) => {
  const res = await api.get('/weather/compare', { params: { city1, city2 } });
  return res.data.data;
};

export const fetchHistory = async () => {
  const res = await api.get('/history');
  return res.data.data;
};

export const removeHistoryItem = async (id) => {
  const res = await api.delete(`/history/${id}`);
  return res.data;
};

export const fetchFavorites = async (region) => {
  const res = await api.get('/favorites', { params: { region } });
  return res.data.data;
};

export const fetchIndianStatesList = async () => {
  const res = await api.get('/favorites/indian-states');
  return res.data.data;
};

export const addFavoriteCity = async (data) => {
  const res = await api.post('/favorites', data);
  return res.data.data;
};

export const removeFavoriteCity = async (id) => {
  const res = await api.delete(`/favorites/${id}`);
  return res.data;
};

export const checkSystemHealth = async () => {
  const res = await api.get('/health');
  return res.data;
};
