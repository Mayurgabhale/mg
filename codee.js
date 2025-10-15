import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Container,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
} from "@mui/material";
import { useState } from "react";
import Header from "./Header";
import Footer from "./Footer";

export default function FloorDetails({ displayed, floorMap, exportToExcel, formatApiTime12, navigate }) {
  const [search, setSearch] = useState("");
  const [expanded, setExpanded] = useState(null); // for popup floor

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
        >
          <DialogTitle>
            {expanded} — All Entries
          </DialogTitle>
          <DialogContent sx={{ overflowX: "auto" }}>
            {expanded && (
              <TableContainer component={Paper} variant="outlined">
                <Table size="small" stickyHeader>
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
                        <TableCell
                          key={h}
                          sx={{
                            fontWeight: "bold",
                            fontSize: "0.85rem",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {h}
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {floorMap[expanded]?.map((r, i) => (
                      <TableRow key={i}>
                        <TableCell>{i + 1}</TableCell>
                        <TableCell>{r.EmployeeID}</TableCell>
                        <TableCell>{r.ObjectName1}</TableCell>
                        <TableCell>
                          {formatApiTime12(r.LocaleMessageTime)}
                        </TableCell>
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
          <DialogActions>
            <Button onClick={() => setExpanded(null)}>Close</Button>
          </DialogActions>
        </Dialog>
      </Container>
      <Footer />
    </>
  );
}