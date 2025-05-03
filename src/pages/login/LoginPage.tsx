import { FormEvent, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAppDispatch, useAppSelector } from "../../store/hooks.ts";
import { resetStatus } from "../../store/features/auth/authSlice.ts";
import { Button } from "../../components/ui/button.tsx";
import { loginUser } from "../../store/features/auth/authThunks.ts";

const LoginPage = () => {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");

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
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-sm">
        <h2 className="text-4xl font-bold mb-5 text-center text-gray-800">
          Welcome Back!
        </h2>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div>
            <label
              htmlFor="phone"
              className="block text-sm font-medium text-m-secondary"
            >
              Phone
            </label>
            <input
              id="phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="mt-1 w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Enter Phone Number"
              required
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
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Enter Password"
              required
            />
          </div>

          <div className="flex items-center space-x-2 mb-4">
            <input
              id="remember"
              type="checkbox"
              className="h-4 w-4 text-blue-600 focus:ring-primary border-gray-300 rounded"
            />
            <label htmlFor="remember" className="text-sm text-m-secondary">
              Keep me signed in
            </label>
          </div>

          <Button
            type="submit"
            className="w-full py-2 rounded-md text-white"
            disabled={status === "loading"}
          >
            <span>{status === "loading" ? "Logging in..." : "Login"}</span>
          </Button>

          <div className="flex justify-end">
            <span className="text-center text-sm text-gray-600">
              <Link to="/reset-password" className="text-primary">
                Forgot your password?
              </Link>
            </span>
          </div>

          <div className="border-b border-gray-400 my-4"></div>

          <div className="space-y-3 mt-4">
            <button className="w-full border border-gray-300 text-primary py-2 rounded-md hover:bg-gray-100 transition duration-200 flex items-center justify-center space-x-2">
              <img
                src="/images/google-icon.png"
                alt="Google Icon"
                className="h-5 w-5"
              />
              <span>Continue with Google</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
