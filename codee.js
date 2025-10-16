// C:\Users\W0024618\Desktop\laca-occupancy-frontend\src\components\Header.jsx
import React, { useEffect, useState } from 'react';
import {
  AppBar, Toolbar, Box, Typography,
  Select, MenuItem, IconButton, Drawer, List, ListItemButton, ListItemIcon, ListItemText, Tooltip, useMediaQuery
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useNavigate, useLocation } from 'react-router-dom';

import MenuIcon from '@mui/icons-material/Menu';
import HomeIcon from '@mui/icons-material/Home';
import HistoryIcon from '@mui/icons-material/History';
import ListAltIcon from '@mui/icons-material/ListAlt';
import InsertChartIcon from '@mui/icons-material/InsertChart'; // ✅ ERT icon
import CloseIcon from '@mui/icons-material/Close';

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

const displayNameMap = {
  'CR.Costa Rica Partition': 'Costa Rica',
  'MX.Mexico City': 'Mexico',
  'AR.Cordoba': 'Cordoba',
  'PA.Panama City': 'Panama',
  'PE.Lima': 'Lima',
  'BR.Sao Paulo': 'Sao Paulo'
};

const flagMap = {
  'CR.Costa Rica Partition': CostaRicaFlag,
  'AR.Cordoba': ArgentinaFlag,
  'MX.Mexico City': MexicoFlag,
  'PE.Lima': PeruFlag,
  'BR.Sao Paulo': BrazilFlag,
  'PA.Panama City': PanamaFlag,
};

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const { data } = useLiveOccupancy(1000);
  const [lastUpdate, setLastUpdate] = useState('');
  const [selectedPartition, setSelectedPartition] = useState('');
  const [drawerOpen, setDrawerOpen] = useState(false);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'lg'));

  useEffect(() => {
    if (data) setLastUpdate(new Date().toLocaleTimeString());
  }, [data]);

  const parts = location.pathname.split('/').filter(Boolean);
  const isPartitionPath = parts[0] === 'partition' && Boolean(parts[1]);
  const currentPartition = isPartitionPath ? decodeURIComponent(parts[1]) : '';
  const suffixSegments = isPartitionPath
    ? parts.slice(2)
    : parts[0] === 'history'
      ? ['history']
      : [];

  useEffect(() => {
    setSelectedPartition(currentPartition);
  }, [currentPartition]);

  const makePartitionPath = (suffix) => {
    const base = `/partition/${encodeURIComponent(currentPartition)}`;
    return suffix ? `${base}/${suffix}` : base;
  };

  const handlePartitionChange = (newPartition) => {
    if (!newPartition) return navigate('/');
    setSelectedPartition(newPartition);

    const base = `/partition/${encodeURIComponent(newPartition)}`;
    const full = suffixSegments.length
      ? `${base}/${suffixSegments.join('/')}`
      : base;

    navigate(full);
    setDrawerOpen(false);
  };

  const navItems = [
    { icon: <HomeIcon />, label: 'Home Page', action: () => navigate('/') },
    { icon: <HistoryIcon />, label: 'History', action: () => navigate(currentPartition ? makePartitionPath('history') : '/history') },
    { icon: <ListAltIcon />, label: 'Live Details Page', action: () => navigate(currentPartition ? makePartitionPath('details') : '/partition/CR.Costa%20Rica%20Partition/details') },
    { icon: <InsertChartIcon />, label: 'ERT Overview', action: () => navigate('/ErtPage') }, // ✅ ERT icon
  ];

  return (
    <>
      <AppBar
        position="static"
        sx={{
          background: 'linear-gradient(90deg, #111, #222)',
          px: isMobile ? 1 : 2,
          py: isMobile ? 0.5 : 0,
        }}
      >
        <Toolbar
          disableGutters
          sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
        >
          {/* Left: Logo + Title */}
          <Box display="flex" alignItems="center" sx={{ gap: 1 }}>
            <Box component="img" src={WuLogo} alt="WU" sx={{ height: isMobile ? 28 : 36 }} />
            {!isMobile && (
              <Typography variant={isTablet ? 'h6' : 'h5'} sx={{ color: '#FFC107', fontWeight: 600 }}>
                Western Union – LACA
                {currentPartition && ` • ${displayNameMap[currentPartition] || currentPartition}`}
              </Typography>
            )}
          </Box>

          {/* Right Section */}
          {isMobile ? (
            <IconButton color="inherit" onClick={() => setDrawerOpen(true)}>
              <MenuIcon />
            </IconButton>
          ) : (
            <Box display="flex" alignItems="center" gap={2}>
              <Box display="flex" alignItems="center" gap={1.5}>
                {navItems.map((item, idx) => (
                  <Tooltip key={idx} title={item.label} arrow placement="bottom">
                    <IconButton color="inherit" onClick={item.action}>
                      {React.cloneElement(item.icon, { fontSize: 'medium' })}
                    </IconButton>
                  </Tooltip>
                ))}
              </Box>

              <Select
                size={isTablet ? 'small' : 'medium'}
                value={selectedPartition}
                displayEmpty
                onChange={(e) => handlePartitionChange(e.target.value)}
                sx={{ bgcolor: '#fff', color: '#000', borderRadius: 1, minWidth: 160, fontSize: '0.9rem', height: 40 }}
                renderValue={(selected) =>
                  selected ? (
                    <Box display="flex" alignItems="center">
                      <Box component="img" src={flagMap[selected] || LacaFlag} alt={selected} sx={{ width: 22, height: 15, mr: 1, border: '1px solid #6a6868ff' }} />
                      {displayNameMap[selected] || selected}
                    </Box>
                  ) : '— Select Partition —'
                }
              >
                <MenuItem value="">— Select Partition —</MenuItem>
                {partitionList.map((p) => (
                  <MenuItem key={p} value={p}>
                    {displayNameMap[p] || p}
                  </MenuItem>
                ))}
              </Select>
            </Box>
          )}
        </Toolbar>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer anchor="right" open={drawerOpen} onClose={() => setDrawerOpen(false)} PaperProps={{ sx: { width: 260, background: '#111', color: '#fff' } }}>
        <Box sx={{ p: 2 }}>
          <Box display="flex" justifyContent="flex-end">
            <IconButton onClick={() => setDrawerOpen(false)} sx={{ color: '#FFC107' }}>
              <CloseIcon />
            </IconButton>
          </Box>
          <Box display="flex" alignItems="center" mb={2}>
            <Box component="img" src={WuLogo} alt="WU" sx={{ height: 30, mr: 1 }} />
            <Typography variant="h6" sx={{ color: '#FFC107' }}>
              Western Union – LACA
            </Typography>
          </Box>
          <List>
            {navItems.map((item, i) => (
              <ListItemButton key={i} onClick={() => { item.action(); setDrawerOpen(false); }}>
                <ListItemIcon sx={{ color: '#FFC107' }}>{item.icon}</ListItemIcon>
                <ListItemText primary={item.label} sx={{ color: '#FFC107' }} />
              </ListItemButton>
            ))}
          </List>
          <Box mt={2}>
            <Typography variant="body2" sx={{ mb: 1, color: '#FFC107' }}>Select Partition</Typography>
            <Select
              fullWidth
              size="small"
              value={selectedPartition}
              displayEmpty
              onChange={(e) => handlePartitionChange(e.target.value)}
              sx={{ bgcolor: '#fff', color: '#000', borderRadius: 1, fontSize: '0.85rem' }}
              renderValue={(selected) =>
                selected ? (
                  <Box display="flex" alignItems="center">
                    <Box component="img" src={flagMap[selected] || LacaFlag} alt={selected} sx={{ width: 20, height: 14, mr: 1 }} />
                    {displayNameMap[selected] || selected}
                  </Box>
                ) : '— Select Partition —'
              }
            >
              <MenuItem value="">— Select Partition —</MenuItem>
              {partitionList.map((p) => (
                <MenuItem key={p} value={p}>
                  {displayNameMap[p] || p}
                </MenuItem>
              ))}
            </Select>
          </Box>
        </Box>
      </Drawer>
    </>
  );
}