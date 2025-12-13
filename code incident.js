  const NO_GREEN_LOCATIONS = new Set([
          "quezon city",
          "lt.vilnius"
        ]);

        function isNoGreenLocation(row) {
          const z = String(row.Zone || '').toLowerCase();
          for (const loc of NO_GREEN_LOCATIONS) {
            if (z.includes(loc)) return true;
          }
          return false;
        }
..\
now below code is correct

                    // display date: prefer logical (backend date), then DateOnly, then Date
                    const displayDate = r.__logical_date || (r.DateOnly ? String(r.DateOnly).slice(0, 10) : (r.Date ? String(r.Date).slice(0, 10) : '-'));
                    const displayTime = r.Time || (r.__ts ? r.__ts.toTimeString().slice(0, 8) : '-');

                    // const cls = [];
                    // if (isDayStart) cls.push('row-day-start');
                    // if (flags[idx].outReturn) cls.push('row-out-return');
                    // const rowStyle = isDayStart ? { background: '#e6ffed' } : {};


                    // suppress green background for Quezon & Vilnius
                    const suppressGreen = isNoGreenLocation(r);

                    const cls = [];
                    if (isDayStart && !suppressGreen) cls.push('row-day-start');
                    if (flags[idx].outReturn) cls.push('row-out-return');

                    const rowStyle =
                      (isDayStart && !suppressGreen)
                        ? { background: '#e6ffed' }
                        : {};


                    let extraNote = "";
                    try {
                      const originalDate = r.Date ? String(r.Date).slice(0, 10) : null;
                      const logical = r.__logical_date || null;
                      if (originalDate && logical && originalDate !== logical) {
