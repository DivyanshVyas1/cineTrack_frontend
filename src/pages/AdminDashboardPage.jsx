import { useEffect, useState } from "react";
import client, { getApiErrorMessage } from "../api/client";
import { toast } from "react-toastify";
import { motion } from "framer-motion";

function AdminDashboardPage() {
  const [stats, setStats] = useState({ 
    users: 0, reviews: 0, posts: 0, newUsersToday: 0, visits: 0, 
    dau: 0, apiCallsTmdb: 0, apiCallsYoutube: 0, totalTasteMatches: 0, 
    mediaSplit: {}, achievements: {} 
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await client.get("/admin/stats");
        setStats(res.data.data);
      } catch (err) {
        toast.error(getApiErrorMessage(err, "Failed to load admin stats"));
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return <div className="loading-spinner" />;
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="admin-dashboard">
      <div className="admin-header glass-card" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderLeft: "4px solid var(--accent)", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <h1 style={{ margin: 0, background: "linear-gradient(45deg, var(--accent), #ff9eb5)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Admin Control Center</h1>
          <p className="subtitle" style={{ margin: "0.5rem 0 0 0" }}>Platform Overview & Metrics</p>
        </div>
        <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
          <div className="glass-card" style={{ padding: "0.5rem 1rem", borderRadius: "20px", display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.85rem", margin: 0 }}>
            <div style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: "#4ade80", boxShadow: "0 0 8px #4ade80" }}></div>
            Server Online
          </div>
          <div className="glass-card" style={{ padding: "0.5rem 1rem", borderRadius: "20px", fontSize: "0.85rem", margin: 0 }}>
            v1.2.0-beta
          </div>
        </div>
      </div>

      <motion.div
        className="metrics-grid"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        style={{ gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "1.5rem" }}
      >
        <motion.div className="metric-card glass-card" variants={itemVariants} style={{ position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "4px", background: "linear-gradient(90deg, #3b82f6, #60a5fa)" }}></div>
          <div className="metric-icon" style={{ background: "rgba(59, 130, 246, 0.1)" }}>🌍</div>
          <div className="metric-info">
            <h3 style={{ color: "var(--text-muted)", fontSize: "0.9rem", textTransform: "uppercase", letterSpacing: "1px" }}>Total Page Visits</h3>
            <p className="metric-value" style={{ fontSize: "2.5rem", fontWeight: "800" }}>{stats.visits?.toLocaleString() || 0}</p>
          </div>
        </motion.div>

        <motion.div className="metric-card glass-card" variants={itemVariants} style={{ position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "4px", background: "linear-gradient(90deg, #8b5cf6, #c084fc)" }}></div>
          <div className="metric-icon" style={{ background: "rgba(139, 92, 246, 0.1)" }}>👥</div>
          <div className="metric-info">
            <h3 style={{ color: "var(--text-muted)", fontSize: "0.9rem", textTransform: "uppercase", letterSpacing: "1px" }}>Total Users</h3>
            <p className="metric-value" style={{ fontSize: "2.5rem", fontWeight: "800" }}>{stats.users?.toLocaleString() || 0}</p>
          </div>
        </motion.div>

        <motion.div className="metric-card glass-card" variants={itemVariants} style={{ position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "4px", background: "linear-gradient(90deg, var(--accent), #ff9eb5)" }}></div>
          <div className="metric-icon" style={{ background: "rgba(233, 30, 99, 0.1)" }}>🔥</div>
          <div className="metric-info">
            <h3 style={{ color: "var(--text-muted)", fontSize: "0.9rem", textTransform: "uppercase", letterSpacing: "1px" }}>New Users Today</h3>
            <p className="metric-value text-accent" style={{ fontSize: "2.5rem", fontWeight: "800" }}>+{stats.newUsersToday?.toLocaleString() || 0}</p>
          </div>
        </motion.div>

        <motion.div className="metric-card glass-card" variants={itemVariants} style={{ position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "4px", background: "linear-gradient(90deg, #10b981, #34d399)" }}></div>
          <div className="metric-icon" style={{ background: "rgba(16, 185, 129, 0.1)" }}>📝</div>
          <div className="metric-info">
            <h3 style={{ color: "var(--text-muted)", fontSize: "0.9rem", textTransform: "uppercase", letterSpacing: "1px" }}>Total Posts</h3>
            <p className="metric-value" style={{ fontSize: "2.5rem", fontWeight: "800" }}>{stats.posts?.toLocaleString() || 0}</p>
          </div>
        </motion.div>

        <motion.div className="metric-card glass-card" variants={itemVariants} style={{ position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "4px", background: "linear-gradient(90deg, #f59e0b, #fbbf24)" }}></div>
          <div className="metric-icon" style={{ background: "rgba(245, 158, 11, 0.1)" }}>⭐</div>
          <div className="metric-info">
            <h3 style={{ color: "var(--text-muted)", fontSize: "0.9rem", textTransform: "uppercase", letterSpacing: "1px" }}>Total Reviews</h3>
            <p className="metric-value" style={{ fontSize: "2.5rem", fontWeight: "800" }}>{stats.reviews?.toLocaleString() || 0}</p>
          </div>
        </motion.div>
      </motion.div>

      <div className="metrics-grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1.5rem", marginTop: "2rem" }}>
        <motion.div className="metric-card glass-card" variants={itemVariants} style={{ position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "4px", background: "linear-gradient(90deg, #10b981, #34d399)" }}></div>
          <div className="metric-icon" style={{ background: "rgba(16, 185, 129, 0.1)" }}>🌞</div>
          <div className="metric-info">
            <h3 style={{ color: "var(--text-muted)", fontSize: "0.9rem", textTransform: "uppercase", letterSpacing: "1px" }}>DAU (Today)</h3>
            <p className="metric-value" style={{ fontSize: "2.5rem", fontWeight: "800" }}>{stats.dau?.toLocaleString() || 0}</p>
          </div>
        </motion.div>

        <motion.div className="metric-card glass-card" variants={itemVariants} style={{ position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "4px", background: "linear-gradient(90deg, #f59e0b, #fbbf24)" }}></div>
          <div className="metric-icon" style={{ background: "rgba(245, 158, 11, 0.1)" }}>🎬</div>
          <div className="metric-info">
            <h3 style={{ color: "var(--text-muted)", fontSize: "0.9rem", textTransform: "uppercase", letterSpacing: "1px" }}>TMDB API Calls</h3>
            <p className="metric-value" style={{ fontSize: "2.5rem", fontWeight: "800" }}>{stats.apiCallsTmdb?.toLocaleString() || 0}</p>
          </div>
        </motion.div>

        <motion.div className="metric-card glass-card" variants={itemVariants} style={{ position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "4px", background: "linear-gradient(90deg, #ef4444, #f87171)" }}></div>
          <div className="metric-icon" style={{ background: "rgba(239, 68, 68, 0.1)" }}>▶️</div>
          <div className="metric-info">
            <h3 style={{ color: "var(--text-muted)", fontSize: "0.9rem", textTransform: "uppercase", letterSpacing: "1px" }}>YouTube API Calls</h3>
            <p className="metric-value" style={{ fontSize: "2.5rem", fontWeight: "800" }}>{stats.apiCallsYoutube?.toLocaleString() || 0}</p>
          </div>
        </motion.div>

        <motion.div className="metric-card glass-card" variants={itemVariants} style={{ position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "4px", background: "linear-gradient(90deg, #8b5cf6, #c084fc)" }}></div>
          <div className="metric-icon" style={{ background: "rgba(139, 92, 246, 0.1)" }}>💖</div>
          <div className="metric-info">
            <h3 style={{ color: "var(--text-muted)", fontSize: "0.9rem", textTransform: "uppercase", letterSpacing: "1px" }}>Taste Matches</h3>
            <p className="metric-value" style={{ fontSize: "2.5rem", fontWeight: "800" }}>{stats.totalTasteMatches?.toLocaleString() || 0}</p>
          </div>
        </motion.div>
      </div>

      <div style={{ display: "flex", gap: "2rem", marginTop: "2rem", flexWrap: "wrap" }}>
        {/* Media Split Pie Chart logic mapping */}
        <div className="glass-card" style={{ flex: "1 1 300px" }}>
          <h3 style={{ color: "var(--accent)" }}>Media Split</h3>
          <div style={{ display: "flex", gap: "2rem", alignItems: "center", marginTop: "1.5rem" }}>
            <div style={{
              width: "120px", height: "120px", borderRadius: "50%",
              background: `conic-gradient(
                #ff4d9d 0% ${((stats.mediaSplit?.movie || 0) / (stats.posts || 1)) * 100}%, 
                #3b82f6 ${((stats.mediaSplit?.movie || 0) / (stats.posts || 1)) * 100}% ${((stats.mediaSplit?.movie || 0) + (stats.mediaSplit?.series || 0)) / (stats.posts || 1) * 100}%, 
                #10b981 ${((stats.mediaSplit?.movie || 0) + (stats.mediaSplit?.series || 0)) / (stats.posts || 1) * 100}% ${((stats.mediaSplit?.movie || 0) + (stats.mediaSplit?.series || 0) + (stats.mediaSplit?.music || 0)) / (stats.posts || 1) * 100}%, 
                #f59e0b ${((stats.mediaSplit?.movie || 0) + (stats.mediaSplit?.series || 0) + (stats.mediaSplit?.music || 0)) / (stats.posts || 1) * 100}% 100%
              )`
            }}></div>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}><span style={{ width: 12, height: 12, background: "#ff4d9d", borderRadius: "50%" }}></span> Movies: {stats.mediaSplit?.movie || 0}</div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}><span style={{ width: 12, height: 12, background: "#3b82f6", borderRadius: "50%" }}></span> Shows: {stats.mediaSplit?.series || 0}</div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}><span style={{ width: 12, height: 12, background: "#10b981", borderRadius: "50%" }}></span> Music: {stats.mediaSplit?.music || 0}</div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}><span style={{ width: 12, height: 12, background: "#f59e0b", borderRadius: "50%" }}></span> Books: {stats.mediaSplit?.book || 0}</div>
            </div>
          </div>
        </div>

        {/* Achievements Breakdown */}
        <div className="glass-card" style={{ flex: "1 1 300px" }}>
          <h3 style={{ color: "var(--accent)" }}>Gamification: Achievements Unlocked</h3>
          <div style={{ marginTop: "1rem", display: "grid", gridTemplateColumns: "1fr", gap: "1rem" }}>
            {Object.entries(stats.achievements || {}).sort((a,b) => b[1].count - a[1].count).map(([badge, data]) => (
              <div key={badge} style={{ background: "rgba(255,255,255,0.05)", padding: "0.75rem", borderRadius: "8px", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ textTransform: "capitalize", fontWeight: "bold" }}>{badge.replace(/_/g, ' ')}</span>
                  <span style={{ color: "var(--accent)", fontWeight: "bold" }}>{data.count}</span>
                </div>
                {data.users && data.users.length > 0 && (
                  <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
                    <span style={{ opacity: 0.7 }}>Users: </span>
                    {data.users.slice(0, 10).join(', ')}{data.users.length > 10 ? '...' : ''}
                  </div>
                )}
              </div>
            ))}
            {Object.keys(stats.achievements || {}).length === 0 && (
              <div style={{ color: "var(--text-muted)" }}>No achievements unlocked yet.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboardPage;
