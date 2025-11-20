(() => {
  const md = modalDetails?.aggregated_rows?.[0] 
          || modalDetails?.raw_swipes?.[0] 
          || {};

  console.log("IMAGE ROW DATA:", md);

  const correctId = md?.ObjectID || md?.person_uid || md?.EmployeeID;

  let imgPath = correctId
    ? `http://localhost:8002/employee/${correctId}/image`
    : null;

  console.log("FINAL IMAGE URL:", imgPath);

  if (!imgPath) {
    return <div className="modal-image-placeholder">No image ID found</div>;
  }

  return (
    <img
      className="modal-image"
      src={imgPath}
      alt="Employee"
      onLoad={() => console.log("✅ Image Loaded:", imgPath)}
      onError={() => console.error("❌ Image Failed:", imgPath)}
    />
  );
})()