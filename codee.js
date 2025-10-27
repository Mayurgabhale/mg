// PREMIUM ATTRACTIVE COLOR PALETTE - Wow factor!
const PREMIUM_COLORS = {
  // Vibrant gradient colors for bars
  barGradient: [
    '#FF6B6B', '#FF8E53', '#FFD166', '#06D6A0', '#118AB2', 
    '#073B4C', '#7209B7', '#B5179E', '#F72585', '#4CC9F0',
    '#4361EE', '#3A0CA3', '#560BAD', '#480CA8', '#3F37C9'
  ],
  
  // Premium accent colors
  accents: {
    electricBlue: '#4CC9F0',
    vibrantPurple: '#7209B7',
    neonPink: '#F72585',
    electricGreen: '#06D6A0',
    sunsetOrange: '#FF8E53',
    gold: '#FFD166'
  },
  
  // Sophisticated backgrounds
  backgrounds: {
    dark: 'rgba(10, 10, 20, 0.85)',
    card: 'rgba(20, 20, 35, 0.95)',
    glass: 'rgba(255, 255, 255, 0.05)'
  },
  
  // Text colors
  text: {
    primary: '#FFFFFF',
    secondary: '#B8B8D1', 
    accent: '#4CC9F0',
    highlight: '#FFD166'
  },
  
  // Chart elements
  chart: {
    grid: 'rgba(255, 255, 255, 0.1)',
    linePrimary: '#4CC9F0',
    lineSecondary: '#06D6A0',
    capacityLine: '#F72585'
  }
};

// Premium gradient effects for bars
const PREMIUM_BAR_GRADIENT = [
  'url(#premiumGradient1)', 'url(#premiumGradient2)', 'url(#premiumGradient3)',
  'url(#premiumGradient4)', 'url(#premiumGradient5)', 'url(#premiumGradient6)'
];

