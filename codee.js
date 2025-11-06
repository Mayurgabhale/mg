hyderbaed i want to add in  india
so how to add this 

onst chartConfigs = useMemo(() => {
    return [
      {
        key: 'pune',
        title: 'India',
        body: pune?.total === 0
          ? (
            <Typography color="white" align="center" py={6}>
              No Pune data
            </Typography>
          )
          : (
            <CompositeChartCard

              data={puneChartData}

              lineColor={palette15[0]}
              height={250}
              sx={{ border: 'none' }}
            />
          )
      },


//C:\Users\W0024618\Desktop\apac-occupancy-frontend\src\pages\Dashboard.jsx
import React, { useMemo } from 'react';
import {Container, Box, Typography, Skeleton,Paper} from '@mui/material';

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
  '#4CAF50'];

const flagMap = {
  'Pune': indiaFlag,
  'Quezon City': philippinesFlag,
  'JP.Tokyo': japanFlag,
  'MY.Kuala Lumpur': malaysiaFlag,
  'Taguig City': philippinesFlag,
  'IN.HYD': indiaFlag,
  'SG.Singapore':SingaporeFlag
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
  const Singapore = partitions.find(p => p.name === 'SG.Singapore');
  const combinedRegions = partitions.filter(p =>
    ['JP.Tokyo', 'MY.Kuala Lumpur', 'Taguig City','IN.HYD'].includes(p.name)
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
        key: 'pune',
        title: 'India',
        body: pune?.total === 0
          ? (
            <Typography color="white" align="center" py={6}>
              No Pune data
            </Typography>
          )
          : (
            <CompositeChartCard

              data={puneChartData}

              lineColor={palette15[0]}
              height={250}
              sx={{ border: 'none' }}
            />
          )
      },
