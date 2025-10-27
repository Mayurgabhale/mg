i want to change my composite chart desing, wiht othe colors,
  i want professal colors, the clors is look and feel, more atractive.. 
  i means desing this ok 
const DARK_TO_LIGHT = [
  '#FFD666', '#FFE599', '#FFF2CC', '#FFE599', '#E0E1DD',
  '#FFD666', '#FFEE8C', '#F8DE7E', ' #FBEC5D', '#F0E68C',
  ' #FFEE8C', '#21325E', '#415A77', '#6A7F9A', '#B0C4DE',
  '#1A1F36', '#2B3353', '#4C6482', '#7B90B2', '#CAD3E9'
];

return (
    <Card
      sx={{
        // border: `1px solid ${lineColor}`,
        borderRadius: 2,
        overflow: 'hidden',
        bgcolor: 'rgba(0,0,0,0.4)',
        transition: 'transform 0.3s, box-shadow 0.3s',
        '&:hover': {
          transform: 'scale(1.02)',
          boxShadow: '0 4px 12px rgba(0,0,0,0.7)'
        }
      }}
    >
      <CardContent sx={{ p: 1 }}>
        <Typography
          variant="subtitle1"
          align="center"
          gutterBottom
          sx={{ color: '#FFC107' }}
        >
          {title}
        </Typography>
        <Box sx={{ width: '100%', height }}>
          <ResponsiveContainer>
            <ComposedChart
              data={enriched}
              margin={{ top: 10, right: 20, left: 0, bottom: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis
                dataKey="name"
                tickLine={false}
                axisLine={false}
                stroke="rgba(255,255,255,0.6)"
                tickFormatter={(label, index) => {
                  const strLabel = String(label);
                  const match = strLabel.match(/\d+/); // Extract number from label like "Floor 3"
                  const floorNum = parseInt(match?.[0], 10);

                  if (isNaN(floorNum)) return strLabel; // fallback to raw label if no number found

                  const suffix = (n) => {
                    if (n % 100 >= 11 && n % 100 <= 13) return `${n}th`;
                    switch (n % 10) {
                      case 1: return `${n}st`;
                      case 2: return `${n}nd`;
                      case 3: return `${n}rd`;
                      default: return `${n}th`;
                    }
                  };

                  return suffix(floorNum);
                }}
              />

              <YAxis
                yAxisId="left"
                tickLine={false}
                axisLine={false}
                stroke="rgba(255,255,255,0.6)"
              />

              <YAxis
                yAxisId="right"
                orientation="right"
                tickLine={false}
                axisLine={false}
                stroke="rgba(255,255,255,0.6)"
                domain={[0, 100]}
                tickFormatter={val => `${val}%`}
              />
              <Tooltip
                contentStyle={{ backgroundColor: '#FFD666', borderColor: lineColor, padding: 8 }}
                // custom content so we can show capacity only on hover
                content={({ active, payload, label }) => {
                  if (!active || !payload || !payload.length) return null;
                  const datum = payload[0].payload;
                  return (
                    <div style={{
                      backgroundColor: '#FFD666',
                      border: `1px solid ${lineColor}`,
                      borderRadius: 4,
                      padding: 8,
                    }}>
                      <div style={{ fontWeight: 700, marginBottom: 4 }}>{label}</div>
                      <div>Headcount: {datum.headcount}</div>
                      <div>Usage %: {datum.percentage}%</div>
                      <div>Seat Capacity: {datum.capacity}</div>
                    </div>
                  );
                }}
              />

              {/* Headcount bars with per-bar colors & percentage labels */}
              <Bar
                yAxisId="left"
                dataKey="headcount"
                name="Headcount"
                barSize={700} // ✅ smaller
                isAnimationActive={false} // ✅ for debugging
              >
                {enriched.map((entry, idx) => (
                  <Cell key={`cell-${idx}`} fill={entry._color} />
                ))}

                {/* Top headcount */}
                <LabelList
                  dataKey="headcount"
                  position="top"
                  formatter={(val) => `${val}`}
                  style={{ fill: '#fff', fontSize: 14, fontWeight: 700 }}
                />

                {/* Inside percentage */}
                <LabelList
                  dataKey="percentage"
                  position="inside"
                  valueAccessor={(entry) => entry.percentage}
                  formatter={(val) => `${val}%`}
                  style={{ fill: '#000', fontSize: 14, fontWeight: 700 }}
                />
              </Bar>

              {/* Seat Capacity line */}
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="percentage"
                name="Usage %"
                stroke={lineColor}
                strokeWidth={2}
                dot={false}
                isAnimationActive
                animationDuration={animationDuration}
                animationEasing={animationEasing}
              />

              {/* Optional: draw capacity as second line */}
              <Line
                yAxisId="left"
                type="monotone"
                //  dataKey="capacity"
                name="Total Seats"
                stroke="#81C784"
                strokeDasharray="5 5"
                dot={false}
                isAnimationActive
                animationDuration={animationDuration}
                animationEasing={animationEasing}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </Box>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            gap: 4,
            alignItems: 'center',
            mb: 1,
            fontWeight: 'bold',
            fontSize: 16
          }}
        >
          <Box sx={{ color: '#FFD700' /* Yellow */ }}>
            Total Headcount: {totalHeadcount}
          </Box>
          <Box sx={{ color: '#4CAF50' /* Green */ }}>
            Total Seats: {totalCapacity}
          </Box>
          <Box sx={{ color: '#FF4C4C' /* Red */ }}>
            Usage: {avgUsage}%
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
