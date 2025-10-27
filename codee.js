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
  Cell,
} from 'recharts';
import { Users, BarChart2, Activity } from 'lucide-react';

const GRADIENT_COLORS = [
  '#00B4DB', '#0083B0', '#6A11CB', '#2575FC', '#5EFCE8',
  '#7367F0', '#0F2027', '#203A43', '#2C5364', '#00C9FF',
  '#92FE9D', '#43C6AC', '#191654', '#4776E6', '#8E54E9'
];

export default function CompositeChartCard({
  title,
  data,
  lineColor = '#00E5FF',
  height = 240,
  animationDuration = 1200,
  animationEasing = 'ease-in-out'
}) {
  if (!Array.isArray(data) || data.length === 0) {
    return (
      <Card sx={{ borderRadius: 3, backdropFilter: 'blur(8px)', bgcolor: 'rgba(255,255,255,0.05)', color: '#ccc', p: 2 }}>
        <CardContent>
          <Typography variant="subtitle1" align="center" sx={{ color: '#aaa' }}>
            {title}
          </Typography>
          <Typography variant="body2" align="center" sx={{ mt: 3 }}>
            No realtime employee data
          </Typography>
        </CardContent>
      </Card>
    );
  }

  // Enrich each datum
  const enriched = data.map((d, i) => ({
    ...d,
    percentage: d.capacity ? Math.round((d.headcount / d.capacity) * 100) : 0,
    _color: GRADIENT_COLORS[i % GRADIENT_COLORS.length],
  }));

  const totalHeadcount = enriched.reduce((sum, d) => sum + (d.headcount || 0), 0);
  const totalCapacity = enriched.reduce((sum, d) => sum + (d.capacity || 0), 0);
  const avgUsage = totalCapacity ? Math.round((totalHeadcount / totalCapacity) * 100) : 0;

  return (
    <Card
      sx={{
        borderRadius: 3,
        overflow: 'hidden',
        background: 'linear-gradient(135deg, rgba(18,18,18,0.85) 0%, rgba(35,35,35,0.8) 100%)',
        boxShadow: '0 8px 20px rgba(0,0,0,0.4)',
        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 12px 28px rgba(0,0,0,0.6)',
        },
      }}
    >
      <CardContent sx={{ p: 2.5 }}>
        <Typography
          variant="subtitle1"
          align="center"
          sx={{
            color: '#00E5FF',
            fontWeight: 600,
            letterSpacing: 0.5,
            mb: 1.5,
          }}
        >
          {title}
        </Typography>

        <Box sx={{ width: '100%', height }}>
          <ResponsiveContainer>
            <ComposedChart
              data={enriched}
              margin={{ top: 10, right: 20, left: 10, bottom: 25 }}
            >
              <defs>
                <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#00C9FF" stopOpacity={0.9} />
                  <stop offset="100%" stopColor="#92FE9D" stopOpacity={0.8} />
                </linearGradient>
              </defs>

              <CartesianGrid strokeDasharray="4 4" stroke="rgba(255,255,255,0.08)" />
              <XAxis
                dataKey="name"
                tickLine={false}
                axisLine={false}
                stroke="rgba(255,255,255,0.6)"
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
                tickFormatter={(v) => `${v}%`}
              />

              <Tooltip
                cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                contentStyle={{
                  backgroundColor: 'rgba(20,20,20,0.9)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  borderRadius: 8,
                  color: '#fff',
                }}
                labelStyle={{ fontWeight: 700, color: '#00E5FF' }}
                formatter={(value, key) => {
                  if (key === 'headcount') return [`${value}`, 'Headcount'];
                  if (key === 'percentage') return [`${value}%`, 'Usage'];
                  return value;
                }}
              />

              <Bar
                yAxisId="left"
                dataKey="headcount"
                radius={[8, 8, 0, 0]}
                barSize={28}
              >
                {enriched.map((entry, index) => (
                  <Cell key={index} fill={entry._color} />
                ))}
                <LabelList
                  dataKey="headcount"
                  position="top"
                  style={{ fill: '#fff', fontSize: 12, fontWeight: 600 }}
                />
              </Bar>

              <Line
                yAxisId="right"
                type="monotone"
                dataKey="percentage"
                stroke={lineColor}
                strokeWidth={3}
                dot={{ r: 4, fill: lineColor, strokeWidth: 0 }}
                isAnimationActive
                animationDuration={animationDuration}
                animationEasing={animationEasing}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </Box>

        {/* Summary footer */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-around',
            alignItems: 'center',
            mt: 2,
            py: 1,
            borderTop: '1px solid rgba(255,255,255,0.08)',
            color: '#ddd',
            fontWeight: 600,
            fontSize: 14,
          }}
        >
          <Box display="flex" alignItems="center" gap={1}>
            <Users size={16} color="#00E5FF" />
            <span>{totalHeadcount} Headcount</span>
          </Box>
          <Box display="flex" alignItems="center" gap={1}>
            <BarChart2 size={16} color="#43C6AC" />
            <span>{totalCapacity} Seats</span>
          </Box>
          <Box display="flex" alignItems="center" gap={1}>
            <Activity size={16} color={avgUsage > 80 ? '#FF5252' : '#FFC107'} />
            <span>{avgUsage}% Usage</span>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}