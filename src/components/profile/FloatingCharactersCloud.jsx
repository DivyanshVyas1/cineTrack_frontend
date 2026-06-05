import { motion } from "framer-motion";

export default function FloatingCharactersCloud({ characters }) {
  if (!characters || characters.length === 0) return null;

  return (
    <div style={{ position: "relative", width: "100%", height: "100%", minHeight: "140px" }}>
      {characters.map((c, i) => {
        const seed = i + 5;
        
        const total = characters.length;
        
        // Shuffle lane assignments so consecutive characters (like two Reds) are mathematically separated
        let laneIndex = i;
        if (total === 3) laneIndex = [0, 2, 1][i];
        else if (total === 4) laneIndex = [0, 2, 1, 3][i];
        else if (total === 5) laneIndex = [0, 2, 4, 1, 3][i];
        else if (total === 6) laneIndex = [0, 3, 1, 4, 2, 5][i];
        else if (total > 6) laneIndex = (i * 5) % total;
        
        // Mathematically spread them out by assigning each character a dedicated horizontal "lane"
        const laneWidth = 75 / Math.max(1, total);
        const laneCenter = 5 + (laneIndex * laneWidth) + (laneWidth / 2);
        
        // Character wanders +/- 15% from its lane center
        const minX = Math.max(0, laneCenter - 15);
        const maxX = Math.min(85, laneCenter + 15);
        const rangeX = Math.max(1, maxX - minX);

        // Vertical staggering (Checkerboard pattern)
        // Even lanes float high, odd lanes float low, completely eliminating vertical overlap
        const isHigh = laneIndex % 2 === 0;
        const minY = isHigh ? 5 : 30;
        const maxY = isHigh ? 35 : 65;
        const rangeY = Math.max(1, maxY - minY);

        // Using 8 waypoints to make the movement complex and non-repetitive within their lane
        const pathX = [
          `${minX + ((seed * 11) % rangeX)}%`,
          `${minX + ((seed * 23) % rangeX)}%`,
          `${minX + ((seed * 37) % rangeX)}%`,
          `${minX + ((seed * 47) % rangeX)}%`,
          `${minX + ((seed * 53) % rangeX)}%`,
          `${minX + ((seed * 61) % rangeX)}%`,
          `${minX + ((seed * 71) % rangeX)}%`,
          `${minX + ((seed * 11) % rangeX)}%` // Loop back to start
        ];
        
        const pathY = [
          `${minY + ((seed * 13) % rangeY)}%`,
          `${minY + ((seed * 19) % rangeY)}%`,
          `${minY + ((seed * 29) % rangeY)}%`,
          `${minY + ((seed * 31) % rangeY)}%`,
          `${minY + ((seed * 41) % rangeY)}%`,
          `${minY + ((seed * 43) % rangeY)}%`,
          `${minY + ((seed * 59) % rangeY)}%`,
          `${minY + ((seed * 13) % rangeY)}%` // Loop back to start
        ];

        return (
          <motion.div
            key={`${c.name}-${i}`}
            initial={{ left: pathX[0], top: pathY[0] }}
            animate={{ left: pathX, top: pathY }}
            whileHover={{ scale: 1.1, zIndex: 100 }}
            transition={{
              left: { 
                duration: 40 + (i * 3 % 15), 
                repeat: Infinity, 
                ease: "linear",
                delay: -(seed * 11.3) // Negative delay so they start at different phases
              },
              top: { 
                duration: 35 + (i * 5 % 12), 
                repeat: Infinity, 
                ease: "linear",
                delay: -(seed * 7.7)
              }
            }}
            style={{
              position: "absolute",
              display: "inline-flex",
              alignItems: "center",
              padding: "0.5rem 1rem",
              borderRadius: "12px",
              background: c.variant === "favorite" ? "rgba(57, 255, 20, 0.15)" : "rgba(255, 68, 68, 0.15)",
              border: c.variant === "favorite" ? "1px solid rgba(57, 255, 20, 0.3)" : "1px solid rgba(255, 68, 68, 0.3)",
              color: c.variant === "favorite" ? "#39ff14" : "#ff4444",
              fontWeight: "bold",
              whiteSpace: "nowrap",
              cursor: "pointer",
              backdropFilter: "blur(4px)"
            }}
          >
            {c.name}
          </motion.div>
        );
      })}
    </div>
  );
}
