// src/pages/PartitionDetailDetails.jsx
import React, { useEffect, useState, useMemo, useRef } from "react";
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

  const cachedDataRef = useRef(null); // cache for previous API data

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

    const headers = ["Emp ID","Name","Swipe Time","Type","Company","Direction","Card","Door"];
    const headerRow = sheet.addRow(headers);
    headerRow.eachCell(cell => {
      cell.font = { bold: true, color: { argb: "FFFFFFFF" } };
      cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "8b8c8f" } };
      cell.alignment = { horizontal: "center", vertical: "middle" };
      cell.border = { top: { style: "thin" }, left: { style: "thin" }, bottom: { style: "thin" }, right: { style: "thin" } };
    });

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

  // Filter and map API data
  const filterAndMap = (json) =>
    json.details
      .filter(r =>
        r.PartitionName2 === partition &&
        (r.Direction === "InDirection" || r.Direction === "OutDirection")
      )
      .map(r => {
        const floor = lookupFloor(r.PartitionName2, r.Door, r.Direction);
        return { ...r, floor };
      })
      .filter(r => r.floor !== "Unmapped");

  // --- Fetch data on partition change ---
  useEffect(() => {
    let active = true;

    // Optimistic loading: clear old data and show spinner
    setLoading(true);
    setDetails([]);

    // Use cached data if available
    if (cachedDataRef.current) {
      const cachedJson = cachedDataRef.current;
      if (cachedJson.realtime[partition]) {
        setLiveCounts(cachedJson.realtime[partition]?.floors || {});
        setDetails(filterAndMap(cachedJson));
        setLoading(false);
      }
    }

    // Fetch new data
    fetchLiveSummary().then(json => {
      if (!active) return;
      cachedDataRef.current = json; // cache for later
      setLiveCounts(json.realtime[partition]?.floors || {});
      setDetails(filterAndMap(json));
      setLastUpdate(new Date().toLocaleTimeString());
      setLoading(false);
    });

    return () => { active = false };
  }, [partition]);

  // --- Polling every second for live updates ---
  useEffect(() => {
    const iv = setInterval(async () => {
      const json = await fetchLiveSummary();
      cachedDataRef.current = json; // update cache
      setLiveCounts(json.realtime[partition]?.floors || {});
      setDetails(filterAndMap(json));
      setLastUpdate(new Date().toLocaleTimeString());
    }, 1000);

    return () => clearInterval(iv);
  }, [partition]);

  // Group by floor
  const floorMap = useMemo(() => {
    const m = {};
    Object.keys(liveCounts).forEach(f => { m[f] = [] });
    details.forEach(r => {
      if (!m[r.floor]) m[r.floor] = [];
      m[r.floor].push(r);
    });
    return m;
  }, [details, liveCounts]);

  // Search filter
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

    arr.sort((a, b) => b[1].length - a[1].length);
    return arr;
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

  if (loading && details.length === 0) {
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

          {/* Floor cards */}
          <Box display="flex" flexWrap="wrap" width="100%" sx={{ px: 2 }}>
            {displayed.map(([floor, emps]) => (
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
                          {["Emp ID", "Name", "Swipe Time", "Type", "Company","Direction", "Card", "Door"].map(h => (
                            <TableCell key={h} sx={{ color: "#FFC107", border: "1px solid #FFC107", fontWeight: "bold" }}>
                              {h}
                            </TableCell>
                          ))}
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {emps.slice(0, 10).map((r, i) => (
                          <TableRow key={i}>
                            <TableCell sx={{ color: "#fff", border: "1px solid #FFC107" }}>{r.EmployeeID}</TableCell>
                            <TableCell sx={{ color: "#fff", border: "1px solid #FFC107" }}>{r.ObjectName1}</TableCell>
                            <TableCell sx={{ color: "#fff", border: "1px solid #FFC107" }}>{formatApiDateTime(r.LocaleMessageTime)}</TableCell>
                            <TableCell sx={{ color: "#fff", border: "1px solid #FFC107" }}>{r.PersonnelType}</TableCell>
                            <TableCell sx={{ color: "#fff", border: "1px solid #FFC107" }}>{r.CompanyName}</TableCell>
                            <TableCell sx={{ color: "#fff", border: "1px solid #FFC107" }}>{r.Direction}</TableCell>
                            <TableCell sx={{ color: "#fff", border: "1px solid #FFC107" }}>{r.CardNumber}</TableCell>
                            <TableCell sx={{ color: "#fff", border: "1px solid #FFC107" }}>{r.Door}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                  <Button size="small" onClick={() => setExpandedFloor(f => f === floor ? null : floor)} sx={{ color: "#FFC107" }}>
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
                columns={[{ field: "SrNo", headerName: "Sr No" }, ...columns]}
                rows={(floorMap[expandedFloor] || []).map((r, i) => ({
                  ...r,
                  LocaleMessageTime: formatApiDateTime(r.LocaleMessageTime),
                  SrNo: i + 1
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