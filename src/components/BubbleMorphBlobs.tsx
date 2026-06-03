import { useId } from "react";

interface BlobConfig {
  color: string;
  width: number;
  height: number;
  top: string;
  left: string;
  duration: number;
  delay: number;
  tx: number;
  ty: number;
}

const BLOBS: BlobConfig[] = [
  { color: "rgba(22,163,74,0.55)",   width: 280, height: 260, top: "10%",  left: "5%",  duration: 18, delay: 0,   tx: 60,   ty: 50  },
  { color: "rgba(234,179,8,0.45)",   width: 220, height: 240, top: "60%",  left: "80%", duration: 22, delay: 2,   tx: -70,  ty: 45  },
  { color: "rgba(16,185,129,0.50)",  width: 200, height: 220, top: "35%",  left: "55%", duration: 16, delay: 4,   tx: 50,   ty: -60 },
  { color: "rgba(245,158,11,0.40)",  width: 260, height: 200, top: "70%",  left: "20%", duration: 20, delay: 1,   tx: -40,  ty: 55  },
  { color: "rgba(74,222,128,0.35)",  width: 180, height: 190, top: "15%",  left: "70%", duration: 25, delay: 3,   tx: 65,   ty: -40 },
  { color: "rgba(253,224,71,0.35)",  width: 150, height: 160, top: "50%",  left: "10%", duration: 14, delay: 5,   tx: -50,  ty: 60  },
];

const BubbleMorphBlobs = () => {
  const uid = useId().replace(/:/g, "_");

  const keyframes = BLOBS.map((b, i) => `
    @keyframes blobFloat_${uid}_${i} {
      0%   { transform: translate(0px, 0px) scale(1);    border-radius: 60% 40% 70% 30% / 50% 60% 40% 55%; }
      30%  { transform: translate(${b.tx}px, ${Math.round(b.ty * 0.4)}px) scale(1.08); border-radius: 40% 60% 50% 50% / 60% 40% 60% 40%; }
      65%  { transform: translate(${Math.round(b.tx * -0.5)}px, ${b.ty}px) scale(0.94); border-radius: 70% 30% 40% 60% / 40% 70% 30% 60%; }
      100% { transform: translate(${b.tx}px, ${Math.round(b.ty * -0.3)}px) scale(1.05); border-radius: 50% 50% 60% 40% / 70% 30% 60% 40%; }
    }
  `).join("\n");

  return (
    <div
      className="absolute inset-0 overflow-hidden pointer-events-none"
      aria-hidden="true"
    >
      {/* Hidden SVG filter for gooey effect */}
      <svg
        style={{ position: "absolute", width: 0, height: 0 }}
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <filter id={`goo_${uid}`} x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="16" result="blur" />
            <feColorMatrix
              in="blur"
              mode="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 20 -8"
              result="goo"
            />
            <feComposite in="SourceGraphic" in2="goo" operator="atop" />
          </filter>
        </defs>
      </svg>

      {/* Blob container — SVG filter creates the gooey merge effect */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          filter: `url(#goo_${uid})`,
        }}
      >
        {BLOBS.map((blob, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              top: blob.top,
              left: blob.left,
              width: blob.width,
              height: blob.height,
              borderRadius: "60% 40% 70% 30% / 50% 60% 40% 55%",
              background: blob.color,
              animation: `blobFloat_${uid}_${i} ${blob.duration}s ${blob.delay}s ease-in-out infinite alternate`,
              willChange: "transform",
            }}
          />
        ))}
      </div>

      <style>{keyframes}</style>
    </div>
  );
};

export default BubbleMorphBlobs;
