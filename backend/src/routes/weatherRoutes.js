import express from 'express';
import {
  getCurrentWeather,
  getWeatherByCoords,
  getWeatherForecast,
  compareCitiesWeather,
  searchLocationsHandler,
} from '../controllers/weatherController.js';

const router = express.Router();

router.get('/search-locations', searchLocationsHandler);
router.get('/', getCurrentWeather);
router.get('/coordinates', getWeatherByCoords);
router.get('/forecast', getWeatherForecast);
router.get('/compare', compareCitiesWeather);

export default router;
