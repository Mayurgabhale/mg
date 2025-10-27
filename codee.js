// src/components/CompositeChartCard.jsx
import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';
import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  LabelList,
  Cell
} from 'recharts';

// Modern professional color palette
const COLOR_SCHEME = {
  // Primary colors for bars
  bars: [
    '#3B82F6', // Blue
    '#10B981', // Emerald
    '#8B5CF6', // Violet
    '#F59E0B', // Amber
    '#EF4444', // Red
    '#06B6D4', // Cyan
    '#84CC16', // Lime
    '#F97316'  // Orange
  ],
  // Line and accent colors
  line: '#8B5CF6',
  capacityLine: '#6B7280',
  // Text and background
  text: {
    primary: '#1F2937',
    secondary: '#6B7280',
    light: '#9CA3AF'
  },
  background: {
    card: '#FFFFFF',
    grid: '#F3F4F6'
  }
};

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <Box
        sx={{
          backgroundColor: 'white',
          padding: 2,
          border: '1px solid #E5E7EB',
          borderRadius: 2,
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
          minWidth: 160
        }}
      >
        <Typography variant="subtitle2" sx={{ color: COLOR_SCHEME.text.primary, fontWeight: 600, mb: 1 }}>
          {label}
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2 }}>
            <Typography variant="body2" sx={{ color: COLOR_SCHEME.text.secondary }}>
              Headcount:
            </Typography>
            <Typography variant="body2" sx={{ color: COLOR_SCHEME.text.primary, fontWeight: 600 }}>
              {data.headcount}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2 }}>
            <Typography variant="body2" sx={{ color: COLOR_SCHEME.text.secondary }}>
              Usage:
            </Typography>
            <Typography variant="body2" sx={{ color: COLOR_SCHEME.text.primary, fontWeight: 600 }}>
              {data.percentage}%
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2 }}>
            <Typography variant="body2" sx={{ color: COLOR_SCHEME.text.secondary }}>
              Capacity:
            </Typography>
            <Typography variant="body2" sx={{ color: COLOR_SCHEME.text.primary, fontWeight: 600 }}>
              {data.capacity}
            </Typography>
          </Box>
        </Box>
      </Box>
    );
  }
  return null;
};

