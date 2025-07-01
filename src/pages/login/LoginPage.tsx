import { FormEvent, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAppDispatch, useAppSelector } from "../../store/hooks.ts";
import { resetStatus } from "../../store/features/auth/authSlice.ts";
import { Button } from "@/components/ui/button.tsx";
import { Input } from "@/components/ui/input.tsx";
import { loginUser } from "../../store/features/auth/authThunks.ts";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const LoginPage = () => {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { token, status, error } = useAppSelector((state) => state.auth);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    dispatch(loginUser({ value: phone, password }));
  };

  useEffect(() => {
    if (status === "succeeded" && token) {
      toast.success("Login successful");
      navigate("/");
      dispatch(resetStatus());
    }

    if (status === "failed" && error) {
      toast.error(error);
      dispatch(resetStatus());
    }
  }, [status, token, error, navigate, dispatch]);

  return (
    <div className="min-h-screen flex bg-white">
      {/* Left illustration area */}
      <div className="hidden md:flex flex-1 relative overflow-hidden bg-gradient-to-br from-[#e9eafc] to-[#f5f6fa]">
        <img
          src="/bg.jpg"
          alt="Illustration"
          className="absolute inset-0 w-full h-full object-cover"
        />
      </div>
      {/* Right form area */}
      <div className="flex flex-col justify-center items-center flex-1 min-h-screen">
        <div className="bg-white p-10 rounded-2xl shadow-lg w-full max-w-md">
          <h2 className="text-2xl font-bold mb-2 text-gray-900">
            Sign in to MeatGrid.
          </h2>
          <div className="mb-6 text-sm text-gray-600">
            New here?{" "}
            <Link
              to="/register"
              className="text-primary font-medium hover:underline"
            >
              Create an account
            </Link>
          </div>
          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="phone"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Email
              </label>
              <Input
                id="phone"
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Phone Number"
                required
              />
            </div>
            <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Password
                </label>
                <Link
                  to="/reset-password"
                  className="text-primary text-sm font-medium hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative mt-1">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  required
                />
                <button
                  type="button"
                  tabIndex={-1}
                  className="absolute top-1/2 right-4 transform -translate-y-1/2 text-gray-400 hover:text-gray-700 focus:outline-none"
                  onClick={() => setShowPassword((prev) => !prev)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <FaEyeSlash size={20} />
                  ) : (
                    <FaEye size={20} />
                  )}
                </button>
              </div>
            </div>
            <Button
              type="submit"
              className="w-full rounded-md text-white bg-primary hover:bg-primary/90 text-base font-semibold mt-2 h-[50px]"
              disabled={status === "loading"}
            >
              <span>{status === "loading" ? "Logging in..." : "Sign in"}</span>
            </Button>
            <div className="flex items-center my-4">
              <div className="flex-grow border-t border-gray-300"></div>
              <span className="mx-3 text-gray-400 text-sm">OR</span>
              <div className="flex-grow border-t border-gray-300"></div>
            </div>
            <button
              type="button"
              className="w-full border border-gray-300 text-gray-700 rounded-md hover:bg-gray-100 transition duration-200 flex items-center justify-center space-x-2 h-[50px]"
            >
              <img
                src="/images/google-icon.png"
                alt="Google Icon"
                className="h-5 w-5"
              />
              <span>Sign in with Google</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
