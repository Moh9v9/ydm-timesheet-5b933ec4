
import React, { useState } from "react";
import { useTimeZone } from "@/contexts/TimeZoneContext";
import { useModernNotification } from "@/hooks/useModernNotification";

// A selection of common time zones for demonstration.
const allTimeZones = [
  "UTC",
  "Asia/Riyadh",
  "Asia/Dubai",
  "Europe/London",
  "Europe/Berlin",
  "Asia/Kolkata",
  "Asia/Tokyo",
  "America/New_York",
  "America/Chicago",
  "America/Los_Angeles",
  "Australia/Sydney",
];

const TimeZoneSettingsSection = () => {
  const { timeZone, setTimeZone } = useTimeZone();
  const { success } = useModernNotification();
  const [selectedTZ, setSelectedTZ] = useState(timeZone);

  const handleApply = () => {
    setTimeZone(selectedTZ);
    success(`Time zone set to ${selectedTZ}`);
  };

  return (
    <div className="mb-8">
      <h3 className="text-lg font-medium mb-3">Application Time Zone</h3>
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <select
          value={selectedTZ}
          onChange={e => setSelectedTZ(e.target.value)}
          className="border px-3 py-2 rounded-md bg-background dark:bg-muted text-foreground"
        >
          {allTimeZones.map(tz => (
            <option key={tz} value={tz}>{tz}</option>
          ))}
        </select>
        <button
          onClick={handleApply}
          className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
        >
          Apply
        </button>
      </div>
      <p className="text-sm text-muted-foreground mt-2">
        This will affect date/time display throughout the application.
      </p>
    </div>
  );
};

export default TimeZoneSettingsSection;
