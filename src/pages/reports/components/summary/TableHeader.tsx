
import { TableHeader, TableRow, TableHead } from "@/components/ui/table";

const SummaryTableHeader = () => {
  return (
    <TableHeader>
      <TableRow className="hover:bg-transparent dark:hover:bg-transparent">
        <TableHead className="font-medium">Employee</TableHead>
        <TableHead className="font-medium">Date</TableHead>
        <TableHead className="font-medium">Status</TableHead>
        <TableHead className="font-medium">Hours</TableHead>
        <TableHead className="font-medium">Overtime</TableHead>
      </TableRow>
    </TableHeader>
  );
};

export default SummaryTableHeader;
