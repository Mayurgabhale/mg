return (
  <>
    <Header />

    <Box sx={{ pt: 1, pb: 4, background: "rgba(0,0,0,0.6)" }}>
      <Container
        maxWidth="xl"
        sx={{
          px: { xs: 1.5, sm: 2, md: 3, lg: 4 },
          width: "100%",
        }}
      >
        {/* ===== Back button + title ===== */}
        <Box
          display="flex"
          flexWrap="wrap"
          alignItems="center"
          justifyContent="space-between"
          mb={2}
          sx={{ gap: 1 }}
        >
          <Button
            size="small"
            onClick={() => navigate(-1)}
            sx={{
              color: "#FFC107",
              fontSize: { xs: "0.8rem", sm: "0.9rem" },
            }}
          >
            ← Back to Overview
          </Button>

          <Typography
            variant="h6"
            sx={{
              color: "#FFC107",
              fontSize: { xs: "1rem", sm: "1.2rem" },
              textAlign: { xs: "center", sm: "left" },
            }}
          >
            Floor Details
          </Typography>

          {/* Optional Last Update */}
          {/* <Typography variant="body2" sx={{ color: "#FFC107" }}>
            Last updated: {lastUpdate}
          </Typography> */}
        </Box>

        {/* ===== Search Bar ===== */}
        <Box
          display="flex"
          flexWrap="wrap"
          gap={2}
          alignItems="center"
          justifyContent="flex-start"
          mb={3}
        >
          <TextField
            size="small"
            placeholder="Search floor / emp…"
            value={search}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{
              flex: { xs: "1 1 100%", sm: "1 1 250px" },
              "& .MuiInputBase-input": { color: "#FFC107" },
              "& .MuiOutlinedInput-root fieldset": {
                borderColor: "#FFC107",
              },
            }}
          />
        </Box>

        {/* ===== Floor Cards Grid ===== */}
        <Box
          display="grid"
          gridTemplateColumns={{
            xs: "1fr",         // mobile
            sm: "1fr 1fr",     // tablet
            lg: "1fr 1fr 1fr", // desktop
          }}
          gap={2}
        >
          {displayed.map(([floor, emps]) => (
            <Paper
              key={floor}
              sx={{
                border: "2px solid #FFC107",
                p: { xs: 1.5, sm: 2 },
                background: "rgba(0,0,0,0.4)",
              }}
            >
              {/* Header row */}
              <Box
                display="flex"
                alignItems="center"
                justifyContent="space-between"
                flexWrap="wrap"
                mb={1}
              >
                <Typography
                  variant="subtitle1"
                  fontWeight={600}
                  sx={{
                    color: "#FFC107",
                    fontSize: { xs: "0.95rem", sm: "1rem" },
                  }}
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
                    fontSize: { xs: "0.7rem", sm: "0.8rem" },
                    "&:hover": { bgcolor: "#FFD54F" },
                  }}
                >
                  Export
                </Button>
              </Box>

              {/* Table container — scrolls horizontally on small screens */}
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
                            fontSize: { xs: "0.7rem", sm: "0.8rem" },
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
                        {[
                          r.EmployeeID,
                          r.ObjectName1,
                          formatApiDateTime(r.LocaleMessageTime),
                          r.PersonnelType,
                          r.CompanyName,
                          r.Direction,
                          r.CardNumber,
                          r.Door,
                        ].map((val, j) => (
                          <TableCell
                            key={j}
                            sx={{
                              color: "#fff",
                              border: "1px solid #FFC107",
                              fontSize: { xs: "0.7rem", sm: "0.8rem" },
                              whiteSpace: "nowrap",
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

              <Button
                size="small"
                onClick={() =>
                  setExpandedFloor((f) => (f === floor ? null : floor))
                }
                sx={{
                  color: "#FFC107",
                  fontSize: { xs: "0.75rem", sm: "0.8rem" },
                  mt: 0.5,
                }}
              >
                {expandedFloor === floor ? "Hide" : "See more…"}
              </Button>
            </Paper>
          ))}
        </Box>

        {/* ===== Expanded Table ===== */}
        {expandedFloor && (
          <Box sx={{ mt: 4 }}>
            <Typography
              variant="h6"
              sx={{
                color: "#FFC107",
                fontSize: { xs: "1rem", sm: "1.2rem" },
                mb: 1,
              }}
            >
              {expandedFloor} — All Entries
            </Typography>

            <DataTable
              columns={[{ field: "SrNo", headerName: "Sr No" }, ...columns]}
              rows={(floorMap[expandedFloor] || []).map((r, i) => ({
                ...r,
                LocaleMessageTime: formatApiDateTime(r.LocaleMessageTime),
                SrNo: i + 1,
              }))}
            />
          </Box>
        )}
      </Container>
    </Box>

    <Footer />
  </>
);