npm install @import { Player } from "@lottiefiles/react-lottie-player";

export default function LoadingOverlay() {
  return (
    <div style={overlayStyle}>
      <Player
        autoplay
        loop
        src="https://lottie.host/2f8b6c6e-bb9a-4cc9-9b29-2e79a3cc1884/1F5iALqUxl.json"
        style={{ height: "160px", width: "160px" }}
      />
      <p style={overlayText}>Loading, please wait...</p>
    </div>
  );
}

const overlayStyle = {
  position: "fixed",
  inset: 0,
  background: "rgba(255,255,255,0.8)",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  backdropFilter: "blur(4px)",
  zIndex: 9999,
};

const overlayText = {
  marginTop: "16px",
  fontSize: "18px",
  color: "#1e293b",
};