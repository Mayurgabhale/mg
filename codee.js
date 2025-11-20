(() => {
  const md = modalDetails?.aggregated_rows?.[0]
          || modalDetails?.raw_swipes?.[0]
          || {};

  console.log("Row Data:", md);

  const BACKEND = "http://localhost:8002";

  const correctId =
    md?.ObjectID ||
    md?.person_uid ||
    md?.EmployeeID ||
    md?.GUID;

  if (!correctId) {
    console.error("No valid ID for image");
    return <div className="modal-image-placeholder">No image ID</div>;
  }

  const imgSrc = `${BACKEND}/employee/${correctId}/image`;

  console.log("Final Image URL:", imgSrc);

  return (
    <img
      className="modal-image"
      src={imgSrc}
      alt="Employee image"
      onLoad={() => console.log("✅ Image loaded:", imgSrc)}
      onError={(e) => {
        console.error("❌ Image failed:", imgSrc);
        e.target.src = "/no-image.png"; // your fallback
      }}
      style={{
        width: "150px",
        height: "150px",
        objectFit: "cover",
        borderRadius: "50%"
      }}
    />
  );
})()