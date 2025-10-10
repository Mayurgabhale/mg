// src/pages/Dashboard.jsx
import React, { useMemo, Suspense, lazy } from 'react';
import {
  Container, Box, Typography, Grid, Skeleton, Paper, useMediaQuery
} from '@mui/material';
import { useTheme } from '@mui/material/styles';

import Header from '../components/Header';
import Footer from '../components/Footer';
import SummaryCard from '../components/SummaryCard';
import LoadingSpinner from '../components/LoadingSpinner';

import { useLiveOccupancy } from '../hooks/useLiveOccupancy';
import { partitionList } from '../services/occupancy.service';
import buildingCapacities from '../data/buildingCapacities';
import floorCapacities from '../data/floorCapacities';

// flags (convert to compressed webp/png in your assets folder)
import indiaFlag from '../assets/flags/india.png';
import japanFlag from '../assets/flags/japan.png';
import malaysiaFlag from '../assets/flags/malaysia.png';
import philippinesFlag from '../assets/flags/philippines.png';

/* ------------------------------------------------------------------------
  Lazy-load heavy chart components so they don't bloat initial bundle.
  These components should import the charting library (recharts / chart.js).
  Webpack will create separate chunks for them.
-------------------------------------------------------------------------*/
const CompositeChartCard = lazy(() => import('../components/CompositeChartCard'));
const PieChartCard = lazy(() => import('../components/PieChartCard'));

