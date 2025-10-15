<Box sx={{ width: { xs: '100%', sm: 200 } }}> {/* responsive width */}
  <LocalizationProvider dateAdapter={AdapterDateFns}>
    <DatePicker
      label="Select date"
      value={pickedDate}
      onChange={d => { setPickedDate(d); setShowDetails(false); }}
      renderInput={params => <TextField fullWidth {...params} sx={datePickerSx} />}
      maxDate={subDays(new Date())}
    />
  </LocalizationProvider>

  <Button
    variant="outlined"
    sx={{ mt: 2, ml: { xs: 0, sm: 2 }, width: { xs: '100%', sm: 'auto' }, borderColor: '#FFC107', color: '#FFC107' }}
    onClick={handleRefresh} // your existing refresh logic
  >
    Refresh History
  </Button>
</Box>