// src/components/Header.jsx — Fully Responsive APAC Edition (with Drawer Menu)
import React, { useEffect, useState } from 'react';
import {
  AppBar, Toolbar, Box, Typography,
  Select, MenuItem, IconButton, Drawer, List, ListItemButton, ListItemIcon, ListItemText, useMediaQuery
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useNavigate, useLocation } from 'react-router-dom';

import MenuIcon from '@mui/icons-material/Menu';
import HomeIcon from '@mui/icons-material/Home';
import HistoryIcon from '@mui/icons-material/History';
import ListAltIcon from '@mui/icons-material/ListAlt';
import CloseIcon from '@mui/icons-material/Close';

import wuLogo from '../assets/images/wu-logo.png';
import IndiaFlag from '../assets/flags/india.png';
import MalaysiaFlag from '../assets/flags/malaysia.png';
import PhilippinesFlag from '../assets/flags/philippines.png';
import JapanFlag from '../assets/flags/japan.png';
import HYDFlag from '../assets/flags/india.png';

import { partitionList } from '../services/occupancy.service';
import { useLiveOccupancy } from '../hooks/useLiveOccupancy';

const displayNameMap = {
  'IN.Pune': 'Pune',
  'MY.Kuala Lumpur': 'Kuala Lumpur',
  'PH.Quezon': 'Quezon City',
  'PH.Taguig': 'Taguig',
  'JP.Tokyo': 'Tokyo',
  'IN.HYD': 'Hyderabad',
};

