import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';






...



const theme = useTheme();
const isXs = useMediaQuery(theme.breakpoints.only('xs'));
const isSm = useMediaQuery(theme.breakpoints.only('sm'));
const isSmDown = useMediaQuery(theme.breakpoints.down('sm')); // true for xs + sm
const isMdUp = useMediaQuery(theme.breakpoints.up('md'));








{/* Container for both tables side-by-side (responsive) */}
<Grid container spacing={2} sx={{ width: '100%' }}>
  <Grid item xs={12} md={6}>
    {/* Left: Summary Paper (copy your existing Paper markup here) */}
    <Paper elevation={3} sx={{ p: 2, border: '3px solid #000', borderRadius: 2 }}>
      {/* keep your TableContainer, Table, Buttons etc. */}
    </Paper>
  </Grid>

  <Grid item xs={12} md={6}>
    {/* Right: Company Paper */}
    <Paper elevation={3} sx={{ p: 2, border: '3px solid #000', borderRadius: 2 }}>
      {/* company table and buttons */}
    </Paper>
  </Grid>
</Grid>


see this is the code  this i want in responsive ok 

            {/* Container for both tables side-by-side */}
            <Box sx={{ display: 'flex', gap: 2, width: '100%', flexWrap: { xs: 'wrap', md: 'nowrap' } }}>
              {/* Left: existing summary table */}
              <Box sx={{ flex: 1, minWidth: 320 }}>
                <Paper elevation={3} sx={{ p: 3, border: '3px solid #000', borderRadius: 2 }}>
                  <TableContainer sx={{ maxHeight: 500, overflowY: 'auto' }}>
                    <Table sx={{ border: '2px solid #000' }} size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell colSpan={5} align="center"
                            sx={{ fontWeight: 'bold', fontSize: 16, bgcolor: '#000', color: '#FFC107', border: '2px solid #000' }}>
                            {format(pickedDate, 'EEEE, d MMMM, yyyy')}
                          </TableCell>
                        </TableRow>
                        <TableRow sx={{ bgcolor: '#FFC107' }}>
                          {['Country', 'City', 'Employees', 'Contractors', 'Total'].map(h => {
                            // clickable personnel headers
                            if (h === 'Employees' || h === 'Contractors') {
                              const personnelType = h === 'Employees' ? 'Employee' : 'Contractor';
                              const isActive = selectedPersonnel === personnelType && !selectedSummaryPartition;
                              return (
                                <TableCell
                                  key={h}
                                  align="right"
                                  onClick={() => {
                                    if (isActive) {
                                      setSelectedPersonnel(null);
                                    } else {
                                      setSelectedPersonnel(personnelType);
                                      setSelectedSummaryPartition(null);
                                      setSelectedCompany(null);
                                      setShowDetails(true);
                                    }
                                  }}
                                  sx={{
                                    color: isActive ? '#fff' : '#000',
                                    fontWeight: 'bold',
                                    fontSize: 14,
                                    border: '2px solid #000',
                                    cursor: 'pointer',
                                    textAlign: 'right',
                                    bgcolor: isActive ? '#474747' : '#FFC107',
                                    '&:hover': { backgroundColor: isActive ? '#5a5a5a' : '#f2f2f2' }
                                  }}
                                >
                                  {h}
                                </TableCell>
                              );
                            }
                            // non-clickable headers
                            return (
                              <TableCell
                                key={h}
                                align={['Country', 'City'].includes(h) ? 'left' : 'right'}
                                sx={{ color: '#000', fontWeight: 'bold', fontSize: 14, border: '2px solid #000' }}
                              >
                                {h}
                              </TableCell>
                            );
                          })}
                        </TableRow>

                      </TableHead>
                      <TableBody>

                        {partitionRows.map((r, i) => {
                          const rowKey = `${r.country}||${r.city}`;
                          return (
                            <TableRow
                              key={i}
                              onClick={() => {
                                // set city filter when a partition is clicked
                                setSelectedSummaryPartition(rowKey);
                                setSelectedCompany(null);
                                setSelectedPersonnel(null);
                                setShowDetails(true);
                              }}
                              sx={{
                                cursor: 'pointer',
                                '&:hover': { backgroundColor: '#474747' },
                                ...(selectedSummaryPartition === rowKey ? { backgroundColor: '#474747' } : {})
                              }}
                              tabIndex={0}
                              role="button"
                              onKeyDown={(e) => {
                                if (e.key === 'Enter' || e.key === ' ') {
                                  e.preventDefault();
                                  if (selectedSummaryPartition === rowKey) {
                                    setSelectedSummaryPartition(null);
                                    setShowDetails(true);
                                  } else {
                                    setSelectedSummaryPartition(rowKey);
                                    setShowDetails(true);
                                  }
                                }
                              }}
                            >
                              <TableCell sx={{ border: '2px solid #000' }}>{r.country}</TableCell>
                              <TableCell sx={{ border: '2px solid #000' }}>{r.city}</TableCell>
                              <TableCell align="right" sx={{ border: '2px solid #000' }}>{r.employee}</TableCell>
                              <TableCell align="right" sx={{ border: '2px solid #000' }}>{r.contractor}</TableCell>
                              <TableCell align="right" sx={{ bgcolor: '#FFC107', fontWeight: 'bold', border: '2px solid #000' }}>
                                {r.total}
                              </TableCell>
                            </TableRow>
                          );
                        })}


                        <TableRow sx={{ bgcolor: '#666' }}>
                          <TableCell colSpan={2} align="right" sx={{ color: '#fff', fontWeight: 'bold', border: '2px solid #000' }}>
                            Total
                          </TableCell>
                          <TableCell align="right" sx={{ color: '#fff', fontWeight: 'bold', border: '2px solid #000' }}>
                            {partitionRows.reduce((s, r) => s + r.employee, 0)}
                          </TableCell>
                          <TableCell align="right" sx={{ color: '#fff', fontWeight: 'bold', border: '2px solid #000' }}>
                            {partitionRows.reduce((s, r) => s + r.contractor, 0)}
                          </TableCell>
                          <TableCell align="right" sx={{ color: '#fff', fontWeight: 'bold', bgcolor: '#333', border: '2px solid #000' }}>
                            {partitionRows.reduce((s, r) => s + r.total, 0)}
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Paper>

                <Box display="flex" justifyContent="center" sx={{ mt: 1 }}>
                  <Button variant="contained" sx={{ bgcolor: '#FFC107', color: '#000' }}
                    onClick={() => setShowDetails(v => !v)}>
                    {showDetails ? 'Hide Details' : 'See Details'}
                  </Button>
                  {showDetails && (
                    <Button variant="outlined" sx={{ ml: 2, borderColor: '#FFC107', color: '#FFC107' }}
                      onClick={handleExport}>
                      Export to Excel
                    </Button>
                  )}
                  <Button
                    variant="contained"
                    sx={{ ml: 2, bgcolor: '#FFC107', color: '#000' }}
                    onClick={handleExportSummary}
                  >
                    Export Summary to Excel
                  </Button>
                  {selectedSummaryPartition && (
                    <Button
                      variant="outlined"
                      sx={{ ml: 2, borderColor: '#090909ff', color: '#060606ff', bgcolor: '#f31408ff' }}
                      onClick={() => { setSelectedSummaryPartition(null); setSelectedCompany(null); setShowDetails(false); }}
                    >
                      Clear city filter
                    </Button>
                  )}
                </Box>

                

              </Box>

              {/* Right: NEW company-level table (same style) */}
              <Box sx={{ flex: 1, minWidth: 320 }}>
                <Paper elevation={3} sx={{ p: 3, border: '3px solid #000', borderRadius: 2 }}>
                  <TableContainer sx={{ maxHeight: 280, overflowY: 'auto' }}>
                    <Table sx={{ border: '2px solid #000' }} size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell
                            colSpan={4}
                            align="center"
                            sx={{
                              fontWeight: "bold",
                              fontSize: 16,
                              bgcolor: "#000",
                              color: "#FFC107",
                              border: "2px solid #000",
                            }}
                          >
                            {format(pickedDate, "EEEE, d MMMM, yyyy")}
                          </TableCell>
                        </TableRow>

                        <TableRow sx={{ bgcolor: "#FFC107" }}>
                          <TableCell
                            align="left"
                            sx={{
                              color: "#000",
                              fontWeight: "bold",
                              fontSize: 14,
                              border: "2px solid #000",
                            }}
                          >
                            Country
                          </TableCell>

                          <TableCell
                            align="left"
                            sx={{
                              color: "#000",
                              fontWeight: "bold",
                              fontSize: 14,
                              border: "2px solid #000",
                            }}
                          >
                            City
                          </TableCell>

                          <TableCell
                            align="left"
                            sx={{
                              color: "#000",
                              fontWeight: "bold",
                              fontSize: 14,
                              border: "2px solid #000",
                            }}
                          >
                            Company
                          </TableCell>

                          <TableCell
                            align="center"
                            sx={{
                              color: "#000",
                              fontWeight: "bold",
                              fontSize: 14,
                              border: "2px solid #000",
                            }}
                          >
                            Total
                          </TableCell>
                        </TableRow>
                      </TableHead>

                      <TableBody>
                        {companyRows.length > 0 ? (
                          companyRows.map((r, i) => {
                            const rowKey = makeCompanyKey(r.country, r.city, r.company);
                            return (
                              <TableRow
                                key={`${r.company}-${i}`}
                                onClick={() => {
                                  if (selectedCompany === rowKey) {
                                    setSelectedCompany(null);
                                    setShowDetails(true);
                                  } else {
                                    setSelectedCompany(rowKey);
                                    setShowDetails(true);
                                  }
                                }}
                                sx={{
                                  cursor: "pointer",
                                  "&:hover": { backgroundColor: "#474747" },
                                  ...(selectedCompany === rowKey
                                    ? { backgroundColor: "#474747" }
                                    : {}),
                                }}
                                tabIndex={0}
                                role="button"
                                onKeyDown={(e) => {
                                  if (e.key === "Enter" || e.key === " ") {
                                    e.preventDefault();
                                    if (selectedCompany === rowKey) {
                                      setSelectedCompany(null);
                                      setShowDetails(true);
                                    } else {
                                      setSelectedCompany(rowKey);
                                      setShowDetails(true);
                                    }
                                  }
                                }}
                              >
                                <TableCell sx={{ border: "2px solid #000" }}>{r.country}</TableCell>
                                <TableCell sx={{ border: "2px solid #000" }}>{r.city}</TableCell>
                                <TableCell sx={{ border: "2px solid #000" }}>{r.company}</TableCell>
                                <TableCell
                                  align="right"
                                  sx={{
                                    bgcolor: "#FFC107",
                                    fontWeight: "bold",
                                    border: "2px solid #000",
                                  }}
                                >
                                  {r.total}
                                </TableCell>
                              </TableRow>
                            );
                          })
                        ) : (
                          <TableRow>
                            <TableCell
                              colSpan={4}
                              sx={{
                                border: "2px solid #000",
                                textAlign: "center",
                                color: "#666",
                                fontStyle: "italic",
                              }}
                            >
                              No records for this date.
                            </TableCell>
                          </TableRow>
                        )}

                        {/* ✅ Total Row */}
                        {companyRows.length > 0 && (
                          <TableRow sx={{ bgcolor: "#666" }}>
                            <TableCell
                              colSpan={3}
                              align="right"
                              sx={{
                                color: "#fff",
                                fontWeight: "bold",
                                border: "2px solid #000",
                                fontSize: 15,
                              }}
                            >
                              Total
                            </TableCell>
                            <TableCell
                              align="right"
                              sx={{
                                color: "#fff",
                                fontWeight: "bold",
                                bgcolor: "#333",
                                border: "2px solid #000",
                                fontSize: 15,
                              }}
                            >
                              {companyRows.reduce((s, r) => s + r.total, 0)}
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>

                    </Table>
                  </TableContainer>
                </Paper>

                <Box display="flex" justifyContent="center" sx={{ mt: 1 }}>
                  <Button
                    variant="contained"
                    sx={{ bgcolor: '#FFC107', color: '#000' }}
                    onClick={handleExportCompanies}
                  >
                    Export Companies to Excel
                  </Button>


                </Box>

              </Box>
              
            </Box>
