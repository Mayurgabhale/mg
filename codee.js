src\pages\Dashboard.jsx
  Line 398:9:  The 'regions' logical expression could make the dependencies of useMemo Hook (at line 434) change on every render. Move it inside the useMemo callback. Alternatively, wrap the initialization of 'regions' in its own useMemo() Hook  react-hooks/exhaustive-deps
  Line 591:6:  React Hook useMemo has missing dependencies: 'TaguigCity?.total', 'combinedRegions', 'data?.realtime', 'puneChartData', and 'quezonCity?.total'. Either include them or remove the dependency array                     
               react-hooks/exhaustive-deps
  Line 594:5:  React Hook useMemo has a complex expression in the dependency array. Extract it to a separate variable so it can be statically checked                                                                                  
               react-hooks/exhaustive-deps
  Line 595:5:  React Hook useMemo has a complex expression in the dependency array. Extract it to a separate variable so it can be statically checked  


how to remove this all  warning 




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
              ]
            .sort((a, b) => {
    const order = ["Tower B", "Podium Floor", "Hyderabad"];
    return order.indexOf(a.name) - order.indexOf(b.name);
  })
            }
              
              // lineColor={palette15[0]}
              height={250}
              sx={{ border: 'none' }}
            />
          )
      },

      {
        key: 'philipines',
        title: 'Philipines ',
        body: (quezonCity?.total === 0 && TaguigCity?.total === 0)
          ? (
            <Typography color="white" align="center" py={6}>
              No Philipines data
            </Typography>
          )
          : (

            <CompositeChartCard
              title=""
              data={[
                {
                  name: "Quezon City (6thFloor)",
                  headcount: data?.realtime?.["Quezon City"]?.floors?.["6th Floor"] ?? 0,
                  capacity: buildingCapacities?.["Quezon City (6thFloor)"] ?? 0,
                },
                {
                  name: "Quezon City (7thFloor)",
                  headcount: data?.realtime?.["Quezon City"]?.floors?.["7th Floor"] ?? 0,
                  capacity: buildingCapacities?.["Quezon City (7thFloor)"] ?? 0,
                },
                {
                  name: "Taguig City",
                  headcount: TaguigCity?.total ?? 0,
                  capacity: buildingCapacities?.["Taguig"] ?? 0,
                },

              ]}

              lineColor={palette15[1]}
              height={250}
              sx={{ border: 'none' }}
            />
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
            <PieChartCard
              data={asiaPacData}
              colors={['#FFBF00', '#FFFAA0', '#B4C424']}
              height={320}
              showZeroSlice
              sx={{ border: 'none' }}
            />
          )
      }
    ];
  }, [
    floors,
    pune?.total,
    quezonCity?.floors?.["6th Floor"],
    quezonCity?.floors?.["7th Floor"],
    combinedRegions.length,
    asiaPacData
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
          px: { xs: 1, sm: 2, md: 3, lg: 4 },
          background: 'linear-gradient(135deg, #0f0f0f 0%, #1c1c1c 100%)',
          color: '#f5f5f5',
        }}
      >
        {/* Top Summary Cards */}
        <Box
          display="flex"
          flexWrap="wrap"
          gap={1}
          mb={1}
          sx={{
            // On xs: 1 column; sm: 2 columns-ish; md+: show 6 across if space
            '& > div': {
              flex: {
                xs: '1 1 100%',
                sm: '1 1 calc(50% - 8px)',
                md: '1 1 calc(33.333% - 12px)',
                lg: '1 1 calc(16.66% - 12px)'
              },
              minWidth: {
                xs: '100%',
                sm: '220px',
                md: '220px',
                lg: '180px'
              }
            }
          }}
        >
          {[
            { title: "Today's Total Headcount", value: todayTot, icon: <i className="fa-solid fa-users" style={{ fontSize: 25, color: '#FFB300' }} />, border: '#FFB300' },
            { title: "Today's Employees Count", value: todayEmp, icon: <i className="bi bi-people" style={{ fontSize: 25, color: '#EF5350' }} />, border: '#FFB300' },
            { title: "Today's Contractors Count", value: todayCont, icon: <i className="fa-solid fa-circle-user" style={{ fontSize: 25, color: '#8BC34A' }} />, border: '#FFB300' },
            { title: "Realtime Headcount", value: realtimeTot, icon: <i className="fa-solid fa-users" style={{ fontSize: 25, color: '#FFB300' }} />, border: '#FFB300' },
            { title: "Realtime Employees Count", value: realtimeEmp, icon: <i className="bi bi-people" style={{ fontSize: 25, color: '#EF5350' }} />, border: '#FFB300' },
            { title: "Realtime Contractors Count", value: realtimeCont, icon: <i className="fa-solid fa-circle-user" style={{ fontSize: 25, color: '#8BC34A' }} />, border: '#FFB300' },
          ].map(c => (
            <Box key={c.title} sx={{}}>
              <SummaryCard
                title={c.title}
                total={c.value}
                stats={[]}
                icon={c.icon}
                sx={{
                  height: { xs: 130, sm: 130, md: 150 },
                  border: `2px solid ${c.border}`,
                  px: { xs: 1, sm: 1.5 },
                  py: { xs: 1, sm: 1.5 }
                }}
                titleSx={{ fontSize: { xs: '0.85rem', sm: '0.95rem', md: '1rem' } }}
                numberSx={{ fontSize: { xs: '1.15rem', sm: '1.4rem', md: '1.6rem' } }}
              />
            </Box>
          ))}
        </Box>


        {/* Region Cards */}
        <Box
          display="flex"
          flexWrap="wrap"
          gap={1}
          mb={3}
          sx={{
            '& > div': {
              flex: {
                // xs: '1 1 100%',
                // sm: '1 1 calc(50% - 8px)',
                // md: '1 1 calc(33.333% - 12px)',
                // lg: '1 1 calc(16.66% - 12px)'
                xs: '1 1 100%',
                sm: '1 1 calc(50% - 8px)',
                md: '1 1 calc(33.333% - 12px)',
                lg: '1 1 calc(13.66% - 12px)'
              },
              minWidth: {
                xs: '100%',
                sm: '240px',
                md: '240px',
                lg: '180px'
              }
            }
          }}
        >
          {loading ? (
            <Skeleton variant="rectangular" width="90%" height={200} />
          ) : (
            partitions.map((p, i) => (
              <Box key={p.name}>
                <SummaryCard
                  title={
                    <Typography
                      variant="subtitle1"
                      sx={{
                        fontWeight: 'bold',
                        color: '#FFC107',
                        fontSize: { xs: '1rem', sm: '1.05rem', md: '1.1rem' }
                      }}
                    >
                      {displayNameMap[p.name] || p.name.replace(/^.*\./, '')}
                    </Typography>
                  }
                  total={p.total}
                  stats={[
                    { label: 'Employees', value: p.Employee },
                    { label: 'Contractors', value: p.Contractor }
                  ]}
                  sx={{
                    width: '100%',
                    border: `2px solid ${palette15[i % palette15.length]}`,
                    // ✅ Increased heights and enabled content wrapping
                    height: { xs: 170, sm: 188, md: 185, lg: 190 },
                    px: { xs: 1, sm: 1.5 },
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    overflow: 'visible'
                  }}
                  icon={
                    <Box
                      component="img"
                      src={p.flag}
                      sx={{ width: { xs: 40, sm: 48 }, height: { xs: 26, sm: 32 } }}
                    />
                  }
                />
              </Box>
            ))
          )}
        </Box>
        {/* Main Charts */}
        <Box
          display="flex"
          gap={2}
          flexWrap="wrap"
          mb={4}
          sx={{
            // prefer 3 across on large, 2 across on md, 1 across on small
            '& > div': {
              flex: {
                xs: '1 1 100%',
                sm: '1 1 calc(50% - 8px)',
                md: '1 1 calc(50% - 12px)',
                lg: '1 1 calc(33.333% - 12px)'
              },
              minWidth: { xs: '100%', sm: '320px', md: '360px', lg: '320px' },
              height: { xs: 'auto', sm: 420, md: 405 }
            }
          }}
        >
          {chartConfigs.map(({ key, title, body }) => (
            <Box key={key} sx={{ display: 'flex', flexDirection: 'column' }}>
              <Paper sx={{ p: { xs: 1, sm: 2 }, height: '100%', background: 'rgba(0,0,0,0.4)', border: '1px solid #FFC107', display: 'flex', flexDirection: 'column' }}>
                <Typography variant="h6" align="center" sx={{ color: '#FFC107', mb: 1, fontSize: { xs: '1rem', sm: '1.05rem', md: '1.15rem' } }}>{title}</Typography>
                <Box sx={{ flex: 1, overflow: 'hidden', minHeight: { xs: 220, sm: 260, md: 260 } }}>{body}</Box>
              </Paper>
            </Box>
          ))}
        </Box>
      </Container>
      <Footer />
    </>
  );
}


