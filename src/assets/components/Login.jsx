import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaEye, FaEyeSlash } from "react-icons/fa";

function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const onSubmit = (data) => {
    console.log("✅ Login Data:", data);
    toast.success("Login Successful 🎉", { position: "top-center" });
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      navigate("/userdashboard");
    }, 2000);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
      {loading ? (
        // Loader
        <div className="flex flex-col items-center justify-center">
          <div className="w-12 h-12 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-emerald-700 font-semibold text-lg sm:text-xl">
            Logging in...
          </p>
        </div>
      ) : (
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-white shadow-lg rounded-2xl w-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl"
        >
          {/* Header */}
          <div className="flex justify-center items-center bg-green-900 text-white py-5 rounded-t-2xl">
            <h2 className="text-2xl font-bold text-center">Login</h2>
          </div>

          {/* Form Fields */}
          <div className="grid grid-cols-1 gap-6 p-8">
            {/* Username */}
            <div>
              <input
                type="text"
                {...register("username", {
                  required: "Username is required",
                  pattern: {
                    value: /^[A-Za-z0-9._@-]+$/,
                    message:
                      "Only alphanumeric and special chars . _ @ - allowed",
                  },
                })}
                className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="USERNAME"
              />
              {errors.username && (
                <p className="text-red-500 text-sm">
                  {errors.username.message}
                </p>
              )}
            </div>

            {/* Password */}
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                {...register("password", {
                  required: "Password is required",
                  pattern: {
                    value: /^[A-Za-z0-9._@-]+$/,
                    message:
                      "Only alphanumeric and special chars . _ @ - allowed",
                  },
                })}
                className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="PASSWORD"
              />
              <span
                className="absolute right-3 top-3 text-gray-600 cursor-pointer"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
              {errors.password && (
                <p className="text-red-500 text-sm">
                  {errors.password.message}
                </p>
              )}
            </div>
          </div>

          {/* Submit */}
          <div className="px-8 pb-8 flex flex-col sm:flex-row gap-4 sm:justify-end">
            <button
              type="submit"
              className="w-full sm:w-auto py-2 px-4 bg-emerald-800 text-white rounded-lg font-semibold hover:bg-emerald-700 transition"
            >
              Login
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

export default Login;
