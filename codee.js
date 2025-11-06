http://localhost:3000/partition/SG.Singapore/details
Singapore detail page data not disply, 
check why not disply ok.. 
PAC Occupancy • SG.Singapore
SG.Singapore

Floor Details
Search floor / emp…
read below all code each line and
http://localhost:3007/api/occupancy/live-summary

  "success": true,
  "today": {
    "total": 1106,
    "Employee": 934,
    "Contractor": 172
  },
  "realtime": {
    "Pune": {
      "total": 516,
      "Employee": 456,
      "Contractor": 60,
      "floors": {
        "Tower B": 123,
        "Podium Floor": 393
      },
      "zones": {
        "Tower B": 123,
        "Red Zone - Outer Area": 8,
        "Red Zone": 97,
        "Green Zone": 64,
        "Yellow Zone": 91,
        "Orange Zone": 88,
        "Reception Area": 17,
        "Yellow Zone - Outer Area": 20,
        "Orange Zone - Outer Area": 7,
        "Assembly Area": 1
      }
    },
    "Quezon City": {
      "total": 129,
      "Employee": 112,
      "Contractor": 17,
      "floors": {
        "7th Floor": 95,
        "6th Floor": 34
      },
      "zones": {
        "7th Floor": 95,
        "6th Floor": 34
      }
    },
    "JP.Tokyo": {
      "total": 11,
      "Employee": 10,
      "Contractor": 1,
      "floors": {
        "Tokyo": 11
      },
      "zones": {
        "Tokyo": 11
      }
    },
    "IN.HYD": {
      "total": 55,
      "Employee": 14,
      "Contractor": 41,
      "floors": {
        "Hyderabad": 55
      },
      "zones": {
        "HYD_2NDFLR": 55
      }
    },
    "MY.Kuala Lumpur": {
      "total": 10,
      "Employee": 9,
      "Contractor": 1,
      "floors": {
        "Kuala Lumpur": 10
      },
      "zones": {
        "Kuala Lumpur": 10
      }
    },
    "Taguig City": {
      "total": 16,
      "Employee": 13,
      "Contractor": 3,
      "floors": {
        "Taguig": 16
      },
      "zones": {
        "Taguig": 16
      }
    },
    "SG.Singapore": {
      "total": 20,
      "Employee": 20,
      "Contractor": 0,
      "floors": {

      },
      "zones": {
        "Singapore": 20
      }
    }
  },
  "unmapped": [],
  "details": [
    {
      "ObjectName1": "Tewari, Puja",
      "Door": "APAC_IN_PUN_TOWER B_ST6_WKS SIDE DOOR",
      "PersonnelType": "Employee",
      "EmployeeID": "310108",
      "CardNumber": "615581",
      "PartitionName2": "Pune",
      "LocaleMessageTime": "2025-11-06T11:40:33.000Z",
      "Direction": "InDirection",
      "PersonGUID": "49A9FFA2-8593-4AB8-AFEC-0113835A5BF4",
      "CompanyName": "WU Srvcs India Private Ltd",
      "PrimaryLocation": "Pune - Business Bay",
      "Zone": "Tower B",
      "Floor": "Tower B"
    },
         "Floor": "Podium Floor"
    },
    {
      "ObjectName1": "Khan, Samira",
      "Door": "APAC_SG_11 FLR_Main Door",
      "PersonnelType": "Employee",
      "EmployeeID": "323350",
      "CardNumber": "612062",
      "PartitionName2": "SG.Singapore",
      "LocaleMessageTime": "2025-11-06T14:53:07.000Z",
      "Direction": "InDirection",
      "PersonGUID": "AEDC6D47-BFB6-4B34-880C-6AD2E2C41B7A",
      "CompanyName": "Western Union Svcs Singapore",
      "PrimaryLocation": "Singapore - WeWork 21 Collyer Quay",
      "Zone": "Singapore",
      "Floor": null
    },
    {
       },
    {
      "ObjectName1": "Beh, Danny",
      "Door": "APAC_SG_11 FLR_Main Door",
      "PersonnelType": "Employee",
      "EmployeeID": "328989",
      "CardNumber": "620038",
      "PartitionName2": "SG.Singapore",
      "LocaleMessageTime": "2025-11-06T14:10:15.000Z",
      "Direction": "InDirection",
      "PersonGUID": "4720F059-7AD2-43BF-888D-6BB9C1DA6944",
      "CompanyName": "Western Union Svcs Singapore",
      "PrimaryLocation": "Singapore - WeWork 21 Collyer Quay",
      "Zone": "Singapore",
      "Floor": null
    },
    {
      // src/api/occupancy.service.js

const BASE = process.env.REACT_APP_API_BASE || 'http://localhost:3007';

// In‐memory cache
const cache = {
  liveSummary: null,
  history: new Map(),  // key: either 'global' or the partition name the backend expects
};

/**
 * Fetch live summary (always fresh).
 */
export async function fetchLiveSummary() {
  const res = await fetch(`${BASE}/api/occupancy/live-summary`);
  if (!res.ok) {
    throw new Error(`Live summary fetch failed: ${res.status}`);
  }
  return res.json();
}

/**
 * Fetch history (global or per‐partition), with in‐memory caching.
 * @param {string} [location] — e.g. 'IN.Pune' from your front‐end router param
 */

export async function fetchHistory(location) {
  const codeMap = {
    'IN.Pune': 'Pune',
    'MY.Kuala Lumpur': 'MY.Kuala Lumpur',
    'PH.Quezon': 'Quezon City',
    'PH.Taguig': 'Taguig City',
    'JP.Tokyo': 'JP.Tokyo',
    'IN.HYD':'IN.HYD',
    'SG.Singapore':'SG.Singapore'

  };
  
  const key = location ? codeMap[location] || location : 'global';
  
  if (cache.history.has(key)) {
    return cache.history.get(key);
  }

  const url = key === 'global' 
    ? `${BASE}/api/occupancy/history`
    : `${BASE}/api/occupancy/history/${encodeURIComponent(key)}`;

  const res = await fetch(url);
  if (!res.ok) throw new Error(`History fetch failed: ${res.status}`);
  
  let json = await res.json();
  
  // Normalize single-city response to match global structure
  if (key !== 'global') {
    json.summaryByDate = json.summaryByDate.map(entry => ({
      ...entry,
      partitions: {
        [key]: {
          Employee: entry.region?.Employee,
          Contractor: entry.region?.Contractor,
          total: entry.region?.total
        }
      }
    }));
  }
  
  cache.history.set(key, json);
  return json;
}
/** Clear in‐memory caches (for dev/testing) */
export function clearCache() {
  cache.liveSummary = null;
  cache.history.clear();
}

// APAC partition list for any selector UI
export const partitionList = [
  'IN.Pune',
  'MY.Kuala Lumpur',
  'PH.Quezon',
  'PH.Taguig',
  'JP.Tokyo',
  'IN.HYD',
  'SG.Singapore'
];

//src/services/occupancy.service.js

// APAC partition list
export const partitionList = [
  'Pune',
  'Quezon City',
  'JP.Tokyo',
  'MY.Kuala Lumpur',
  'Taguig City',
  'IN.HYD',
  'SG.Singapore'
];


// src/pages/PartitionDetailDetails.jsx
import React, { useEffect, useState, useMemo } from "react";
import {
  Container, Box, Typography, Button, TextField,
  Paper, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Skeleton
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
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
    const hour12 = hours24 % 12 || 12;
    return `${String(hour12).padStart(2,"0")}:${minutes}:${seconds} ${ampm}`;
  };

  const handleExportFloor = async (floor, emps) => {
    if (!emps || emps.length === 0) return;
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("FloorExport");

    const headers = ["Emp ID","Name","Swipe Time","Type","Company","Direction","Card","Door"];
    sheet.addRow(headers).eachCell(cell => {
      cell.font = { bold: true, color: { argb: "FFFFFFFF" } };
      cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "8b8c8f" } };
      cell.alignment = { horizontal: "center", vertical: "middle" };
      cell.border = { top: { style: "thin" }, left: { style: "thin" }, bottom: { style: "thin" }, right: { style: "thin" } };
    });

    emps.forEach(r => {
      sheet.addRow([
        r.EmployeeID ?? "",
        r.ObjectName1 ?? "",
        formatApiDateTime(r.LocaleMessageTime),
        r.PersonnelType ?? "",
        r.CompanyName ?? "",
        r.Direction ?? "",
        r.CardNumber ?? "",
        r.Door ?? ""
      ]).eachCell(cell => {
        cell.border = { top: { style: "thin" }, left: { style: "thin" }, bottom: { style: "thin" }, right: { style: "thin" } };
      });
    });

    sheet.columns.forEach(col => {
      let maxLen = 7;
      col.eachCell({ includeEmpty: true }, c => {
        maxLen = Math.max(maxLen, (c.value ? c.value.toString().length : 0) + 2);
      });
      col.width = Math.min(Math.max(maxLen, 17), 40);
    });

    const safeFloor = floor.replace(/[^a-z0-9\-_]/gi, "_").slice(0, 80);
    const ts = new Date().toISOString().slice(0, 19).replace(/[:T]/g, "-");
    const filename = `${safeFloor}_${ts}.xlsx`;
    const buf = await workbook.xlsx.writeBuffer();
    saveAs(new Blob([buf]), filename);
  };

  const filterPartitionData = (json) =>
    json.details
      .filter(r =>
        r.PartitionName2 === partition &&
        (r.Direction === "InDirection" || r.Direction === "OutDirection")
      )
      .map(r => ({ ...r, floor: lookupFloor(r.PartitionName2, r.Door, r.Direction) }))
      .filter(r => r.floor !== "Unmapped");

  // Fetch & poll data for the current partition
  useEffect(() => {
    let active = true;

    // Reset state immediately to prevent glitch
    setDetails([]);
    setLiveCounts({});
    setExpandedFloor(null);
    setLoading(true);

    const fetchData = async () => {
      const json = await fetchLiveSummary();
      if (!active) return;
      setLiveCounts(json.realtime[partition]?.floors || {});
      setDetails(filterPartitionData(json));
      setLastUpdate(new Date().toLocaleTimeString());
      setLoading(false);
    };

    fetchData();
    const interval = setInterval(fetchData, 1000);

    return () => { active = false; clearInterval(interval); };
  }, [partition]);

  // Group data by floor
  const floorMap = useMemo(() => {
    const m = {};
    Object.keys(liveCounts).forEach(f => m[f] = []);
    details.forEach(r => { if (!m[r.floor]) m[r.floor] = []; m[r.floor].push(r); });
    return m;
  }, [details, liveCounts]);

  // Apply search filter
  const displayed = useMemo(() => {
    const term = search.toLowerCase();
    return Object.entries(floorMap)
      .map(([floor, emps]) => [
        floor,
        emps.filter(e =>
          floor.toLowerCase().includes(term) ||
          e.ObjectName1?.toLowerCase().includes(term) ||
          `${e.EmployeeID}`.includes(term) ||
          `${e.CardNumber}`.includes(term)
        )
      ])
      .filter(([, emps]) => emps.length > 0)
      .sort((a, b) => b[1].length - a[1].length);
  }, [floorMap, search]);

  const columns = [
    { field: "EmployeeID", headerName: "Emp ID" },
    { field: "ObjectName1", headerName: "Name" },
    { field: "LocaleMessageTime", headerName: "Swipe Time" },
    { field: "PersonnelType", headerName: "Type" },
    { field: "CompanyName", headerName: "Company" },
    { field: "Direction", headerName: "Direction" },
    { field: "CardNumber", headerName: "Card" },
    { field: "Door", headerName: "Door" },
  ];

  return (
    <>
      <Header />
      <Box sx={{ pt: 1, pb: 1, background: "rgba(0,0,0,0.6)" }}>
        <Container disableGutters maxWidth={false}>
          {/* Back + Search */}
          <Box display="flex" alignItems="center" mb={2} sx={{ px: 2 }}>
            <Button size="small" onClick={() => navigate(-1)} sx={{ color: "#FFC107" }}>← Back to Overview</Button>
          </Box>
          <Box display="flex" alignItems="center" gap={2} mb={2} sx={{ px: 2 }}>
            <Typography variant="h6" sx={{ color: "#FFC107" }}>Floor Details</Typography>
            <TextField
              size="small"
              placeholder="Search floor / emp…"
              value={search}
              onChange={e => setSearchTerm(e.target.value)}
              sx={{ "& .MuiInputBase-input": { color: "#FFC107" }, "& .MuiOutlinedInput-root fieldset": { borderColor: "#FFC107" } }}
            />
          </Box>

          {/* Floor Cards */}
          <Box display="flex" flexWrap="wrap" width="100%" sx={{ px: 2 }}>
            {loading && details.length === 0
              ? Array.from({ length: 4 }).map((_, i) => (
                  <Box key={i} sx={{ width: { xs: '100%', md: '50%' }, p: 2 }}>
                    <Skeleton variant="rectangular" height={200} sx={{ borderRadius: 2 }} />
                  </Box>
                ))
              : displayed.map(([floor, emps]) => (
                  <Box key={floor} sx={{ width: { xs: '100%', md: '50%' }, p: 2 }}>
                    <Paper sx={{ border: "2px solid #FFC107", p: 2, background: "rgba(0,0,0,0.4)" }}>
                      <Box display="flex" alignItems="center" justifyContent="space-between" mb={1}>
                        <Typography variant="subtitle1" fontWeight={600} sx={{ color: "#FFC107" }}>
                          {floor} (Total {emps.length})
                        </Typography>
                        <Button size="small" variant="contained"
                          onClick={() => handleExportFloor(floor, emps)}
                          sx={{ bgcolor: '#FFC107', color: '#000', textTransform: 'none' }}>
                          Export
                        </Button>
                      </Box>
                      <TableContainer component={Paper} variant="outlined" sx={{ mb: 1, background: "rgba(0,0,0,0.4)" }}>
                        <Table size="small">
                          <TableHead>
                            <TableRow sx={{ bgcolor: "#000" }}>
                              {["Emp ID","Name","Swipe Time","Type","Company","Direction","Card","Door"].map(h => (
                                <TableCell key={h} sx={{ color: "#FFC107", border: "1px solid #FFC107", fontWeight: "bold" }}>{h}</TableCell>
                              ))}
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {emps.slice(0,10).map((r,i) => (
                              <TableRow key={i}>
                                <TableCell sx={{ color:"#fff", border:"1px solid #FFC107" }}>{r.EmployeeID}</TableCell>
                                <TableCell sx={{ color:"#fff", border:"1px solid #FFC107" }}>{r.ObjectName1}</TableCell>
                                <TableCell sx={{ color:"#fff", border:"1px solid #FFC107" }}>{formatApiDateTime(r.LocaleMessageTime)}</TableCell>
                                <TableCell sx={{ color:"#fff", border:"1px solid #FFC107" }}>{r.PersonnelType}</TableCell>
                                <TableCell sx={{ color:"#fff", border:"1px solid #FFC107" }}>{r.CompanyName}</TableCell>
                                <TableCell sx={{ color:"#fff", border:"1px solid #FFC107" }}>{r.Direction}</TableCell>
                                <TableCell sx={{ color:"#fff", border:"1px solid #FFC107" }}>{r.CardNumber}</TableCell>
                                <TableCell sx={{ color:"#fff", border:"1px solid #FFC107" }}>{r.Door}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </TableContainer>
                      <Button size="small" onClick={() => setExpandedFloor(f => f === floor ? null : floor)} sx={{ color:"#FFC107" }}>
                        {expandedFloor === floor ? "Hide" : "See more…"}
                      </Button>
                    </Paper>
                  </Box>
                ))
            }
          </Box>

          {/* Expanded Table */}
          {expandedFloor && (
            <Box sx={{ px:2, mt:2 }}>
              <Typography variant="h6" sx={{ color:"#FFC107" }} gutterBottom>{expandedFloor} — All Entries</Typography>
              <DataTable
                columns={[{ field:"SrNo", headerName:"Sr No" }, ...columns]}
                rows={(floorMap[expandedFloor] || []).map((r,i)=>({ ...r, LocaleMessageTime: formatApiDateTime(r.LocaleMessageTime), SrNo: i+1 }))}
              />
            </Box>
          )}
        </Container>
      </Box>
      <Footer />
    </>
  );
}
