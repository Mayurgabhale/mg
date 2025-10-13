const [selectedPartition, setSelectedPartition] = useState(currentPartition);






...
const handlePartitionChange = (newPartition) => {
  if (!newPartition) return navigate('/');

  setSelectedPartition(newPartition); // <-- update local immediately

  if (newPartition === 'Pune' && suffixSegments.length === 0) {
    window.location.href = 'http://10.199.22.57:3011/';
    return;
  }

  const base = `/partition/${encodeURIComponent(newPartition)}`;
  const full = suffixSegments.length
    ? `${base}/${suffixSegments.join('/')}`
    : base;

  navigate(full); // route update
};



...


<Select
  size={isTablet ? 'small' : 'medium'}
  value={selectedPartition}   // <-- bind to local state
  displayEmpty
  onChange={(e) => handlePartitionChange(e.target.value)}
  ...