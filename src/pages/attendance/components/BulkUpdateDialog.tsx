
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

interface BulkUpdateDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (data: {
    present: boolean;
    startTime: string;
    endTime: string;
    overtimeHours: number;
  }) => void;
}

const BulkUpdateDialog = ({ open, onClose, onConfirm }: BulkUpdateDialogProps) => {
  const [present, setPresent] = useState(true);
  const [startTime, setStartTime] = useState("07:00");
  const [endTime, setEndTime] = useState("17:00");
  const [overtimeHours, setOvertimeHours] = useState(0);

  const handleConfirm = () => {
    onConfirm({
      present,
      startTime: present ? startTime : "",
      endTime: present ? endTime : "",
      overtimeHours: present ? overtimeHours : 0,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Update All Attendance Records</DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="flex items-center gap-4">
            <label className="text-right font-medium">Status:</label>
            <div className="flex items-center">
              <div 
                className={`relative w-12 h-6 rounded-full cursor-pointer transition-colors ${
                  present 
                    ? "attendance-present" 
                    : "attendance-absent"
                }`}
                onClick={() => setPresent(!present)}
              >
                <div 
                  className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${
                    present ? "translate-x-6" : ""
                  }`} 
                />
              </div>
              <span className="ml-2">{present ? "Present" : "Absent"}</span>
            </div>
          </div>

          {present && (
            <>
              <div className="flex items-center gap-4">
                <label className="text-right font-medium">Start Time:</label>
                <Input
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="w-32"
                />
              </div>

              <div className="flex items-center gap-4">
                <label className="text-right font-medium">End Time:</label>
                <Input
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="w-32"
                />
              </div>

              <div className="flex items-center gap-4">
                <label className="text-right font-medium">Overtime Hours:</label>
                <Input
                  type="number"
                  min="0"
                  step="0.5"
                  value={overtimeHours}
                  onChange={(e) => setOvertimeHours(parseFloat(e.target.value) || 0)}
                  className="w-32"
                />
              </div>
            </>
          )}
        </div>

        <DialogFooter>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/90 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
          >
            Update All
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default BulkUpdateDialog;
