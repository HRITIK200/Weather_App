/**
 * AI & Heuristic Weather Insight, Activity Planning, and Environmental Safety Service
 */

export const parseAirQuality = (pollutionRaw) => {
  if (!pollutionRaw || !pollutionRaw.list || pollutionRaw.list.length === 0) {
    return null;
  }

  const { main, components } = pollutionRaw.list[0];
  const aqiIndex = main.aqi; // 1 to 5

  const aqiMap = {
    1: {
      label: 'Good',
      color: 'emerald',
      status: 'Clean Air',
      description: 'Air quality is satisfactory with little or no risk.',
      healthAdvice: 'Ideal for all outdoor activities and open-window ventilation.',
    },
    2: {
      label: 'Fair',
      color: 'blue',
      status: 'Acceptable',
      description: 'Air quality is acceptable for most people.',
      healthAdvice: 'Sensitive individuals should monitor prolonged heavy exertion.',
    },
    3: {
      label: 'Moderate',
      color: 'amber',
      status: 'Mild Hazard',
      description: 'Air quality is acceptable, but may affect unusually sensitive individuals.',
      healthAdvice: 'People with asthma or respiratory allergies should take pauses outdoors.',
    },
    4: {
      label: 'Poor',
      color: 'orange',
      status: 'Unhealthy',
      description: 'Members of sensitive groups may experience health effects.',
      healthAdvice: 'Wear an N95 mask outdoors. Run air purifiers indoors.',
    },
    5: {
      label: 'Very Poor',
      color: 'rose',
      status: 'Hazardous',
      description: 'Health alert: The risk of health effects is increased for everyone.',
      healthAdvice: 'Avoid outdoor exercise. Keep windows closed and utilize HEPA purifiers.',
    },
  };

  const info = aqiMap[aqiIndex] || aqiMap[3];

  return {
    index: aqiIndex,
    label: info.label,
    color: info.color,
    status: info.status,
    description: info.description,
    healthAdvice: info.healthAdvice,
    components: {
      pm2_5: Math.round(components.pm2_5 * 10) / 10,
      pm10: Math.round(components.pm10 * 10) / 10,
      no2: Math.round(components.no2 * 10) / 10,
      so2: Math.round(components.so2 * 10) / 10,
      o3: Math.round(components.o3 * 10) / 10,
      co: Math.round(components.co * 10) / 10,
    },
  };
};

export const detectSevereWeatherAlerts = (weather, aqi) => {
  const alerts = [];
  const { temp, wind_speed, visibility, main, description } = weather;
  const cond = (main || '').toLowerCase();

  // 1. Extreme Heatwave Warning
  if (temp >= 40) {
    alerts.push({
      id: 'heatwave-severe',
      severity: 'danger',
      title: '🚨 Severe Heatwave Advisory',
      message: `Extreme temperature of ${temp}°C detected. Risk of heatstroke is high. Avoid direct sunlight between 11 AM and 4 PM and maintain hydration.`,
    });
  } else if (temp >= 36) {
    alerts.push({
      id: 'heatwave-moderate',
      severity: 'warning',
      title: '☀️ High Heat Index',
      message: `Temperatures reaching ${temp}°C. Wear light breathable fabrics and carry water.`,
    });
  }

  // 2. Severe Thunderstorm & Lightning Warning
  if (cond.includes('thunder')) {
    alerts.push({
      id: 'storm-warning',
      severity: 'danger',
      title: '⛈️ Active Thunderstorm Warning',
      message: 'Lightning strikes and sudden gale-force wind gusts possible. Seek secure shelter and avoid open fields.',
    });
  }

  // 3. Heavy Rain & Waterlogging Advisory
  if (cond.includes('rain') && description.includes('heavy')) {
    alerts.push({
      id: 'heavy-rain',
      severity: 'warning',
      title: '🌧️ Heavy Rainfall & Waterlogging Alert',
      message: 'Intense precipitation underway. Low-lying areas and urban roads may experience waterlogging.',
    });
  }

  // 4. High Wind Warning
  if (wind_speed >= 40) {
    alerts.push({
      id: 'high-wind',
      severity: 'warning',
      title: '💨 High Wind Advisory',
      message: `Wind gusts exceeding ${wind_speed} km/h. Drive carefully and watch for falling tree branches or debris.`,
    });
  }

  // 5. Dense Fog / Smog Alert
  if (visibility <= 2 || cond.includes('fog')) {
    alerts.push({
      id: 'dense-fog',
      severity: 'warning',
      title: '🌫️ Dense Fog / Low Visibility Warning',
      message: `Visibility reduced to ${visibility} km. Turn on low-beam headlights and reduce vehicle speeds.`,
    });
  }

  // 6. Hazardous AQI Alert
  if (aqi && aqi.index >= 4) {
    alerts.push({
      id: 'aqi-hazard',
      severity: aqi.index === 5 ? 'danger' : 'warning',
      title: `⚠️ ${aqi.label} Air Quality Alert (AQI ${aqi.index})`,
      message: `${aqi.healthAdvice} (PM2.5: ${aqi.components.pm2_5} µg/m³).`,
    });
  }

  return alerts;
};

