ok, see this header code, and alosve that i upload privuse, part one one and second part, ok read all code carefully and 
  and create header code, ok, carefull, wihotu cahing my priviuse code and logic, as it is ok 
            <div className="topbar" role="banner">
              <div className="wu-brand" aria-hidden={false}>
                <div className="wu-logo">WU</div>
                <div className="title-block">
                  <h1>Western Union — Trend Analysis</h1>
                  <p style={{ margin: 0, fontSize: 13 }}>
                    {regionDisplayLabel(selectedRegion)} {selectedLocation && selectedLocation !== "All locations" ? "— " + selectedLocation : ""}
                  </p>
                </div>
              </div>
              <button
  className="btn-ghost"
  onClick={() => { window.location.href = 'analysis_table.html'; }}
  disabled={loading}
>
  Open table page
</button>

              <div className="header-actions" role="region" aria-label="controls">
                <div className="control">
                  <label className="small" htmlFor="fromDate">From</label>
                  <input id="fromDate" ref={fromRef} className="date-input" type="text" placeholder="YYYY-MM-DD" />
                </div>

                <div className="control">
                  <label className="small" htmlFor="toDate">To</label>
                  <input id="toDate" ref={toRef} className="date-input" type="text" placeholder="YYYY-MM-DD" />
                </div>

                <button className="btn-primary" onClick={runForRange} disabled={loading}>Run</button>
                <button className="btn-ghost" onClick={loadLatest} disabled={loading}>Load latest</button>
              </div>
            </div>
