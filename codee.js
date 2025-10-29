// src/api/occupancy.service.js
let controller;

export async function fetchLiveSummary() {
  if (controller) controller.abort(); // cancel previous
  controller = new AbortController();

  const res = await fetch('http://localhost:3005/api/occupancy/live-summary', {
    signal: controller.signal,
  });

  if (!res.ok) throw new Error('Failed to fetch');
  return res.json();
}








http://localhost:3005/api/occupancy/live-summary
Response Time
3.53 s
Prepare
4.89 ms
Socket Initialization
0.86 ms
DNS Lookup
0.12 ms
TCP Handshake
0 ms
Waiting (TTFB)
3.53 s
Download
1.93 ms
Process
0.28 ms
this is  postman respnive is good,
but the issue in the frontend when i run this http://localhost:3000/
it is take moe that 5 minute ot loaidn the page. 
  i want display data for diplsy page withing 3 to 5 seconds so wo to do it....

  and why this getting moe time to loaidn the page. 
  
// C:\Users\W0024618\Desktop\emea-occupancy-frontend\src\hooks\useLiveOccupancy.js
import { useState, useEffect, useRef } from 'react';
import { fetchLiveSummary } from '../api/occupancy.service';

export function useLiveOccupancy(interval = 10000) { // fetch every 10 seconds
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const timerRef = useRef(null);

  useEffect(() => {
    let active = true;

    async function load() {
      if (document.hidden) return; // Skip fetch when tab is not visible
      try {
        const json = await fetchLiveSummary();
        if (!active) return;
        setData(json);
        setLoading(false);
      } catch (e) {
        if (!active) return;
        setError(e);
        setLoading(false);
      }
    }

    load(); // initial fetch
    timerRef.current = setInterval(load, interval); // repeat every few seconds

    return () => {
      active = false;
      clearInterval(timerRef.current);
    };
  }, [interval]);

  return { data, loading, error };
}

--------------------------------
  //C:\Users\W0024618\Desktop\emea-occupancy-frontend\src\pages\Dashboard.jsx
// src/pages/Dashboard.jsx

import React, { useEffect, useState } from 'react';
import { Container, Box, Typography, Skeleton } from '@mui/material';



import { useMemo } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import SummaryCard from '../components/SummaryCard';
import CompositeChartCard from '../components/CompositeChartCard';
import PieChartCard from '../components/PieChartCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { useLiveOccupancy } from '../hooks/useLiveOccupancy';


import seatCapacities from '../data/buildingCapacities';
// Flags
import austriaFlag from '../assets/flags/austria.png';
import uaeFlag from '../assets/flags/uae.png';
import irelandFlag from '../assets/flags/ireland.png';
import italyFlag from '../assets/flags/italy.png';
import lithuaniaFlag from '../assets/flags/lithuania.png';
import moroccoFlag from '../assets/flags/morocco.png';
import russiaFlag from '../assets/flags/russia.png';
import ukFlag from '../assets/flags/uk.png';
import spainFlag from '../assets/flags/spain.png';

const partitions = [
  'AUT.Vienna', 'DU.Abu Dhab', 'IE.Dublin', 'IT.Rome',
  'LT.Vilnius', 'MA.Casablanca', 'RU.Moscow', 'UK.London', 'ES.Madrid'
];
const displayName = {
  'AUT.Vienna': 'Vienna',
  'DU.Abu Dhab': 'Abu Dhabi',
  'IE.Dublin': 'Dublin',
  'IT.Rome': 'Rome',
  'LT.Vilnius': 'Vilnius',
  'MA.Casablanca': 'Casablanca',
  'RU.Moscow': 'Moscow',
  'UK.London': 'London',
  'ES.Madrid': 'Madrid'
};
const flagMap = {
  'AUT.Vienna': austriaFlag,
  'DU.Abu Dhab': uaeFlag,
  'IE.Dublin': irelandFlag,
  'IT.Rome': italyFlag,
  'LT.Vilnius': lithuaniaFlag,
  'MA.Casablanca': moroccoFlag,
  'RU.Moscow': russiaFlag,
  'UK.London': ukFlag,
  'ES.Madrid': spainFlag
};
const colorsMap = {
  'AUT.Vienna': ['#FFD666', '#fcf3cf', '#2ecc71', '#ec7063'],
  'DU.Abu Dhab': ['#FFE599', '#fcf3cf', '#2ecc71', '#ec7063'],
  'IE.Dublin': ['#FFF2CC', '#fcf3cf', '#2ecc71', '#ec7063'],
  'IT.Rome': ['#FFD666', '#fcf3cf', '#2ecc71', '#ec7063'],
  'LT.Vilnius': ['#FFE599', '#fcf3cf', '#2ecc71', '#ec7063'],
  'MA.Casablanca': ['#FFF2CC', '#fcf3cf', '#2ecc71', '#ec7063'],
  'RU.Moscow': ['#FFD666', '#fcf3cf', '#2ecc71', '#ec7063'],
  'UK.London': ['#FFE599', '#fcf3cf', '#2ecc71', '#ec7063'],
  'ES.Madrid': ['#FFC0CB', '#fcf3cf', '#2ecc71', '#ec7063']
};

