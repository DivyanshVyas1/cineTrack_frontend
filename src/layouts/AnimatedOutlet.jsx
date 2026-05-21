import { AnimatePresence } from "framer-motion";
import { useLocation, useOutlet } from "react-router-dom";
import PageTransition from "../components/animations/PageTransition";

function AnimatedOutlet() {
  const location = useLocation();
  const outlet = useOutlet();

  return (
    <AnimatePresence mode="wait">
      <PageTransition key={location.pathname}>{outlet}</PageTransition>
    </AnimatePresence>
  );
}

export default AnimatedOutlet;
