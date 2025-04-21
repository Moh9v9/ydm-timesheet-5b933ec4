
import { Download } from "lucide-react";
import ReportTypeIcon from "./ReportTypeIcon";

interface HeaderSectionProps {
  view: "daily" | "weekly" | "monthly";
}

const HeaderSection = ({ view }: HeaderSectionProps) => {
  return (
    <div className="flex items-center justify-between px-4 py-3 border-b dark:border-gray-700">
      <div className="flex items-center gap-2">
        <ReportTypeIcon view={view} />
        <h3 className="text-sm font-medium capitalize">{view} Summary</h3>
      </div>
      <button className="text-primary hover:text-primary/80 p-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
        <Download size={16} />
      </button>
    </div>
  );
};

export default HeaderSection;
