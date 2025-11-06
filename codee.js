{
  key: 'india',
  title: 'India',
  body: (pune?.total === 0 && !combinedRegions.find(r => r.name === 'IN.HYD')) ? (
    <Typography color="white" align="center" py={6}>
      No India data
    </Typography>
  ) : (
    <CompositeChartCard
      title=""
      data={[
        // Pune floor breakdown
        ...puneChartData,
        // Add Hyderabad as single aggregate bar
        {
          name: "Hyderabad",
          headcount: data?.realtime?.["IN.HYD"]?.total ?? 0,
          capacity: buildingCapacities?.["Hyderabad"] ?? 0
        }
      ]}
      lineColor={palette15[0]}
      height={250}
      sx={{ border: 'none' }}
    />
  )
},