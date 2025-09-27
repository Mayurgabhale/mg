
<TextField
  fullWidth
  size="small"
  label="Reason (optional)"
  value={overrideReason}
  onChange={(e) => setOverrideReason(e.target.value)}
  sx={{
    "& .MuiInputBase-input": {
      color: "black",   // text color
    },
    "& .MuiInputLabel-root": {
      color: "black",   // label color
    },
    "& .MuiOutlinedInput-notchedOutline": {
      borderColor: "black", // border color
    },
  }}
/>
....
          <Grid item xs={12}>
            <TextField
              fullWidth
              size="small"
              label="Reason (optional)"
              value={overrideReason}
              onChange={(e) => setOverrideReason(e.target.value)}
              sx={{color:'black'}}
            />
          </Grid>
