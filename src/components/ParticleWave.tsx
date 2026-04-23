import { useEffect, useMemo, useRef } from "react";

type Props = {
  className?: string;
  intensity?: number;
};

const reduceMotionQuery = () =>
  typeof window !== "undefined" &&
  typeof window.matchMedia !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const ParticleWave = ({ className, intensity = 1 }: Props) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const reducedMotion = useMemo(() => {
    if (typeof window === "undefined") return false;
    return reduceMotionQuery();
  }, []);

  useEffect(() => {
    if (reducedMotion) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    let t = 0;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const pointer = { x: 0.5, y: 0.5 };

    const onPointerMove = (e: PointerEvent) => {
      pointer.x = e.clientX / window.innerWidth;
      pointer.y = e.clientY / window.innerHeight;
    };

    window.addEventListener("pointermove", onPointerMove, { passive: true });

    const resize = () => {
      const { width, height } = canvas.getBoundingClientRect();
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const draw = () => {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;

      ctx.clearRect(0, 0, w, h);

      const cols = Math.floor(44 * intensity);
      const rows = Math.floor(18 * intensity);

      const dx = w / (cols - 1);
      const dy = h / (rows - 1);

      const px = pointer.x * w;
      const py = pointer.y * h;

      ctx.fillStyle = "rgba(255,255,255,0.45)";

      for (let iy = 0; iy < rows; iy += 1) {
        for (let ix = 0; ix < cols; ix += 1) {
          const x = ix * dx;
          const y = iy * dy;

          const dist = Math.hypot(x - px, y - py);
          const influence = Math.max(0, 1 - dist / (Math.min(w, h) * 0.55));

          const wave =
            Math.sin(ix * 0.35 + t * 0.035) +
            Math.cos(iy * 0.45 + t * 0.04);

          const lift = wave * 8 + influence * 18;

          const r = 1.2 + influence * 1.8;

          ctx.globalAlpha = 0.25 + influence * 0.5;
          ctx.beginPath();
          ctx.arc(x, y - lift, r, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      ctx.globalAlpha = 1;

      t += 1;
      raf = requestAnimationFrame(draw);
    };

    const ro = new ResizeObserver(() => resize());
    ro.observe(canvas);
    resize();
    raf = requestAnimationFrame(draw);

    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      ro.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [intensity, reducedMotion]);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      aria-hidden="true"
    />
  );
};

export default ParticleWave;
