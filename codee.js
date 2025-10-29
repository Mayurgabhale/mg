import { useState, useEffect, useRef } from 'react';
import { fetchLiveSummary } from '../api/occupancy.service';

export function useLiveOccupancy(interval = 10000) { // fetch every 10 seconds
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const timerRef = useRef(null);

  useEffect(() => {
    let active = true;

    async function load() {
      if (document.hidden) return; // Skip fetch when tab is not visible
      try {
        const json = await fetchLiveSummary();
        if (!active) return;
        setData(json);
        setLoading(false);
      } catch (e) {
        if (!active) return;
        setError(e);
        setLoading(false);
      }
    }

    load(); // initial fetch
    timerRef.current = setInterval(load, interval); // repeat every few seconds

    return () => {
      active = false;
      clearInterval(timerRef.current);
    };
  }, [interval]);

  return { data, loading, error };
}