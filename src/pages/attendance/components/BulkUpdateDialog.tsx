
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
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Check, X, Clock } from "lucide-react";

interface BulkUpdateDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (data: {
    updateType: "presence" | "times";
    present: boolean;
    startTime: string;
    endTime: string;
    overtimeHours: number;
    note: string;
  }) => void;
}

const BulkUpdateDialog = ({ open, onClose, onConfirm }: BulkUpdateDialogProps) => {
  const [updateType, setUpdateType] = useState<"presence" | "times">("presence");
  const [present, setPresent] = useState(true);
  const [startTime, setStartTime] = useState("07:00");
  const [endTime, setEndTime] = useState("17:00");
  const [overtimeHours, setOvertimeHours] = useState(0);
  const [note, setNote] = useState("");

  const handleConfirm = () => {
    onConfirm({
      updateType,
      present: updateType === "presence" ? present : true,
      startTime: updateType === "presence" ? (present ? startTime : "") : startTime,
      endTime: updateType === "presence" ? (present ? endTime : "") : endTime,
      overtimeHours: updateType === "presence" ? (present ? overtimeHours : 0) : overtimeHours,
      note
    });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Update All Attendance Records</DialogTitle>
          <DialogDescription>
            Choose whether to update attendance status or modify times for currently present employees.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="flex items-center gap-4">
            <label className="text-right font-medium min-w-24">Update Type:</label>
            <RadioGroup
              className="flex gap-4"
              defaultValue="presence"
              onValueChange={(value) => setUpdateType(value as "presence" | "times")}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="presence" id="presence" />
                <label htmlFor="presence" className="flex items-center text-sm font-medium gap-1 cursor-pointer">
                  Set Presence Status
                </label>
              </div>

              <div className="flex items-center space-x-2">
                <RadioGroupItem value="times" id="times" />
                <label htmlFor="times" className="flex items-center text-sm font-medium gap-1 cursor-pointer">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  Update Times Only
                </label>
              </div>
            </RadioGroup>
          </div>

          {updateType === "presence" && (
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
          )}

          <div className="space-y-4">
            {(updateType === "times" || (updateType === "presence" && present)) && (
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
                  <label className="text-right font-medium min-w-24">Overtime (hours):</label>
                  <Input
                    type="number"
                    min={0}
                    step={0.5}
                    value={overtimeHours}
                    onChange={(e) => setOvertimeHours(Number(e.target.value))}
                    className="w-32"
                  />
                </div>

                <div className="flex items-center gap-4">
                  <label className="text-right font-medium min-w-24">Note:</label>
                  <Textarea
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="Add a note for all employees..."
                    className="min-h-[80px] resize-none"
                  />
                </div>
              </div>
            )}

            {updateType === "presence" && !present && (
              <p className="text-sm text-muted-foreground italic">
                When marking as absent, start time, end time, and overtime will be cleared.
              </p>
            )}

            {updateType === "times" && (
              <p className="text-sm text-muted-foreground italic">
                Time changes will only apply to employees who are currently marked as present.
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
