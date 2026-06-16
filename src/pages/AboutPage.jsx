import React, { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.1, ease: "easeOut" },
  }),
};

const features = [
  {
    icon: "🗂️",
    title: "Your Common Library — One Place for Everything",
    desc: "Stop juggling spreadsheets and five different apps. Add every movie, web show, and series you've watched, are watching, or plan to watch — all in one beautiful, organized library. Rate them, log them, and access them anytime.",
    img: "/library.jpeg",
    imgAlt: "CineTrack Library Screenshot",
  },
  {
    icon: "👁️",
    title: "See What Your Friends & Influencers Are Watching",
    desc: "Follow friends, creators, and influencers to see their latest watches and ratings live on your feed. No more asking 'what should I watch next?' — just open CineTrack and let your circle inspire you.",
    img: "/userProfile.jpeg",
    imgAlt: "CineTrack User Profile Screenshot",
  },
  {
    icon: "🤝",
    title: "Compare Your Taste — Find Your Entertainment Twin",
    desc: "Our Taste Match feature compares your entire watchlist and ratings with any friend's. Get a compatibility percentage, see where you agree and clash, and discover shows you'd both love — it's like a compatibility test, but for cinema.",
    img: "/compareTaste.jpeg",
    imgAlt: "CineTrack Compare Taste Screenshot",
  },
];

const perks = [
  { icon: "⏱️", title: "Total Watch Time", desc: "See exactly how many hours you've spent watching movies and shows. Wear it as a badge of honor." },
  { icon: "🔒", title: "Privacy Controls", desc: "Go private, manage follow requests, and choose exactly who sees your entertainment diary." },
  { icon: "🎵", title: "Music & Spotify", desc: "Share what you're listening to and preview tracks directly in-app with Spotify integration." },
  { icon: "🎭", title: "Character Spotlights", desc: "Flex your all-time favourite characters on your profile — or roast the ones you can't stand." },
  { icon: "📊", title: "Smart Analytics", desc: "Genre breakdowns, top-rated picks, and your personal stats — all visualized beautifully." },
  { icon: "📱", title: "Shorts Feed", desc: "Scroll through a curated short-clip feed of your favourite shows and never run out of things to explore." },
];

