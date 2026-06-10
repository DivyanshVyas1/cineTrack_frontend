import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import Avatar from "../ui/Avatar";
import { fetchProfileComparison } from "../../services/userService";
import html2canvas from "html2canvas";

const formatWatchTime = (minutes) => {
  if (!minutes || isNaN(minutes) || minutes === 0) return "0m";
  const m = Math.floor(minutes);
  const days = Math.floor(m / (24 * 60));
  const hours = Math.floor((m % (24 * 60)) / 60);
  if (days > 0) return `${days}d ${hours}h`;
  if (hours > 0) return `${hours}h ${m % 60}m`;
  return `${m % 60}m`;
};

const GenreIcon = ({ genre }) => {
  const g = genre.toLowerCase();
  if (g.includes("drama")) return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>;
  if (g.includes("action") || g.includes("adventure")) return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14.5 17.5L3 6l3-3 11.5 11.5L14.5 17.5z"/><path d="M13 19l6-6 2 2-6 6-2-2z"/></svg>;
  if (g.includes("crime")) return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>;
  if (g.includes("thriller")) return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="3"/></svg>;
  if (g.includes("comedy")) return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></svg>;
  if (g.includes("romance")) return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>;
  return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/></svg>;
};

function CompareModal({ open, onClose, username }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [sharing, setSharing] = useState(false);
  const cardRef = useRef(null);

  const handleShare = async () => {
    if (!cardRef.current || sharing) return;
    setSharing(true);
    try {
      // Temporarily hide the two buttons for a clean screenshot
      const btns = cardRef.current.querySelectorAll(".compare-ui-btn");
      btns.forEach(b => { b.style.opacity = "0"; });

      const canvas = await html2canvas(cardRef.current, {
        useCORS: true,
        allowTaint: true,
        scale: 2,
        backgroundColor: null,
        logging: false,
      });

      btns.forEach(b => { b.style.opacity = "1"; });

      canvas.toBlob(async (blob) => {
        const file = new File([blob], "cinetrack-compare.png", { type: "image/png" });
        if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
          await navigator.share({
            title: "CineTrack – Taste Compare",
            text: `Check out our taste comparison on CineTrack! 🎬`,
            files: [file],
          });
        } else {
          // Fallback: download the image
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = "cinetrack-compare.png";
          a.click();
          URL.revokeObjectURL(url);
          toast.success("Image saved! Share it on Instagram.");
        }
        setSharing(false);
      }, "image/png");
    } catch (err) {
      setSharing(false);
      if (err.name !== "AbortError") toast.error("Couldn't capture screenshot.");
    }
  };

  useEffect(() => {
    if (open && username) {
      setLoading(true);
      fetchProfileComparison(username)
        .then(setData)
        .catch(() => { toast.error("Failed to load comparison"); onClose(); })
        .finally(() => setLoading(false));
    } else {
      setData(null);
    }
  }, [open, username, onClose]);

  if (!open) return null;

  // Instagram story aspect ratio: 9:16
  // We compute card dimensions to fit the viewport with 9:16 ratio
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const padding = 16; // px on each side
  const maxCardW = 420;
  const maxCardH = vh - 32;

  // Fit 9:16 within available space
  let cardW = Math.min(vw - padding * 2, maxCardW);
  let cardH = cardW * (16 / 9);
  if (cardH > maxCardH) {
    cardH = maxCardH;
    cardW = cardH * (9 / 16);
  }

  const genreData = data
    ? (data.genreComparison || []).filter(g => g.viewerPercent >= 5 && g.targetPercent >= 5).slice(0, 4)
    : [];

  const maxPercent = genreData.length > 0
    ? Math.max(...genreData.flatMap(d => [d.viewerPercent, d.targetPercent]), 1)
    : 1;

  // Scale font sizes proportionally to card width (base: 360px)
  const scale = cardW / 360;
  const fs = (base) => `${(base * scale).toFixed(1)}px`;

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed", inset: 0, zIndex: 9999,
        background: "rgba(0,0,0,0.85)",
        display: "flex", alignItems: "center", justifyContent: "center",
      }}
    >
      <motion.div
        ref={cardRef}
        onClick={(e) => e.stopPropagation()}
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.92 }}
        style={{
          width: `${cardW}px`,
          height: `${cardH}px`,
          borderRadius: "20px",
          overflow: "hidden",
          position: "relative",
          flexShrink: 0,
          boxShadow: "0 30px 80px rgba(0,0,0,0.9), 0 0 0 1px rgba(255,255,255,0.05)",
          background: data?.headerBackgroundPoster
            ? `linear-gradient(180deg, rgba(8,8,12,0.92) 0%, rgba(5,5,8,0.97) 100%), url(${data.headerBackgroundPoster}) center/cover no-repeat`
            : "linear-gradient(160deg, #0d0d14 0%, #0a0a0f 50%, #0d0814 100%)",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Decorative glow blobs */}
        <div style={{ position: "absolute", top: "-15%", left: "-10%", width: "55%", height: "40%", background: "radial-gradient(circle, rgba(255,42,133,0.18) 0%, transparent 70%)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", top: "-15%", right: "-10%", width: "55%", height: "40%", background: "radial-gradient(circle, rgba(0,229,255,0.18) 0%, transparent 70%)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: "10%", left: "50%", transform: "translateX(-50%)", width: "60%", height: "30%", background: "radial-gradient(circle, rgba(120,80,255,0.1) 0%, transparent 70%)", pointerEvents: "none" }} />

        {/* Share button – top left */}
        <button
          className="compare-ui-btn"
          onClick={handleShare}
          disabled={sharing || loading || !data}
          style={{ position: "absolute", top: "10px", left: "10px", zIndex: 20, background: "rgba(0,0,0,0.5)", border: "none", borderRadius: "50%", width: "28px", height: "28px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", opacity: sharing ? 0.5 : 1, transition: "opacity 0.2s" }}
          title="Share"
        >
          {sharing ? (
            <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }} style={{ width: "14px", height: "14px", border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "#fff", borderRadius: "50%" }} />
          ) : (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
              <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
            </svg>
          )}
        </button>

        {/* Close button – top right */}
        <button className="compare-ui-btn" onClick={onClose} style={{ position: "absolute", top: "10px", right: "10px", zIndex: 20, background: "rgba(0,0,0,0.5)", border: "none", borderRadius: "50%", width: "28px", height: "28px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: "1rem" }}>&times;</button>

        {loading || !data ? (
          <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", color: "rgba(255,255,255,0.4)", gap: "1rem" }}>
            <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }} style={{ width: "36px", height: "36px", border: "3px solid rgba(255,255,255,0.1)", borderTopColor: "#ff2a85", borderRadius: "50%" }} />
            <span style={{ fontSize: fs(12) }}>Analyzing...</span>
          </div>
        ) : (
          <div style={{ flex: 1, display: "flex", flexDirection: "column", padding: `${16 * scale}px`, gap: `${10 * scale}px`, position: "relative", zIndex: 1, boxSizing: "border-box", overflow: "hidden" }}>

            {/* ── TOP BRAND ── */}
            <div style={{ textAlign: "center", fontSize: fs(9), fontWeight: "900", letterSpacing: "3px", textTransform: "uppercase", color: "rgba(255,255,255,0.25)" }}>
              CineTrack
            </div>

            {/* ── VS HEADER ── */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: `${8 * scale}px` }}>
              {/* Viewer */}
              <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: `${4 * scale}px` }}>
                <div style={{ width: `${52 * scale}px`, height: `${52 * scale}px`, borderRadius: "50%", border: `${2 * scale}px solid #ff2a85`, boxShadow: "0 0 20px rgba(255,42,133,0.5)", overflow: "hidden", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Avatar src={data.viewer.avatar} name={data.viewer.name} size={52 * scale} style={{ margin: 0, width: "100%", height: "100%", flexShrink: 0 }} />
                </div>
                <div style={{ fontSize: fs(12), fontWeight: "800", color: "#ff2a85", textAlign: "center", wordBreak: "break-word", lineHeight: 1.2, textShadow: "0 0 12px rgba(255,42,133,0.6)", width: "100%" }}>{data.viewer.name}</div>
              </div>

              {/* VS Center */}
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: `${4 * scale}px`, flexShrink: 0 }}>
                <div style={{ fontSize: fs(28), fontWeight: "900", fontStyle: "italic", color: "#fff", lineHeight: 1, textShadow: "0 0 30px rgba(255,255,255,0.3)" }}>VS</div>
                {data.tasteMatchPercent !== null && (
                  <span className="taste-match-hero-pill" style={{ fontSize: fs(10), padding: `${3 * scale}px ${9 * scale}px`, whiteSpace: "nowrap" }}>
                    {data.tasteMatchPercent}% Taste Match
                  </span>
                )}
              </div>

              {/* Target */}
              <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: `${4 * scale}px` }}>
                <div style={{ width: `${52 * scale}px`, height: `${52 * scale}px`, borderRadius: "50%", border: `${2 * scale}px solid #00e5ff`, boxShadow: "0 0 20px rgba(0,229,255,0.5)", overflow: "hidden", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Avatar src={data.target.avatar} name={data.target.name} size={52 * scale} style={{ margin: 0, width: "100%", height: "100%", flexShrink: 0 }} />
                </div>
                <div style={{ fontSize: fs(12), fontWeight: "800", color: "#00e5ff", textAlign: "center", wordBreak: "break-word", lineHeight: 1.2, textShadow: "0 0 12px rgba(0,229,255,0.6)", width: "100%" }}>{data.target.name}</div>
              </div>
            </div>

            {/* ── DIVIDER ── */}
            <div style={{ height: "1px", background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)" }} />

            {/* ── GENRE BREAKDOWN ── */}
            {genreData.length > 0 && (
              <div style={{ display: "flex", flexDirection: "column" }}>
                <div style={{ fontSize: fs(8), color: "rgba(255,255,255,0.3)", textTransform: "uppercase", letterSpacing: "2px", textAlign: "center", fontWeight: "900", marginBottom: `${12 * scale}px` }}>
                  Genre Breakdown
                </div>
                <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-around", gap: `${4 * scale}px`, height: `${cardH * 0.17}px` }}>
                  {genreData.map((item, i) => {
                    const barMaxH = cardH * 0.11;
                    const vH = (item.viewerPercent / maxPercent) * barMaxH;
                    const tH = (item.targetPercent / maxPercent) * barMaxH;
                    return (
                      <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center" }}>
                        <div style={{ display: "flex", alignItems: "flex-end", gap: `${3 * scale}px`, marginBottom: `${4 * scale}px` }}>
                          <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                            <span style={{ fontSize: fs(7), color: "#ff2a85", fontWeight: "700", marginBottom: `${2 * scale}px` }}>{item.viewerPercent}%</span>
                            <motion.div initial={{ height: 0 }} animate={{ height: `${vH}px` }} transition={{ duration: 1, delay: i * 0.1 }} style={{ width: `${10 * scale}px`, background: "linear-gradient(to top, #ff2a85, #ff6b9e)", borderRadius: "2px 2px 0 0", boxShadow: "0 0 8px rgba(255,42,133,0.6)" }} />
                          </div>
                          <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                            <span style={{ fontSize: fs(7), color: "#00e5ff", fontWeight: "700", marginBottom: `${2 * scale}px` }}>{item.targetPercent}%</span>
                            <motion.div initial={{ height: 0 }} animate={{ height: `${tH}px` }} transition={{ duration: 1, delay: i * 0.1 }} style={{ width: `${10 * scale}px`, background: "linear-gradient(to top, #00e5ff, #6be6ff)", borderRadius: "2px 2px 0 0", boxShadow: "0 0 8px rgba(0,229,255,0.6)" }} />
                          </div>
                        </div>
                        <div style={{ color: "rgba(255,255,255,0.4)", marginBottom: `${2 * scale}px` }}><GenreIcon genre={item.genre} /></div>
                        <div style={{ fontSize: fs(7.5), color: "rgba(255,255,255,0.45)", textAlign: "center", wordBreak: "break-word", lineHeight: 1.2 }}>{item.genre}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* ── STATS ── */}
            <div style={{ display: "flex", flexDirection: "column", gap: `${6 * scale}px` }}>
              {[
                { label: "Watch Time", a: formatWatchTime(data.viewer.watchTime), b: formatWatchTime(data.target.watchTime), va: data.viewer.watchTime, vb: data.target.watchTime },
                { label: "Avg Rating", a: `${data.viewer.avgRating || 0} ★`, b: `${data.target.avgRating || 0} ★`, va: data.viewer.avgRating || 0, vb: data.target.avgRating || 0 },
              ].map(({ label, a, b, va, vb }) => {
                const total = va + vb || 1;
                const pctA = (va / total) * 100;
                return (
                  <div key={label} style={{ width: "100%", boxSizing: "border-box" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: `${3 * scale}px` }}>
                      <span style={{ color: "#ff2a85", fontSize: fs(11), fontWeight: "700" }}>{a}</span>
                      <span style={{ color: "rgba(255,255,255,0.35)", fontSize: fs(8), textTransform: "uppercase", letterSpacing: "1px", fontWeight: "600" }}>{label}</span>
                      <span style={{ color: "#00e5ff", fontSize: fs(11), fontWeight: "700" }}>{b}</span>
                    </div>
                    <div style={{ height: `${4 * scale}px`, borderRadius: "999px", background: "rgba(255,255,255,0.06)", overflow: "hidden", display: "flex" }}>
                      <motion.div initial={{ width: 0 }} animate={{ width: `${pctA}%` }} transition={{ duration: 1.2, ease: "easeOut" }} style={{ background: "linear-gradient(90deg, #ff2a85, #ff6baa)", height: "100%", flexShrink: 0 }} />
                      <motion.div initial={{ width: 0 }} animate={{ width: `${100 - pctA}%` }} transition={{ duration: 1.2, ease: "easeOut" }} style={{ background: "linear-gradient(90deg, rgba(0,229,255,0.6), #00e5ff)", height: "100%", flexShrink: 0 }} />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* ── DIVIDER ── */}
            <div style={{ height: "1px", background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)" }} />

            {/* ── CHARACTER PICKS ── */}
            <div style={{ display: "flex", flexDirection: "column", gap: `${5 * scale}px` }}>
              <div style={{ fontSize: fs(8), color: "rgba(255,255,255,0.3)", textTransform: "uppercase", letterSpacing: "2px", textAlign: "center", fontWeight: "900" }}>
                Character Picks
              </div>
              {/* Favs */}
              <div style={{ display: "flex", gap: `${5 * scale}px` }}>
                <div style={{ flex: 1, minWidth: 0, padding: `${5 * scale}px ${7 * scale}px`, background: "rgba(74,222,128,0.06)", border: "1px solid rgba(74,222,128,0.2)", borderRadius: `${8 * scale}px`, boxSizing: "border-box" }}>
                  <div style={{ fontSize: fs(8), color: "rgba(255,255,255,0.3)", marginBottom: `${2 * scale}px` }}>{data.viewer.name}</div>
                  <div style={{ fontSize: fs(10), color: "#4ade80", fontWeight: "700", wordBreak: "break-word", lineHeight: 1.2 }}>
                    ⭐ {data.viewer.characters?.favorite?.slice(0, 3).map(c => c.name).join(", ") || "—"}
                  </div>
                </div>
                <div style={{ flex: 1, minWidth: 0, padding: `${5 * scale}px ${7 * scale}px`, background: "rgba(74,222,128,0.06)", border: "1px solid rgba(74,222,128,0.2)", borderRadius: `${8 * scale}px`, boxSizing: "border-box" }}>
                  <div style={{ fontSize: fs(8), color: "rgba(255,255,255,0.3)", marginBottom: `${2 * scale}px` }}>{data.target.name}</div>
                  <div style={{ fontSize: fs(10), color: "#4ade80", fontWeight: "700", wordBreak: "break-word", lineHeight: 1.2 }}>
                    ⭐ {data.target.characters?.favorite?.slice(0, 3).map(c => c.name).join(", ") || "—"}
                  </div>
                </div>
              </div>
              {/* Hated */}
              <div style={{ display: "flex", gap: `${5 * scale}px` }}>
                <div style={{ flex: 1, minWidth: 0, padding: `${5 * scale}px ${7 * scale}px`, background: "rgba(248,113,113,0.06)", border: "1px solid rgba(248,113,113,0.2)", borderRadius: `${8 * scale}px`, boxSizing: "border-box" }}>
                  <div style={{ fontSize: fs(10), color: "#f87171", fontWeight: "700", wordBreak: "break-word", lineHeight: 1.2 }}>
                    💔 {data.viewer.characters?.hated?.slice(0, 3).map(c => c.name).join(", ") || "—"}
                  </div>
                </div>
                <div style={{ flex: 1, minWidth: 0, padding: `${5 * scale}px ${7 * scale}px`, background: "rgba(248,113,113,0.06)", border: "1px solid rgba(248,113,113,0.2)", borderRadius: `${8 * scale}px`, boxSizing: "border-box" }}>
                  <div style={{ fontSize: fs(10), color: "#f87171", fontWeight: "700", wordBreak: "break-word", lineHeight: 1.2 }}>
                    💔 {data.target.characters?.hated?.slice(0, 3).map(c => c.name).join(", ") || "—"}
                  </div>
                </div>
              </div>
            </div>

            {/* ── COMMON PICKS ── */}
            <>
              <div style={{ height: "1px", background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)" }} />
              <div style={{ flex: 1, minHeight: 0, display: "flex", flexDirection: "column", gap: `${5 * scale}px` }}>
                <div style={{ fontSize: fs(8), color: "rgba(255,255,255,0.3)", textTransform: "uppercase", letterSpacing: "2px", textAlign: "center", fontWeight: "900" }}>
                  Common Picks
                </div>

                {!(data.commonPicks?.length > 0) && !(data.commonFavoriteCharacters?.length > 0) && !(data.commonHatedCharacters?.length > 0) ? (
                  <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", color: "rgba(255,255,255,0.2)", fontSize: fs(9), fontStyle: "italic", letterSpacing: "0.5px" }}>
                    No common picks found yet
                  </div>
                ) : (
                  <>
                    {/* Common Characters */}
                    {(data.commonFavoriteCharacters?.length > 0 || data.commonHatedCharacters?.length > 0) && (
                      <div style={{ display: "flex", gap: `${4 * scale}px`, flexWrap: "wrap", justifyContent: "center" }}>
                        {data.commonFavoriteCharacters?.slice(0, 2).map(c => (
                          <span key={c.name} style={{ padding: `${2 * scale}px ${7 * scale}px`, borderRadius: "999px", background: "rgba(74,222,128,0.12)", border: "1px solid rgba(74,222,128,0.3)", color: "#4ade80", fontSize: fs(9), fontWeight: "700", whiteSpace: "nowrap" }}>
                            ⭐ {c.name}
                          </span>
                        ))}
                        {data.commonHatedCharacters?.slice(0, 2).map(c => (
                          <span key={c.name} style={{ padding: `${2 * scale}px ${7 * scale}px`, borderRadius: "999px", background: "rgba(248,113,113,0.12)", border: "1px solid rgba(248,113,113,0.3)", color: "#f87171", fontSize: fs(9), fontWeight: "700", whiteSpace: "nowrap" }}>
                            💔 {c.name}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Common Movie Posters */}
                    {data.commonPicks?.length > 0 && (
                      <div style={{ flex: 1, minHeight: 0, display: "flex", gap: `${8 * scale}px`, justifyContent: "center", alignItems: "center" }}>
                        {data.commonPicks.slice(0, 4).map(p => (
                          <div key={p.title} style={{ height: "100%", aspectRatio: "2/3", maxWidth: "23%", minWidth: 0, display: "flex", justifyContent: "center" }}>
                            <img src={p.poster} alt={p.title} title={p.title} style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: `${6 * scale}px`, boxShadow: "0 6px 20px rgba(0,0,0,0.7)" }} />
                          </div>
                        ))}
                      </div>
                    )}
                  </>
                )}
              </div>
            </>

          </div>
        )}
      </motion.div>
    </div>
  );
}

export default CompareModal;
