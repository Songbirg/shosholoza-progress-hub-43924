import { useState, useEffect, useRef } from "react";

type Props = {
  texts: string[];
  typingSpeed?: number;
  deletingSpeed?: number;
  pauseAfterType?: number;
  pauseAfterDelete?: number;
  className?: string;
  cursorClassName?: string;
};

type Phase = "typing" | "pausing" | "deleting" | "waiting";

const TypewriterText = ({
  texts,
  typingSpeed = 70,
  deletingSpeed = 40,
  pauseAfterType = 1800,
  pauseAfterDelete = 400,
  className = "",
  cursorClassName = "",
}: Props) => {
  const [displayed, setDisplayed] = useState("");
  const [phase, setPhase] = useState<Phase>("typing");
  const [textIndex, setTextIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const clear = () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };

    const current = texts[textIndex] ?? "";

    if (phase === "typing") {
      if (charIndex < current.length) {
        timeoutRef.current = setTimeout(() => {
          setDisplayed(current.slice(0, charIndex + 1));
          setCharIndex((c) => c + 1);
        }, typingSpeed);
      } else {
        timeoutRef.current = setTimeout(
          () => setPhase("pausing"),
          pauseAfterType,
        );
      }
    } else if (phase === "pausing") {
      setPhase("deleting");
    } else if (phase === "deleting") {
      if (charIndex > 0) {
        timeoutRef.current = setTimeout(() => {
          setCharIndex((c) => c - 1);
          setDisplayed(current.slice(0, charIndex - 1));
        }, deletingSpeed);
      } else {
        timeoutRef.current = setTimeout(() => {
          setTextIndex((i) => (i + 1) % texts.length);
          setPhase("typing");
        }, pauseAfterDelete);
      }
    }

    return clear;
  }, [
    phase,
    charIndex,
    textIndex,
    texts,
    typingSpeed,
    deletingSpeed,
    pauseAfterType,
    pauseAfterDelete,
  ]);

  const isTypingOrPausing = phase === "typing" || phase === "pausing";

  return (
    <span className={className}>
      {displayed}
      <span
        className={`inline-block w-[2px] h-[1em] ml-0.5 align-middle bg-current ${
          isTypingOrPausing ? "animate-pulse" : "opacity-100"
        } ${cursorClassName}`}
        aria-hidden="true"
      />
    </span>
  );
};

export default TypewriterText;
