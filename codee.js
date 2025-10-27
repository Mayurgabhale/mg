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
  Legend,
  LabelList,
  Cell
} from 'recharts';

// Professional color palette
const COLOR_SCHEME = {
  primary: {
    blue: '#2563eb',
    indigo: '#4f46e5',
    purple: '#7c3aed',
    cyan: '#0891b2',
    teal: '#0d9488'
  },
  secondary: {
    amber: '#f59e0b',
    orange: '#ea580c',
    rose: '#e11d48',
    emerald: '#10b981',
    violet: '#8b5cf6'
  },
  gradients: {
    blue: ['#3b82f6', '#1d4ed8'],
    purple: ['#8b5cf6', '#7c3aed'],
    teal: ['#14b8a6', '#0d9488'],
    amber: ['#f59e0b', '#d97706']
  },
  neutrals: {
    white: '#ffffff',
    lightGray: '#f8fafc',
    darkGray: '#334155',
    darkerGray: '#1e293b'
  }
};

// Professional gradient bars
const BAR_GRADIENTS = [
  'url(#blueGradient)',
  'url(#purpleGradient)',
  'url(#tealGradient)',
  'url(#amberGradient)',
  'url(#indigoGradient)'
];

export default function CompositeChartCard({
  title,
  data,
  lineColor = '#f59e0b',
  height = 320,
  animationDuration = 1500,
  animationEasing = 'ease-out'
}) {
  if (!Array.isArray(data) || data.length === 0) {
    return (
      <Card sx={{
        background: 'linear-gradient(135deg, rgba(30,41,59,0.8) 0%, rgba(15,23,42,0.9) 100%)',
        border: '1px solid rgba(255,255,255,0.1)',
        backdropFilter: 'blur(10px)',
        borderRadius: 3,
        boxShadow: '0 8px 32px rgba(0,0,0,0.3)'
      }}>
        <CardContent sx={{ p: 3 }}>
          <Typography 
            variant="h6" 
            align="center" 
            sx={{ 
              color: COLOR_SCHEME.neutrals.white,
              fontWeight: 600,
              mb: 2
            }}
          >
            {title}
          </Typography>
          <Typography 
            variant="body2" 
            align="center" 
            sx={{ 
              mt: 4, 
              color: COLOR_SCHEME.neutrals.lightGray,
              opacity: 0.8
            }}
          >
            No realtime employee data available
          </Typography>
        </CardContent>
      </Card>
    );
  }

  // Enrich data with colors and percentages
  const enriched = data.map((d, i) => ({
    ...d,
    percentage: d.capacity ? Math.round(d.headcount / d.capacity * 100) : 0,
    _color: BAR_GRADIENTS[i % BAR_GRADIENTS.length],
    _solidColor: Object.values(COLOR_SCHEME.primary)[i % Object.values(COLOR_SCHEME.primary).length]
  }));

  const totalHeadcount = enriched.reduce((sum, d) => sum + (d.headcount || 0), 0);
  const totalCapacity = enriched.reduce((sum, d) => sum + (d.capacity || 0), 0);
  const avgUsage = totalCapacity ? Math.round((totalHeadcount / totalCapacity) * 100) : 0;

  return (
    <Card
      sx={{
        background: 'linear-gradient(135deg, rgba(30,41,59,0.9) 0%, rgba(15,23,42,0.95) 100%)',
        border: '1px solid rgba(255,255,255,0.15)',
        borderRadius: 3,
        overflow: 'hidden',
        backdropFilter: 'blur(12px)',
        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        boxShadow: '0 4px 24px rgba(0,0,0,0.2)',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 12px 40px rgba(0,0,0,0.4)',
          borderColor: 'rgba(255,255,255,0.25)'
        }
      }}
    >
      <CardContent sx={{ p: 3 }}>
        {/* Header */}
        <Box sx={{ textAlign: 'center', mb: 3 }}>
          <Typography
            variant="h6"
            sx={{
              color: COLOR_SCHEME.neutrals.white,
              fontWeight: 700,
              fontSize: '1.25rem',
              background: `linear-gradient(135deg, ${COLOR_SCHEME.secondary.amber} 0%, ${COLOR_SCHEME.secondary.rose} 100%)`,
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              textShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}
          >
            {title}
          </Typography>
        </Box>

        {/* Chart Container */}
        <Box sx={{ width: '100%', height }}>
          <ResponsiveContainer>
            <ComposedChart
              data={enriched}
              margin={{ top: 20, right: 30, left: 20, bottom: 25 }}
            >
              {/* SVG Definitions for Gradients */}
              <defs>
                <linearGradient id="blueGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={COLOR_SCHEME.gradients.blue[0]} />
                  <stop offset="100%" stopColor={COLOR_SCHEME.gradients.blue[1]} />
                </linearGradient>
                <linearGradient id="purpleGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={COLOR_SCHEME.gradients.purple[0]} />
                  <stop offset="100%" stopColor={COLOR_SCHEME.gradients.purple[1]} />
                </linearGradient>
                <linearGradient id="tealGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={COLOR_SCHEME.gradients.teal[0]} />
                  <stop offset="100%" stopColor={COLOR_SCHEME.gradients.teal[1]} />
                </linearGradient>
                <linearGradient id="amberGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={COLOR_SCHEME.gradients.amber[0]} />
                  <stop offset="100%" stopColor={COLOR_SCHEME.gradients.amber[1]} />
                </linearGradient>
                <linearGradient id="indigoGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={COLOR_SCHEME.primary.indigo} />
                  <stop offset="100%" stopColor={COLOR_SCHEME.primary.blue} />
                </linearGradient>
              </defs>

              <CartesianGrid 
                strokeDasharray="3 3" 
                stroke="rgba(255,255,255,0.08)"
                vertical={false}
              />
              
              <XAxis
                dataKey="name"
                tickLine={false}
                axisLine={false}
                stroke="rgba(255,255,255,0.7)"
                tick={{ fill: 'rgba(255,255,255,0.8)', fontSize: 12, fontWeight: 500 }}
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
                tick={{ fill: 'rgba(255,255,255,0.8)', fontSize: 12 }}
              />

              <YAxis
                yAxisId="right"
                orientation="right"
                tickLine={false}
                axisLine={false}
                stroke="rgba(255,255,255,0.7)"
                domain={[0, 100]}
                tickFormatter={val => `${val}%`}
                tick={{ fill: 'rgba(255,255,255,0.8)', fontSize: 12 }}
              />

              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(15,23,42,0.95)',
                  border: `1px solid ${COLOR_SCHEME.primary.blue}`,
                  borderRadius: 8,
                  padding: '12px 16px',
                  backdropFilter: 'blur(8px)',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.4)'
                }}
                labelStyle={{
                  color: COLOR_SCHEME.neutrals.white,
                  fontWeight: 600,
                  marginBottom: 8,
                  fontSize: 14
                }}
                itemStyle={{
                  color: COLOR_SCHEME.neutrals.lightGray,
                  fontSize: 13,
                  padding: '4px 0'
                }}
                formatter={(value, name) => {
                  if (name === 'Usage %') return [`${value}%`, name];
                  return [value, name];
                }}
              />

              {/* Headcount Bars with Gradients */}
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
                    fill={entry._color}
                    stroke={entry._solidColor}
                    strokeWidth={1}
                  />
                ))}
                
                <LabelList
                  dataKey="headcount"
                  position="top"
                  formatter={(val) => `${val}`}
                  style={{ 
                    fill: COLOR_SCHEME.neutrals.white, 
                    fontSize: 12, 
                    fontWeight: 700,
                    textShadow: '0 1px 2px rgba(0,0,0,0.5)'
                  }}
                />

                <LabelList
                  dataKey="percentage"
                  position="insideTop"
                  offset={12}
                  formatter={(val) => `${val}%`}
                  style={{ 
                    fill: COLOR_SCHEME.neutrals.white, 
                    fontSize: 11, 
                    fontWeight: 600,
                    textShadow: '0 1px 2px rgba(0,0,0,0.5)'
                  }}
                />
              </Bar>

              {/* Usage Percentage Line */}
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
                  stroke: COLOR_SCHEME.neutrals.white,
                  r: 6
                }}
                activeDot={{
                  r: 8,
                  fill: COLOR_SCHEME.neutrals.white,
                  stroke: lineColor,
                  strokeWidth: 2
                }}
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
            mt: 3,
            pt: 2,
            borderTop: '1px solid rgba(255,255,255,0.1)'
          }}
        >
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="subtitle2" sx={{ color: COLOR_SCHEME.secondary.amber, fontWeight: 600, fontSize: 14 }}>
              Total Headcount
            </Typography>
            <Typography variant="h6" sx={{ color: COLOR_SCHEME.neutrals.white, fontWeight: 700, fontSize: 18 }}>
              {totalHeadcount}
            </Typography>
          </Box>
          
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="subtitle2" sx={{ color: COLOR_SCHEME.secondary.emerald, fontWeight: 600, fontSize: 14 }}>
              Total Seats
            </Typography>
            <Typography variant="h6" sx={{ color: COLOR_SCHEME.neutrals.white, fontWeight: 700, fontSize: 18 }}>
              {totalCapacity}
            </Typography>
          </Box>
          
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="subtitle2" sx={{ color: COLOR_SCHEME.secondary.rose, fontWeight: 600, fontSize: 14 }}>
              Usage Rate
            </Typography>
            <Typography variant="h6" sx={{ color: COLOR_SCHEME.neutrals.white, fontWeight: 700, fontSize: 18 }}>
              {avgUsage}%
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}