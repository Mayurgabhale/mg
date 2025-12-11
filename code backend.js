// src/pages/Dashboard.jsx
import React, { useEffect, useState } from 'react';
import {
  Container, Box, Typography, Skeleton,
  Table, TableHead, TableRow, TableCell, TableBody, Paper
} from '@mui/material';

import Header from '../components/Header';
import SummaryCard from '../components/SummaryCard';
import CompositeChartCard from '../components/CompositeChartCard';
import PieChartCard from '../components/PieChartCard';

import { useLiveOccupancy } from '../hooks/useLiveOccupancy';
import { useSecurityOfficers } from '../hooks/useSecurityOfficers';
import { useBadgeRejections } from '../hooks/useBadgeRejections';
import { partitionList } from '../services/occupancy.service';
import { fetchVisitorCountsByFloor, fetchForecastFromHistory } from '../api/occupancy.service';

import seatCapacities from '../data/seatCapacities';
import buildingCapacities from '../data/buildingCapacities';

import DenverFlag from '../assets/flags/denver.png';
import MiamiFlag from '../assets/flags/miami.png';
import NewYorkFlag from '../assets/flags/new-york.png';
import AustinFlag from '../assets/flags/austin.png';

const displayNameMap = {
  'US.CO.OBS': 'Denver',
  'US.FL.Miami': 'Miami',
  'US.NYC': 'New York',
  'USA/Canada Default': 'Austin Texas'
};

const palette15 = [
  '#FFC107', '#E57373', '#4CAF50', '#FFEB3B', '#FFD666', '#D84315', '#3F51B5',
  '#9C27B0', '#00BCD4', '#8BC34A', '#FF9800', '#673AB7', '#009688', '#CDDC39', '#795548'
];

