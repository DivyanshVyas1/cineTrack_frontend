import { useState } from "react";
import { createPortal } from "react-dom";

export default function TrailerModal({ trailerKey, trailerName, children }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Trigger */}
      <span onClick={() => setOpen(true)} style={{ display: "inline-block", cursor: "pointer" }}>
        {children}
      </span>

      {/* Modal */}
      {open &&
        createPortal(
          <div
            style={{
              position: "fixed", inset: 0, zIndex: 99999,
              display: "flex", alignItems: "center", justifyContent: "center",
              padding: "1rem",
            }}
          >
            {/* Backdrop */}
            <div
              onClick={() => setOpen(false)}
              style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.92)", backdropFilter: "blur(8px)", cursor: "pointer" }}
            />

            {/* Video container */}
            <div
              style={{
                position: "relative", zIndex: 1,
                width: "100%", maxWidth: "960px",
                borderRadius: "16px", overflow: "hidden",
                boxShadow: "0 40px 100px rgba(0,0,0,0.9), 0 0 0 1px rgba(255,255,255,0.07)",
              }}
            >
              {/* Title bar */}
              <div style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                padding: "0.75rem 1rem",
                background: "rgba(12,12,20,0.95)",
                borderBottom: "1px solid rgba(255,255,255,0.06)",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <span style={{ fontSize: "1rem" }}>🎬</span>
                  <span style={{ fontSize: "0.88rem", fontWeight: 700, color: "#fff" }}>
                    {trailerName || "Official Trailer"}
                  </span>
                </div>
                <button
                  onClick={() => setOpen(false)}
                  style={{
                    background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.1)",
                    color: "#fff", borderRadius: "50%", width: "32px", height: "32px",
                    cursor: "pointer", fontSize: "0.9rem", display: "flex", alignItems: "center", justifyContent: "center",
                  }}
                >✕</button>
              </div>

              {/* 16:9 YouTube iframe */}
              <div style={{ position: "relative", paddingBottom: "56.25%", background: "#000" }}>
                <iframe
                  src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1&rel=0&modestbranding=1`}
                  title={trailerName || "Trailer"}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
                  allowFullScreen
                  style={{ position: "absolute", inset: 0, width: "100%", height: "100%", border: "none" }}
                />
              </div>
            </div>
          </div>,
          document.body
        )}
    </>
  );
}
