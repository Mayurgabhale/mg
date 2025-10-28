import React from "react";

export default function PageLoader({ loading }) {
  if (!loading) return null;

  return (
    <div style={styles.overlay}>
      <span style={styles.loader}></span>
      <p style={styles.text}>Processing, please wait...</p>
      <style>{keyframes}</style>
    </div>
  );
}

const styles = {
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: "rgba(0,0,0,0.4)",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 9999,
    color: "#fff",
    fontSize: "16px",
    backdropFilter: "blur(4px)",
  },
  loader: {
    fontSize: "10px",
    width: "1em",
    height: "1em",
    borderRadius: "50%",
    position: "relative",
    textIndent: "-9999em",
    animation: "mulShdSpin 1.1s infinite ease",
    transform: "translateZ(0)",
  },
  text: {
    marginTop: "12px",
  },
};

// Keyframes as string since inline styles can’t define them directly
const keyframes = `
@keyframes mulShdSpin {
  0%, 100% {
    box-shadow: 0em -2.6em 0em 0em #ffffff,
      1.8em -1.8em 0 0em rgba(255,255,255, 0.2),
      2.5em 0em 0 0em rgba(255,255,255, 0.2),
      1.75em 1.75em 0 0em rgba(255,255,255, 0.2),
      0em 2.5em 0 0em rgba(255,255,255, 0.2),
      -1.8em 1.8em 0 0em rgba(255,255,255, 0.2),
      -2.6em 0em 0 0em rgba(255,255,255, 0.5),
      -1.8em -1.8em 0 0em rgba(255,255,255, 0.7);
  }
  12.5% {
    box-shadow: 0em -2.6em 0em 0em rgba(255,255,255, 0.7),
      1.8em -1.8em 0 0em #ffffff,
      2.5em 0em 0 0em rgba(255,255,255, 0.2),
      1.75em 1.75em 0 0em rgba(255,255,255, 0.2),
      0em 2.5em 0 0em rgba(255,255,255, 0.2),
      -1.8em 1.8em 0 0em rgba(255,255,255, 0.2),
      -2.6em 0em 0 0em rgba(255,255,255, 0.2),
      -1.8em -1.8em 0 0em rgba(255,255,255, 0.5);
  }
  25% {
    box-shadow: 0em -2.6em 0em 0em rgba(255,255,255, 0.5),
      1.8em -1.8em 0 0em rgba(255,255,255, 0.7),
      2.5em 0em 0 0em #ffffff,
      1.75em 1.75em 0 0em rgba(255,255,255, 0.2),
      0em 2.5em 0 0em rgba(255,255,255, 0.2),
      -1.8em 1.8em 0 0em rgba(255,255,255, 0.2),
      -2.6em 0em 0 0em rgba(255,255,255, 0.2),
      -1.8em -1.8em 0 0em rgba(255,255,255, 0.2);
  }
  37.5% {
    box-shadow: 0em -2.6em 0em 0em rgba(255,255,255, 0.2),
      1.8em -1.8em 0 0em rgba(255,255,255, 0.5),
      2.5em 0em 0 0em rgba(255,255,255, 0.7),
      1.75em 1.75em 0 0em #ffffff,
      0em 2.5em 0 0em rgba(255,255,255, 0.2),
      -1.8em 1.8em 0 0em rgba(255,255,255, 0.2),
      -2.6em 0em 0 0em rgba(255,255,255, 0.2),
      -1.8em -1.8em 0 0em rgba(255,255,255, 0.2);
  }
  50% {
    box-shadow: 0em -2.6em 0em 0em rgba(255,255,255, 0.2),
      1.8em -1.8em 0 0em rgba(255,255,255, 0.2),
      2.5em 0em 0 0em rgba(255,255,255, 0.5),
      1.75em 1.75em 0 0em rgba(255,255,255, 0.7),
      0em 2.5em 0 0em #ffffff,
      -1.8em 1.8em 0 0em rgba(255,255,255, 0.2),
      -2.6em 0em 0 0em rgba(255,255,255, 0.2),
      -1.8em -1.8em 0 0em rgba(255,255,255, 0.2);
  }
  62.5% {
    box-shadow: 0em -2.6em 0em 0em rgba(255,255,255, 0.2),
      1.8em -1.8em 0 0em rgba(255,255,255, 0.2),
      2.5em 0em 0 0em rgba(255,255,255, 0.2),
      1.75em 1.75em 0 0em rgba(255,255,255, 0.5),
      0em 2.5em 0 0em rgba(255,255,255, 0.7),
      -1.8em 1.8em 0 0em #ffffff,
      -2.6em 0em 0 0em rgba(255,255,255, 0.2),
      -1.8em -1.8em 0 0em rgba(255,255,255, 0.2);
  }
  75% {
    box-shadow: 0em -2.6em 0em 0em rgba(255,255,255, 0.2),
      1.8em -1.8em 0 0em rgba(255,255,255, 0.2),
      2.5em 0em 0 0em rgba(255,255,255, 0.2),
      1.75em 1.75em 0 0em rgba(255,255,255, 0.2),
      0em 2.5em 0 0em rgba(255,255,255, 0.5),
      -1.8em 1.8em 0 0em rgba(255,255,255, 0.7),
      -2.6em 0em 0 0em #ffffff,
      -1.8em -1.8em 0 0em rgba(255,255,255, 0.2);
  }
  87.5% {
    box-shadow: 0em -2.6em 0em 0em rgba(255,255,255, 0.2),
      1.8em -1.8em 0 0em rgba(255,255,255, 0.2),
      2.5em 0em 0 0em rgba(255,255,255, 0.2),
      1.75em 1.75em 0 0em rgba(255,255,255, 0.2),
      0em 2.5em 0 0em rgba(255,255,255, 0.2),
      -1.8em 1.8em 0 0em rgba(255,255,255, 0.5),
      -2.6em 0em 0 0em rgba(255,255,255, 0.7),
      -1.8em -1.8em 0 0em #ffffff;
  }
}
`;