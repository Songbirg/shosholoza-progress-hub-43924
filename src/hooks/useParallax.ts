import { useEffect, useMemo, useState } from "react";

type ParallaxState = {
  mx: number;
  my: number;
  scrollY: number;
};

const clamp = (v: number, min: number, max: number) => Math.max(min, Math.min(max, v));

const reduceMotionQuery = () =>
  typeof window !== "undefined" &&
  typeof window.matchMedia !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export const useParallax = () => {
  const [state, setState] = useState<ParallaxState>({ mx: 0, my: 0, scrollY: 0 });

  const reducedMotion = useMemo(() => {
    if (typeof window === "undefined") return false;
    return reduceMotionQuery();
  }, []);

  useEffect(() => {
    if (reducedMotion) return;

    let raf = 0;

    const onPointerMove = (e: PointerEvent) => {
      const x = e.clientX / window.innerWidth;
      const y = e.clientY / window.innerHeight;
      const mx = clamp((x - 0.5) * 2, -1, 1);
      const my = clamp((y - 0.5) * 2, -1, 1);

      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        setState((prev) => ({ ...prev, mx, my }));
      });
    };

    const onScroll = () => {
      const scrollY = window.scrollY || 0;
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        setState((prev) => ({ ...prev, scrollY }));
      });
    };

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("scroll", onScroll);
    };
  }, [reducedMotion]);

  return { ...state, reducedMotion };
};
