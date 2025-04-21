
import { FileText } from "lucide-react";
import { CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const EmployeeExportHeader = () => {
  return (
    <CardHeader className="pb-3">
      <div className="flex items-center justify-between">
        <div>
          <CardTitle>Employee Data Export</CardTitle>
          <CardDescription>Export employee information based on filters</CardDescription>
        </div>
        <FileText className="text-gray-400 dark:text-gray-500" size={20} />
      </div>
    </CardHeader>
  );
};

export default EmployeeExportHeader;
