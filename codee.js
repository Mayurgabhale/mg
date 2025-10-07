// src/pages/Dashboard.jsx
import React, { useEffect, useState } from 'react';
import { Container, Box, Typography, Skeleton } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useTheme, useMediaQuery } from '@mui/material';

// Flags
import CostaRicaFlag from '../assets/flags/costa-rica.png';
import ArgentinaFlag from '../assets/flags/argentina.png';
import MexicoFlag from '../assets/flags/mexico.png';
import PeruFlag from '../assets/flags/peru.png';
import BrazilFlag from '../assets/flags/brazil.png';
import PanamaFlag from '../assets/flags/panama.png';

import Header from '../components/Header';
import SummaryCard from '../components/SummaryCard';
import { useLiveOccupancy } from '../hooks/useLiveOccupancy';
import { partitionList } from '../services/occupancy.service';
import seatCapacities from '../data/seatCapacities';
import buildingCapacities from '../data/buildingCapacities';
import CompositeChartCard from '../components/CompositeChartCard';
import LineChartCard from '../components/LineChartCard';
import PieChartCard from '../components/PieChartCard';
import Footer from '../components/Footer';
import LoadingSpinner from '../components/LoadingSpinner';

const displayNameMap = {
  'CR.Costa Rica Partition': 'Costa Rica',
  'AR.Cordoba': 'Argentina',
  'MX.Mexico City': 'Mexico',
  'PE.Lima': 'Peru',
  'BR.Sao Paulo': 'Brazil',
  'PA.Panama City': 'Panama'
};

const palette15 = [
  '#FFC107', '#E57373', '#4CAF50', '#FFEB3B', '#FFD666',
  '#D84315', '#3F51B5', '#9C27B0', '#00BCD4', '#8BC34A',
  '#FF9800', '#673AB7', '#009688', '#CDDC39', '#795548'
];

