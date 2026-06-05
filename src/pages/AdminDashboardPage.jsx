import { useEffect, useState } from "react";
import client, { getApiErrorMessage } from "../api/client";
import { toast } from "react-toastify";
import { motion } from "framer-motion";

function AdminDashboardPage() {
  const [stats, setStats] = useState({ users: 0, reviews: 0, posts: 0, newUsersToday: 0, visits: 0 });
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

      <div className="admin-placeholder glass-card" style={{ marginTop: "2rem", border: "1px dashed rgba(255,255,255,0.2)", background: "rgba(0,0,0,0.2)" }}>
        <h3>User Management & Moderation</h3>
        <p style={{ color: "var(--text-muted)" }}>User search, ban controls, and content moderation will be added here in the next phase. Active moderation requires elevated permissions.</p>
      </div>
    </div>
  );
}

export default AdminDashboardPage;
