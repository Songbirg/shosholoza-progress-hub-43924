import { useEffect, useMemo, useRef, useState } from "react";

type Props = {
  children: React.ReactNode;
  className?: string;
  inDelayMs?: number;
};

const reduceMotionQuery = () =>
  typeof window !== "undefined" &&
  typeof window.matchMedia !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const ScrollInOut = ({ children, className, inDelayMs = 0 }: Props) => {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(reduceMotionQuery());

  const reducedMotion = useMemo(() => {
    if (typeof window === "undefined") return false;
    return reduceMotionQuery();
  }, []);

  useEffect(() => {
    if (reducedMotion) return;
    const node = ref.current;
    if (!node) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        setVisible(entry.isIntersecting);
      },
      { threshold: 0.15 },
    );

    io.observe(node);
    return () => io.disconnect();
  }, [reducedMotion]);

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0) scale(1)" : "translateY(18px) scale(0.98)",
        filter: visible ? "blur(0px)" : "blur(4px)",
        transition: reducedMotion
          ? undefined
          : `opacity 650ms ease ${inDelayMs}ms, transform 650ms cubic-bezier(0.22, 1, 0.36, 1) ${inDelayMs}ms, filter 650ms ease ${inDelayMs}ms`,
      }}
    >
      {children}
    </div>
  );
};

export default ScrollInOut;