export const calculateActivityPlanner = (currentData, aqiData) => {
  const { temp, wind_speed, humidity, main, description } = currentData;
  const cond = (main || '').toLowerCase();
  const aqiIndex = aqiData ? aqiData.index : 2;

  // 1. Fitness / Running (Jogging, Marathons, Cardio)
  let fitnessScore = 90;
  let fitnessAdvice = 'Excellent conditions for morning running or cardio.';
  if (temp > 35 || temp < 3) fitnessScore -= 35;
  if (cond.includes('rain')) fitnessScore -= 40;
  if (cond.includes('thunder')) fitnessScore = 15;
  if (aqiIndex >= 4) {
    fitnessScore = Math.min(fitnessScore, 25);
    fitnessAdvice = 'High particulate pollution. Heavy cardiovascular exercise should be moved indoors.';
  } else if (temp > 34) {
    fitnessAdvice = 'High temperature. Schedule runs before 7:30 AM or after sunset to avoid heat exhaustion.';
  }

  // 2. Outdoor Sports / Cricket / Football
  let sportsScore = 85;
  let sportsAdvice = 'Great pitch and field conditions for cricket and football.';
  if (cond.includes('rain') || cond.includes('drizzle')) {
    sportsScore = 20;
    sportsAdvice = 'Wet outfield and rain interruptions likely. Play may be suspended.';
  } else if (cond.includes('thunder')) {
    sportsScore = 10;
    sportsAdvice = 'Lightning hazard! Cancel outdoor matches immediately.';
  } else if (temp > 38) {
    sportsScore = 40;
    sportsAdvice = 'Excessive midday heat. Ensure mandatory hydration breaks every 20 overs/minutes.';
  }

  // 3. Highway Driving & Commute
  let commuteScore = 95;
  let commuteAdvice = 'Dry highways and normal commute travel times expected.';
  if (cond.includes('rain')) {
    commuteScore = 60;
    commuteAdvice = 'Wet roads and slower traffic flow. Keep extra braking distance.';
  }
  if (currentData.visibility <= 3) {
    commuteScore = 45;
    commuteAdvice = 'Reduced visibility on expressways. Use fog lamps and maintain safe spacing.';
  }
  if (wind_speed >= 40) {
    commuteScore = 55;
    commuteAdvice = 'Strong crosswinds detected on open flyovers and elevated expressways.';
  }

  // 4. Sightseeing & Tourism
  let tourismScore = 88;
  let tourismAdvice = 'Pleasant weather for exploring local landmarks, parks, and monuments.';
  if (cond.includes('rain')) {
    tourismScore = 50;
    tourismAdvice = 'Carry umbrellas and plan visits to indoor museums or galleries.';
  } else if (temp > 37) {
    tourismScore = 45;
    tourismAdvice = 'Avoid open monuments between 12 PM - 3:30 PM. Opt for air-conditioned venues.';
  }

  return [
    {
      id: 'fitness',
      title: 'Running & Fitness',
      icon: '🏃',
      score: Math.max(10, Math.min(100, fitnessScore)),
      bestWindow: '6:00 AM – 8:30 AM',
      cautionWindow: '12:00 PM – 4:00 PM',
      advice: fitnessAdvice,
    },
    {
      id: 'sports',
      title: 'Cricket & Sports',
      icon: '🏏',
      score: Math.max(10, Math.min(100, sportsScore)),
      bestWindow: '4:30 PM – 7:00 PM',
      cautionWindow: '1:00 PM – 3:30 PM',
      advice: sportsAdvice,
    },
    {
      id: 'commute',
      title: 'Road Commute',
      icon: '🚗',
      score: Math.max(10, Math.min(100, commuteScore)),
      bestWindow: 'Normal Schedule',
      cautionWindow: cond.includes('rain') ? 'Peak Rush Hour' : 'None',
      advice: commuteAdvice,
    },
    {
      id: 'tourism',
      title: 'Sightseeing & Parks',
      icon: '📸',
      score: Math.max(10, Math.min(100, tourismScore)),
      bestWindow: '9:00 AM – 11:30 AM',
      cautionWindow: 'Midday Sun (12 PM – 3 PM)',
      advice: tourismAdvice,
    },
  ];
};

