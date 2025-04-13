import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast, Toaster } from "react-hot-toast";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useAuth } from "../contexts/AuthContext"; // 👈 make sure the path matches

const Register = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    userType: "customer",
    agentEmail: "",
    agentPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const newValue = name === "email" ? value.trimStart() : value;
    setFormData((prev) => ({ ...prev, [name]: newValue }));

    if (name === "password") {
      evaluatePasswordStrength(value);
    }
  };

  const evaluatePasswordStrength = (pwd) => {
    if (!pwd) {
      setPasswordStrength("");
    } else if (
      pwd.match(/[a-z]/) &&
      pwd.match(/[A-Z]/) &&
      pwd.match(/[0-9]/) &&
      pwd.length >= 8
    ) {
      setPasswordStrength("Strong");
    } else if (pwd.length >= 6) {
      setPasswordStrength("Moderate");
    } else {
      setPasswordStrength("Weak");
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
      const cleanedEmail = formData.email.trim().toLowerCase();

      const formBody = new URLSearchParams();
      formBody.append("email", cleanedEmail);
      formBody.append("password", formData.password);
      formBody.append("role", formData.userType);

      if (formData.userType === "agent") {
        formBody.append("agentEmail", formData.agentEmail);
        formBody.append("agentPassword", formData.agentPassword);
      }

      const res = await fetch("http://localhost:8080/api/user/register-user", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: formBody.toString(),
      });

      if (res.status === 201) {
        const welcomeMessage =
          formData.userType === "agent"
            ? `🎉 Welcome Agent ${formData.email.split("@")[0]}!`
            : `🎉 Welcome ${formData.email.split("@")[0]}!`;

        // 🔐 Try to auto-login
        const loginRes = await fetch("http://localhost:8080/api/user/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: new URLSearchParams({
            email: cleanedEmail,
            password: formData.password,
          }),
        });

        if (loginRes.ok) {
          const token = await loginRes.text();
          login(token);
          localStorage.setItem("welcomeMessage", welcomeMessage);
          toast.success(welcomeMessage);
          navigate("/");
        } else {
          toast.success(welcomeMessage);
          toast("Please log in manually.");
          navigate("/login");
        }
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
    <div className="max-w-md mx-auto p-6 mt-10 border rounded-xl shadow-md bg-white">
      <Toaster position="top-center" />
      <h2 className="text-3xl font-bold mb-6 text-center text-blue-700">Create Account</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium mb-1">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full border px-3 py-2 rounded focus:ring-2 focus:ring-blue-300 outline-none"
            placeholder="Enter your email"
          />
        </div>

        {/* Password */}
        <div className="relative">
          <label htmlFor="password" className="block text-sm font-medium mb-1">Password</label>
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            className="w-full border px-3 py-2 rounded pr-10 focus:ring-2 focus:ring-blue-300 outline-none"
            placeholder="Enter password"
          />
          <span
            onClick={togglePasswordVisibility}
            className="absolute right-3 top-9 text-gray-600 cursor-pointer"
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>

        {/* Password Strength */}
        {passwordStrength && (
          <p className={`text-sm ${
            passwordStrength === "Strong" ? "text-green-600" :
            passwordStrength === "Moderate" ? "text-yellow-600" :
            "text-red-600"
          }`}>
            Password Strength: {passwordStrength}
          </p>
        )}

        {/* Confirm Password */}
        <div className="relative">
  <label htmlFor="confirmPassword" className="block text-sm font-medium mb-1">
    Confirm Password
  </label>
  <input
    type={showPassword ? "text" : "password"}
    name="confirmPassword"
    value={formData.confirmPassword}
    onChange={handleChange}
    required
    className="w-full border px-3 py-2 rounded pr-10 focus:ring-2 focus:ring-blue-300 outline-none"
    placeholder="Confirm password"
  />
  <span
    onClick={togglePasswordVisibility}
    className="absolute right-3 top-9 text-gray-600 cursor-pointer"
  >
    {showPassword ? <FaEyeSlash /> : <FaEye />}
  </span>
</div>


        {/* User Type */}
        <div>
          <label htmlFor="userType" className="block text-sm font-medium mb-1">Registering as</label>
          <select
            name="userType"
            value={formData.userType}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded focus:ring-2 focus:ring-blue-300 outline-none"
          >
            <option value="customer">Customer</option>
            <option value="agent">Agent</option>
          </select>
        </div>

        {/* Agent Fields */}
        {formData.userType === "agent" && (
          <div className="space-y-3 transition-all duration-500 ease-in opacity-100">
            <h4 className="text-md font-semibold text-blue-700 mt-2">Agent Verification</h4>
            <input
              type="email"
              name="agentEmail"
              placeholder="Agent Company Email"
              value={formData.agentEmail}
              onChange={handleChange}
              required
              className="w-full border px-3 py-2 rounded focus:ring-2 focus:ring-blue-300 outline-none"
            />
            <input
              type="password"
              name="agentPassword"
              placeholder="Agent Password"
              value={formData.agentPassword}
              onChange={handleChange}
              required
              className="w-full border px-3 py-2 rounded focus:ring-2 focus:ring-blue-300 outline-none"
            />
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          {submitting ? "Registering..." : "Register"}
        </button>

        {/* Spinner */}
        {submitting && (
          <div className="flex justify-center mt-3">
            <div className="w-6 h-6 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
      </form>
    </div>
  );
};

export default Register;
