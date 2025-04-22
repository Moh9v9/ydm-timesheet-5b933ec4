
import { LucideIcon } from "lucide-react";
import ValueUpdater from "./ValueUpdater";
import { SponsorshipType } from "@/lib/types";

interface StatsCardProps {
  icon: LucideIcon;
  title: string;
  value: number;
  colorClass: string;
  isLoading?: boolean;
  breakdown?: Record<SponsorshipType, number>;
}

export const StatsCard = ({ 
  icon: Icon, 
  title, 
  value, 
  colorClass, 
  isLoading = false,
  breakdown 
}: StatsCardProps) => {
  return (
    <div
      className="rounded-lg p-6 border h-auto"
      style={{ 
        transition: "none", 
        backgroundColor: "transparent", 
        boxShadow: "none", 
        background: "none" 
      }}
    >
      <div className="flex items-center w-full mb-2">
        <div className={`p-2 rounded-full ${colorClass} flex-shrink-0`}>
          <Icon className="h-6 w-6" />
        </div>
        <div className="ml-4 flex-grow flex flex-col justify-center">
          <div className="text-sm font-medium text-muted-foreground">
            {title}
          </div>
          <ValueUpdater value={value} isLoading={isLoading} />
        </div>
      </div>
      
      {breakdown && (
        <div className="mt-2 pt-2 border-t border-gray-100 dark:border-gray-700">
          <div className="grid grid-cols-1 gap-1 text-xs">
            {Object.entries(breakdown).map(([type, count]) => (
              <div key={type} className="flex justify-between items-center">
                <span className="text-muted-foreground">{type}:</span>
                <span className="font-medium">{count}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
