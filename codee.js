// ── ALL IMPORTS AT THE VERY TOP ───────────────────────────────────────────────
import React, { useEffect, useState } from 'react';
import {
  AppBar, Toolbar, Box, Typography, Select, MenuItem, IconButton,
  Drawer, List, ListItemButton, ListItemIcon, ListItemText, Tooltip,
  Popover, TextField, Button, useMediaQuery
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker, TimePicker } from '@mui/x-date-pickers';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

// ── ICONS ────────────────────────────────────────────────────────────────
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import HomeIcon from '@mui/icons-material/Home';
import HistoryIcon from '@mui/icons-material/History';
import InfoIcon from '@mui/icons-material/Info';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import LiveTvIcon from '@mui/icons-material/LiveTv';

// ── ASSETS ────────────────────────────────────────────────────────────────
import WuLogo from '../assets/wu-logo.png';
import DenverFlag from '../assets/flags/denver.png';
import MiamiFlag from '../assets/flags/miami.png';
import NewYorkFlag from '../assets/flags/new-york.png';
import AustinFlag from '../assets/flags/austin.png';
import DefaultFlag from '../assets/flags/default.png';

// ── SERVICES & HOOKS ──────────────────────────────────────────────────────
import { partitionList } from '../services/occupancy.service';
import { useLiveOccupancy } from '../hooks/useLiveOccupancy';

// ── DAYJS INIT ────────────────────────────────────────────────────────────
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault('UTC');

// ── MAPPINGS ──────────────────────────────────────────────────────────────
const displayNameMap = {
  'US.CO.OBS': 'Denver',
  'US.FL.Miami': 'Miami',
  'US.NYC': 'New York',
  'USA/Canada Default': 'Austin Texas',
};

const flagMap = {
  'US.CO.OBS': DenverFlag,
  'US.FL.Miami': MiamiFlag,
  'US.NYC': NewYorkFlag,
  'USA/Canada Default': AustinFlag,
};

