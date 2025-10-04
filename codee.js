<ResponsiveContainer width="100%" height={400}>
  <LineChart
    data={chartData}
    style={{ backgroundColor: "#f9fafc", borderRadius: "8px", padding: "8px" }}
  >
    <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
    <XAxis
      dataKey="name"
      angle={0}
      textAnchor="middle"
      height={50}
      stroke="#333"
    />
    <YAxis stroke="#333" />
    <Tooltip
      contentStyle={{ backgroundColor: "#ffffff", border: "1px solid #ddd" }}
      formatter={(value, name, props) => [
        value,
        companyShortNames[props.payload.name] || props.payload.name
      ]}
    />
    <Legend />
    <Line type="monotone" dataKey="podium" stroke="#4a90e2" name="Podium Floor" />
    <Line type="monotone" dataKey="second" stroke="#50c878" name="2nd Floor" />
    <Line type="monotone" dataKey="towerB" stroke="#f5a623" name="Tower B" />
    <Line type="monotone" dataKey="total" stroke="#d0021b" name="Total" />
  </LineChart>
</ResponsiveContainer>