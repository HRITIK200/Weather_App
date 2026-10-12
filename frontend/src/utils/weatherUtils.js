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

/**
 * Deep atmospheric multi-tone background gradients (replaces plain blue with rich celestial & meteorological tones)
 */
export const getWeatherBackground = (mainCondition = '', isDay = true) => {
  const cond = (mainCondition || '').toLowerCase();

  if (cond.includes('clear')) {
    return isDay
      ? 'from-[#0b162c] via-[#1c1836] to-[#2e192c]' // Deep sapphire twilight into warm solar plum & amber undertone
      : 'from-[#040711] via-[#090d1f] to-[#110c1c]'; // Midnight starry obsidian with violet nebula
  }
  if (cond.includes('cloud')) {
    return isDay
      ? 'from-[#0e1628] via-[#1d1d30] to-[#181824]' // Atmospheric warm charcoal & graphite twilight
      : 'from-[#030611] via-[#090e1d] to-[#0c0a17]'; // Deep velvet overcast obsidian
  }
  if (cond.includes('rain') || cond.includes('drizzle')) {
    return 'from-[#061827] via-[#0c2838] to-[#071622]'; // Oceanic deep storm with emerald-teal depths
  }
  if (cond.includes('thunder')) {
    return 'from-[#17082e] via-[#2d0d46] to-[#0f0420]'; // Electric amethyst, royal violet & dark nebula
  }
  if (cond.includes('snow')) {
    return 'from-[#0a1829] via-[#13253d] to-[#0c1724]'; // Crisp arctic slate & glacial cyan obsidian
  }
  if (cond.includes('mist') || cond.includes('fog') || cond.includes('haze')) {
    return 'from-[#091b22] via-[#122a2f] to-[#081519]'; // Sage moss obsidian, eucalyptus & misty dusk pearl
  }

  return isDay
    ? 'from-[#0c152a] via-[#1a1833] to-[#24172a]'
    : 'from-[#050814] via-[#0a0f22] to-[#100c1e]';
};

/**
 * Multi-tone ambient light accents for cards based on condition
 */
export const getConditionAccents = (mainCondition = '', isDay = true) => {
  const cond = (mainCondition || '').toLowerCase();

  if (cond.includes('clear')) {
    return {
      glow1: isDay ? 'bg-amber-500/25' : 'bg-indigo-500/25', // Warm solar gold or stellar violet
      glow2: isDay ? 'bg-orange-500/20' : 'bg-purple-600/20',
      badgeBorder: 'border-amber-400/40 text-amber-300 bg-amber-500/10',
      heroGrad: isDay
        ? 'from-amber-200 via-orange-100 to-amber-400'
        : 'from-purple-200 via-indigo-100 to-amber-200',
    };
  }
  if (cond.includes('rain') || cond.includes('drizzle')) {
    return {
      glow1: 'bg-teal-500/25',
      glow2: 'bg-cyan-500/20',
      badgeBorder: 'border-teal-400/40 text-teal-300 bg-teal-500/10',
      heroGrad: 'from-white via-teal-100 to-cyan-300',
    };
  }
  if (cond.includes('thunder')) {
    return {
      glow1: 'bg-purple-600/35',
      glow2: 'bg-rose-500/25',
      badgeBorder: 'border-purple-400/40 text-purple-300 bg-purple-500/10',
      heroGrad: 'from-purple-200 via-white to-rose-300',
    };
  }
  if (cond.includes('snow')) {
    return {
      glow1: 'bg-sky-400/25',
      glow2: 'bg-indigo-400/20',
      badgeBorder: 'border-sky-400/40 text-sky-300 bg-sky-500/10',
      heroGrad: 'from-sky-100 via-white to-indigo-200',
    };
  }
  if (cond.includes('cloud')) {
    return {
      glow1: 'bg-amber-500/15',
      glow2: 'bg-indigo-500/20',
      badgeBorder: 'border-slate-400/40 text-slate-300 bg-slate-500/10',
      heroGrad: 'from-white via-amber-100 to-slate-200',
    };
  }

  return {
    glow1: 'bg-emerald-500/20',
    glow2: 'bg-amber-500/20',
    badgeBorder: 'border-emerald-400/40 text-emerald-300 bg-emerald-500/10',
    heroGrad: 'from-white via-slate-100 to-emerald-200',
  };
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
