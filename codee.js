
return (
            
        //   <div style={{ padding:12, background:'#fff', borderRadius:10, border: '2px solid #e6eefb' }}>
        //     <div style={{ display:'flex', gap:8, alignItems:'center', marginBottom:12 }}>
        //       <label style={{ fontSize:13 }}>Employee ID</label>
        //       <input type="text" value={detailsEmployeeId} onChange={e=>setDetailsEmployeeId(e.target.value)} style={{ padding:6, borderRadius:6 }} />
        //       <label style={{ fontSize:13 }}>From</label>
        //       <input type="date" value={detailsFromDate} onChange={e=>setDetailsFromDate(e.target.value)} style={{ padding:6, borderRadius:6 }} />
        //       <label style={{ fontSize:13 }}>To</label>
        //       <input type="date" value={detailsToDate} onChange={e=>setDetailsToDate(e.target.value)} style={{ padding:6, borderRadius:6 }} />
        //       <button className="btn-primary" onClick={() => { setDetailsOffset(0); fetchDetails({ employeeId: detailsEmployeeId, fromDate: detailsFromDate, toDate: detailsToDate, offset:0 }); }}>Search</button>
        //       <button className="small-button" onClick={() => { setDetailsEmployeeId(''); setDetailsFromDate(''); setDetailsToDate(''); setDetailsOffset(0); fetchDetails({ employeeId:'', fromDate:'', toDate:'', offset:0 }); }}>Reset</button>
        //       <button className="small-button" onClick={() => exportDetailsCSVClient()}>Export CSV</button>
        //       <button className="small-button" onClick={() => setView('dashboard')}>Back</button>
        //     </div>

        //     <div style={{ maxHeight:520, overflow:'auto', border:'2px solid #e6eefb', padding:8 }}>
        //       <table className="compact-table" style={{ width:'100%', borderCollapse:'collapse' }}>
        //         <thead>
        //           <tr>
        //             <th className="srcol">Sr. No</th>
        //             <th>EmployeeID</th>
        //             <th>Name</th>
        //             <th>Date</th>
        //             <th>Time</th>
        //             <th>Card</th>
        //             <th>Direction</th>
        //             <th>Door</th>
        //             <th>Alert Type</th>
        //             <th>Location</th>
        //           </tr>
        //           {/* FILTER ROW */}
        //           <tr>
        //             <th className="srcol"><input className="filter-input" placeholder="—" disabled/></th>
        //             <th><input className="filter-input" placeholder="Filter ID" value={columnFilters.employeeId} onChange={e=>setFilter('employeeId', e.target.value)} /></th>
        //             <th><input className="filter-input" placeholder="Filter Name" value={columnFilters.name} onChange={e=>setFilter('name', e.target.value)} /></th>
        //             <th><input className="filter-input" placeholder="YYYY-MM-DD" value={columnFilters.date} onChange={e=>setFilter('date', e.target.value)} /></th>
        //             <th><input className="filter-input" placeholder="HH:MM:SS" value={columnFilters.time} onChange={e=>setFilter('time', e.target.value)} /></th>
        //             <th><input className="filter-input" placeholder="Filter Card" value={columnFilters.card} onChange={e=>setFilter('card', e.target.value)} /></th>
        //             <th><input className="filter-input" placeholder="In/Out" value={columnFilters.direction} onChange={e=>setFilter('direction', e.target.value)} /></th>
        //             <th><input className="filter-input" placeholder="Filter Door" value={columnFilters.door} onChange={e=>setFilter('door', e.target.value)} /></th>
        //             <th><input className="filter-input" placeholder="Filter Alert" value={columnFilters.alert} onChange={e=>setFilter('alert', e.target.value)} /></th>
        //             <th><input className="filter-input" placeholder="Filter Location" value={columnFilters.location} onChange={e=>setFilter('location', e.target.value)} /></th>
        //           </tr>
        //         </thead>
        //         <tbody>
        //           {detailsLoading && <tr><td colSpan="10" className="muted">Loading…</td></tr>}
        //           {!detailsLoading && paginatedRows.length===0 && <tr><td colSpan="10" className="muted">No rows</td></tr>}
        //           {!detailsLoading && paginatedRows.map((r,i)=>(
        //             <tr key={i}>
        //               <td style={{ padding:6, textAlign:'center' }}>{start + i + 1}</td>
        //               <td style={{ padding:6, textAlign:'center' }}>{r.EmployeeID || r.person_uid || '-'}</td>
        //               <td style={{ padding:6 }} className="col-name">{r.EmployeeName || '-'}</td>
        //               <td style={{ padding:6, textAlign:'center' }}>{r.Date || r.DateOnly || '-'}</td>
        //               <td style={{ padding:6, textAlign:'center' }}>{r.Time || '-'}</td>
        //               <td style={{ padding:6, textAlign:'center' }}>{r.CardNumber || '-'}</td>
        //               <td style={{ padding:6, textAlign:'center' }}>{r.Direction || '-'}</td>
        //               <td style={{ padding:6 }} className="col-door">{r.DoorName || '-'}</td>
        //               <td style={{ padding:6, textAlign:'center' }}>{r.Rejection_Type || r.RejectionType || '-'}</td>
        //               <td style={{ padding:6, textAlign:'center' }}>{r.Location || r.PartitionName2 || '-'}</td>
        //             </tr>
        //           ))}
        //         </tbody>
        //       </table>
        //     </div>

        //     <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginTop:8 }}>
        //       <div style={{ fontSize:13 }}>{`Showing ${start+1} - ${Math.min(start + paginatedRows.length, filteredAll.length)} of ${filteredAll.length}`}</div>
        //       <div style={{ display:'flex', gap:8 }}>
        //         <button className="small-button" onClick={() => { const no = Math.max(0, detailsOffset - detailsLimit); setDetailsOffset(no); }} disabled={detailsOffset <= 0}>Prev</button>
        //         <button className="small-button" onClick={() => { const no = detailsOffset + detailsLimit; if (no < filteredAll.length) { setDetailsOffset(no); } }} disabled={detailsOffset + detailsLimit >= filteredAll.length}>Next</button>
        //         <select value={detailsLimit} onChange={e=>{ const l = Number(e.target.value||200); setDetailsLimit(l); setDetailsOffset(0); }}>
        //           <option value={50}>50</option>
        //           <option value={100}>100</option>
        //           <option value={200}>200</option>
        //           <option value={500}>500</option>
        //           <option value={1000}>500</option>
        //         </select>
        //       </div>
        //     </div>
        //   </div>
        
         <div style={{ padding:12, background:'#fff', borderRadius:10, border: '2px solid #e6eefb' }}>
        <div style={{ display:'flex', gap:8, alignItems:'center', marginBottom:12 }}>
          <label style={{ fontSize:13 }}>Employee ID</label>
          <input type="text" value={detailsEmployeeId} onChange={e=>setDetailsEmployeeId(e.target.value)} style={{ padding:6, borderRadius:6 }} />
          <label style={{ fontSize:13 }}>From</label>
          <input type="date" value={detailsFromDate} onChange={e=>setDetailsFromDate(e.target.value)} style={{ padding:6, borderRadius:6 }} />
          <label style={{ fontSize:13 }}>To</label>
          <input type="date" value={detailsToDate} onChange={e=>setDetailsToDate(e.target.value)} style={{ padding:6, borderRadius:6 }} />
          <button className="btn-primary" onClick={() => { setDetailsOffset(0); fetchDetails({ employeeId: detailsEmployeeId, fromDate: detailsFromDate, toDate: detailsToDate, offset:0 }); }}>Search</button>
          <button className="small-button" onClick={() => { setDetailsEmployeeId(''); setDetailsFromDate(''); setDetailsToDate(''); setDetailsOffset(0); fetchDetails({ employeeId:'', fromDate:'', toDate:'', offset:0 }); }}>Reset</button>
          <button className="small-button" onClick={() => exportDetailsCSVClient()}>Export CSV</button>
          <button className="small-button" onClick={() => setView('dashboard')}>Back</button>
        </div>

        <div style={{ maxHeight:520, overflow:'auto', border:'2px solid #e6eefb', padding:8 }}>
          <table className="compact-table" style={{ width:'100%', borderCollapse:'collapse' }}>
            <thead>
              <tr>
                <th className="srcol">Sr. No</th>
                <th>EmployeeID</th>
                <th>Name</th>
                <th>Date</th>
                <th>Time</th>
                <th>Card</th>
                <th>Direction</th>
                <th>Door</th>
                <th>Alert Type</th>
                <th>Location</th>
              </tr>

              {/* FILTER ROW */}
              <tr>
                <th className="srcol"><input className="filter-input" placeholder="—" disabled/></th>
                <th><input className="filter-input" placeholder="Filter ID" value={columnFilters.employeeId} onChange={e=>setFilter('employeeId', e.target.value)} /></th>
                <th><input className="filter-input" placeholder="Filter Name" value={columnFilters.name} onChange={e=>setFilter('name', e.target.value)} /></th>
                <th><input className="filter-input" placeholder="YYYY-MM-DD" value={columnFilters.date} onChange={e=>setFilter('date', e.target.value)} /></th>
                <th><input className="filter-input" placeholder="HH:MM:SS" value={columnFilters.time} onChange={e=>setFilter('time', e.target.value)} /></th>
                <th><input className="filter-input" placeholder="Filter Card" value={columnFilters.card} onChange={e=>setFilter('card', e.target.value)} /></th>
                <th><input className="filter-input" placeholder="In/Out" value={columnFilters.direction} onChange={e=>setFilter('direction', e.target.value)} /></th>
                <th><input className="filter-input" placeholder="Filter Door" value={columnFilters.door} onChange={e=>setFilter('door', e.target.value)} /></th>
                <th><input className="filter-input" placeholder="Filter Alert" value={columnFilters.alert} onChange={e=>setFilter('alert', e.target.value)} /></th>
                <th><input className="filter-input" placeholder="Filter Location" value={columnFilters.location} onChange={e=>setFilter('location', e.target.value)} /></th>
              </tr>
            </thead>

            <tbody>
              {detailsLoading && <tr><td colSpan="10" className="muted">Loading…</td></tr>}
              {!detailsLoading && paginatedRows.length===0 && <tr><td colSpan="10" className="muted">No rows</td></tr>}

              {!detailsLoading && paginatedRows.map((r,i)=>(
                <tr key={i}>
                  <td style={{ padding:6, textAlign:'center' }}>{start + i + 1}</td>
                  <td style={{ padding:6, textAlign:'center' }}>{r.EmployeeID || r.person_uid || '-'}</td>
                  <td style={{ padding:6 }} className="col-name">{r.EmployeeName || '-'}</td>
                  <td style={{ padding:6, textAlign:'center' }}>{r.Date || r.DateOnly || '-'}</td>
                  <td style={{ padding:6, textAlign:'center' }}>{r.Time || '-'}</td>
                  <td style={{ padding:6, textAlign:'center' }}>{r.CardNumber || '-'}</td>
                  <td style={{ padding:6, textAlign:'center' }}>{r.Direction || '-'}</td>
                  <td style={{ padding:6 }} className="col-door">{r.DoorName || '-'}</td>
                  <td style={{ padding:6, textAlign:'center' }}>{r.Rejection_Type || r.RejectionType || '-'}</td>
                  <td style={{ padding:6, textAlign:'center' }}>{r.Location || r.PartitionName2 || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginTop:8 }}>
          <div style={{ fontSize:13 }}>{`Showing ${start+1} - ${Math.min(start + paginatedRows.length, filteredAll.length)} of ${filteredAll.length}`}</div>
          
          <div style={{ display:'flex', gap:8 }}>
            <button className="small-button"
              onClick={() => {
                const no = Math.max(0, detailsOffset - detailsLimit);
                setDetailsOffset(no);
              }}
              disabled={detailsOffset <= 0}
            >
              Prev
            </button>

            <button className="small-button"
              onClick={() => {
                const no = detailsOffset + detailsLimit;
                if (no < filteredAll.length) {
                  setDetailsOffset(no);
                }
              }}
              disabled={detailsOffset + detailsLimit >= filteredAll.length}
            >
              Next
            </button>

            <select
              value={detailsLimit}
              onChange={e=>{
                const l = Number(e.target.value||200);
                setDetailsLimit(l);
                setDetailsOffset(0);
              }}
            >
              <option value={50}>50</option>
              <option value={100}>100</option>
              <option value={200}>200</option>
              <option value={500}>500</option>
              <option value={1000}>1000</option>
            </select>
          </div>
        </div>
      </div>
        );
      };
