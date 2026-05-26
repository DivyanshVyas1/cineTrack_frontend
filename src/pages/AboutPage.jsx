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
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h1>About CineTrack</h1>
          <p className="subtitle">Your ultimate entertainment tracking companion</p>
        </motion.div>

        <motion.div
          className="features-grid"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div className="feature-card glass-card" variants={itemVariants}>
            <div className="feature-icon">🔍</div>
            <h3>Universal Search</h3>
            <p>Search across movies, web series, books, and music all in one place. Powered by TMDB, Google Books, and YouTube Music.</p>
          </motion.div>

          <motion.div className="feature-card glass-card" variants={itemVariants}>
            <div className="feature-icon">📚</div>
            <h3>Collections & Tracking</h3>
            <p>Add titles to your watchlists and reading lists. Keep track of what you've completed and what's up next.</p>
          </motion.div>

          <motion.div className="feature-card glass-card" variants={itemVariants}>
            <div className="feature-icon">🤝</div>
            <h3>Taste Match</h3>
            <p>Our unique algorithm compares your ratings with others to find users who share your exact entertainment taste.</p>
          </motion.div>

          <motion.div className="feature-card glass-card" variants={itemVariants}>
            <div className="feature-icon">🌟</div>
            <h3>Reviews & Ratings</h3>
            <p>Rate what you watch, drop reviews, and mark spoilers. Share your honest opinions with the community.</p>
          </motion.div>

          <motion.div className="feature-card glass-card" variants={itemVariants}>
            <div className="feature-icon">🎵</div>
            <h3>Music Previews</h3>
            <p>Listen to trending songs and album previews directly within the app without leaving your feed.</p>
          </motion.div>

          <motion.div className="feature-card glass-card" variants={itemVariants}>
            <div className="feature-icon">🎭</div>
            <h3>Character Spotlights</h3>
            <p>Showcase your all-time favorite characters, or highlight the "Most Disgusting" characters you absolutely despise.</p>
          </motion.div>

          <motion.div className="feature-card glass-card" variants={itemVariants}>
            <div className="feature-icon">🔒</div>
            <h3>Privacy Controls</h3>
            <p>Keep your profile private to only share your watches and reviews with people you approve as followers.</p>
          </motion.div>

          <motion.div className="feature-card glass-card" variants={itemVariants}>
            <div className="feature-icon">📈</div>
            <h3>Trending Insights</h3>
            <p>See what's trending across the community this week in all categories, updated in real-time.</p>
          </motion.div>
        </motion.div>
      </div>
  );
};

export default AboutPage;