// ── COMPONENT ─────────────────────────────────────────────────────────────
export default function Header({ title, mode, onTimeSelect, onLiveClick }) {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'lg'));

  const { data } = useLiveOccupancy(1000);
  const [lastUpdate, setLastUpdate] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);
  const [draftDate, setDraftDate] = useState(dayjs().utc());
  const [drawerOpen, setDrawerOpen] = useState(false);

  // ── LIVE UPDATE ─────────────────────────────────────────────────────────
  useEffect(() => {
    if (data) setLastUpdate(new Date().toLocaleTimeString());
  }, [data]);

  // ── ROUTING ─────────────────────────────────────────────────────────────
  const segments = location.pathname.split('/').filter(Boolean);
  const isPartitionPage = segments[0] === 'partition' && Boolean(segments[1]);
  const currentPartition = isPartitionPage ? decodeURIComponent(segments[1]) : '';
  let currentView = null;
  if (isPartitionPage && segments.length > 2) currentView = segments[2];
  else if (segments.length === 1 && segments[0] === 'history') currentView = 'history';
  const selectedFlag = flagMap[currentPartition] || DefaultFlag;

  const handlePartitionChange = (newPartition) => {
    if (!newPartition) return navigate('/');
    let path = `/partition/${encodeURIComponent(newPartition)}`;
    if (currentView) path += `/${currentView}`;
    else if (location.pathname === '/history') path += '/history';
    navigate(path);
    setDrawerOpen(false);
  };

  const handleDetailsClick = () => {
    if (isPartitionPage) navigate(`/partition/${encodeURIComponent(currentPartition)}/details`);
    else navigate('/partition/US.CO.OBS/details');
    setDrawerOpen(false);
  };

  // ── DATE/TIME PICKER HANDLERS ───────────────────────────────────────────
  const openPopover = (e) => {
    setDraftDate(dayjs().utc());
    setAnchorEl(e.currentTarget);
  };
  const closePopover = () => setAnchorEl(null);
  const handleGo = () => {
    onTimeSelect(draftDate.toISOString());
    closePopover();
  };

  // ── NAV ITEMS (reused in Drawer) ────────────────────────────────────────
  const navItems = [
    { label: 'Home', icon: <HomeIcon />, action: () => navigate('/') },
    {
      label: 'History',
      icon: <HistoryIcon />,
      action: () =>
        navigate(
          currentPartition
            ? `/partition/${encodeURIComponent(currentPartition)}/history`
            : '/history'
        ),
    },
    { label: 'Details', icon: <InfoIcon />, action: handleDetailsClick },
    { label: 'Jump to Time', icon: <AccessTimeIcon />, action: openPopover },
    { label: 'Live View', icon: <LiveTvIcon />, action: onLiveClick },
  ];

  // ── RETURN ──────────────────────────────────────────────────────────────
  return (
    <>
      <AppBar
        position="static"
        sx={{
          background: 'linear-gradient(90deg, #003366, #002244)',
          px: isMobile ? 1 : 2,
          py: isMobile ? 0.5 : 0,
        }}
      >
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {/* ── LEFT SECTION ── */}
          <Box display="flex" alignItems="center" gap={1}>
            <Box component="img" src={WuLogo} alt="WU Logo" sx={{ height: isMobile ? 28 : 36 }} />
            {!isMobile && (
              <Typography
                variant={isTablet ? 'h6' : 'h5'}
                sx={{ color: '#FFC107', fontWeight: 600 }}
              >
                {title}
                {currentPartition ? ` • ${displayNameMap[currentPartition]}` : ''}
              </Typography>
            )}
          </Box>

          {/* ── RIGHT SECTION ── */}
          {isMobile ? (
            <IconButton color="inherit" onClick={() => setDrawerOpen(true)}>
              <MenuIcon />
            </IconButton>
          ) : (
            <Box display="flex" alignItems="center" gap={1.5}>
              {/* NAV ICONS */}
              <Box display="flex" alignItems="center" gap={1.2}>
                {navItems.map((item, idx) => (
                  <Tooltip key={idx} title={item.label} arrow placement="bottom">
                    <IconButton color="inherit" onClick={item.action}>
                      {React.cloneElement(item.icon, { fontSize: 'medium' })}
                    </IconButton>
                  </Tooltip>
                ))}
              </Box>

              {/* SELECTOR */}
              <Select
                size={isTablet ? 'small' : 'medium'}
                value={currentPartition}
                displayEmpty
                onChange={(e) => handlePartitionChange(e.target.value)}
                sx={{
                  bgcolor: '#fff',
                  color: '#000',
                  borderRadius: 1,
                  minWidth: 160,
                  height: 40,
                }}
                renderValue={(selected) =>
                  selected ? (
                    <Box display="flex" alignItems="center">
                      <Box
                        component="img"
                        src={flagMap[selected] || DefaultFlag}
                        alt={selected}
                        sx={{
                          width: 22,
                          height: 15,
                          mr: 1,
                          border: '1px solid #555',
                          objectFit: 'cover',
                        }}
                      />
                      {displayNameMap[selected] || selected}
                    </Box>
                  ) : (
                    '— Select Region —'
                  )
                }
              >
                <MenuItem value="">— Select Region —</MenuItem>
                {partitionList.map((p) => (
                  <MenuItem key={p} value={p}>
                    {displayNameMap[p] || p}
                  </MenuItem>
                ))}
              </Select>

              {/* LAST UPDATE LABEL */}
              <Typography variant="body2" sx={{ color: '#FFC107' }}>
                {mode === 'live'
                  ? `Last update: ${lastUpdate}`
                  : 'Viewing historic'}
              </Typography>
            </Box>
          )}
        </Toolbar>
      </AppBar>

      {/* ── MOBILE DRAWER ── */}
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        PaperProps={{
          sx: { width: 260, background: '#002244', color: '#fff' },
        }}
      >
        <Box sx={{ p: 2 }}>
          <Box display="flex" justifyContent="flex-end">
            <IconButton onClick={() => setDrawerOpen(false)} sx={{ color: '#FFC107' }}>
              <CloseIcon />
            </IconButton>
          </Box>

          <Box display="flex" alignItems="center" mb={2}>
            <Box component="img" src={WuLogo} alt="WU" sx={{ height: 30, mr: 1 }} />
            <Typography variant="h6" sx={{ color: '#FFC107' }}>
              {title}
            </Typography>
          </Box>

          <List>
            {navItems.map((item, i) => (
              <ListItemButton key={i} onClick={item.action}>
                <ListItemIcon sx={{ color: '#FFC107' }}>{item.icon}</ListItemIcon>
                <ListItemText primary={item.label} />
              </ListItemButton>
            ))}
          </List>

          <Box mt={2}>
            <Typography variant="body2" sx={{ mb: 1, color: '#FFC107' }}>
              Select Region
            </Typography>
            <Select
              fullWidth
              size="small"
              value={currentPartition}
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
                      src={flagMap[selected] || DefaultFlag}
                      alt={selected}
                      sx={{ width: 20, height: 14, mr: 1 }}
                    />
                    {displayNameMap[selected] || selected}
                  </Box>
                ) : (
                  '— Select Region —'
                )
              }
            >
              <MenuItem value="">— Select Region —</MenuItem>
              {partitionList.map((p) => (
                <MenuItem key={p} value={p}>
                  {displayNameMap[p] || p}
                </MenuItem>
              ))}
            </Select>
          </Box>
        </Box>
      </Drawer>

      {/* ── DATE/TIME POPOVER ── */}
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
              onChange={(newVal) => setDraftDate(newVal)}
              renderInput={(props) => <TextField {...props} />}
            />
            <TimePicker
              label="Select Time (UTC)"
              value={draftDate}
              onChange={(newVal) => setDraftDate(newVal)}
              renderInput={(props) => <TextField {...props} />}
            />
          </LocalizationProvider>

          <Box display="flex" justifyContent="flex-end" gap={1}>
            <Button onClick={closePopover}>Cancel</Button>
            <Button variant="contained" onClick={handleGo}>
              Go
            </Button>
          </Box>
        </Box>
      </Popover>
    </>
  );
}