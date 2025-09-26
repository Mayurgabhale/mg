<Grid item xs={12} md={3}>
  <TextField
    label="Start Date"
    type="date"
    fullWidth
    size="small"
    value={startDate}
    onChange={(e) => setStartDate(e.target.value)}
    inputRef={startDateRef}
    InputLabelProps={{ shrink: true }}
    InputProps={{
      sx: { color: "#000" }, // text color inside input
      endAdornment: (
        <InputAdornment position="end">
          <IconButton
            size="small"
            onClick={() => openNativeDatePicker(startDateRef)}
            sx={{ color: "#e6c200" }}
          >
            <DateRangeIcon />
          </IconButton>
        </InputAdornment>
      ),
    }}
    sx={{
      bgcolor: "#fff",
      borderRadius: 1,
      color: "#000",
      "& .MuiInputLabel-root": {
        color: "#1976d2", // <-- label color
        fontWeight: "bold",
      },
      "& .Mui-focused .MuiInputLabel-root": {
        color: "#e6c200", // <-- label color when focused
      },
    }}
  />
</Grid>