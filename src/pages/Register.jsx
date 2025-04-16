// import React, { useEffect, useState } from "react";
// import { useNavigate, useLocation } from "react-router-dom";
// import { toast, Toaster } from "react-hot-toast";
// import { FaEye, FaEyeSlash } from "react-icons/fa";
// import { useAuth } from "../contexts/AuthContext";
// import { validateEmail } from "../utils/validate";

// const Register = () => {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const { login } = useAuth();

//   // Load email passed from customer registration (if any)
//   const emailFromCustomerReg = location.state?.email || "";

//   const [formData, setFormData] = useState({
//     email: emailFromCustomerReg,
//     password: "",
//     confirmPassword: "",
//     isAgent: false,
//     agentEmail: "",
//     agentPassword: ""
//   });

//   const [showPassword, setShowPassword] = useState(false);
//   const [passwordStrength, setPasswordStrength] = useState("");
//   const [submitting, setSubmitting] = useState(false);
//   const [emailChecked, setEmailChecked] = useState(!!emailFromCustomerReg);
//   const [customerExists, setCustomerExists] = useState(!!emailFromCustomerReg);
//   const [checkingEmail, setCheckingEmail] = useState(false);

//   const togglePasswordVisibility = () => setShowPassword((prev) => !prev);

//   const handleChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: type === "checkbox" ? checked : value
//     }));

//     if (name === "password") evaluatePasswordStrength(value);
//   };

//   const evaluatePasswordStrength = (pwd) => {
//     if (!pwd) return setPasswordStrength("");
//     if (pwd.match(/[a-z]/) && pwd.match(/[A-Z]/) && pwd.match(/[0-9]/) && pwd.length >= 8) {
//       setPasswordStrength("Strong");
//     } else if (pwd.length >= 6) {
//       setPasswordStrength("Moderate");
//     } else {
//       setPasswordStrength("Weak");
//     }
//   };

//   const handleEmailBlur = async () => {
//     if (!formData.email.trim()) return;
//     if(!validateEmail(formData.email.trim())) {
//       return toast.error("please enter valid email");
//     }
//     const email = formData.email.trim().toLowerCase();
//     setCheckingEmail(true);

//     try {
//       const res = await fetch(`http://localhost:8080/api/user/check-user?email=${encodeURIComponent(email)}`);
//       if (!res.ok) throw new Error("Email check failed");

//       const exists = await res.json();
//       setCustomerExists(exists);
//       setEmailChecked(true);

