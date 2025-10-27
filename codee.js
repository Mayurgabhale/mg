i wan to use same colors for all bar,
  nethier or  each bar different different color,
  ewach bar has differnet colr. ok 


// 💎 Refreshed dark-to-light palette — includes luxury tones, brights, and muted neutrals
const DARK_TO_LIGHT = [
  '#1A1A2E', // Deep Navy
  '#16213E', // Midnight Blue
  '#0F3460', // Indigo Steel
  '#533483', // Royal Purple
  '#E94560', // Coral Red
  '#FF7B54', // Warm Tangerine
  '#FFC947', // Golden Amber
  '#C7F9CC', // Mint Green
  '#80ED99', // Soft Jade
  '#57CC99', // Vibrant Green
  '#38A3A5', // Teal Ocean
  '#0096C7', // Cerulean
  '#48CAE4', // Sky Blue
  '#ADE8F4', // Pale Aqua
  '#CAF0F8', // Soft Ice Blue
  '#FFD6A5',
   '#FFB5A7',
    '#FCD5CE', 
    '#E2E2DF',
     '#C9C9C9' // Warm pastels to neutrals
];


// ⚡ Modern, branded, and diverse — works with dark or light charts
const PROFESSIONAL_COLORS = {
  // Primary colors — strong & distinct brand tones
  primary: ['#1D4ED8', '#6366F1', '#8B5CF6'], // Blue → Indigo → Violet
  accent: ['#F97316', '#F59E0B', '#EAB308'], // Orange → Amber → Yellow
  neutral: ['#475569', '#64748B', '#94A3B8'], // Slate neutrals

  // Data visualization colors — every bar feels different
  barFill: [
    '#2563EB', '#3B82F6', '#8B5CF6', '#A855F7', '#E879F9',
    '#EC4899', '#F43F5E', '#F97316', '#F59E0B', '#10B981',
    '#14B8A6', '#06B6D4', '#0EA5E9', '#38BDF8', '#22D3EE',
    '#84CC16', '#A3E635', '#FDE68A', '#E2E8F0', '#CBD5E1'
  ],

  success: '#10B981',   // Emerald Green
  warning: '#F59E0B',   // Golden Orange
  error: '#EF4444',     // Soft Red

  background: 'rgba(15, 23, 42, 0.95)', // Deep navy backdrop for contrast

  text: {
    primary: '#F8FAFC',
    secondary: '#CBD5E1',
    accent: '#38BDF8'
  }
};


// 🌈 Gradient bar set — visually stunning, branded transitions (multi-family colors)
const BAR_GRADIENT = [
  '#1D4ED8', '#3B82F6', '#60A5FA', '#93C5FD',  // Blues
  '#9333EA', '#A855F7', '#C084FC', '#E879F9',  // Purple–pink
  '#F43F5E', '#FB7185', '#FCA5A5', '#FECACA',  // Red–rose
  '#F59E0B', '#FBBF24', '#FCD34D', '#FEF9C3',  // Amber–yellow
  '#10B981', '#34D399', '#6EE7B7', '#A7F3D0',  // Greens
  '#0EA5E9', '#38BDF8', '#7DD3FC', '#BAE6FD'   // Aqua
];



