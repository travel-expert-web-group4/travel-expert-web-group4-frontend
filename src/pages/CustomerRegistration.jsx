import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast, Toaster } from "react-hot-toast";

const CustomerRegistration = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const emailFromRegister = location.state?.email || "";

  const [formData, setFormData] = useState({
    custFirstName: "",
    custLastName: "",
    custEmail: emailFromRegister,
    custPhone: "",
    custAddress: "",
    custCity: "",
    custProvince: "",
    custPostal: "",
    custCountry: ""
  });

  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const res = await fetch("http://localhost:8080/api/customer/new/1", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          custfirstname: formData.custFirstName,
          custlastname: formData.custLastName,
          custaddress: formData.custAddress,
          custcity: formData.custCity,
          custprov: formData.custProvince,
          custpostal: formData.custPostal,
          custcountry: formData.custCountry,
          custbusphone: formData.custPhone,
          custemail: formData.custEmail.trim().toLowerCase()
        })
      });

      if (!res.ok) {
        const msg = await res.text();
        throw new Error(`❌ Customer creation failed: ${msg}`);
      }

      toast.success("✅ Customer record created. Continue to set password.");
      setTimeout(() => {
        navigate("/register", {
          state: { email: formData.custEmail.trim().toLowerCase() }
        });
      }, 1500);

    } catch (err) {
      console.error("Registration error:", err);
      toast.error(err.message || "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 mt-10 border rounded-xl shadow-md bg-white">
      <Toaster position="top-center" />
      <h2 className="text-3xl font-bold mb-6 text-center text-green-700">New Customer Registration</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex gap-4">
          <input
            type="text"
            name="custFirstName"
            placeholder="First Name"
            required
            value={formData.custFirstName}
            onChange={handleChange}
            className="w-1/2 border px-3 py-2 rounded"
          />
          <input
            type="text"
            name="custLastName"
            placeholder="Last Name"
            required
            value={formData.custLastName}
            onChange={handleChange}
            className="w-1/2 border px-3 py-2 rounded"
          />
        </div>

        <input
          type="email"
          name="custEmail"
          placeholder="Email"
          required
          readOnly
          value={formData.custEmail}
          className="w-full border px-3 py-2 rounded bg-gray-100"
        />
        <input
          type="text"
          name="custPhone"
          placeholder="Phone Number"
          required
          value={formData.custPhone}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
        />
        <input
          type="text"
          name="custAddress"
          placeholder="Street Address"
          required
          value={formData.custAddress}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
        />
        <div className="flex gap-3">
          <input
            type="text"
            name="custCity"
            placeholder="City"
            required
            value={formData.custCity}
            onChange={handleChange}
            className="w-1/2 border px-3 py-2 rounded"
          />
          <input
            type="text"
            name="custProvince"
            placeholder="Province"
            required
            value={formData.custProvince}
            onChange={handleChange}
            className="w-1/2 border px-3 py-2 rounded"
          />
        </div>
        <div className="flex gap-3">
          <input
            type="text"
            name="custPostal"
            placeholder="Postal Code"
            required
            value={formData.custPostal}
            onChange={handleChange}
            className="w-1/2 border px-3 py-2 rounded"
          />
          <input
            type="text"
            name="custCountry"
            placeholder="Country"
            required
            value={formData.custCountry}
            onChange={handleChange}
            className="w-1/2 border px-3 py-2 rounded"
          />
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition"
        >
          {submitting ? "Submitting..." : "Submit Customer Info"}
        </button>
      </form>
    </div>
  );
};

export default CustomerRegistration;
