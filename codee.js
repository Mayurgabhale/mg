<div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginTop:8 }}>
  <div style={{ fontSize:13 }}>
    {`Showing ${start+1} - ${Math.min(start + paginatedRows.length, filteredAll.length)} of ${filteredAll.length}`}
  </div>

  <div style={{ display:'flex', gap:8 }}>
    <button
      className="small-button"
      onClick={() => {
        const no = Math.max(0, detailsOffset - detailsLimit);
        setDetailsOffset(no);
      }}
      disabled={detailsOffset <= 0}
    >
      Prev
    </button>

    <button
      className="small-button"
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
  </div>
</div>