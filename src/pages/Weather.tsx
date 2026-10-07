import { useState, useEffect } from 'react';
import {
  Search,
  Cloud,
  CloudRain,
  CloudSnow,
  CloudLightning,
  Sun,
  CloudSun,
  Wind,
  Droplets,
  Gauge,
  Eye,
  Sunrise,
  Sunset,
  MapPin,
  Loader2,
  AlertCircle,
  Navigation,
} from 'lucide-react';

interface WeatherData {
  resolvedAddress: string;
  currentConditions: {
    temp: number;
    feelslike: number;
    humidity: number;
    windspeed: number;
    pressure: number;
    visibility: number;
    uvindex: number;
    conditions: string;
    icon: string;
    sunrise: string;
    sunset: string;
    tempmax: number;
    tempmin: number;
  };
  days: {
    datetime: string;
    tempmax: number;
    tempmin: number;
    conditions: string;
    icon: string;
  }[];
}

function getIcon(iconStr: string) {
  const map: Record<string, typeof Sun> = {
    'clear-day': Sun,
    'clear-night': Sun,
    'partly-cloudy-day': CloudSun,
    'partly-cloudy-night': CloudSun,
    cloudy: Cloud,
    rain: CloudRain,
    snow: CloudSnow,
    thunderstorm: CloudLightning,
    fog: Cloud,
    wind: Wind,
  };
  return map[iconStr] ?? Cloud;
}

function getGradient(iconStr: string): string {
  if (iconStr.includes('clear')) return 'from-amber-400 via-orange-400 to-rose-500';
  if (iconStr.includes('rain')) return 'from-slate-600 via-slate-700 to-slate-800';
  if (iconStr.includes('snow')) return 'from-sky-300 via-sky-400 to-blue-500';
  if (iconStr.includes('thunderstorm')) return 'from-slate-700 via-slate-800 to-slate-900';
  if (iconStr.includes('cloudy') || iconStr.includes('partly-cloudy'))
    return 'from-sky-400 via-sky-500 to-slate-600';
  return 'from-sky-400 to-sky-600';
}

const POPULAR_CITIES = ['London', 'New York', 'Tokyo', 'Paris', 'Sydney', 'Dubai', 'Mumbai', 'Rio de Janeiro'];

