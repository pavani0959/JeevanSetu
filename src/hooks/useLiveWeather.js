/**
 * useLiveWeather.js — Fetches real weather data from Open-Meteo
 * via the JeevanSetu backend proxy for Chamoli, Uttarakhand.
 *
 * Refreshes every 5 minutes. Falls back gracefully if unavailable.
 */

import { useState, useEffect, useCallback } from 'react';

const REFRESH_MS = 5 * 60 * 1000; // 5 minutes
const CHAMOLI_LAT = 30.40;
const CHAMOLI_LON = 79.33;

export function useLiveWeather() {
  const [weather, setWeather]         = useState(null);
  const [isLoading, setIsLoading]     = useState(true);
  const [lastFetchTime, setLastFetch] = useState(null);

  const fetchWeather = useCallback(async () => {
    try {
      const url = `https://api.open-meteo.com/v1/forecast?latitude=${CHAMOLI_LAT}&longitude=${CHAMOLI_LON}&current=temperature_2m,relative_humidity_2m,precipitation,weather_code,wind_speed_10m&precipitation_unit=mm&wind_speed_unit=kmh&timezone=Asia%2FKolkata&forecast_days=1`;
      const resp = await fetch(url, { signal: AbortSignal.timeout(8000) });
      if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
      const data = await resp.json();
      const cur = data.current;
      
      const precip_mm = parseFloat(cur.precipitation || 0);
      const rain_mm_hr = Math.round(precip_mm * 4 * 10) / 10;
      
      setWeather({
        location: "Chamoli, Uttarakhand (Himalayan Hilly Region)",
        latitude: CHAMOLI_LAT,
        longitude: CHAMOLI_LON,
        rainfall_mm_hr: rain_mm_hr,
        temperature_c: parseFloat(cur.temperature_2m || 18.0),
        humidity_pct: parseFloat(cur.relative_humidity_2m || 72),
        wind_speed_kmh: parseFloat(cur.wind_speed_10m || 12.0),
        weather_code: parseInt(cur.weather_code || 0),
        is_live: true,
        source: "Open-Meteo API (open-meteo.com) — real Chamoli, Uttarakhand readings",
        timestamp: cur.time || new Date().toISOString()
      });
      setLastFetch(new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }));
    } catch (_err) {
      // Keep stale data if present, mark as offline
      setWeather(prev => prev ? { ...prev, is_live: false } : null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchWeather();
    const id = setInterval(fetchWeather, REFRESH_MS);
    return () => clearInterval(id);
  }, [fetchWeather]);

  return { weather, isLoading, lastFetchTime, refetch: fetchWeather };
}
