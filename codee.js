<Bar
  yAxisId="left"
  dataKey="headcount"
  name="Headcount"
  barSize={40}        // adjust width of bars
  isAnimationActive={false}
>
  {enriched.map((e, i) => (
    <Cell
      key={i}
      fill={e._color}          // inner color
      stroke="#000"            // border color
      strokeWidth={2}          // border thickness
      radius={[4, 4, 0, 0]}   // rounded top corners
    />
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