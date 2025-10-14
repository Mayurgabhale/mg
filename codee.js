I  want this page responive for each and every device, i menas auto adjust on screen size.
  fully responsive ok.  in desktop desktop and laptop disply 2 table side by side wiht table alos responsive ok 
// src/pages/PartitionDetailDetails.jsx
import React, { useEffect, useState, useMemo } from "react";
import {
  Container,
  Box,
  Typography,
  Button,
  TextField,
  Paper,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  useTheme,
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";

import Header from "../components/Header";
import Footer from "../components/Footer";
import LoadingSpinner from "../components/LoadingSpinner";
import DataTable from "../components/DataTable";
import ExcelJS from "exceljs";
import { fetchLiveSummary } from "../api/occupancy.service";
import { lookupFloor } from "../utils/floorLookup";
import { saveAs } from "file-saver";

export default function PartitionDetailDetails() {
  const { partition } = useParams();
  const navigate = useNavigate();

  const [details, setDetails] = useState([]);
  const [liveCounts, setLiveCounts] = useState({});
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState("");
  const [search, setSearchTerm] = useState("");
  const [expandedFloor, setExpandedFloor] = useState(null);

  const theme = useTheme();

  // Format helper
  const formatApiDateTime = (iso) => {
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

  // Export floor to Excel
  const handleExportFloor = async (floor, emps) => {
    if (!emps || emps.length === 0) return;

    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("FloorExport");

    const headers = [
      "Emp ID",
      "Name",
      "Swipe Time",
      "Type",
      "Company",
      "Direction",
      "Card",
      "Door",
    ];
    const headerRow = sheet.addRow(headers);
    headerRow.eachCell((cell) => {
      cell.font = { bold: true, color: { argb: "FFFFFFFF" } };
      cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "8b8c8f" } };
      cell.alignment = { horizontal: "center", vertical: "middle" };
      cell.border = {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" },
      };
    });

    emps.forEach((r) => {
      const row = sheet.addRow([
        r.EmployeeID ?? "",
        r.ObjectName1 ?? "",
        formatApiDateTime(r.LocaleMessageTime),
        r.PersonnelType ?? "",
        r.CompanyName ?? "",
        r.Direction ?? "",
        r.CardNumber ?? "",
        r.Door ?? "",
      ]);
      row.eachCell((cell) => {
        cell.border = {
          top: { style: "thin" },
          left: { style: "thin" },
          bottom: { style: "thin" },
          right: { style: "thin" },
        };
      });
    });

    sheet.columns.forEach((col) => {
      let maxLen = 7;
      col.eachCell({ includeEmpty: true }, (c) => {
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

  // Filter + map
  const filterAndMap = (json, currentPartition) =>
    json.details
      .filter(
        (r) =>
          r.PartitionName2 === currentPartition &&
          (r.Direction === "InDirection" || r.Direction === "OutDirection")
      )
      .map((r) => {
        const floor = lookupFloor(r.PartitionName2, r.Door, r.Direction);
        return { ...r, floor };
      })
      .filter((r) => r.floor !== "Unmapped");

  // Fetch + polling
  useEffect(() => {
    let active = true;

    const fetchData = async () => {
      try {
        const json = await fetchLiveSummary();
        if (!active) return;
        setLiveCounts(json.realtime[partition]?.floors || {});
        setDetails(filterAndMap(json, partition));
        setLastUpdate(new Date().toLocaleTimeString());
        setLoading(false);
      } catch (err) {
        console.error("fetchLiveSummary error:", err);
        if (active) setLoading(false);
      }
    };

    setLoading(true);
    fetchData();
    const iv = setInterval(fetchData, 1000);

    return () => {
      active = false;
      clearInterval(iv);
    };
  }, [partition]);

  // Group by floor
  const floorMap = useMemo(() => {
    const m = {};
    Object.keys(liveCounts).forEach((f) => {
      m[f] = [];
    });
    details.forEach((r) => {
      if (!m[r.floor]) m[r.floor] = [];
      m[r.floor].push(r);
    });
    return m;
  }, [details, liveCounts]);

  // Search & sort
  const displayed = useMemo(() => {
    const term = (search || "").toLowerCase();
    const arr = Object.entries(floorMap)
      .map(([floor, emps]) => {
        const filtered = emps.filter(
          (e) =>
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

  if (loading) {
    return (
      <>
        <Header />
        <Box sx={{ px: 2, py: 8 }}>
          <LoadingSpinner />
        </Box>
        <Footer />
      </>
    );
  }

  // Layout
  return (
    <>
      <Header />
      <Box sx={{ pt: 1, pb: 2, background: "rgba(0,0,0,0.6)" }}>
        <Container maxWidth="xl" sx={{ px: { xs: 1.5, sm: 2, md: 3 } }}>
          {/* Top Row */}
          <Box
            display="flex"
            flexWrap="wrap"
            alignItems="center"
            justifyContent="space-between"
            mb={2}
            gap={1}
          >
            <Box display="flex" alignItems="center" gap={1}>
              <Button
                size="small"
                onClick={() => navigate(-1)}
                sx={{ color: "#FFC107", fontSize: { xs: "0.8rem", sm: "0.9rem" } }}
              >
                ← Back to Overview
              </Button>
              <Typography
                variant="h6"
                sx={{ color: "#FFC107", fontSize: { xs: "1rem", sm: "1.15rem" } }}
              >
                Floor Details
              </Typography>
            </Box>

            <Box display="flex" alignItems="center" gap={2}>
              <TextField
                size="small"
                placeholder="Search floor / emp…"
                value={search}
                onChange={(e) => setSearchTerm(e.target.value)}
                sx={{
                  width: { xs: "100%", sm: 260 },
                  "& .MuiInputBase-input": { color: "#FFC107" },
                  "& .MuiOutlinedInput-root fieldset": { borderColor: "#FFC107" },
                }}
              />
              <Typography sx={{ color: "#FFC107", fontSize: { xs: "0.75rem", sm: "0.85rem" } }}>
                Last: {lastUpdate}
              </Typography>
            </Box>
          </Box>

          {/* Main Grid */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
              gap: 2,
            }}
          >
            {/* LEFT: floor cards */}
            <Box>
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: {
                    xs: "1fr",
                    sm: "1fr 1fr",
                    md: "1fr",
                  },
                  gap: 2,
                }}
              >
                {displayed.map(([floor, emps]) => (
                  <Paper
                    key={floor}
                    sx={{
                      border: "2px solid #FFC107",
                      p: 1.5,
                      background: "rgba(0,0,0,0.4)",
                    }}
                  >
                    <Box
                      display="flex"
                      alignItems="center"
                      justifyContent="space-between"
                      mb={1}
                      flexWrap="wrap"
                    >
                      <Typography
                        variant="subtitle1"
                        fontWeight={600}
                        sx={{ color: "#FFC107", fontSize: { xs: "0.9rem", sm: "1rem" } }}
                      >
                        {floor} (Total {emps.length})
                      </Typography>

                      <Button
                        size="small"
                        variant="contained"
                        onClick={() => handleExportFloor(floor, emps)}
                        sx={{
                          bgcolor: "#FFC107",
                          color: "#000",
                          textTransform: "none",
                          fontSize: { xs: "0.7rem", sm: "0.85rem" },
                        }}
                      >
                        Export
                      </Button>
                    </Box>

                    <TableContainer
                      component={Paper}
                      variant="outlined"
                      sx={{
                        mb: 1,
                        background: "rgba(0,0,0,0.4)",
                        overflowX: "auto",
                      }}
                    >
                      <Table size="small">
                        <TableHead>
                          <TableRow sx={{ bgcolor: "#000" }}>
                            {[
                              "Emp ID",
                              "Name",
                              "Swipe Time",
                              "Type",
                              "Company",
                              "Direction",
                              "Card",
                              "Door",
                            ].map((h) => (
                              <TableCell
                                key={h}
                                sx={{
                                  color: "#FFC107",
                                  border: "1px solid #FFC107",
                                  fontWeight: "bold",
                                  fontSize: { xs: "0.65rem", sm: "0.8rem" },
                                  whiteSpace: "nowrap",
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
                              <TableCell
                                sx={{
                                  color: "#fff",
                                  border: "1px solid #FFC107",
                                  fontSize: { xs: "0.7rem", sm: "0.85rem" },
                                }}
                              >
                                {r.EmployeeID}
                              </TableCell>
                              <TableCell
                                sx={{
                                  color: "#fff",
                                  border: "1px solid #FFC107",
                                  fontSize: { xs: "0.7rem", sm: "0.85rem" },
                                }}
                              >
                                {r.ObjectName1}
                              </TableCell>
                              <TableCell
                                sx={{
                                  color: "#fff",
                                  border: "1px solid #FFC107",
                                  fontSize: { xs: "0.7rem", sm: "0.85rem" },
                                }}
                              >
                                {formatApiDateTime(r.LocaleMessageTime)}
                              </TableCell>
                              <TableCell
                                sx={{
                                  color: "#fff",
                                  border: "1px solid #FFC107",
                                  fontSize: { xs: "0.7rem", sm: "0.85rem" },
                                }}
                              >
                                {r.PersonnelType}
                              </TableCell>
                              <TableCell
                                sx={{
                                  color: "#fff",
                                  border: "1px solid #FFC107",
                                  fontSize: { xs: "0.7rem", sm: "0.85rem" },
                                }}
                              >
                                {r.CompanyName}
                              </TableCell>
                              <TableCell
                                sx={{
                                  color: "#fff",
                                  border: "1px solid #FFC107",
                                  fontSize: { xs: "0.7rem", sm: "0.85rem" },
                                }}
                              >
                                {r.Direction}
                              </TableCell>
                              <TableCell
                                sx={{
                                  color: "#fff",
                                  border: "1px solid #FFC107",
                                  fontSize: { xs: "0.7rem", sm: "0.85rem" },
                                }}
                              >
                                {r.CardNumber}
                              </TableCell>
                              <TableCell
                                sx={{
                                  color: "#fff",
                                  border: "1px solid #FFC107",
                                  fontSize: { xs: "0.7rem", sm: "0.85rem" },
                                }}
                              >
                                {r.Door}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>

                    <Button
                      size="small"
                      onClick={() =>
                        setExpandedFloor((f) => (f === floor ? null : floor))
                      }
                      sx={{ color: "#FFC107", fontSize: { xs: "0.75rem", sm: "0.85rem" } }}
                    >
                      {expandedFloor === floor ? "Hide" : "See more…"}
                    </Button>
                  </Paper>
                ))}
              </Box>
            </Box>

            {/* RIGHT: expanded table */}
            <Box>
              {expandedFloor && (
                <Box>
                  <Typography
                    variant="h6"
                    sx={{
                      color: "#FFC107",
                      mb: 1,
                      fontSize: { xs: "1rem", sm: "1.1rem" },
                    }}
                  >
                    {expandedFloor} — All Entries
                  </Typography>

                  <Paper sx={{ p: 1, background: "rgba(0,0,0,0.35)" }}>
                    <DataTable
                      columns={[{ field: "SrNo", headerName: "Sr No" }, ...columns]}
                      rows={(floorMap[expandedFloor] || []).map((r, i) => ({
                        ...r,
                        LocaleMessageTime: formatApiDateTime(r.LocaleMessageTime),
                        SrNo: i + 1,
                      }))}
                    />
                  </Paper>
                </Box>
              )}
            </Box>
          </Box>
        </Container>
      </Box>
      <Footer />
    </>
  );
}
