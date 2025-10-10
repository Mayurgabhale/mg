// src/components/Header.jsx — Responsive APAC Edition
import React, { useEffect, useState } from 'react';
import {
  AppBar, Toolbar, Box, Typography,
  Select, MenuItem, IconButton, useMediaQuery
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useNavigate, useLocation } from 'react-router-dom';

import HomeIcon from '@mui/icons-material/Home';
import HistoryIcon from '@mui/icons-material/History';
import ListAltIcon from '@mui/icons-material/ListAlt';

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

  const theme = useTheme();
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));   // <960px
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));   // <600px

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

  const selectedFlag = flagMap[currentPartition];

  const makePartitionPath = (suffix) => {
    const base = `/partition/${encodeURIComponent(currentPartition)}`;
    return suffix ? `${base}/${suffix}` : base;
  };

  const handlePartitionChange = (newPartition) => {
    if (!newPartition) return navigate('/');

    if (newPartition === 'Pune' && suffixSegments.length === 0) {
      window.location.href = 'http://10.199.22.57:3011/';
      return;
    }

    const base = `/partition/${encodeURIComponent(newPartition)}`;
    const full = suffixSegments.length
      ? `${base}/${suffixSegments.join('/')}`
      : base;
    navigate(full);
  };

  return (
    <AppBar position="static" color="primary" sx={{ mb: 2 }}>
      <Toolbar
        sx={{
          justifyContent: 'space-between',
          flexDirection: isMobile ? 'column' : 'row',
          alignItems: isMobile ? 'flex-start' : 'center',
          gap: isMobile ? 1 : 0,
        }}
      >
        {/* Left Section */}
        <Box display="flex" alignItems="center" sx={{ flexWrap: 'wrap' }}>
          <Box component="img" src={wuLogo} alt="WU" sx={{ height: isMobile ? 28 : 36, mr: 1 }} />
          {!isMobile && (
            <Typography variant="h6" sx={{ flexGrow: 1, mr: 2 }}>
              APAC Occupancy
              {currentPartition && ` • ${displayNameMap[currentPartition] || currentPartition}`}
            </Typography>
          )}

          <Box>
            <IconButton color="inherit" onClick={() => navigate('/')}>
              <HomeIcon fontSize={isMobile ? 'small' : 'medium'} />
            </IconButton>

            <IconButton color="inherit" onClick={() => navigate(currentPartition ? makePartitionPath('history') : '/history')}>
              <HistoryIcon fontSize={isMobile ? 'small' : 'medium'} />
            </IconButton>

            <IconButton
              color="inherit"
              onClick={() =>
                navigate(currentPartition
                  ? makePartitionPath('details')
                  : '/partition/Pune/details'
                )
              }
            >
              <ListAltIcon fontSize={isMobile ? 'small' : 'medium'} />
            </IconButton>
          </Box>
        </Box>

        {/* Right Section */}
        <Box display="flex" alignItems="center" sx={{ mt: isMobile ? 1 : 0 }}>
          <Select
            size={isTablet ? 'small' : 'medium'}
            value={currentPartition}
            displayEmpty
            onChange={(e) => handlePartitionChange(e.target.value)}
            sx={{
              bgcolor: 'background.paper',
              minWidth: isMobile ? 130 : 180,
              fontSize: isMobile ? '0.8rem' : '1rem',
            }}
            renderValue={(selected) =>
              selected ? (
                <Box display="flex" alignItems="center">
                  <Box component="img" src={flagMap[selected]} alt={selected}
                    sx={{ width: 20, height: 14, mr: 1 }} />
                  {displayNameMap[selected] || selected}
                </Box>
              ) : "— Select Site —"
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
      </Toolbar>
    </AppBar>
  );
}