export default function CompositeChartCard({
  title,
  data,
  height = 400,
  animationDuration = 1000
}) {
  if (!Array.isArray(data) || data.length === 0) {
    return (
      <Card 
        sx={{ 
          borderRadius: 2,
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
          border: '1px solid #E5E7EB'
        }}
      >
        <CardContent sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="h6" sx={{ color: COLOR_SCHEME.text.primary, mb: 1 }}>
            {title}
          </Typography>
          <Typography variant="body2" sx={{ color: COLOR_SCHEME.text.secondary }}>
            No data available
          </Typography>
        </CardContent>
      </Card>
    );
  }

  // Process data
  const enriched = data.map((d, i) => ({
    ...d,
    percentage: d.capacity ? Math.round(d.headcount / d.capacity * 100) : 0,
    fill: COLOR_SCHEME.bars[i % COLOR_SCHEME.bars.length]
  }));

  const totalHeadcount = enriched.reduce((sum, d) => sum + (d.headcount || 0), 0);
  const totalCapacity = enriched.reduce((sum, d) => sum + (d.capacity || 0), 0);
  const avgUsage = totalCapacity ? Math.round((totalHeadcount / totalCapacity) * 100) : 0;

  return (
    <Card
      sx={{
        borderRadius: 2,
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
        border: '1px solid #E5E7EB',
        transition: 'all 0.3s ease',
        '&:hover': {
          boxShadow: '0 4px 12px 0 rgba(0, 0, 0, 0.15)'
        }
      }}
    >
      <CardContent sx={{ p: 3 }}>
        {/* Header */}
        <Box sx={{ mb: 3 }}>
          <Typography 
            variant="h6" 
            sx={{ 
              color: COLOR_SCHEME.text.primary,
              fontWeight: 600,
              fontSize: '1.25rem'
            }}
          >
            {title}
          </Typography>
        </Box>

        {/* Chart */}
        <Box sx={{ width: '100%', height }}>
          <ResponsiveContainer>
            <ComposedChart
              data={enriched}
              margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
            >
              <CartesianGrid 
                strokeDasharray="3 3" 
                stroke={COLOR_SCHEME.background.grid}
                vertical={false}
              />
              
              <XAxis
                dataKey="name"
                tickLine={false}
                axisLine={false}
                tick={{ 
                  fill: COLOR_SCHEME.text.secondary,
                  fontSize: 12
                }}
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
                tick={{ 
                  fill: COLOR_SCHEME.text.secondary,
                  fontSize: 12
                }}
              />

              <YAxis
                yAxisId="right"
                orientation="right"
                tickLine={false}
                axisLine={false}
                domain={[0, 100]}
                tickFormatter={val => `${val}%`}
                tick={{ 
                  fill: COLOR_SCHEME.text.secondary,
                  fontSize: 12
                }}
              />

              <Tooltip content={<CustomTooltip />} />

              {/* Headcount Bars */}
              <Bar
                yAxisId="left"
                dataKey="headcount"
                name="Headcount"
                barSize={50}
                radius={[4, 4, 0, 0]}
              >
                {enriched.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
                
                <LabelList
                  dataKey="headcount"
                  position="top"
                  style={{ 
                    fill: COLOR_SCHEME.text.primary,
                    fontSize: 12,
                    fontWeight: 600
                  }}
                />
              </Bar>

              {/* Usage Percentage Line */}
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="percentage"
                name="Usage %"
                stroke={COLOR_SCHEME.line}
                strokeWidth={3}
                dot={{ 
                  fill: COLOR_SCHEME.line,
                  strokeWidth: 2,
                  stroke: '#FFFFFF',
                  r: 6
                }}
                activeDot={{
                  r: 8,
                  fill: '#FFFFFF',
                  stroke: COLOR_SCHEME.line,
                  strokeWidth: 2
                }}
                isAnimationActive
                animationDuration={animationDuration}
              />

              {/* Capacity Line */}
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="capacity"
                name="Capacity"
                stroke={COLOR_SCHEME.capacityLine}
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={false}
                isAnimationActive
                animationDuration={animationDuration}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </Box>

        {/* Summary Stats */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mt: 3,
            pt: 3,
            borderTop: '1px solid #F3F4F6'
          }}
        >
          <Box sx={{ textAlign: 'center', flex: 1 }}>
            <Typography variant="body2" sx={{ color: COLOR_SCHEME.text.secondary, mb: 0.5 }}>
              Total Headcount
            </Typography>
            <Typography variant="h6" sx={{ color: COLOR_SCHEME.bars[0], fontWeight: 700 }}>
              {totalHeadcount}
            </Typography>
          </Box>
          
          <Box sx={{ textAlign: 'center', flex: 1 }}>
            <Typography variant="body2" sx={{ color: COLOR_SCHEME.text.secondary, mb: 0.5 }}>
              Total Capacity
            </Typography>
            <Typography variant="h6" sx={{ color: COLOR_SCHEME.bars[1], fontWeight: 700 }}>
              {totalCapacity}
            </Typography>
          </Box>
          
          <Box sx={{ textAlign: 'center', flex: 1 }}>
            <Typography variant="body2" sx={{ color: COLOR_SCHEME.text.secondary, mb: 0.5 }}>
              Usage Rate
            </Typography>
            <Typography 
              variant="h6" 
              sx={{ 
                color: avgUsage > 80 ? '#EF4444' : avgUsage > 60 ? '#F59E0B' : '#10B981',
                fontWeight: 700 
              }}
            >
              {avgUsage}%
            </Typography>
          </Box>
        </Box>

        {/* Legend */}
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 3, mt: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box sx={{ width: 12, height: 12, backgroundColor: COLOR_SCHEME.bars[0], borderRadius: 1 }} />
            <Typography variant="caption" sx={{ color: COLOR_SCHEME.text.secondary }}>
              Headcount
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box sx={{ width: 12, height: 2, backgroundColor: COLOR_SCHEME.line }} />
            <Typography variant="caption" sx={{ color: COLOR_SCHEME.text.secondary }}>
              Usage %
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box sx={{ width: 12, height: 2, backgroundColor: COLOR_SCHEME.capacityLine, backgroundImage: 'repeating-linear-gradient(90deg, transparent, transparent 2px, #6B7280 2px, #6B7280 4px)' }} />
            <Typography variant="caption" sx={{ color: COLOR_SCHEME.text.secondary }}>
              Capacity
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}