// C:\Users\W0024618\Desktop\apac-occupancy-frontend\src\pages\Dashboard.jsx
import React, { useMemo, Suspense } from 'react';
import { Container, Box, Typography, Paper, Grid } from '@mui/material';

import Header from '../components/Header';
import Footer from '../components/Footer';

import SummaryCard from '../components/SummaryCard';
const CompositeChartCard = React.lazy(() => import('../components/CompositeChartCard'));
const PieChartCard = React.lazy(() => import('../components/PieChartCard'));

import { useLiveOccupancy } from '../hooks/useLiveOccupancy';
import { partitionList } from '../services/occupancy.service';
import buildingCapacities from '../data/buildingCapacities';
import floorCapacities from '../data/floorCapacities';
import LoadingSpinner from '../components/LoadingSpinner';

import indiaFlag from '../assets/flags/india.png';
import japanFlag from '../assets/flags/japan.png';
import malaysiaFlag from '../assets/flags/malaysia.png';
import philippinesFlag from '../assets/flags/philippines.png';

const palette15 = [
  '#FFC107', '#E57373', '#4CAF50', '#FFEB3B', '#FFD666',
  '#8BC34A', '#3F51B5', '#9C27B0', '#00BCD4', '#8BC34A',
  '#FF9800', '#673AB7', '#009688', '#CDDC39', '#795548'
];

const flagMap = {
  'Pune': indiaFlag,
  'Quezon City': philippinesFlag,
  'JP.Tokyo': japanFlag,
  'MY.Kuala Lumpur': malaysiaFlag,
  'Taguig City': philippinesFlag,
  'IN.HYD': indiaFlag
};

const displayNameMap = {
  'IN.HYD': 'Hyderabad',
  'JP.Tokyo': 'Tokyo',
  'MY.Kuala Lumpur': 'Kuala Lumpur',
  'PH.Quezon': 'Quezon City',
  'PH.Taguig': 'Taguig City',
  'Pune': 'Pune',
};

