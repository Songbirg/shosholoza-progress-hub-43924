import { useEffect, useState } from "react";
import { motion, useSpring, useMotionValue } from "framer-motion";

const CustomCursor = () => {
  const [visible, setVisible] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [clicking, setClicking] = useState(false);

  const mouseX = useMotionValue(-200);
  const mouseY = useMotionValue(-200);

  // Ring follows with spring lag
  const ringX = useSpring(mouseX, { stiffness: 130, damping: 22, mass: 0.5 });
  const ringY = useSpring(mouseY, { stiffness: 130, damping: 22, mass: 0.5 });

  useEffect(() => {
    // Don't activate on touch devices
    if (typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches) {
      return;
    }

    const onMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      setVisible(true);

      const el = e.target as Element | null;
      const interactive = !!el?.closest(
        "a, button, [role='button'], input, textarea, select, label, [tabindex]"
      );
      setHovering(interactive);
    };

    const onLeave = () => setVisible(false);
    const onEnter = () => setVisible(true);
    const onDown = () => setClicking(true);
    const onUp = () => setClicking(false);

    document.addEventListener("mousemove", onMove, { passive: true });
    document.addEventListener("mouseleave", onLeave, { passive: true });
    document.addEventListener("mouseenter", onEnter, { passive: true });
    document.addEventListener("mousedown", onDown, { passive: true });
    document.addEventListener("mouseup", onUp, { passive: true });

    return () => {
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseleave", onLeave);
      document.removeEventListener("mouseenter", onEnter);
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("mouseup", onUp);
    };
  }, [mouseX, mouseY]);

  return (
    <>
      {/* Outer spring-lagged ring */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9998]"
        style={{
          x: ringX,
          y: ringY,
          translateX: "-50%",
          translateY: "-50%",
        }}
        animate={{
          opacity: visible ? 1 : 0,
          scale: clicking ? 0.7 : hovering ? 1.5 : 1,
          width: hovering ? 48 : 36,
          height: hovering ? 48 : 36,
        }}
        transition={{
          opacity: { duration: 0.15 },
          scale: { type: "spring", stiffness: 300, damping: 20 },
          width: { duration: 0.2 },
          height: { duration: 0.2 },
        }}
      >
        <div
          style={{
            width: "100%",
            height: "100%",
            border: `2px solid ${hovering ? "rgb(234,179,8)" : "rgb(22,163,74)"}`,
            borderRadius: "50%",
            transition: "border-color 0.2s",
            backdropFilter: hovering ? "blur(2px)" : "none",
          }}
        />
      </motion.div>

      {/* Inner dot — follows exactly */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9999]"
        style={{
          x: mouseX,
          y: mouseY,
          translateX: "-50%",
          translateY: "-50%",
        }}
        animate={{
          opacity: visible ? 1 : 0,
          scale: clicking ? 0.5 : hovering ? 0 : 1,
          backgroundColor: hovering ? "rgb(234,179,8)" : "rgb(22,163,74)",
        }}
        transition={{
          opacity: { duration: 0.1 },
          scale: { type: "spring", stiffness: 400, damping: 25 },
          backgroundColor: { duration: 0.2 },
        }}
      >
        <div
          style={{
            width: 8,
            height: 8,
            borderRadius: "50%",
            background: "currentColor",
          }}
        />
      </motion.div>

      {/* Hide native cursor via global style */}
      <style>{`
        * { cursor: none !important; }
        @media (pointer: coarse) { * { cursor: auto !important; } }
      `}</style>
    </>
  );
};

export default CustomCursor;
