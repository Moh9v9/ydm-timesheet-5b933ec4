
interface ValueUpdaterProps {
  value: number;
  isLoading?: boolean;
}

export default function ValueUpdater({ value, isLoading = false }: ValueUpdaterProps) {
  return (
    <span
      className={`mt-1 text-2xl font-semibold px-2 rounded inline-block ${isLoading ? 'opacity-50' : ''}`}
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
