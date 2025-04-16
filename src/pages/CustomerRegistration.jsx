import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast, Toaster } from "react-hot-toast";
import { motion } from "framer-motion";
import {
  FaArrowLeft,
  FaUser,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaCity,
  FaGlobe,
} from "react-icons/fa";
import { validateRegisterData } from "../utils/validate";

const CustomerRegistration = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const emailFromRegister = location.state?.email || "";
  const autocompleteRef = useRef(null);

  const [formData, setFormData] = useState({
    custFirstName: "",
    custLastName: "",
    custEmail: emailFromRegister,
    custPhone: "",
    custAddress: "",
    custCity: "",
    custProvince: "",
    custPostal: "",
    custCountry: "",
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleAddressSelect = () => {
    const place = autocompleteRef.current.getPlace();
    if (!place || !place.address_components) return;

    const getComponent = (type, format = "long_name") =>
      place.address_components.find((comp) => comp.types.includes(type))?.[format] || "";

    const streetNumber = getComponent("street_number");
    const route = getComponent("route");
    const provinceShort = getComponent("administrative_area_level_1", "short_name");

    setFormData((prev) => ({
      ...prev,
      custAddress: `${streetNumber} ${route}`.trim(),
      custCity: getComponent("locality"),
      custProvince: provinceShort,
      custPostal: getComponent("postal_code"),
      custCountry: getComponent("country", "short_name"),
    }));
  };

  const loadGoogleAutocomplete = () => {
    if (!window.google) return;
    const input = document.getElementById("custAddress");
    if (!input) return;
    const autocomplete = new window.google.maps.places.Autocomplete(input, {
      types: ["address"],
      componentRestrictions: { country: "ca" },
    });
    autocomplete.addListener("place_changed", handleAddressSelect);
    autocompleteRef.current = autocomplete;
  };

  useEffect(() => {
    if (window.google && window.google.maps) loadGoogleAutocomplete();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validation = validateRegisterData(formData);
    if (!validation.valid) {
      toast.error(validation.message);
      setErrors((prev) => ({ ...prev, [validation.field]: validation.message }));
      return;
    }

    try {
      setSubmitting(true);
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
          custemail: formData.custEmail.trim().toLowerCase(),
        }),
      });

      if (!res.ok) {
        const msg = await res.text();
        throw new Error(`Customer creation failed: ${msg}`);
      }

      toast.success(" Customer record created. Continue to set password.");
      setTimeout(() => {
        navigate("/register", {
          state: { email: formData.custEmail.trim().toLowerCase() },
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
    <div className="min-h-screen bg-blue-100 flex items-center justify-center px-4">
      <div className="max-w-4xl w-full p-10 border rounded-xl shadow-md bg-white">
        <Toaster position="top-center" />
        <h2 className="text-3xl font-bold mb-6 text-center text-green-700 font-sans">
          New Customer Registration
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
            {/* Name Fields */}
            <div className="flex gap-4">
              {["custFirstName", "custLastName"].map((field, i) => (
                <div key={field} className="w-1/2">
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    {i === 0 ? "First Name" : "Last Name"}
                  </label>
                  <div className="relative">
                    <FaUser className="absolute left-3 top-3 text-gray-400" />
                    <input
                      type="text"
                      name={field}
                      value={formData[field]}
                      onChange={handleChange}
                      required
                      className="w-full border px-10 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-300"
                    />
                  </div>
                  {errors[field] && (
                    <p className="text-sm text-red-600 mt-1">{errors[field]}</p>
                  )}
                </div>
              ))}
            </div>

            {/* Email */}
            <label className="block text-sm font-semibold text-gray-700 mb-1">Email</label>
            <div className="relative">
              <FaEnvelope className="absolute left-3 top-3 text-gray-400" />
              <input
                type="email"
                name="custEmail"
                value={formData.custEmail}
                onChange={handleChange}
                required
                className="w-full border px-10 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-300"
              />
            </div>
            {errors.custEmail && (
              <p className="text-sm text-red-600 mt-1">{errors.custEmail}</p>
            )}

            {/* Phone */}
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Phone Number <span className="text-gray-400 text-xs">(e.g., 403-123-4567)</span>
            </label>
            <div className="relative">
              <FaPhone className="absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                name="custPhone"
                value={formData.custPhone}
                onChange={handleChange}
                required
                className="w-full border px-10 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-300"
              />
            </div>
            {errors.custPhone && (
              <p className="text-sm text-red-600 mt-1">{errors.custPhone}</p>
            )}

            {/* Address */}
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Street Address <span className="text-gray-400 text-xs">(e.g., 301 8 Ave SW)</span>
            </label>
            <div className="relative">
              <FaMapMarkerAlt className="absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                id="custAddress"
                name="custAddress"
                value={formData.custAddress}
                onChange={handleChange}
                required
                className="w-full border px-10 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-300"
              />
            </div>
            {errors.custAddress && (
              <p className="text-sm text-red-600 mt-1">{errors.custAddress}</p>
            )}

            {/* City + Province */}
            <div className="flex gap-3">
              <div className="w-1/2">
                <label className="block text-sm font-semibold text-gray-700 mb-1">City</label>
                <div className="relative">
                  <FaCity className="absolute left-3 top-3 text-gray-400" />
                  <input
                    type="text"
                    name="custCity"
                    value={formData.custCity}
                    onChange={handleChange}
                    required
                    className="w-full border px-10 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-300"
                  />
                </div>
                {errors.custCity && (
                  <p className="text-sm text-red-600 mt-1">{errors.custCity}</p>
                )}
              </div>
              <div className="w-1/2">
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Province (e.g., AB)
                </label>
                <select
                  name="custProvince"
                  value={formData.custProvince}
                  onChange={handleChange}
                  required
                  className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-300"
                >
                  <option value="">Select Province</option>
                  <option value="AB">Alberta</option>
                  <option value="BC">British Columbia</option>
                  <option value="MB">Manitoba</option>
                  <option value="NB">New Brunswick</option>
                  <option value="NL">Newfoundland and Labrador</option>
                  <option value="NS">Nova Scotia</option>
                  <option value="NT">Northwest Territories</option>
                  <option value="NU">Nunavut</option>
                  <option value="ON">Ontario</option>
                  <option value="PE">Prince Edward Island</option>
                  <option value="QC">Quebec</option>
                  <option value="SK">Saskatchewan</option>
                  <option value="YT">Yukon</option>
                </select>
                {errors.custProvince && (
                  <p className="text-sm text-red-600 mt-1">{errors.custProvince}</p>
                )}
              </div>
            </div>

            {/* Postal + Country */}
            <div className="flex gap-3">
              <div className="w-1/2">
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Postal Code <span className="text-gray-400 text-xs">(e.g., T5S 0E6)</span>
                </label>
                <input
                  type="text"
                  name="custPostal"
                  value={formData.custPostal}
                  onChange={(e) =>
                    handleChange({
                      target: {
                        name: "custPostal",
                        value: e.target.value
                          .toUpperCase()
                          .replace(/[^A-Z0-9]/g, "")
                          .replace(/(.{3})(.{1,3})/, "$1 $2"),
                      },
                    })
                  }
                  required
                  className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-300"
                />
                {errors.custPostal && (
                  <p className="text-sm text-red-600 mt-1">{errors.custPostal}</p>
                )}
              </div>

              <div className="w-1/2">
                <label className="block text-sm font-semibold text-gray-700 mb-1">Country</label>
                <div className="relative">
                  <FaGlobe className="absolute left-3 top-3 text-gray-400" />
                  <select
                    name="custCountry"
                    value={formData.custCountry}
                    onChange={handleChange}
                    required
                    className="w-full border px-10 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-300"
                  >
                    <option value="">Select Country</option>
                    <option value="CA">Canada</option>
                    <option value="US">United States</option>
                  </select>
                </div>
                {errors.custCountry && (
                  <p className="text-sm text-red-600 mt-1">{errors.custCountry}</p>
                )}
              </div>
            </div>
          </motion.div>

          {/* Buttons */}
          <div className="flex justify-between items-center pt-2">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400 transition"
            >
              <FaArrowLeft /> Back
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 transition"
            >
              {submitting ? "Submitting..." : "Submit Customer Info"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CustomerRegistration;
