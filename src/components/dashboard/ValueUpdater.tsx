
interface ValueUpdaterProps {
  value: number;
}

export default function ValueUpdater({ value }: ValueUpdaterProps) {
  return (
    <span
      className="mt-1 text-2xl font-semibold px-2 rounded inline-block"
      style={{ 
        transition: "none", 
        backgroundColor: "transparent", 
        background: "none" 
      }}
    >
      {value}
    </span>
  );
}
