/**
 * useConnectivity.js — Online/offline detection hook
 * Listens to browser window.online / window.offline events.
 * Also exposes a manual demo toggle for the "Simulate Offline" feature.
 */

import { useState, useEffect } from 'react';

export function useConnectivity() {
  const [isOnline, setIsOnline]           = useState(navigator.onLine);
  const [demoOffline, setDemoOffline]     = useState(false);

  useEffect(() => {
    const goOnline  = () => setIsOnline(true);
    const goOffline = () => setIsOnline(false);

    window.addEventListener('online',  goOnline);
    window.addEventListener('offline', goOffline);

    return () => {
      window.removeEventListener('online',  goOnline);
      window.removeEventListener('offline', goOffline);
    };
  }, []);

  // Either actually offline OR demo toggle is on
  const isOffline = !isOnline || demoOffline;

  const toggleDemoOffline = () => setDemoOffline(v => !v);

  return {
    isOnline,
    isOffline,
    demoOffline,
    toggleDemoOffline,
  };
}
