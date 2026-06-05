import { motion } from "framer-motion";

const floatingVariants = {
  animate: (i) => ({
    x: [0, (i % 3 === 0 ? 15 : i % 2 === 0 ? -15 : 10), (i % 2 === 0 ? 10 : -15), 0],
    y: [0, (i % 2 === 0 ? -15 : 10), (i % 3 === 0 ? 15 : -10), 0],
    transition: {
      duration: 6 + (i % 4) * 1.5,
      repeat: Infinity,
      ease: "easeInOut",
      repeatType: "mirror"
    }
  })
};

function CharacterSection({ label, characters = [], variant = "favorite" }) {
  if (!characters.length) return null;

  return (
    <section
      className={`profile-block profile-characters-block profile-characters-${variant}`}
      aria-label={label}
      style={{ paddingTop: 0, borderTop: "none" }}
    >
      <div className="character-chips-grid" style={{ display: "flex", flexWrap: "wrap", gap: "1.5rem", padding: "1rem" }}>
        {characters.map((c, i) => (
          <motion.div 
            key={`${c.name}-${i}`} 
            custom={i}
            variants={floatingVariants}
            animate="animate"
            className={`character-chip character-chip-${variant}`} 
            style={{ 
              width: "auto", flex: "0 0 auto", margin: 0, display: "inline-flex", alignItems: "center", padding: "0.4rem 0.8rem", borderRadius: "8px",
              background: variant === "favorite" ? "rgba(57, 255, 20, 0.15)" : "rgba(255, 68, 68, 0.15)",
              border: variant === "favorite" ? "1px solid rgba(57, 255, 20, 0.3)" : "1px solid rgba(255, 68, 68, 0.3)",
              color: variant === "favorite" ? "#39ff14" : "#ff4444",
              cursor: "default"
          }}>
            <span className="character-chip-name" title={c.name} style={{ margin: 0, lineHeight: 1, color: "inherit", fontWeight: "bold" }}>
              {c.name}
            </span>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

export default CharacterSection;
