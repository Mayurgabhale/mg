outdirection is out of office. ony that time remove count 
or if outdirectio is othe or floor, so disply count on this floor 
ok 

// src/utils/floorLookup.js

import doorMap from './doorMap';

/**
 * Given a partition, door and direction, return the mapped floor string.
 * Falls back to 'Unmapped' only if there’s no matching entry.
 */
export function lookupFloor(partition, door, direction) {
  const entry = doorMap.find(
    d => d.partition === partition && d.door === door
  );
  if (!entry) return 'Unmapped';
  return direction === 'InDirection'
    ? entry.inDirectionFloor
    : entry.outDirectionFloor;
}

.......................
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


  useEffect(() => {
  let active = true;

  // clear previous details so table updates instantly
  setDetails([]);
  setExpanded(null);
  setLoading(true);

  const load = async () => {
    const json = await fetchLiveSummary();
    if (!active) return;

    const det = json.details
      .filter(r => r.PartitionName2 === partition && r.Direction === 'InDirection')
      .map(r => ({
        ...r,
        floor: lookupFloor(r.PartitionName2, r.Door, r.Direction)
      }));

    if (!active) return;
    setDetails(det);
    setLoading(false);
  };

  load();

  // optional: interval for live refresh
  const iv = setInterval(load, 1000);

  return () => {
    active = false;
    clearInterval(iv);
  };
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