const flagMap = {
  'Pune': IndiaFlag,
  'MY.Kuala Lumpur': MalaysiaFlag,
  'Quezon City': PhilippinesFlag,
  'Taguig City': PhilippinesFlag,
  'JP.Tokyo': JapanFlag,
  'IN.HYD': HYDFlag,
};

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const { data } = useLiveOccupancy(1000);
  const [lastUpdate, setLastUpdate] = useState('');
  const [selectedPartition, setSelectedPartition] = useState('');
  const [drawerOpen, setDrawerOpen] = useState(false);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));   // <600px
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'lg')); // 600–1280px

  useEffect(() => {
    if (data) setLastUpdate(new Date().toLocaleTimeString());
  }, [data]);

  // Routing setup
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
    if (newPartition === 'Pune' && suffixSegments.length === 0) {
      window.location.href = 'http://10.199.22.57:3011/';
      return;
    }

    const base = `/partition/${encodeURIComponent(newPartition)}`;
    const full = suffixSegments.length
      ? `${base}/${suffixSegments.join('/')}`
      : base;

    navigate(full);
    setDrawerOpen(false);
  };

  const navItems = [
    { icon: <HomeIcon />, label: 'Home', action: () => navigate('/') },
    { icon: <HistoryIcon />, label: 'History', action: () => navigate(currentPartition ? makePartitionPath('history') : '/history') },
    { icon: <ListAltIcon />, label: 'Details', action: () => navigate(currentPartition ? makePartitionPath('details') : '/partition/Pune/details') },
  ];

  return (
    <>
      {/* ===== APP BAR ===== */}
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
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          {/* --- Left: Logo + Title --- */}
          <Box display="flex" alignItems="center" sx={{ gap: 1 }}>
            <Box
              component="img"
              src={wuLogo}
              alt="WU"
              sx={{
                height: isMobile ? 28 : 36,
              }}
            />
            {!isMobile && (
              <Typography
                variant={isTablet ? 'h6' : 'h5'}
                sx={{
                  color: '#FFC107',
                  fontWeight: 600,
                  ml: 1,
                }}
              >
                APAC Occupancy
                {currentPartition && ` • ${displayNameMap[currentPartition] || currentPartition}`}
              </Typography>
            )}
          </Box>

          {/* --- Right: Desktop Menu or Mobile Drawer Toggle --- */}
          {isMobile ? (
            <IconButton color="inherit" onClick={() => setDrawerOpen(true)}>
              <MenuIcon />
            </IconButton>
          ) : (
            <Box display="flex" alignItems="center" gap={2}>
              {/* Icons */}
              <Box display="flex" alignItems="center" gap={1.5}>
                {navItems.map((item, idx) => (
                  <IconButton key={idx} color="inherit" onClick={item.action}>
                    {item.icon}
                  </IconButton>
                ))}
              </Box>

              {/* Selector */}
              <Select
                size={isTablet ? 'small' : 'medium'}
                value={selectedPartition}
                displayEmpty
                onChange={(e) => handlePartitionChange(e.target.value)}
                sx={{
                  bgcolor: 'background.paper',
                  color: '#000',
                  borderRadius: 1,
                  minWidth: 160,
                  fontSize: '0.9rem',
                  height: 40,
                }}
                renderValue={(selected) =>
                  selected ? (
                    <Box display="flex" alignItems="center">
                      <Box
                        component="img"
                        src={flagMap[selected]}
                        alt={selected}
                        sx={{ width: 20, height: 14, mr: 1 }}
                      />
                      {displayNameMap[selected] || selected}
                    </Box>
                  ) : '— Select Site —'
                }
              >
                <MenuItem value="">— Select Site —</MenuItem>
                {partitionList.map((p) => (
                  <MenuItem key={p} value={p}>
                    {displayNameMap[p] || p}
                  </MenuItem>
                ))}
              </Select>

              {/* Last Update */}
              <Typography variant="body2" sx={{ color: '#FFC107' }}>
                {lastUpdate || '--:--:--'}
              </Typography>
            </Box>
          )}
        </Toolbar>
      </AppBar>

      {/* ===== MOBILE DRAWER ===== */}
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        PaperProps={{
          sx: { width: 260, background: '#111', color: '#fff' },
        }}
      >
        <Box sx={{ p: 2 }}>
          {/* Close Button */}
          <Box display="flex" justifyContent="flex-end">
            <IconButton onClick={() => setDrawerOpen(false)} sx={{ color: '#FFC107' }}>
              <CloseIcon />
            </IconButton>
          </Box>

          {/* Logo & Title */}
          <Box display="flex" alignItems="center" mb={2}>
            <Box component="img" src={wuLogo} alt="WU" sx={{ height: 30, mr: 1 }} />
            <Typography variant="h6" sx={{ color: '#FFC107' }}>
              APAC Occupancy
            </Typography>
          </Box>

          {/* Navigation */}
          <List>
            {navItems.map((item, i) => (
              <ListItemButton key={i} onClick={() => { item.action(); setDrawerOpen(false); }}>
                <ListItemIcon sx={{ color: '#FFC107' }}>{item.icon}</ListItemIcon>
                <ListItemText primary={item.label} />
              </ListItemButton>
            ))}
          </List>

          {/* Site Selector */}
          <Box mt={2}>
            <Typography variant="body2" sx={{ mb: 1, color: '#FFC107' }}>
              Select Site
            </Typography>
            <Select
              fullWidth
              size="small"
              value={selectedPartition}
              displayEmpty
              onChange={(e) => handlePartitionChange(e.target.value)}
              sx={{
                bgcolor: '#fff',
                color: '#000',
                borderRadius: 1,
                fontSize: '0.85rem',
              }}
              renderValue={(selected) =>
                selected ? (
                  <Box display="flex" alignItems="center">
                    <Box
                      component="img"
                      src={flagMap[selected]}
                      alt={selected}
                      sx={{ width: 20, height: 14, mr: 1 }}
                    />
                    {displayNameMap[selected] || selected}
                  </Box>
                ) : '— Select Site —'
              }
            >
              <MenuItem value="">— Select Site —</MenuItem>
              {partitionList.map((p) => (
                <MenuItem key={p} value={p}>
                  {displayNameMap[p] || p}
                </MenuItem>
              ))}
            </Select>
          </Box>

          {/* Last Updated */}
          <Typography variant="body2" sx={{ mt: 2, color: '#FFC107' }}>
            Updated: {lastUpdate || '--:--:--'}
          </Typography>
        </Box>
      </Drawer>
    </>
  );
}