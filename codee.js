in indai bar chart podium floor always dipolsy in center 
tower b podium then hyderbad ok 

//C:\Users\W0024618\Desktop\apac-occupancy-frontend\src\pages\Dashboard.jsx
import React, { useMemo } from 'react';
import { Container, Box, Typography, Skeleton, Paper } from '@mui/material';

import Header from '../components/Header';
import Footer from '../components/Footer';

import SummaryCard from '../components/SummaryCard';
import CompositeChartCard from '../components/CompositeChartCard';
import PieChartCard from '../components/PieChartCard';

import { useLiveOccupancy } from '../hooks/useLiveOccupancy';
import { partitionList } from '../services/occupancy.service';
import buildingCapacities from '../data/buildingCapacities';
import floorCapacities from '../data/floorCapacities';
import LoadingSpinner from '../components/LoadingSpinner';


import indiaFlag from '../assets/flags/india.png';
import japanFlag from '../assets/flags/japan.png';
import malaysiaFlag from '../assets/flags/malaysia.png';
import philippinesFlag from '../assets/flags/philippines.png';
import SingaporeFlag from '../assets/flags/Singapore.png';


// const palette15 = [
//   '#FFC107', '#E57373', '#4CAF50', '#FFEB3B', '#FFD666',
//   '#8BC34A', '#3F51B5', '#9C27B0', '#00BCD4', '#8BC34A',
//   '#FF9800', '#673AB7', '#009688', '#CDDC39', '#795548'];



const palette15 = [
  '#6dcd71ff'];

const flagMap = {
  'Pune': indiaFlag,
  'Quezon City': philippinesFlag,
  'JP.Tokyo': japanFlag,
  'MY.Kuala Lumpur': malaysiaFlag,
  'Taguig City': philippinesFlag,
  'IN.HYD': indiaFlag,
  'SG.Singapore': SingaporeFlag
};


const displayNameMap = {
  'IN.HYD': 'Hyderabad',
  'JP.Tokyo': 'Tokyo',
  'MY.Kuala Lumpur': 'Kuala Lumpur',
  'PH.Quezon': 'Quezon City',
  'PH.Taguig': 'Taguig City',
  'Pune': 'Pune',
  'SG.Singapore': 'Singapore',
};


export default function Dashboard() {
  // 1) Live data hook
  const { data, loading, error } = useLiveOccupancy(1000);

  // 2) Partitions
  const regions = data?.realtime || {};

  // 3) Totals


  const partitions = useMemo(() => {
    return partitionList
      .map(name => {
        // collect all region keys that belong to this partition (e.g. all "IN.Pune.*")
        const matchingKeys = Object.keys(regions).filter(k => k.includes(name));

        // merge totals and floors across all matching keys
        let total = 0, Employee = 0, Contractor = 0;
        const mergedFloors = {};

        matchingKeys.forEach(k => {
          const r = regions[k];
          if (!r) return;
          total += r.total || 0;
          Employee += r.Employee || 0;
          Contractor += r.Contractor || 0;
          Object.entries(r.floors || {}).forEach(([f, c]) => {
            mergedFloors[f] = (mergedFloors[f] || 0) + c;
          });
        });

        return {
          name,
          total,
          Employee,
          Contractor,
          floors: mergedFloors,
          flag: flagMap[name] || null
        };
      })
      .sort((a, b) => b.total - a.total);
  }, [regions]);


  const todayTot = data?.today?.total || 0;
  const todayEmp = data?.today?.Employee || 0;
  const todayCont = data?.today?.Contractor || 0;
  const realtimeTot = partitions.reduce((sum, p) => sum + p.total, 0);
  const realtimeEmp = partitions.reduce((sum, p) => sum + p.Employee, 0);
  const realtimeCont = partitions.reduce((sum, p) => sum + p.Contractor, 0);

  // 4) Regions of interest
  const pune = partitions.find(p => p.name === 'Pune');
  const quezonCity = partitions.find(p => p.name === 'Quezon City');
  const TaguigCity = partitions.find(p => p.name === 'Taguig City');
  const combinedRegions = partitions.filter(p =>
    ['JP.Tokyo', 'MY.Kuala Lumpur', 'SG.Singapore'].includes(p.name)
  );

  // 5) Pie chart data
  // const quezonData = useMemo(() => [
  //   { name: 'Employees', value: quezonCity?.Employee || 0 },
  //   { name: 'Contractors', value: quezonCity?.Contractor || 0 }
  // ], [quezonCity?.Employee, quezonCity?.Contractor]);


  const asiaPacData = useMemo(() =>
    combinedRegions.map(r => ({
      // name: r.name.replace(/^.*\./, ''),
      name: displayNameMap[r.name] || r.name.replace(/^.*\./, ''),
      value: r.total,
      emp: r.Employee,
      cont: r.Contractor
    })),
    [combinedRegions]
  );


  // 6) Prepare floors + chart configs _before_ any returns
  // 6a) Get only real floors (drop any that came back Unmapped/"Out of office")
  const floors = Object.entries(pune?.floors || {})
    .filter(([floorName, _count]) => floorName !== 'Unmapped');

  const puneChartData = useMemo(() => {
    // Map only the filtered floors; no Unknown bucket needed
    return floors.map(([f, headcount]) => {
      // first try Pune-specific capacity, else global
      const puneKey = `${f} (Pune)`;
      const capacity =
        floorCapacities[puneKey] != null
          ? floorCapacities[puneKey]
          : buildingCapacities[f] || 0;

      return {
        name: f,
        headcount,
        capacity
      };
    });
  }, [floors]);



  const chartConfigs = useMemo(() => {
    return [
      {
        key: 'india',
        title: 'India',
        body: (pune?.total === 0 && !combinedRegions.find(r => r.name === 'IN.HYD'))
          ? (
            <Typography color="white" align="center" py={6}>
              No India data
            </Typography>
          )
          : (
            <CompositeChartCard
              title=""
              data={[
                // Pune floor breakdown
                ...puneChartData,
                // Add Hyderabad as single aggregate bar
                {
                  name: "Hyderabad",
                  headcount: data?.realtime?.["IN.HYD"]?.total ?? 0,
                  capacity: buildingCapacities?.["IN.HYD"] ?? 0
                }
              ]}
              // lineColor={palette15[0]}
              height={250}
              sx={{ border: 'none' }}
            />
          )
      },



import React, { useMemo } from 'react';
import isEqual from 'lodash.isequal';

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
              <Bar yAxisId="left" dataKey="headcount" name="Headcount" barSize={700} isAnimationActive={false} stroke="#fff"  strokeWidth={2}>
                {enriched.map((e, i) => <Cell key={i} fill={e._color}   />)}
                <LabelList dataKey="headcount" position="top" formatter={v => `${v}`} style={{ fill: '#fff', fontSize: 15, fontWeight: 700 }} />

                <LabelList dataKey="percentage" position="inside" formatter={v => `${v}%`} style={{ fill: '#EE4B2B', fontSize: 14, fontWeight: 700 }} />
              </Bar>
              {/* <Line yAxisId="right" type="monotone" dataKey="percentage" name="Usage %" stroke="#FF0000" strokeWidth={2} dot={false} isAnimationActive={false} /> */}
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




const buildingCapacities = {
  "Podium Floor": 725,
  "Tower B": 303,
  "2nd Floor": 185,
  "Kuala Lumpur": 100,
  // "Quezon City": 100,
  "Taguig": 100,
  "Tokyo": 100,
  "IN.HYD":100,
  "Quezon City (7thFloor)":150,
  "Quezon City (6thFloor)":100,
  "Singapore":50,
};

export default buildingCapacities;
