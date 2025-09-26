<Grid item xs={12} md={4}>
  <TextField
    fullWidth
    label="Search Employee ID"
    value={searchEmployeeId}
    onChange={(e) => setSearchEmployeeId(e.target.value)}
    size="small"
    helperText="Type an ID and click Run"
    sx={{
      backgroundColor: "white",
      borderRadius: 1,
      "& .MuiInputBase-input": {
        color: "black", // Text color
      },
      "& .MuiInputLabel-root": {
        color: "black", // Label color
      },
      "& .MuiFormHelperText-root": {
        color: "black", // Helper text color
      },
    }}
  />
</Grid>