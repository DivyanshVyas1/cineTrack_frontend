import React from "react";
import { motion } from "framer-motion";

// The project doesn't have lucide-react installed based on package.json (we can just use emojis or standard HTML icons).
const AboutPage = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="about-container">
      <motion.div
        className="about-header glass-card"
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        style={{ position: "relative", overflow: "hidden" }}
      >
        <div className="glow-effect" style={{ position: "absolute", top: "-50%", left: "-50%", width: "200%", height: "200%", background: "radial-gradient(circle, rgba(var(--accent-1-rgb), 0.1) 0%, transparent 60%)", pointerEvents: "none" }} />
        <h1 style={{ fontSize: "3.5rem", marginBottom: "1rem", background: "linear-gradient(135deg, var(--accent-1), var(--accent-2))", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
          CineTrack
        </h1>
        <p className="subtitle" style={{ fontSize: "1.3rem", color: "var(--text-secondary)", maxWidth: "600px", margin: "0 auto", lineHeight: "1.6" }}>
          Your ultimate entertainment ecosystem. Track movies, series, books, and music, discover new favorites, and connect with people who share your exact taste.
        </p>
      </motion.div>

      <motion.div
        className="features-grid"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "2rem" }}
      >
        <motion.div className="feature-card glass-card" variants={itemVariants} style={{ padding: "2rem", display: "flex", flexDirection: "column", gap: "1rem", transition: "transform 0.3s ease", cursor: "default" }} whileHover={{ y: -5 }}>
          <div className="feature-icon" style={{ fontSize: "2.5rem", marginBottom: "0.5rem" }}>🔍</div>
          <h3 style={{ fontSize: "1.2rem", fontWeight: "600" }}>Universal Search</h3>
          <p style={{ color: "var(--text-secondary)", lineHeight: "1.5" }}>Search across movies, web series, books, and music all in one seamless interface powered by TMDB and YouTube Music.</p>
        </motion.div>

        <motion.div className="feature-card glass-card" variants={itemVariants} style={{ padding: "2rem", display: "flex", flexDirection: "column", gap: "1rem", transition: "transform 0.3s ease", cursor: "default" }} whileHover={{ y: -5 }}>
          <div className="feature-icon" style={{ fontSize: "2.5rem", marginBottom: "0.5rem" }}>📚</div>
          <h3 style={{ fontSize: "1.2rem", fontWeight: "600" }}>Smart Collections</h3>
          <p style={{ color: "var(--text-secondary)", lineHeight: "1.5" }}>Build watchlists, reading lists, and favorite collections. Never forget what you want to experience next.</p>
        </motion.div>

        <motion.div className="feature-card glass-card" variants={itemVariants} style={{ padding: "2rem", display: "flex", flexDirection: "column", gap: "1rem", transition: "transform 0.3s ease", cursor: "default" }} whileHover={{ y: -5 }}>
          <div className="feature-icon" style={{ fontSize: "2.5rem", marginBottom: "0.5rem" }}>🤝</div>
          <h3 style={{ fontSize: "1.2rem", fontWeight: "600" }}>Taste Match AI</h3>
          <p style={{ color: "var(--text-secondary)", lineHeight: "1.5" }}>Our proprietary algorithm analyzes your ratings and reviews to connect you with users who share your exact entertainment vibe.</p>
        </motion.div>

        <motion.div className="feature-card glass-card" variants={itemVariants} style={{ padding: "2rem", display: "flex", flexDirection: "column", gap: "1rem", transition: "transform 0.3s ease", cursor: "default" }} whileHover={{ y: -5 }}>
          <div className="feature-icon" style={{ fontSize: "2.5rem", marginBottom: "0.5rem" }}>🌟</div>
          <h3 style={{ fontSize: "1.2rem", fontWeight: "600" }}>Reviews & Community</h3>
          <p style={{ color: "var(--text-secondary)", lineHeight: "1.5" }}>Drop honest reviews, mark spoilers, and engage with community thoughts. Your voice matters here.</p>
        </motion.div>

        <motion.div className="feature-card glass-card" variants={itemVariants} style={{ padding: "2rem", display: "flex", flexDirection: "column", gap: "1rem", transition: "transform 0.3s ease", cursor: "default" }} whileHover={{ y: -5 }}>
          <div className="feature-icon" style={{ fontSize: "2.5rem", marginBottom: "0.5rem" }}>🎵</div>
          <h3 style={{ fontSize: "1.2rem", fontWeight: "600" }}>In-App Music</h3>
          <p style={{ color: "var(--text-secondary)", lineHeight: "1.5" }}>Listen to trending songs, tracks, and album previews directly within your feed without opening another app.</p>
        </motion.div>

        <motion.div className="feature-card glass-card" variants={itemVariants} style={{ padding: "2rem", display: "flex", flexDirection: "column", gap: "1rem", transition: "transform 0.3s ease", cursor: "default" }} whileHover={{ y: -5 }}>
          <div className="feature-icon" style={{ fontSize: "2.5rem", marginBottom: "0.5rem" }}>🎭</div>
          <h3 style={{ fontSize: "1.2rem", fontWeight: "600" }}>Character Spotlights</h3>
          <p style={{ color: "var(--text-secondary)", lineHeight: "1.5" }}>Flex your all-time favorite characters, or openly highlight the "Most Disliked" characters you absolutely despise.</p>
        </motion.div>
      </motion.div>

      <motion.div
        className="developer-section glass-card"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        style={{ marginTop: "1rem", padding: "3rem 2rem", textAlign: "center", position: "relative", overflow: "hidden" }}
      >
        <div style={{ position: "absolute", top: 0, left: 0, width: "4px", height: "100%", background: "linear-gradient(to bottom, var(--accent-1), var(--accent-2))" }} />
        <h2 style={{ fontSize: "2rem", marginBottom: "1rem" }}>Crafted with Passion</h2>
        <p style={{ color: "var(--text-secondary)", maxWidth: "700px", margin: "0 auto 2rem", lineHeight: "1.6" }}>
          CineTrack was built from the ground up to solve the fragmentation of entertainment tracking. Why use four different apps when you can have one unified, beautiful ecosystem?
        </p>
        <div style={{ display: "inline-flex", alignItems: "center", gap: "1rem", padding: "1rem 2rem", background: "rgba(255,255,255,0.03)", borderRadius: "100px", border: "1px solid rgba(255,255,255,0.05)" }}>
          <span style={{ fontSize: "1.2rem" }}>💻</span>
          <span style={{ fontWeight: "500", letterSpacing: "1px" }}>DESIGNED & DEVELOPED FOR THE COMMUNITY</span>
        </div>
      </motion.div>
    </div>
  );
};

export default AboutPage;
