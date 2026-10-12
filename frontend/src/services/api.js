import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  timeout: 10000,
});

export const searchLocations = async (query) => {
  if (!query || query.trim().length < 2) return [];
  const res = await api.get('/weather/search-locations', { params: { q: query.trim() } });
  return res.data.data;
};

export const fetchWeatherByCity = async (city) => {
  const res = await api.get('/weather', { params: { city } });
  return res.data.data;
};

export const fetchWeatherByCoords = async (lat, lon, extra = {}) => {
  const res = await api.get('/weather/coordinates', {
    params: {
      lat,
      lon,
      customName: extra.customName,
      subtitle: extra.subtitle,
      areaType: extra.areaType,
      postcode: extra.postcode,
    },
  });
  return res.data.data;
};

export const fetchForecast = async (cityOrParams) => {
  const params = typeof cityOrParams === 'object' ? cityOrParams : { city: cityOrParams };
  const res = await api.get('/weather/forecast', { params });
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
