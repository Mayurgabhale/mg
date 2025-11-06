{
  key: 'quezon-singapore',
  title: 'Philippines - Singapore',
  body: (quezonCity?.total === 0 && singapore?.total === 0) ? (
    <Typography color="white" align="center" py={6}>
      No Quezon City or Singapore data
    </Typography>
  ) : (
    <CompositeChartCard
      title=""
      data={[
        {
          name: "Quezon City (6thFloor)",
          headcount: data?.realtime?.["Quezon City"]?.floors?.["6th Floor"] ?? 0,
          capacity: buildingCapacities?.["Quezon City (6thFloor)"] ?? 0,
        },
        {
          name: "Quezon City (7thFloor)",
          headcount: data?.realtime?.["Quezon City"]?.floors?.["7th Floor"] ?? 0,
          capacity: buildingCapacities?.["Quezon City (7thFloor)"] ?? 0,
        },
        {
          name: "Singapore",
          headcount: singapore?.total ?? 0,
          capacity: buildingCapacities?.["Singapore"] ?? 0,
        },
      ]}
      lineColor={palette15[0]}
      height={250}
      sx={{ border: 'none' }}
    />
  )
},