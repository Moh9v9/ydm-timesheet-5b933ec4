
import { useEffect, useRef } from "react";

interface ValueUpdaterProps {
  value: number;
}

export default function ValueUpdater({ value }: ValueUpdaterProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    // Add a quick highlight effect when number changes
    ref.current.classList.add("bg-accent", "transition", "duration-150");
    setTimeout(() => {
      ref.current && ref.current.classList.remove("bg-accent");
    }, 180);
  }, [value]);

  return (
    <div ref={ref} className="mt-1 text-2xl font-semibold px-2 rounded">
      {value}
    </div>
  );
}