export default function Dashboard() {
  const { data: liveData, loading, error } = useLiveOccupancy(1000);
  const [lastUpdate, setLastUpdate] = useState('');
  const [data, setData] = useState(null);
  const [mode, setMode] = useState('live');
  const navigate = useNavigate();

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));

  useEffect(() => {
    if (mode === 'live' && liveData) {
      setData(liveData);
    }
  }, [liveData, mode]);

  const handleSnapshot = (snapshotJson) => {
    setData(snapshotJson);
    setMode('snapshot');
  };

  const handleLive = () => {
    setMode('live');
    setData(liveData);
  };

  useEffect(() => {
    if (data) {
      setLastUpdate(new Date().toLocaleTimeString());
    }
  }, [data]);

  if (error) {
    return (
      <Box width="100vw" py={4}>
        <Typography color="error" align="center">
          Error loading live data
        </Typography>
      </Box>
    );
  }

  const regions = data?.realtime || {};
  const flagMap = {
    'CR.Costa Rica Partition': CostaRicaFlag,
    'AR.Cordoba': ArgentinaFlag,
    'MX.Mexico City': MexicoFlag,
    'PE.Lima': PeruFlag,
    'BR.Sao Paulo': BrazilFlag,
    'PA.Panama City': PanamaFlag,
  };

  const partitions = partitionList.map(name => {
    const key = Object.keys(regions).find(k => k.includes(name));
    const p = key ? regions[key] : {};
    return {
      name,
      total: p.total || 0,
      Employee: p.Employee || 0,
      Contractor: p.Contractor || 0,
      floors: p.floors || {},
      flag: flagMap[name],
    };
  }).sort((a, b) => b.total - a.total);

  const todayTot = data?.today?.total ?? 0;
  const todayEmp = data?.today?.Employee ?? 0;
  const todayCont = data?.today?.Contractor ?? 0;
  const realtimeTot = partitions.reduce((sum, p) => sum + p.total, 0);
  const realtimeEmp = partitions.reduce((sum, p) => sum + p.Employee, 0);
  const realtimeCont = partitions.reduce((sum, p) => sum + p.Contractor, 0);
  const crPartition = partitions.find(p => p.name === 'CR.Costa Rica Partition');
  const arPartition = partitions.find(p => p.name === 'AR.Cordoba');
  const smallOnes = partitions.filter(p =>
    ['MX.Mexico City', 'BR.Sao Paulo', 'PE.Lima', 'PA.Panama City'].includes(p.name)
  );

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
        }}>
        <LoadingSpinner />
      </Box>
    );
  }

  return (
    <>
      <Header onSnapshot={handleSnapshot} onLive={handleLive} />

      {mode === 'snapshot' && data?.timestamp && (
        <Box sx={{
          background: '#333',
          color: '#FFD666',
          textAlign: 'center',
          py: 1,
          borderRadius: 1,
          mb: 2,
        }}>
          <Typography variant="body2">
            Viewing historical snapshot for: {new Date(data.timestamp).toLocaleString()}
          </Typography>
        </Box>
      )}

      <Container
        maxWidth={false}
        disableGutters
        sx={{
          py: 2,
          px: 2,
          background: 'linear-gradient(135deg, #0f0f0f 0%, #1c1c1c 100%)',
          color: '#f5f5f5',
        }}>

        {/* Summary Cards */}
        <Box display="flex" flexWrap="wrap" gap={2} mb={2}>
          {[
            { title: "Today's Total Headcount", value: todayTot, border: '#FFB300', icon: <i className="fa-solid fa-users" style={{ fontSize: 20 }} /> },
            { title: "Today's Employees Count", value: todayEmp, border: '#8BC34A', icon: <i className="bi bi-people" style={{ fontSize: 20 }} /> },
            { title: "Today's Contractors Count", value: todayCont, border: '#E57373', icon: <i className="fa-solid fa-circle-user" style={{ fontSize: 20 }} /> },
            { title: "Realtime Headcount", value: realtimeTot, border: '#FFD180', icon: <i className="fa-solid fa-users" style={{ fontSize: 20 }} /> },
            { title: "Realtime Employees Count", value: realtimeEmp, border: '#AED581', icon: <i className="bi bi-people" style={{ fontSize: 20 }} /> },
            { title: "Realtime Contractors Count", value: realtimeCont, border: '#E57373', icon: <i className="fa-solid fa-circle-user" style={{ fontSize: 20 }} /> }
          ].map(c => (
            <Box
              key={c.title}
              sx={{
                flex: isMobile ? '1 1 100%' : isTablet ? '1 1 calc(50% - 16px)' : '1 1 calc(16.66% - 16px)'
              }}
            >
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

        {/* Region Cards */}
        <Box display="flex" flexWrap="wrap" gap={2} mb={3}>
          {partitions.map((p, index) => (
            <Box
              key={p.name}
              sx={{
                flex: isMobile ? '1 1 100%' : isTablet ? '1 1 calc(50% - 16px)' : '1 1 calc(16.66% - 16px)'
              }}
            >
              <SummaryCard
                title={
                  <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: '#FFC107' }}>
                    {p.name.replace(/^.*\./, '')}
                  </Typography>
                }
                total={p.total}
                stats={[
                  { label: 'Employees', value: p.Employee, color: '#40E0D0' },
                  { label: 'Contractors', value: p.Contractor, color: 'green' }
                ]}
                sx={{ width: '100%', border: `2px solid ${palette15[index % palette15.length]}` }}
                icon={<Box component="img" src={p.flag} sx={{ width: 48, height: 32 }} />}
              />
            </Box>
          ))}
        </Box>

        {/* Detail Widgets */}
        <Box display="flex" gap={2} flexWrap="wrap" mt={4}>
          {/* Costa Rica */}
          <Box sx={{
            flex: isMobile ? '1 1 100%' : isTablet ? '1 1 calc(50% - 16px)' : '1 1 calc(32% - 16px)',
            minWidth: 280, border: '1px solid #FFE599', borderRadius: 2, boxShadow: '0 2px 6px rgba(0,0,0,0.5)',
          }}>
            {crPartition.total === 0
              ? <Typography align="center" sx={{ py: 4, color: 'white' }}>No realtime employee data</Typography>
              : <CompositeChartCard
                title="Costa Rica"
                data={Object.entries(crPartition.floors).map(([f, c]) => ({
                  name: f.trim(), headcount: c, capacity: buildingCapacities[f.trim()] || 0
                }))}
                barColor={palette15[0]} lineColor={palette15[1]} height={350}
              />}
          </Box>

          {/* Argentina */}
          <Box sx={{
            flex: isMobile ? '1 1 100%' : isTablet ? '1 1 calc(50% - 16px)' : '1 1 calc(32% - 16px)',
            minWidth: 280, border: '1px solid #FFE599', borderRadius: 2, boxShadow: '0 2px 6px rgba(0,0,0,0.5)',
          }}>
            {arPartition.total === 0
              ? <Typography align="center" sx={{ py: 4, color: 'white' }}>No realtime employee data</Typography>
              : <LineChartCard
                title="Argentina"
                data={Object.entries(arPartition.floors).map(([f, c]) => ({
                  name: f.trim(), headcount: c, capacity: seatCapacities[`Argentina-${f.trim()}`] || 0
                }))}
                totalCapacity={450} lineColor1={palette15[2]} lineColor2={palette15[3]} height={350}
              />}
          </Box>

          {/* Latin America Pie */}
          <Box sx={{
            flex: isMobile ? '1 1 100%' : isTablet ? '1 1 100%' : '1 1 calc(32% - 16px)',
            minWidth: 280, border: '1px solid #FFE599', borderRadius: 2, boxShadow: '0 2px 6px rgba(0,0,0,0.5)',
          }}>
            <PieChartCard
              title="Latin America"
              data={smallOnes.map(p => ({
                name: displayNameMap[p.name], value: p.total, emp: p.Employee, cont: p.Contractor
              }))}
              colors={[palette15[4], palette15[5], palette15[6], palette15[7]]}
              height={350} showZeroSlice totalSeats={
                smallOnes.reduce((sum, p) => sum + seatCapacities[displayNameMap[p.name]], 0)
              }
            />
          </Box>
        </Box>
      </Container>

      <Footer />
    </>
  );
}