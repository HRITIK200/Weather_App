import React, { useState, useEffect, useRef } from 'react';
import {
  fetchWeatherByCity,
  fetchWeatherByCoords,
  fetchForecast,
  fetchHistory,
  removeHistoryItem,
  fetchFavorites,
  addFavoriteCity,
  removeFavoriteCity,
  checkSystemHealth,
  fetchIndianStatesList,
  detectPresentLocation,
} from './services/api';
import { Header } from './components/Header';
import { SearchBar } from './components/SearchBar';
import { FavoritesBar } from './components/FavoritesBar';
import { CurrentWeatherCard } from './components/CurrentWeatherCard';
import { AirQualityCard } from './components/AirQualityCard';
import { SmartInsightCard } from './components/SmartInsightCard';
import { ActivityPlannerCard } from './components/ActivityPlannerCard';
import { InteractiveChart } from './components/InteractiveChart';
import { HourlyForecast } from './components/HourlyForecast';
import { DailyForecast } from './components/DailyForecast';
import { WeatherMetricsGrid } from './components/WeatherMetricsGrid';
import { WeatherMapCard } from './components/WeatherMapCard';
import { WeatherAlertBanner } from './components/WeatherAlertBanner';
import { WeatherParticleCanvas } from './components/WeatherParticleCanvas';
import { IndianStatesDrawer } from './components/IndianStatesDrawer';
import { CityCompareModal } from './components/CityCompareModal';
import { DevTelemetryModal } from './components/DevTelemetryModal';
import { HistoryDrawer } from './components/HistoryDrawer';
import { LocationRefineModal } from './components/LocationRefineModal';
import { getWeatherBackground, formatTemperature } from './utils/weatherUtils';
import { AlertCircle, Loader2 } from 'lucide-react';

