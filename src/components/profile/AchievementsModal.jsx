import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { fetchAchievements } from "../../services/userService";
import { ACHIEVEMENT_TRACKS, TIER_COLORS } from "../../lib/achievementsConfig";

export default function AchievementsModal({ open, onClose, username, initialData }) {
  const [progressData, setProgressData] = useState(initialData || null);
  const [loading, setLoading] = useState(!initialData);

  useEffect(() => {
    if (initialData) {
      setProgressData(initialData);
      setLoading(false);
      return;
    }
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
        <div
          style={{
            position: "fixed", inset: 0, zIndex: 99999,
            display: "flex", alignItems: "center", justifyContent: "center",
            padding: "1rem"
          }}
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="modal-backdrop"
            onClick={onClose}
            style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.8)" }}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="modal-content glass-card"
            style={{
              position: "relative",
              width: "100%", maxWidth: "800px", maxHeight: "90vh",
              padding: "1.5rem", display: "flex", flexDirection: "column",
              borderRadius: "20px", overflow: "hidden", zIndex: 1,
              background: "rgba(12, 12, 18, 0.9)",
              backdropFilter: "blur(25px)",
              WebkitBackdropFilter: "blur(25px)",
              border: "1px solid rgba(255,255,255,0.08)",
              boxShadow: "0 20px 40px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.1)",
              boxSizing: "border-box"
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
              <div>
                <h2 style={{ margin: 0, display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "1.5rem" }}>
                  🏆 Trophy Cabinet
                </h2>
                <p style={{ margin: "0.5rem 0 0", color: "var(--text-secondary)", fontSize: "0.9rem" }}>
                  Track your journey and unlock legendary milestones.
                </p>
              </div>
              <button onClick={onClose} className="btn-ghost" style={{ padding: "0.5rem", borderRadius: "50%", background: "rgba(255,255,255,0.05)" }}>
                ✕
              </button>
            </div>

            <div className="hide-scrollbar" style={{ overflowY: "auto", paddingRight: "0.5rem", flex: 1 }}>
              {loading || !progressData ? (
                <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
                  {[1, 2, 3, 4].map(i => (
                    <div key={i} className="shimmer" style={{ height: "100px", borderRadius: "12px", background: "rgba(255,255,255,0.03)" }} />
                  ))}
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "2.5rem", padding: "10px 20px 1rem 20px", margin: "0 -20px" }}>
                  {ACHIEVEMENT_TRACKS.map(track => {
                    const data = progressData[track.id] || { count: 0 };
                    const currentCount = data.count || 0;
                    const maxTarget = track.milestones[track.milestones.length - 1]; // ALWAYS use the config's max
                    const fillPercent = Math.min((currentCount / maxTarget) * 100, 100);

                    // Determine the current highest tier
                    let activeColor = TIER_COLORS.bronze.color;
                    let activeGlow = TIER_COLORS.bronze.glow;
                    if (currentCount >= track.milestones[3]) { activeColor = TIER_COLORS.heroic.color; activeGlow = TIER_COLORS.heroic.glow; }
                    else if (currentCount >= track.milestones[2]) { activeColor = TIER_COLORS.diamond.color; activeGlow = TIER_COLORS.diamond.glow; }
                    else if (currentCount >= track.milestones[1]) { activeColor = TIER_COLORS.gold.color; activeGlow = TIER_COLORS.gold.glow; }
                    else if (currentCount >= track.milestones[0]) { activeColor = TIER_COLORS.silver.color; activeGlow = TIER_COLORS.silver.glow; }
                    else { activeColor = "var(--primary-color)"; activeGlow = "rgba(255,255,255,0.2)"; }

                    return (
                      <div key={track.id} style={{ position: "relative" }}>
                        {/* Track Header */}
                        <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1rem" }}>
                          <div style={{ 
                            fontSize: "2rem", 
                            width: "50px", height: "50px", 
                            display: "flex", alignItems: "center", justifyContent: "center",
                            background: "rgba(255,255,255,0.03)", borderRadius: "12px",
                            border: "1px solid rgba(255,255,255,0.05)"
                          }}>
                            {track.icon}
                          </div>
                          <div style={{ flex: 1 }}>
                            <h3 style={{ margin: 0, fontSize: "1.05rem", color: "#fff", display: "flex", flexWrap: "wrap", alignItems: "center", gap: "0.5rem", lineHeight: 1.2 }}>
                              {track.title}
                              {currentCount >= maxTarget && (
                                <span style={{ fontSize: "0.75rem", padding: "0.2rem 0.5rem", borderRadius: "10px", background: TIER_COLORS.heroic.bg, color: TIER_COLORS.heroic.color, border: `1px solid ${TIER_COLORS.heroic.border}`, whiteSpace: "nowrap" }}>
                                  HEROIC
                                </span>
                              )}
                            </h3>
                            <p style={{ margin: "0.3rem 0 0", fontSize: "0.8rem", color: "var(--text-secondary)", lineHeight: 1.3 }}>
                              {track.description}
                            </p>
                          </div>
                          <div style={{ textAlign: "right", flexShrink: 0 }}>
                            <span style={{ fontSize: "1.5rem", fontWeight: "800", color: activeColor, textShadow: `0 0 15px ${activeGlow}` }}>
                              {currentCount}
                            </span>
                            <span style={{ fontSize: "0.9rem", color: "var(--text-secondary)" }}> / {maxTarget}</span>
                          </div>
                        </div>

                        {/* Progress Bar Container */}
                        <div style={{ position: "relative", height: "12px", background: "rgba(255,255,255,0.05)", borderRadius: "6px", overflow: "visible", marginTop: "1.5rem", boxShadow: "inset 0 1px 3px rgba(0,0,0,0.5)" }}>
                          {/* Fill Bar */}
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${fillPercent}%` }}
                            transition={{ duration: 1, ease: "easeOut" }}
                            style={{
                              position: "absolute", top: 0, left: 0, bottom: 0,
                              background: `linear-gradient(90deg, rgba(255,255,255,0.1), ${activeColor})`,
                              borderRadius: "6px",
                              boxShadow: `0 0 10px ${activeGlow}, 0 0 20px ${activeGlow}`
                            }}
                          />

                          {/* Milestones Checkpoints */}
                          {track.milestones.map((target, index) => {
                            const checkpointPercent = (target / maxTarget) * 100;
                            const isUnlocked = currentCount >= target;
                            
                            let tierName = "bronze";
                            if (index === 1) tierName = "gold";
                            if (index === 2) tierName = "diamond";
                            if (index === 3) tierName = "heroic";
                            
                            const tColor = TIER_COLORS[tierName];

                            return (
                              <div
                                key={target}
                                title={isUnlocked ? `${tierName.toUpperCase()} Unlocked!` : `${target - currentCount} more needed for ${tierName.toUpperCase()}`}
                                style={{
                                  position: "absolute",
                                  top: "50%",
                                  left: `${checkpointPercent}%`,
                                  transform: "translate(-50%, -50%)",
                                  width: isUnlocked ? "20px" : "14px",
                                  height: isUnlocked ? "20px" : "14px",
                                  borderRadius: "50%",
                                  background: isUnlocked ? tColor.color : "rgba(255,255,255,0.1)",
                                  border: isUnlocked ? `2px solid #fff` : `2px solid rgba(255,255,255,0.2)`,
                                  boxShadow: isUnlocked ? `0 0 15px ${tColor.glow}, inset 0 0 10px rgba(255,255,255,0.5)` : "none",
                                  transition: "all 0.3s ease",
                                  cursor: "help",
                                  zIndex: isUnlocked ? 2 : 1
                                }}
                              >
                                {/* Tooltip label underneath */}
                                <div style={{
                                  position: "absolute", top: "25px", left: "50%", transform: "translateX(-50%)",
                                  fontSize: "0.65rem", fontWeight: "bold", textTransform: "uppercase", letterSpacing: "1px",
                                  color: isUnlocked ? tColor.color : "var(--text-secondary)",
                                  opacity: isUnlocked ? 1 : 0.5,
                                  whiteSpace: "nowrap"
                                }}>
                                  {target}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
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
