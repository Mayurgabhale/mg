renderValue={(selected) =>
  selected ? (
    <Box display="flex" alignItems="center">
      <Box
        component="img"
        src={flagMap[selected]}
        alt={selected}
        sx={{
          width: 22,
          height: 15,
          mr: 1,
          border: '1px solid #000', // ✅ adds visible border
          borderRadius: '2px',
          objectFit: 'cover',
        }}
      />
      {displayNameMap[selected] || selected}
    </Box>
  ) : '— Select Site —'
}