// at top of component: add error state
const [error, setError] = useState(null);

useEffect(() => {
  let mounted = true;
  setLoading(true);
  setError(null);

  fetchHistory()
    .then(json => {
      if (!mounted) return;
      setData(json);
    })
    .catch(err => {
      console.error('fetchHistory failed', err);
      if (!mounted) return;
      // store an error object or string to show to user
      setError(err?.message || String(err));
    })
    .finally(() => {
      if (!mounted) return;
      setLoading(false);
    });

  return () => { mounted = false; };
}, []);