export default function Dashboard() {
  // 1) Live data hook - consider increasing interval to 5000ms if 1000ms causes too many requests and impacts performance
  const { data, loading, error } = useLiveOccupancy(1000);

  // 2) Partitions
  const regions = data?.realtime || {};
  const partitions = useMemo(() => {
    return partitionList
      .map(name => {
        const key = Object.keys(regions).find(k => k.includes(name));
        const p = key && regions[key] ? regions[key] : {};
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
  }, [regions]);

  // 3) Totals
  const todayTot = data?.today?.total || 0;
  const todayEmp = data?.today?.Employee || 0;
  const todayCont = data?.today?.Contractor || 0;
  const realtimeTot = partitions.reduce((sum, p) => sum + p.total, 0);
  const realtimeEmp = partitions.reduce((sum, p) => sum + p.Employee, 0);
  const realtimeCont = partitions.reduce((sum, p) => sum + p.Contractor, 0);

  // 4) Regions of interest
  const pune = partitions.find(p => p.name === 'Pune');
  const quezonCity = partitions.find(p => p.name === 'Quezon City');
  const combinedRegions = partitions.filter(p =>
    ['JP.Tokyo', 'MY.Kuala Lumpur', 'Taguig City', 'IN.HYD'].includes(p.name)
  );

  // 5) Pie chart data
  const quezonData = useMemo(() => [
    { name: 'Employees', value: quezonCity?.Employee || 0 },
    { name: 'Contractors', value: quezonCity?.Contractor || 0 }
  ], [quezonCity?.Employee, quezonCity?.Contractor]);

  const asiaPacData = useMemo(() =>
    combinedRegions.map(r => ({
      name: displayNameMap[r.name] || r.name.replace(/^../, ''),
      value: r.total,
      emp: r.Employee,
      cont: r.Contractor
    })),
    [combinedRegions]
  );

  // 6) Prepare floors + chart configs before any returns
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
        key: 'pune',
        title: 'Pune',
        body: pune?.total === 0
          ? (
            <Typography color="white" align="center" py={6}>
              No Pune data
            </Typography>
          )
          : (
            <Suspense fallback={<LoadingSpinner size="small" />}>
              <CompositeChartCard
                data={puneChartData}
                lineColor={palette15[0]}
                height={250}
                sx={{ border: 'none' }}
              />
            </Suspense>
          )
      },
      {
        key: 'quezon',
        title: 'Quezon City',
        body: quezonCity?.total === 0
          ? (
            <Typography color="white" align="center" py={6}>
              No Quezon City data
            </Typography>
          )
          : (
            <Suspense fallback={<LoadingSpinner size="small" />}>
              <CompositeChartCard
                title=""
                data={[
                  {
                    name: "Quezon City (6th Floor)",
                    headcount: data?.realtime?.["Quezon City"]?.floors?.["6th Floor"] ?? 0,
                    capacity: buildingCapacities?.["Quezon City (6th Floor)"] ?? 0,
                  },
                  {
                    name: "Quezon City (7th Floor)",
                    headcount: data?.realtime?.["Quezon City"]?.floors?.["7th Floor"] ?? 0,
                    capacity: buildingCapacities?.["Quezon City (7th Floor)"] ?? 0,
                  },
                ]}
                lineColor={palette15[1]}
                height={250}
                sx={{ border: 'none' }}
              />
            </Suspense>
          )
      },
      {
        key: 'combined',
        title: 'Asia-Pacific',
        body: combinedRegions.length === 0
          ? (
            <Typography color="white" align="center" py={6}>
              No regional data
            </Typography>
          )
          : (
            <Suspense fallback={<LoadingSpinner size="small" />}>
              <PieChartCard
                data={asiaPacData}
                colors={['#FFBF00', '#FFFAA0', '#B4C424']}
                height={320}
                showZeroSlice
                sx={{ border: 'none' }}
              />
            </Suspense>
          )
      }
    ];
  }, [
    floors,
    pune?.total,
    quezonCity?.total,
    data?.realtime?.["Quezon City"]?.floors?.["6th Floor"],
    data?.realtime?.["Quezon City"]?.floors?.["7th Floor"],
    combinedRegions.length,
    asiaPacData,
    puneChartData
  ]);

  // 7) Error state
  if (error) {
    return (
      <Box width="100vw" py={4}>
        <Typography color="error" align="center">
          Error loading live data
        </Typography>
      </Box>
    );
  }

  if (loading) {
    return (
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          bgcolor: 'rgba(0, 0, 0, 0.85)',
          zIndex: 9999,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <LoadingSpinner />
      </Box>
    );
  }

  // 8) Render
  return (
    <>
      <Header title="APAC Live Occupancy" />
      <Container
        maxWidth={false}
        disableGutters
        sx={{
          py: 0,
          px: { xs: 1, sm: 2 }, // Reduce padding on mobile for better fit
          background: 'linear-gradient(135deg, #0f0f0f 0%, #1c1c1c 100%)',
          color: '#f5f5f5',
        }}
      >
        {/* Top Summary Cards */}
        <Grid container spacing={1} sx={{ mb: 1 }}>
          {[
            { title: "Today's Total Headcount", value: todayTot, icon: <i className="fa-solid fa-users" style={{ fontSize: 25, color: '#FFB300' }} />, border: '#FFB300' },
            { title: "Today's Employees Count", value: todayEmp, icon: <i className="bi bi-people" style={{ fontSize: 25, color: '#EF5350' }} />, border: '#8BC34A' },
            { title: "Today's Contractors Count", value: todayCont, icon: <i className="fa-solid fa-circle-user" style={{ fontSize: 25, color: '#8BC34A' }} />, border: '#E57373' },
            { title: "Realtime Headcount", value: realtimeTot, icon: <i className="fa-solid fa-users" style={{ fontSize: 25, color: '#FFB300' }} />, border: '#FFD180' },
            { title: "Realtime Employees Count", value: realtimeEmp, icon: <i className="bi bi-people" style={{ fontSize: 25, color: '#EF5350' }} />, border: '#AED581' },
            { title: "Realtime Contractors Count", value: realtimeCont, icon: <i className="fa-solid fa-circle-user" style={{ fontSize: 25, color: '#8BC34A' }} />, border: '#EF5350' },
          ].map(c => (
            <Grid item xs={12} sm={6} md={4} lg={3} xl={2} key={c.title}>
              <SummaryCard
                title={c.title}
                total={c.value}
                stats={[]}
                icon={c.icon}
                sx={{ height: 140, border: `2px solid ${c.border}` }}
              />
            </Grid>
          ))}
        </Grid>

        {/* Region Cards */}
        <Grid container spacing={1} sx={{ mb: 3 }}>
          {partitions.map((p, i) => (
            <Grid item xs={12} sm={6} md={4} lg={3} xl={2} key={p.name}>
              <SummaryCard
                title={
                  <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: '#FFC107', fontSize: '1.3rem' }}>
                    {displayNameMap[p.name] || p.name.replace(/^.*\./, '')}
                  </Typography>
                }
                total={p.total}
                stats={[{ label: 'Employees', value: p.Employee }, { label: 'Contractors', value: p.Contractor }]}
                sx={{ width: '100%', border: `2px solid ${palette15[i % palette15.length]}` }}
                icon={<Box component="img" src={p.flag} sx={{ width: 48, height: 32, loading: 'lazy' }} />} // Added lazy loading for images
              />
            </Grid>
          ))}
        </Grid>

        {/* Main Charts */}
        <Grid container spacing={2} sx={{ mb: 4 }}>
          {chartConfigs.map(({ key, title, body }) => (
            <Grid item xs={12} md={4} key={key}>
              <Paper
                sx={{
                  p: 2,
                  height: '100%',
                  minHeight: { xs: 320, md: 405 }, // Adjust min height for mobile
                  background: 'rgba(0,0,0,0.4)',
                  border: '1px solid #FFC107',
                  display: 'flex',
                  flexDirection: 'column',
                  animation: 'fadeInUp 0.5s'
                }}
              >
                <Typography variant="h6" align="center" sx={{ color: '#FFC107', mb: 2 }}>
                  {title}
                </Typography>
                <Box sx={{ flex: 1, overflow: 'hidden' }}>{body}</Box>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>
      <Footer />
    </>
  );
}