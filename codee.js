{/* ✅ Popup Modal */}
<Dialog
  open={Boolean(expanded)}
  onClose={() => setExpanded(null)}
  maxWidth="lg"
  fullWidth
  sx={{
    "& .MuiDialog-paper": {
      width: "100%",
      maxWidth: { xs: "95%", sm: "90%", md: "85%", lg: "80%" }, // responsive width
    },
  }}
>
  <DialogTitle
    sx={{
      fontWeight: "bold",
      textAlign: "center",
      fontSize: { xs: "1rem", sm: "1.2rem", md: "1.4rem" },
    }}
  >
    {expanded} — All Entries
  </DialogTitle>

  <DialogContent
    sx={{
      overflowX: "auto",
      p: { xs: 1, sm: 2 },
    }}
  >
    {expanded && (
      <TableContainer
        component={Paper}
        variant="outlined"
        sx={{
          border: "2px solid #FFC107",
          borderRadius: 2,
          overflowX: "auto",
          boxShadow: "0px 2px 6px rgba(0,0,0,0.1)",
        }}
      >
        <Table
          size="small"
          stickyHeader
          sx={{
            borderCollapse: "collapse",
            width: "100%",
            "& th, & td": {
              borderRight: "1px solid #ddd",
              borderBottom: "1px solid #ddd",
              textAlign: "left",
              px: { xs: 0.5, sm: 1 },
              py: { xs: 0.6, sm: 0.8 },
              fontSize: { xs: "0.75rem", sm: "0.85rem", md: "0.9rem" },
              whiteSpace: "nowrap",
            },
            "& th:last-child, & td:last-child": {
              borderRight: "none",
            },
            "& thead th": {
              backgroundColor: "#FFF3CD",
              fontWeight: "bold",
            },
          }}
        >
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
                <TableCell key={h}>{h}</TableCell>
              ))}
            </TableRow>
          </TableHead>

          <TableBody>
            {floorMap[expanded]?.map((r, i) => (
              <TableRow
                key={i}
                sx={{
                  "&:hover": {
                    backgroundColor: "#FFF9E6",
                  },
                }}
              >
                <TableCell>{i + 1}</TableCell>
                <TableCell>{r.EmployeeID}</TableCell>
                <TableCell>{r.ObjectName1}</TableCell>
                <TableCell>{formatApiTime12(r.LocaleMessageTime)}</TableCell>
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

  <DialogActions
    sx={{
      justifyContent: "center",
      py: { xs: 1, sm: 1.5 },
    }}
  >
    <Button
      variant="contained"
      color="warning"
      onClick={() => setExpanded(null)}
      sx={{
        px: { xs: 2, sm: 3 },
        py: { xs: 0.7, sm: 0.9 },
        fontSize: { xs: "0.8rem", sm: "0.9rem" },
        borderRadius: 2,
        textTransform: "none",
      }}
    >
      Close
    </Button>
  </DialogActions>
</Dialog>