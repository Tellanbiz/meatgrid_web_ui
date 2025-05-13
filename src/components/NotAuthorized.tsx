import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";

export default function NotAuthorized() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <h1 className="text-4xl font-bold text-gray-900 mb-4">Access Denied</h1>
      <p className="text-lg text-gray-600 mb-8">
        You don't have permission to access this page. Please contact your administrator if you believe this is an error.
      </p>
      <Button
        onClick={() => navigate(-1)}
        variant="default"
        size="lg"
        className="px-6"
      >
        Go Back
      </Button>
    </div>
  );
} 