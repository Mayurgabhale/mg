{/* Region Cards */}
<Box
  display="flex"
  flexWrap="wrap"
  gap={1}
  mb={3}
  sx={{
    '& > div': {
      flex: {
        xs: '1 1 100%',
        sm: '1 1 calc(50% - 8px)',
        md: '1 1 calc(33.333% - 12px)',
        lg: '1 1 calc(16.66% - 12px)'
      },
      minWidth: {
        xs: '100%',
        sm: '240px',
        md: '240px',
        lg: '180px'
      }
    }
  }}
>
  {loading ? (
    <Skeleton variant="rectangular" width="90%" height={200} />
  ) : (
    partitions.map((p, i) => (
      <Box key={p.name}>
        <SummaryCard
          title={
            <Typography
              variant="subtitle1"
              sx={{
                fontWeight: 'bold',
                color: '#FFC107',
                fontSize: { xs: '1rem', sm: '1.05rem', md: '1.1rem' }
              }}
            >
              {displayNameMap[p.name] || p.name.replace(/^.*\./, '')}
            </Typography>
          }
          total={p.total}
          stats={[
            { label: 'Employees', value: p.Employee },
            { label: 'Contractors', value: p.Contractor }
          ]}
          sx={{
            width: '100%',
            border: `2px solid ${palette15[i % palette15.length]}`,
            // ✅ Increased heights and enabled content wrapping
            height: { xs: 150, sm: 160, md: 170, lg: 180 },
            px: { xs: 1, sm: 1.5 },
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            overflow: 'visible'
          }}
          icon={
            <Box
              component="img"
              src={p.flag}
              sx={{ width: { xs: 40, sm: 48 }, height: { xs: 26, sm: 32 } }}
            />
          }
        />
      </Box>
    ))
  )}
</Box>