 <Box display="flex" alignItems="center" gap={2} flexWrap="wrap">
      <TextField
        type="datetime-local"
        size="small"
        value={localDT}
        onChange={e => setLocalDT(e.target.value)}
        InputLabelProps={{ shrink: true }}
      />
      <Button variant="contained" color="secondary" onClick={handleApplySnapshot}>
        Apply
      </Button>
      <Button variant="outlined" onClick={() => { setLocalDT(''); if (onLive) onLive(); }}>
        Live
      </Button>
      <Select
        size="small"
        value={currentPartition}
        displayEmpty
        onChange={e => handlePartitionChange(e.target.value)}
        sx={{ bgcolor: 'background.paper', minWidth: 150 }}
      >
        <MenuItem value="">— Select Partition —</MenuItem>
        {partitionList.map(p => (
          <MenuItem key={p} value={p}>
            {displayNameMap[p] || p}
          </MenuItem>
        ))}

time select not work, chekck why not wokr 
=========
  
// ......  7-10..... Responsive .........///


import React, { useEffect, useState } from 'react';
import {
  AppBar,
  Toolbar,
  Box,
  Typography,
  Select,
  MenuItem,
  IconButton,
  Button,
  TextField,
  Drawer,
  useMediaQuery
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { Link, useNavigate, useLocation } from 'react-router-dom';

import MenuIcon from '@mui/icons-material/Menu';
import HomeIcon from '@mui/icons-material/Home';
import HistoryIcon from '@mui/icons-material/History';
import ListAltIcon from '@mui/icons-material/ListAlt';

import WuLogo from '../assets/wu-logo.png';
import CostaRicaFlag from '../assets/flags/costa-rica.png';
import ArgentinaFlag from '../assets/flags/argentina.png';
import MexicoFlag from '../assets/flags/mexico.png';
import PeruFlag from '../assets/flags/peru.png';
import BrazilFlag from '../assets/flags/brazil.png';
import PanamaFlag from '../assets/flags/panama.png';
import LacaFlag from '../assets/laca-flag.png';

import { partitionList } from '../services/occupancy.service';
import { useLiveOccupancy } from '../hooks/useLiveOccupancy';
import { Nav } from 'react-bootstrap';
import { DateTime } from 'luxon';

const displayNameMap = {
  'CR.Costa Rica Partition': 'Costa Rica',
  'MX.Mexico City': 'Mexico',
  'AR.Cordoba': 'Cordoba',
  'PA.Panama City': 'Panama',
  'PE.Lima': 'Lima',
  'BR.Sao Paulo': 'Sao Paulo'
};

const partitionTimezoneMap = {
  'AR.Cordoba': 'America/Argentina/Cordoba',
  'BR.Sao Paulo': 'America/Sao_Paulo',
  'CR.Costa Rica Partition': 'America/Costa_Rica',
  'MX.Mexico City': 'America/Mexico_City',
  'PA.Panama City': 'America/Panama',
  'PE.Lima': 'America/Lima'
};

export default function Header({ onSnapshot, onLive }) {
  const navigate = useNavigate();
  const loc = useLocation();
  const { data } = useLiveOccupancy(1000);
  const [lastUpdate, setLastUpdate] = useState('');
  const [localDT, setLocalDT] = useState('');
  const [drawerOpen, setDrawerOpen] = useState(false);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));   // small screen
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md')); // medium screen

  useEffect(() => {
    if (data) setLastUpdate(new Date().toLocaleTimeString());
  }, [data]);

  const parts = loc.pathname.split('/').filter(Boolean);
  const isPartitionPath = parts[0] === 'partition' && Boolean(parts[1]);
  const currentPartition = isPartitionPath ? decodeURIComponent(parts[1]) : '';
  const suffixSegments = isPartitionPath
    ? parts.slice(2)
    : parts[0] === 'history'
      ? ['history']
      : [];

  const flagMap = {
    'CR.Costa Rica Partition': CostaRicaFlag,
    'AR.Cordoba': ArgentinaFlag,
    'MX.Mexico City': MexicoFlag,
    'PE.Lima': PeruFlag,
    'BR.Sao Paulo': BrazilFlag,
    'PA.Panama City': PanamaFlag,
  };
  const selectedFlag = flagMap[currentPartition] || LacaFlag;

  const makePartitionPath = suffix => {
    const base = `/partition/${encodeURIComponent(currentPartition)}`;
    return suffix ? `${base}/${suffix}` : base;
  };

  const handlePartitionChange = newPartition => {
    if (!newPartition) return navigate('/');
    const base = `/partition/${encodeURIComponent(newPartition)}`;
    const full = suffixSegments.length
      ? `${base}/${suffixSegments.join('/')}`
      : base;
    navigate(full);
  };

  const handleApplySnapshot = async () => {
    if (!localDT) return alert('Select a date/time first.');
    if (!currentPartition) return alert('Select a partition first.');

    const tz = partitionTimezoneMap[currentPartition] || 'UTC';
    const atDt = DateTime.fromISO(localDT, { zone: tz });

    if (!atDt.isValid) return alert('Invalid date/time');
    if (atDt > DateTime.now().setZone(tz)) return alert('Cannot pick a future time.');

    const dateStr = atDt.toFormat('yyyy-LL-dd');
    const timeStr = atDt.toFormat('HH:mm:ss');
    const url = `/api/occupancy/occupancy-at-time?date=${dateStr}&time=${timeStr}&location=${encodeURIComponent(currentPartition)}`;

    try {
      const resp = await fetch(url);
      const json = await resp.json();
      if (onSnapshot) onSnapshot(json);
    } catch (err) {
      console.error('Snapshot fetch failed', err);
      alert('Snapshot fetch failed, check console.');
    }
  };

  const RightControls = (
    <Box display="flex" alignItems="center" gap={2} flexWrap="wrap">
      <TextField
        type="datetime-local"
        size="small"
        value={localDT}
        onChange={e => setLocalDT(e.target.value)}
        InputLabelProps={{ shrink: true }}
      />
      <Button variant="contained" color="secondary" onClick={handleApplySnapshot}>
        Apply
      </Button>
      <Button variant="outlined" onClick={() => { setLocalDT(''); if (onLive) onLive(); }}>
        Live
      </Button>
      <Select
        size="small"
        value={currentPartition}
        displayEmpty
        onChange={e => handlePartitionChange(e.target.value)}
        sx={{ bgcolor: 'background.paper', minWidth: 150 }}
      >
        <MenuItem value="">— Select Partition —</MenuItem>
        {partitionList.map(p => (
          <MenuItem key={p} value={p}>
            {displayNameMap[p] || p}
          </MenuItem>
        ))}
      </Select>
      {/* <Box component="img" src={selectedFlag} alt="Flag" sx={{ height: 40 }} /> */}
    </Box>
  );

  return (
    <>
      <AppBar position="static" color="primary" sx={{ mb: 2 }}>
        <Toolbar sx={{ justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' }}>
          {/* Left side */}
          <Box display="flex" alignItems="center" sx={{ flexGrow: 1 }}>
            <Box component="img" src={WuLogo} alt="WU Logo" sx={{ height: 32, mr: 1 }} />
            <Typography variant="h6" sx={{ fontWeight: 600, mr: 2, fontSize: isMobile ? '1rem' : '1.25rem' }}>
              WU – LACA {currentPartition && <> • {displayNameMap[currentPartition] || currentPartition}</>}
            </Typography>

            {!isMobile && (
              <>
                {/* <IconButton size="large" color="inherit" onClick={() => navigate(currentPartition ? `/partition/${encodeURIComponent(currentPartition)}` : '/')}> */}
                <IconButton size="large" color="inherit" onClick={() => navigate('/')}>
                  <HomeIcon sx={{ color: '#4caf50' }} />
                </IconButton>
                <IconButton size="large" color="inherit" onClick={() => navigate(currentPartition ? makePartitionPath('history') : '/history')}>
                  <HistoryIcon sx={{ color: '#F88379' }} />
                </IconButton>
                <IconButton size="large" color="inherit" onClick={() => navigate(currentPartition ? makePartitionPath('details') : '/partition/CR.Costa%20Rica%20Partition/details')}>
                  <ListAltIcon sx={{ color: '#2196f3' }} />
                </IconButton>
                <Nav.Link as={Link} to="/ErtPage" className="nav-item-infographic">
                  ERT Overview
                </Nav.Link>
              </>
            )}
          </Box>

          {/* Right side: show controls or hamburger */}
          {isMobile ? (
            <IconButton color="inherit" onClick={() => setDrawerOpen(true)}>
              <MenuIcon />
            </IconButton>
          ) : (
            RightControls
          )}
        </Toolbar>
      </AppBar>

      {/* Drawer for mobile */}
      <Drawer anchor="right" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
        <Box p={2} width={280} role="presentation" display="flex" flexDirection="column" gap={2}>
          {RightControls}
          <Box display="flex" justifyContent="space-around" mt={2}>
            <IconButton size="large" color="inherit" onClick={() => navigate('/')}>
              <HomeIcon />
            </IconButton>
            <IconButton size="large" color="inherit" onClick={() => navigate('/history')}>
              <HistoryIcon />
            </IconButton>
            <IconButton size="large" color="inherit" onClick={() => navigate('/partition/CR.Costa%20Rica%20Partition/details')}>
              <ListAltIcon />
            </IconButton>
          </Box>
          <Nav.Link as={Link} to="/ErtPage" className="nav-item-infographic">
            ERT Overview
          </Nav.Link>
        </Box>
      </Drawer>
    </>
  );
}
