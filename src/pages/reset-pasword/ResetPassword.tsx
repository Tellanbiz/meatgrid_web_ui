import { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const ResetPassword = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      toast.success("Password reset successfully");
      navigate("/");
    }, 2000);
  };

  const handleGoBackToSignIn = (e: React.MouseEvent) => {
    e.preventDefault();
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-sm">
        <h2 className="text-4xl font-bold mb-1 text-center text-gray-800">
          Password Reset
        </h2>

        <div className="mb-6 space-x-3 flex items-center justify-center">
          <span className="text-base text-m-secondary">
            We will help you reset your password
          </span>
        </div>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-m-secondary"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              className="mt-1 w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Enter Email Address"
            />
          </div>

          <button
            type="submit"
            className={`w-full ${
              loading ? "bg-gray-400" : "bg-primary-500"
            } text-white py-2 rounded-md hover:bg-blue-900 transition duration-200`}
            disabled={loading}
          >
            {loading ? "Sending..." : "Reset Password"}
          </button>

          <div className="border-b border-gray-400 my-5"></div>
          <div className="mb-4 space-x-3 flex items-center justify-center">
            <span className="text-base text-m-secondary">
              Remembered your password?
            </span>
          </div>

          <button
            onClick={handleGoBackToSignIn}
            className="w-full border border-gray-300 text-primary py-2 rounded-md hover:bg-gray-100 transition duration-200 flex items-center justify-center space-x-2"
          >
            <span>Back to Sign In</span>
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
