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
import { Users, Database, TrendingUp } from 'lucide-react';

const BAR_COLORS = [
  '#2F80ED', '#56CCF2', '#6FCF97', '#F2C94C', '#BB6BD9',
  '#EB5757', '#27AE60', '#F2994A', '#9B51E0', '#219653'
];

export default function CompositeChartCard({
  title,
  data,
  lineColor = '#1976d2',
  height = 230,
  animationDuration = 1200,
  animationEasing = 'ease-in-out'
}) {
  if (!Array.isArray(data) || data.length === 0) {
    return (
      <Card
        sx={{
          borderRadius: 2,
          bgcolor: 'background.paper',
          border: '1px solid rgba(0,0,0,0.1)',
          boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
        }}
      >
        <CardContent>
          <Typography variant="subtitle1" align="center" color="text.secondary">
            {title}
          </Typography>
          <Typography variant="body2" align="center" sx={{ mt: 4 }}>
            No realtime employee data
          </Typography>
        </CardContent>
      </Card>
    );
  }

  const enriched = data.map((d, i) => ({
    ...d,
    percentage: d.capacity ? Math.round((d.headcount / d.capacity) * 100) : 0,
    _color: BAR_COLORS[i % BAR_COLORS.length],
  }));

  const totalHeadcount = enriched.reduce((sum, d) => sum + (d.headcount || 0), 0);
  const totalCapacity = enriched.reduce((sum, d) => sum + (d.capacity || 0), 0);
  const avgUsage = totalCapacity ? Math.round((totalHeadcount / totalCapacity) * 100) : 0;

  return (
    <Card
      sx={{
        borderRadius: 2,
        overflow: 'hidden',
        bgcolor: 'background.paper',
        border: '1px solid rgba(0,0,0,0.08)',
        boxShadow: '0 3px 10px rgba(0,0,0,0.05)',
        transition: 'all 0.25s ease',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: '0 6px 16px rgba(0,0,0,0.1)',
        },
      }}
    >
      <CardContent sx={{ p: 2 }}>
        <Typography
          variant="subtitle1"
          align="center"
          gutterBottom
          sx={{
            fontWeight: 600,
            color: 'text.primary',
            mb: 1.5,
          }}
        >
          {title}
        </Typography>

        <Box sx={{ width: '100%', height }}>
          <ResponsiveContainer>
            <ComposedChart
              data={enriched}
              margin={{ top: 10, right: 20, left: 10, bottom: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" />
              <XAxis
                dataKey="name"
                tickLine={false}
                axisLine={{ stroke: 'rgba(0,0,0,0.1)' }}
                stroke="rgba(0,0,0,0.6)"
              />
              <YAxis
                yAxisId="left"
                tickLine={false}
                axisLine={{ stroke: 'rgba(0,0,0,0.1)' }}
                stroke="rgba(0,0,0,0.6)"
              />
              <YAxis
                yAxisId="right"
                orientation="right"
                tickLine={false}
                axisLine={{ stroke: 'rgba(0,0,0,0.1)' }}
                stroke="rgba(0,0,0,0.6)"
                domain={[0, 100]}
                tickFormatter={(v) => `${v}%`}
              />

              <Tooltip
                cursor={{ fill: 'rgba(25,118,210,0.05)' }}
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid rgba(0,0,0,0.1)',
                  borderRadius: 6,
                  boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                  color: '#333',
                }}
                labelStyle={{ fontWeight: 600 }}
                formatter={(val, key) => {
                  if (key === 'percentage') return [`${val}%`, 'Usage'];
                  return val;
                }}
              />

              {/* Headcount Bars */}
              <Bar
                yAxisId="left"
                dataKey="headcount"
                radius={[6, 6, 0, 0]}
                barSize={28}
                isAnimationActive
                animationDuration={animationDuration}
                animationEasing={animationEasing}
              >
                {enriched.map((entry, i) => (
                  <Cell key={i} fill={entry._color} />
                ))}
                <LabelList
                  dataKey="headcount"
                  position="top"
                  style={{ fill: '#333', fontSize: 12, fontWeight: 500 }}
                />
              </Bar>

              {/* Usage Line */}
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="percentage"
                stroke={lineColor}
                strokeWidth={2.5}
                dot={{ r: 4, fill: lineColor, strokeWidth: 0 }}
                isAnimationActive
                animationDuration={animationDuration}
                animationEasing={animationEasing}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </Box>

        {/* Summary Row */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-around',
            alignItems: 'center',
            borderTop: '1px solid rgba(0,0,0,0.05)',
            mt: 2,
            pt: 1,
            color: 'text.secondary',
            fontWeight: 500,
            fontSize: 14,
          }}
        >
          <Box display="flex" alignItems="center" gap={0.5}>
            <Users size={16} color="#1976d2" />
            <span>{totalHeadcount}</span>
          </Box>
          <Box display="flex" alignItems="center" gap={0.5}>
            <Database size={16} color="#388E3C" />
            <span>{totalCapacity}</span>
          </Box>
          <Box display="flex" alignItems="center" gap={0.5}>
            <TrendingUp size={16} color={avgUsage > 80 ? '#D32F2F' : '#F9A825'} />
            <span>{avgUsage}%</span>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}