return (
  <Card
    sx={{
      borderRadius: 1,
      overflow: 'hidden',
      // bgcolor: PROFESSIONAL_COLORS.background,
      bgcolor: '#000',
      backdropFilter: 'blur(10px)',
      border: `1px solid rgba(255,255,255,0.1)`,
      transition: 'transform 0.3s, box-shadow 0.3s',
      '&:hover': {
        transform: 'translateY(-2px)',
        boxShadow: '0 8px 32px rgba(0,0,0,0.4)'
      }
    }}
  >
    <CardContent sx={{ p: 0 }}>
      <Typography
        variant="h6"
        align="center"
        gutterBottom
        sx={{ 
          color: PROFESSIONAL_COLORS.text.accent,
          fontWeight: 600,
          fontSize: '1.1rem',
          mb: 1
        }}
      >
        {title}
      </Typography>
      
      <Box sx={{ width: '100%', height }}>
        <ResponsiveContainer>
          <ComposedChart
            data={enriched}
            margin={{ top: 5, right: 10, left: 10, bottom: 10 }}
          >
            {/* Enhanced grid */}
            <CartesianGrid 
              strokeDasharray="3 3" 
              stroke="rgba(255,255,255,0.08)"
              vertical={false}
            />
            
            {/* XAxis with improved styling */}
            <XAxis
              dataKey="name"
              tickLine={false}
              axisLine={false}
              stroke={PROFESSIONAL_COLORS.text.secondary}
              tick={{ fill: PROFESSIONAL_COLORS.text.secondary, fontSize: 12 }}
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

            {/* Left YAxis */}
            <YAxis
              yAxisId="left"
              tickLine={false}
              axisLine={false}
              stroke={PROFESSIONAL_COLORS.text.secondary}
              tick={{ fill: PROFESSIONAL_COLORS.text.secondary, fontSize: 12 }}
            />

            {/* Right YAxis */}
            <YAxis
              yAxisId="right"
              orientation="right"
              tickLine={false}
              axisLine={false}
              stroke={PROFESSIONAL_COLORS.text.secondary}
              tick={{ fill: PROFESSIONAL_COLORS.text.secondary, fontSize: 12 }}
              domain={[0, 100]}
              tickFormatter={val => `${val}%`}
            />
            
            {/* Enhanced Tooltip */}
            <Tooltip
              contentStyle={{ 
                backgroundColor: 'rgba(15, 23, 42, 0.95)',
                border: `1px solid ${PROFESSIONAL_COLORS.primary[0]}`,
                borderRadius: 8,
                padding: 12,
                backdropFilter: 'blur(8px)'
              }}
              content={({ active, payload, label }) => {
                if (!active || !payload || !payload.length) return null;
                const datum = payload[0].payload;
                return (
                  <div style={{
                    backgroundColor: 'rgba(15, 23, 42, 0.95)',
                    border: `1px solid ${PROFESSIONAL_COLORS.primary[0]}`,
                    borderRadius: 8,
                    padding: 12,
                    color: PROFESSIONAL_COLORS.text.primary
                  }}>
                    <div style={{ 
                      fontWeight: 700, 
                      marginBottom: 8, 
                      color: PROFESSIONAL_COLORS.text.accent,
                      fontSize: 14
                    }}>
                      {label}
                    </div>
                    <div style={{ marginBottom: 4 }}>
                      <span style={{ color: PROFESSIONAL_COLORS.text.secondary }}>Headcount: </span>
                      <span style={{ color: PROFESSIONAL_COLORS.text.primary, fontWeight: 600 }}>{datum.headcount}</span>
                    </div>
                    <div style={{ marginBottom: 4 }}>
                      <span style={{ color: PROFESSIONAL_COLORS.text.secondary }}>Usage %: </span>
                      <span style={{ color: PROFESSIONAL_COLORS.text.primary, fontWeight: 600 }}>{datum.percentage}%</span>
                    </div>
                    <div>
                      <span style={{ color: PROFESSIONAL_COLORS.text.secondary }}>Seat Capacity: </span>
                      <span style={{ color: PROFESSIONAL_COLORS.text.primary, fontWeight: 600 }}>{datum.capacity}</span>
                    </div>
                  </div>
                );
              }}
            />

            {/* Headcount bars with professional colors */}
            <Bar
              yAxisId="left"
              dataKey="headcount"
              name="Headcount"
              barSize={600}
              radius={[4, 4, 0, 0]}
              isAnimationActive={false}
            >
              {enriched.map((entry, idx) => (
                <Cell 
                  key={`cell-${idx}`} 
                  fill={BAR_GRADIENT[idx % BAR_GRADIENT.length]}
                />
              ))}

              {/* Top headcount label */}
              <LabelList
                dataKey="headcount"
                position="top"
                formatter={(val) => `${val}`}
                style={{ 
                  fill: PROFESSIONAL_COLORS.text.primary, 
                  fontSize: 12, 
                  fontWeight: 600 
                }}
              />

              {/* Inside percentage label */}
              <LabelList
                dataKey="percentage"
                position="inside"
                valueAccessor={(entry) => entry.percentage}
                formatter={(val) => `${val}%`}
                style={{ 
                  fill: PROFESSIONAL_COLORS.text.primary, 
                  fontSize: 11, 
                  fontWeight: 600 
                }}
              />
            </Bar>

            {/* Usage percentage line - enhanced */}
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="percentage"
              name="Usage %"
              stroke={PROFESSIONAL_COLORS.accent[0]}
              strokeWidth={1}
              dot={{ 
                fill: PROFESSIONAL_COLORS.accent[0], 
                strokeWidth: 1, 
                r: 2,
                stroke: PROFESSIONAL_COLORS.background
              }}
              activeDot={{ r: 6, fill: PROFESSIONAL_COLORS.accent[1] }}
              isAnimationActive
              animationDuration={animationDuration}
              animationEasing={animationEasing}
            />

            {/* Seat capacity line - enhanced */}
            <Line
              yAxisId="left"
              type="monotone"
              name="Total Seats"
              stroke={PROFESSIONAL_COLORS.success}
              strokeWidth={2}
              strokeDasharray="4 4"
              dot={false}
              isAnimationActive
              animationDuration={animationDuration}
              animationEasing={animationEasing}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </Box>
      
      {/* Enhanced summary section */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          gap: 4,
          alignItems: 'center',
          mt: 0,
          p: 1,
          backgroundColor: 'rgba(30, 41, 59, 0.4)',
          borderRadius: 2,
          border: '1px solid rgba(255,255,255,0.05)'
        }}
      >
        <Box sx={{ 
          color: PROFESSIONAL_COLORS.barFill[0],
          fontWeight: 600,
          fontSize: 14
        }}>
          Total Headcount: {totalHeadcount}
        </Box>
        <Box sx={{ 
          color: PROFESSIONAL_COLORS.success,
          fontWeight: 600,
          fontSize: 14
        }}>
          Total Seats: {totalCapacity}
        </Box>
        <Box sx={{ 
          color: PROFESSIONAL_COLORS.accent[0],
          fontWeight: 600,
          fontSize: 14
        }}>
          Usage: {avgUsage}%
        </Box>
      </Box>
    </CardContent>
  </Card>
);