export function Weather() {
  const [query, setQuery] = useState('London');
  const [data, setData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [unit, setUnit] = useState<'C' | 'F'>('C');

  async function fetchWeather(city: string) {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(
        `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${encodeURIComponent(
          city
        )}?unitGroup=metric&key=4VY9EHPVUH3S8DH9B3VJ2XKQH&include=current,days&contentType=json`
      );
      if (!res.ok) throw new Error('City not found');
      const json = await res.json();
      setData(json);
    } catch {
      setError('Could not fetch weather. Please try another city name.');
      setData(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchWeather('London');
  }, []);

  function toF(c: number) {
    return Math.round(c * 9 / 5 + 32);
  }

  function displayTemp(c: number) {
    return unit === 'C' ? Math.round(c) : toF(c);
  }

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (query.trim()) fetchWeather(query.trim());
  }

  const cur = data?.currentConditions;
  const Icon = cur ? getIcon(cur.icon) : Cloud;

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Real-Time Weather</h2>
        <p className="text-slate-500 text-sm leading-relaxed max-w-2xl">
          Search any city to view live weather conditions including temperature, humidity,
          wind, pressure, visibility, and a 7-day forecast.
        </p>
      </div>

      {/* Search */}
      <form onSubmit={handleSearch} className="mb-6">
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Enter city name (e.g. London, Tokyo, New York)"
              className="input-field pl-10"
            />
          </div>
          <button type="submit" className="btn-primary flex items-center gap-2">
            <Navigation className="w-4 h-4" /> Search
          </button>
        </div>
        <div className="flex gap-2 mt-3 flex-wrap">
          {POPULAR_CITIES.map((c) => (
            <button
              key={c}
              onClick={() => {
                setQuery(c);
                fetchWeather(c);
              }}
              className="text-xs px-3 py-1 rounded-full bg-white border border-slate-200 text-slate-500 hover:border-slate-300 hover:text-slate-700 transition-colors"
            >
              {c}
            </button>
          ))}
        </div>
      </form>

      {loading && (
        <div className="card p-16 flex flex-col items-center justify-center">
          <Loader2 className="w-8 h-8 text-slate-300 animate-spin mb-3" />
          <p className="text-slate-400 text-sm">Fetching live weather data...</p>
        </div>
      )}

      {error && !loading && (
        <div className="card p-12 flex flex-col items-center justify-center text-center">
          <div className="w-14 h-14 rounded-2xl bg-rose-50 flex items-center justify-center mb-4">
            <AlertCircle className="w-7 h-7 text-rose-400" />
          </div>
          <p className="text-slate-500 text-sm mb-1">{error}</p>
          <p className="text-slate-400 text-xs">Check the city name and try again.</p>
        </div>
      )}

      {data && cur && !loading && (
        <div className="space-y-6 animate-fade-in">
          {/* Main weather card */}
          <div
            className={`rounded-3xl bg-gradient-to-br ${getGradient(cur.icon)} p-8 text-white shadow-xl overflow-hidden relative`}
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-24 -translate-x-24" />

            <div className="relative">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <MapPin className="w-4 h-4" />
                    <span className="text-sm font-medium opacity-90">
                      {data.resolvedAddress}
                    </span>
                  </div>
                  <p className="text-xs opacity-70">
                    {new Date().toLocaleDateString('en-US', {
                      weekday: 'long',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                </div>
                <div className="flex items-center gap-1 bg-white/20 rounded-lg p-0.5">
                  <button
                    onClick={() => setUnit('C')}
                    className={`px-3 py-1 rounded-md text-xs font-semibold transition-all ${
                      unit === 'C' ? 'bg-white text-slate-900' : 'text-white/80'
                    }`}
                  >
                    °C
                  </button>
                  <button
                    onClick={() => setUnit('F')}
                    className={`px-3 py-1 rounded-md text-xs font-semibold transition-all ${
                      unit === 'F' ? 'bg-white text-slate-900' : 'text-white/80'
                    }`}
                  >
                    °F
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-8 flex-wrap">
                <div className="flex items-center gap-4">
                  <Icon className="w-20 h-20" strokeWidth={1.5} />
                  <div>
                    <div className="text-6xl font-bold tracking-tighter">
                      {displayTemp(cur.temp)}°{unit}
                    </div>
                    <div className="text-lg font-medium opacity-90 mt-1">{cur.conditions}</div>
                  </div>
                </div>
                <div className="flex gap-6 flex-wrap">
                  <div>
                    <div className="text-xs opacity-70 mb-0.5">High</div>
                    <div className="text-xl font-semibold">{displayTemp(cur.tempmax)}°</div>
                  </div>
                  <div>
                    <div className="text-xs opacity-70 mb-0.5">Low</div>
                    <div className="text-xl font-semibold">{displayTemp(cur.tempmin)}°</div>
                  </div>
                  <div>
                    <div className="text-xs opacity-70 mb-0.5">Feels Like</div>
                    <div className="text-xl font-semibold">{displayTemp(cur.feelslike)}°</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Metrics grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            <MetricCard icon={Droplets} label="Humidity" value={`${cur.humidity}%`} />
            <MetricCard icon={Wind} label="Wind" value={`${cur.windspeed} km/h`} />
            <MetricCard icon={Gauge} label="Pressure" value={`${cur.pressure} hPa`} />
            <MetricCard icon={Eye} label="Visibility" value={`${cur.visibility} km`} />
            <MetricCard icon={Sunrise} label="Sunrise" value={formatTime(cur.sunrise)} />
            <MetricCard icon={Sunset} label="Sunset" value={formatTime(cur.sunset)} />
          </div>

          {/* 7-day forecast */}
          <div className="card p-6">
            <h3 className="font-semibold text-slate-900 mb-4">7-Day Forecast</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
              {data.days.slice(0, 7).map((day, i) => {
                const DIcon = getIcon(day.icon);
                const date = new Date(day.datetime);
                return (
                  <div
                    key={i}
                    className="rounded-xl border border-slate-100 p-4 text-center hover:border-slate-200 transition-colors"
                  >
                    <div className="text-xs font-medium text-slate-400 mb-2">
                      {i === 0
                        ? 'Today'
                        : date.toLocaleDateString('en-US', { weekday: 'short' })}
                    </div>
                    <DIcon className="w-8 h-8 mx-auto text-slate-600 mb-2" strokeWidth={1.5} />
                    <div className="text-sm font-semibold text-slate-900">
                      {displayTemp(day.tempmax)}°
                    </div>
                    <div className="text-xs text-slate-400">{displayTemp(day.tempmin)}°</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function formatTime(s: string): string {
  if (!s) return '--';
  const [h, m] = s.split(':');
  const hour = parseInt(h);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const h12 = hour % 12 || 12;
  return `${h12}:${m} ${ampm}`;
}

function MetricCard({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Droplets;
  label: string;
  value: string;
}) {
  return (
    <div className="card p-4">
      <div className="flex items-center gap-2 mb-2">
        <Icon className="w-4 h-4 text-slate-400" />
        <span className="text-xs text-slate-500">{label}</span>
      </div>
      <div className="text-sm font-semibold text-slate-900">{value}</div>
    </div>
  );
}