/* palette, mappings kept the same */
const palette15 = [/* ... your colors ... */ '#FFC107', '#E57373', '#4CAF50', '#FFEB3B', '#FFD666', '#8BC34A', '#3F51B5', '#9C27B0', '#00BCD4', '#8BC34A', '#FF9800', '#673AB7', '#009688', '#CDDC39', '#795548'];

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
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm')); // <600
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md')); // sm..md
  // Increase polling interval slightly in production to save CPU/network (adjust if needed)
  const { data, loading, error } = useLiveOccupancy(2000);

  // ----------  data derivation ----------
  const regions = data?.realtime || {};

  const partitions = useMemo(() => (
    partitionList.map(name => {
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
    }).sort((a, b) => b.total - a.total)
  ), [regions]);

  const todayTot = data?.today?.total || 0;
  const todayEmp = data?.today?.Employee || 0;
  const todayCont = data?.today?.Contractor || 0;
  const realtimeTot = partitions.reduce((s, p) => s + p.total, 0);
  const realtimeEmp = partitions.reduce((s, p) => s + p.Employee, 0);
  const realtimeCont = partitions.reduce((s, p) => s + p.Contractor, 0);

  const pune = partitions.find(p => p.name === 'Pune');
  const quezonCity = partitions.find(p => p.name === 'Quezon City');
  const combinedRegions = partitions.filter(p =>
    ['JP.Tokyo', 'MY.Kuala Lumpur', 'Taguig City', 'IN.HYD'].includes(p.name)
  );

  const asiaPacData = useMemo(() =>
    combinedRegions.map(r => ({
      name: displayNameMap[r.name] || r.name.replace(/^.*\./, ''),
      value: r.total,
      emp: r.Employee,
      cont: r.Contractor
    })), [combinedRegions]
  );

  // floors for Pune (filter Unmapped)
  const floors = Object.entries(pune?.floors || {}).filter(([f]) => f !== 'Unmapped');
  const puneChartData = useMemo(() => floors.map(([f, headcount]) => {
    const puneKey = `${f} (Pune)`;
    const capacity = floorCapacities[puneKey] ?? buildingCapacities[f] ?? 0;
    return { name: f, headcount, capacity };
  }), [floors]);

  // Chart configs (components are lazy-loaded)
  const chartConfigs = useMemo(() => ([
    {
      key: 'pune',
      title: 'Pune',
      body: pune?.total === 0 ? (
        <Typography color="white" align="center" py={6}>No Pune data</Typography>
      ) : (
        <CompositeChartCard data={puneChartData} lineColor={palette15[0]} height={250} />
      )
    },
    {
      key: 'quezon',
      title: 'Quezon City',
      body: quezonCity?.total === 0 ? (
        <Typography color="white" align="center" py={6}>No Quezon City data</Typography>
      ) : (
        <CompositeChartCard
          data={[
            { name: "Quezon City (6thFloor)", headcount: data?.realtime?.["Quezon City"]?.floors?.["6th Floor"] ?? 0, capacity: buildingCapacities?.["Quezon City (6thFloor)"] ?? 0 },
            { name: "Quezon City (7thFloor)", headcount: data?.realtime?.["Quezon City"]?.floors?.["7th Floor"] ?? 0, capacity: buildingCapacities?.["Quezon City (7thFloor)"] ?? 0 },
          ]}
          lineColor={palette15[1]}
          height={250}
        />
      )
    },
    {
      key: 'combined',
      title: 'Asia-Pacific',
      body: combinedRegions.length === 0 ? (
        <Typography color="white" align="center" py={6}>No regional data</Typography>
      ) : (
        <PieChartCard data={asiaPacData} colors={['#FFBF00', '#FFFAA0', '#B4C424']} height={320} showZeroSlice />
      )
    }
  ]), [pune?.total, puneChartData, quezonCity, combinedRegions.length, asiaPacData, data]);

  // ---------- error / loading states ----------
  if (error) {
    return (
      <Box width="100vw" py={4}>
        <Typography color="error" align="center">Error loading live data</Typography>
      </Box>
    );
  }

  if (loading) {
    // Use lightweight spinner on slow connections; consider switching to skeletons if first paint matters
    return (
      <Box sx={{ position: 'fixed', inset: 0, bgcolor: 'rgba(0,0,0,0.85)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <LoadingSpinner />
      </Box>
    );
  }

  // ---------- render ----------
  return (
    <>
      <Header title="APAC Live Occupancy" />

      <Container maxWidth={false} disableGutters sx={{
        py: 2, px: isMobile ? 1 : 2,
        background: 'linear-gradient(135deg, #0f0f0f 0%, #1c1c1c 100%)',
        color: '#f5f5f5', minHeight: 'calc(100vh - 120px)'
      }}>
        {/* Top Summary cards: responsive grid */}
        <Grid container spacing={1} mb={2}>
          {[
            { title: "Today's Total Headcount", value: todayTot, color: '#FFB300' },
            { title: "Today's Employees Count", value: todayEmp, color: '#EF5350' },
            { title: "Today's Contractors Count", value: todayCont, color: '#8BC34A' },
            { title: "Realtime Headcount", value: realtimeTot, color: '#FFD180' },
            { title: "Realtime Employees Count", value: realtimeEmp, color: '#AED581' },
            { title: "Realtime Contractors Count", value: realtimeCont, color: '#EF5350' },
          ].map((c) => (
            <Grid item xs={12} sm={6} md={4} lg={2} key={c.title}>
              <SummaryCard title={c.title} total={c.value} stats={[]} sx={{ height: 140, border: `2px solid ${c.color}` }} />
            </Grid>
          ))}
        </Grid>

        {/* Region cards */}
        <Grid container spacing={1} mb={3}>
          {partitions.map((p, i) => (
            <Grid item xs={12} sm={6} md={4} lg={2} key={p.name}>
              <SummaryCard
                title={<Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: '#FFC107', fontSize: '1.05rem' }}>{displayNameMap[p.name] || p.name.replace(/^.*\./, '')}</Typography>}
                total={p.total}
                stats={[{ label: 'Employees', value: p.Employee }, { label: 'Contractors', value: p.Contractor }]}
                sx={{ border: `2px solid ${palette15[i % palette15.length]}` }}
                icon={<Box component="img" src={p.flag} alt={`${p.name} flag`} loading="lazy" sx={{ width: 44, height: 30 }} />}
              />
            </Grid>
          ))}
        </Grid>

        {/* Charts grid: Suspense shows a compact skeleton */}
        <Grid container spacing={2} mb={4}>
          <Suspense fallback={<Grid item xs={12}><Skeleton variant="rectangular" height={360} /></Grid>}>
            {chartConfigs.map(({ key, title, body }) => (
              <Grid item xs={12} md={6} lg={4} key={key}>
                <Paper sx={{ p: 2, minHeight: 360, background: 'rgba(0,0,0,0.45)', border: '1px solid #FFC107', display: 'flex', flexDirection: 'column' }}>
                  <Typography variant="h6" align="center" sx={{ color: '#FFC107', mb: 2 }}>{title}</Typography>
                  <Box sx={{ flex: 1, overflow: 'hidden' }}>{body}</Box>
                </Paper>
              </Grid>
            ))}
          </Suspense>
        </Grid>
      </Container>

      <Footer />
    </>
  );
}