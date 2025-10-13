this is our chart i want to add border and creae more atractive chart ok wht more professal lookig ok 
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

import buildingCapacities from '../data/buildingCapacities';
import floorCapacities from '../data/floorCapacities';

const DARK_TO_LIGHT = [
  '#FFD666', '#FFE599', '#FFF2CC', '#FFE599', '#E0E1DD',
  '#FFD666', '#FFEE8C', '#F8DE7E', '#FBEC5D', '#F0E68C',
  '#FFEE8C', '#21325E', '#415A77', '#6A7F9A', '#B0C4DE',
  '#1A1F36', '#2B3353', '#4C6482', '#7B90B2', '#CAD3E9'
];

function CompositeChartCard({
  title,
  data,
  lineColor = '#fff',
  height = 350,
  animationDuration,
  animationEasing,
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
      <Card sx={{ border: `1px solid #fff`, bgcolor: 'rgba(0,0,0,0.4)', ...sx }}>
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

  const totalHeadcount = enriched.reduce((sum, d) => sum + (d.headcount || 0), 0);
  const totalCapacity = enriched.reduce((sum, d) => sum + (d.capacity || 0), 0);
  const avgUsage = totalCapacity ? Math.round((totalHeadcount / totalCapacity) * 100) : 0;

  return (
    <Card sx={{ borderRadius: 2, overflow: 'hidden', bgcolor: 'rgba(0,0,0,0.4)', transition: 'transform 0.3s, box-shadow 0.3s', '&:hover': { transform: 'scale(1.02)', boxShadow: '0 4px 12px rgba(0,0,0,0.7)' }, ...sx }}>
      <CardContent sx={{ p: 1 }}>
        <Typography variant="subtitle1" align="center" gutterBottom sx={{ color: '#FFC107' }}>
          {title}
        </Typography>
        <Box sx={{ width: '100%', height }}>
          <ResponsiveContainer>
            <ComposedChart data={enriched} margin={{ top: 15, right: 20, left: 0, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="name" tickLine={false} axisLine={false} stroke="rgba(255,255,255,0.6)"
                tickFormatter={label => {
                  const str = String(label || '');
                  const n = parseInt((str.match(/\d+/) || [])[0], 10);
                  if (!isNaN(n)) {
                    if (n % 100 >= 11 && n % 100 <= 13) return `${n}th`;
                    switch (n % 10) {
                      case 1: return `${n}st`;
                      case 2: return `${n}nd`;
                      case 3: return `${n}rd`;
                      default: return `${n}th`;
                    }
                  }
                  return str;
                }}
              />
              <YAxis yAxisId="left" tickLine={false} axisLine={false} stroke="rgba(255,255,255,0.6)" />
              <YAxis yAxisId="right" orientation="right" tickLine={false} axisLine={false} stroke="rgba(255,255,255,0.6)" domain={[0, 100]} tickFormatter={v => `${v}%`} />
              <Tooltip
                contentStyle={{ backgroundColor: '#FFD666', borderColor: lineColor, padding: 8 }}
                content={({ active, payload, label }) => {
                  if (!active || !payload?.length) return null;
                  const d = payload[0].payload;
                  return (
                    <div style={{ backgroundColor: '#FFD666', border: `1px solid ${lineColor}`, borderRadius: 4, padding: 8 }}>
                      <div style={{ fontWeight: 700, marginBottom: 4 }}>{label}</div>
                      <div>Headcount: {d.headcount}</div>
                      <div>Usage %: {d.percentage}%</div>
                      <div>Seat Capacity: {d.capacity}</div>
                    </div>
                  );
                }}
              />
              <Bar yAxisId="left" dataKey="headcount" name="Headcount" barSize={700} isAnimationActive={false}>
                {enriched.map((e, i) => <Cell key={i} fill={e._color} />)}
                <LabelList dataKey="headcount" position="top" formatter={v => `${v}`} style={{ fill: '#fff', fontSize: 15, fontWeight: 700 }} />

                <LabelList dataKey="percentage" position="inside" formatter={v => `${v}%`} style={{ fill: '#EE4B2B', fontSize: 14, fontWeight: 700 }} />
              </Bar>
              <Line yAxisId="right" type="monotone" dataKey="percentage" name="Usage %" stroke="#FF0000" strokeWidth={2} dot={false} isAnimationActive={false} />
              <Line yAxisId="left" type="monotone" 
              
               name="Total Seats" stroke="#81C784" strokeDasharray="5 5" dot={false} isAnimationActive={false} />
            </ComposedChart>
          </ResponsiveContainer>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 4, alignItems: 'center', mb: 1, fontWeight: 'bold', fontSize: 16 }}>
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


