{/* City */}
<Grid item xs={12} md={3}>
  <FormControl fullWidth size="small">
    <InputLabel 
      id="city-select-label" 
      sx={{ color: "#333" }} // label color
    >
      City / Partition
    </InputLabel>
    <Select
      labelId="city-select-label"
      value={city}
      onChange={(e) => setCity(e.target.value)}
      renderValue={(v) => v || ""}
      sx={{
        borderRadius: 1,
        backgroundColor: "#f9f9f9", // box background
        color: "#222", // text color
        "& .MuiSelect-icon": { color: "#222" }, // dropdown arrow
        "& .MuiOutlinedInput-notchedOutline": {
          borderColor: "#ccc", // border color
        },
        "&:hover .MuiOutlinedInput-notchedOutline": {
          borderColor: "#1976d2", // hover border
        },
        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
          borderColor: "#1976d2", // focus border
        },
      }}
    >
      <MenuItem value="">
        <em>All</em>
      </MenuItem>
      {citiesForRegion?.length > 0 ? (
        citiesForRegion.map((c, idx) => (
          <MenuItem key={idx} value={c}>
            {c}
          </MenuItem>
        ))
      ) : (
        <MenuItem disabled value="">
          No predefined cities (type manually below)
        </MenuItem>
      )}
    </Select>
  </FormControl>

  <TextField
    fullWidth
    size="small"
    placeholder="Or type manually"
    value={city}
    onChange={(e) => setCity(e.target.value)}
    sx={{
      mt: 1,
      borderRadius: 1,
      "& .MuiInputBase-input": {
        color: "#222", // input text
        backgroundColor: "#f9f9f9", // input background
      },
      "& .MuiOutlinedInput-notchedOutline": {
        borderColor: "#ccc", // border color
      },
      "&:hover .MuiOutlinedInput-notchedOutline": {
        borderColor: "#1976d2",
      },
      "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
        borderColor: "#1976d2",
      },
    }}
  />
</Grid>