export default function App() {
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [indianCitiesList, setIndianCitiesList] = useState([]);
  const [history, setHistory] = useState([]);
  const [favoritesTab, setFavoritesTab] = useState('all');
  const [unit, setUnit] = useState(() => localStorage.getItem('weather_unit') || 'C');
  const [particlesEnabled, setParticlesEnabled] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isLocating, setIsLocating] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isIndianStatesOpen, setIsIndianStatesOpen] = useState(false);
  const [isCompareOpen, setIsCompareOpen] = useState(false);
  const [isTelemetryOpen, setIsTelemetryOpen] = useState(false);
  const [isLocationRefineOpen, setIsLocationRefineOpen] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [dbStatus, setDbStatus] = useState(false);
  const hasWeatherLoadedRef = useRef(false);

  // Sync temperature unit preference
  const handleToggleUnit = (newUnit) => {
    setUnit(newUnit);
    localStorage.setItem('weather_unit', newUnit);
  };

  // Load initial health, favorites, and Indian cities
  useEffect(() => {
    const initData = async () => {
      try {
        const health = await checkSystemHealth();
        setDbStatus(health.database?.connected || false);
      } catch (err) {
        console.warn('Backend health check skipped');
      }

      try {
        const [favs, hist, indianList] = await Promise.all([
          fetchFavorites(favoritesTab),
          fetchHistory(),
          fetchIndianStatesList(),
        ]);
        setFavorites(favs || []);
        setHistory(hist || []);
        setIndianCitiesList(indianList || []);
      } catch (err) {
        console.warn('Initial data load warning:', err);
      }
    };

    initData();
  }, []);

  // Reload favorites when tab changes
  useEffect(() => {
    const reloadFavs = async () => {
      try {
        const favs = await fetchFavorites(favoritesTab);
        setFavorites(favs || []);
      } catch (e) {}
    };
    reloadFavs();
  }, [favoritesTab]);

  // Initial Weather Load: Google Weather-style Instant High-Precision Geolocation
  useEffect(() => {
    let isCancelled = false;

    // 1. Instant Cache Check: If user previously visited and had verified coordinates, load them in 0ms!
    const cachedCoords = localStorage.getItem('last_known_coords') || localStorage.getItem('preferred_weather_location');
    if (cachedCoords) {
      try {
        const parsed = JSON.parse(cachedCoords);
        if (parsed.lat && parsed.lon) {
          loadWeatherByCoords(parsed.lat, parsed.lon, parsed);
        }
      } catch (e) {}
    }

    // 2. Query Device Hardware / Wi-Fi Geolocation with High Accuracy
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          if (isCancelled) return;
          const { latitude, longitude } = position.coords;
          // Store verified coordinates so future loads are instantaneous
          localStorage.setItem('last_known_coords', JSON.stringify({ lat: latitude, lon: longitude }));
          await loadWeatherByCoords(latitude, longitude);
        },
        async (geoErr) => {
          if (isCancelled) return;
          console.warn('Device GPS unavailable or permission blocked:', geoErr.message);

          // Only if no weather data is loaded yet, attempt IP location fallback
          if (!hasWeatherLoadedRef.current) {
            try {
              const detected = await detectPresentLocation();
              if (detected && detected.lat && detected.lon && !isCancelled) {
                await loadWeatherByCoords(detected.lat, detected.lon, {
                  customName: detected.city,
                  subtitle: [detected.region, detected.country].filter(Boolean).join(', '),
                  postcode: detected.postcode,
                  areaType: 'city',
                });
              }
            } catch (ipErr) {
              console.warn('IP fallback warning:', ipErr.message);
            }
          }
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        }
      );
    } else {
      // Browser does not support geolocation API
      if (!hasWeatherLoadedRef.current) {
        detectPresentLocation().then((detected) => {
          if (detected?.lat && detected?.lon && !isCancelled) {
            loadWeatherByCoords(detected.lat, detected.lon, {
              customName: detected.city,
              subtitle: [detected.region, detected.country].filter(Boolean).join(', '),
              postcode: detected.postcode,
              areaType: 'city',
            });
          }
        });
      }
    }

    return () => {
      isCancelled = true;
    };
  }, []);

  // Load weather & forecast by City
  const loadWeatherByCity = async (city) => {
    try {
      setLoading(true);
      setError(null);

      const [currentData, forecastData] = await Promise.all([
        fetchWeatherByCity(city),
        fetchForecast(city),
      ]);

      setWeather(currentData);
      setForecast(forecastData);
      hasWeatherLoadedRef.current = true;

      // Refresh search history list in background
      try {
        const updatedHistory = await fetchHistory();
        setHistory(updatedHistory || []);
      } catch (e) {}
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to load weather data. Please try another city.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  // Handle quick selection of exact location (e.g. Bijnor)
  const handleSelectQuickLocation = (loc) => {
    localStorage.setItem('preferred_weather_location', JSON.stringify({
      name: loc.name,
      displayName: loc.displayName || loc.name,
      subtitle: loc.subtitle,
      lat: loc.lat,
      lon: loc.lon,
      postcode: loc.postcode,
      areaType: loc.type || 'locality',
    }));
    loadWeatherByCoords(loc.lat, loc.lon, loc);
  };

  // Load weather by specific location / small area object
  const loadWeatherByLocation = async (location) => {
    try {
      setLoading(true);
      setError(null);

      // Save user selected location as preferred
      localStorage.setItem('preferred_weather_location', JSON.stringify({
        name: location.name,
        displayName: location.displayName || location.name,
        subtitle: location.subtitle,
        lat: location.lat,
        lon: location.lon,
        postcode: location.postcode,
        areaType: location.type || 'locality',
      }));

      const [currentData, forecastData] = await Promise.all([
        fetchWeatherByCoords(location.lat, location.lon, {
          customName: location.name,
          subtitle: location.subtitle,
          areaType: location.type,
          postcode: location.postcode,
        }),
        fetchForecast({ lat: location.lat, lon: location.lon }),
      ]);

      setWeather(currentData);
      setForecast(forecastData);
      hasWeatherLoadedRef.current = true;

      try {
        const updatedHistory = await fetchHistory();
        setHistory(updatedHistory || []);
      } catch (e) {}
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to load weather for this location.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  // Load weather by Coords (with optional locality metadata)
  const loadWeatherByCoords = async (lat, lon, extra = {}) => {
    try {
      setLoading(true);
      setError(null);

      const [currentData, forecastData] = await Promise.all([
        fetchWeatherByCoords(lat, lon, extra),
        fetchForecast({ lat, lon }),
      ]);

      setWeather(currentData);
      setForecast(forecastData);
      hasWeatherLoadedRef.current = true;

      try {
        const updatedHistory = await fetchHistory();
        setHistory(updatedHistory || []);
      } catch (e) {}
    } catch (err) {
      setError('Unable to fetch weather for your present location. Please use search to find your city.');
    } finally {
      setLoading(false);
      setIsLocating(false);
    }
  };

  // Handler for GPS trigger ("Locate Me" button)
  const handleLocateMe = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser.');
      return;
    }

    setIsLocating(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        loadWeatherByCoords(pos.coords.latitude, pos.coords.longitude);
      },
      async (err) => {
        console.warn('GPS prompt denied or unavailable, attempting auto-detection fallback:', err.message);
        try {
          const detected = await detectPresentLocation();
          if (detected && detected.lat && detected.lon) {
            await loadWeatherByCoords(detected.lat, detected.lon, {
              customName: detected.city,
              subtitle: [detected.region, detected.country].filter(Boolean).join(', '),
              postcode: detected.postcode,
              areaType: 'city',
            });
            setIsLocating(false);
            return;
          }
        } catch (e) {}

        setError('Location permission denied or unavailable. Please enable browser location permissions.');
        setIsLocating(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 9000,
        maximumAge: 0,
      }
    );
  };

  // Handler for Pinned Favorite toggle
  const handleToggleFavorite = async () => {
    if (!weather) return;

    const existing = favorites.find(
      (f) => f.city_name.toLowerCase() === weather.name.toLowerCase()
    );

    try {
      if (existing) {
        await removeFavoriteCity(existing.id);
        setFavorites((prev) => prev.filter((f) => f.id !== existing.id));
      } else {
        const created = await addFavoriteCity({
          city_name: weather.name,
          country: weather.country,
          region: weather.country === 'IN' ? 'india' : 'custom',
          lat: weather.coord?.lat,
          lon: weather.coord?.lon,
        });
        setFavorites((prev) => [...prev, created]);
      }
    } catch (err) {
      console.error('Error toggling favorite:', err);
    }
  };

  // Handler for Deleting search history item
  const handleDeleteHistoryItem = async (id) => {
    try {
      await removeHistoryItem(id);
      setHistory((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      console.error('Error deleting history item:', err);
    }
  };

  // Copy Weather Briefing to Clipboard
  const handleShareBriefing = () => {
    if (!weather) return;
    const aqiText = weather.aqi ? `AQI: ${weather.aqi.index} (${weather.aqi.label})` : '';
    const text = `🌤️ AeroCast Weather Briefing for ${weather.name}, ${weather.country}:\n` +
      `• Temp: ${formatTemperature(weather.temp, unit)} (Feels like: ${formatTemperature(weather.feels_like, unit)})\n` +
      `• Condition: ${weather.description}\n` +
      `• Wind: ${weather.wind_speed} km/h | Humidity: ${weather.humidity}%\n` +
      (aqiText ? `• ${aqiText}\n` : '') +
      `• Summary: ${weather.ai_insight?.summary || ''}`;

    navigator.clipboard.writeText(text);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2500);
  };

  const isCurrentFavorite = Boolean(
    weather &&
      favorites.some((f) => f.city_name.toLowerCase() === weather.name.toLowerCase())
  );

  const isDay = weather?.icon ? weather.icon.endsWith('d') : true;
  const backgroundGradient = getWeatherBackground(weather?.main || 'clear', isDay);

  return (
    <div
      className={`min-h-screen bg-gradient-to-br ${backgroundGradient} transition-colors duration-1000 py-3 sm:py-6 px-3 sm:px-6 lg:px-8 text-slate-100 font-sans relative overflow-x-hidden selection:bg-amber-500 selection:text-black`}
    >
      {/* Dynamic Multi-Tone Ambient Light Glows (Warm Amber, Radiant Violet, Celestial Emerald) */}
      <div className="fixed top-0 right-10 w-96 h-96 bg-amber-500/10 rounded-full blur-[140px] pointer-events-none -z-0" />
      <div className="fixed bottom-10 left-10 w-[28rem] h-[28rem] bg-violet-600/15 rounded-full blur-[150px] pointer-events-none -z-0" />
      <div className="fixed top-1/2 left-1/3 w-80 h-80 bg-teal-500/10 rounded-full blur-[130px] pointer-events-none -z-0" />

      {/* Ambient Particle Canvas FX (Rain / Snow / Dust) */}
      <WeatherParticleCanvas
        condition={weather?.main || 'clear'}
        isEnabled={particlesEnabled}
      />

      <div className="max-w-5xl mx-auto relative z-10">
        {/* Navigation / Header */}
        <Header
          unit={unit}
          onToggleUnit={handleToggleUnit}
          onOpenHistory={() => setIsHistoryOpen(true)}
          onOpenCompare={() => setIsCompareOpen(true)}
          onOpenTelemetry={() => setIsTelemetryOpen(true)}
          onToggleParticles={() => setParticlesEnabled(!particlesEnabled)}
          particlesEnabled={particlesEnabled}
          onShareBriefing={handleShareBriefing}
          isCopied={isCopied}
          dbStatus={dbStatus}
        />

        {/* Severe Weather & Air Quality Alert Banner */}
        {weather?.alerts && <WeatherAlertBanner alerts={weather.alerts} />}

        {/* Search Bar with Autocomplete, Small Area Geocoding & Corner Explorer */}
        <SearchBar
          onSearch={loadWeatherByCity}
          onSelectLocation={loadWeatherByLocation}
          onLocateMe={handleLocateMe}
          isLocating={isLocating}
          recentCities={history.map((h) => h.city_name)}
        />

        {/* Favorite Cities Bar with Indian States & Regional Filter */}
        <FavoritesBar
          favorites={favorites}
          currentCity={weather?.name}
          onSelectCity={loadWeatherByCity}
          onToggleFavorite={handleToggleFavorite}
          isFavorite={isCurrentFavorite}
          activeTab={favoritesTab}
          onSelectTab={setFavoritesTab}
          onOpenIndianStates={() => setIsIndianStatesOpen(true)}
        />

        {/* Error Alert Banner */}
        {error && (
          <div className="p-4 rounded-2xl bg-rose-500/20 border border-rose-500/40 text-rose-200 text-sm font-semibold flex items-center gap-3 mb-6 animate-in fade-in">
            <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Main Content Area */}
        {loading && !weather ? (
          <div className="flex flex-col items-center justify-center py-24 text-slate-400">
            <Loader2 className="w-10 h-10 animate-spin text-cyan-400 mb-3" />
            <p className="text-sm font-semibold">Gathering global atmospheric intelligence...</p>
          </div>
        ) : (
          weather && (
            <main className="space-y-6">
              {/* Current Weather Hero */}
              <CurrentWeatherCard
                weather={weather}
                unit={unit}
                onOpenLocationRefine={() => setIsLocationRefineOpen(true)}
                onSelectQuickLocation={handleSelectQuickLocation}
              />

              {/* 24-Hour Interactive Bezier Curve Chart */}
              {forecast?.hourly && (
                <InteractiveChart
                  hourly={forecast.hourly}
                  hourly1h={forecast.hourly_1h}
                  hourly3h={forecast.hourly_3h}
                  unit={unit}
                />
              )}

              {/* Air Quality Index (AQI) with Persona Guidance & Pollutants */}
              {weather.aqi && <AirQualityCard aqi={weather.aqi} />}

              {/* AI Weather Insights & Attire Advice */}
              {weather.ai_insight && (
                <SmartInsightCard insight={weather.ai_insight} />
              )}

              {/* AI Smart Activity & Sports Suitability Planner */}
              {weather.ai_insight?.activities && (
                <ActivityPlannerCard activities={weather.ai_insight.activities} />
              )}

              {/* 24-Hour / 1-Hour Forecast Carousel */}
              {forecast?.hourly && (
                <HourlyForecast
                  hourly={forecast.hourly}
                  hourly1h={forecast.hourly_1h}
                  hourly3h={forecast.hourly_3h}
                  weather={weather}
                  unit={unit}
                />
              )}

              {/* 5-Day Forecast with Apple-style Range Progress Bars */}
              {forecast?.daily && (
                <DailyForecast daily={forecast.daily} unit={unit} />
              )}

              {/* Detailed Meteorological Metrics Grid (6 cards) */}
              <WeatherMetricsGrid weather={weather} />

              {/* Geographical Radar & Location Map with Explorer */}
              <WeatherMapCard
                weather={weather}
                unit={unit}
                onSelectCoords={(lat, lon, label) =>
                  loadWeatherByLocation({
                    lat,
                    lon,
                    name: label || `Radar Point (${lat.toFixed(2)}, ${lon.toFixed(2)})`,
                    type: 'coordinate_radar',
                  })
                }
              />
            </main>
          )
        )}

        {/* Indian States & Metros Full Drawer */}
        <IndianStatesDrawer
          isOpen={isIndianStatesOpen}
          onClose={() => setIsIndianStatesOpen(false)}
          indianCities={indianCitiesList}
          onSelectCity={loadWeatherByCity}
        />

        {/* City vs City Weather Comparison Modal */}
        <CityCompareModal
          isOpen={isCompareOpen}
          onClose={() => setIsCompareOpen(false)}
          defaultCity1={weather?.name || 'Delhi'}
          unit={unit}
        />

        {/* Developer Telemetry & Architecture Diagnostics Modal */}
        <DevTelemetryModal
          isOpen={isTelemetryOpen}
          onClose={() => setIsTelemetryOpen(false)}
        />

        {/* Search History Slide-over Drawer */}
        <HistoryDrawer
          isOpen={isHistoryOpen}
          onClose={() => setIsHistoryOpen(false)}
          history={history}
          onSelectCity={loadWeatherByCity}
          onDeleteHistoryItem={handleDeleteHistoryItem}
          unit={unit}
        />

        {/* Exact Location Calibration & Refinement Modal */}
        <LocationRefineModal
          isOpen={isLocationRefineOpen}
          onClose={() => setIsLocationRefineOpen(false)}
          currentLocationName={weather?.displayName || weather?.name}
          onSelectLocation={handleSelectQuickLocation}
          onTriggerGPS={handleLocateMe}
          isLocating={isLocating}
        />
      </div>
    </div>
  );
}
