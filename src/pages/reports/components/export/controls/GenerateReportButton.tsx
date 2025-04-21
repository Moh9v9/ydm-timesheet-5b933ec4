
import React from 'react';
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

interface GenerateReportButtonProps {
  isGenerating: boolean;
  onClick: () => void;
}

const GenerateReportButton: React.FC<GenerateReportButtonProps> = ({
  isGenerating,
  onClick
}) => {
  return (
    <div className="pt-4 mt-2 border-t">
      <Button
        onClick={onClick}
        disabled={isGenerating}
        className="gap-2"
      >
        <Download size={16} />
        {isGenerating ? "Generating..." : "Generate Report"}
      </Button>
    </div>
  );
};

export default GenerateReportButton;
