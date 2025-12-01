<div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginTop:8 }}>
  <div style={{ fontSize:13 }}>
    {`Showing ${detailsOffset + 1} - ${Math.min(detailsOffset + paginatedRows.length, filteredAll.length)} of ${filteredAll.length}`}
  </div>

  <div style={{ display:'flex', gap:8 }}>
    <button
      className="small-button"
      onClick={() => {
        const newOffset = Math.max(0, detailsOffset - detailsLimit);
        setDetailsOffset(newOffset);
      }}
      disabled={detailsOffset === 0}
    >
      Prev
    </button>

    <button
      className="small-button"
      onClick={() => {
        const newOffset = detailsOffset + detailsLimit;
        if (newOffset < filteredAll.length) {
          setDetailsOffset(newOffset);
        }
      }}
      disabled={detailsOffset + detailsLimit >= filteredAll.length}
    >
      Next
    </button>
  </div>
</div>