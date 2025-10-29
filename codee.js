// inside useEffect in Dashboard
useEffect(() => {
  if (data) {
    setLastUpdate(new Date().toLocaleTimeString());
  }
}, [JSON.stringify(data)]); // optional debounce