/**
 * useLiveWeather.js — Fetches real weather data from Open-Meteo
 * via the JeevanSetu backend proxy for Chamoli, Uttarakhand.
 *
 * Refreshes every 5 minutes. Falls back gracefully if unavailable.
 */

import { useState, useEffect, useCallback } from 'react';

const API_BASE = 'http://localhost:8000';
const REFRESH_MS = 5 * 60 * 1000; // 5 minutes

export function useLiveWeather() {
  const [weather, setWeather]         = useState(null);
  const [isLoading, setIsLoading]     = useState(true);
  const [lastFetchTime, setLastFetch] = useState(null);

  const fetchWeather = useCallback(async () => {
    try {
      const resp = await fetch(`${API_BASE}/api/weather`, {
        signal: AbortSignal.timeout(8000),
      });
      if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
      const data = await resp.json();
      setWeather(data);
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
