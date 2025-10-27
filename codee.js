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

// Professional gradient color scheme
const PROFESSIONAL_COLORS = [
  '#6366F1', '#8B5CF6', '#EC4899', '#F59E0B', '#10B981',
  '#3B82F6', '#06B6D4', '#84CC16', '#F97316', '#EF4444',
  '#A855F7', '#14B8A6', '#EAB308', '#DC2626', '#7C3AED'
];

// Gradient generator for bars
const getBarGradient = (baseColor, index) => {
  const gradients = {
    '#6366F1': ['#818CF8', '#6366F1'],
    '#8B5CF6': ['#A78BFA', '#8B5CF6'],
    '#EC4899': ['#F472B6', '#EC4899'],
    '#F59E0B': ['#FBBF24', '#F59E0B'],
    '#10B981': ['#34D399', '#10B981'],
    '#3B82F6': ['#60A5FA', '#3B82F6'],
    '#06B6D4': ['#22D3EE', '#06B6D4'],
    '#84CC16': ['#A3E635', '#84CC16'],
    '#F97316': ['#FB923C', '#F97316'],
    '#EF4444': ['#F87171', '#EF4444']
  };
  return gradients[baseColor] || [baseColor, baseColor];
};

export default function CompositeChartCard({
  title,
  data,
  lineColor = '#F59E0B',
  height = 200,
  animationDuration = 1500,
  animationEasing = 'ease-in-out'
}) {
  if (!Array.isArray(data) || data.length === 0) {
    return (
      <Card sx={{ 
        border: `1px solid rgba(255,255,255,0.2)`, 
        bgcolor: 'rgba(15,23,42,0.8)',
        backdropFilter: 'blur(10px)',
        borderRadius: 3
      }}>
        <CardContent>
          <Typography variant="subtitle1" align="center" sx={{ color: '#F1F5F9' }}>
            {title}
          </Typography>
          <Typography variant="body2" align="center" sx={{ mt: 4, color: '#94A3B8' }}>
            No realtime employee data
          </Typography>
        </CardContent>
      </Card>
    );
  }

  // Enrich each datum with its usage percentage and colors
  const enriched = data.map((d, i) => {
    const baseColor = PROFESSIONAL_COLORS[i % PROFESSIONAL_COLORS.length];
    const gradient = getBarGradient(baseColor, i);
    
    return {
      ...d,
      percentage: d.capacity ? Math.round(d.headcount / d.capacity * 100) : 0,
      _color: baseColor,
      _gradient: gradient
    };
  });

  const totalHeadcount = enriched.reduce((sum, d) => sum + (d.headcount || 0), 0);
  const totalCapacity = enriched.reduce((sum, d) => sum + (d.capacity || 0), 0);
  const avgUsage = totalCapacity ? Math.round((totalHeadcount / totalCapacity) * 100) : 0;

  return (
    <Card
      sx={{
        background: 'linear-gradient(135deg, rgba(15,23,42,0.9) 0%, rgba(30,41,59,0.8) 100%)',
        border: `1px solid rgba(255,255,255,0.15)`,
        borderRadius: 3,
        overflow: 'hidden',
        backdropFilter: 'blur(12px)',
        transition: 'transform 0.3s, box-shadow 0.3s',
        '&:hover': {
          transform: 'scale(1.02)',
          boxShadow: '0 8px 32px rgba(99, 102, 241, 0.3)'
        }
      }}
    >
      <CardContent sx={{ p: 2 }}>
        <Typography
          variant="subtitle1"
          align="center"
          gutterBottom
          sx={{ 
            color: '#F59E0B',
            fontWeight: 600,
            fontSize: '1.1rem',
            textShadow: '0 2px 4px rgba(0,0,0,0.3)'
          }}
        >
          {title}
        </Typography>
        
        <Box sx={{ width: '100%', height }}>
          <ResponsiveContainer>
            <ComposedChart
              data={enriched}
              margin={{ top: 10, right: 20, left: 0, bottom: 20 }}
            >
              <defs>
                {enriched.map((entry, index) => (
                  <linearGradient 
                    key={index} 
                    id={`gradient-${index}`} 
                    x1="0" 
                    y1="0" 
                    x2="0" 
                    y2="1"
                  >
                    <stop offset="0%" stopColor={entry._gradient[0]} />
                    <stop offset="100%" stopColor={entry._gradient[1]} />
                  </linearGradient>
                ))}
              </defs>

              <CartesianGrid 
                strokeDasharray="3 3" 
                stroke="rgba(255,255,255,0.1)" 
                vertical={false}
              />
              
              <XAxis
                dataKey="name"
                tickLine={false}
                axisLine={false}
                stroke="rgba(255,255,255,0.7)"
                tick={{ fill: '#E2E8F0', fontSize: 12 }}
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
                stroke="rgba(255,255,255,0.7)"
                tick={{ fill: '#E2E8F0', fontSize: 12 }}
              />

              <YAxis
                yAxisId="right"
                orientation="right"
                tickLine={false}
                axisLine={false}
                stroke="rgba(255,255,255,0.7)"
                domain={[0, 100]}
                tickFormatter={val => `${val}%`}
                tick={{ fill: '#E2E8F0', fontSize: 12 }}
              />

              <Tooltip
                contentStyle={{ 
                  backgroundColor: 'rgba(15,23,42,0.95)',
                  border: `1px solid ${lineColor}`,
                  borderRadius: 8,
                  padding: 12,
                  backdropFilter: 'blur(8px)',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.4)'
                }}
                labelStyle={{
                  color: '#F59E0B',
                  fontWeight: 600,
                  marginBottom: 8
                }}
                itemStyle={{
                  color: '#E2E8F0',
                  fontSize: 13
                }}
                formatter={(value, name) => {
                  if (name === 'Usage %') return [`${value}%`, name];
                  return [value, name];
                }}
              />

              {/* Headcount bars with gradient colors */}
              <Bar
                yAxisId="left"
                dataKey="headcount"
                name="Headcount"
                barSize={60}
                radius={[4, 4, 0, 0]}
              >
                {enriched.map((entry, idx) => (
                  <Cell 
                    key={`cell-${idx}`} 
                    fill={`url(#gradient-${idx})`}
                    stroke={entry._color}
                    strokeWidth={1}
                  />
                ))}

                {/* Top headcount */}
                <LabelList
                  dataKey="headcount"
                  position="top"
                  formatter={(val) => `${val}`}
                  style={{ 
                    fill: '#FFFFFF', 
                    fontSize: 12, 
                    fontWeight: 700,
                    textShadow: '0 1px 2px rgba(0,0,0,0.5)'
                  }}
                />

                {/* Inside percentage */}
                <LabelList
                  dataKey="percentage"
                  position="insideTop"
                  offset={10}
                  formatter={(val) => `${val}%`}
                  style={{ 
                    fill: '#FFFFFF', 
                    fontSize: 11, 
                    fontWeight: 600,
                    textShadow: '0 1px 2px rgba(0,0,0,0.5)'
                  }}
                />
              </Bar>

              {/* Usage Percentage line */}
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="percentage"
                name="Usage %"
                stroke={lineColor}
                strokeWidth={3}
                dot={{
                  fill: lineColor,
                  strokeWidth: 2,
                  stroke: '#FFFFFF',
                  r: 4
                }}
                activeDot={{
                  r: 6,
                  fill: '#FFFFFF',
                  stroke: lineColor,
                  strokeWidth: 2
                }}
                isAnimationActive
                animationDuration={animationDuration}
                animationEasing={animationEasing}
              />

              {/* Capacity line */}
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="capacity"
                name="Total Seats"
                stroke="#10B981"
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={false}
                isAnimationActive
                animationDuration={animationDuration}
                animationEasing={animationEasing}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </Box>

        {/* Summary Stats */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            gap: 4,
            alignItems: 'center',
            mt: 2,
            pt: 2,
            borderTop: '1px solid rgba(255,255,255,0.1)'
          }}
        >
          <Box sx={{ 
            color: '#60A5FA',
            fontWeight: 'bold',
            fontSize: 14,
            textAlign: 'center'
          }}>
            Total Headcount: {totalHeadcount}
          </Box>
          <Box sx={{ 
            color: '#10B981',
            fontWeight: 'bold',
            fontSize: 14,
            textAlign: 'center'
          }}>
            Total Seats: {totalCapacity}
          </Box>
          <Box sx={{ 
            color: avgUsage > 80 ? '#EF4444' : avgUsage > 60 ? '#F59E0B' : '#10B981',
            fontWeight: 'bold',
            fontSize: 14,
            textAlign: 'center'
          }}>
            Usage: {avgUsage}%
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}