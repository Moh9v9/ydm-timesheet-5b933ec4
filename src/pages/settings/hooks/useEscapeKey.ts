
import { useEffect } from "react";

export const useEscapeKey = (isOpen: boolean, onClose: () => void, isDisabled: boolean = false) => {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !isDisabled) {
        onClose();
      }
    };
    
    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
    }
    
    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, isDisabled, onClose]);
};
