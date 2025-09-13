import React from "react";
import logo from "@/assets/MCB-Logo.png";

const spinnerStyle: React.CSSProperties = {
  animation: "spin 1.2s linear infinite"
};

const LoadingSpinner: React.FC = () => (
  <div
    style={{
      position: "fixed",
      zIndex: 9999,
      top: 0,
      left: 0,
      width: "100vw",
      height: "100vh",
      background: "rgba(20, 20, 30, 0.65)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexDirection: "column",
      transition: "background 0.3s"
    }}
  >
    <div style={{ position: "relative", width: 120, height: 120 }}>
      <img
        src={logo}
        alt="Loading..."
        style={{
          maxWidth: 64,
          maxHeight: 64,
          width: "auto",
          height: "auto",
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          zIndex: 2,
          filter: "drop-shadow(0 0 8px #fff8)",
          objectFit: "contain"
        }}
      />
      <span
        style={{
          ...spinnerStyle,
          position: "absolute",
          top: "50%",
          left: "50%",
          width: 100,
          height: 100,
          border: "8px solid #fff",
          borderTop: "8px solid #0077b6",
          borderRadius: "50%",
          transform: "translate(-50%, -50%)",
          zIndex: 1,
          boxShadow: "0 0 24px #0077b6aa"
        }}
      />
    </div>
    <div
      style={{
        marginTop: 32,
        color: "#fff",
        fontWeight: 600,
        fontSize: 20,
        letterSpacing: 1,
        textShadow: "0 2px 8px #000a"
      }}
    >
      Loading...
    </div>
    <style>
      {`
        @keyframes spin {
          0% { transform: translate(-50%, -50%) rotate(0deg);}
          100% { transform: translate(-50%, -50%) rotate(360deg);}
        }
      `}
    </style>
  </div>
);

export default LoadingSpinner;