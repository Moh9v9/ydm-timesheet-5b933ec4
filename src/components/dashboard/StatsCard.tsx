
import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  icon: LucideIcon;
  title: string;
  value: number;
  colorClass: string;
}

export const StatsCard = ({ icon: Icon, title, value, colorClass }: StatsCardProps) => {
  return (
    <div className="bg-card shadow-sm rounded-lg p-6 border h-full flex items-center">
      <div className="flex items-center w-full">
        <div className={`p-2 rounded-full ${colorClass} flex-shrink-0`}>
          <Icon className="h-6 w-6" />
        </div>
        <div className="ml-4 flex-grow">
          <div className="text-sm font-medium text-muted-foreground">
            {title}
          </div>
          <div className="mt-1 text-2xl font-semibold">
            {value}
          </div>
        </div>
      </div>
    </div>
  );
};
