export const profilePanelVariants = {
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
};

export const profilePanelTransition = {
  duration: 0.32,
  ease: [0.22, 1, 0.36, 1],
};

export const profileListItemVariants = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
};
