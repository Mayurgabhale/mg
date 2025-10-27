/ // ⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️
// // 📝📝📝📝 Responsive - Code📝📝📝📝 13-10 
// // ⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️


// C:\Users\W0024618\Desktop\apac-occupancy-frontend\src\components\Header.jsx
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
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'lg'));

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
    { icon: <HomeIcon />, label: 'Home Page', action: () => navigate('/') },
    { icon: <HistoryIcon />, label: 'History', action: () => navigate(currentPartition ? makePartitionPath('history') : '/history') },
    { icon: <ListAltIcon />, label: 'Live Details Page', action: () => navigate(currentPartition ? makePartitionPath('details') : '/partition/Pune/details') },
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
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          {/* Left: Logo + Title */}
          <Box display="flex" alignItems="center" sx={{ gap: 1 }}>
            <Box component="img" src={wuLogo} alt="WU" border='1' sx={{ height: isMobile ? 28 : 36, border: '1px solid black' }} />
            {!isMobile && (
              <Typography
                variant={isTablet ? 'h6' : 'h5'}
                sx={{ color: '#FFC107', fontWeight: 600, ml: 1 }}
              >
                APAC Occupancy
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
              {/* Icons with tooltips */}
              
              <Box display="flex" alignItems="center" gap={1.5}>
                {navItems.map((item, idx) => (
                  <Tooltip
                    key={idx}
                    title={
                      <Typography sx={{ fontSize: '0.9rem', fontWeight: 500 }}>
                        {item.label}
                      </Typography>
                    }
                    arrow
                    placement="bottom"
                  >
                    <IconButton color="inherit" onClick={item.action}>
                      {React.cloneElement(item.icon, { fontSize: 'medium' })}
                    </IconButton>
                  </Tooltip>
                ))}
              </Box>

              {/* Selector */}
              <Select
                size={isTablet ? 'small' : 'medium'}
                value={selectedPartition}
                displayEmpty
                onChange={(e) => handlePartitionChange(e.target.value)}
                sx={{
                  bgcolor: '#fff',
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
                        sx={{
                          width: 22,
                          height: 15,
                          mr: 1,
                          border: '1px solid #6a6868ff', // ✅ adds visible border
                          
                          objectFit: 'cover',
                        }}
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
          )}
        </Toolbar>
      </AppBar>

      {/* MOBILE DRAWER (unchanged) */}
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        PaperProps={{ sx: { width: 260, background: '#111', color: '#fff' } }}
      >
        <Box sx={{ p: 2 }}>
          <Box display="flex" justifyContent="flex-end">
            <IconButton onClick={() => setDrawerOpen(false)} sx={{ color: '#FFC107' }}>
              <CloseIcon />
            </IconButton>
          </Box>
          <Box display="flex" alignItems="center" mb={2}>
            <Box component="img" src={wuLogo} alt="WU" sx={{ height: 30, mr: 1 }} />
            <Typography variant="h6" sx={{ color: '#FFC107' }}>
              APAC Occupancy
            </Typography>
          </Box>
          <List>
            {navItems.map((item, i) => (
              <ListItemButton key={i} onClick={() => { item.action(); setDrawerOpen(false); }}>
                <ListItemIcon sx={{ color: '#FFC107' }}>{item.icon}</ListItemIcon>
                <ListItemText primary={item.label} />
              </ListItemButton>
            ))}
          </List>
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
        </Box>
      </Drawer>
    </>
  );
}

Read above code,
  and crate below page code responsive for eacha and every debice, and screen size. like above 
only respnisve ok 

// ── ALL IMPORTS AT THE VERY TOP ───────────────────────────────────────────────
import React, { useEffect, useState } from 'react';

// MUI core + pickers
import {
  AppBar,
  Toolbar,
  Box,
  Typography,
  Select,
  MenuItem,
  IconButton,
  Popover,
  TextField,
  Button
} from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker, TimePicker } from '@mui/x-date-pickers';

// Day.js + plugins
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

// React Router
import { useNavigate, useLocation, Link } from 'react-router-dom';

// Icons
import HomeIcon from '@mui/icons-material/Home';
import HistoryIcon from '@mui/icons-material/History';
import InfoIcon from '@mui/icons-material/Info';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import LiveTvIcon from '@mui/icons-material/LiveTv';

// Assets & hooks
import WuLogo from '../assets/wu-logo.png';
import DenverFlag from '../assets/flags/denver.png';
import MiamiFlag from '../assets/flags/miami.png';
import NewYorkFlag from '../assets/flags/new-york.png';
import AustinFlag from '../assets/flags/austin.png';
import DefaultFlag from '../assets/flags/default.png';

import { partitionList } from '../services/occupancy.service';
import { useLiveOccupancy } from '../hooks/useLiveOccupancy';

// ── Initialize Day.js UTC/timezone ────────────────────────────────────────────
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault('UTC');

// ── Display name map ─────────────────────────────────────────────────────────
const displayNameMap = {
  'US.CO.OBS': 'Denver',
  'US.FL.Miami': 'Miami',
  'US.NYC': 'New York',
  'USA/Canada Default': 'Austin Texas'
};

