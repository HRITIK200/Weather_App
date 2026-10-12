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
 * Deep atmospheric multi-tone background gradients (replaces plain blue with rich cosmic/meteorological tones)
 */
export const getWeatherBackground = (mainCondition = '', isDay = true) => {
  const cond = mainCondition.toLowerCase();

  if (cond.includes('clear')) {
    return isDay
      ? 'from-[#0b1329] via-[#141b38] to-[#1a1c38]' // Deep twilight with warm solar amber undertone
      : 'from-[#05070e] via-[#090e1f] to-[#0a0c16]'; // Midnight starry obsidian
  }
  if (cond.includes('cloud')) {
    return isDay
      ? 'from-[#0f172a] via-[#1e293b] to-[#111827]' // Atmospheric charcoal & graphite
      : 'from-[#030712] via-[#0b1120] to-[#020617]'; // Deep velvet overcast
  }
  if (cond.includes('rain') || cond.includes('drizzle')) {
    return 'from-[#071326] via-[#0c1f38] to-[#051020]'; // Oceanic storm with teal depths
  }
  if (cond.includes('thunder')) {
    return 'from-[#17072b] via-[#260c3f] to-[#0b0318]'; // Electric amethyst & dark nebula
  }
  if (cond.includes('snow')) {
    return 'from-[#0c1b2c] via-[#13273e] to-[#08121e]'; // Crisp arctic slate
  }
  if (cond.includes('mist') || cond.includes('fog') || cond.includes('haze')) {
    return 'from-[#07191e] via-[#0d282e] to-[#041014]'; // Eucalyptus teal & sage obsidian
  }

  return 'from-[#090e1a] via-[#111827] to-[#070b14]';
};

/**
 * Multi-tone ambient light accents for cards based on condition
 */
export const getConditionAccents = (mainCondition = '', isDay = true) => {
  const cond = mainCondition.toLowerCase();

  if (cond.includes('clear')) {
    return {
      glow1: 'bg-amber-500/25', // Warm solar gold
      glow2: 'bg-orange-500/20',
      badgeBorder: 'border-amber-400/40 text-amber-300 bg-amber-500/10',
      heroGrad: 'from-amber-200 via-white to-amber-100',
    };
  }
  if (cond.includes('rain') || cond.includes('drizzle')) {
    return {
      glow1: 'bg-cyan-500/25',
      glow2: 'bg-teal-500/20',
      badgeBorder: 'border-cyan-400/40 text-cyan-300 bg-cyan-500/10',
      heroGrad: 'from-white via-cyan-100 to-sky-200',
    };
  }
  if (cond.includes('thunder')) {
    return {
      glow1: 'bg-purple-600/30',
      glow2: 'bg-rose-500/25',
      badgeBorder: 'border-purple-400/40 text-purple-300 bg-purple-500/10',
      heroGrad: 'from-purple-200 via-white to-rose-200',
    };
  }
  if (cond.includes('snow')) {
    return {
      glow1: 'bg-sky-400/25',
      glow2: 'bg-indigo-400/20',
      badgeBorder: 'border-sky-400/40 text-sky-300 bg-sky-500/10',
      heroGrad: 'from-sky-100 via-white to-indigo-100',
    };
  }
  if (cond.includes('cloud')) {
    return {
      glow1: 'bg-slate-500/25',
      glow2: 'bg-indigo-500/20',
      badgeBorder: 'border-slate-400/40 text-slate-300 bg-slate-500/10',
      heroGrad: 'from-white via-slate-200 to-slate-300',
    };
  }

  return {
    glow1: 'bg-emerald-500/20',
    glow2: 'bg-cyan-500/20',
    badgeBorder: 'border-emerald-400/40 text-emerald-300 bg-emerald-500/10',
    heroGrad: 'from-white via-slate-100 to-emerald-100',
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
