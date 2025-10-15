import React, { useEffect, useState, useMemo, useCallback, useRef } from "react";
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
  const [search, setSearchTerm] = useState("");
  const [expandedFloor, setExpandedFloor] = useState(null);

  const intervalRef = useRef(null); // Keep track of polling interval

  // Format date
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
    return `${String(hour12).padStart(2, "0")}:${minutes}:${seconds} ${ampm}`;
  };

  // Filter & map
  const filterAndMap = useCallback((json) => {
    return json.details
      .filter(r =>
        r.PartitionName2 === partition &&
        (r.Direction === "InDirection" || r.Direction === "OutDirection")
      )
      .map(r => ({ ...r, floor: lookupFloor(r.PartitionName2, r.Door, r.Direction) }))
      .filter(r => r.floor !== "Unmapped");
  }, [partition]);

  // Fetch for current partition
  const fetchPartitionData = useCallback(async () => {
    try {
      const json = await fetchLiveSummary();
      setLiveCounts(json.realtime[partition]?.floors || {});
      setDetails(filterAndMap(json));
      setLoading(false);
    } catch (err) {
      console.error("Failed to fetch live summary", err);
      setDetails([]);
      setLiveCounts({});
      setLoading(false);
    }
  }, [partition, filterAndMap]);

  // Handle partition change
  useEffect(() => {
    // Stop previous interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    // Reset state immediately
    setLoading(true);
    setDetails([]);
    setLiveCounts({});

    // Fetch immediately for the new partition
    fetchPartitionData();

    // Start new interval for polling
    intervalRef.current = setInterval(() => {
      fetchPartitionData();
    }, 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [partition, fetchPartitionData]);

  // Group by floor
  const floorMap = useMemo(() => {
    const m = {};
    Object.keys(liveCounts).forEach(f => { m[f] = []; });
    details.forEach(r => {
      if (!m[r.floor]) m[r.floor] = [];
      m[r.floor].push(r);
    });
    return m;
  }, [details, liveCounts]);

  // Search
  const displayed = useMemo(() => {
    const term = search.toLowerCase();
    return Object.entries(floorMap)
      .map(([floor, emps]) => {
        const filtered = emps.filter(e =>
          floor.toLowerCase().includes(term) ||
          e.ObjectName1?.toLowerCase().includes(term) ||
          `${e.EmployeeID}`.toLowerCase().includes(term) ||
          `${e.CardNumber}`.toLowerCase().includes(term)
        );
        return [floor, filtered];
      })
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
          {/* Back button */}
          <Box display="flex" alignItems="center" mb={2} sx={{ px: 2 }}>
            <Button size="small" onClick={() => navigate(-1)} sx={{ color: "#FFC107" }}>
              ← Back to Overview
            </Button>
          </Box>

          {/* Search */}
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

          {/* Floor cards */}
          <Box display="flex" flexWrap="wrap" width="100%" sx={{ px: 2 }}>
            {displayed.map(([floor, emps]) => (
              <Box key={floor} sx={{ width: { xs: '100%', md: '50%' }, p: 2 }}>
                <Paper sx={{ border: "2px solid #FFC107", p: 2, background: "rgba(0,0,0,0.4)" }}>
                  <Box display="flex" alignItems="center" justifyContent="space-between" mb={1}>
                    <Typography variant="subtitle1" fontWeight={600} sx={{ color: "#FFC107" }}>
                      {floor} (Total {emps.length})
                    </Typography>
                  </Box>
                  <TableContainer component={Paper} variant="outlined" sx={{ mb: 1, background: "rgba(0,0,0,0.4)" }}>
                    <Table size="small">
                      <TableHead>
                        <TableRow sx={{ bgcolor: "#000" }}>
                          {["Emp ID", "Name", "Swipe Time", "Type", "Company", "Direction", "Card", "Door"].map(h => (
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
        </Container>
      </Box>
      <Footer />
    </>
  );
}