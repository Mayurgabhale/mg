Today's Total Headcount
34
Today's Employees Count
33
Today's Contractors Count
1

this count is not display immeditaily, i take more time to diplsy. 
 Realtime Headcount
33
Realtime Employees Count
32
Realtime Contractors Count
1 in this not issue

this count is display 

how to slove this issu
Today's Total Headcount
34
Today's Employees Count
33
Today's Contractors Count
1

... carefully


import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Box, Typography, Button } from '@mui/material';

import Header         from '../components/Header';
import Footer         from '../components/Footer';
import SummaryCard    from '../components/SummaryCard';
import ChartCard      from '../components/ChartCard';
import LoadingSpinner from '../components/LoadingSpinner';



import { fetchLiveSummary, fetchHistory } from '../api/occupancy.service';
// import buildingCapacities                from '../data/buildingCapacities';
import seatCapacities from '../data/buildingCapacities';

export default function PartitionDetail() {
  const { partition } = useParams();
  const navigate      = useNavigate();

  const [live, setLive]         = useState(null);
  const [history, setHistory]   = useState(null);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [lastUpdate, setLastUpdate] = useState('');

  // Poll live
  useEffect(() => {
    let active = true;
    const load = async () => {
      const json = await fetchLiveSummary();
      if (!active) return;
      setLive(json);
      setLastUpdate(new Date().toLocaleTimeString());
    };
    load();
    const iv = setInterval(load, 1000);
    return () => { active = false; clearInterval(iv); };
  }, [partition]);

  // Load history once
  useEffect(() => {
    setLoadingHistory(true);
    fetchHistory(partition).then(json => {
      setHistory(json);
      setLoadingHistory(false);
    });
  }, [partition]);

  if (!live || !history) return <LoadingSpinner />;

  const today  = history.summaryByDate.at(-1).region;
  const realtime = live.realtime[partition] || { total:0, Employee:0, Contractor:0, floors:{} };

  // Build floor entries
 const floorEntries = Object.entries(realtime.floors).map(([floor, cnt]) => {
  const rawName = floor.trim();                   // original floor name
  const name = rawName.split(' ')[0];             // extract first word (e.g. "London Floor 1" → "London")
  const capacity = seatCapacities[name] || 0; // match with buildingCapacities.js
  const percentage = capacity ? Math.round((cnt / capacity) * 100) : 0;

  console.log(`Floor: "${floor}" → name: "${name}", capacity: ${capacity}, percentage: ${percentage}`);

  return {
    name: rawName,         // keep full name for chart X-axis
    headcount: cnt,
    capacity,
    percentage
  };
});





  // Six cards
  const cards = [
  {
    title: "Today's Total Headcount",
    value: loadingHistory ? <LoadingSpinner size={25} /> : today.total,
    icon: <i className="fa-solid fa-users" style={{ color: '#E57373', fontSize: 25 }} />,
    border: '#FFB300'
  },
  {
    title: "Today's Employees Count",
    value: loadingHistory ? <LoadingSpinner size={25} /> : today.Employee,
    icon: <i className="bi bi-people" style={{ color: '#81C784', fontSize: 25 }} />,
    border: '#8BC34A'
  },
  {
    title: "Today's Contractors Count",
    value: loadingHistory ? <LoadingSpinner size={25} /> : today.Contractor,
    icon: <i className="fa-solid fa-circle-user" style={{ color: '#81C784', fontSize: 25 }} />,
    border: '#E57373'
  },
  {
    title: "Realtime Headcount",
    value: realtime.total,
    icon: <i className="fa-solid fa-users" style={{ color: '#BA68C8', fontSize: 25 }} />,
    border: '#FFD180'
  },
  {
    title: "Realtime Employees Count",
    value: realtime.Employee,
    icon: <i className="bi bi-people" style={{ color: '#81C784', fontSize: 25 }} />,
    border: '#AED581'
  },
  {
    title: "Realtime Contractors Count",
    value: realtime.Contractor,
    icon: <i className="fa-solid fa-circle-user" style={{ color: '#BA68C8', fontSize: 25 }} />,
    border: '#EF5350'
  }
];

  return (
    <>
      <Header />

      <Container maxWidth={false} disableGutters sx={{ px:2, py:2 }}>
        <Box mb={1}>
          <Button size="small" onClick={() => navigate(-1)}>← Back</Button>
        </Box>

        <Box display="flex" flexWrap="wrap" gap={1} mb={3}>
          {cards.map(c => (
            <Box key={c.title} sx={{ flex: '1 1 calc(16.66% - 8px)' }}>
              <SummaryCard
                title={c.title}
                total={c.value}
                stats={[]}
                icon={c.icon}
                sx={{ height: 140, border: `2px solid ${c.border}` }}
              />
            </Box>
          ))}
        </Box>

        <Box sx={{ border:'2px solid #FFC107', p:2, borderRadius:2, background:'rgba(0,0,0,0.6)' }}>
          <Box display="flex" justifyContent="space-between" mb={1}>
            <Typography variant="h6">Live Floor Headcount vs Capacity</Typography>
            <Typography variant="body2" color="textSecondary">Last updated: {lastUpdate}</Typography>
          </Box>

          <ChartCard
            data={floorEntries}
            dataKey="headcount"
            chartHeight={320}
            colors={{ head:'#28B463', cap:'#FDDA0D' }}
            axisProps={{
              xAxis: { tick:{ fill:'#fff' }, angle: -0, textAnchor:'end' },
              yAxis: { tick:{ fill:'#fff' } }
            }}
          />
        </Box>
      </Container>

      <Footer />
    </>
  );
}
