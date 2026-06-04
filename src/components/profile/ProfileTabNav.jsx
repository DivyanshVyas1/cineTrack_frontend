import { motion } from "framer-motion";

function ProfileTabNav({ items, activeId, onChange, variant = "main", style }) {
  const isMain = variant === "main";

  return (
    <nav className={isMain ? "profile-tabs profile-tabs-animated" : "profile-subtabs profile-subtabs-animated"} style={style}>
      {items.map((item) => {
        const active = activeId === item.id;
        return (
          <button
            key={item.id}
            type="button"
            className={active ? "active" : ""}
            onClick={() => onChange(item.id)}
          >
            {active ? (
              <motion.span
                layoutId={isMain ? "profile-main-tab" : "profile-sub-tab"}
                className="tab-indicator"
                transition={{ type: "spring", stiffness: 380, damping: 30 }}
              />
            ) : null}
            <span className="tab-label">{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
}

export default ProfileTabNav;
