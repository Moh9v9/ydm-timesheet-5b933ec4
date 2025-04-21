
import { User, UserCheck, UserX } from "lucide-react";
import { StatsCard } from "./StatsCard";
import { Skeleton } from "@/components/ui/skeleton";

interface CardInformationProps {
  totalEmployees: number;
  presentToday: number;
  absentToday: number;
  isLoading?: boolean;
}

export const CardInformation = ({
  totalEmployees,
  presentToday,
  absentToday,
  isLoading = false,
}: CardInformationProps) => {
  return (
    <div
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-4"
      style={{ backgroundColor: "transparent" }}
    >
      {isLoading ? (
        <>
          <Skeleton className="h-24" />
          <Skeleton className="h-24" />
          <Skeleton className="h-24" />
        </>
      ) : (
        <>
          <StatsCard
            icon={User}
            title="Total Employees"
            value={totalEmployees}
            colorClass="bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400"
          />
          <StatsCard
            icon={UserCheck}
            title="Total Present"
            value={presentToday}
            colorClass="bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400"
          />
          <StatsCard
            icon={UserX}
            title="Total Absent"
            value={absentToday}
            colorClass="bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-400"
          />
        </>
      )}
    </div>
  );
};
