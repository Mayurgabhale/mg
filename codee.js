<div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginTop:8 }}>
  <div style={{ fontSize:13 }}>
    {`Showing ${detailsOffset + 1} - ${Math.min(detailsOffset + paginatedRows.length, detailsTotal || filteredAll.length)} of ${detailsTotal || filteredAll.length}`}
  </div>

  <div style={{ display:'flex', gap:8 }}>
    <button
      className="small-button"
      onClick={() => {
        // compute previous offset
        const newOffset = Math.max(0, detailsOffset - detailsLimit);
        // update offset and request that page from server
        setDetailsOffset(newOffset);
        fetchDetails({ offset: newOffset, limit: detailsLimit });
      }}
      disabled={detailsOffset <= 0}
    >
      Prev
    </button>

    <button
      className="small-button"
      onClick={() => {
        const newOffset = detailsOffset + detailsLimit;
        // only request next page if server says there are more rows (detailsTotal)
        if ((detailsTotal || 0) > newOffset) {
          setDetailsOffset(newOffset);
          fetchDetails({ offset: newOffset, limit: detailsLimit });
        }
      }}
      // Next enabled only if server reports more rows beyond this page
      disabled={ (detailsTotal || 0) <= detailsOffset + detailsLimit }
    >
      Next
    </button>
  </div>
</div>