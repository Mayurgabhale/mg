function ErrorBanner({ status }) {
  if (status === 'open') return null;

  let message = '';
  if (status === 'connecting') {
    message = 'Connecting to live data...';
  } else if (status === 'error') {
    message = '⚠️ Live data connection lost. Retrying...';
  }

  return (
    <div style={{
      background: status === 'error' ? '#b00020' : '#444',
      color: '#fff',
      padding: '8px 16px',
      borderLeft: status === 'error' ? '4px solid #ff9800' : '4px solid #2196f3',
      marginBottom: '8px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    }}>
      <span>{message}</span>
      {status === 'error' && (
        <button
          className="btn btn-sm btn-outline-light"
          onClick={() => window.location.reload()}
        >
          Retry
        </button>
      )}
    </div>
  );
}




<Container fluid className="mt-2">
  {timeTravelMode && (
    <div style={{ background: '#434d44', color: '#FFF', padding: '8px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderLeft: '4px solid rgb(0, 255, 21)', marginBottom: 8 }}>
      <div>
        Viewing snapshot: <strong>{new Date(timeTravelTimestamp).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}</strong>
      </div>
      <div>
        <button className="btn btn-sm btn-outline-warning" onClick={clearTimeTravel} disabled={timeTravelLoading}>Return to Live</button>
      </div>
    </div>
  )}

  {/* 👇 NEW ERROR UI */}
  <ErrorBanner status={connectionStatus} />

  <Suspense fallback={<div style={{ color: '#FFC72C' }}>Loading page…</div>}>
    <Routes>
      <Route path="/" element={
        <DashboardHome
          summaryData={liveData.summary}
          detailsData={liveData.details}
          floorData={liveData.floorBreakdown}
          zoneBreakdown={liveData.zoneBreakdown}
          personnelBreakdown={liveData.personnelBreakdown}
          totalVisitedToday={liveData.totalVisitedToday}
          personnelSummary={liveData.personnelSummary}
          visitedToday={liveData.visitedToday}
          ertStatus={liveData.ertStatus}
        />
      }/>
      <Route path="/details" element={<ZoneDetailsPage detailsData={liveData.details} />} />
      <Route path="/ert" element={<ErtPage ertStatus={liveData.ertStatus} />} />
    </Routes>
  </Suspense>
</Container>