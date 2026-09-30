/**
 * useMLPredict.js — Calls FastAPI Random Forest endpoint
 *
 * Fetches ML-based risk prediction whenever telemetry values change.
 * Falls back gracefully if backend is unavailable (offline / demo mode).
 */

import { useState, useEffect, useRef, useCallback } from 'react';

const API_BASE = 'http://localhost:8000';
const DEBOUNCE_MS = 800; // avoid hammering API on every jitter tick

export function useMLPredict({ rainfall, soil, stream, terrain = 0.92 }) {
  const [mlResult, setMlResult]     = useState(null);
  const [isLoading, setIsLoading]   = useState(false);
  const [error, setError]           = useState(null);
  const [backendOnline, setBackendOnline] = useState(null); // null = unknown
  const debounceRef = useRef(null);

  const fetchPrediction = useCallback(async (r, s, st, tv) => {
    setIsLoading(true);
    try {
      const resp = await fetch(`${API_BASE}/api/predict`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rainfall: r, soil: s, stream: st, terrain: tv }),
        signal: AbortSignal.timeout(5000),
      });
      if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
      const data = await resp.json();
      setMlResult(data);
      setError(null);
      setBackendOnline(true);
    } catch (err) {
      setError(err.message || 'Backend unavailable');
      setBackendOnline(false);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      fetchPrediction(rainfall, soil, stream, terrain);
    }, DEBOUNCE_MS);
    return () => clearTimeout(debounceRef.current);
  }, [rainfall, soil, stream, terrain, fetchPrediction]);

  return { mlResult, isLoading, error, backendOnline };
}
