// src/pages/PartitionDetailDetails.jsx
import React, { useEffect, useState, useMemo } from "react";
import {
  Container, Box, Typography, Button, TextField,
  TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody,
  Grid
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";

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
  const [expandedFloor, setExpandedFloor] = useState(null);

  useEffect(() => {
    let active = true;
    const load = async () => {
      try {
        const json = await fetchLiveSummary();
        if (!active) return;

        const raw = json.realtime[partition]?.floors || {};
        const counts = Object.entries(raw).reduce((acc, [floor, count]) => {
          acc[floor.trim()] = (acc[floor.trim()] || 0) + count;
          return acc;
        }, {});
        setLiveCounts(counts);

        const all = json.details.filter(
          r =>
            r.PartitionName2 === partition &&
            (r.Direction === "InDirection" || r.Direction === "OutDirection")
        );

        all.sort((a, b) => new Date(a.LocaleMessageTime) - new Date(b.LocaleMessageTime));
        const lastByPerson = {};
        all.forEach(r => (lastByPerson[r.PersonGUID] = r));

        const inside = Object.values(lastByPerson)
          .filter(r => r.Direction === "InDirection")
          .map(r => ({
            ...r,
            floor: lookupFloor(r.PartitionName2, r.Door, r.Direction),
          }));

        setDetails(inside);
        setLastUpdate(new Date().toLocaleTimeString());
        setLoading(false);
      } catch (err) {
        console.error("fetchLiveSummary error:", err);
      }
    };

    load();
    const iv = setInterval(load, 1000);
    return () => {
      active = false;
      clearInterval(iv);
    };
  }, [partition]);

  const floorMap = useMemo(() => {
    const m = {};
    Object.keys(liveCounts).forEach(f => (m[f] = []));
    details.forEach(r => {
      const f = r.floor;
      if (!m[f]) m[f] = [];
      m[f].push(r);
    });
    return m;
  }, [details, liveCounts]);

  const term = searchTerm.trim().toLowerCase();
  const displayed = useMemo(() => {
    return Object.entries(floorMap)
      .filter(([floor, emps]) => {
        if (!term) return true;
        if (floor.toLowerCase().includes(term)) return true;
        return emps.some(r =>
          String(r.EmployeeID).toLowerCase().includes(term) ||
          String(r.ObjectName1).toLowerCase().includes(term) ||
          String(r.CardNumber).toLowerCase().includes(term)
        );
      })
      .sort(([a], [b]) => (liveCounts[b] || 0) - (liveCounts[a] || 0));
  }, [floorMap, liveCounts, term]);

  const columns = [
    { field: "EmployeeID", headerName: "Emp ID" },
    { field: "ObjectName1", headerName: "Name" },
    { field: "LocaleMessageTime", headerName: "Swipe Time" },
    { field: "PersonnelType", headerName: "Type" },
    { field: "CardNumber", headerName: "Card" },
    { field: "Door", headerName: "Door" },
  ];

  const formatApiTime12 = (iso, fallback) => {
    const raw = iso ? iso.slice(11, 19) : fallback || "";
    if (!raw) return "";
    const [hh, mm, ss] = raw.split(":").map(Number);
    const hours12 = ((hh + 11) % 12) + 1;
    const ampm = hh >= 12 ? "PM" : "AM";
    return `${hours12.toString().padStart(2, "0")}:${mm
      .toString()
      .padStart(2, "0")}:${ss.toString().padStart(2, "0")} ${ampm}`;
  };

  return (
    <>
      <Header />
      <Box sx={{ pt: 1, pb: 3, background: "rgba(0,0,0,0.6)", minHeight: "100vh" }}>
        <Container maxWidth="xl">
          <Box display="flex" alignItems="center" mb={2} sx={{ flexWrap: "wrap", px: 2 }}>
            <Button size="small" onClick={() => navigate(-1)} sx={{ color: "#FFC107", mb: 1 }}>
              ← Back to Overview
            </Button>
            <Typography variant="h6" sx={{ color: "#FFC107", ml: 2, mb: 1 }}>
              Floor Details
            </Typography>
            <Typography variant="body2" sx={{ color: "#FFC107", ml: "auto", mb: 1 }}>
              Last updated: {lastUpdate}
            </Typography>
          </Box>

          <Box display="flex" justifyContent="center" sx={{ mb: 3, px: 2 }}>
            <TextField
              fullWidth
              size="small"
              placeholder="Search…"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              sx={{
                maxWidth: { xs: "100%", sm: "80%", md: "50%" },
                "& .MuiInputBase-input": { color: "#FFC107" },
                "& .MuiOutlinedInput-root fieldset": { borderColor: "#FFC107" },
              }}
            />
          </Box>

          {loading ? (
            <Box sx={{ px: 2, py: 8 }}>
              <LoadingSpinner />
            </Box>
          ) : (
            <>
              <Grid container spacing={2} sx={{ px: 2 }}>
                {displayed.map(([floor, emps]) => {
                  const showAll = !!term;
                  const preview = showAll
                    ? emps.filter(r =>
                        String(r.EmployeeID).toLowerCase().includes(term) ||
                        String(r.ObjectName1).toLowerCase().includes(term) ||
                        String(r.CardNumber).toLowerCase().includes(term)
                      )
                    : emps.slice(0, 15);

                  return (
                    <Grid item xs={12} sm={6} md={4} lg={3} key={floor}>
                      <Paper sx={{ border: "2px solid #FFC107", p: 2, background: "rgba(0,0,0,0.4)" }}>
                        <Typography variant="subtitle1" fontWeight={600} sx={{ color: "#FFC107", mb: 1 }}>
                          {floor} (Total {liveCounts[floor] || 0})
                        </Typography>
                        <TableContainer component={Paper} variant="outlined" sx={{ mb: 1, background: "rgba(0,0,0,0.4)" }}>
                          <Table size="small">
                            <TableHead>
                              <TableRow sx={{ bgcolor: "#000" }}>
                                {columns.map(c => (
                                  <TableCell
                                    key={c.field}
                                    sx={{ color: "#FFC107", fontWeight: "bold", border: "1px solid #FFC107" }}
                                  >
                                    {c.headerName}
                                  </TableCell>
                                ))}
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {preview.map((r, i) => (
                                <TableRow
                                  key={`${r.PersonGUID}-${i}`}
                                  sx={showAll ? { background: "rgba(255,235,59,0.3)" } : {}}
                                >
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
                        <Button
                          size="small"
                          sx={{ color: "#FFC107" }}
                          onClick={() => setExpandedFloor(f => (f === floor ? null : floor))}
                        >
                          {expandedFloor === floor ? "Hide" : "See more…"}
                        </Button>
                      </Paper>
                    </Grid>
                  );
                })}
              </Grid>

              {expandedFloor && (
                <Box sx={{ px: 2, mt: 2 }}>
                  <Typography variant="h6" sx={{ color: "#FFC107" }} gutterBottom>
                    {expandedFloor} — All Entries
                  </Typography>
                  <DataTable
                    columns={columns}
                    rows={(floorMap[expandedFloor] || []).map(r => ({
                      ...r,
                      LocaleMessageTime: formatApiTime12(r.LocaleMessageTime, r.Swipe_Time),
                    }))}
                  />
                </Box>
              )}
            </>
          )}
        </Container>
      </Box>
      <Footer />
    </>
  );
}