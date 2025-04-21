
import React, { createContext, useContext, useEffect, useState } from "react";

export type TimeZoneContextType = {
  timeZone: string;
  setTimeZone: (tz: string) => void;
};

const TimeZoneContext = createContext<TimeZoneContextType>({
  timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  setTimeZone: () => {},
});

export const useTimeZone = () => useContext(TimeZoneContext);

export const TimeZoneProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const defaultTZ = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const [timeZone, setTimeZoneState] = useState<string>(
    localStorage.getItem("appTimeZone") || defaultTZ
  );

  const setTimeZone = (tz: string) => {
    localStorage.setItem("appTimeZone", tz);
    setTimeZoneState(tz);
  };

  useEffect(() => {
    // Sync with storage on mount
    const stored = localStorage.getItem("appTimeZone");
    if (stored && stored !== timeZone) {
      setTimeZoneState(stored);
    }
  }, []);

  return (
    <TimeZoneContext.Provider value={{ timeZone, setTimeZone }}>
      {children}
    </TimeZoneContext.Provider>
  );
};
