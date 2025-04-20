
import { useState, useEffect } from "react";
import { X } from "lucide-react";

export type NotificationType = "success" | "error" | "info" | "warning";

interface NotificationProps {
  type: NotificationType;
  message: string;
  duration?: number;
  onClose?: () => void;
}

export const Notification = ({
  type,
  message,
  duration = 5000,
  onClose
}: NotificationProps) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        if (onClose) setTimeout(onClose, 300); // Allow animation to complete
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  const handleClose = () => {
    setIsVisible(false);
    if (onClose) setTimeout(onClose, 300); // Allow animation to complete
  };

  const getTypeStyles = () => {
    switch (type) {
      case "success":
        return "bg-green-100 border-green-500 text-green-800 dark:bg-green-900/50 dark:text-green-100 dark:border-green-500";
      case "error":
        return "bg-red-100 border-red-500 text-red-800 dark:bg-red-900/50 dark:text-red-100 dark:border-red-500";
      case "warning":
        return "bg-yellow-100 border-yellow-500 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-100 dark:border-yellow-500";
      case "info":
      default:
        return "bg-blue-100 border-blue-500 text-blue-800 dark:bg-blue-900/50 dark:text-blue-100 dark:border-blue-500";
    }
  };

  return (
    <div
      className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-lg shadow-lg border-l-4 transform transition-all duration-300 ${
        isVisible ? "opacity-100" : "opacity-0 translate-x-full"
      } ${getTypeStyles()}`}
      role="alert"
    >
      <div className="flex items-center justify-between">
        <div className="font-medium">{message}</div>
        <button
          onClick={handleClose}
          className="ml-4 text-gray-500 hover:text-gray-800 dark:hover:text-gray-300 focus:outline-none"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
};

export const useNotification = () => {
  const [notifications, setNotifications] = useState<Array<{
    id: string;
    type: NotificationType;
    message: string;
    duration?: number;
  }>>([]);

  const showNotification = (type: NotificationType, message: string, duration = 5000) => {
    const id = `notification-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    setNotifications((prev) => [...prev, { id, type, message, duration }]);
    return id;
  };

  const closeNotification = (id: string) => {
    setNotifications((prev) => prev.filter((notification) => notification.id !== id));
  };

  const success = (message: string, duration = 5000) => 
    showNotification("success", message, duration);
  
  const error = (message: string, duration = 5000) => 
    showNotification("error", message, duration);
  
  const info = (message: string, duration = 5000) => 
    showNotification("info", message, duration);
  
  const warning = (message: string, duration = 5000) => 
    showNotification("warning", message, duration);

  const NotificationContainer = () => (
    <>
      {notifications.map((notification) => (
        <Notification
          key={notification.id}
          type={notification.type}
          message={notification.message}
          duration={notification.duration}
          onClose={() => closeNotification(notification.id)}
        />
      ))}
    </>
  );

  return {
    NotificationContainer,
    showNotification,
    success,
    error,
    info,
    warning,
    closeNotification,
  };
};
