i want excle sheet like that
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



---------

    


// src/pages/PartitionDetailDetails.jsx
import React, { useEffect, useState, useMemo } from "react";
import {
  Container, Box, Typography, Button, TextField,
  TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody, Dialog, DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";

import { useParams, useNavigate } from "react-router-dom";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

import Header from "../components/Header";
import Footer from "../components/Footer";
import LoadingSpinner from "../components/LoadingSpinner";
import DataTable from "../components/DataTable";

import { fetchLiveSummary } from "../api/occupancy.service";
import { lookupFloor } from "../utils/floorLookup";

export default function PartitionDetailDetails() {
  const { partition } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [details, setDetails] = useState([]);
  const [liveCounts, setLiveCounts] = useState({});
  const [lastUpdate, setLastUpdate] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedFloor, setExpandedFloor] = useState(null); // unused except maybe future
  const [expanded, setExpanded] = useState(null); // dialog floor name or null

  // pull + poll
  useEffect(() => {
    let active = true;

    const load = async () => {
      let json;
      try {
        json = await fetchLiveSummary();
      } catch (err) {
        console.error("fetchLiveSummary error:", err);
        return;
      }
      if (!active) return;

      // --- 1) normalize & trim liveCounts keys ---
      const raw = json.realtime?.[partition]?.floors || {};
      const counts = Object.entries(raw).reduce((acc, [floor, count]) => {
        const f = (floor || "").trim();
        acc[f] = (acc[f] || 0) + count;
        return acc;
      }, {});
      setLiveCounts(counts);

      // --- 2) grab all swipes (in+out) for this partition ---
      const all = (json.details || []).filter(r =>
        r.PartitionName2 === partition &&
        (r.Direction === "InDirection" || r.Direction === "OutDirection")
      );

      // --- 3) sort oldest→newest & group to last swipe per user ---
      all.sort((a, b) => new Date(a.LocaleMessageTime) - new Date(b.LocaleMessageTime));
      const lastByPerson = {};
      all.forEach(r => { lastByPerson[r.PersonGUID] = r });

      // --- 4) keep only people whose **last** swipe is IN → currently inside ---
      const inside = Object.values(lastByPerson)
        .filter(r => r.Direction === "InDirection")
        .map(r => ({
          ...r,
          // 5) lookup & trim floor name
          floor: lookupFloor(r.PartitionName2, r.Door, r.Direction) || "Unknown"
        }));

      setDetails(inside);
      setLastUpdate(new Date().toLocaleTimeString());
      setLoading(false);
    };

    load();
    const iv = setInterval(load, 1000);
    return () => { active = false; clearInterval(iv); };
  }, [partition]);

  // build a map: floorName → rows[]
  const floorMap = useMemo(() => {
    const m = {};
    // ensure every floor in liveCounts appears
    Object.keys(liveCounts).forEach(f => { m[f] = [] });
    details.forEach(r => {
      const f = r.floor || "Unknown";
      if (!m[f]) m[f] = [];
      m[f].push(r);
    });
    return m;
  }, [details, liveCounts]);

  // columns
  const columns = [
    { field: "EmployeeID", headerName: "Emp ID" },
    { field: "ObjectName1", headerName: "Name" },
    { field: "LocaleMessageTime", headerName: "Swipe Time" },
    { field: "PersonnelType", headerName: "Type" },
    { field: "CardNumber", headerName: "Card" },
    { field: "Door", headerName: "Door" },
  ];

  // format API time string (HH:mm:ss from ISO) into 12h with AM/PM
  const formatApiTime12 = (iso, fallback) => {
    const raw = iso ? iso.slice(11, 19) : (fallback || '');
    if (!raw) return '';
    const [hh, mm, ss] = raw.split(':').map(Number);
    if (Number.isNaN(hh)) return raw;
    const hours12 = ((hh + 11) % 12) + 1;
    const ampm = hh >= 12 ? 'PM' : 'AM';
    return `${hours12.toString().padStart(2, '0')}:${mm.toString().padStart(2, '0')}:${ss.toString().padStart(2, '0')} ${ampm}`;
  };

  // normalized search term
  const term = (searchTerm || "").trim().toLowerCase();

  // helper: return rows for a floor taking search into account
  const getRowsForFloor = (floor) => {
    const allRows = floorMap[floor] || [];
    if (!term) return allRows;
    // floor-level match returns all rows for that floor
    if ((floor || "").toLowerCase().includes(term)) return allRows;
    // else return only rows that match fields
    return allRows.filter(r =>
      String(r.EmployeeID || "").toLowerCase().includes(term) ||
      String(r.ObjectName1 || "").toLowerCase().includes(term) ||
      String(r.CardNumber || "").toLowerCase().includes(term)
    );
  };

  // displayed floors: filter out floors with zero matched rows when searching, sort by headcount desc
  const displayed = useMemo(() => {
    const entries = Object.keys(floorMap).map(f => [f, getRowsForFloor(f)]);
    const filtered = entries.filter(([, rows]) => rows && rows.length > 0);
    filtered.sort(([a], [b]) => (liveCounts[b] || 0) - (liveCounts[a] || 0));
    return filtered;
  }, [floorMap, liveCounts, searchTerm]); // depend on searchTerm to recompute

  // preview rows per card (max 10)
  const getPreview = (rows) => rows.slice(0, 10);



  // Export a floor table to Excel, styled like dashboard
  const exportFloorToExcel = (floor) => {
    const rows = getRowsForFloor(floor);
    if (!rows || rows.length === 0) return;

    const dataForExcel = rows.map((r) => ({
      "Employee ID": r.EmployeeID,
      Name: r.ObjectName1,
      "Swipe Time": formatApiTime12(r.LocaleMessageTime, r.Swipe_Time),
      Type: r.PersonnelType,
      Card: r.CardNumber,
      Door: r.Door,
    }));

    // Create worksheet
    const worksheet = XLSX.utils.json_to_sheet(dataForExcel, { origin: "A2" });

    // Header row with dashboard-style color
    const headerRow = ["Employee ID", "Name", "Swipe Time", "Type", "Card", "Door"];
    XLSX.utils.sheet_add_aoa(worksheet, [headerRow], { origin: "A1" });

    // Column widths
    worksheet['!cols'] = [
      { wpx: 80 }, // Employee ID
      { wpx: 120 }, // Name
      { wpx: 100 }, // Swipe Time
      { wpx: 80 }, // Type
      { wpx: 80 }, // Card
      { wpx: 80 }, // Door
    ];

    // Apply basic header styling (yellow bg like dashboard)
    headerRow.forEach((_, colIdx) => {
      const cell = worksheet[XLSX.utils.encode_cell({ r: 0, c: colIdx })];
      if (cell) {
        cell.s = {
          fill: { fgColor: { rgb: "FFC107" } },
          font: { bold: true, color: { rgb: "000000" } },
          alignment: { horizontal: "center" },
        };
      }
    });

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, floor);

    const wbout = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    saveAs(new Blob([wbout], { type: "application/octet-stream" }), `${floor}-Details.xlsx`);
  };

  return (
    <>
      <Header />

      <Box sx={{ pt: 1, pb: 1, background: 'rgba(4, 4, 4, 0.6)' }}>
        <Container disableGutters maxWidth={false}>
          {/* Top controls */}
          <Box display="flex" flexDirection={{ xs: 'column', sm: 'row' }} alignItems={{ xs: 'flex-start', sm: 'center' }} justifyContent="space-between" mb={2} sx={{ px: 2 }}>
            <Button size="small" onClick={() => navigate(-1)} sx={{ color: '#FFC107', mb: { xs: 1, sm: 0 } }}>
              ← Back to Overview
            </Button>
            <Box display="flex" flexDirection={{ xs: 'column', sm: 'row' }} gap={1} alignItems={{ xs: 'flex-start', sm: 'center' }}>
              <Typography variant="h6" sx={{ color: '#FFC107' }}>Floor Details</Typography>
              <Typography variant="body2" sx={{ color: '#FFC107' }}>Last updated: {lastUpdate}</Typography>
              <TextField
                size="small"
                placeholder="Search…"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                sx={{
                  '& .MuiInputBase-input': { color: '#FFC107' },
                  '& .MuiOutlinedInput-root fieldset': { borderColor: '#FFC107' },
                  minWidth: { xs: '100%', sm: 200 }
                }}
              />
            </Box>
          </Box>

          {loading ? (
            <Box sx={{ px: 2, py: 8 }}><LoadingSpinner /></Box>
          ) : (
            <>
              {displayed.length === 0 ? (
                <Box sx={{ px: 2, py: 6 }}>
                  <Typography align="center" sx={{ color: '#FFC107' }}>
                    No results found for “{searchTerm}”
                  </Typography>
                </Box>
              ) : (
                <Box display="flex" flexWrap="wrap" justifyContent="center" width="100%" sx={{ px: { xs: 1, sm: 2, md: 3 } }}>
                  {displayed.map(([floor, rows]) => {
                    const preview = getPreview(rows);
                    const totalMatches = rows.length;
                    const showSeeMore = totalMatches > 10;

                    return (
                      <Box
                        key={floor}
                        sx={{
                          flex: { xs: "1 1 100%", sm: "1 1 48%", md: "1 1 48%" },
                          p: 1,
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "stretch",
                        }}
                      >
                        <Paper
                          sx={{
                            border: "2px solid #FFC107",
                            p: 2,
                            background: "rgba(0,0,0,0.4)",
                            height: "100%",
                            display: "flex",
                            flexDirection: "column",
                          }}
                        >
                          <Typography variant="subtitle1" fontWeight={600} sx={{ color: "#FFC107", mb: 1 }}>
                            {floor} (Total {liveCounts[floor] || 0})
                            <Button
                              size="small"
                              sx={{ color: "#4CAF50" }}
                              onClick={() => exportFloorToExcel(floor)}
                            >
                              Export Excel
                            </Button>
                          </Typography>


                          {/* Table */}
                          <Box sx={{ overflowX: "auto", flexGrow: 1 }}>
                            <TableContainer component={Paper} variant="outlined" sx={{ mb: 1, background: "rgba(0,0,0,0.4)" }}>
                              <Table size="small">
                                <TableHead>
                                  <TableRow sx={{ bgcolor: "#000" }}>
                                    {columns.map((c) => (
                                      <TableCell
                                        key={c.field}
                                        sx={{ color: "#FFC107", fontWeight: "bold", border: "1px solid #FFC107", minWidth: 80 }}
                                      >
                                        {c.headerName}
                                      </TableCell>
                                    ))}
                                  </TableRow>
                                </TableHead>
                                <TableBody>
                                  {preview.map((r, i) => (
                                    <TableRow key={`${r.PersonGUID || i}-${i}`}>
                                      <TableCell sx={{ color: "#fff", border: "1px solid #FFC107" }}>{r.EmployeeID}</TableCell>
                                      <TableCell sx={{ color: "#fff", border: "1px solid #FFC107" }}>{r.ObjectName1}</TableCell>
                                      <TableCell sx={{ color: "#fff", border: "1px solid #FFC107" }}>
                                        {formatApiTime12(r.LocaleMessageTime, r.Swipe_Time)}
                                      </TableCell>
                                      <TableCell sx={{ color: "#fff", border: "1px solid #FFC107" }}>{r.PersonnelType}</TableCell>
                                      <TableCell sx={{ color: "#fff", border: "1px solid #FFC107" }}>{r.CardNumber}</TableCell>
                                      <TableCell sx={{ color: "#fff", border: "1px solid #FFC107" }}>{r.Door}</TableCell>
                                    </TableRow>
                                  ))}
                                </TableBody>
                              </Table>
                            </TableContainer>
                          </Box>

                          {/* Right-aligned See More button */}
                          <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 1 }}>
                            {rows.length > 10 && (
                              <Button
                                size="small"
                                sx={{ color: "#FFC107" }}
                                onClick={() => setExpanded(floor)}
                              >
                                See more…
                              </Button>
                            )}
                          </Box>
                        </Paper>
                      </Box>
                    );
                  })}
                </Box>
              )}
            </>
          )}

          {/* Popup Modal */}
          <Dialog
            open={Boolean(expanded)}
            onClose={() => setExpanded(null)}
            maxWidth="lg"
            fullWidth
            sx={{
              "& .MuiDialog-paper": {
                width: "100%",
                maxWidth: { xs: "95%", sm: "90%", md: "85%", lg: "80%" },
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

            <DialogContent sx={{ overflowX: "auto", p: { xs: 1, sm: 2 } }}>
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
                      "& th:last-child, & td:last-child": { borderRight: "none" },
                      "& thead th": { backgroundColor: "#e7b40cff", fontWeight: "bold" },
                    }}
                  >
                    <TableHead>
                      <TableRow>
                        {columns.map((c) => (
                          <TableCell key={c.field}>{c.headerName}</TableCell>
                        ))}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {(getRowsForFloor(expanded) || []).map((r, i) => (
                        <TableRow
                          key={i}
                          sx={{
                            "&:hover": {
                              backgroundColor: "#3b3b39ff",
                            },
                          }}
                        >
                          <TableCell>{r.EmployeeID}</TableCell>
                          <TableCell>{r.ObjectName1}</TableCell>
                          <TableCell>{formatApiTime12(r.LocaleMessageTime, r.Swipe_Time)}</TableCell>
                          <TableCell>{r.PersonnelType}</TableCell>
                          <TableCell>{r.CardNumber}</TableCell>
                          <TableCell>{r.Door}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </DialogContent>

            <DialogActions sx={{ justifyContent: "center", py: { xs: 1, sm: 1.5 } }}>
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
      </Box>

      <Footer />
    </>
  );
}
