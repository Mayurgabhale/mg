useEffect(() => {
  setLoading(true);
  fetchHistory()
    .then(json => {
      if (!json) throw new Error('Empty response');
      setData(json);
    })
    .catch(err => {
      console.error('fetchHistory failed:', err);
      setError(err);
    })
    .finally(() => setLoading(false));
}, []);