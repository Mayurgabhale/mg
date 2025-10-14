
in detial sectin we got correct count but in dashboard compoist chart and this Pune

Pune

678
Employees

590

Contractors

88

not correct count 
this is detisl count 
Podium Floor (Total 510)
Tower B (Total 159)
2nd Floor (Total 9)
// src/pages/PartitionDetailDetails.jsx

import React, { useEffect, useState, useMemo } from "react";
import {
  Container, Box, Typography, Button, TextField,
  Paper, TableContainer, Table, TableHead, TableRow, TableCell, TableBody
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";

import Header from "../components/Header";
import Footer from "../components/Footer";
import LoadingSpinner from "../components/LoadingSpinner";
import DataTable from "../components/DataTable";
import ExcelJS from 'exceljs';
import { fetchLiveSummary } from "../api/occupancy.service";
import { lookupFloor } from "../utils/floorLookup";



import { saveAs } from 'file-saver';



export default function PartitionDetailDetails() {
  const { partition } = useParams();
  const navigate = useNavigate();

  const [details, setDetails] = useState([]);
  const [liveCounts, setLiveCounts] = useState({});
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState("");
  const [search, setSearchTerm] = useState("");
  const [expandedFloor, setExpandedFloor] = useState(null);


  // Helper: format API ISO (UTC) to "hh:mm:ss AM/PM"
  const formatApiDateTime = iso => {
    if (!iso) return "";
    const d = new Date(iso);
    if (isNaN(d)) return iso;

    const hours24 = d.getUTCHours();
    const minutes = String(d.getUTCMinutes()).padStart(2, "0");
    const seconds = String(d.getUTCSeconds()).padStart(2, "0");

    const ampm = hours24 >= 12 ? "PM" : "AM";
    let hour12 = hours24 % 12;
    if (hour12 === 0) hour12 = 12;
    const hourStr = String(hour12).padStart(2, "0");

    return `${hourStr}:${minutes}:${seconds} ${ampm}`;
  };





  const handleExportFloor = async (floor, emps) => {
  if (!emps || emps.length === 0) return;

  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet("FloorExport");

  // --- Header row ---
  const headers = [
    "Emp ID",
    "Name",
    "Swipe Time",
    "Type",
    "Company",
    "Direction",
    "Card",
    "Door"
  ];
  const headerRow = sheet.addRow(headers);
  headerRow.eachCell(cell => {
    cell.font = { bold: true, color: { argb: "FFFFFFFF" } };
    cell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "8b8c8f" } // Yellow
    };
    cell.alignment = { horizontal: "center", vertical: "middle" };
    cell.border = {
      top: { style: "thin" },
      left: { style: "thin" },
      bottom: { style: "thin" },
      right: { style: "thin" }
    };
  });

  // --- Data rows ---
  emps.forEach(r => {
    const row = sheet.addRow([
      r.EmployeeID ?? "",
      r.ObjectName1 ?? "",
      formatApiDateTime(r.LocaleMessageTime),
      r.PersonnelType ?? "",
      r.CompanyName ?? "",
      r.Direction ?? "",
      r.CardNumber ?? "",
      r.Door ?? ""
    ]);

    row.eachCell(cell => {
      cell.border = {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" }
      };
    });
  });

  // --- Auto column width ---
  sheet.columns.forEach(col => {
    let maxLen = 7;
    col.eachCell({ includeEmpty: true }, c => {
      maxLen = Math.max(maxLen, (c.value ? c.value.toString().length : 0) + 2);
    });
    col.width = Math.min(Math.max(maxLen, 17), 40);
  });

  // --- Filename (safe floor name + timestamp) ---
  const safeFloor = floor.replace(/[^a-z0-9\-_]/gi, "_").slice(0, 80);
  const ts = new Date().toISOString().slice(0, 19).replace(/[:T]/g, "-");
  const filename = `${safeFloor}_${ts}.xlsx`;

  // --- Save file ---
  const buf = await workbook.xlsx.writeBuffer();
  saveAs(new Blob([buf]), filename);
};



  // 1) Filter the raw details → keep only In/Out for this partition,
  //    map to include floor, then drop any that resolve to "Unmapped"
  const filterAndMap = json =>
    json.details
      .filter(r =>
        r.PartitionName2 === partition &&
        (r.Direction === "InDirection" || r.Direction === "OutDirection")
      )
      .map(r => {
        const floor = lookupFloor(r.PartitionName2, r.Door, r.Direction);
        return { ...r, floor };
      })
      .filter(r => r.floor !== "Unmapped");  // remove any Out-of-office / unmapped

  // initial load
  useEffect(() => {
    let active = true;
    fetchLiveSummary().then(json => {
      if (!active) return;
      setLiveCounts(json.realtime[partition]?.floors || {});
      setDetails(filterAndMap(json));
      setLastUpdate(new Date().toLocaleTimeString());
      setLoading(false);
    });
    return () => { active = false };
  }, [partition]);

  // poll every second
  useEffect(() => {
    const iv = setInterval(async () => {
      const json = await fetchLiveSummary();
      setLiveCounts(json.realtime[partition]?.floors || {});
      setDetails(filterAndMap(json));
      setLastUpdate(new Date().toLocaleTimeString());
    }, 1000);
    return () => clearInterval(iv);
  }, [partition]);

  // group by floor name
  const floorMap = useMemo(() => {
    const m = {};
    Object.keys(liveCounts).forEach(f => { m[f] = [] });
    details.forEach(r => {
      if (!m[r.floor]) m[r.floor] = [];
      m[r.floor].push(r);
    });
    return m;
  }, [details, liveCounts]);

  


  // apply search filter to each floor's list
  const displayed = useMemo(() => {
    const term = search.toLowerCase();

    const arr = Object.entries(floorMap)
      .map(([floor, emps]) => {
        const filtered = emps.filter(e =>
          floor.toLowerCase().includes(term) ||
          e.ObjectName1?.toLowerCase().includes(term) ||
          `${e.EmployeeID}`.toLowerCase().includes(term) ||
          `${e.CardNumber}`.toLowerCase().includes(term)
        );
        return [floor, filtered];
      })
      .filter(([, emps]) => emps.length > 0);

    // ✅ sort by length descending (largest totals first)
    arr.sort((a, b) => b[1].length - a[1].length);

    return arr;
  }, [floorMap, search]);



  const columns = [
    { field: "EmployeeID", headerName: "Emp ID" },
    { field: "ObjectName1", headerName: "Name" },
    { field: "LocaleMessageTime", headerName: "Swipe Time" },
    { field: "PersonnelType", headerName: "Type" },
    { field: "CompanyName", headerName: "Company" }, // <-- ADD THIS LINE
    { field: "Direction", headerName: "Direction" }, // <-- ADD THIS LINE
    { field: "CardNumber", headerName: "Card" },
    { field: "Door", headerName: "Door" },
  ];

  if (loading) {
    return (
      <>
        <Header />
        <Box sx={{ px: 2, py: 8 }}><LoadingSpinner /></Box>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <Box sx={{ pt: 1, pb: 1, background: "rgba(0,0,0,0.6)" }}>
        <Container disableGutters maxWidth={false}>

          {/* Back button + title */}
          <Box display="flex" alignItems="center" mb={2} sx={{ px: 2 }}>
            <Button size="small" onClick={() => navigate(-1)} sx={{ color: "#FFC107" }}>
              ← Back to Overview
            </Button>
          </Box>

          {/* Search + timestamp */}
          <Box display="flex" alignItems="center" gap={2} mb={2} sx={{ px: 2 }}>
            <Typography variant="h6" sx={{ color: "#FFC107" }}>
              Floor Details
            </Typography>

         
            <TextField
              size="small"
              placeholder="Search floor / emp…"
              value={search}
              onChange={e => setSearchTerm(e.target.value)}
              sx={{
                "& .MuiInputBase-input": { color: "#FFC107" },
                "& .MuiOutlinedInput-root fieldset": { borderColor: "#FFC107" }
              }}
            />
          </Box>

           {/* 3) replace the floor card JSX (the displayed.map rendering) with this updated version */}
          {/* Floor cards */}
          <Box display="flex" flexWrap="wrap" width="100%" sx={{ px: 2 }}>
            {displayed.map(([floor, emps]) => (
              <Box key={floor} sx={{ width: { xs: '100%', md: '50%' }, p: 2 }}>
                <Paper sx={{
                  border: "2px solid #FFC107",
                  p: 2,
                  background: "rgba(0,0,0,0.4)"
                }}>
                  {/* Header row: left = floor title, right = export button */}
                  <Box display="flex" alignItems="center" justifyContent="space-between" mb={1}>
                    <Typography
                      variant="subtitle1"
                      fontWeight={600}
                      sx={{ color: "#FFC107" }}
                    >
                      {floor} (Total {emps.length})
                    </Typography>

                    <Button
                      size="small"
                      variant="contained"
                      onClick={() => handleExportFloor(floor, emps)}
                      sx={{ bgcolor: '#FFC107', color: '#000', textTransform: 'none' }}
                    >
                      Export
                    </Button>
                  </Box>

                  <TableContainer
                    component={Paper}
                    variant="outlined"
                    sx={{ mb: 1, background: "rgba(0,0,0,0.4)" }}
                  >
                    <Table size="small">
                      <TableHead>
                        <TableRow sx={{ bgcolor: "#000" }}>
                          {["Emp ID", "Name", "Swipe Time", "Type", "Company","Direction", "Card", "Door"].map(h => (
                            <TableCell
                              key={h}
                              sx={{
                                color: "#FFC107",
                                border: "1px solid #FFC107",
                                fontWeight: "bold"
                              }}
                            >
                              {h}
                            </TableCell>
                          ))}
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {emps.slice(0, 10).map((r, i) => (
                          <TableRow key={i}>
                            <TableCell sx={{ color: "#fff", border: "1px solid #FFC107" }}>
                              {r.EmployeeID}
                            </TableCell>
                            <TableCell sx={{ color: "#fff", border: "1px solid #FFC107" }}>
                              {r.ObjectName1}
                            </TableCell>
                            <TableCell sx={{ color: "#fff", border: "1px solid #FFC107" }}>
                              {formatApiDateTime(r.LocaleMessageTime)}
                            </TableCell>
                            <TableCell sx={{ color: "#fff", border: "1px solid #FFC107" }}>
                              {r.PersonnelType}
                            </TableCell>
                            <TableCell sx={{ color: "#fff", border: "1px solid #FFC107" }}>
                              {r.CompanyName}
                            </TableCell>
                            <TableCell sx={{ color: "#fff", border: "1px solid #FFC107" }}>
                              {r.Direction}
                            </TableCell>
                            <TableCell sx={{ color: "#fff", border: "1px solid #FFC107" }}>
                              {r.CardNumber}
                            </TableCell>
                            <TableCell sx={{ color: "#fff", border: "1px solid #FFC107" }}>
                              {r.Door}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>

                  <Button
                    size="small"
                    onClick={() => setExpandedFloor(f => f === floor ? null : floor)}
                    sx={{ color: "#FFC107" }}
                  >
                    {expandedFloor === floor ? "Hide" : "See more…"}
                  </Button>
                </Paper>
              </Box>
            ))}
          </Box>

          {/* Expanded table */}
          {expandedFloor && (
            <Box sx={{ px: 2, mt: 2 }}>
              <Typography variant="h6" sx={{ color: "#FFC107" }} gutterBottom>
                {expandedFloor} — All Entries
              </Typography>

              <DataTable
                // add a Sr No column only for the expanded table (keeps original `columns` unchanged)
                columns={[{ field: "SrNo", headerName: "Sr No" }, ...columns]}
                rows={(floorMap[expandedFloor] || []).map((r, i) => ({
                  ...r,
                  LocaleMessageTime: formatApiDateTime(r.LocaleMessageTime),
                  SrNo: i + 1 // 1,2,3...
                }))}
              />
            </Box>
          )}


        </Container>
      </Box>
      <Footer />
    </>
  );
}

C:\Users\W0024618\Desktop\apac-occupancy-frontend\src\components\CompositeChartCard.jsx
import React, { useMemo } from 'react';
import isEqual from 'lodash.isequal';

import { Card, CardContent, Typography, Box } from '@mui/material';
import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  LabelList,
  Cell
} from 'recharts';

import buildingCapacities from '../data/buildingCapacities';
import floorCapacities from '../data/floorCapacities';

const DARK_TO_LIGHT = [
  '#FFD666', '#FFE599', '#FFF2CC', '#FFE599', '#E0E1DD',
  '#FFD666', '#FFEE8C', '#F8DE7E', '#FBEC5D', '#F0E68C',
  '#FFEE8C', '#21325E', '#415A77', '#6A7F9A', '#B0C4DE',
  '#1A1F36', '#2B3353', '#4C6482', '#7B90B2', '#CAD3E9'
];

function CompositeChartCard({
  title,
  data,
  lineColor = '#fff',
  height = 350,
  animationDuration,
  animationEasing,
  sx
}) {
  const enriched = useMemo(() => {
    return data.map((d, i) => ({
      ...d,
      percentage: d.capacity ? Math.round(d.headcount / d.capacity * 100) : 0,
      _color: DARK_TO_LIGHT[i % DARK_TO_LIGHT.length]
    }));
  }, [data]);

  if (!Array.isArray(data) || data.length === 0) {
    return (
      <Card sx={{ border: `1px solid #fff`, bgcolor: 'rgba(0,0,0,0.4)', ...sx }}>
        <CardContent>
          <Typography variant="subtitle1" align="center" color="text.secondary">
            {title}
          </Typography>
          <Typography variant="body2" align="center" sx={{ mt: 4 }}>
            No realtime employee data
          </Typography>
        </CardContent>
      </Card>
    );
  }

  const totalHeadcount = enriched.reduce((sum, d) => sum + (d.headcount || 0), 0);
  const totalCapacity = enriched.reduce((sum, d) => sum + (d.capacity || 0), 0);
  const avgUsage = totalCapacity ? Math.round((totalHeadcount / totalCapacity) * 100) : 0;

  return (
    <Card sx={{ borderRadius: 2, overflow: 'hidden', bgcolor: 'rgba(0,0,0,0.4)', transition: 'transform 0.3s, box-shadow 0.3s', '&:hover': { transform: 'scale(1.02)', boxShadow: '0 4px 12px rgba(0,0,0,0.7)' }, ...sx }}>
      <CardContent sx={{ p: 1 }}>
        <Typography variant="subtitle1" align="center" gutterBottom sx={{ color: '#FFC107' }}>
          {title}
        </Typography>
        <Box sx={{ width: '100%', height }}>
          <ResponsiveContainer>

            <ComposedChart data={enriched} margin={{ top: 15, right: 20, left: 0, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="name" tickLine={false} axisLine={false} stroke="rgba(255,255,255,0.6)"
                tickFormatter={label => {
                  const str = String(label || '');
                  const n = parseInt((str.match(/\d+/) || [])[0], 10);
                  if (!isNaN(n)) {
                    if (n % 100 >= 11 && n % 100 <= 13) return `${n}th`;
                    switch (n % 10) {
                      case 1: return `${n}st`;
                      case 2: return `${n}nd`;
                      case 3: return `${n}rd`;
                      default: return `${n}th`;
                    }
                  }
                  return str;
                }}
              />
              <YAxis yAxisId="left" tickLine={false} axisLine={false} stroke="rgba(255,255,255,0.6)" />
              <YAxis yAxisId="right" orientation="right" tickLine={false} axisLine={false} stroke="rgba(255,255,255,0.6)" domain={[0, 100]} tickFormatter={v => `${v}%`} />
              <Tooltip
                contentStyle={{ backgroundColor: '#FFD666', borderColor: lineColor, padding: 8 }}
                content={({ active, payload, label }) => {
                  if (!active || !payload?.length) return null;
                  const d = payload[0].payload;
                  return (
                    <div style={{ backgroundColor: '#FFD666', border: `1px solid ${lineColor}`, borderRadius: 4, padding: 8 }}>
                      <div style={{ fontWeight: 700, marginBottom: 4 }}>{label}</div>
                      <div>Headcount: {d.headcount}</div>
                      <div>Usage %: {d.percentage}%</div>
                      <div>Seat Capacity: {d.capacity}</div>
                    </div>
                  );
                }}
              />
              <Bar yAxisId="left" dataKey="headcount" name="Headcount" barSize={700} isAnimationActive={false} stroke="#fff"  strokeWidth={2}>
                {enriched.map((e, i) => <Cell key={i} fill={e._color}   />)}
                <LabelList dataKey="headcount" position="top" formatter={v => `${v}`} style={{ fill: '#fff', fontSize: 15, fontWeight: 700 }} />

                <LabelList dataKey="percentage" position="inside" formatter={v => `${v}%`} style={{ fill: '#EE4B2B', fontSize: 14, fontWeight: 700 }} />
              </Bar>
              <Line yAxisId="right" type="monotone" dataKey="percentage" name="Usage %" stroke="#FF0000" strokeWidth={2} dot={false} isAnimationActive={false} />
              <Line yAxisId="left" type="monotone"

                name="Total Seats" stroke="#81C784" strokeDasharray="5 5" dot={false} isAnimationActive={false} />
            </ComposedChart>
            
          </ResponsiveContainer>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 4, alignItems: 'center', mb: 1, fontWeight: 'bold', fontSize: 16 }}>
          <Box sx={{ color: '#FFD700' }}>Total Headcount: {totalHeadcount}</Box>
          <Box sx={{ color: '#4CAF50' }}>Total Seats: {totalCapacity}</Box>
          <Box sx={{ color: '#FF4C4C' }}>Usage: {avgUsage}%</Box>
        </Box>
      </CardContent>
    </Card>
  );
}

export default React.memo(CompositeChartCard, (prev, next) =>
  isEqual(prev.data, next.data) &&
  prev.lineColor === next.lineColor &&
  prev.height === next.height
);

// src/utils/doorMap.js

// 1) raw door → zone
const doorMap = {

 
  // Podium / Red
  "APAC_IN_PUN_PODIUM_RED_IDF ROOM-02-RESTRICTED DOOR___InDirection": "Red Zone",
  "APAC_IN_PUN_PODIUM_ST2 DOOR 1 (RED)___InDirection": "Red Zone",
  "APAC_IN_PUN_PODIUM_ST2 DOOR 1 (RED)___OutDirection": "Red Zone",
  "APAC_IN_PUN_PODIUM_RED_MAIN LIFT LOBBY ENTRY 1-DOOR___InDirection": "Red Zone",
  "APAC_IN_PUN_PODIUM_RED_MAIN LIFT LOBBY ENTRY 1-DOOR___OutDirection": "Out of office",
  "APAC_IN_PUN_PODIUM_ST 1-DOOR 1 (RED)___InDirection": "Red Zone",
  "APAC_IN_PUN_PODIUM_ST 1-DOOR 1 (RED)___OutDirection": "Red Zone - Outer Area",
  "APAC_IN_PUN_PODIUM_RED_RECEPTION TO WS ENTRY 1-DOOR NEW___InDirection": "Red Zone",
  "APAC_IN_PUN_PODIUM_RED_RECEPTION TO WS ENTRY 1-DOOR NEW___OutDirection": "Reception Area",
  "APAC_IN_PUN_PODIUM_RED_RECREATION AREA FIRE EXIT 1-DOOR NEW___InDirection": "Red Zone",
  "APAC_IN_PUN_PODIUM_RED_RECREATION AREA FIRE EXIT 1-DOOR NEW___OutDirection": "Yellow Zone - Outer Area",

  // Podium / Yellow
  "APAC_IN_PUN_PODIUM_ST2 DOOR 2 (YELLOW)___InDirection": "Yellow Zone",
  "APAC_IN_PUN_PODIUM_ST2 DOOR 2 (YELLOW)___OutDirection": "Yellow Zone - Outer Area",
  "APAC_IN_PUN_PODIUM_YELLOW_MDF RESTRICTED DOOR___InDirection": "Yellow Zone",
  "APAC_IN_PUN_PODIUM_YELLOW_IT STORE ROOM-DOOR RESTRICTED DOOR___InDirection": "Yellow Zone",
  "APAC_IN_PUN_PODIUM_YELLOW_REPRO STORE-DOOR RESTRICTED DOOR___InDirection": "Yellow Zone",
  "APAC_IN_PUN_PODIUM_YELLOW_CONTROL PANEL ROOM-DOOR RESTRICTED DOOR___InDirection": "Yellow Zone",
  "APAC_IN_PUN_PODIUM_YELLOW_PREACTION ROOM-DOOR RESTRICTED DOOR___InDirection": "Yellow Zone",
  "APAC_IN_PUN_PODIUM_YELLOW_TESTING LAB-DOOR RESTRICTED DOOR___InDirection": "Yellow Zone",
  "APAC_IN_PUN_PODIUM_YELLOW_RECEPTION ENTRY-DOOR___InDirection": "Yellow Zone",
  "APAC_IN_PUN_PODIUM_YELLOW_RECEPTION ENTRY-DOOR___OutDirection": "Reception Area",
  "APAC_IN_PUN_PODIUM_YELLOW_MAIN LIFT LOBBY-DOOR NEW___InDirection": "Yellow Zone",
  "APAC_IN_PUN_PODIUM_YELLOW_MAIN LIFT LOBBY-DOOR NEW___OutDirection": "Out of office",
  "APAC_IN_PUN_PODIUM_ST 1 DOOR 2 (YELLOW)___InDirection": "Yellow Zone",
  "APAC_IN_PUN_PODIUM_ST 1 DOOR 2 (YELLOW)___OutDirection": "Yellow Zone - Outer Area",
  "APAC_IN_PUN_PODIUM_YELLOW_FIRE EXIT 1-DOOR NEW___InDirection": "Yellow Zone",
  "APAC_IN_PUN_PODIUM_YELLOW_FIRE EXIT 1-DOOR NEW___OutDirection": "Yellow Zone - Outer Area",

  // Podium / Green
  "APAC_IN_PUN_PODIUM_GREEN-_IDF ROOM 1-RESTRICTED DOOR___InDirection": "Green Zone",
  "APAC_IN_PUN_PODIUM_GREEN_UPS ENTRY 1-DOOR RESTRICTED DOOR___InDirection": "Green Zone",
  "APAC_IN_PUN_PODIUM_GREEN_UPS ENTRY 2-DOOR RESTRICTED DOOR___InDirection": "Green Zone",
  "APAC_IN_PUN_PODIUM_GREEN_LOCKER HR STORE 3-DOOR RESTRICTED DOOR___InDirection": "Green Zone",
  "APAC_IN_PUN_PODIUM_ST4 DOOR 2 (GREEN)___InDirection": "Green Zone",
  "APAC_IN_PUN_PODIUM_GREEN-MAIN LIFT LOBBY-DOOR___InDirection": "Green Zone",
  "APAC_IN_PUN_PODIUM_GREEN-MAIN LIFT LOBBY-DOOR___OutDirection": "Green Zone - Outer Area",
  "APAC_IN_PUN_PODIUM_ST3 DOOR 2 (GREEN)___InDirection": "Green Zone",
  "APAC_IN_PUN_PODIUM_ST3 DOOR 2 (GREEN)___OutDirection": "Green Zone - Outer Area",
  "APAC_IN_PUN_PODIUM_GREEN_RECEPTION ENTRY-DOOR___InDirection": "Green Zone",
  "APAC_IN_PUN_PODIUM_GREEN_RECEPTION ENTRY-DOOR___OutDirection": "Reception Area",

  // Podium / Orange
  "APAC_IN_PUN_PODIUM_ST4 DOOR 1 (ORANGE)___InDirection": "Orange Zone",
  "APAC_IN_PUN_PODIUM_ORANGE_RECEPTION ENTRY-DOOR___InDirection": "Orange Zone",
  "APAC_IN_PUN_PODIUM_ORANGE_RECEPTION ENTRY-DOOR___OutDirection": "Reception Area",
  "APAC_IN_PUN_PODIUM_ST3_DOOR 1 (ORANGE)___InDirection": "Orange Zone",
  "APAC_IN_PUN_PODIUM_ST3_DOOR 1 (ORANGE)___OutDirection": "Orange Zone",
  "APAC_IN_PUN_PODIUM_ORANGE_MAIN LIFT LOBBY-DOOR___InDirection": "Orange Zone",
  "APAC_IN_PUN_PODIUM_ORANGE_MAIN LIFT LOBBY-DOOR___OutDirection": "Orange Zone - Outer Area",
  "APAC_IN_PUN_PODIUM_ORANGE-IDF ROOM 3-RESTRICTED DOOR___InDirection": "Orange Zone",
  "APAC_IN_PUN_PODIUM_ORANGE_KITCHENETTE FIRE EXIT-DOOR NEW___InDirection": "Orange Zone",
  "APAC_IN_PUN_PODIUM_ORANGE_KITCHENETTE FIRE EXIT-DOOR NEW___OutDirection": "Orange Zone - Outer Area",

  // Podium / GSOC door
  "APAC_IN_PUN_PODIUM_GSOC DOOR RESTRICTED DOOR___InDirection": "Yellow Zone",

  // Podium / Main Right & Left Entry
  "APAC_IN_PUN_PODIUM_MAIN PODIUM RIGHT ENTRY-DOOR NEW___InDirection": "Reception Area",
  "APAC_IN_PUN_PODIUM_MAIN PODIUM RIGHT ENTRY-DOOR NEW___OutDirection": "Assembly Area",
  "APAC_IN_PUN_PODIUM_MAIN PODIUM LEFT ENTRY-DOOR NEW___InDirection": "Reception Area",
  "APAC_IN_PUN_PODIUM_MAIN PODIUM LEFT ENTRY-DOOR NEW___OutDirection": "Assembly Area",

  // Podium / Turnstiles
  "APAC_IN_PUN_PODIUM_P-1 TURNSTILE 1-DOOR___InDirection": "Reception Area",
  "APAC_IN_PUN_PODIUM_P-1 TURNSTILE 2-DOOR___InDirection": "Reception Area",
  "APAC_IN_PUN_PODIUM_P-1 TURNSTILE 3-DOOR___InDirection": "Reception Area",
  "APAC_IN_PUN_PODIUM_P-1 TURNSTILE 4-DOOR___InDirection": "Reception Area",
  "APAC_IN_PUN_PODIUM_P-1 TURNSTILE 2 -OUT DOOR___OutDirection": "Out of office",
  "APAC_IN_PUN-PODIUM_P-1 TURNSTILE 3 -OUT DOOR___OutDirection": "Out of office",
  "APAC_IN_PUN_PODIUM_P-1 TURNSTILE 4 -OUT DOOR___OutDirection": "Out of office",
  "APAC_IN_PUN_PODIUM_P-1 TURNSTILE 1-OUT DOOR___OutDirection": "Out of office",

  "APAC_IN_PUN-PODIUM_P-1 TURNSTILE 3 -OUT DOOR___OutDirection": "Out of office",
  "APAC_IN_PUN-PODIUM_P-1 TURNSTILE 3 -OUT DOOR___InDirection": "Reception Area",




  // 2nd-Floor / IDF + UPS/ELEC + Reception→Workstation + LiftLobby→Reception
  "APAC_IN_PUN_2NDFLR_IDF ROOM_10:05:86 RESTRICTED DOOR___InDirection": "2nd Floor, Pune",
  "APAC_IN_PUN_2NDFLR_UPS/ELEC ROOM RESTRICTED DOOR___InDirection": "2nd Floor, Pune",
  "APAC_IN_PUN_2NDFLR_RECPTION TO WORKSTATION DOOR___InDirection": "2nd Floor, Pune",
  "APAC_IN_PUN_2NDFLR_RECPTION TO WORKSTATION DOOR___OutDirection": "Out of office",
  "APAC_IN_PUN_2NDFLR_LIFTLOBBY TO RECEPTION EMTRY DOOR___InDirection": "2nd Floor, Pune",
  "APAC_IN_PUN_2NDFLR_LIFTLOBBY TO RECEPTION EMTRY DOOR___OutDirection": "2nd Floor, Pune",

  // Tower B
  "APAC_IN_PUN_TOWER B_MAIN RECEPTION DOOR___InDirection": "Tower B",
  "APAC_IN_PUN_TOWER B_MAIN RECEPTION DOOR___OutDirection": "Out of office",
  "APAC_IN_PUN_TOWER B_LIFT LOBBY DOOR___InDirection": "Tower B",
  "APAC_IN_PUN_TOWER B_LIFT LOBBY DOOR___OutDirection": "Out of office",
  "APAC_IN_PUN_TOWER B_ST6_GYM SIDE DOOR___InDirection": "Tower B",
  "APAC_IN_PUN_TOWER B_ST6_GYM SIDE DOOR___OutDirection": "Tower B",
  "APAC_IN_PUN_TOWER B_ST6_WKS SIDE DOOR___InDirection": "Tower B",
  "APAC_IN_PUN_TOWER B_ST6_WKS SIDE DOOR___OutDirection": "Tower B",
  "APAC_IN_PUN_TOWER B_ST5_KAPIL DEV DOOR___InDirection": "Tower B",
  "APAC_IN_PUN_TOWER B_ST5_KAPIL DEV DOOR___OutDirection": "Tower B",
  "APAC_IN_PUN_TOWER B_ST5_WKS SIDE DOOR___InDirection": "Tower B",
  "APAC_IN_PUN_TOWER B_ST5_WKS SIDE DOOR___OutDirection": "Tower B",
  "APAC_IN_PUN_TOWER B_RECEPTION LEFT DOOR___InDirection": "Tower B",
  "APAC_IN_PUN_TOWER B_RECEPTION LEFT DOOR___OutDirection": "Tower B",
  "APAC_IN_PUN_TOWER B_RECEPTION RIGHT DOOR___InDirection": "Tower B",
  "APAC_IN_PUN_TOWER B_RECEPTION RIGHT DOOR___OutDirection": "Tower B",
  "APAC_IN_PUN_TOWER B_IBMS ROOM___InDirection": "Tower B",
  "APAC_IN_PUN_TOWER B_UPS ROOM___InDirection": "Tower B",
  "APAC_IN_PUN_TOWER B_MDF ROOM___InDirection": "Tower B",
  "APAC_IN_PUN_TOWER B_PAC ROOM___InDirection": "Tower B",
  "APAC_IN_PUN_TOWER B_IT STORE ROOM___InDirection": "Tower B",
  "APAC_IN_PUN_TOWER B_GYM ROOM___InDirection": "Tower B GYM",
  "APAC_IN_PUN_TOWER B_GYM ROOM___OutDirection": "Tower B GYM",
  "APAC_IN_PUN_TOWER B_SITE OPS STORE___InDirection": "Tower B",
  "APAC_IN_PUN_TOWER B_MOBILE LAB___InDirection": "Tower B",
  "APAC_IN_PUN_TOWER B_MOBILE LAB___OutDirection": "Tower B",
  "APAC_IN_PUN_TOWER B_CEC DOOR___InDirection": "Tower B",
  "APAC_IN_PUN_TOWER B_CEC DOOR___OutDirection": "Tower B",

  // ----- APAC-wide (from your Excel file) -----
  // Kuala Lumpur
  "APAC_MY_KL_MAIN ENTRANCE DOOR___InDirection": "Kuala Lumpur",
  "APAC_MY_KL_MAIN ENTRANCE DOOR___OutDirection": "Out of office",
  "APAC_MY_KL_INTERIOR RECEPTION DOOR___InDirection": "Kuala Lumpur",
  "APAC_MY_KL_INTERIOR RECEPTION DOOR___OutDirection": "Kuala Lumpur",
  "APAC_MY_KL_SIDE ENTRANCE DOOR NEW___InDirection": "Kuala Lumpur",
  "APAC_MY_KL_SIDE ENTRANCE DOOR NEW___OutDirection": "Kuala Lumpur",
  "APAC_MY_KL_PANTRY ENTRANCE DOOR NEW___InDirection": "Kuala Lumpur",
  "APAC_MY_KL_PANTRY ENTRANCE DOOR NEW___OutDirection": "Kuala Lumpur",
  "APAC_MY_KL_SERVER ROOM DOOR___InDirection": "Kuala Lumpur",
  "APAC_MY_KL_SERVER ROOM DOOR___OutDirection": "Kuala Lumpur",

  // Tokyo
  "APAC_JPN_Tokyo_7th FLRSide Entrance___InDirection": "Tokyo",
  "APAC_JPN_Tokyo_7th FLRSide Entrance___OutDirection": "Out of office",
  "APAC_JPN_Tokyo_7th FLR_IT Room___InDirection": "Tokyo",
  "APAC_JPN_Tokyo_7th FLR_IT Room___OutDirection": "Tokyo",
  "APAC_JPN_Tokyo_7th FLR_Main Entrance___InDirection": "Tokyo",
  "APAC_JPN_Tokyo_7th FLR_Main Entrance___OutDirection": "Out of office",
  "APAC_JPN_Tokyo_7th FLR_Office Entrance___InDirection": "Tokyo",
  "APAC_JPN_Tokyo_7th FLR_Office Entrance___OutDirection": "Tokyo",
  "APAC_JPN_Tokyo_7th FLR_Side Entrance to Back Office___InDirection": "Tokyo",
  "APAC_JPN_Tokyo_7th FLR_Side Entrance to Back Office___OutDirection": "Out of office",

  // Manila (6th & 7th Floor)
  "APAC_PH_Manila_6th Floor Enrty Door 1___InDirection": "6th Floor",
  "APAC_PH_Manila_6th Floor Enrty Door 1___OutDirection": "Out of office",
  "APAC_PH_Manila_6th Floor Open Office 2___InDirection": "6th Floor",
  "APAC_PH_Manila_6th Floor Open Office 2___OutDirection": "6th Floor",
  "APAC_PH_Manila_6th Floor_Entry Door 2___InDirection": "6th Floor",
  "APAC_PH_Manila_6th Floor_Entry Door 2___OutDirection": "Out of office",
  "APAC_PH_Manila_6th Floor_Entry Door 3___InDirection": "6th Floor",
  "APAC_PH_Manila_6th Floor_Entry Door 3___OutDirection": "Out of office",
  "APAC_PH_Manila_6th Floor_Exit Corridor___InDirection": "6th Floor",
  "APAC_PH_Manila_6th Floor_Exit Corridor___OutDirection": "6th Floor",
  "APAC_PH_Manila_6th Floor_IDF Restricted Door___InDirection": "6th Floor",
  "APAC_PH_Manila_6th Floor_IDF Restricted Door___OutDirection": "6th Floor",
  "APAC_PH_Manila_6th Floor_Mothers Room___InDirection": "6th Floor",
  "APAC_PH_Manila_6th Floor_Mothers Room___OutDirection": "6th Floor",
  "APAC_PH_Manila_6th Floor_Print Area___InDirection": "6th Floor",
  "APAC_PH_Manila_6th Floor_Print Area___OutDirection": "6th Floor",
  "APAC_PH_Manila_6th Floor_UPS/Switch Restricted Door___InDirection": "6th Floor",
  "APAC_PH_Manila_6th Floor_UPS/Switch Restricted Door___OutDirection": "6th Floor",

  "APAC_PH_Manila_7th Floor_Directors Office-708___InDirection": "7th Floor",
  "APAC_PH_Manila_7th Floor_Directors Office-708___OutDirection": "7th Floor",
  "APAC_PH_Manila_7th Floor_Exit Corridore-704___InDirection": "7th Floor",
  "APAC_PH_Manila_7th Floor_Exit Corridore-704___OutDirection": "7th Floor",
  "APAC_PH_Manila_7th Floor_IT Work Room  725___InDirection": "7th Floor",
  "APAC_PH_Manila_7th Floor_IT Work Room  725___OutDirection": "7th Floor",
  "APAC_PH_Manila_7th Floor_MDF-726 Restricted Door___InDirection": "7th Floor",
  "APAC_PH_Manila_7th Floor_MDF-726 Restricted Door___OutDirection": "7th Floor",
  "APAC_PH_Manila_7th Floor_Open Office Door 1-721___InDirection": "7th Floor",
  "APAC_PH_Manila_7th Floor_Open Office Door 1-721___OutDirection": "7th Floor",
  "APAC_PH_Manila_7th Floor_Open Office Door 2-721___InDirection": "7th Floor",
  "APAC_PH_Manila_7th Floor_Open Office Door 2-721___OutDirection": "7th Floor",
  "APAC_PH_Manila_7th Floor_Pantry-720a___InDirection": "7th Floor",
  "APAC_PH_Manila_7th Floor_Pantry-720a___OutDirection": "7th Floor",
  "APAC_PH_Manila_7th Floor_Recption Door 1-701___InDirection": "7th Floor",
  "APAC_PH_Manila_7th Floor_Recption Door 1-701___OutDirection": "Out of office",
  "APAC_PH_Manila_7th Floor_Recption Door 2-701___InDirection": "7th Floor",
  "APAC_PH_Manila_7th Floor_Recption Door 2-701___OutDirection": "Out of office",
  "APAC_PH_Manila_7th Floor_Security Room-723___InDirection": "7th Floor",
  "APAC_PH_Manila_7th Floor_Security Room-723___OutDirection": "7th Floor",

  // PI Manila DR (Taguig)
  "APAC_PI_Manila_DR_MainEntrance___InDirection": "Taguig",
  "APAC_PI_Manila_DR_MainEntrance___OutDirection": "Out of office",
  "APAC_PI_Manila_DR_OfficeLobby___InDirection": "Taguig",
  "APAC_PI_Manila_DR_OfficeLobby___OutDirection": "Out of office",
  "APAC_PI_Manila_DR_Server Restricted Door___InDirection": "Taguig",
  "APAC_PI_Manila_DR_Server Restricted Door___OutDirection": "Taguig",
  "APAC_PI_Manila_DR_StorageRm___InDirection": "Taguig",
  "APAC_PI_Manila_DR_StorageRm___OutDirection": "Taguig",
  "APAC_PI_Manila_Emerg Exit Dr- Lobby___InDirection": "Taguig",
  "APAC_PI_Manila_Emerg Exit Dr- Lobby___OutDirection": "Taguig",
  "APAC_PI_Manila_Emgerg DR_Storage RM___InDirection": "Taguig",
  "APAC_PI_Manila_Emgerg DR_Storage RM___OutDirection": "Taguig",




  // --- Manila 7th Floor Reception Doors ---
  "APAC_PH_Manila_7th Floor Recption Door 1-701___InDirection": "7th Floor",
  "APAC_PH_Manila_7th Floor Recption Door 1-701___OutDirection": "Out of office",

  "APAC_PH_Manila_7th Floor Recption Door 2-701___InDirection": "7th Floor",
  "APAC_PH_Manila_7th Floor Recption Door 2-701___OutDirection": "Out of office",

  // --- Manila 7th Floor Open Office Door 2-721 ---
  "APAC_PH_Manila_7th Floor Open Office Door 2-721___InDirection": "7th Floor",
  "APAC_PH_Manila_7th Floor Open Office Door 2-721___OutDirection": "7th Floor",

  // --- Manila 7th Floor IT Work Room  725 & Security Room 723 ---
  "APAC_PH_Manila_7th Floor IT Work Room  725___InDirection": "7th Floor",
  "APAC_PH_Manila_7th Floor IT Work Room  725___OutDirection": "7th Floor",

  "APAC_PH_Manila_7th Floor Security Room-723___InDirection": "7th Floor",
  "APAC_PH_Manila_7th Floor Security Room-723___OutDirection": "7th Floor",

  // --- Manila 6th Floor variants ---
  "APAC_PH_Manila_6th Floor Enrty Door 1___InDirection": "6th Floor",
  "APAC_PH_Manila_6th Floor Enrty Door 1___OutDirection": "Out of office",

  "APAC_PH_Manila_6th Floor Print Area___InDirection": "6th Floor",
  "APAC_PH_Manila_6th Floor Print Area___OutDirection": "6th Floor",

  "APAC_PH_Manila_6th Floor Entry Door 2___InDirection": "6th Floor",
  "APAC_PH_Manila_6th Floor Entry Door 2___OutDirection": "Out of office",

  "APAC_PH_Manila_6th Floor Entry Door 3___InDirection": "6th Floor",
  "APAC_PH_Manila_6th Floor Entry Door 3___OutDirection": "6th Floor",

  // --- Pune Tower B Lift Lobby Door (OutDirection) ---
  "APAC_IN_PUN_TOWER B_LIFT LOBBY DOOR___OutDirection": "Out of office",

  // --- Pune Turnstile 1 Exit Door (normalize the hyphen) ---
  "APAC_IN_PUN_PODIUM_P-1 TURNSTILE 1 OUT DOOR___OutDirection": "Out of office",

  // --- Taguig Main Entrance Door (InDirection) ---
  "APAC_PI_Manila_DR_MainEntrance___InDirection": "Taguig",
  "APAC_PI_Manila_DR_MainEntrance___OutDirection": "Out of office",

  // --- Tokyo 7th Floor Office Entrance (OutDirection) ---
  "APAC_JPN_Tokyo_7th FLR Office Entrance___OutDirection": "Out of office",


  
// --- Hydrabad

  "APAC_IN_HYD_2NDFLR_BMS ROOM___InDirection": "HYD_2NDFLR",
  "APAC_IN_HYD_2NDFLR_BMS ROOM___OutDirection": "HYD_2NDFLR",

  "APAC_IN_HYD_2NDFLR_BATTERY ROOM 1___InDirection": "HYD_2NDFLR",
  "APAC_IN_HYD_2NDFLR_BATTERY ROOM 1___OutDirection": "HYD_2NDFLR",

  "APAC_IN_HYD_2NDFLR_UPS ROOM 1___InDirection": "HYD_2NDFLR",
  "APAC_IN_HYD_2NDFLR_UPS ROOM 1___OutDirection": "HYD_2NDFLR",

  "APAC_IN_HYD_2NDFLR_UPS ROOM 2___InDirection": "HYD_2NDFLR",
  "APAC_IN_HYD_2NDFLR_UPS ROOM 2___OutDirection": "HYD_2NDFLR",

  "APAC_IN_HYD_2NDFLR_BATTERY ROOM 2___InDirection": "HYD_2NDFLR",
  "APAC_IN_HYD_2NDFLR_BATTERY ROOM 2___OutDirection": "HYD_2NDFLR",

  "APAC_IN_HYD_2NDFLR_SERVER ROOM___InDirection": "HYD_2NDFLR",
  "APAC_IN_HYD_2NDFLR_SERVER ROOM___OutDirection": "HYD_2NDFLR",

  "APAC_IN_HYD_2NDFLR_MUX ROOM 1___InDirection": "HYD_2NDFLR",
  "APAC_IN_HYD_2NDFLR_MUX ROOM 1___OutDirection": "HYD_2NDFLR",

  "APAC_IN_HYD_2NDFLR_MUX ROOM 2___InDirection": "HYD_2NDFLR",
  "APAC_IN_HYD_2NDFLR_MUX ROOM 2___OutDirection": "HYD_2NDFLR",

  "APAC_IN_HYD_2NDFLR_SERVICE LIFT 4 PASSAGE 1___InDirection": "HYD_2NDFLR",
  "APAC_IN_HYD_2NDFLR_SERVICE LIFT 4 PASSAGE 1___OutDirection": "Out of Office",

  "APAC_IN_HYD_2NDFLR_SERVICE LIFT 4 ENTRY___InDirection": "HYD_2NDFLR",
  "APAC_IN_HYD_2NDFLR_SERVICE LIFT 4 ENTRY___OutDirection": "Out of Office",

  "APAC_IN_HYD_2NDFLR_MAIN LIFT LOBBY ENTRY 1___InDirection": "HYD_2NDFLR",
  "APAC_IN_HYD_2NDFLR_MAIN LIFT LOBBY ENTRY 1___OutDirection": "Out of Office",

  "APAC_IN_HYD_2NDFLR_SERVICE LIFT 5 ENTRY 1___InDirection": "HYD_2NDFLR",
  "APAC_IN_HYD_2NDFLR_SERVICE LIFT 5 ENTRY 1___OutDirection": "Out of Office",

  "APAC_IN_HYD_2NDFLR_SERVICE LIFT 5 ENTRY 2___InDirection": "HYD_2NDFLR",
  "APAC_IN_HYD_2NDFLR_SERVICE LIFT 5 ENTRY 2___OutDirection": "Out of Office",

  "APAC_IN_HYD_2NDFLR_SERVICE LIFT 4 PASSAGE 2___InDirection": "HYD_2NDFLR",
  "APAC_IN_HYD_2NDFLR_SERVICE LIFT 4 PASSAGE 2___OutDirection": "Out of Office",

  "APAC_IN_HYD_2NDFLR_SERVICE LIFT 5 PASSAGE 2___InDirection": "HYD_2NDFLR",
  "APAC_IN_HYD_2NDFLR_SERVICE LIFT 5 PASSAGE 2___OutDirection": "Out of Office",

  "APAC_IN_HYD_2NDFLR_F&A WING SIDE ENTRY 2___InDirection": "HYD_2NDFLR",
  "APAC_IN_HYD_2NDFLR_F&A WING SIDE ENTRY 2___OutDirection": "Out of Office",

  "APAC_IN_HYD_2NDFLR_SERVICE LIFT 5 PASSAGE 1___InDirection": "HYD_2NDFLR",
  "APAC_IN_HYD_2NDFLR_SERVICE LIFT 5 PASSAGE 1___OutDirection": "Out of Office",

  "APAC_IN_HYD_2NDFLR_IT STAGING ROOM___InDirection": "HYD_2NDFLR",


  "APAC_IN_HYD_2NDFLR_IT STORE ROOM___InDirection": "HYD_2NDFLR",


  "APAC_IN_HYD_2NDFLR_AHU ROOM 2___InDirection": "HYD_2NDFLR",


  "APAC_IN_HYD_2NDFLR_AHU ROOM 1___InDirection": "HYD_2NDFLR",


  "APAC_IN_HYD_2NDFLR_F&A WING SIDE ENTRY 1___InDirection": "HYD_2NDFLR",
  "APAC_IN_HYD_2NDFLR_F&A WING SIDE ENTRY 1___OutDirection": "Out of Office",

  "APAC_IN_HYD_2NDFLR_MAIN LIFT LOBBY ENTRY 2___InDirection": "HYD_2NDFLR",
  "APAC_IN_HYD_2NDFLR_MAIN LIFT LOBBY ENTRY 2___OutDirection": "Out of Office"



};


// 2) zone → floor
const zoneFloorMap = {
  "Red Zone": "Podium Floor",
  "Red Zone - Outer Area": "Podium Floor",
  "Yellow Zone": "Podium Floor",
  "Yellow Zone - Outer Area": "Podium Floor",
  "Reception Area": "Podium Floor",
  "Green Zone": "Podium Floor",
  "Green Zone - Outer Area": "Podium Floor",
  "Orange Zone": "Podium Floor",
  "Orange Zone - Outer Area": "Podium Floor",
  "Assembly Area": "Podium Floor",

  "2nd Floor, Pune": "2nd Floor",
  "2nd Floor, Pune - Outer Area": "2nd Floor",

  "Tower B": "Tower B",
  "Tower B - Outer Area": "Tower B",
  "Tower B GYM": "Tower B",
  "Tower B GYM - Outer Area": "Tower B",

  "Kuala Lumpur": "Kuala Lumpur",

  "6th Floor": "6th Floor",
  "7th Floor": "7th Floor",

  "Tokyo": "Tokyo",
  "Taguig": "Taguig",

  "Out of office": null,
  "HYD_2NDFLR":"Hyderabad"
};

// 3) URL segment → partitions[] key


const partitionMap = {
  Pune: "APAC_IN_PUN",
  "Quezon City": "APAC_PH_Manila",    // must match your “/partition/Quezon City/details”
  Taguig: "APAC_PI_Manila",
  "Kuala Lumpur": "APAC_MY_KL",
  "JP.Tokyo": "APAC_JPN_Tokyo",  // if your URL is /partition/JP.Tokyo/details
  Tokyo: "APAC_JPN_Tokyo",  // you can even support both
  Hyderabad:"APAC_IN_HYD"
};



// 1) same normalizer as on the backend
function normalizeDoorName(name) {
  return name
    .replace(/[_/]/g, ' ')
    .replace(/[^\w\s-]/g, '')
    .replace(/\bRECPTION\b/gi, 'RECEPTION')
    .replace(/\bENRTY\b|\bENTRTY\b/gi, 'ENTRY')
    .replace(/\b[0-9A-F]{6}\b$/, '')
    .replace(/[\s-]+/g, ' ')
    .toUpperCase()
    .trim();
}

// 2) build a normalized-key → zone lookup
const normalizedDoorZoneMap = Object.entries(doorMap).reduce(
  (acc, [rawKey, zone]) => {
    const [rawDoor, dir] = rawKey.split('___');
    const normKey = `${normalizeDoorName(rawDoor)}___${dir}`;
    acc[normKey] = zone;
    return acc;
  },
  {}
);


export {
  doorMap,
  zoneFloorMap,
  partitionMap,
  normalizeDoorName,
  normalizedDoorZoneMap
};



