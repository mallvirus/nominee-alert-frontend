import React from "react";

const KeepMyAssetLogo = () => {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        cursor: "pointer",
        userSelect: "none",
        gap: 10,
        padding: "6px 10px",
        transition: "transform 0.25s ease",
        borderRadius: 8,
      }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = "translateY(-3px)";
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = "translateY(0)";
      }}
      aria-label="KeepMyAsset Logo"
    >
      {/* Icon size 64x64 */}
      <svg
        width="64"
        height="64"
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ flexShrink: 0 }}
        aria-hidden="true"
      >
        <path
          d="M32 2L12 12v18c0 14 8 22 20 22s20-8 20-22V12L32 2z"
          fill="#00B761"
          stroke="#004D40"
          strokeWidth="2"
          strokeLinejoin="round"
        />
        <path
          d="M24 30l8 8 12-16"
          stroke="#004D40"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </svg>

      {/* Text with light green shadow */}
      <span
        style={{
          fontFamily: "'Poppins', sans-serif",
          fontWeight: 700,
          fontSize: "1.9rem",
          userSelect: "none",
          whiteSpace: "nowrap",
          padding: "8px 16px",
          borderRadius: 24,
          boxShadow: "0 2px 8px rgba(0, 183, 97, 0.3)", // light green shadow
          backgroundColor: "#f0f9f4",
          color: "#121212",
          display: "inline-block",
          lineHeight: 1,
        }}
      >
        KeepMy
        <span style={{ color: "#00B761" }}>Asset</span>
      </span>
    </div>
  );
};

export default KeepMyAssetLogo;