// Vilnius door → building
// const vilniusMap = doorMapRaw.reduce((acc, { partition, door }) => {
//   if (partition === 'LT.Vilnius') {
//     acc[door] = door.toUpperCase().includes('GAMA') ? 'GAMA' : 'Delta';
//   }
//   return acc;
// }, {});

export default function Dashboard() {
  const { data, loading, error } = useLiveOccupancy(1000);
  const [lastUpdate, setLastUpdate] = useState('');

  useEffect(() => {
    if (data) setLastUpdate(new Date().toLocaleTimeString());
  }, [data]);

  // Vilnius floor-wise breakdown from realtime data
  const vilniusRealtimeFloors = data?.realtime?.['LT.Vilnius']?.floors || {};

  const floorCapacities = {
    '1st Floor': 90,
    '2nd Floor': 74,
    '3rd Floor': 97,
    '4th Floor': 97,
    '5th Floor': 97,
    '6th Floor': 143,
    '7th Floor': 141,
    '8th Floor': 147,
    '9th Floor': 153,
    '10th Floor': 135,

    // Add/adjust these based on real capacity per floor
  };

  const vilniusFloors = Object.entries(vilniusRealtimeFloors).map(([floor, headcount]) => ({
    name: floor,
    headcount,
    capacity: floorCapacities[floor] || 0
  }));


  // Build per-site items
  const summaryItems = [];
  summaryItems.push({
    label: 'Vilnius',
    total: data?.realtime['LT.Vilnius']?.total || 0,
    emp: data?.realtime['LT.Vilnius']?.Employee || 0,
    cont: data?.realtime['LT.Vilnius']?.Contractor || 0,
    flag: flagMap['LT.Vilnius'], colors: colorsMap['LT.Vilnius']
  });
  partitions.filter(k => k !== 'LT.Vilnius').forEach(k => {
    const x = data?.realtime[k] || {};
    summaryItems.push({ label: displayName[k], total: x.total || 0, emp: x.Employee || 0, cont: x.Contractor || 0, flag: flagMap[k], colors: colorsMap[k] });
  });

  // Summary cards
  const todayTot = data?.today.total || 0;
  const todayEmp = data?.today.Employee || 0;
  const todayCon = data?.today.Contractor || 0;
  const realtimeTot = Object.values(data?.realtime || {}).reduce((s, x) => s + (x.total || 0), 0);
  const realtimeEmp = Object.values(data?.realtime || {}).reduce((s, x) => s + (x.Employee || 0), 0);
  const realtimeCon = Object.values(data?.realtime || {}).reduce((s, x) => s + (x.Contractor || 0), 0);


const palette15 = [
  //  '#8BC34A',
   '#cbc5c5ff',
];

  const cityGroup = ['Dublin', 'Rome', 'Moscow'];
  const combinedData = summaryItems
    .filter(item => cityGroup.includes(item.label))
    .reduce(
      (acc, item) => {
        acc.total += item.total || 0;
        acc.emp += item.emp || 0;
        acc.cont += item.cont || 0;
        return acc;
      },
      { total: 0, emp: 0, cont: 0 }
    );


  const pieData1 = useMemo(() => {
  return summaryItems
    .filter(item => ['Dublin', 'Rome', 'Moscow'].includes(item.label))
    .map(item => {
      const capacity = seatCapacities[item.label] || 100;
      const percentage = item.total && capacity ? ((item.total / capacity) * 100).toFixed(1) : 0;

      return {
        name: item.label,
        value: item.total,
        Employee: item.emp,
        Contractor: item.cont,
        capacity,
        percentage,
      };
    });
}, [summaryItems]);



  const pieData2 = useMemo(() => {
  return summaryItems
    .filter(item => ['Abu Dhabi', 'Vienna', 'Casablanca', 'London', 'Madrid'].includes(item.label))
    .map(item => {
      const capacity = seatCapacities[item.label] || 100;
      const percentage = item.total && capacity ? ((item.total / capacity) * 100).toFixed(1) : 0;

      return {
        name: item.label,
        value: item.total,
        Employee: item.emp,
        Contractor: item.cont,
        capacity,
        percentage,
      };
    });
}, [summaryItems]);

  if (error) {
    return <Box py={4}><Typography color="error" align="center">Error loading live data</Typography></Box>;
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

 
  return (
  <>
    <Header />
    <Container
      maxWidth={false}
      disableGutters
      sx={{
        px: { xs: 1, sm: 2 },
        py: 0,
        background: '#151515',
      }}
    >
      {/* ---------- SUMMARY CARDS ROW ---------- */}
      <Box display="flex" flexWrap="wrap" gap={1} mb={2}>
        {[
          {
            title: "Today's Total Headcount",
            value: todayTot,
            icon: <i className="fa-solid fa-users" style={{ color: '#E57373', fontSize: 25 }} />,
            border: '#FFB300',
          },
          {
            title: "Today's Employees Count",
            value: todayEmp,
            icon: <i className="bi bi-people" style={{ color: '#81C784', fontSize: 25 }} />,
            // border: '#8BC34A',
            border: '#FFB300',
          },
          {
            title: "Today's Contractors Count",
            value: todayCon,
            icon: <i className="fa-solid fa-circle-user" style={{ color: '#81C784', fontSize: 25 }} />,
            // border: '#E57373',
            border: '#FFB300',
          },
          {
            title: "Realtime Headcount",
            value: realtimeTot,
            icon: <i className="fa-solid fa-users" style={{ color: '#BA68C8', fontSize: 25 }} />,
            // border: '#FFD180',
            border: '#FFB300',
          },
          {
            title: "Realtime Employees Count",
            value: realtimeEmp,
            icon: <i className="bi bi-people" style={{ color: '#81C784', fontSize: 25 }} />,
            // border: '#AED581',
            border: '#FFB300',
          },
          {
            title: "Realtime Contractors Count",
            value: realtimeCon,
            icon: <i className="fa-solid fa-circle-user" style={{ color: '#BA68C8', fontSize: 25 }} />,
            // border: '#EF5350',
            border: '#FFB300',
          },
        ].map((c) => (
          <Box
            key={c.title}
            sx={{
              flex: {
                xs: '1 1 100%',   // 1 per row (mobile)
                sm: '1 1 48%',    // 2 per row (tablet)
                md: '1 1 31%',    // 3 per row (small desktop)
                lg: '1 1 23%',    // 4 per row (large desktop)
                xl: '1 1 calc(16.66% - 8px)', // 6 per row (wide screen)
              },
            }}
          >
            <SummaryCard
              title={c.title}
              total={c.value}
              stats={[]}
              icon={c.icon}
              sx={{ height: { xs: 120, sm: 130, md: 125 }, border: `2px solid ${c.border}` }}
            />
          </Box>
        ))}
      </Box>

      {/* ---------- COUNTRY SUMMARY CARDS ---------- */}
      <Box display="flex" flexWrap="wrap" gap={1} mb={1}>
        {summaryItems
          .filter((item) => !['Dublin', 'Rome', 'Moscow'].includes(item.label))
          .map((item, index) => {
            const [tc, ec, cc] = item.colors;
            const pieCities = ['Dublin', 'Rome', 'Moscow'];

            const pieData = summaryItems
              ?.filter((item) => pieCities.includes(item.label))
              .map((item) => ({
                name: item.label,
                value: item.total,
              }));

            return (
              <Box
                key={item.label}
                sx={{
                  flex: {
                    xs: '1 1 100%',
                    sm: '1 1 48%',
                    md: '1 1 31%',
                    lg: '1 1 23%',
                    xl: '1 1 calc(10.66% - 1px)',
                  },
                }}
              >
                <SummaryCard
                  title={item.label}
                  total={item.total}
                  stats={[
                    { label: 'Employees', value: item.emp },
                    { label: 'Contractors', value: item.cont },
                  ]}
                  icon={
                    item.flag && (
                      <Box
                        component="img"
                        src={item.flag}
                        alt={item.label}
                        sx={{
                          width: 45,
                          height: 25,
                          border: '1px solid #fff',
                          borderRadius: 0.5,
                        }}
                      />
                    )
                  }
                  titleColor={tc}
                  statColors={[ec, cc]}
                  sx={{
                    height: { xs: 180, sm: 190, md: 185 },
                    border: `2px solid ${palette15[index % palette15.length]}`,
                    '& .MuiTypography-subtitle1': { fontSize: { xs: '1rem', sm: '1.2rem', md: '1.3rem' } },
                    '& .MuiTypography-h4': { fontSize: { xs: '1.5rem', sm: '1.8rem', md: '2rem' } },
                    '& .MuiTypography-caption': { fontSize: { xs: '1rem', sm: '1.1rem', md: '1.3rem' } },
                  }}
                />
              </Box>
            );
          })}
      </Box>

      {/* ---------- LIVE CHARTS ROW ---------- */}
      <Box display="flex" gap={1} mb={1} flexWrap="wrap">
        {/* CHART 1: Composite */}
        <Box
          sx={{
            flex: { xs: '1 1 100%', md: '1 1 48%', lg: '1 1 32%' },
            border: '2px solid #FFC107',
            borderRadius: 2,
            p: { xs: 1, sm: 2 },
            background: 'rgba(0,0,0,0.6)',
          }}
        >
          {loading ? (
            <Skeleton variant="rectangular" height={300} />
          ) : (
            <CompositeChartCard
              title="Vilnius"
              data={vilniusFloors}
              barColor="#4CAF50"
              lineColor="#FF0000"
              height={320}
              animationDuration={1500}
              animationEasing="ease-in-out"
            />
          )}
        </Box>

        {/* CHART 2: Dublin, Rome, Moscow */}
        <Box
          sx={{
            flex: { xs: '1 1 100%', md: '1 1 50%', lg: '1 1 32%' },
            border: '2px solid #FFC107',
            borderRadius: 2,
            p: { xs: 1, sm: 2 },
            background: 'rgba(0,0,0,0.6)',
          }}
        >
          {loading ? (
            <Skeleton variant="rectangular" height={300} />
          ) : (
            <PieChartCard
              title=""
              data={pieData1}
              colors={['#FFB74D', '#4DB6AC', '#9575CD']}
              innerRadius={60}
              height={400}
              showZeroSlice
              animationDuration={1500}
            />
          )}
        </Box>

        {/* CHART 3: Other Cities */}
        <Box
          sx={{
            flex: { xs: '1 1 100%', md: '1 1 48%', lg: '1 1 32%' },
            border: '2px solid #FFC107',
            borderRadius: 2,
            p: { xs: 1, sm: 2 },
            background: 'rgba(0,0,0,0.6)',
          }}
        >
          {loading ? (
            <Skeleton variant="rectangular" height={300} />
          ) : (
            <PieChartCard
              title=""
              data={pieData2}
              colors={['#4E79A7', '#F28E2B', '#E15759', '#76B7B2', '#59A14F']}
              innerRadius={60}
              height={400}
              showZeroSlice
              animationDuration={1500}
            />
          )}
        </Box>
      </Box>
    </Container>
    <Footer />
  </>
);
  
}

