import { useEffect, useRef, useState } from "react";

type Props = {
  children: React.ReactNode;
  className?: string;
  delayMs?: number;
};

const reduceMotionQuery = () =>
  typeof window !== "undefined" &&
  typeof window.matchMedia !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const RevealOnScroll = ({ children, className, delayMs = 0 }: Props) => {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(reduceMotionQuery());

  useEffect(() => {
    if (shown) return;
    const node = ref.current;
    if (!node) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true);
          io.disconnect();
        }
      },
      { threshold: 0.15 },
    );

    io.observe(node);
    return () => io.disconnect();
  }, [shown]);

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: shown ? 1 : 0,
        transform: shown ? "translateY(0)" : "translateY(18px)",
        transition: `opacity 700ms ease ${delayMs}ms, transform 700ms cubic-bezier(0.22, 1, 0.36, 1) ${delayMs}ms`,
      }}
    >
      {children}
    </div>
  );
};

export default RevealOnScroll;
