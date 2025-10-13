<ComposedChart data={enriched} margin={{ top: 15, right: 20, left: 0, bottom: 20 }}>
  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
  <XAxis dataKey="name" tickLine={false} axisLine={false} stroke="rgba(255,255,255,0.6)" />
  <YAxis yAxisId="left" tickLine={false} axisLine={false} stroke="rgba(255,255,255,0.6)" />

  {/* Border bar */}
  <Bar
    yAxisId="left"
    dataKey="headcount"
    barSize={40}
    fill="transparent"
    stroke="#000"   // border color
    strokeWidth={2}
    radius={[4,4,0,0]}  // optional rounded corners
  />

  {/* Main colored bar */}
  <Bar
    yAxisId="left"
    dataKey="headcount"
    barSize={36}   // slightly smaller to fit inside border
    isAnimationActive={false}
  >
    {enriched.map((e, i) => (
      <Cell key={i} fill={e._color} />
    ))}
    <LabelList
      dataKey="headcount"
      position="top"
      formatter={v => `${v}`}
      style={{ fill: '#fff', fontSize: 15, fontWeight: 700 }}
    />
    <LabelList
      dataKey="percentage"
      position="inside"
      formatter={v => `${v}%`}
      style={{ fill: '#EE4B2B', fontSize: 14, fontWeight: 700 }}
    />
  </Bar>
</ComposedChart>