return (
  <Card
    sx={{
      borderRadius: 3,
      overflow: 'hidden',
      background: `linear-gradient(135deg, ${PREMIUM_COLORS.backgrounds.card}, ${PREMIUM_COLORS.backgrounds.dark})`,
      backdropFilter: 'blur(20px)',
      border: `1px solid rgba(255,255,255,0.15)`,
      boxShadow: '0 20px 40px rgba(0,0,0,0.3), 0 0 80px rgba(76, 201, 240, 0.1)',
      transition: 'all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
      position: 'relative',
      '&:hover': {
        transform: 'translateY(-5px) scale(1.01)',
        boxShadow: '0 25px 50px rgba(0,0,0,0.4), 0 0 100px rgba(76, 201, 240, 0.2)',
        border: `1px solid rgba(76, 201, 240, 0.3)`
      },
      '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '2px',
        background: `linear-gradient(90deg, ${PREMIUM_COLORS.accents.electricBlue}, ${PREMIUM_COLORS.accents.vibrantPurple}, ${PREMIUM_COLORS.accents.neonPink})`,
        zIndex: 1
      }
    }}
  >
    <CardContent sx={{ p: 3 }}>
      {/* Premium Title */}
      <Typography
        variant="h5"
        align="center"
        gutterBottom
        sx={{ 
          color: PREMIUM_COLORS.text.primary,
          fontWeight: 700,
          fontSize: '1.4rem',
          mb: 3,
          textShadow: '0 2px 10px rgba(76, 201, 240, 0.3)',
          background: `linear-gradient(135deg, ${PREMIUM_COLORS.text.primary}, ${PREMIUM_COLORS.text.accent})`,
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          letterSpacing: '0.5px'
        }}
      >
        {title}
      </Typography>
      
      <Box sx={{ width: '100%', height, position: 'relative' }}>
        <ResponsiveContainer>
          <ComposedChart
            data={enriched}
            margin={{ top: 20, right: 30, left: 20, bottom: 25 }}
          >
            {/* Premium SVG Gradients */}
            <defs>
              <linearGradient id="premiumGradient1" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#FF6B6B" stopOpacity={0.9}/>
                <stop offset="100%" stopColor="#FF8E53" stopOpacity={0.7}/>
              </linearGradient>
              <linearGradient id="premiumGradient2" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#FFD166" stopOpacity={0.9}/>
                <stop offset="100%" stopColor="#FF8E53" stopOpacity={0.7}/>
              </linearGradient>
              <linearGradient id="premiumGradient3" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#06D6A0" stopOpacity={0.9}/>
                <stop offset="100%" stopColor="#118AB2" stopOpacity={0.7}/>
              </linearGradient>
              <linearGradient id="premiumGradient4" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#7209B7" stopOpacity={0.9}/>
                <stop offset="100%" stopColor="#B5179E" stopOpacity={0.7}/>
              </linearGradient>
              <linearGradient id="premiumGradient5" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#4CC9F0" stopOpacity={0.9}/>
                <stop offset="100%" stopColor="#4361EE" stopOpacity={0.7}/>
              </linearGradient>
            </defs>

            {/* Enhanced grid with premium styling */}
            <CartesianGrid 
              strokeDasharray="2 4" 
              stroke={PREMIUM_COLORS.chart.grid}
              vertical={false}
              strokeOpacity={0.3}
            />
            
            {/* Premium XAxis */}
            <XAxis
              dataKey="name"
              tickLine={false}
              axisLine={false}
              tick={{ 
                fill: PREMIUM_COLORS.text.secondary, 
                fontSize: 11,
                fontWeight: 600
              }}
              tickFormatter={(label, index) => {
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

            {/* Premium YAxis */}
            <YAxis
              yAxisId="left"
              tickLine={false}
              axisLine={false}
              tick={{ 
                fill: PREMIUM_COLORS.text.secondary, 
                fontSize: 11,
                fontWeight: 600
              }}
            />

            <YAxis
              yAxisId="right"
              orientation="right"
              tickLine={false}
              axisLine={false}
              tick={{ 
                fill: PREMIUM_COLORS.text.secondary, 
                fontSize: 11,
                fontWeight: 600
              }}
              domain={[0, 100]}
              tickFormatter={val => `${val}%`}
            />
            
            {/* Premium Tooltip */}
            <Tooltip
              contentStyle={{ 
                background: 'rgba(20, 20, 35, 0.95)',
                border: `1px solid ${PREMIUM_COLORS.accents.electricBlue}`,
                borderRadius: 12,
                padding: 16,
                backdropFilter: 'blur(10px)',
                boxShadow: '0 10px 30px rgba(0,0,0,0.4)'
              }}
              content={({ active, payload, label }) => {
                if (!active || !payload || !payload.length) return null;
                const datum = payload[0].payload;
                return (
                  <div style={{
                    background: 'rgba(20, 20, 35, 0.95)',
                    border: `1px solid ${PREMIUM_COLORS.accents.electricBlue}`,
                    borderRadius: 12,
                    padding: 16,
                    color: PREMIUM_COLORS.text.primary,
                    boxShadow: '0 10px 30px rgba(0,0,0,0.4)'
                  }}>
                    <div style={{ 
                      fontWeight: 700, 
                      marginBottom: 12, 
                      color: PREMIUM_COLORS.accents.electricBlue,
                      fontSize: 14,
                      borderBottom: `1px solid ${PREMIUM_COLORS.accents.electricBlue}30`,
                      paddingBottom: 8
                    }}>
                      {label}
                    </div>
                    <div style={{ marginBottom: 6, display: 'flex', alignItems: 'center' }}>
                      <div style={{
                        width: 12,
                        height: 12,
                        background: PREMIUM_COLORS.barGradient[0],
                        borderRadius: 2,
                        marginRight: 8
                      }}/>
                      <span style={{ color: PREMIUM_COLORS.text.secondary }}>Headcount: </span>
                      <span style={{ color: PREMIUM_COLORS.text.primary, fontWeight: 700, marginLeft: 4 }}>{datum.headcount}</span>
                    </div>
                    <div style={{ marginBottom: 6, display: 'flex', alignItems: 'center' }}>
                      <div style={{
                        width: 12,
                        height: 2,
                        background: PREMIUM_COLORS.accents.electricBlue,
                        borderRadius: 1,
                        marginRight: 8
                      }}/>
                      <span style={{ color: PREMIUM_COLORS.text.secondary }}>Usage: </span>
                      <span style={{ color: PREMIUM_COLORS.accents.electricBlue, fontWeight: 700, marginLeft: 4 }}>{datum.percentage}%</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <div style={{
                        width: 12,
                        height: 2,
                        background: PREMIUM_COLORS.accents.neonPink,
                        borderRadius: 1,
                        marginRight: 8,
                        border: `1px dashed ${PREMIUM_COLORS.accents.neonPink}`
                      }}/>
                      <span style={{ color: PREMIUM_COLORS.text.secondary }}>Capacity: </span>
                      <span style={{ color: PREMIUM_COLORS.accents.neonPink, fontWeight: 700, marginLeft: 4 }}>{datum.capacity}</span>
                    </div>
                  </div>
                );
              }}
            />

            {/* Premium Bars with Gradient Fill */}
            <Bar
              yAxisId="left"
              dataKey="headcount"
              name="Headcount"
              barSize={650}
              radius={[6, 6, 0, 0]}
              isAnimationActive={true}
              animationDuration={800}
            >
              {enriched.map((entry, idx) => (
                <Cell 
                  key={`cell-${idx}`} 
                  fill={PREMIUM_COLORS.barGradient[idx % PREMIUM_COLORS.barGradient.length]}
                  stroke={`${PREMIUM_COLORS.barGradient[idx % PREMIUM_COLORS.barGradient.length]}80`}
                  strokeWidth={1}
                />
              ))}

              {/* Premium Labels */}
              <LabelList
                dataKey="headcount"
                position="top"
                formatter={(val) => `${val}`}
                style={{ 
                  fill: PREMIUM_COLORS.text.primary, 
                  fontSize: 12, 
                  fontWeight: 700,
                  textShadow: '0 2px 4px rgba(0,0,0,0.5)'
                }}
              />

              <LabelList
                dataKey="percentage"
                position="insideTop"
                offset={15}
                valueAccessor={(entry) => entry.percentage}
                formatter={(val) => `${val}%`}
                style={{ 
                  fill: PREMIUM_COLORS.text.primary, 
                  fontSize: 11, 
                  fontWeight: 700,
                  textShadow: '0 1px 2px rgba(0,0,0,0.8)'
                }}
              />
            </Bar>

            {/* Premium Usage Line */}
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="percentage"
              name="Usage %"
              stroke={PREMIUM_COLORS.accents.electricBlue}
              strokeWidth={4}
              dot={{ 
                fill: PREMIUM_COLORS.accents.electricBlue, 
                strokeWidth: 3, 
                r: 5,
                stroke: PREMIUM_COLORS.backgrounds.dark
              }}
              activeDot={{ 
                r: 8, 
                fill: PREMIUM_COLORS.accents.electricBlue,
                stroke: PREMIUM_COLORS.text.primary,
                strokeWidth: 2
              }}
              isAnimationActive
              animationDuration={1000}
              animationEasing="ease-out"
            />

            {/* Premium Capacity Line */}
            <Line
              yAxisId="left"
              type="monotone"
              name="Total Seats"
              stroke={PREMIUM_COLORS.accents.neonPink}
              strokeWidth={3}
              strokeDasharray="5 3"
              dot={{ 
                fill: PREMIUM_COLORS.accents.neonPink,
                strokeWidth: 2,
                r: 4,
                stroke: PREMIUM_COLORS.backgrounds.dark
              }}
              isAnimationActive
              animationDuration={1200}
              animationEasing="ease-out"
            />
          </ComposedChart>
        </ResponsiveContainer>
      </Box>
      
      {/* Premium Summary Section */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-around',
          alignItems: 'center',
          mt: 3,
          p: 2,
          background: PREMIUM_COLORS.backgrounds.glass,
          borderRadius: 3,
          border: '1px solid rgba(255,255,255,0.1)',
          backdropFilter: 'blur(10px)'
        }}
      >
        <Box sx={{ textAlign: 'center' }}>
          <Typography sx={{ color: PREMIUM_COLORS.text.secondary, fontSize: 12, fontWeight: 600, mb: 0.5 }}>
            TOTAL HEADCOUNT
          </Typography>
          <Typography sx={{ color: PREMIUM_COLORS.accents.gold, fontSize: 18, fontWeight: 800 }}>
            {totalHeadcount}
          </Typography>
        </Box>
        <Box sx={{ textAlign: 'center' }}>
          <Typography sx={{ color: PREMIUM_COLORS.text.secondary, fontSize: 12, fontWeight: 600, mb: 0.5 }}>
            TOTAL SEATS
          </Typography>
          <Typography sx={{ color: PREMIUM_COLORS.accents.electricGreen, fontSize: 18, fontWeight: 800 }}>
            {totalCapacity}
          </Typography>
        </Box>
        <Box sx={{ textAlign: 'center' }}>
          <Typography sx={{ color: PREMIUM_COLORS.text.secondary, fontSize: 12, fontWeight: 600, mb: 0.5 }}>
            USAGE
          </Typography>
          <Typography sx={{ color: PREMIUM_COLORS.accents.electricBlue, fontSize: 18, fontWeight: 800 }}>
            {avgUsage}%
          </Typography>
        </Box>
      </Box>
    </CardContent>
  </Card>
);