export const generateWeatherInsight = (currentData, aqiData) => {
  const { temp, feels_like, main, description, wind_speed, humidity } = currentData;
  const condition = (main || '').toLowerCase();

  // 1. Natural Language Summary
  let summary = `Currently ${temp}°C in ${currentData.name} with ${description}.`;
  if (condition.includes('rain') || condition.includes('drizzle')) {
    summary = `Rainy conditions detected in ${currentData.name}. Roads may be slick, and intermittent showers are expected.`;
  } else if (condition.includes('clear')) {
    summary = `Clear skies and bright sunshine over ${currentData.name}. Great conditions for daytime plans.`;
  } else if (condition.includes('cloud')) {
    summary = `Overcast skies with mild temperatures across ${currentData.name}. Consistent weather throughout the day.`;
  } else if (condition.includes('thunder')) {
    summary = `Thunderstorm warning active for ${currentData.name}. Lightning and heavy downpours likely.`;
  } else if (condition.includes('snow')) {
    summary = `Snowfall underway in ${currentData.name}. Expect reduced visibility and icy surfaces.`;
  }

  // 2. Smart Clothing Recommendation
  let clothing = [];
  if (temp < 10) {
    clothing.push('Heavy insulated winter coat', 'Woolen scarf & gloves', 'Thermal innerwear');
  } else if (temp < 18) {
    clothing.push('Warm hoodie or fleece jacket', 'Full-length jeans/trousers', 'Comfortable sneakers');
  } else if (temp < 25) {
    clothing.push('Light cotton shirt or polo', 'Denim jeans or chinos', 'Casual light layer');
  } else {
    clothing.push('Breathable light cotton t-shirt', 'Sunglasses & UV protection', 'Shorts or linen wear');
  }

  if (condition.includes('rain') || condition.includes('drizzle') || condition.includes('thunder')) {
    clothing.push('Waterproof raincoat / Compact umbrella ☔');
  }
  if (wind_speed > 25) {
    clothing.push('Windbreaker / tight-fit jacket 💨');
  }
  if (aqiData && aqiData.index >= 4) {
    clothing.push('Protective N95 pollution mask 😷');
  }

  // 3. Activity Suitability Planner
  const activities = calculateActivityPlanner(currentData, aqiData);

  return {
    summary,
    clothingTips: clothing,
    comfortLevel: humidity > 75 && temp > 28 ? 'Muggy & Humid' : humidity < 30 ? 'Dry Air' : 'Optimal Comfort',
    activities,
  };
};