export default function Dashboard() {

  const [mode, setMode] = useState('live');
  const [ts, setTs] = useState(null);

  const { data, loading, error } = useLiveOccupancy(mode === 'live' ? 1000 : null, ts);
  const { data: secData, loading: lo1 } = useSecurityOfficers(5000);
  const { data: rejections, loading: lo2 } = useBadgeRejections(5000);

  const rawDetails = rejections?.details || [];

  const enrichedRejections = rawDetails.map(d => {
    const cleanDoor = d.Door.replace(/_[0-9:]+$/, '');
    const m = cleanDoor.match(/US\.CO\.HQ\.\s*(\d{2})\./);
    const floor = m ? `Floor ${m[1]}` : 'Unknown';
    return { ...d, floor };
  });

  const [visitorsByFloor, setVisitors] = useState([]);
  const [forecast, setForecast] = useState({ history: [], forecast: [] });

  const officers = Array.isArray(secData?.present) ? secData.present : [];

  useEffect(() => {
    fetchVisitorCountsByFloor().then(j => j.success && setVisitors(j.counts));
    fetchForecastFromHistory().then(json => setForecast(json));
  }, []);

  if (error) {
    return (
      <Box width="100vw" py={4}>
        <Typography color="error" align="center">Error loading live data</Typography>
      </Box>
    );
  }

  const flagMap = {
    'US.CO.OBS': DenverFlag,
    'US.FL.Miami': MiamiFlag,
    'US.NYC': NewYorkFlag,
    'USA/Canada Default': AustinFlag
  };

  const regions = data?.realtime || {};

  const partitions = partitionList
    .map(name => {
      const key = Object.keys(regions).find(k => k.includes(name));
      const p = key ? regions[key] : {};
      return {
        name,
        total: p.total || 0,
        Employee: p.Employee || 0,
        Contractor: p.Contractor || 0,
        floors: p.floors || {},
        flag: flagMap[name] || null
      };
    })
    .sort((a, b) => b.total - a.total);

  const todayTot = data?.today?.total || 0;
  const todayEmp = data?.today?.Employee || 0;
  const todayCont = data?.today?.Contractor || 0;

  const realtimeTot = partitions.reduce((s, p) => s + p.total, 0);
  const realtimeEmp = partitions.reduce((s, p) => s + p.Employee, 0);
  const realtimeCont = partitions.reduce((s, p) => s + p.Contractor, 0);

  const denver = partitions.find(p => p.name === 'US.CO.OBS');
  const others = partitions.filter(p => ['US.FL.Miami', 'US.NYC', 'USA/Canada Default'].includes(p.name));

  const floors = Object.entries(denver?.floors || {});

  const handleTimeClick = iso => { setMode('time'); setTs(iso); };
  const handleLiveClick = () => { setMode('live'); setTs(null); };

  return (
    <>
      <Header
        title="NAMER Live Occupancy"
        mode={mode}
        onTimeSelect={handleTimeClick}
        onLiveClick={handleLiveClick}
      />

      <Container
        maxWidth={false}
        disableGutters
        sx={{
          py: 1,
          px: { xs: 1, sm: 2, md: 3 },
          width: '100vw',
          minHeight: '100vh',
          background: 'rgba(0,0,0,0.6)',
          boxSizing: 'border-box'
        }}
      >

        {/* SUMMARY CARDS */}
        <Box display="flex" flexWrap="wrap" gap={1} mb={1}>
          {[
            { title: "Today's Total Headcount", value: todayTot, border: '#FFB300', icon: <i className="fa-solid fa-users" style={{ fontSize: 25, color: '#FFB300' }} /> },
            { title: "Today's Employees Count", value: todayEmp, border: '#8BC34A', icon: <i className="bi bi-people" style={{ fontSize: 25, color: '#EF5350' }} /> },
            { title: "Today's Contractors Count", value: todayCont, border: '#E57373', icon: <i className="fa-solid fa-circle-user" style={{ fontSize: 25, color: '#8BC34A' }} /> },
            { title: "Realtime Headcount", value: realtimeTot, border: '#FFD180', icon: <i className="fa-solid fa-users" style={{ fontSize: 25, color: '#FFB300' }} /> },
            { title: "Realtime Employees Count", value: realtimeEmp, border: '#AED581', icon: <i className="bi bi-people" style={{ fontSize: 25, color: '#EF5350' }} /> },
            { title: "Realtime Contractors Count", value: realtimeCont, border: '#E57373', icon: <i className="fa-solid fa-circle-user" style={{ fontSize: 25, color: '#8BC34A' }} /> }
          ].map(c => (
            <Box
              key={c.title}
              sx={{
                flex: {
                  xs: '1 1 100%',
                  sm: '1 1 calc(50% - 8px)',
                  md: '1 1 calc(33% - 8px)',
                  lg: '1 1 calc(16.66% - 8px)'
                }
              }}
            >
              <SummaryCard
                title={c.title}
                total={c.value}
                stats={[]}
                icon={c.icon}
                sx={{
                  height: { xs: 120, md: 140 },
                  border: `2px solid ${c.border}`
                }}
              />
            </Box>
          ))}
        </Box>

        {/* REGION CARDS */}
        <Box display="flex" flexWrap="wrap" gap={1} mb={1.5}>
          {loading ? (
            <Skeleton width="100%" height={200} />
          ) : (
            partitions.map((p, index) => (
              <Box
                key={p.name}
                sx={{
                  flex: {
                    xs: '1 1 100%',
                    sm: '1 1 calc(50% - 8px)',
                    md: '1 1 calc(33% - 8px)',
                    lg: '1 1 calc(16.66% - 8px)'
                  }
                }}
              >
                <SummaryCard
                  title={<Typography sx={{ fontWeight: 'bold', fontSize: '1.1rem', color: '#FFC107' }}>{displayNameMap[p.name]}</Typography>}
                  total={p.total}
                  stats={[
                    { label: 'Employees', value: p.Employee, color: '#40E0D0' },
                    { label: 'Contractors', value: p.Contractor, color: 'green' }
                  ]}
                  icon={<Box component="img" src={p.flag} sx={{ width: 45, height: 30, border: '1px solid white', borderRadius: '2px' }} />}
                  sx={{ border: `2px solid ${palette15[index % palette15.length]}` }}
                />
              </Box>
            ))
          )}
        </Box>

        {/* CHARTS */}
        <Box display="flex" flexWrap="wrap" gap={2} mb={4}>
          {[
            {
              key: 'denver',
              title: 'Denver',
              body: denver.total === 0
                ? <Typography color="white" align="center" py={6}>No Denver data</Typography>
                : <CompositeChartCard
                    data={floors.map(([f, h]) => ({
                      name: f,
                      headcount: h,
                      capacity: buildingCapacities[f] || 0
                    }))}
                    lineColor={palette15[1]}
                    height={300}
                  />
            },
            {
              key: 'others',
              title: 'North America',
              body: (
                <PieChartCard
                  data={others.map(o => ({ name: displayNameMap[o.name], value: o.total }))}
                  colors={[palette15[2], palette15[3], palette15[4]]}
                  height={300}
                  showZeroSlice
                  totalSeats={others.reduce((s, o) => s + seatCapacities[o.name], 0)}
                />
              )
            },
            {
              key: 'details',
              title: 'Denver Floor Details',
              body: loading ? (
                <Skeleton width="100%" height={300} />
              ) : (
                <Box sx={{ width: '100%', overflowX: 'auto' }}>
                  <Table size="small" sx={{ minWidth: 480, color: 'white' }}>
                    <TableHead>
                      <TableRow>
                        {['Floor', 'Headcount', 'Visitors', 'Security', 'Rejections'].map(h => (
                          <TableCell key={h} sx={{ color: '#FFC107' }}>{h}</TableCell>
                        ))}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {floors.map(([floor, headcount]) => {
                        const visitors = visitorsByFloor.find(v => v.Floor === floor)?.visitorCount || 0;
                        const officerCount = officers.filter(o => o.floor === floor).length;
                        const todayDate = new Date().toISOString().slice(0, 10);
                        const rejectionCount = enrichedRejections.filter(
                          d => d.Location === 'US.CO.OBS' && d.floor === floor && d.DateOnly === todayDate
                        ).length;

                        return (
                          <TableRow key={floor}>
                            <TableCell sx={{ color: 'white' }}>{floor}</TableCell>
                            <TableCell sx={{ color: 'white' }}>{headcount}</TableCell>
                            <TableCell sx={{ color: 'white' }}>{visitors}</TableCell>
                            <TableCell sx={{ color: 'white' }}>{lo1 ? <Skeleton width={20} /> : officerCount}</TableCell>
                            <TableCell sx={{ color: 'white' }}>{lo2 ? <Skeleton width={20} /> : rejectionCount}</TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </Box>
              )
            }
          ].map(({ key, title, body }) => (
            <Box
              key={key}
              sx={{
                flex: {
                  xs: '1 1 100%',
                  sm: '1 1 calc(50% - 8px)',
                  md: '1 1 calc(32% - 8px)'
                },
                minWidth: 280
              }}
            >
              <Paper sx={{ p: 2, height: '100%', border: '1px solid #FFC107', background: 'rgba(0,0,0,0.4)' }}>
                <Typography sx={{ color: '#FFC107', mb: 2 }} variant="h6">{title}</Typography>
                {body}
              </Paper>
            </Box>
          ))}
        </Box>

        {/* FOOTER */}
        <footer style={{
          backgroundColor: '#000',
          color: '#FFC72C',
          textAlign: 'center',
          padding: '1rem 0',
          borderTop: '2px solid #FFC72C'
        }}>
          <strong>Global Security Operations Center (GSOC)</strong><br />
          Western Union North America — Realtime occupancy dashboard.
          <br /><br />
          Contact: <a href="mailto:gsoc@westernunion.com" style={{ color: '#FFC72C' }}>gsoc@westernunion.com</a>
          &nbsp;|&nbsp; +91-020-67632394
        </footer>

      </Container>
    </>
  );
}