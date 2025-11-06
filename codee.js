data={
  [
    ...puneChartData,
    {
      name: "Hyderabad",
      headcount: data?.realtime?.["IN.HYD"]?.total ?? 0,
      capacity: buildingCapacities?.["IN.HYD"] ?? 0
    }
  ]
  // Sort order: Tower B → Podium Floor → Hyderabad
  .sort((a, b) => {
    const order = ["Tower B", "Podium Floor", "Hyderabad"];
    return order.indexOf(a.name) - order.indexOf(b.name);
  })
}