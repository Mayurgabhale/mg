import { LocalizationProvider, DateTimePicker } from '@mui/x-date-pickers';
import { AdapterLuxon } from '@mui/x-date-pickers/AdapterLuxon';
import { TextField, Button, Select, MenuItem, Box } from '@mui/material';
import { DateTime } from 'luxon';

const RightControls = (
  <LocalizationProvider dateAdapter={AdapterLuxon}>
    <Box display="flex" alignItems="center" gap={2} flexWrap="wrap">
      <DateTimePicker
        label="Select Date & Time"
        value={localDT ? DateTime.fromISO(localDT) : null}
        onChange={(newValue) => {
          if (newValue) {
            // Store as ISO string without seconds, without timezone offset
            setLocalDT(newValue.toISO({ suppressSeconds: true, includeOffset: false }));
          } else {
            setLocalDT('');
          }
        }}
        maxDateTime={DateTime.now()} // prevent future selection
        renderInput={(params) => <TextField {...params} size="small" />}
      />

      <Button variant="contained" color="secondary" onClick={handleApplySnapshot}>
        Apply
      </Button>

      <Button
        variant="outlined"
        onClick={() => {
          setLocalDT('');
          if (onLive) onLive();
        }}
      >
        Live
      </Button>

      <Select
        size="small"
        value={currentPartition}
        displayEmpty
        onChange={(e) => handlePartitionChange(e.target.value)}
        sx={{ bgcolor: 'background.paper', minWidth: 150 }}
      >
        <MenuItem value="">— Select Partition —</MenuItem>
        {partitionList.map((p) => (
          <MenuItem key={p} value={p}>
            {displayNameMap[p] || p}
          </MenuItem>
        ))}
      </Select>
    </Box>
  </LocalizationProvider>
);