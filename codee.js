<Box display="flex" flexWrap="wrap" width="100%" sx={{ px: { xs: 1, sm: 2, md: 3 } }}>
  {displayed.map(([floor, emps]) => (
    <Box
      key={floor}
      sx={{
        width: { xs: "100%", sm: "50%", md: "33.33%", lg: "25%" },
        p: 1
      }}
    >
      <Paper sx={{ border: "2px solid #FFC107", p: 2, background: "rgba(0,0,0,0.4)" }}>
        <Box
          display="flex"
          flexDirection={{ xs: "column", sm: "row" }}
          alignItems={{ xs: "flex-start", sm: "center" }}
          justifyContent="space-between"
          mb={1}
          gap={1}
        >
          <Typography variant="subtitle1" fontWeight={600} sx={{ color: "#FFC107" }}>
            {floor} (Total {emps.length})
          </Typography>
          <Button
            size="small"
            variant="contained"
            onClick={() => handleExportFloor(floor, emps)}
            sx={{ bgcolor: "#FFC107", color: "#000", textTransform: "none" }}
          >
            Export
          </Button>
        </Box>

        <TableContainer component={Paper} variant="outlined" sx={{ mb: 1, background: "rgba(0,0,0,0.4)", overflowX: "auto" }}>
          <Table size="small">
            <TableHead>
              <TableRow sx={{ bgcolor: "#000" }}>
                {["Emp ID","Name","Swipe Time","Type","Company","Direction","Card","Door"].map(h => (
                  <TableCell key={h} sx={{ color: "#FFC107", border: "1px solid #FFC107", fontWeight: "bold" }}>
                    {h}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {emps.slice(0,10).map((r,i) => (
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