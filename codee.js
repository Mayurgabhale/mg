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