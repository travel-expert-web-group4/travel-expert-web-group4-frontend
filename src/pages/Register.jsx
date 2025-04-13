import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast, Toaster } from "react-hot-toast";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === "password") {
      evaluatePasswordStrength(value);
    }
  };

  const evaluatePasswordStrength = (pwd) => {
    if (!pwd) {
      setPasswordStrength("");
    } else if (pwd.length < 6) {
      setPasswordStrength("Weak");
    } else if (
      pwd.match(/[a-z]/) &&
      pwd.match(/[A-Z]/) &&
      pwd.match(/[0-9]/) &&
      pwd.length >= 8
    ) {
      setPasswordStrength("Strong");
    } else {
      setPasswordStrength("Moderate");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error("❌ Passwords do not match.");
      return;
    }

    setSubmitting(true);

    try {
      const formBody = new URLSearchParams();
      formBody.append("email", formData.email);
      formBody.append("password", formData.password);

      const res = await fetch("http://localhost:8080/api/user/register-user", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: formBody.toString(),
      });

      if (res.status === 201) {
        toast.success("✅ Registered successfully! Redirecting...");
        setTimeout(() => navigate("/login"), 1500);
      } else {
        const errorText = await res.text();
        toast.error(`❌ ${errorText}`);
      }
    } catch (err) {
      console.error("Registration error:", err);
      toast.error("Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 mt-10 border rounded shadow bg-white">
      <Toaster position="top-center" />
      <h2 className="text-2xl font-bold mb-6 text-center">Create Account</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Email Field */}
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
          className="w-full border px-3 py-2 rounded"
        />

        {/* Password Field */}
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
            className="w-full border px-3 py-2 rounded pr-10"
          />
          <span
            onClick={togglePasswordVisibility}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 cursor-pointer"
            title="Toggle password visibility"
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>

        {/* Password Strength Meter */}
        {passwordStrength && (
          <p
            className={`text-sm ${
              passwordStrength === "Strong"
                ? "text-green-600"
                : passwordStrength === "Moderate"
                ? "text-yellow-600"
                : "text-red-600"
            }`}
          >
            Password Strength: {passwordStrength}
          </p>
        )}

        {/* Confirm Password Field */}
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            name="confirmPassword"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            className="w-full border px-3 py-2 rounded pr-10"
          />
          <span
            onClick={togglePasswordVisibility}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 cursor-pointer"
            title="Toggle password visibility"
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          {submitting ? "Registering..." : "Register"}
        </button>
      </form>
    </div>
  );
};

export default Register;