//       if (!exists) {
//         toast.error("❌ Email not found. Redirecting...");
//         setTimeout(() => {
//           navigate("/customer-registration", { state: { email } });
//         }, 1500);
//       }
//     } catch (err) {
//       console.error("Email check error:", err);
//       toast.error("⚠️ Failed to verify customer.");
//     } finally {
//       setCheckingEmail(false);
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (formData.password !== formData.confirmPassword) {
//       toast.error("❌ Passwords do not match.");
//       return;
//     }

//     setSubmitting(true);

//     try {
//       // 1️⃣ Register WebUser
//       const formBody = new URLSearchParams();
//       formBody.append("email", formData.email.trim().toLowerCase());
//       formBody.append("password", formData.password);
//       formBody.append("role", formData.isAgent ? "agent" : "customer");

//       if (formData.isAgent) {
//         formBody.append("agentEmail", formData.agentEmail);
//         formBody.append("agentPassword", formData.agentPassword);
//       }

//       const registerRes = await fetch("http://localhost:8080/api/user/register-user", {
//         method: "POST",
//         headers: { "Content-Type": "application/x-www-form-urlencoded" },
//         body: formBody.toString()
//       });

//       if (registerRes.status !== 201) {
//         const msg = await registerRes.text();
//         throw new Error(`User registration failed: ${msg}`);
//       }

//       // 2️⃣ Auto Login
//       const loginRes = await fetch("http://localhost:8080/api/user/login", {
//         method: "POST",
//         headers: { "Content-Type": "application/x-www-form-urlencoded" },
//         body: new URLSearchParams({
//           email: formData.email,
//           password: formData.password
//         })
//       });

//       if (!loginRes.ok) {
//         toast.success("🎉 Registered! Please log in.");
//         return navigate("/login");
//       }

//       const { token } = await loginRes.json();
//       login(token);
//       toast.success("✅ Welcome! You’re now registered.");
//       navigate("/");

//     } catch (err) {
//       console.error("Registration error:", err);
//       toast.error(err.message || "Something went wrong.");
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   return (
//     <div className="max-w-md mx-auto p-6 mt-10 border rounded-xl shadow-md bg-white">
//       <Toaster position="top-center" />
//       <h2 className="text-3xl font-bold mb-6 text-center text-blue-700">Register Account</h2>

//       <form onSubmit={handleSubmit} className="space-y-4">
//         {/* Email Field */}
//         <div>
//           <label className="block text-sm font-medium mb-1">Email</label>
//           <input
//             type="email"
//             name="email"
//             onChange={handleChange}
//             onBlur={handleEmailBlur}
//             required
//             value={formData.email}
//             placeholder="Enter your email"
//             className="w-full border px-3 py-2 rounded focus:ring-2 focus:ring-blue-300 outline-none"
//             readOnly={!!emailFromCustomerReg}
//           />
//           {checkingEmail && <p className="text-sm text-gray-500 mt-1">Checking customer records...</p>}
//         </div>

//         {/* Password + Agent Options */}
//         {emailChecked && customerExists && (
//           <>
//             <div className="relative">
//               <label className="block text-sm font-medium mb-1">Password</label>
//               <input
//                 type={showPassword ? "text" : "password"}
//                 name="password"
//                 value={formData.password}
//                 onChange={handleChange}
//                 required
//                 className="w-full border px-3 py-2 rounded pr-10 focus:ring-2 focus:ring-blue-300 outline-none"
//                 placeholder="Create password"
//               />
//               <span
//                 onClick={togglePasswordVisibility}
//                 className="absolute right-3 top-9 text-gray-600 cursor-pointer"
//               >
//                 {showPassword ? <FaEyeSlash /> : <FaEye />}
//               </span>
//             </div>

//             <div className="relative">
//               <label className="block text-sm font-medium mb-1">Confirm Password</label>
//               <input
//                 type={showPassword ? "text" : "password"}
//                 name="confirmPassword"
//                 value={formData.confirmPassword}
//                 onChange={handleChange}
//                 required
//                 className="w-full border px-3 py-2 rounded pr-10 focus:ring-2 focus:ring-blue-300 outline-none"
//                 placeholder="Confirm password"
//               />
//             </div>

//             {passwordStrength && (
//               <p className={`text-sm ${
//                 passwordStrength === "Strong" ? "text-green-600" :
//                 passwordStrength === "Moderate" ? "text-yellow-600" : "text-red-600"
//               }`}>
//                 Password Strength: {passwordStrength}
//               </p>
//             )}

//             {/* Agent Option */}
//             <div className="flex items-center gap-2 mt-2">
//               <input
//                 type="checkbox"
//                 name="isAgent"
//                 checked={formData.isAgent}
//                 onChange={handleChange}
//               />
//               <label className="text-sm">Are you an agent?</label>
//             </div>

//             {formData.isAgent && (
//               <div className="space-y-2 mt-2">
//                 <input
//                   type="email"
//                   name="agentEmail"
//                   value={formData.agentEmail}
//                   onChange={handleChange}
//                   placeholder="Agent company email"
//                   required
//                   className="w-full border px-3 py-2 rounded focus:ring-2 focus:ring-blue-300 outline-none"
//                 />
//                 <input
//                   type="password"
//                   name="agentPassword"
//                   value={formData.agentPassword}
//                   onChange={handleChange}
//                   placeholder="Agent password"
//                   required
//                   className="w-full border px-3 py-2 rounded focus:ring-2 focus:ring-blue-300 outline-none"
//                 />
//               </div>
//             )}

//             <button
//               type="submit"
//               disabled={submitting}
//               className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
//             >
//               {submitting ? "Registering..." : "Register"}
//             </button>
//           </>
//         )}
//       </form>
//     </div>
//   );
// };

// export default Register;


import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast, Toaster } from "react-hot-toast";
import { FaEye, FaEyeSlash, FaCheckCircle } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../contexts/AuthContext";
import { validateEmail } from "../utils/validate";

const Register = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const emailFromCustomerReg = location.state?.email || "";

  const [formData, setFormData] = useState({
    email: emailFromCustomerReg,
    password: "",
    confirmPassword: "",
    isAgent: false,
    agentEmail: "",
    agentPassword: ""
  });

  const [showPassword, setShowPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [emailChecked, setEmailChecked] = useState(!!emailFromCustomerReg);
  const [customerExists, setCustomerExists] = useState(!!emailFromCustomerReg);
  const [checkingEmail, setCheckingEmail] = useState(false);

  const togglePasswordVisibility = () => setShowPassword((prev) => !prev);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));

    if (name === "password") evaluatePasswordStrength(value);
  };

  const evaluatePasswordStrength = (pwd) => {
    if (!pwd) return setPasswordStrength("");
    if (pwd.match(/[a-z]/) && pwd.match(/[A-Z]/) && pwd.match(/[0-9]/) && pwd.length >= 8) {
      setPasswordStrength("Strong");
    } else if (pwd.length >= 6) {
      setPasswordStrength("Moderate");
    } else {
      setPasswordStrength("Weak");
    }
  };

  const handleEmailCheck = async () => {
    if (!formData.email.trim()) return;
    if (!validateEmail(formData.email.trim())) {
      return toast.error("Please enter a valid email address");
    }

    const email = formData.email.trim().toLowerCase();
    setCheckingEmail(true);

    try {
      const res = await fetch(`http://localhost:8080/api/user/check-user?email=${encodeURIComponent(email)}`);
      if (!res.ok) throw new Error("Email check failed");

      const exists = await res.json();
      setCustomerExists(exists);
      setEmailChecked(true);

      if (!exists) {
        toast.error("Email not found. Redirecting to customer registration...");
        setTimeout(() => {
          navigate("/customer-registration", { state: { email } });
        }, 1500);
      }
    } catch (err) {
      console.error("Email check error:", err);
      toast.error("⚠️ Failed to verify customer.");
    } finally {
      setCheckingEmail(false);
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
      formBody.append("email", formData.email.trim().toLowerCase());
      formBody.append("password", formData.password);
      formBody.append("role", formData.isAgent ? "agent" : "customer");

      if (formData.isAgent) {
        formBody.append("agentEmail", formData.agentEmail);
        formBody.append("agentPassword", formData.agentPassword);
      }

      const registerRes = await fetch("http://localhost:8080/api/user/register-user", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: formBody.toString()
      });

      if (registerRes.status !== 201) {
        const msg = await registerRes.text();
        throw new Error(`User registration failed: ${msg}`);
      }

      const loginRes = await fetch("http://localhost:8080/api/user/login", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          email: formData.email,
          password: formData.password
        })
      });

      if (!loginRes.ok) {
        toast.success("🎉 Registered! Please log in.");
        return navigate("/login");
      }

      const { token } = await loginRes.json();
      login(token);
      toast.success("✅ Welcome! You’re now registered.");
      navigate("/");
    } catch (err) {
      console.error("Registration error:", err);
      toast.error(err.message || "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 mt-10 border rounded-xl shadow-md bg-blue-50">
      <Toaster position="top-center" />
      <h2 className="text-3xl font-bold mb-2 text-center text-blue-700">Create Your Account</h2>
      <p className="text-center text-gray-600 mb-6">
        Start by entering your registered email. If you’re new, we’ll guide you to create your customer profile.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <p className="text-sm text-gray-500 mb-2">
            {emailChecked && customerExists ? "Step 2 of 2: Create your account" : "Step 1 of 2: Verify your email"}
          </p>

          <label className="block text-sm font-medium mb-1">Registered Email Address</label>
          <div className="flex gap-2">
            <input
              type="email"
              name="email"
              onChange={handleChange}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleEmailCheck();
                }
              }}
              required
              value={formData.email}
              placeholder="e.g. john@example.com"
              className="w-full border px-3 py-2 rounded focus:ring-2 focus:ring-blue-300 outline-none"
              readOnly={!!emailFromCustomerReg}
            />
            {!emailChecked && (
              <button
                type="button"
                onClick={handleEmailCheck}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center gap-2"
              >
                <FaCheckCircle /> Verify
              </button>
            )}
          </div>
          {checkingEmail && <p className="text-sm text-gray-500 mt-1">🔍 Checking customer records...</p>}
        </div>

        <AnimatePresence>
          {emailChecked && customerExists && (
            <motion.div
              key="register-fields"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.4 }}
              className="space-y-4"
            >
              <div className="relative">
                <label className="block text-sm font-medium mb-1">Create Password</label>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full border px-3 py-2 rounded pr-10 focus:ring-2 focus:ring-blue-300 outline-none"
                  placeholder="Create password"
                />
                <span
                  onClick={togglePasswordVisibility}
                  className="absolute right-3 top-9 text-gray-600 cursor-pointer"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>

              <div className="relative">
                <label className="block text-sm font-medium mb-1">Confirm Password</label>
                <input
                  type={showPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  className="w-full border px-3 py-2 rounded pr-10 focus:ring-2 focus:ring-blue-300 outline-none"
                  placeholder="Re-enter password"
                />
                <span
                  onClick={togglePasswordVisibility}
                  className="absolute right-3 top-9 text-gray-600 cursor-pointer"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>

              {passwordStrength && (
                <p className={`text-sm ${
                  passwordStrength === "Strong" ? "text-green-600" :
                  passwordStrength === "Moderate" ? "text-yellow-600" : "text-red-600"
                }`}>
                  Password Strength: {passwordStrength}
                </p>
              )}

              <div className="flex items-center gap-2 mt-2">
                <input
                  type="checkbox"
                  name="isAgent"
                  checked={formData.isAgent}
                  onChange={handleChange}
                />
                <label className="text-sm">I’m registering as an agent</label>
              </div>

              {formData.isAgent && (
                <div className="space-y-2 mt-2">
                  <input
                    type="email"
                    name="agentEmail"
                    value={formData.agentEmail}
                    onChange={handleChange}
                    placeholder="Agent company email"
                    required
                    className="w-full border px-3 py-2 rounded focus:ring-2 focus:ring-blue-300 outline-none"
                  />
                  <input
                    type="password"
                    name="agentPassword"
                    value={formData.agentPassword}
                    onChange={handleChange}
                    placeholder="Agent password"
                    required
                    className="w-full border px-3 py-2 rounded focus:ring-2 focus:ring-blue-300 outline-none"
                  />
                </div>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
              >
                {submitting ? "Registering..." : "Register"}
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </form>
    </div>
  );
};

export default Register;
