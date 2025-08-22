// src/pages/auth/Signup.jsx
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { auth, fireDB } from "../../FirebaseConfig"; // make sure this path is correct
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
      // 1) Create user in Firebase Auth (this also signs them in)
      const { user } = await createUserWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );

      // 2) Refresh ID token so Firestore rules see authenticated user
      await user.getIdToken(true);

      // 3) Write the profile to users/{uid}
      const userRef = doc(fireDB, "users", user.uid); // ensure collection name is 'users' (lowercase)
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

      toast.success("Signup Successful 🎉", { position: "top-center", autoClose: 1800 });

      // reset form (optional)
      reset();

      // navigate after slight delay so toast is visible
      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (error) {
      console.error("❌ Signup Error:", error);

      // Permission denied (Firestore rules / App Check)
      if (error.code === "permission-denied" || error.message?.toLowerCase().includes("permission")) {
        toast.error(
          "Permission denied: Check Firestore rules (users/{uid}), App Check settings, and that you're using the same Firebase project.",
          { position: "top-center", autoClose: 6000 }
        );
        setLoading(false);
        return;
      }

      // Handle common auth errors
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
          toast.error("Invalid email address!", { position: "top-center" });
          break;
        default:
          // fallback message
          toast.error(error.message || "Something went wrong. Try again!", {
            position: "top-center",
          });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
      {/* Local ToastContainer - if you already have one in App.js you can remove this */}
      <ToastContainer position="top-center" />

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white shadow-lg rounded-2xl w-full max-w-3xl"
      >
        {/* Header */}
        <div className="flex justify-center items-center bg-emerald-800 text-white py-5 rounded-t-2xl">
          <h2 className="text-2xl font-bold text-center">Sign Up</h2>
        </div>

        {/* Inputs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-8">
          {/* Left Column */}
          <div className="space-y-4">
            {/* Name */}
            <div>
              <input
                type="text"
                {...register("name", {
                  required: "Name is required",
                  pattern: {
                    value: /^[A-Za-z\s]+$/,
                    message: "Only alphabets are allowed",
                  },
                })}
                className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                placeholder="NAME"
                disabled={loading}
              />
              {errors.name && (
                <p className="text-red-500 text-sm">{errors.name.message}</p>
              )}
            </div>

            {/* Email (gmail only as requested) */}
            <div>
              <input
                type="email"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[a-zA-Z0-9._%+-]+@gmail\.com$/,
                    message: "Only Gmail address is allowed",
                  },
                })}
                className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                placeholder="EMAIL"
                disabled={loading}
              />
              {errors.email && (
                <p className="text-red-500 text-sm">{errors.email.message}</p>
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
                  validate: (value) =>
                    value !== username || "Password cannot be same as username",
                })}
                className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                placeholder="NEW PASSWORD"
                disabled={loading}
              />
              <span
                className="absolute right-3 top-3 text-gray-600 cursor-pointer"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
              {errors.password && (
                <p className="text-red-500 text-sm">{errors.password.message}</p>
              )}
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-4">
            {/* Username */}
            <div>
              <input
                type="text"
                {...register("username", {
                  required: "Username is required",
                  pattern: {
                    value: /^[A-Za-z0-9._@-]+$/,
                    message: "Only alphanumeric and special chars . _ @ - allowed",
                  },
                })}
                className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                placeholder="USERNAME"
                disabled={loading}
              />
              {errors.username && (
                <p className="text-red-500 text-sm">{errors.username.message}</p>
              )}
            </div>

            {/* Phone with +91 prefix */}
            <div className="flex">
              <input
                type="text"
                value="+91"
                readOnly
                className="w-16 border rounded-l-lg p-3 bg-gray-100 text-gray-700 cursor-not-allowed"
              />
              <input
                type="tel"
                {...register("phone", {
                  required: "Phone is required",
                  pattern: {
                    value: /^[0-9]{10}$/,
                    message: "Enter valid 10-digit phone number",
                  },
                })}
                className="flex-1 border rounded-r-lg p-3 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                placeholder="Phone number"
                disabled={loading}
              />
            </div>
            {errors.phone && (
              <p className="text-red-500 text-sm">{errors.phone.message}</p>
            )}

            {/* Confirm Password */}
            <div className="relative">
              <input
                type={showConfirm ? "text" : "password"}
                {...register("confirm", {
                  required: "Confirm Password is required",
                  validate: (value) => value === password || "Passwords do not match",
                })}
                className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                placeholder="CONFIRM PASSWORD"
                disabled={loading}
              />
              <span
                className="absolute right-3 top-3 text-gray-600 cursor-pointer"
                onClick={() => setShowConfirm(!showConfirm)}
              >
                {showConfirm ? <FaEyeSlash /> : <FaEye />}
              </span>
              {errors.confirm && (
                <p className="text-red-500 text-sm">{errors.confirm.message}</p>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-8 pb-8 flex items-center justify-between gap-4">
          <p className="text-sm">
            Already have an account?{" "}
            <span className="underline text-emerald-800">
              <Link to="/login">Login</Link>
            </span>
          </p>

          <button
            type="submit"
            disabled={loading}
            className={`py-2 px-4 text-white rounded-lg font-semibold transition ${
              loading ? "bg-gray-400 cursor-not-allowed" : "bg-emerald-800 hover:bg-emerald-700"
            }`}
          >
            {loading ? "Signing up..." : "Sign Up"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default Signup;
