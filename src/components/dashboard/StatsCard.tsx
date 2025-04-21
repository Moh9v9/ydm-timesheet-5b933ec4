
import { LucideIcon } from "lucide-react";
import ValueUpdater from "./ValueUpdater";

interface StatsCardProps {
  icon: LucideIcon;
  title: string;
  value: number;
  colorClass: string;
}

export const StatsCard = ({ icon: Icon, title, value, colorClass }: StatsCardProps) => {
  return (
    <div className="bg-card shadow-sm rounded-lg p-6 border h-24">
      <div className="flex items-center w-full">
        <div className={`p-2 rounded-full ${colorClass} flex-shrink-0`}>
          <Icon className="h-6 w-6" />
        </div>
        <div className="ml-4 flex-grow flex flex-col justify-center">
          <div className="text-sm font-medium text-muted-foreground">
            {title}
          </div>
          <ValueUpdater value={value} />
        </div>
      </div>
    </div>
  );
};
