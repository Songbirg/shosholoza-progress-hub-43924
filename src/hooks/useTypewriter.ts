import { useEffect, useMemo, useState } from "react";

const reduceMotionQuery = () =>
  typeof window !== "undefined" &&
  typeof window.matchMedia !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export const useTypewriter = (fullText: string, speedMs = 30, startDelayMs = 0) => {
  const reducedMotion = useMemo(() => {
    if (typeof window === "undefined") return false;
    return reduceMotionQuery();
  }, []);

  const [text, setText] = useState(reducedMotion ? fullText : "");

  useEffect(() => {
    if (reducedMotion) return;

    let mounted = true;
    let i = 0;
    let timeout: number | undefined;

    const start = () => {
      const tick = () => {
        if (!mounted) return;
        i += 1;
        setText(fullText.slice(0, i));
        if (i < fullText.length) {
          timeout = window.setTimeout(tick, speedMs);
        }
      };

      timeout = window.setTimeout(tick, speedMs);
    };

    timeout = window.setTimeout(start, startDelayMs);

    return () => {
      mounted = false;
      if (timeout) window.clearTimeout(timeout);
    };
  }, [fullText, speedMs, startDelayMs, reducedMotion]);

  return text;
};
