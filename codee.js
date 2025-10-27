these color is very deal colors,
  not good,
  oner user see graph, they say waw, 
  is vrey nice, 
  i want more atractive and professal colors theme, 
  look and feel alos more atractive. 
const DARK_TO_LIGHT = [
  '#FFD666', '#FFE599', '#FFF2CC', '#FFE599', '#E0E1DD',
  '#FFD666', '#FFEE8C', '#F8DE7E', ' #FBEC5D', '#F0E68C',
  ' #FFEE8C', '#21325E', '#415A77', '#6A7F9A', '#B0C4DE',
  '#1A1F36', '#2B3353', '#4C6482', '#7B90B2', '#CAD3E9'
];

// Professional color palette - modern, sophisticated
const PROFESSIONAL_COLORS = {
  // Primary colors - deep blues and teals
  primary: ['#2563EB', '#1E40AF', '#1E3A8A'], // Blue gradient
  accent: ['#0D9488', '#0F766E', '#115E59'],   // Teal gradient 
  neutral: ['#64748B', '#475569', '#334155'],  // Gray gradient
  
  // Data visualization colors
  barFill: ['#3B82F6', '#60A5FA', '#93C5FD', '#BFDBFE'],
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  
  // Background and text
  background: 'rgba(15, 23, 42, 0.8)', // Dark blue with transparency

  text: {
    primary: '#F8FAFC',
    secondary: '#CBD5E1',
    accent: '#38BDF8'
   
  }
};



// Updated gradient for bars - more professional
const BAR_GRADIENT = [
  '#3B82F6', '#60A5FA', '#93C5FD', '#BFDBFE',
  '#0EA5E9', '#38BDF8', '#7DD3FC', '#BAE6FD',
  '#6366F1', '#8B5CF6', '#A855F7', '#C084FC',
  '#06B6D4', '#22D3EE', '#67E8F9', '#A5F3FC'
];
return (
  <Card
    sx={{
      borderRadius: 1,
      overflow: 'hidden',
      bgcolor: PROFESSIONAL_COLORS.background,
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
          fontSize: '1.3rem',
          mb: 1
        }}
      >
        {title}
      </Typography>
      
      <Box sx={{ width: '100%', height }}>
        <ResponsiveContainer>
          <ComposedChart
            data={enriched}
            margin={{ top: 15, right: 25, left: 10, bottom: 25 }}
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
              strokeWidth={3}
              dot={{ 
                fill: PROFESSIONAL_COLORS.accent[0], 
                strokeWidth: 2, 
                r: 4,
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
