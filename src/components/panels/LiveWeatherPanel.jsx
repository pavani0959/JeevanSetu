/**
 * LiveWeatherPanel.jsx
 *
 * Displays live weather data from Open-Meteo API for Chamoli, Uttarakhand.
 * Shows a clear "LIVE DATA" badge when connected, or "CACHED" when offline.
 * This is the key differentiator — real data from a real Himalayan location.
 */

import { useLiveWeather } from '../../hooks/useLiveWeather';

// WMO weather interpretation codes → icon + description
function weatherDescription(code) {
  if (code === 0)              return { icon: '☀️', text: 'Clear sky' };
  if (code <= 3)               return { icon: '⛅', text: 'Partly cloudy' };
  if (code <= 9)               return { icon: '🌫️', text: 'Foggy' };
  if (code <= 19)              return { icon: '🌦️', text: 'Light drizzle' };
  if (code <= 29)              return { icon: '🌧️', text: 'Rain showers' };
  if (code <= 39)              return { icon: '🌨️', text: 'Snow / sleet' };
  if (code <= 49)              return { icon: '🌫️', text: 'Fog / icing' };
  if (code <= 59)              return { icon: '🌦️', text: 'Drizzle' };
  if (code <= 69)              return { icon: '🌧️', text: 'Moderate rain' };
  if (code <= 79)              return { icon: '❄️', text: 'Snowfall' };
  if (code <= 84)              return { icon: '🌧️', text: 'Rain showers' };
  if (code <= 94)              return { icon: '⛈️', text: 'Thunderstorm' };
  return                              { icon: '⛈️', text: 'Heavy thunderstorm' };
}

export default function LiveWeatherPanel() {
  const { weather, isLoading, lastFetchTime, refetch } = useLiveWeather();

  if (isLoading && !weather) {
    return (
      <div style={{ padding: 16, textAlign: 'center', fontSize: 12, color: 'var(--color-muted-bright)' }}>
        🌐 Fetching live weather from Open-Meteo…
      </div>
    );
  }

  if (!weather) {
    return (
      <div style={{ padding: 12, fontSize: 11, color: '#fbbf24' }}>
        ⚠️ Weather unavailable. Start backend: <code>uvicorn main:app --port 8000</code>
      </div>
    );
  }

  const wx   = weatherDescription(weather.weather_code);
  const live = weather.is_live;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>

      {/* ── Header: Location + Live badge ───────────────────────── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--color-text)' }}>
            📍 Chamoli, Uttarakhand
          </div>
          <div style={{ fontSize: 9.5, color: 'var(--color-muted-bright)', marginTop: 2 }}>
            Himalayan Hilly Region Reference Point
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 }}>
          <span style={{
            padding: '2px 8px', borderRadius: 20, fontSize: 9,
            fontWeight: 800, letterSpacing: '0.08em',
            background: live ? 'rgba(34,197,94,0.15)' : 'rgba(234,179,8,0.15)',
            color: live ? '#22c55e' : '#fbbf24',
            border: `1px solid ${live ? 'rgba(34,197,94,0.3)' : 'rgba(234,179,8,0.3)'}`,
          }}>
            {live ? '🟢 LIVE DATA' : '🟡 CACHED'}
          </span>
          {lastFetchTime && (
            <span style={{ fontSize: 9, color: 'var(--color-muted-bright)' }}>
              Updated: {lastFetchTime}
            </span>
          )}
        </div>
      </div>

      {/* ── Weather icon + condition ─────────────────────────────── */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 12,
        padding: '8px 12px',
        background: 'rgba(255,255,255,0.03)',
        borderRadius: 8,
        border: '1px solid rgba(255,255,255,0.06)',
      }}>
        <span style={{ fontSize: 28 }}>{wx.icon}</span>
        <div>
          <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-text)' }}>{wx.text}</div>
          <div style={{ fontSize: 10, color: 'var(--color-muted-bright)', marginTop: 2 }}>
            WMO Code: {weather.weather_code}
          </div>
        </div>
        <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
          <div style={{ fontSize: 22, fontWeight: 900, color: '#60a5fa' }}>
            {weather.temperature_c.toFixed(1)}°C
          </div>
        </div>
      </div>

      {/* ── Live weather grid ────────────────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
        <WeatherStat
          icon="🌧️"
          label="Rainfall"
          value={`${weather.rainfall_mm_hr} mm/hr`}
          color="#60a5fa"
          highlight={weather.rainfall_mm_hr > 30}
        />
        <WeatherStat
          icon="💧"
          label="Humidity"
          value={`${weather.humidity_pct.toFixed(0)}%`}
          color="#38bdf8"
        />
        <WeatherStat
          icon="💨"
          label="Wind Speed"
          value={`${weather.wind_speed_kmh.toFixed(1)} km/h`}
          color="#a78bfa"
        />
        <WeatherStat
          icon="🌡️"
          label="Temperature"
          value={`${weather.temperature_c.toFixed(1)}°C`}
          color="#fb923c"
        />
      </div>

      {/* ── Source attribution ───────────────────────────────────── */}
      <div style={{
        fontSize: 9, color: 'var(--color-muted-bright)',
        borderTop: '1px solid rgba(255,255,255,0.05)',
        paddingTop: 6,
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      }}>
        <span>Source: Open-Meteo API (open-meteo.com)</span>
        <button
          onClick={refetch}
          style={{
            background: 'none', border: '1px solid rgba(255,255,255,0.1)',
            color: 'var(--color-muted-bright)', cursor: 'pointer',
            fontSize: 9, borderRadius: 4, padding: '2px 6px',
          }}
        >
          ↻ Refresh
        </button>
      </div>
    </div>
  );
}

function WeatherStat({ icon, label, value, color, highlight }) {
  return (
    <div style={{
      background: highlight ? `${color}12` : 'rgba(255,255,255,0.02)',
      border: `1px solid ${highlight ? color + '30' : 'rgba(255,255,255,0.06)'}`,
      borderRadius: 7,
      padding: '7px 10px',
    }}>
      <div style={{ fontSize: 9.5, color: 'var(--color-muted-bright)', marginBottom: 2 }}>
        {icon} {label}
      </div>
      <div style={{ fontSize: 13, fontWeight: 800, color: highlight ? color : 'var(--color-text)' }}>
        {value}
      </div>
    </div>
  );
}
