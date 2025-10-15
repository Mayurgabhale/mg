in this one some issue is the when i slect in selet box any region that time it take some time to do  display data in page,
  but url and hader update quickly but data not update quickly, i means table not show  quickly ok 
thats the issue ... 
  
 this http://localhost:3000/partition/UK.London/details and this  EMEA Occupancy • London show quickley but 
this not visibal quickly 
Floor Details
Search floor / emp…

London (Total 33)
ID	Name	Time	Type	CompanyName	Card	Door
W0025900	Caizatoa, Luis	05:50:59 AM	Contractor	Mitie Cleaning	615432	WU-UK-MH-SOUTH LIFT LOBBY ENTRY
250122	Nayak, Shobha	12:12:37 PM	Employee	Western Union Payment Services GB Ltd	221262	WU-UK-MH-SOUTH LIFT LOBBY ENTRY

whne i slec differetn differnt region ok 


import React, { useEffect, useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container, Box, Typography, Button, TextField,
  TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";

import Header from '../components/Header';
import Footer from '../components/Footer';
import LoadingSpinner from '../components/LoadingSpinner';
import DataTable from '../components/DataTable';
import { fetchLiveSummary } from '../api/occupancy.service';
import { lookupFloor } from '../utils/floorLookup';

export default function PartitionDetailDetails() {
  const { partition } = useParams();
  const navigate = useNavigate();

  const [details, setDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState('');
  const [search, setSearch] = useState('');
  const [expanded, setExpanded] = useState(null);

  // Load & refresh
  useEffect(() => {
    let active = true;
    const load = async () => {
      const json = await fetchLiveSummary();
      if (!active) return;
      const det = json.details
        .filter(r => r.PartitionName2 === partition && r.Direction === 'InDirection')
        .map(r => ({
          ...r,
          floor: lookupFloor(r.PartitionName2, r.Door, r.Direction)
        }));
      setDetails(det);
      setLastUpdate(new Date().toLocaleTimeString());
      setLoading(false);
    };
    load();
    const iv = setInterval(load, 1000);
    return () => { active = false; clearInterval(iv); };
  }, [partition]);

  const floorMap = useMemo(() => {
    return details.reduce((m, r) => {
      m[r.floor] = m[r.floor] || [];
      m[r.floor].push(r);
      return m;
    }, {});
  }, [details]);


  const formatApiTime12 = (iso) => {
    if (!iso || typeof iso !== 'string') return '';
    // Expect ISO like "2025-09-01T03:35:14.000Z"
    const hh = iso.slice(11, 13);
    const mm = iso.slice(14, 16);
    const ss = iso.slice(17, 19);
    if (!hh || !mm || !ss) return '';
    let h = parseInt(hh, 10);
    if (Number.isNaN(h)) return `${hh}:${mm}:${ss}`;
    const ampm = h >= 12 ? 'PM' : 'AM';
    let h12 = h % 12;
    if (h12 === 0) h12 = 12;
    return `${String(h12).padStart(2, '0')}:${mm}:${ss} ${ampm}`;
  };
  const displayed = useMemo(() => {
    const term = search.toLowerCase();
    return Object.entries(floorMap)
      .map(([floor, emps]) => {
        const filteredEmps = emps.filter(e =>
          floor.toLowerCase().includes(term) ||
          e.ObjectName1?.toLowerCase().includes(term) ||
          e.EmployeeID?.toString().toLowerCase().includes(term) ||
          e.CardNumber?.toString().toLowerCase().includes(term)    // Card Number
        );
        return [floor, filteredEmps];
      })
      .filter(([, filteredEmps]) => filteredEmps.length > 0);
  }, [floorMap, search]);

  const exportToExcel = async (floor, data) => {
    if (!data || data.length === 0) return;

    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('Entries');

    // Title row (merged)
    sheet.mergeCells('A1:H1');
    const titleCell = sheet.getCell('A1');
    titleCell.value = `${floor} — Entries`;
    titleCell.alignment = { horizontal: 'center', vertical: 'middle' };
    titleCell.font = { name: 'Calibri', size: 14, bold: true, color: { argb: 'FF000000' } };
    titleCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '8a8987' } };

    // Header row (row 2)
    const headers = ["Sr No", "ID", "Name", "Time", "Type", "CompanyName", "Card", "Door"];
    const headerRow = sheet.addRow(headers);
    headerRow.eachCell((cell) => {
      cell.font = { name: 'Calibri', size: 11, bold: true, color: { argb: 'FF000000' } };
      cell.alignment = { horizontal: 'center', vertical: 'middle', wrapText: false };
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFC107' } };
      cell.border = {
        top: { style: 'thin', color: { argb: 'FF000000' } },
        left: { style: 'thin', color: { argb: 'FF000000' } },
        bottom: { style: 'thin', color: { argb: 'FF000000' } },
        right: { style: 'thin', color: { argb: 'FF000000' } }
      };
    });

    // Data rows (start at row 3)
    data.forEach((r, i) => {
      const row = sheet.addRow([
        i + 1,
        r.EmployeeID ?? '',
        r.ObjectName1 ?? '',
        formatApiTime12(r.LocaleMessageTime),
        r.PersonnelType ?? '',
        r.CompanyName ?? '',
        r.CardNumber ?? '',
        r.Door ?? ''
      ]);

      // row styling: borders + alternate fill
      row.eachCell((cell) => {
        cell.alignment = { vertical: 'middle', wrapText: false };
        cell.border = {
          top: { style: 'thin', color: { argb: 'FF000000' } },
          left: { style: 'thin', color: { argb: 'FF000000' } },
          bottom: { style: 'thin', color: { argb: 'FF000000' } },
          right: { style: 'thin', color: { argb: 'FF000000' } }
        };
      });

      if ((i + 1) % 2 === 0) {
        row.eachCell(cell => {
          cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF7F7F7' } };
        });
      }
    });

    // Column widths & small alignment tweaks
    sheet.columns = [
      { key: 'sr', width: 8 },        // Sr No
      { key: 'id', width: 14 },       // ID
      { key: 'name', width: 28 },     // Name
      { key: 'time', width: 16 },     // Time
      { key: 'type', width: 16 },     // Type
      { key: 'company', width: 34 },  // CompanyName
      { key: 'card', width: 18 },     // Card
      { key: 'door', width: 50 }      // Door
    ];

    // Freeze header area (keep title + header visible)
    sheet.views = [{ state: 'frozen', ySplit: 2 }];

    // Add a thin outer border around the entire used range for polish
    const lastRow = sheet.rowCount;
    const lastCol = sheet.columns.length;
    for (let r = 1; r <= lastRow; r++) {
      for (let c = 1; c <= lastCol; c++) {
        const cell = sheet.getCell(r, c);
        // ensure border exists (merge with existing)
        cell.border = {
          top: cell.border?.top || { style: 'thin', color: { argb: 'FF000000' } },
          left: cell.border?.left || { style: 'thin', color: { argb: 'FF000000' } },
          bottom: cell.border?.bottom || { style: 'thin', color: { argb: 'FF000000' } },
          right: cell.border?.right || { style: 'thin', color: { argb: 'FF000000' } },
        };
      }
    }

    // File save
    const buf = await workbook.xlsx.writeBuffer();
    const safeFloor = String(floor).replace(/[^a-z0-9\-_]/gi, '_').slice(0, 80);
    const ts = new Date().toISOString().slice(0, 19).replace(/[:T]/g, '-');
    saveAs(new Blob([buf]), `${safeFloor}_entries_${ts}.xlsx`);
  };

  if (loading) {
    return <>
      <Header />
      <Box p={4}><LoadingSpinner /></Box>
      <Footer />
    </>;
  }
  return (
    <>
      <Header />
      <Container
        maxWidth={false}
        disableGutters
        sx={{
          px: { xs: 1, sm: 2, md: 3 },
          py: { xs: 1, sm: 2 },
        }}
      >
        {/* Back button */}
        <Box mb={1}>
          <Button
            size="small"
            onClick={() => navigate(-1)}
            sx={{
              fontSize: { xs: "0.8rem", sm: "0.9rem" },
            }}
          >
            ← Back to Overview
          </Button>
        </Box>

        {/* Title and Search field */}
        <Box
          display="flex"
          alignItems="center"
          flexWrap="wrap"
          gap={0.5}
          mb={2}
          sx={{
            flexDirection: { xs: "column", sm: "row" },
            alignItems: { xs: "flex-start", sm: "center" },
            gap: { xs: 1, sm: 0.5 },
          }}
        >
          <Typography
            variant="h6"
            sx={{
              fontSize: { xs: "1rem", sm: "1.2rem", md: "1.4rem" },
            }}
          >
            Floor Details
          </Typography>

          <TextField
            size="small"
            placeholder="Search floor / emp…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            sx={{
              ml: { xs: 0, sm: 1 },
              mt: { xs: 1, sm: 0 },
              width: { xs: "100%", sm: "auto" },
            }}
          />
        </Box>

        {/* Floors list */}
        <Box
          display="flex"
          flexWrap="wrap"
          sx={{
            justifyContent: { xs: "center", sm: "flex-start" },
          }}
        >
          {[...displayed]
            .sort((a, b) => b[1].length - a[1].length)
            .map(([floor, emps]) => {
              const visibleEmps = emps.slice(0, 10);

              return (
                <Box
                  key={floor}
                  sx={{
                    width: {
                      xs: "100%",
                      sm: "100%",
                      md: "50%", // ✅ 2 per row on laptop/desktop
                      lg: "50%",
                      xl: "50%",
                    },
                    p: { xs: 0.5, sm: 1 },
                    boxSizing: "border-box",
                  }}
                >
                  {/* Header row */}
                  <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    mb={1}
                    flexWrap="wrap"
                    sx={{
                      gap: { xs: 1, sm: 0 },
                    }}
                  >
                    <Typography
                      variant="subtitle1"
                      gutterBottom
                      sx={{
                        fontWeight: "bold",
                        fontSize: { xs: "0.9rem", sm: "1rem" },
                      }}
                    >
                      {floor} (Total {emps.length})
                    </Typography>
                    <Button
                      size="small"
                      variant="contained"
                      onClick={() => exportToExcel(floor, emps)}
                      sx={{
                        fontSize: { xs: "0.7rem", sm: "0.8rem" },
                        px: { xs: 1, sm: 1.2 },
                        py: { xs: 0.3, sm: 0.4 },
                      }}
                    >
                      Export
                    </Button>
                  </Box>

                  {/* Table wrapper */}
                  <Box
                    sx={{
                      border: "2px solid #FFC107",
                      borderRadius: 1,
                      p: { xs: 0.5, sm: 1 },
                      display: "flex",
                      flexDirection: "column",
                      minHeight: 120,
                      overflow: "hidden",
                    }}
                  >
                    <TableContainer
                      component={Paper}
                      variant="outlined"
                      sx={{
                        overflowY: "auto",
                        overflowX: "auto",
                        flexGrow: 1,
                      }}
                    >
                      <Table size="small" stickyHeader>
                        <TableHead>
                          <TableRow>
                            {[
                              "ID",
                              "Name",
                              "Time",
                              "Type",
                              "CompanyName",
                              "Card",
                              "Door",
                            ].map((h, idx, arr) => (
                              <TableCell
                                key={h}
                                sx={{
                                  fontWeight: "bold",
                                  py: 0.5,
                                  whiteSpace: "nowrap",
                                  fontSize: { xs: "0.75rem", sm: "0.85rem" },
                                  borderRight:
                                    idx !== arr.length - 1
                                      ? "1px solid #ccc"
                                      : "none",
                                  borderBottom: "1px solid #ccc",
                                }}
                              >
                                {h}
                              </TableCell>
                            ))}
                          </TableRow>
                        </TableHead>

                        <TableBody>
                          {visibleEmps.map((r, i) => (
                            <TableRow key={i}>
                              {[
                                r.EmployeeID,
                                r.ObjectName1,
                                formatApiTime12(r.LocaleMessageTime),
                                r.PersonnelType,
                                r.CompanyName,
                                r.CardNumber,
                                r.Door,
                              ].map((val, idx, arr) => (
                                <TableCell
                                  key={idx}
                                  sx={{
                                    py: 0.5,
                                    minWidth: [50, 120, 100, 80, 100, 100][idx],
                                    whiteSpace: "nowrap",
                                    borderRight:
                                      idx !== arr.length - 1
                                        ? "1px solid #eee"
                                        : "none",
                                    fontSize: { xs: "0.75rem", sm: "0.85rem" },
                                  }}
                                >
                                  {val}
                                </TableCell>
                              ))}
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>

                    {emps.length > 10 && (
                      <Box textAlign="right" mt={1}>
                        <Button
                          size="small"
                          onClick={() => setExpanded(floor)}
                          sx={{
                            fontSize: { xs: "0.7rem", sm: "0.8rem" },
                          }}
                        >
                          See more…
                        </Button>
                      </Box>
                    )}
                  </Box>
                </Box>
              );
            })}
        </Box>

        {/* ✅ Popup Modal */}
        <Dialog
          open={Boolean(expanded)}
          onClose={() => setExpanded(null)}
          maxWidth="lg"
          fullWidth
          sx={{
            "& .MuiDialog-paper": {
              width: "100%",
              maxWidth: { xs: "95%", sm: "90%", md: "85%", lg: "80%" }, // responsive width
            },
          }}
        >
          <DialogTitle
            sx={{
              fontWeight: "bold",
              textAlign: "center",
              fontSize: { xs: "1rem", sm: "1.2rem", md: "1.4rem" },
            }}
          >
            {expanded} — All Entries
          </DialogTitle>

          <DialogContent
            sx={{
              overflowX: "auto",
              p: { xs: 1, sm: 2 },
            }}
          >
            {expanded && (
              <TableContainer
                component={Paper}
                variant="outlined"
                sx={{
                  border: "2px solid #FFC107",
                  borderRadius: 2,
                  overflowX: "auto",
                  boxShadow: "0px 2px 6px rgba(0,0,0,0.1)",
                }}
              >
                <Table
                  size="small"
                  stickyHeader
                  sx={{
                    borderCollapse: "collapse",
                    width: "100%",
                    "& th, & td": {
                      borderRight: "1px solid #ddd",
                      borderBottom: "1px solid #ddd",
                      textAlign: "left",
                      px: { xs: 0.5, sm: 1 },
                      py: { xs: 0.6, sm: 0.8 },
                      fontSize: { xs: "0.75rem", sm: "0.85rem", md: "0.9rem" },
                      whiteSpace: "nowrap",
                    },
                    "& th:last-child, & td:last-child": {
                      borderRight: "none",
                    },
                    "& thead th": {
                      backgroundColor: "#e7b40cff",
                      fontWeight: "bold",
                    },
                  }}
                >
                  <TableHead>
                    <TableRow>
                      {[
                        "Sr No",
                        "ID",
                        "Name",
                        "Time",
                        "Type",
                        "CompanyName",
                        "Card",
                        "Door",
                      ].map((h) => (
                        <TableCell key={h}>{h}</TableCell>
                      ))}
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {floorMap[expanded]?.map((r, i) => (
                      <TableRow
                        key={i}
                        sx={{
                          "&:hover": {
                            backgroundColor: "#3b3b39ff",
                          },
                        }}
                      >
                        <TableCell>{i + 1}</TableCell>
                        <TableCell>{r.EmployeeID}</TableCell>
                        <TableCell>{r.ObjectName1}</TableCell>
                        <TableCell>{formatApiTime12(r.LocaleMessageTime)}</TableCell>
                        <TableCell>{r.PersonnelType}</TableCell>
                        <TableCell>{r.CompanyName}</TableCell>
                        <TableCell>{r.CardNumber}</TableCell>
                        <TableCell>{r.Door}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </DialogContent>

          <DialogActions
            sx={{
              justifyContent: "center",
              py: { xs: 1, sm: 1.5 },
            }}
          >
            <Button
              variant="contained"
              color="warning"
              onClick={() => setExpanded(null)}
              sx={{
                px: { xs: 2, sm: 3 },
                py: { xs: 0.7, sm: 0.9 },
                fontSize: { xs: "0.8rem", sm: "0.9rem" },
                borderRadius: 2,
                textTransform: "none",
              }}
            >
              Close
            </Button>
          </DialogActions>
        </Dialog>


      </Container>
      <Footer />
    </>
  );
}
.................


import React, { useEffect, useState } from 'react';
import {
  AppBar, Toolbar, Box, Typography, Select, MenuItem,
  IconButton, Drawer, List, ListItemButton, ListItemIcon, ListItemText,
  Tooltip, useMediaQuery
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useNavigate, useLocation } from 'react-router-dom';

import MenuIcon from '@mui/icons-material/Menu';
import HomeIcon from '@mui/icons-material/Home';
import HistoryIcon from '@mui/icons-material/History';
import ListAltIcon from '@mui/icons-material/ListAlt';
import CloseIcon from '@mui/icons-material/Close';

import wuLogo from '../assets/wu-logo.png';
import austriaFlag from '../assets/flags/austria.png';
import uaeFlag from '../assets/flags/uae.png';
import irelandFlag from '../assets/flags/ireland.png';
import italyFlag from '../assets/flags/italy.png';
import lithuaniaFlag from '../assets/flags/lithuania.png';
import moroccoFlag from '../assets/flags/morocco.png';
import russiaFlag from '../assets/flags/russia.png';
import ukFlag from '../assets/flags/uk.png';
import spainFlag from '../assets/flags/spain.png';

import { partitionList } from '../api/occupancy.service';
import { useLiveOccupancy } from '../hooks/useLiveOccupancy';

const displayNameMap = {
  'AUT.Vienna': 'Vienna',
  'DU.Abu Dhab': 'Abu Dhabi',
  'IE.Dublin': 'Dublin',
  'IT.Rome': 'Rome',
  'LT.Vilnius': 'Vilnius',
  'MA.Casablanca': 'Casablanca',
  'RU.Moscow': 'Moscow',
  'UK.London': 'London',
  'ES.Madrid': 'Madrid',
};

const flagMap = {
  'AUT.Vienna': austriaFlag,
  'DU.Abu Dhab': uaeFlag,
  'IE.Dublin': irelandFlag,
  'IT.Rome': italyFlag,
  'LT.Vilnius': lithuaniaFlag,
  'MA.Casablanca': moroccoFlag,
  'RU.Moscow': russiaFlag,
  'UK.London': ukFlag,
  'ES.Madrid': spainFlag,
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
    { icon: <ListAltIcon />, label: 'Live Details Page', action: () => navigate(currentPartition ? makePartitionPath('details') : '/partition/LT.Vilnius/details') },
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
            <Box component="img" src={wuLogo} alt="WU" sx={{ height: isMobile ? 28 : 36, border: '1px solid black' }} />
            {!isMobile && (
              <Typography
                variant={isTablet ? 'h6' : 'h5'}
                sx={{ color: '#FFC107', fontWeight: 600, ml: 1 }}
              >
                EMEA Occupancy
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
              {/* Navigation Icons */}
              <Box display="flex" alignItems="center" gap={1.5}>
                {navItems.map((item, idx) => (
                  <Tooltip
                    key={idx}
                    title={<Typography sx={{ fontSize: '0.9rem', fontWeight: 500 }}>{item.label}</Typography>}
                    arrow
                    placement="bottom"
                  >
                    <IconButton color="inherit" onClick={item.action}>
                      {React.cloneElement(item.icon, { fontSize: 'medium' })}
                    </IconButton>
                  </Tooltip>
                ))}
              </Box>

              {/* Partition Selector */}
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
                          border: '1px solid #6a6868ff',
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

      {/* Mobile Drawer */}
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
              EMEA Occupancy
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

          {/* Partition Selector in Drawer */}
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
