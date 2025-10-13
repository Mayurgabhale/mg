<Box display="flex" alignItems="center" gap={1.5}>
  {navItems.map((item, idx) => (
    <Tooltip
      key={idx}
      title={
        <Typography sx={{ fontSize: '0.9rem', fontWeight: 500 }}>
          {item.label}
        </Typography>
      }
      arrow
      placement="bottom"
    >
      <IconButton color="inherit" onClick={item.action}>
        {React.cloneElement(item.icon, { fontSize: 'medium' })} 
      </IconButton>
    </Tooltip>
  ))}
</Box>