const AboutPage = () => {
  const [lightbox, setLightbox] = useState(null);

  return (
    <div className="about-container" style={{ padding: "2rem 1.5rem 4rem", maxWidth: "1000px", margin: "0 auto" }}>

      {/* ── HERO ── */}
      <div style={{ position: "relative", marginBottom: "4rem", borderRadius: "24px", overflow: "hidden" }}>

        {/* Animated background */}
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(135deg, #0d0d1a 0%, #120d2e 40%, #0d1a1a 100%)",
          zIndex: 0,
        }} />

        {/* Grid overlay */}
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
          zIndex: 0,
        }} />

        {/* Floating orbs */}
        <div style={{ position: "absolute", top: "-20%", left: "-10%", width: "500px", height: "500px", background: "radial-gradient(circle, rgba(139,92,246,0.35) 0%, transparent 65%)", borderRadius: "50%", zIndex: 0, animation: "orb1 8s ease-in-out infinite alternate", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: "-30%", right: "-10%", width: "450px", height: "450px", background: "radial-gradient(circle, rgba(236,72,153,0.3) 0%, transparent 65%)", borderRadius: "50%", zIndex: 0, animation: "orb2 10s ease-in-out infinite alternate", pointerEvents: "none" }} />
        <div style={{ position: "absolute", top: "30%", right: "20%", width: "250px", height: "250px", background: "radial-gradient(circle, rgba(6,182,212,0.2) 0%, transparent 65%)", borderRadius: "50%", zIndex: 0, animation: "orb1 6s ease-in-out infinite alternate-reverse", pointerEvents: "none" }} />

        {/* Content */}
        <div style={{ position: "relative", zIndex: 1, padding: "5rem 2.5rem 4rem", textAlign: "center" }}>

          {/* Badge */}
          <div style={{ marginBottom: "1.5rem" }}>
            <span style={{
              display: "inline-flex", alignItems: "center", gap: "6px",
              fontSize: "0.75rem", fontWeight: 800, letterSpacing: "2px", textTransform: "uppercase",
              color: "#a78bfa",
              border: "1px solid rgba(167,139,250,0.4)",
              background: "rgba(139,92,246,0.12)",
              borderRadius: "100px", padding: "0.4rem 1.1rem",
              backdropFilter: "blur(8px)",
            }}>
              <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#a78bfa", display: "inline-block", boxShadow: "0 0 6px #a78bfa" }} />
              Introducing CineTrack
            </span>
          </div>

          {/* Headline with gradient */}
          <h1 style={{
            fontSize: "clamp(2.2rem, 7vw, 5rem)",
            fontWeight: 900,
            lineHeight: 1.1,
            margin: "0 0 1.5rem",
            letterSpacing: "-0.03em",
            color: "#fff",
            wordBreak: "break-word",
            overflowWrap: "break-word",
          }}>
            Your Entire{" "}
            <span style={{
              background: "linear-gradient(90deg, #a78bfa, #ec4899, #06b6d4, #a78bfa)",
              backgroundSize: "300% auto",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              animation: "gradientShift 4s linear infinite",
            }}>
              Entertainment
            </span>
            {" "}World — In One Place.
          </h1>

          {/* Subtitle */}
          <p style={{
            fontSize: "1.15rem", color: "rgba(255,255,255,0.55)",
            maxWidth: "560px", margin: "0 auto 2rem", lineHeight: 1.75,
          }}>
            Track every movie and show, see what friends are binge-ing, compare your taste, and unlock your personal entertainment analytics.
          </p>

          {/* Floating feature chips */}
          <div style={{ display: "flex", gap: "0.6rem", justifyContent: "center", flexWrap: "wrap", marginBottom: "2.5rem" }}>
            {["🗂️ Library", "🤝 Taste Match", "📊 Analytics", "🎵 Music", "📱 Shorts", "🔒 Private"].map((chip) => (
              <span key={chip} style={{
                fontSize: "0.78rem", fontWeight: 600,
                padding: "0.35rem 0.85rem", borderRadius: "100px",
                background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)",
                color: "rgba(255,255,255,0.7)", backdropFilter: "blur(4px)",
              }}>{chip}</span>
            ))}
          </div>

          {/* CTAs */}
          <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
            <Link
              to="/register"
              style={{
                padding: "0.9rem 2.4rem", borderRadius: "100px",
                background: "linear-gradient(135deg, #8b5cf6, #ec4899)",
                color: "#fff", fontWeight: 800, fontSize: "1rem",
                textDecoration: "none",
                boxShadow: "0 0 24px rgba(139,92,246,0.5), 0 0 48px rgba(236,72,153,0.25)",
                transition: "box-shadow 0.3s",
              }}
              onMouseEnter={e => e.currentTarget.style.boxShadow = "0 0 36px rgba(139,92,246,0.7), 0 0 72px rgba(236,72,153,0.4)"}
              onMouseLeave={e => e.currentTarget.style.boxShadow = "0 0 24px rgba(139,92,246,0.5), 0 0 48px rgba(236,72,153,0.25)"}
            >
              🚀 Get Started — It's Free
            </Link>
            <Link
              to="/"
              style={{
                padding: "0.9rem 2.4rem", borderRadius: "100px",
                background: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.8)",
                fontWeight: 600, fontSize: "1rem", textDecoration: "none",
                border: "1px solid rgba(255,255,255,0.12)", backdropFilter: "blur(8px)",
              }}
            >
              Browse Feed
            </Link>
          </div>
        </div>
      </div>

      {/* Keyframe animations injected via style tag */}
      <style>{`
        @keyframes orb1 { from { transform: translate(0, 0) scale(1); } to { transform: translate(40px, 30px) scale(1.1); } }
        @keyframes orb2 { from { transform: translate(0, 0) scale(1); } to { transform: translate(-50px, -40px) scale(1.15); } }
        @keyframes gradientShift { 0% { background-position: 0% center; } 100% { background-position: 300% center; } }
      `}</style>



      {/* ── CORE FEATURES with screenshots ── */}
      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }} style={{ marginBottom: "4rem" }}>
        <motion.p variants={fadeUp} style={{ textAlign: "center", fontSize: "0.8rem", fontWeight: 700, letterSpacing: "3px", textTransform: "uppercase", color: "var(--accent-1)", marginBottom: "0.5rem" }}>
          Core Features
        </motion.p>
        <motion.h2 variants={fadeUp} style={{ textAlign: "center", fontSize: "clamp(1.6rem, 4vw, 2.4rem)", fontWeight: 800, marginBottom: "3rem" }}>
          Everything You Need, Nothing You Don't.
        </motion.h2>

        <div style={{ display: "flex", flexDirection: "column", gap: "5rem" }}>
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              custom={i}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "3rem",
                alignItems: "center",
                direction: i % 2 === 1 ? "rtl" : "ltr",
              }}
              className="about-feature-row"
            >
              {/* Text */}
              <div style={{ direction: "ltr" }}>
                <div style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>{f.icon}</div>
                <h3 style={{ fontSize: "1.5rem", fontWeight: 800, marginBottom: "1rem", lineHeight: 1.3 }}>{f.title}</h3>
                <p style={{ color: "var(--text-secondary)", lineHeight: 1.75, fontSize: "1.05rem" }}>{f.desc}</p>
              </div>

              {/* Screenshot */}
              <div
                onClick={() => setLightbox(f.img)}
                style={{ direction: "ltr", cursor: "zoom-in", borderRadius: "16px", overflow: "hidden", boxShadow: "0 20px 60px rgba(0,0,0,0.45)", border: "1px solid rgba(255,255,255,0.08)", transition: "transform 0.3s ease" }}
                onMouseEnter={e => e.currentTarget.style.transform = "scale(1.02)"}
                onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
              >
                <img src={f.img} alt={f.imgAlt} style={{ width: "100%", height: "auto", display: "block" }} />
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* ── PERKS GRID ── */}
      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }} style={{ marginBottom: "4rem" }}>
        <motion.p variants={fadeUp} style={{ textAlign: "center", fontSize: "0.8rem", fontWeight: 700, letterSpacing: "3px", textTransform: "uppercase", color: "var(--accent-1)", marginBottom: "0.5rem" }}>
          And Much More
        </motion.p>
        <motion.h2 variants={fadeUp} style={{ textAlign: "center", fontSize: "clamp(1.6rem, 4vw, 2.4rem)", fontWeight: 800, marginBottom: "2.5rem" }}>
          Packed With Features You'll Love
        </motion.h2>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "1.5rem" }}>
          {perks.map((p, i) => (
            <motion.div
              key={p.title}
              custom={i}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.15 }}
              className="glass-card"
              whileHover={{ y: -5 }}
              style={{ padding: "1.75rem", borderRadius: "16px", cursor: "default" }}
            >
              <div style={{ fontSize: "2rem", marginBottom: "0.75rem" }}>{p.icon}</div>
              <h4 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: "0.5rem" }}>{p.title}</h4>
              <p style={{ color: "var(--text-secondary)", lineHeight: 1.6, fontSize: "0.95rem", margin: 0 }}>{p.desc}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* ── SOCIAL PROOF / STAT STRIP ── */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="glass-card"
        style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: "0", marginBottom: "3rem", overflow: "hidden", borderRadius: "20px" }}
      >
        {[
          { value: "1 App", label: "For All Entertainment" },
          { value: "∞", label: "Movies & Shows to Track" },
          { value: "100%", label: "Free to Use" },
          { value: "0", label: "Clutter, All Clean" },
        ].map((s, i) => (
          <div key={s.label} style={{ padding: "2rem 1rem", textAlign: "center", borderRight: i < 3 ? "1px solid rgba(255,255,255,0.07)" : "none" }}>
            <div style={{ fontSize: "2rem", fontWeight: 800, background: "linear-gradient(135deg, var(--accent-1), var(--accent-2))", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>{s.value}</div>
            <div style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginTop: "0.25rem" }}>{s.label}</div>
          </div>
        ))}
      </motion.div>

      {/* ── FINAL CTA ── */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.65 }}
        className="glass-card"
        style={{ textAlign: "center", padding: "4rem 2rem", borderRadius: "24px", position: "relative", overflow: "hidden" }}
      >
        <div style={{ position: "absolute", bottom: "-30%", right: "-10%", width: "50%", height: "200%", background: "radial-gradient(ellipse at center, rgba(var(--accent-2-rgb),0.12) 0%, transparent 65%)", pointerEvents: "none" }} />
        <h2 style={{ fontSize: "clamp(1.8rem, 5vw, 3rem)", fontWeight: 800, marginBottom: "1rem" }}>
          Ready to Elevate Your<br />Entertainment Game?
        </h2>
        <p style={{ color: "var(--text-secondary)", maxWidth: "500px", margin: "0 auto 2.5rem", lineHeight: 1.7, fontSize: "1.05rem" }}>
          Join CineTrack today — it's completely free. Start building your library, connect with friends, and never wonder "what to watch" again.
        </p>
        <Link
          to="/register"
          style={{ display: "inline-block", padding: "1rem 2.8rem", borderRadius: "100px", background: "linear-gradient(135deg, var(--accent-1), var(--accent-2))", color: "#fff", fontWeight: 700, fontSize: "1.1rem", textDecoration: "none", boxShadow: "0 8px 32px rgba(var(--accent-1-rgb),0.4)" }}
        >
          Create Your Free Account →
        </Link>
      </motion.div>

      {/* ── LIGHTBOX ── */}
      {lightbox && (
        <div
          onClick={() => setLightbox(null)}
          style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.88)", zIndex: 99999, display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem", cursor: "zoom-out" }}
        >
          <img
            src={lightbox}
            alt="Preview"
            style={{ maxWidth: "90vw", maxHeight: "90vh", borderRadius: "12px", boxShadow: "0 30px 80px rgba(0,0,0,0.8)" }}
          />
        </div>
      )}
    </div>
  );
};

export default AboutPage;
