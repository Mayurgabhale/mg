// src/components/Header.jsx — Fully Responsive APAC Edition
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
  const [selectedPartition, setSelectedPartition] = useState('');

  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('lg'));    // ≥1280px
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'lg')); // 600–1280px
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));    // <600px

  useEffect(() => {
    if (data) setLastUpdate(new Date().toLocaleTimeString());
  }, [data]);

  // path & routing logic
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
  };

  return (
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
          flexDirection: isMobile ? 'column' : 'row',
          justifyContent: 'space-between',
          alignItems: isMobile ? 'flex-start' : 'center',
          flexWrap: 'wrap',
          gap: isMobile ? 1.5 : 0,
        }}
      >

        {/* -------- LEFT SECTION -------- */}
        <Box
          display="flex"
          alignItems="center"
          flexWrap="wrap"
          sx={{
            gap: isMobile ? 0.5 : 2,
            width: isMobile ? '100%' : 'auto',
          }}
        >
          {/* Logo */}
          <Box
            component="img"
            src={wuLogo}
            alt="WU"
            sx={{
              height: isMobile ? 28 : 36,
              mr: isMobile ? 0.5 : 1,
            }}
          />

          {/* Title */}
          {!isMobile && (
            <Typography
              variant={isTablet ? 'h6' : 'h5'}
              sx={{
                color: '#FFC107',
                fontWeight: 600,
                mr: 2,
                whiteSpace: 'nowrap',
              }}
            >
              APAC Occupancy
              {currentPartition && ` • ${displayNameMap[currentPartition] || currentPartition}`}
            </Typography>
          )}

          {/* Icons */}
          <Box
            display="flex"
            alignItems="center"
            sx={{
              gap: isMobile ? 0.5 : 1.5,
            }}
          >
            <IconButton color="inherit" onClick={() => navigate('/')}>
              <HomeIcon fontSize={isMobile ? 'small' : 'medium'} />
            </IconButton>

            <IconButton
              color="inherit"
              onClick={() =>
                navigate(currentPartition ? makePartitionPath('history') : '/history')
              }
            >
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

        {/* -------- RIGHT SECTION -------- */}
        <Box
          display="flex"
          alignItems="center"
          sx={{
            mt: isMobile ? 1 : 0,
            width: isMobile ? '100%' : 'auto',
            justifyContent: isMobile ? 'space-between' : 'flex-end',
            gap: isMobile ? 1 : 2,
          }}
        >
          {/* Partition Selector */}
          <Select
            size={isTablet ? 'small' : 'medium'}
            value={selectedPartition}
            displayEmpty
            onChange={(e) => handlePartitionChange(e.target.value)}
            sx={{
              bgcolor: 'background.paper',
              color: '#000',
              borderRadius: 1,
              minWidth: isMobile ? 140 : 180,
              fontSize: isMobile ? '0.8rem' : '1rem',
              height: isMobile ? 34 : 40,
            }}
            renderValue={(selected) =>
              selected ? (
                <Box display="flex" alignItems="center">
                  <Box
                    component="img"
                    src={flagMap[selected]}
                    alt={selected}
                    sx={{
                      width: 20,
                      height: 14,
                      mr: 1,
                      borderRadius: 0.5,
                    }}
                  />
                  {displayNameMap[selected] || selected}
                </Box>
              ) : (
                '— Select Site —'
              )
            }
          >
            <MenuItem value="">— Select Site —</MenuItem>
            {partitionList.map((p) => (
              <MenuItem key={p} value={p}>
                {displayNameMap[p] || p}
              </MenuItem>
            ))}
          </Select>

          {/* Optional: last update time (hidden on small screens) */}
          {!isMobile && (
            <Typography
              variant="body2"
              sx={{
                color: '#FFC107',
                fontSize: isTablet ? '0.8rem' : '0.9rem',
                whiteSpace: 'nowrap',
              }}
            >
              Updated: {lastUpdate || '--:--:--'}
            </Typography>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}