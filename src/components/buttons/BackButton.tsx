import { ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";

interface BackButtonProps {
  className?: string;
}

const BackButton = ({ className = "" }: BackButtonProps) => {
  const navigate = useNavigate();

  return (
    <Button
      variant="link"
      size="sm"
      className={`hover:bg-gray-100 ${className}`}
      onClick={() => navigate(-1)}
    >
      <ChevronLeft className="h-4 w-4" />
      Back
    </Button>
  );
};

export default BackButton;
