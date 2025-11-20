(() => {
  const md = modalDetails?.aggregated_rows?.[0] || modalDetails?.raw_swipes?.[0] || {};
  console.log("Image row (md):", md, "modalRow:", modalRow);

  // Candidate direct image property names
  const candidateImageKeys = [
    'imageUrl','image_url','ImageUrl','image','Image','img','imgUrl',
    'ImagePath','Photo','PhotoUrl','EmployeePhoto','photo','photoUrl'
  ];

  // try direct image URL first
  let directImg = candidateImageKeys.map(k => md?.[k]).find(Boolean) || null;

  // build id candidates in priority order
  const idCandidates = [
    md?.ObjectID, md?.ObjectId, md?.GUID, md?.GUID0,
    md?.EmployeeID, md?.person_uid, modalRow?.EmployeeID, modalRow?.person_uid
  ].filter(Boolean).map(String);

  const uniqIds = [...new Set(idCandidates)];
  console.log("ID candidates:", uniqIds);

  // Backend base (use the real host/port your backend is served from)
  const BACKEND = "http://localhost:8002";

  // helper to make absolute URL
  const toAbs = (p) => (p && p.startsWith("http")) ? p : (p ? `${BACKEND}${p}` : null);

  // prioritized src list
  const tryList = [];

  if (directImg) tryList.push(toAbs(directImg));
  // prefer smallest index id first
  uniqIds.forEach(id => {
    tryList.push(toAbs(`/employee/${encodeURIComponent(id)}/image`));
    tryList.push(toAbs(`/api/employees/${encodeURIComponent(id)}/image`));
  });

  // final fallback placeholder data-uri
  const placeholder = 'data:image/svg+xml;utf8,' + encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="160" height="160"><rect fill="#eef2f7" width="100%" height="100%"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#64748b" font-size="18">No image</text></svg>'
  );

  // chosen src state (local var, not React state, but fine inside this immediate render)
  let chosen = null;

  // We'll try the list by setting the first as src and letting onError try cache-busted alternates.
  if (tryList.length > 0) {
    chosen = tryList[0];
  }

  console.log("Image try list:", tryList);

  if (!chosen) {
    return <div className="modal-image-placeholder">No image</div>;
  }

  return (
    <img
      className="modal-image"
      src={chosen}
      alt={sanitizeName(modalRow) || "Employee image"}
      onLoad={(e) => console.info("employee image loaded:", e.target.src)}
      onError={async (e) => {
        console.warn("image load failed for:", e.target.src);
        e.target.onerror = null;

        // try cache-busted current + remaining tryList candidates
        const original = e.target.src;
        const tryUrls = [ original + (original.indexOf('?') === -1 ? '?cb=' + Date.now() : '&cb=' + Date.now()) ];

        // add remaining candidates
        for (let i = 1; i < tryList.length; i++) tryUrls.push(tryList[i]);

        // attempt to find one that returns image (this may be blocked by CORS but we try)
        for (const url of tryUrls) {
          try {
            const res = await fetch(url, { method: 'GET', cache: 'no-store' });
            if (res && res.ok) {
              const ct = (res.headers.get('content-type') || '').toLowerCase();
              if (ct.startsWith('image')) {
                e.target.src = url + (url.indexOf('?') === -1 ? ('?cb=' + Date.now()) : ('&cb=' + Date.now()));
                return;
              }
            }
          } catch (err) {
            // likely CORS blocking fetch; continue to other urls
          }
        }

        // fallback
        e.target.src = placeholder;
      }}
      style={{ width: 150, height: 150, objectFit: 'cover', borderRadius: 6 }}
    />
  );
})()