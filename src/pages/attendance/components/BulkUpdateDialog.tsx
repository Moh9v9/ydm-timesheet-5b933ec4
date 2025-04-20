import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Check, X } from "lucide-react";

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
          <DialogDescription>
            Set attendance status and times for all employees. Time settings will only apply to present employees.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="flex items-center gap-4">
            <label className="text-right font-medium min-w-24">Quick Set:</label>
            <RadioGroup
              className="flex gap-4"
              defaultValue={present ? "present" : "absent"}
              onValueChange={(value) => setPresent(value === "present")}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="present" id="present" />
                <label htmlFor="present" className="flex items-center text-sm font-medium gap-1 cursor-pointer">
                  <Check className="h-4 w-4 text-primary" />
                  All Present
                </label>
              </div>

              <div className="flex items-center space-x-2">
                <RadioGroupItem value="absent" id="absent" />
                <label htmlFor="absent" className="flex items-center text-sm font-medium gap-1 cursor-pointer">
                  <X className="h-4 w-4 text-destructive" />
                  All Absent
                </label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-4">
            {present && (
              <div className="space-y-4 rounded-lg bg-accent/50 p-4">
                <div className="flex items-center gap-4">
                  <label className="text-right font-medium min-w-24">Start Time:</label>
                  <Input
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="w-32"
                  />
                </div>

                <div className="flex items-center gap-4">
                  <label className="text-right font-medium min-w-24">End Time:</label>
                  <Input
                    type="time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="w-32"
                  />
                </div>

                <div className="flex items-center gap-4">
                  <label className="text-right font-medium min-w-24">Overtime Hours:</label>
                  <Input
                    type="number"
                    min="0"
                    step="0.5"
                    value={overtimeHours}
                    onChange={(e) => setOvertimeHours(parseFloat(e.target.value) || 0)}
                    className="w-32"
                  />
                </div>
              </div>
            )}

            {!present && (
              <p className="text-sm text-muted-foreground italic">
                When marking as absent, start time, end time, and overtime will be cleared.
              </p>
            )}
          </div>
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
