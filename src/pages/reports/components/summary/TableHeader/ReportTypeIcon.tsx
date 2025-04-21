
import { Calendar, FileSpreadsheet, FileText } from "lucide-react";

interface ReportTypeIconProps {
  view: "daily" | "weekly" | "monthly";
}

const ReportTypeIcon = ({ view }: ReportTypeIconProps) => {
  switch (view) {
    case "daily":
      return <Calendar size={16} className="text-blue-500" />;
    case "weekly":
      return <FileSpreadsheet size={16} className="text-green-500" />;
    case "monthly":
      return <FileText size={16} className="text-purple-500" />;
    default:
      return <Calendar size={16} className="text-blue-500" />;
  }
};

export default ReportTypeIcon;
