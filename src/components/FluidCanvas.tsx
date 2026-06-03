import { useEffect, useRef, useMemo } from "react";

type Props = { className?: string };

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  g: number;
  b: number;
  alpha: number;
  life: number;
  maxLife: number;
  size: number;
}

const PALETTE: [number, number, number][] = [
  [22, 163, 74], // green-600
  [21, 128, 61], // green-700
  [234, 179, 8], // yellow-500
  [245, 158, 11], // amber-500
  [74, 222, 128], // green-400
  [253, 224, 71], // yellow-300
  [16, 185, 129], // emerald-500
];

const NUM_PARTICLES = 260;

function flowAngle(x: number, y: number, t: number): number {
  const sc = 0.0025;
  return (
    Math.sin(x * sc + t * 0.018) * Math.cos(y * sc * 0.9) * 2.2 +
    Math.cos(x * sc * 0.55 - y * sc * 0.45 + t * 0.013) * 1.6 +
    Math.sin(x * sc * 0.2 + y * sc * 0.28 - t * 0.011) * 0.9
  );
}

function makeParticle(w: number, h: number): Particle {
  const [r, g, b] = PALETTE[Math.floor(Math.random() * PALETTE.length)];
  const maxLife = 120 + Math.random() * 180;
  return {
    x: Math.random() * w,
    y: Math.random() * h,
    vx: (Math.random() - 0.5) * 0.5,
    vy: (Math.random() - 0.5) * 0.5,
    r,
    g,
    b,
    alpha: 0,
    life: Math.random() * maxLife,
    maxLife,
    size: 1.5 + Math.random() * 2.5,
  };
}

const FluidCanvas = ({ className }: Props) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reducedMotion = useMemo(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    [],
  );

  useEffect(() => {
    if (reducedMotion) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let w = 0,
      h = 0;
    let raf = 0;
    let t = 0;
    const mouse = { x: -9999, y: -9999 };
    const particles: Particle[] = [];

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      particles.length = 0;
      for (let i = 0; i < NUM_PARTICLES; i++) {
        particles.push(makeParticle(w, h));
      }
    };

    const onMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    };
    const onLeave = () => {
      mouse.x = -9999;
      mouse.y = -9999;
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    canvas.addEventListener("mouseleave", onLeave, { passive: true });

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    resize();

    const draw = () => {
      ctx.fillStyle = "rgba(0,0,0,0.07)";
      ctx.fillRect(0, 0, w, h);

      const MOUSE_RADIUS = Math.min(w, h) * 0.18;

      for (const p of particles) {
        p.life += 1;
        if (p.life > p.maxLife) {
          const np = makeParticle(w, h);
          Object.assign(p, np);
          p.life = 0;
          continue;
        }

        const progress = p.life / p.maxLife;
        p.alpha =
          progress < 0.1
            ? progress / 0.1
            : progress > 0.85
              ? (1 - progress) / 0.15
              : 1;

        const angle = flowAngle(p.x, p.y, t);
        p.vx += Math.cos(angle) * 0.036;
        p.vy += Math.sin(angle) * 0.036;

        const dx = p.x - mouse.x;
        const dy = p.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < MOUSE_RADIUS && dist > 1) {
          const force = (1 - dist / MOUSE_RADIUS) * 1.8;
          p.vx += (-dy / dist) * force * 0.12;
          p.vy += (dx / dist) * force * 0.12;
          p.vx += (dx / dist) * force * 0.05;
          p.vy += (dy / dist) * force * 0.05;
        }

        p.vx *= 0.96;
        p.vy *= 0.96;
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0) p.x = w;
        if (p.x > w) p.x = 0;
        if (p.y < 0) p.y = h;
        if (p.y > h) p.y = 0;

        ctx.globalAlpha = p.alpha * 0.75;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgb(${p.r},${p.g},${p.b})`;
        ctx.fill();
      }

      ctx.globalAlpha = 1;
      t += 1;
      raf = requestAnimationFrame(draw);
    };

    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      canvas.removeEventListener("mouseleave", onLeave);
      ro.disconnect();
    };
  }, [reducedMotion]);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      aria-hidden="true"
      style={{ display: "block" }}
    />
  );
};

export default FluidCanvas;
