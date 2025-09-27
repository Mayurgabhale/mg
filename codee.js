<Grid item xs={12} md={4}>
            <FormControl fullWidth size="small">
              <InputLabel id="override-start-label">Start swipe</InputLabel>
              <Select
                labelId="override-start-label"
                label="Start swipe"
                value={overrideStartIndex == null ? "" : overrideStartIndex}
                onChange={(e) => {
                  const val = e.target.value === "" ? null : Number(e.target.value);
                  setOverrideStartIndex(val);
                  if (val !== null && selectedSwipes[val] && selectedSwipes[val].Date) {
                    setOverrideDate(selectedSwipes[val].Date);
                  }
                }}
              >
                <MenuItem value=""><em>None</em></MenuItem>
                {swipesAll.map((s, idx) => {
                  const timeLabel = s.LocaleMessageTime ? new Date(s.LocaleMessageTime).toLocaleString() : s.Swipe_Time;
                  return (
                    <MenuItem key={`start-${idx}`} value={idx}>
                      {s.Date} — {timeLabel} {s.Door ? `— ${s.Door}` : ""}
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>
          </Grid>
