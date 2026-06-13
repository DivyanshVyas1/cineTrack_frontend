import { useEffect, useState } from "react";
import client, { getApiErrorMessage } from "../api/client";
import { toast } from "react-toastify";
import { motion } from "framer-motion";

// Helper component for premium metric cards
const PremiumCard = ({ title, value, colorHex, colorRgba, icon, delay = 0 }) => {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { delay, duration: 0.4, ease: "easeOut" } }
      }}
      whileHover={{ y: -4, boxShadow: `0 12px 30px -10px ${colorRgba}` }}
      style={{
        padding: "1.5rem",
        borderRadius: "16px",
        background: "linear-gradient(145deg, rgba(30, 41, 59, 0.7) 0%, rgba(15, 23, 42, 0.7) 100%)",
        border: "1px solid rgba(255, 255, 255, 0.05)",
        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255,255,255,0.05)",
        position: "relative",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        gap: "1.25rem",
        transition: "transform 0.2s ease, box-shadow 0.2s ease",
        cursor: "default"
      }}
    >
      {/* Subtle colored glow blur in the corner */}
      <div style={{ position: "absolute", top: "-30px", right: "-30px", width: "120px", height: "120px", background: colorRgba, filter: "blur(50px)", borderRadius: "50%", opacity: 0.6, pointerEvents: "none" }}></div>
      
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", zIndex: 1 }}>
        <h3 style={{ color: "var(--text-muted)", fontSize: "0.8rem", fontWeight: "700", textTransform: "uppercase", letterSpacing: "1.2px", margin: 0 }}>
          {title}
        </h3>
        <div style={{ width: "38px", height: "38px", borderRadius: "10px", background: `linear-gradient(135deg, rgba(255,255,255,0.05), ${colorRgba})`, border: "1px solid rgba(255,255,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center", color: colorHex, boxShadow: `0 4px 12px ${colorRgba.replace('0.2', '0.4')}` }}>
          {icon}
        </div>
      </div>
      
      <div style={{ zIndex: 1 }}>
        <p style={{ fontSize: "2.5rem", fontWeight: "800", margin: 0, color: "#fff", textShadow: "0 2px 10px rgba(0,0,0,0.5)", lineHeight: 1 }}>
          {value}
        </p>
      </div>
    </motion.div>
  );
};

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
    visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
  };

  return (
    <div className="admin-dashboard" style={{ paddingBottom: "4rem" }}>
      {/* Header */}
      <div className="admin-header glass-card" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderLeft: "4px solid var(--accent)", flexWrap: "wrap", gap: "1rem", marginBottom: "2.5rem", padding: "1.5rem 2rem", borderRadius: "16px", background: "rgba(15, 23, 42, 0.4)" }}>
        <div>
          <h1 style={{ margin: 0, fontSize: "1.8rem", fontWeight: "800", background: "linear-gradient(to right, #fff, #a5b4fc)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Control Center</h1>
          <p style={{ margin: "0.25rem 0 0 0", color: "var(--text-muted)", fontSize: "0.9rem" }}>Real-time platform overview & metrics</p>
        </div>
        <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
          <div style={{ padding: "0.5rem 1rem", borderRadius: "20px", display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.85rem", background: "rgba(16, 185, 129, 0.1)", color: "#34d399", border: "1px solid rgba(16, 185, 129, 0.2)", fontWeight: "600" }}>
            <div style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: "#34d399", boxShadow: "0 0 8px #34d399", animation: "pulse 2s infinite" }}></div>
            Server Online
          </div>
        </div>
      </div>

      <motion.div variants={containerVariants} initial="hidden" animate="visible" style={{ display: "flex", flexDirection: "column", gap: "3rem" }}>
        
        {/* User Activity Section */}
        <section>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.25rem" }}>
            <div style={{ padding: "6px", background: "rgba(139, 92, 246, 0.1)", borderRadius: "8px" }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#a78bfa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
            </div>
            <h2 style={{ fontSize: "1.2rem", color: "#e2e8f0", margin: 0, fontWeight: "600" }}>User Activity</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "1.5rem" }}>
            <PremiumCard 
              title="Total Users" value={stats.users?.toLocaleString() || 0} colorHex="#c084fc" colorRgba="rgba(192, 132, 252, 0.2)" delay={0}
              icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>}
            />
            <PremiumCard 
              title="New Users Today" value={`+${stats.newUsersToday?.toLocaleString() || 0}`} colorHex="#f472b6" colorRgba="rgba(244, 114, 182, 0.2)" delay={0.1}
              icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><line x1="20" y1="8" x2="20" y2="14"/><line x1="23" y1="11" x2="17" y2="11"/></svg>}
            />
            <PremiumCard 
              title="DAU (Today)" value={stats.dau?.toLocaleString() || 0} colorHex="#34d399" colorRgba="rgba(52, 211, 153, 0.2)" delay={0.2}
              icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>}
            />
            <PremiumCard 
              title="Total Page Visits" value={stats.visits?.toLocaleString() || 0} colorHex="#60a5fa" colorRgba="rgba(96, 165, 250, 0.2)" delay={0.3}
              icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>}
            />
          </div>
        </section>

        {/* Content & Engagement */}
        <section>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.25rem" }}>
            <div style={{ padding: "6px", background: "rgba(244, 114, 182, 0.1)", borderRadius: "8px" }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#f472b6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
            </div>
            <h2 style={{ fontSize: "1.2rem", color: "#e2e8f0", margin: 0, fontWeight: "600" }}>Content & Engagement</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "1.5rem" }}>
            <PremiumCard 
              title="Total Posts" value={stats.posts?.toLocaleString() || 0} colorHex="#2dd4bf" colorRgba="rgba(45, 212, 191, 0.2)" delay={0.4}
              icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>}
            />
            <PremiumCard 
              title="Total Reviews" value={stats.reviews?.toLocaleString() || 0} colorHex="#fbbf24" colorRgba="rgba(251, 191, 36, 0.2)" delay={0.5}
              icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>}
            />
            <PremiumCard 
              title="Taste Matches" value={stats.totalTasteMatches?.toLocaleString() || 0} colorHex="#fb7185" colorRgba="rgba(251, 113, 133, 0.2)" delay={0.6}
              icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>}
            />
          </div>
        </section>

        {/* System & APIs */}
        <section>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.25rem" }}>
            <div style={{ padding: "6px", background: "rgba(251, 146, 60, 0.1)", borderRadius: "8px" }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fb923c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18"></rect><line x1="7" y1="2" x2="7" y2="22"></line><line x1="17" y1="2" x2="17" y2="22"></line><line x1="2" y1="12" x2="22" y2="12"></line><line x1="2" y1="7" x2="7" y2="7"></line><line x1="2" y1="17" x2="7" y2="17"></line><line x1="17" y1="17" x2="22" y2="17"></line><line x1="17" y1="7" x2="22" y2="7"></line></svg>
            </div>
            <h2 style={{ fontSize: "1.2rem", color: "#e2e8f0", margin: 0, fontWeight: "600" }}>System & APIs</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "1.5rem" }}>
            <PremiumCard 
              title="TMDB API Calls" value={stats.apiCallsTmdb?.toLocaleString() || 0} colorHex="#fb923c" colorRgba="rgba(251, 146, 60, 0.2)" delay={0.7}
              icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18"/><line x1="7" y1="2" x2="7" y2="22"/><line x1="17" y1="2" x2="17" y2="22"/><line x1="2" y1="12" x2="22" y2="12"/><line x1="2" y1="7" x2="7" y2="7"/><line x1="2" y1="17" x2="7" y2="17"/><line x1="17" y1="17" x2="22" y2="17"/><line x1="17" y1="7" x2="22" y2="7"/></svg>}
            />
            <PremiumCard 
              title="YouTube API Calls" value={stats.apiCallsYoutube?.toLocaleString() || 0} colorHex="#f87171" colorRgba="rgba(248, 113, 113, 0.2)" delay={0.8}
              icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33 2.78 2.78 0 0 0 1.94 2c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.33 29 29 0 0 0-.46-5.33z"/><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"/></svg>}
            />
          </div>
        </section>

        {/* Charts & Bottom info */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "1.5rem", marginTop: "1rem" }}>
          {/* Media Split Pie Chart */}
          <motion.div 
            className="glass-card" 
            variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { delay: 0.9, duration: 0.4 } } }}
            style={{ padding: "2rem", borderRadius: "16px", background: "linear-gradient(145deg, rgba(30, 41, 59, 0.4) 0%, rgba(15, 23, 42, 0.4) 100%)", border: "1px solid rgba(255, 255, 255, 0.05)" }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "2rem" }}>
              <div style={{ padding: "6px", background: "rgba(16, 185, 129, 0.1)", borderRadius: "8px" }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#34d399" strokeWidth="2"><path d="M21.21 15.89A10 10 0 1 1 8 2.83"/><path d="M22 12A10 10 0 0 0 12 2v10z"/></svg>
              </div>
              <h3 style={{ color: "#e2e8f0", margin: 0, fontSize: "1.1rem" }}>Media Split</h3>
            </div>
            
            <div style={{ display: "flex", gap: "2.5rem", alignItems: "center", flexWrap: "wrap", justifyContent: "center" }}>
              <div style={{
                width: "140px", height: "140px", borderRadius: "50%",
                background: `conic-gradient(
                  #ff4d9d 0% ${((stats.mediaSplit?.movie || 0) / (stats.posts || 1)) * 100}%, 
                  #3b82f6 ${((stats.mediaSplit?.movie || 0) / (stats.posts || 1)) * 100}% ${((stats.mediaSplit?.movie || 0) + (stats.mediaSplit?.series || 0)) / (stats.posts || 1) * 100}%, 
                  #10b981 ${((stats.mediaSplit?.movie || 0) + (stats.mediaSplit?.series || 0)) / (stats.posts || 1) * 100}% ${((stats.mediaSplit?.movie || 0) + (stats.mediaSplit?.series || 0) + (stats.mediaSplit?.music || 0)) / (stats.posts || 1) * 100}%, 
                  #f59e0b ${((stats.mediaSplit?.movie || 0) + (stats.mediaSplit?.series || 0) + (stats.mediaSplit?.music || 0)) / (stats.posts || 1) * 100}% 100%
                )`,
                boxShadow: "0 0 20px rgba(0,0,0,0.5), inset 0 0 20px rgba(0,0,0,0.5)"
              }}></div>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.8rem", flex: 1, minWidth: "140px" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}><span style={{ width: 12, height: 12, background: "#ff4d9d", borderRadius: "4px" }}></span> Movies</div>
                  <span style={{ fontWeight: "bold" }}>{stats.mediaSplit?.movie || 0}</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}><span style={{ width: 12, height: 12, background: "#3b82f6", borderRadius: "4px" }}></span> Shows</div>
                  <span style={{ fontWeight: "bold" }}>{stats.mediaSplit?.series || 0}</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}><span style={{ width: 12, height: 12, background: "#10b981", borderRadius: "4px" }}></span> Music</div>
                  <span style={{ fontWeight: "bold" }}>{stats.mediaSplit?.music || 0}</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}><span style={{ width: 12, height: 12, background: "#f59e0b", borderRadius: "4px" }}></span> Books</div>
                  <span style={{ fontWeight: "bold" }}>{stats.mediaSplit?.book || 0}</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Achievements Breakdown */}
          <motion.div 
            className="glass-card" 
            variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { delay: 1.0, duration: 0.4 } } }}
            style={{ padding: "2rem", borderRadius: "16px", background: "linear-gradient(145deg, rgba(30, 41, 59, 0.4) 0%, rgba(15, 23, 42, 0.4) 100%)", border: "1px solid rgba(255, 255, 255, 0.05)" }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.5rem" }}>
              <div style={{ padding: "6px", background: "rgba(251, 191, 36, 0.1)", borderRadius: "8px" }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fbbf24" strokeWidth="2"><circle cx="12" cy="8" r="7"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/></svg>
              </div>
              <h3 style={{ color: "#e2e8f0", margin: 0, fontSize: "1.1rem" }}>Gamification Unlocked</h3>
            </div>
            
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", maxHeight: "200px", overflowY: "auto", paddingRight: "0.5rem" }} className="hide-scrollbar">
              {Object.entries(stats.achievements || {}).sort((a,b) => b[1].count - a[1].count).map(([badge, data]) => (
                <div key={badge} style={{ background: "rgba(0,0,0,0.2)", border: "1px solid rgba(255,255,255,0.03)", padding: "1rem", borderRadius: "10px", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ textTransform: "capitalize", fontWeight: "600", color: "#f8fafc", fontSize: "0.95rem" }}>{badge.replace(/_/g, ' ')}</span>
                    <span style={{ color: "var(--accent)", fontWeight: "800", background: "rgba(233, 30, 99, 0.15)", padding: "2px 10px", borderRadius: "12px", fontSize: "0.85rem" }}>{data.count}</span>
                  </div>
                  {data.users && data.users.length > 0 && (
                    <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", lineHeight: 1.4 }}>
                      {data.users.slice(0, 8).join(', ')}{data.users.length > 8 ? '...' : ''}
                    </div>
                  )}
                </div>
              ))}
              {Object.keys(stats.achievements || {}).length === 0 && (
                <div style={{ color: "var(--text-muted)", textAlign: "center", padding: "2rem 0", fontStyle: "italic" }}>
                  No achievements unlocked yet.
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}

export default AdminDashboardPage;
