{loading && (
  <div style={overlayStyle}>
    <Player
      autoplay
      loop
      src="https://lottie.host/2f8b6c6e-bb9a-4cc9-9b29-2e79a3cc1884/1F5iALqUxl.json"
      style={{ height: "160px", width: "160px" }}
    />
    <p style={overlayText}>Loading, please wait...</p>
  </div>
)}