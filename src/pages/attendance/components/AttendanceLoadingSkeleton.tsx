
import { Skeleton } from "@/components/ui/skeleton";

const AttendanceLoadingSkeleton = () => (
  <div className="space-y-4 min-h-[420px] transition-all duration-300">
    <Skeleton className="h-12 w-full" />
    <Skeleton className="h-64 w-full" />
  </div>
);

export default AttendanceLoadingSkeleton;
