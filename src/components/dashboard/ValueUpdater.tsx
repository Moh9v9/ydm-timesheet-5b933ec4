
import { useEffect, useRef } from "react";

interface ValueUpdaterProps {
  value: number;
}

export default function ValueUpdater({ value }: ValueUpdaterProps) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    // Animate opacity for a smooth number transition
    ref.current.style.opacity = "0.4";
    ref.current.style.transition = "opacity 0.25s";
    setTimeout(() => {
      if (ref.current) {
        ref.current.style.opacity = "1";
      }
    }, 10);
  }, [value]);

  return (
    <span
      ref={ref}
      className="mt-1 text-2xl font-semibold px-2 rounded inline-block"
      style={{ transition: "opacity 0.25s", opacity: 1 }}
    >
      {value}
    </span>
  );
}
