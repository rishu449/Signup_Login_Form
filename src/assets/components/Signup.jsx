
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { auth, fireDB } from "../../FirebaseConfig";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";

function Signup() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
  } = useForm();

  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  const password = watch("password");
  const username = watch("username");

 const onSubmit = async (data) => {
  setLoading(true);
  try {
    const { user } = await createUserWithEmailAndPassword(
      auth,
      data.email,
      data.password
    );

    await user.getIdToken(true);

    const userRef = doc(fireDB, "users", user.uid);
    await setDoc(
      userRef,
      {
        uid: user.uid,
        name: data.name,
        username: data.username,
        email: data.email,
        phone: `+91${data.phone}`,
        createdAt: serverTimestamp(),
      },
      { merge: true }
    );

    toast.success("Signup Successful 🎉", {
      position: "top-center",
      autoClose: 1500,
    });

    reset();

    // ✅ Do not stop loading here, keep spinner until redirect
    setTimeout(() => {
      navigate("/login");
    }, 1500);
  } catch (error) {
    console.error("❌ Signup Error:", error);
    switch (error.code) {
      case "auth/email-already-in-use":
        toast.error("This email is already registered. Please login!", {
          position: "top-center",
        });
        break;
      case "auth/weak-password":
        toast.error("Password should be at least 6 characters!", {
          position: "top-center",
        });
        break;
      case "auth/invalid-email":
        toast.error("Invalid email address!", {
          position: "top-center",
        });
        break;
      default:
        toast.error(error.message || "Something went wrong. Try again!", {
          position: "top-center",
        });
    }
    setLoading(false); // ✅ only reset loading if there's an error
  }
};


  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
      <ToastContainer position="top-center" />

      {loading ? (
        // Fullscreen Loader
        <div className="flex flex-col items-center justify-center">
          <div className="w-12 h-12 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-emerald-700 font-semibold text-lg sm:text-xl">
            Signing you up...
          </p>
        </div>
      ) : (
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-white shadow-lg rounded-2xl w-full max-w-md sm:max-w-lg md:max-w-2xl lg:max-w-3xl"
        >
          {/* Header */}
          <div className="flex justify-center items-center bg-emerald-800 text-white py-5 rounded-t-2xl">
            <h2 className="text-2xl font-bold text-center">Sign Up</h2>
          </div>

          {/* Form Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-8">
            {/* Name */}
            <div>
              <label className="block mb-1 font-medium">Name</label>
              <input
                type="text"
                {...register("name", {
                  required: "Name is required",
                  pattern: {
                    value: /^[A-Za-z ]+$/,
                    message: "Only alphabets allowed",
                  },
                })}
                className="w-full border rounded-lg px-3 py-2"
                placeholder="Enter your name"
              />
              {errors.name && (
                <p className="text-red-500 text-sm">{errors.name.message}</p>
              )}
            </div>

            {/* Username */}
            <div>
              <label className="block mb-1 font-medium">Username</label>
              <input
                type="text"
                {...register("username", {
                  required: "Username is required",
                  pattern: {
                    value: /^[a-zA-Z0-9._-]+$/,
                    message: "Alphanumeric + . _ - allowed",
                  },
                })}
                className="w-full border rounded-lg px-3 py-2"
                placeholder="Enter your username"
              />
              {errors.username && (
                <p className="text-red-500 text-sm">{errors.username.message}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block mb-1 font-medium">Email</label>
              <input
                type="email"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[a-zA-Z0-9._%+-]+@gmail\.com$/,
                    message: "Must be a valid Google email",
                  },
                })}
                className="w-full border rounded-lg px-3 py-2"
                placeholder="Enter your Gmail"
              />
              {errors.email && (
                <p className="text-red-500 text-sm">{errors.email.message}</p>
              )}
            </div>

            {/* Phone */}
            <div>
              <label className="block mb-1 font-medium">Phone</label>
              <div className="flex">
                <input
                  type="text"
                  value="+91"
                  readOnly
                  className="w-16 border rounded-l-lg px-3 py-2 bg-gray-100"
                />
                <input
                  type="text"
                  {...register("phone", {
                    required: "Phone number is required",
                    pattern: {
                      value: /^[0-9]{10}$/,
                      message: "Enter valid 10-digit phone number",
                    },
                  })}
                  className="w-full border rounded-r-lg px-3 py-2"
                  placeholder="Enter your phone"
                />
              </div>
              {errors.phone && (
                <p className="text-red-500 text-sm">{errors.phone.message}</p>
              )}
            </div>

            {/* Password */}
         {/* Password */}
<div className="relative">
  <label className="block mb-1 font-medium">Password</label>
  <input
    type={showPassword ? "text" : "password"}
    {...register("password", {
      required: "Password is required",
      pattern: {
        value: /^[a-zA-Z0-9@]+$/,   // ✅ Only alphabets, numbers, and @
        message: "Only letters, numbers, and @ are allowed",
      },
      validate: (value) =>
        value !== username || "Password cannot be same as username",
    })}
    className="w-full border rounded-lg px-3 py-2"
    placeholder="Enter your password"
  />
  <span
    onClick={() => setShowPassword(!showPassword)}
    className="absolute top-10 right-3 cursor-pointer text-gray-500"
  >
    {showPassword ? <FaEyeSlash /> : <FaEye />}
  </span>
  {errors.password && (
    <p className="text-red-500 text-sm">{errors.password.message}</p>
  )}
</div>


            {/* Confirm Password */}
            <div className="relative">
              <label className="block mb-1 font-medium">Confirm Password</label>
              <input
                type={showConfirm ? "text" : "password"}
                {...register("confirm", {
                  required: "Please confirm your password",
                  validate: (value) =>
                    value === password || "Passwords do not match",
                })}
                className="w-full border rounded-lg px-3 py-2"
                placeholder="Confirm password"
              />
              <span
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute top-10 right-3 cursor-pointer text-gray-500"
              >
                {showConfirm ? <FaEyeSlash /> : <FaEye />}
              </span>
              {errors.confirm && (
                <p className="text-red-500 text-sm">{errors.confirm.message}</p>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="px-8 pb-8 flex items-center justify-between gap-4 flex-col sm:flex-row">
            <p className="text-sm">
              Already have an account?{" "}
              <span className="underline text-emerald-800">
                <Link to="/login">Login</Link>
              </span>
            </p>

            <button
              type="submit"
              disabled={loading}
              className={`w-full sm:w-auto py-2 px-6 text-white rounded-lg font-semibold transition ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-emerald-800 hover:bg-emerald-700"
              }`}
            >
              Sign Up
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

export default Signup;
