import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { fetchAchievements } from "../../services/userService";
import { ACHIEVEMENT_TRACKS, TIER_COLORS } from "../../lib/achievementsConfig";

const TIER_META = {
  bronze:  { label: "BRONZE",  emoji: "🥉", bg: "rgba(180,83,9,0.2)",   border: "rgba(180,83,9,0.5)" },
  gold:    { label: "GOLD",    emoji: "🥇", bg: "rgba(234,179,8,0.2)",  border: "rgba(234,179,8,0.5)" },
  diamond: { label: "DIAMOND", emoji: "💎", bg: "rgba(6,182,212,0.2)",  border: "rgba(6,182,212,0.5)" },
  heroic:  { label: "HEROIC",  emoji: "👑", bg: "rgba(239,68,68,0.2)",  border: "rgba(239,68,68,0.5)" },
};
const TIER_NAMES = ["bronze", "gold", "diamond", "heroic"];

export default function AchievementsModal({ open, onClose, username, initialData }) {
  const [progressData, setProgressData] = useState(initialData || null);
  const [loading, setLoading] = useState(!initialData);

  useEffect(() => {
    if (initialData) { setProgressData(initialData); setLoading(false); return; }
    if (open && username && !progressData) {
      setLoading(true);
      fetchAchievements(username)
        .then(data => setProgressData(data))
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [open, username, initialData]);

  if (!open) return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <div style={{ position: "fixed", inset: 0, zIndex: 99999, display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem" }}>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
            style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.85)", backdropFilter: "blur(4px)" }}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.93, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.93, y: 24 }}
            transition={{ type: "spring", damping: 22, stiffness: 300 }}
            style={{
              position: "relative", zIndex: 1,
              width: "100%", maxWidth: "820px", maxHeight: "92vh",
              display: "flex", flexDirection: "column",
              borderRadius: "24px", overflow: "hidden",
              background: "linear-gradient(145deg, #0c0c18 0%, #10101e 100%)",
              border: "1px solid rgba(255,255,255,0.08)",
              boxShadow: "0 32px 80px rgba(0,0,0,0.8), inset 0 1px 0 rgba(255,255,255,0.07)",
              boxSizing: "border-box",
            }}
          >
            {/* Glow orbs inside modal */}
            <div style={{ position: "absolute", top: "-30%", left: "-10%", width: "350px", height: "350px", background: "radial-gradient(circle, rgba(139,92,246,0.18) 0%, transparent 65%)", borderRadius: "50%", pointerEvents: "none" }} />
            <div style={{ position: "absolute", bottom: "-20%", right: "-5%", width: "300px", height: "300px", background: "radial-gradient(circle, rgba(236,72,153,0.13) 0%, transparent 65%)", borderRadius: "50%", pointerEvents: "none" }} />

            {/* Header */}
            <div style={{ padding: "1.75rem 2rem 1.25rem", borderBottom: "1px solid rgba(255,255,255,0.06)", position: "relative", zIndex: 1, flexShrink: 0 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "0.4rem" }}>
                    <span style={{ fontSize: "1.8rem" }}>🏆</span>
                    <h2 style={{ margin: 0, fontSize: "1.5rem", fontWeight: 900, color: "#fff", letterSpacing: "-0.02em" }}>
                      Trophy Cabinet
                    </h2>
                  </div>
                  <p style={{ margin: 0, color: "rgba(255,255,255,0.4)", fontSize: "0.85rem" }}>
                    Track your journey and unlock legendary milestones
                  </p>
                </div>
                <button
                  onClick={onClose}
                  style={{
                    width: "36px", height: "36px", borderRadius: "50%",
                    background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)",
                    color: "rgba(255,255,255,0.7)", cursor: "pointer", fontSize: "1rem",
                    display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                  }}
                >✕</button>
              </div>

              {/* Tier legend */}
              <div style={{ display: "flex", gap: "0.6rem", marginTop: "1rem", flexWrap: "wrap" }}>
                {TIER_NAMES.map(tier => {
                  const m = TIER_META[tier];
                  const tc = TIER_COLORS[tier];
                  return (
                    <span key={tier} style={{
                      display: "inline-flex", alignItems: "center", gap: "4px",
                      fontSize: "0.68rem", fontWeight: 800, letterSpacing: "1.5px",
                      padding: "0.3rem 0.75rem", borderRadius: "100px",
                      background: m.bg, border: `1px solid ${m.border}`,
                      color: tc.color,
                    }}>
                      {m.emoji} {m.label}
                    </span>
                  );
                })}
              </div>
            </div>

            {/* Body */}
            <div className="hide-scrollbar" style={{ overflowY: "auto", padding: "1.5rem 2rem 2rem", flex: 1, position: "relative", zIndex: 1 }}>
              {loading || !progressData ? (
                <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                  {[1,2,3,4].map(i => <div key={i} className="shimmer" style={{ height: "110px", borderRadius: "16px", background: "rgba(255,255,255,0.03)" }} />)}
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                  {[...ACHIEVEMENT_TRACKS].sort((a, b) => {
                    const cA = progressData[a.id]?.count || 0;
                    const cB = progressData[b.id]?.count || 0;
                    const pA = Math.min(cA / a.milestones[a.milestones.length - 1], 1);
                    const pB = Math.min(cB / b.milestones[b.milestones.length - 1], 1);
                    return pB - pA;
                  }).map((track, trackIdx) => {
                    const data = progressData[track.id] || { count: 0 };
                    const currentCount = data.count || 0;
                    const maxTarget = track.milestones[track.milestones.length - 1];
                    const fillPercent = Math.min((currentCount / maxTarget) * 100, 100);
                    const isComplete = currentCount >= maxTarget;

                    // Current tier
                    let tierIdx = -1;
                    if (currentCount >= track.milestones[3]) tierIdx = 3;
                    else if (currentCount >= track.milestones[2]) tierIdx = 2;
                    else if (currentCount >= track.milestones[1]) tierIdx = 1;
                    else if (currentCount >= track.milestones[0]) tierIdx = 0;

                    const tierName = tierIdx >= 0 ? TIER_NAMES[tierIdx] : null;
                    const tc = tierName ? TIER_COLORS[tierName] : null;
                    const activeColor = tc?.color || "rgba(255,255,255,0.3)";
                    const activeGlow  = tc?.glow  || "rgba(255,255,255,0.1)";

                    return (
                      <motion.div
                        key={track.id}
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: trackIdx * 0.05, duration: 0.4 }}
                        style={{
                          borderRadius: "16px",
                          background: isComplete
                            ? "linear-gradient(135deg, rgba(239,68,68,0.08), rgba(234,179,8,0.06))"
                            : "rgba(255,255,255,0.025)",
                          border: isComplete
                            ? "1px solid rgba(239,68,68,0.25)"
                            : "1px solid rgba(255,255,255,0.06)",
                          padding: "1.25rem 1.5rem",
                          position: "relative",
                          overflow: "hidden",
                          transition: "border-color 0.3s",
                        }}
                      >
                        {/* Glow accent if completed */}
                        {isComplete && (
                          <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "2px", background: "linear-gradient(90deg, #ef4444, #eab308, #ef4444)", backgroundSize: "200% auto", animation: "gradientShift 3s linear infinite" }} />
                        )}

                        {/* Track header row */}
                        <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1.1rem" }}>
                          {/* Icon */}
                          <div style={{
                            fontSize: "1.75rem",
                            width: "52px", height: "52px", flexShrink: 0,
                            display: "flex", alignItems: "center", justifyContent: "center",
                            borderRadius: "14px",
                            background: tierName
                              ? `linear-gradient(135deg, ${TIER_META[tierName].bg}, rgba(255,255,255,0.03))`
                              : "rgba(255,255,255,0.04)",
                            border: tierName
                              ? `1px solid ${TIER_META[tierName].border}`
                              : "1px solid rgba(255,255,255,0.07)",
                            boxShadow: tierName ? `0 0 20px ${activeGlow}` : "none",
                          }}>
                            {track.icon}
                          </div>

                          {/* Title + desc */}
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "0.4rem", marginBottom: "0.25rem" }}>
                              <h3 style={{ margin: 0, fontSize: "1rem", fontWeight: 800, color: "#fff" }}>{track.title}</h3>
                              {tierName && (
                                <span style={{
                                  fontSize: "0.62rem", fontWeight: 900, letterSpacing: "1.5px",
                                  padding: "0.2rem 0.6rem", borderRadius: "100px",
                                  background: TIER_META[tierName].bg, border: `1px solid ${TIER_META[tierName].border}`,
                                  color: activeColor,
                                }}>
                                  {TIER_META[tierName].emoji} {TIER_META[tierName].label}
                                </span>
                              )}
                            </div>
                            <p style={{ margin: 0, fontSize: "0.78rem", color: "rgba(255,255,255,0.4)", lineHeight: 1.4 }}>{track.description}</p>
                          </div>

                          {/* Count */}
                          <div style={{ textAlign: "right", flexShrink: 0 }}>
                            <span style={{ fontSize: "1.8rem", fontWeight: 900, color: activeColor, textShadow: `0 0 20px ${activeGlow}`, lineHeight: 1 }}>
                              {currentCount}
                            </span>
                            <span style={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.3)" }}> / {maxTarget}</span>
                          </div>
                        </div>

                        {/* Progress bar */}
                        <div style={{ position: "relative", height: "8px", background: "rgba(255,255,255,0.06)", borderRadius: "100px", marginBottom: "1.5rem" }}>
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${fillPercent}%` }}
                            transition={{ duration: 1.2, ease: "easeOut", delay: trackIdx * 0.05 }}
                            style={{
                              position: "absolute", top: 0, left: 0, bottom: 0,
                              background: isComplete
                                ? "linear-gradient(90deg, #ef4444, #eab308)"
                                : `linear-gradient(90deg, rgba(255,255,255,0.15), ${activeColor})`,
                              borderRadius: "100px",
                              boxShadow: `0 0 12px ${activeGlow}`,
                            }}
                          />

                          {/* Milestone dots */}
                          {track.milestones.map((target, idx) => {
                            const pct = (target / maxTarget) * 100;
                            const unlocked = currentCount >= target;
                            const tName = TIER_NAMES[idx];
                            const tColor = TIER_COLORS[tName];
                            return (
                              <div
                                key={target}
                                title={unlocked ? `${TIER_META[tName].label} Unlocked!` : `${target - currentCount} more for ${TIER_META[tName].label}`}
                                style={{
                                  position: "absolute", top: "50%",
                                  left: `${pct}%`,
                                  transform: "translate(-50%, -50%)",
                                  width: unlocked ? "18px" : "12px",
                                  height: unlocked ? "18px" : "12px",
                                  borderRadius: "50%",
                                  background: unlocked ? tColor.color : "rgba(255,255,255,0.1)",
                                  border: unlocked ? "2px solid rgba(255,255,255,0.9)" : "2px solid rgba(255,255,255,0.15)",
                                  boxShadow: unlocked ? `0 0 10px ${tColor.glow}, 0 0 20px ${tColor.glow}` : "none",
                                  transition: "all 0.3s ease",
                                  cursor: "help", zIndex: unlocked ? 2 : 1,
                                }}
                              />
                            );
                          })}
                        </div>

                        {/* Milestone labels */}
                        <div style={{ position: "relative", height: "18px" }}>
                          {track.milestones.map((target, idx) => {
                            const pct = (target / maxTarget) * 100;
                            const unlocked = currentCount >= target;
                            const tName = TIER_NAMES[idx];
                            const tColor = TIER_COLORS[tName];
                            return (
                              <div
                                key={target}
                                style={{
                                  position: "absolute",
                                  left: `${pct}%`,
                                  transform: "translateX(-50%)",
                                  fontSize: "0.62rem", fontWeight: 700, letterSpacing: "0.5px",
                                  color: unlocked ? tColor.color : "rgba(255,255,255,0.2)",
                                  whiteSpace: "nowrap",
                                }}
                              >
                                {TIER_META[tName].emoji} {target}
                              </div>
                            );
                          })}
                        </div>

                      </motion.div>
                    );
                  })}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
}
