import { Player } from "@lottiefiles/react-lottie-player";


const overlayStyle = {
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: "rgba(255, 255, 255, 0.85)",
  zIndex: 9999,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  transition: "opacity 0.3s ease",
  backdropFilter: "blur(4px)",
};

const overlayText = {
  marginTop: "16px",
  fontSize: "18px",
  color: "#1e293b",
  fontWeight: 500,
};