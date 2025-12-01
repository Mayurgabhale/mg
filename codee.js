<div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginTop:8 }}>
  <div style={{ fontSize:13 }}>
    {`Showing ${start+1} - ${Math.min(end, filteredAll.length)} of ${filteredAll.length}`}
  </div>

  <div style={{ display:'flex', gap:8 }}>
    {/* PREV */}
    <button
      className="small-button"
      onClick={() => {
        const newOffset = Math.max(0, detailsOffset - detailsLimit);
        setDetailsOffset(newOffset);
      }}
      disabled={detailsOffset <= 0}
    >
      Prev
    </button>

    {/* NEXT */}
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