import { FaFacebook } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useState, FormEvent } from "react";
import { toast } from "sonner";

const RegisterPage = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleRegister = (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      toast.success("Account created successfully");
      navigate("/login");
    }, 2000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-sm">
        <h2 className="text-4xl font-bold mb-1 text-center text-gray-800">
          Create an Account
        </h2>

        <div className="mb-4 space-x-3 flex items-center justify-center">
          <span className="text-base text-m-secondary">Have an Account?</span>
          <Link to="/login" className="text-base text-primary">
            Sign In
          </Link>
        </div>
        <form className="space-y-5" onSubmit={handleRegister}>
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
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-m-secondary"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              className="mt-1 w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Enter Password"
            />
          </div>
          <button
            type="submit"
            className={`w-full ${
              loading ? "bg-gray-400" : "bg-primary-500"
            } text-white py-2 rounded-md hover:bg-blue-900 transition duration-200`}
            disabled={loading}
          >
            {loading ? "Creating Account..." : "Create Account"}
          </button>
          <div className="mx-10 flex justify-center">
            <span className="text-center text-sm text-gray-600">
              By creating an account, you agree to our{" "}
              <Link to="#" className="text-primary">
                Terms of Service
              </Link>
            </span>
          </div>
          <div className="border-b border-gray-400"></div>
          <div className="flex justify-center">
            <span className="text-center text-sm text-gray-600">
              Or create an account using:
            </span>
          </div>

          <div className="space-y-3 mt-4">
            <button className="w-full border border-gray-300 text-primary py-2 rounded-md hover:bg-gray-100 transition duration-200 flex items-center justify-center space-x-2">
              <img
                src="/images/google-icon.png"
                alt="Google Icon"
                className="h-5 w-5"
              />
              <span>Continue with Google</span>
            </button>

            <button className="w-full border border-gray-300 text-primary py-2 rounded-md hover:bg-gray-100 transition duration-200 flex items-center justify-center space-x-2">
              <FaFacebook className="h-5 w-5 text-blue-600" />
              <span>Continue with Facebook</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;
