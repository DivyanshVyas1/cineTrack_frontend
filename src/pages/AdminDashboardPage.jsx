import { useEffect, useState } from "react";
import client, { getApiErrorMessage } from "../api/client";
import { toast } from "react-toastify";
import { motion } from "framer-motion";

function AdminDashboardPage() {
  const [stats, setStats] = useState({ users: 0, reviews: 0, posts: 0, newUsersToday: 0 });
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
      <div className="admin-header glass-card">
        <h1>Admin Control Center</h1>
        <p className="subtitle">Platform Overview & Metrics</p>
      </div>

      <motion.div
        className="metrics-grid"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div className="metric-card glass-card" variants={itemVariants}>
          <div className="metric-icon">👥</div>
          <div className="metric-info">
            <h3>Total Users</h3>
            <p className="metric-value">{stats.users.toLocaleString()}</p>
          </div>
        </motion.div>

        <motion.div className="metric-card glass-card" variants={itemVariants}>
          <div className="metric-icon">🔥</div>
          <div className="metric-info">
            <h3>New Users Today</h3>
            <p className="metric-value text-accent">+{stats.newUsersToday.toLocaleString()}</p>
          </div>
        </motion.div>

        <motion.div className="metric-card glass-card" variants={itemVariants}>
          <div className="metric-icon">📝</div>
          <div className="metric-info">
            <h3>Total Posts</h3>
            <p className="metric-value">{stats.posts.toLocaleString()}</p>
          </div>
        </motion.div>

        <motion.div className="metric-card glass-card" variants={itemVariants}>
          <div className="metric-icon">⭐</div>
          <div className="metric-info">
            <h3>Total Reviews</h3>
            <p className="metric-value">{stats.reviews.toLocaleString()}</p>
          </div>
        </motion.div>
      </motion.div>

      <div className="admin-placeholder glass-card">
        <h3>User Management & Moderation</h3>
        <p>User search, ban controls, and content moderation will be added here in the next phase.</p>
      </div>
    </div>
  );
}

export default AdminDashboardPage;
