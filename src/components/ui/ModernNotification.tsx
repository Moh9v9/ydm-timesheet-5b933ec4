
import { useEffect } from "react";
import { X, Info, Check, AlertCircle } from "lucide-react";

export type ModernNotificationType = "success" | "error" | "info" | "warning";

interface ModernNotificationProps {
  type: ModernNotificationType;
  message: string;
  onClose?: () => void;
  duration?: number;
}

export const ModernNotification = ({
  type,
  message,
  onClose,
  duration = 3500,
}: ModernNotificationProps) => {
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        onClose?.();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  let icon;
  let bg = "";
  let border = "";
  let text = "";

  switch (type) {
    case "success":
      icon = <Check className="w-6 h-6 text-green-500" />;
      bg =
        "bg-gradient-to-br from-green-100 via-green-50 to-green-200 dark:from-green-900 dark:via-green-800 dark:to-green-900";
      border = "border-green-300 dark:border-green-700";
      text = "text-green-800 dark:text-green-100";
      break;
    case "error":
      icon = <AlertCircle className="w-6 h-6 text-red-500" />;
      bg =
        "bg-gradient-to-br from-red-100 via-red-50 to-red-200 dark:from-red-900 dark:via-red-800 dark:to-red-900";
      border = "border-red-300 dark:border-red-700";
      text = "text-red-800 dark:text-red-100";
      break;
    case "info":
      icon = <Info className="w-6 h-6 text-blue-500" />;
      bg =
        "bg-gradient-to-br from-blue-100 via-blue-50 to-blue-200 dark:from-blue-900 dark:via-blue-800 dark:to-blue-900";
      border = "border-blue-300 dark:border-blue-700";
      text = "text-blue-800 dark:text-blue-100";
      break;
    case "warning":
      icon = <AlertCircle className="w-6 h-6 text-yellow-500" />;
      bg =
        "bg-gradient-to-br from-yellow-100 via-yellow-50 to-yellow-200 dark:from-yellow-900 dark:via-yellow-800 dark:to-yellow-900";
      border = "border-yellow-300 dark:border-yellow-700";
      text = "text-yellow-800 dark:text-yellow-100";
      break;
    default:
      icon = <Info className="w-6 h-6 text-blue-500" />;
      bg =
        "bg-gradient-to-br from-blue-100 via-blue-50 to-blue-200 dark:from-blue-900 dark:via-blue-800 dark:to-blue-900";
      border = "border-blue-300 dark:border-blue-700";
      text = "text-blue-800 dark:text-blue-100";
  }

  return (
    <div
      className={`fixed top-6 right-6 z-[9999] flex items-start space-x-3 max-w-xs w-full p-4 rounded-2xl shadow-2xl border ${bg} ${border} glass-morphism ${text} animate-fade-in`}
      style={{ pointerEvents: "auto" }}
      role="alert"
    >
      <div className="flex-shrink-0">{icon}</div>
      <span className="flex-1 font-medium">{message}</span>
      {onClose && (
        <button
          onClick={onClose}
          className="ml-2 text-xl rounded hover:bg-black/10 transition p-1 focus:outline-none"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};
