/**
 * Utility functions for formatting weather data and dynamic styling
 */

export const toFahrenheit = (celsius) => Math.round((celsius * 9) / 5 + 32);

export const formatTemperature = (celsius, unit = 'C') => {
  if (celsius === undefined || celsius === null) return '--°';
  return unit === 'F' ? `${toFahrenheit(celsius)}°F` : `${celsius}°C`;
};

export const getCompassDirection = (deg) => {
  if (deg === undefined || deg === null) return 'N';
  const val = Math.floor(deg / 22.5 + 0.5);
  const directions = [
    'N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE',
    'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW',
  ];
  return directions[val % 16];
};

export const getWeatherBackground = (mainCondition = '', isDay = true) => {
  const cond = mainCondition.toLowerCase();

  if (cond.includes('clear')) {
    return isDay
      ? 'from-blue-600 via-indigo-600 to-sky-500'
      : 'from-slate-950 via-indigo-950 to-blue-950';
  }
  if (cond.includes('cloud')) {
    return isDay
      ? 'from-slate-700 via-zinc-800 to-slate-900'
      : 'from-gray-950 via-slate-900 to-zinc-950';
  }
  if (cond.includes('rain') || cond.includes('drizzle')) {
    return 'from-cyan-900 via-blue-950 to-slate-950';
  }
  if (cond.includes('thunder')) {
    return 'from-purple-950 via-slate-950 to-neutral-950';
  }
  if (cond.includes('snow')) {
    return 'from-sky-900 via-indigo-950 to-slate-900';
  }
  if (cond.includes('mist') || cond.includes('fog') || cond.includes('haze')) {
    return 'from-emerald-950 via-teal-950 to-slate-950';
  }

  return 'from-weather-dark via-weather-navy to-[#0D1B2A]';
};

export const getConditionEmoji = (mainCondition = '') => {
  const cond = mainCondition.toLowerCase();
  if (cond.includes('clear')) return '☀️';
  if (cond.includes('cloud')) return '☁️';
  if (cond.includes('rain')) return '🌧️';
  if (cond.includes('drizzle')) return '🌦️';
  if (cond.includes('thunder')) return '⛈️';
  if (cond.includes('snow')) return '❄️';
  if (cond.includes('mist') || cond.includes('fog')) return '🌫️';
  return '🌤️';
};
