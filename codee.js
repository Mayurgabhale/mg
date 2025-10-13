import React, { useMemo } from 'react';
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
import { Card, CardContent, Box, Typography } from '@mui/material';
import isEqual from 'lodash/isEqual';

const DARK_TO_LIGHT = [
  '#FFD666', '#FFE599', '#FFF2CC', '#FFE599', '#E0E1DD',
  '#FFD666', '#FFEE8C', '#F8DE7E', '#FBEC5D', '#F0E68C',
  '#FFEE8C', '#21325E', '#415A77', '#6A7F9A', '#B0C4DE',
  '#1A1F36', '#2B3353', '#4C6482', '#7B90B2', '#CAD3E9'
];

function CompositeChartCard({
  title,
  data,
  lineColor = '#FF0000',
  height = 350,
  sx
}) {
  const enriched = useMemo(() => {
    return data.map((d, i) => ({
      ...d,
      percentage: d.capacity ? Math.round(d.headcount / d.capacity * 100) : 0,
      _color: DARK_TO_LIGHT[i % DARK_TO_LIGHT.length]
    }));
  }, [data]);

  if (!Array.isArray(data) || data.length === 0) {
    return (
      <Card sx={{ border: `1px solid rgba(255,255,255,0.2)`, bgcolor: 'rgba(0,0,0,0.4)', ...sx }}>
        <CardContent>
          <Typography variant="subtitle1" align="center" color="text.secondary">{title}</Typography>
          <Typography variant="body2" align="center" sx={{ mt: 4 }}>No realtime employee data</Typography>
        </CardContent>
      </Card>
    );
  }

  const totalHeadcount = enriched.reduce((sum, d) => sum + (d.headcount || 0), 0);
  const totalCapacity = enriched.reduce((sum, d) => sum + (d.capacity || 0), 0);
  const avgUsage = totalCapacity ? Math.round((totalHeadcount / totalCapacity) * 100) : 0;

  return (
    <Card
      sx={{
        borderRadius: 3,
        overflow: 'hidden',
        border: '2px solid #FFC107',
        bgcolor: 'rgba(0,0,0,0.6)',
        transition: 'all 0.3s ease',
        '&:hover': { transform: 'scale(1.03)', boxShadow: '0 8px 20px rgba(0,0,0,0.8)' },
        ...sx
      }}
    >
      <CardContent sx={{ p: 2 }}>
        <Typography variant="h6" align="center" gutterBottom sx={{ color: '#FFC107', fontWeight: 'bold' }}>
          {title}
        </Typography>

        <Box sx={{ width: '100%', height }}>
          <ResponsiveContainer>
            <ComposedChart
              data={enriched}
              margin={{ top: 20, right: 30, left: 10, bottom: 20 }}
            >
              <CartesianGrid strokeDasharray="4 4" stroke="rgba(255,255,255,0.15)" />
              <XAxis
                dataKey="name"
                tickLine={false}
                axisLine={{ stroke: 'rgba(255,255,255,0.6)', strokeWidth: 1 }}
                stroke="rgba(255,255,255,0.8)"
                tick={{ fontSize: 12 }}
              />
              <YAxis
                yAxisId="left"
                tickLine={false}
                axisLine={{ stroke: 'rgba(255,255,255,0.6)', strokeWidth: 1 }}
                stroke="rgba(255,255,255,0.8)"
                tick={{ fontSize: 12 }}
              />
              <YAxis
                yAxisId="right"
                orientation="right"
                tickLine={false}
                axisLine={{ stroke: 'rgba(255,255,255,0.6)', strokeWidth: 1 }}
                stroke="rgba(255,255,255,0.8)"
                domain={[0, 100]}
                tickFormatter={v => `${v}%`}
                tick={{ fontSize: 12 }}
              />
              <Tooltip
                wrapperStyle={{ outline: 'none' }}
                content={({ active, payload, label }) => {
                  if (!active || !payload?.length) return null;
                  const d = payload[0].payload;
                  return (
                    <div style={{
                      backgroundColor: '#FFF9C4',
                      border: `1px solid ${lineColor}`,
                      borderRadius: 6,
                      padding: 10,
                      boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
                      fontSize: 13
                    }}>
                      <strong>{label}</strong>
                      <div>Headcount: {d.headcount}</div>
                      <div>Usage %: {d.percentage}%</div>
                      <div>Capacity: {d.capacity}</div>
                    </div>
                  );
                }}
              />
              <Bar
                yAxisId="left"
                dataKey="headcount"
                barSize={40}
                radius={[5,5,0,0]}
                name="Headcount"
              >
                {enriched.map((e, i) => (
                  <Cell key={i} fill={e._color} />
                ))}
                <LabelList dataKey="headcount" position="top" style={{ fill: '#fff', fontWeight: 700, fontSize: 13 }} />
              </Bar>
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="percentage"
                name="Usage %"
                stroke={lineColor}
                strokeWidth={2.5}
                dot={{ r: 4, stroke: '#fff', strokeWidth: 2 }}
              />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="capacity"
                name="Total Seats"
                stroke="#4CAF50"
                strokeDasharray="5 5"
                strokeWidth={2}
                dot={false}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </Box>

        <Box sx={{
          display: 'flex',
          justifyContent: 'space-around',
          mt: 2,
          flexWrap: 'wrap',
          fontWeight: 'bold',
          fontSize: 14
        }}>
          <Box sx={{ color: '#FFD700' }}>Total Headcount: {totalHeadcount}</Box>
          <Box sx={{ color: '#4CAF50' }}>Total Seats: {totalCapacity}</Box>
          <Box sx={{ color: '#FF4C4C' }}>Usage: {avgUsage}%</Box>
        </Box>
      </CardContent>
    </Card>
  );
}

export default React.memo(CompositeChartCard, (prev, next) =>
  isEqual(prev.data, next.data) &&
  prev.lineColor === next.lineColor &&
  prev.height === next.height
);