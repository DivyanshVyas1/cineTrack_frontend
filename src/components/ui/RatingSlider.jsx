import { motion } from "framer-motion";

function RatingSlider({ value, onChange, min = 0, max = 10, step = 0.5, compact = true }) {
  const num = Number(value);
  const percent = ((num - min) / (max - min)) * 100;

  return (
    <div className={`rating-slider ${compact ? "rating-slider-compact" : ""}`}>
      <div className="rating-slider-row">
        <span className="rating-slider-label">Rating</span>
        <div className="rating-slider-track-wrap">
          <motion.div
            className="rating-slider-fill"
            animate={{ width: `${percent}%` }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          />
          <input
            type="range"
            className="rating-slider-input"
            min={min}
            max={max}
            step={step}
            value={value}
            onChange={(e) => onChange(Number(e.target.value))}
            aria-label="Rating"
          />
        </div>
        <motion.strong
          key={num}
          initial={{ scale: 0.9, opacity: 0.6 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 400, damping: 22 }}
          className="rating-value"
        >
          {num}/10
        </motion.strong>
      </div>
    </div>
  );
}

export default RatingSlider;
