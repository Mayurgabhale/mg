<DatePicker
  label="Select date"
  value={pickedDate}
  onChange={d => { setPickedDate(d); setShowDetails(false); }}
  renderInput={params => <TextField fullWidth {...params} sx={datePickerSx} />}
  maxDate={subDays(new Date(), 1)}
/>