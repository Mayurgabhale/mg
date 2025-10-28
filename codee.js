// ===== Loading overlay styles =====
const overlay = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100vw",
  height: "100vh",
  background: "rgba(255, 255, 255, 0.7)",
  zIndex: 9999,
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  flexDirection: "column",
  backdropFilter: "blur(3px)",
};

const loader = {
  width: "48px",
  height: "48px",
  border: "4px solid #3b82f6",
  borderTop: "4px solid transparent",
  borderRadius: "50%",
  animation: "spin 1s linear infinite",
};

// CSS keyframes for loader animation
const keyframes = `
@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}`;