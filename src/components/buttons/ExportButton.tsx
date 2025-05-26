import { FileDown, FileText } from "lucide-react";

import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

interface ExportButtonProps {
  onExportExcel?: () => void;
  onExportPDF?: () => void;
}

const ExportButton = ({ onExportExcel, onExportPDF }: ExportButtonProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="px-2">
          <FileDown className="h-4 w-4 mr-2" />
          Export
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {onExportExcel && (
          <DropdownMenuItem onClick={onExportExcel}>
            <FileDown className="h-4 w-4 mr-2" />
            Export to Excel
          </DropdownMenuItem>
        )}
        {onExportPDF && (
          <DropdownMenuItem onClick={onExportPDF}>
            <FileText className="h-4 w-4 mr-2" />
            Export to PDF
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ExportButton;
