import { useState, useEffect } from 'react';

export function useLongdoMap(apiKey) {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const checkReady = () => {
      if (window.longdo && window.longdo.Map) {
        setIsReady(true);
        return true;
      }
      return false;
    };

    if (checkReady()) return;

    // If not ready, check every 100ms for a maximum of 50 times (5 seconds)
    let attempts = 0;
    const interval = setInterval(() => {
      attempts++;
      if (checkReady() || attempts >= 50) {
        clearInterval(interval);
      }
    }, 100);

    return () => clearInterval(interval);
  }, []);

  return isReady;
}