// ── Header Component ──────────────────────────────────────────────────────────
export default function Header({
  title,
  mode,
  onTimeSelect,
  onLiveClick
}) {
  const navigate = useNavigate();
  const location = useLocation();
  const { data } = useLiveOccupancy(1000);

  const [lastUpdate, setLastUpdate] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);
  const [draftDate, setDraftDate] = useState(dayjs().utc());

  // Update the “last update” timestamp on each live fetch
  useEffect(() => {
    if (data) setLastUpdate(new Date().toLocaleTimeString());
  }, [data]);

  


  // ── Routing logic ──────────────────────────────────────────────────────────
  // Update the routing logic to properly detect the current view
  const segments = location.pathname.split('/').filter(Boolean);
  const isPartitionPage = segments[0] === 'partition' && Boolean(segments[1]);
  const currentPartition = isPartitionPage ? decodeURIComponent(segments[1]) : '';

  // Detect current view more accurately
  let currentView = null;
  if (isPartitionPage && segments.length > 2) {
    // For partition pages with a view (details/history)
    currentView = segments[2];
  } else if (segments.length === 1 && segments[0] === 'history') {
    // For the standalone history page
    currentView = 'history';
  }


  const flagMap = {
    'US.CO.OBS': DenverFlag,
    'US.FL.Miami': MiamiFlag,
    'US.NYC': NewYorkFlag,
    'USA/Canada Default': AustinFlag
  };
  const selectedFlag = flagMap[currentPartition] || DefaultFlag;






  // Update handlePartitionChange to handle all cases
  const handlePartitionChange = newPartition => {
    if (!newPartition) return navigate('/');

    let path = `/partition/${encodeURIComponent(newPartition)}`;

    // Preserve the current view if it exists
    if (currentView) {
      path += `/${currentView}`;
    } else if (location.pathname === '/history') {
      // Special case: if we're on the standalone history page
      path += '/history';
    }

    navigate(path);
  };



  // Update handleDetailsClick to be consistent
  const handleDetailsClick = () => {
    if (isPartitionPage) {
      navigate(`/partition/${encodeURIComponent(currentPartition)}/details`);
    } else {
      navigate('/partition/US.CO.OBS/details');
    }
  };


  // ── Date/Time popover handlers ─────────────────────────────────────────────
  const openPopover = e => {
    setDraftDate(dayjs().utc());
    setAnchorEl(e.currentTarget);
  };
  const closePopover = () => setAnchorEl(null);
  const handleGo = () => {
    onTimeSelect(draftDate.toISOString());
    closePopover();
  };

  return (
    <>
      <AppBar position="static" color="primary" sx={{ mb: 2 }}>
        <Toolbar sx={{ justifyContent: 'space-between', alignItems: 'center' }}>

          {/* ── Left: logo, title, nav & time/live icons ── */}
          <Box display="flex" alignItems="center" sx={{ flexGrow: 1 }}>
            <Box component="img" src={WuLogo} alt="WU Logo" sx={{ height: 36, mr: 2 }} />

            <Typography variant="h6" sx={{ fontWeight: 600, mr: 3 }}>
              {title}
              {currentPartition ? ` • ${displayNameMap[currentPartition]}` : ''}
            </Typography>

          


            <IconButton
  component={Link}
  to="/"
  color="inherit"
>
  <HomeIcon />
</IconButton>


            <IconButton
              component={Link}
              to={
                currentPartition
                  ? `/partition/${encodeURIComponent(currentPartition)}/history`
                  : '/history'
              }
              color="inherit"
            >
              <HistoryIcon />
            </IconButton>

            <IconButton onClick={handleDetailsClick} color="inherit">
              <InfoIcon />
            </IconButton>

            <IconButton
              color={mode === 'time' ? 'secondary' : 'inherit'}
              onClick={openPopover}
              title="Jump to specific time"
            >
              <AccessTimeIcon />
            </IconButton>

            <IconButton
              color={mode === 'live' ? 'secondary' : 'inherit'}
              onClick={onLiveClick}
              title="Return to live"
            >
              <LiveTvIcon />
            </IconButton>
          </Box>

          {/* ── Right: region selector, flag, last-update/historic label ── */}
          <Box display="flex" alignItems="center" gap={1}>
            <Select
              size="small"
              value={currentPartition}
              displayEmpty
              onChange={e => handlePartitionChange(e.target.value)}
              sx={{ bgcolor: 'background.paper', mr: 1, minWidth: 160 }}
            >
              <MenuItem value="">— Select Region —</MenuItem>
              {partitionList.map(p => (
                <MenuItem key={p} value={p}>
                  {displayNameMap[p] || p}
                </MenuItem>
              ))}
            </Select>

            <Box component="img" src={selectedFlag} alt="Flag" sx={{ height: 32, mr: 2 }} />

            <Typography variant="body2" sx={{ color: '#FFF' }}>
              {mode === 'live'
                ? `Last update: ${lastUpdate}`
                : 'Viewing historic'}
            </Typography>
          </Box>
        </Toolbar>
      </AppBar>

      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={closePopover}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Box p={2} display="flex" flexDirection="column" gap={2}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label="Select Date (UTC)"
              value={draftDate}
              onChange={newVal => setDraftDate(newVal)}
              renderInput={props => <TextField {...props} />}
            />
            <TimePicker
              label="Select Time (UTC)"
              value={draftDate}
              onChange={newVal => setDraftDate(newVal)}
              renderInput={props => <TextField {...props} />}
            />
          </LocalizationProvider>
          <Box display="flex" justifyContent="flex-end" gap={1}>
            <Button onClick={closePopover}>Cancel</Button>
            <Button variant="contained" onClick={handleGo}>Go</Button>
          </Box>
        </Box>
      </Popover>
    </>
  );
}



