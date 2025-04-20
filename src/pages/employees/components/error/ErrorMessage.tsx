
import { RefreshCw } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface ErrorMessageProps {
  message: string;
  onRetry: () => void;
}

export const ErrorMessage = ({ message, onRetry }: ErrorMessageProps) => {
  return (
    <Alert variant="destructive" className="mb-4">
      <AlertTitle>Error loading employees</AlertTitle>
      <AlertDescription className="flex items-center justify-between">
        <span>{message}</span>
        <button 
          onClick={onRetry}
          className="flex items-center gap-2 text-sm font-medium underline hover:text-destructive/90"
        >
          <RefreshCw size={14} />
          Try Again
        </button>
      </AlertDescription>
    </Alert>
  );
};
