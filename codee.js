const displayNameMap = {
  'IN.HYD': 'Hyderabad',
  'JP.Tokyo': 'Tokyo',
  'MY.Kuala Lumpur': 'Kuala Lumpur',
  'PH.Quezon': 'Quezon City',
  'PH.Taguig': 'Taguig City',
  'Pune': 'Pune',
};






<Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: '#FFC107', fontSize: '1.3rem' }}>
  {displayNameMap[p.name] || p.name.replace(/^.*\./, '')}
</Typography>