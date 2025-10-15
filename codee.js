ok. correct,
  but i want to add column  each column line 
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
