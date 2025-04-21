
import { useState, useCallback, useEffect } from "react";
import { ModernNotification, ModernNotificationType } from "@/components/ui/ModernNotification";

type Notify = (
  type: ModernNotificationType,
  message: string,
  duration?: number
) => void;

export const useModernNotification = () => {
  const [notification, setNotification] = useState<{
    type: ModernNotificationType;
    message: string;
    duration: number;
    id: string;
  } | null>(null);

  // Only allow one notification at a time
  const showNotification: Notify = useCallback(
    (type, message, duration = 3500) => {
      setNotification({ type, message, duration, id: crypto.randomUUID() });
    },
    []
  );

  // Unmount notification
  const closeNotification = useCallback(() => {
    setNotification(null);
  }, []);

  const NotificationContainer = () =>
    notification ? (
      <ModernNotification
        type={notification.type}
        message={notification.message}
        duration={notification.duration}
        onClose={closeNotification}
      />
    ) : null;

  // Handle escape key to close notification
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeNotification();
    };
    if (notification) window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [notification, closeNotification]);

  return {
    showNotification,
    closeNotification,
    success: (msg: string, duration?: number) =>
      showNotification("success", msg, duration),
    error: (msg: string, duration?: number) =>
      showNotification("error", msg, duration),
    info: (msg: string, duration?: number) =>
      showNotification("info", msg, duration),
    warning: (msg: string, duration?: number) =>
      showNotification("warning", msg, duration),
    NotificationContainer,
  };
};
