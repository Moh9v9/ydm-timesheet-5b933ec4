
import { Skeleton } from "@/components/ui/skeleton";

const AttendanceLoadingSkeleton = () => (
  <div className="space-y-4 min-h-[420px] transition-opacity duration-500">
    <Skeleton className="h-12 w-full" />
    <Skeleton className="h-[360px] w-full" />
  </div>
);

export default AttendanceLoadingSkeleton;
