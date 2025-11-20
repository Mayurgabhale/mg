boht is using get image ok  

candidate=312458
http://localhost:8002/employee/312458/image
 ObjectID=2097186314
http://localhost:8002/employee/2097186314/image
INFO:root:get_personnel_info: found ObjectID=2097186314 Email=Lejemp.Abrea@wu.com for candidate=312458
INFO:root:Connected to ACVSCore on SRVWUPNQ0986V using SQL auth (region apac).
INFO:root:get_personnel_info: found ObjectID=2097186314 Email=Lejemp.Abrea@wu.com for candidate=312458
INFO:root:Connected to ACVSCore on SRVWUPNQ0986V using SQL auth (region apac).
INFO:root:get_personnel_info: found ObjectID=2097186314 Email=Lejemp.Abrea@wu.com for candidate=312458
INFO:root:Connected to ACVSCore on SRVWUPNQ0986V using SQL auth (region apac).

  read the belwo code carefully. dont make oher chagne i want only diplsy the image
  (() => {
  // prefer aggregated row but fall back to raw_swipes first row
  const md = (modalDetails && modalDetails.aggregated_rows && modalDetails.aggregated_rows[0])
            || (modalDetails && modalDetails.raw_swipes && modalDetails.raw_swipes[0])
            || {};
  // candidate image key names (common variants)
  const candidateImageKeys = ['imageUrl','image_url','ImageUrl','image','Image','img','imgUrl','ImagePath','Photo','PhotoUrl','EmployeePhoto','photo','photoUrl'];
  let imgPath = candidateImageKeys.map(k => (md && md[k]) ? md[k] : null).find(Boolean) || null;

  // build a prioritized list of identifier tokens to try (prefer ObjectID / GUID)
  const idCandidates = [];
  if (md && md.ObjectID) idCandidates.push(String(md.ObjectID));
  if (md && md.ObjectId) idCandidates.push(String(md.ObjectId));
  if (md && md.GUID) idCandidates.push(String(md.GUID));
  if (md && md.GUID0) idCandidates.push(String(md.GUID0));
  if (md && md.EmployeeID) idCandidates.push(String(md.EmployeeID));
  if (md && md.person_uid) idCandidates.push(String(md.person_uid));
  if (modalRow && modalRow.EmployeeID) idCandidates.push(String(modalRow.EmployeeID));
  if (modalRow && modalRow.person_uid) idCandidates.push(String(modalRow.person_uid));

  // Deduplicate preserving order
  const uniqIds = idCandidates.filter((v, i) => v && idCandidates.indexOf(v) === i);

  // If we didn't get an explicit image path, build one from the top id candidate
  if (!imgPath && uniqIds.length) {
    imgPath = `/employee/${encodeURIComponent(uniqIds[0])}/image`;
  }

  if (imgPath) {
    const imgSrc = resolveApiImageUrl(imgPath) || imgPath;
      console.log("Final Image URL:", imgSrc);
    return (
      <img
        className="modal-image"
        src={imgSrc}
        alt={sanitizeName(modalRow) || "Employee image"}
        onLoad={(e) => { try { console.info("employee image loaded:", e.target.src); } catch (err) {} }}
        onError={async (e) => {
          try {
            e.target.onerror = null;
            console.warn("image load failed for:", e.target.src);

            // Try a single cache-busted retry for the same URL, then try the API variants once each.
            const tryUrls = [];
            const original = e.target.src;
            tryUrls.push(original + (original.indexOf('?') === -1 ? '?cb=' + Date.now() : '&cb=' + Date.now()));

            // try both API variants for the top id candidates (constructed earlier as uniqIds)
            uniqIds.forEach(id => {
              if (!id) return;
              const a = resolveApiImageUrl(`/api/employees/${encodeURIComponent(id)}/image`);
              const b = resolveApiImageUrl(`/employee/${encodeURIComponent(id)}/image`);
              if (a && tryUrls.indexOf(a) === -1) tryUrls.push(a);
              if (b && tryUrls.indexOf(b) === -1) tryUrls.push(b);
            });

            // Try each URL (GET) until one returns image content-type and ok
            let found = null;
            for (const url of tryUrls) {
              try {
                // some servers block fetch for cross-origin images — guard with try/catch
                const getr = await fetch(url, { method: 'GET', cache: 'no-store' });
                if (getr && getr.ok) {
                  const ct = (getr.headers.get('content-type') || '').toLowerCase();
                  if (ct.startsWith('image')) { found = url; break; }
                }
              } catch (err) {
                // ignore fetch/CORS errors and continue to next candidate
              }
            }

            if (found) {
              e.target.src = found + (found.indexOf('?') === -1 ? ('?cb=' + Date.now()) : ('&cb=' + Date.now()));
              return;
            }

            // Final fallback: inline SVG placeholder
            const svg = '<svg xmlns="http://www.w3.org/2000/svg" width="160" height="160"><rect fill="#eef2f7" width="100%" height="100%"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#64748b" font-size="18">No image</text></svg>';
            e.target.src = 'data:image/svg+xml;utf8,' + encodeURIComponent(svg);
          } catch (err) {
            try { e.target.style.display = 'none'; } catch (err2) {}
            console.error("image fallback error", err);
          }
        }}
      />
    );
  } else {
    return <div className="modal-image-placeholder">No image</div>;
  }
})()


) : (
  <div className="-image-placeholder">
    <i className="bi bi-person-square"></i>
    <span>No image</span>
  </div>
)}
