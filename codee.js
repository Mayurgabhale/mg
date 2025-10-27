// 🌟 Elegant yellow-to-neutral palette
const DARK_TO_LIGHT = [
  '#FFD700', // Pure Gold
  '#FFDD44', // Bright Sun
  '#FFE366', // Soft Lemon
  '#FFEB99', // Warm Pastel Yellow
  '#FFF4C2', // Pale Cream
  '#E0E1DD', // Neutral gray
  '#D4AF37', // Royal Gold
  '#FAD02E', // Golden Glow
  '#FFDF6C', // Buttery Yellow
  '#FFF5B7', // Soft Light Yellow
  '#FBEC5D', // Classic Light Gold
  '#F8DE7E', // Mellow Yellow
  '#FFEE8C', // Fresh Pastel
  '#E6C200', // Deep Mustard
  '#CFAF17', // Muted Gold
  '#B8860B', // Dark Goldenrod
  '#A67C00', // Antique Gold
  '#8B7500', // Golden Brown
  '#E2E2DF', // Cool Neutral
  '#C9C9C9'  // Subtle Gray
];

return (
  <Card
    sx={{
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
        sx={{ color: '#FFD700', fontWeight: 700 }}
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
              tickFormatter={(label) => {
                const strLabel = String(label);
                const match = strLabel.match(/\d+/);
                const floorNum = parseInt(match?.[0], 10);
                if (isNaN(floorNum)) return strLabel;
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
              tickFormatter={(val) => `${val}%`}
            />

            <Tooltip
              contentStyle={{ 
                backgroundColor: '#FFF8DC',
                border: '1px solid #FFD700',
                borderRadius: 6,
                padding: 8,
                color: '#000'
              }}
              content={({ active, payload, label }) => {
                if (!active || !payload || !payload.length) return null;
                const datum = payload[0].payload;
                return (
                  <div style={{
                    backgroundColor: '#FFF8DC',
                    border: '1px solid #FFD700',
                    borderRadius: 6,
                    padding: 8,
                    color: '#000',
                    boxShadow: '0 2px 6px rgba(0,0,0,0.15)'
                  }}>
                    <div style={{ fontWeight: 700, marginBottom: 4 }}>{label}</div>
                    <div>Headcount: {datum.headcount}</div>
                    <div>Usage %: {datum.percentage}%</div>
                    <div>Seat Capacity: {datum.capacity}</div>
                  </div>
                );
              }}
            />

            {/* Headcount Bars with yellow shades + shadow */}
            <Bar
              yAxisId="left"
              dataKey="headcount"
              name="Headcount"
              barSize={700}
              isAnimationActive={false}
            >
              {enriched.map((entry, idx) => (
                <Cell
                  key={`cell-${idx}`}
                  fill={DARK_TO_LIGHT[idx % DARK_TO_LIGHT.length]}
                  style={{
                    filter: 'drop-shadow(0px 2px 3px rgba(255, 215, 0, 0.3))'
                  }}
                />
              ))}

              <LabelList
                dataKey="headcount"
                position="top"
                formatter={(val) => `${val}`}
                style={{ fill: '#fff', fontSize: 13, fontWeight: 700 }}
              />
              <LabelList
                dataKey="percentage"
                position="inside"
                formatter={(val) => `${val}%`}
                style={{ fill: '#000', fontSize: 13, fontWeight: 700 }}
              />
            </Bar>

            {/* Usage % line */}
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="percentage"
              name="Usage %"
              stroke="#FFB300"
              strokeWidth={2}
              dot={false}
              isAnimationActive
              animationDuration={animationDuration}
              animationEasing={animationEasing}
            />

            {/* Seat capacity line */}
            <Line
              yAxisId="left"
              type="monotone"
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

      {/* Summary */}
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
        <Box sx={{ color: '#FFD700' }}>Total Headcount: {totalHeadcount}</Box>
        <Box sx={{ color: '#4CAF50' }}>Total Seats: {totalCapacity}</Box>
        <Box sx={{ color: '#FF4C4C' }}>Usage: {avgUsage}%</Box>
      </Box>
    </CardContent>
  </Card>
);