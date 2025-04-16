// import React, { useEffect, useState, useRef } from "react";
// import { useAuth } from "../contexts/AuthContext";
// import { toast, ToastContainer } from "react-toastify";
// import 'react-toastify/dist/ReactToastify.css';

// const BACKEND_URL = "http://localhost:8080";

// const UserProfile = () => {
//   const { user, token } = useAuth();
//   const [customer, setCustomer] = useState(null);
//   const [formData, setFormData] = useState({});
//   const [editMode, setEditMode] = useState(false);
//   const [loading, setLoading] = useState(true);
//   const [saving, setSaving] = useState(false);
//   const [showSavedCheck, setShowSavedCheck] = useState(false);
//   const [customerType, setCustomerType] = useState({ name: "", discount: 0 });
//   const [profileImage, setProfileImage] = useState(null);
//   const [imageTimestamp, setImageTimestamp] = useState(Date.now()); // ⏱️ For cache busting
//   const [points, setPoints] = useState(0);
//   const fileInputRef = useRef(null);

//   useEffect(() => {
//     const fetchCustomerProfile = async () => {
//       try {
//         const res = await fetch(`${BACKEND_URL}/api/user/${user?.webUserId}`, {
//           headers: { Authorization: `Bearer ${token}` }
//         });

//         if (!res.ok) throw new Error("Failed to fetch WebUser profile");

//         const userData = await res.json();

//         setProfileImage(userData.profileImage || null);
//         setImageTimestamp(Date.now());
//         setPoints(userData.points || 0);

//         const customerData = userData.customer;
//         if (!customerData) throw new Error("Customer info missing");

//         setCustomer(customerData);
//         setFormData(customerData);

//         const typeRes = await fetch(`${BACKEND_URL}/api/customer/${customerData.id}/customer-type`, {
//           headers: { Authorization: `Bearer ${token}` }
//         });

//         if (typeRes.ok) {
//           const typeData = await typeRes.json();
//           setCustomerType({
//             name: typeData?.name || "Unknown",
//             discount: typeData?.discountPercentage || 0,
//           });
//         }
//       } catch (err) {
//         console.error("❌ Error loading profile:", err);
//         toast.error("❌ Failed to load user profile");
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (user?.webUserId && token) {
//       fetchCustomerProfile();
//     }
//   }, [user, token]);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({ ...prev, [name]: value }));
//   };

//   const handleSave = async () => {
//     setSaving(true);
//     try {
//       const res = await fetch(`${BACKEND_URL}/api/customer/${customer.id}`, {
//         method: "PUT",
//         headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
//         body: JSON.stringify(formData),
//       });

//       if (!res.ok) throw new Error("Save failed");

//       toast.success("✅ Profile saved");
//       setShowSavedCheck(true);
//       setTimeout(() => setShowSavedCheck(false), 2000);
//       setCustomer({ ...customer, ...formData });
//       setEditMode(false);
//     } catch {
//       toast.error("❌ Error saving profile");
//     } finally {
//       setSaving(false);
//     }
//   };

//   const handleImageUpload = async (e) => {
//     const file = e.target.files[0];
//     if (!file || !customer) return;

//     const formDataData = new FormData();
//     formDataData.append("image", file);

//     try {
//       const res = await fetch(`${BACKEND_URL}/api/customer/${customer.id}/profile-picture`, {
//         method: "POST",
//         headers: { Authorization: `Bearer ${token}` },
//         body: formDataData,
//       });

//       if (!res.ok) throw new Error("Upload failed");

//       const data = await res.json();
//       setProfileImage(data.profileImage);
//       setImageTimestamp(Date.now()); // ⏱️ Force refresh
//       toast.success("✅ Image uploaded");
//     } catch (err) {
//       console.error("❌ Upload failed:", err);
//       toast.error("❌ Image upload failed");
//     } finally {
//       fileInputRef.current.value = ""; // reset input
//     }
//   };

//   const handleDeleteImage = async () => {
//     if (!customer) return;

//     try {
//       const res = await fetch(`${BACKEND_URL}/api/customer/${customer.id}/profile-picture`, {
//         method: "DELETE",
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       if (!res.ok) throw new Error("Delete failed");

//       setProfileImage(null);
//       toast.success("🗑️ Image deleted");
//     } catch (err) {
//       console.error("❌ Delete failed:", err);
//       toast.error("❌ Failed to delete image");
//     }
//   };

//   const getBadgeColor = (type) => {
//     switch (type.toLowerCase()) {
//       case "bronze": return "bg-yellow-800 text-white";
//       case "silver": return "bg-gray-400 text-white";
//       case "gold": return "bg-yellow-400 text-black";
//       case "platinum": return "bg-blue-500 text-white";
//       default: return "bg-gray-300 text-black";
//     }
//   };

//   if (loading) return <div className="p-6 text-center text-gray-600">⏳ Loading user profile...</div>;
//   if (!customer) return <div className="p-6 text-center text-red-600">❌ Customer info not found.</div>;

//   return (
//     <div className="max-w-3xl mx-auto bg-white shadow-md rounded p-6 mt-10">
//       <h2 className="text-2xl font-bold text-blue-700 mb-4">My Profile</h2>

//       {/* 👤 Profile Image Upload */}
//       <div className="flex items-center gap-6 mb-6">
//         <div className="relative group w-24 h-24">
//           <img
//             src={
//               profileImage
//                 ? `${BACKEND_URL}${profileImage}?t=${imageTimestamp}`
//                 : "/default-avatar.png"
//             }
//             alt="Profile"
//             className="w-24 h-24 rounded-full border object-cover"
//             onClick={() => fileInputRef.current.click()}
//             style={{ cursor: "pointer" }}
//             title="Click to change"
//           />
//           <input
//             type="file"
//             accept="image/*"
//             ref={fileInputRef}
//             onChange={handleImageUpload}
//             className="hidden"
//           />
//           {profileImage && (
//             <button
//               onClick={handleDeleteImage}
//               className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full p-1 hover:bg-red-600"
//               title="Remove image"
//             >
//               ✕
//             </button>
//           )}
//         </div>

//         <div className="flex flex-col text-sm text-gray-700">
//   <div>
//     <strong>Type:</strong>{" "}
//     <span className={`inline-block px-2 py-1 text-sm rounded ${getBadgeColor(customerType.name)}`}>
//       {customerType.name} ({Math.round(customerType.discount * 100)}% off)
//     </span>
//   </div>
//   <div>
//     <strong>Points:</strong>{" "}
//     <span className="text-green-600 font-semibold">{points}</span>
//   </div>
//   {user?.role === "ROLE_AGENT" && (
//     <div className="mt-1 text-sm text-blue-700">
//       🎉 As a verified <strong>Agent</strong>, you enjoy a <strong>10% discount</strong> on all bookings!
//     </div>
//   )}
// </div>

//       </div>

//       {/* 📝 Form */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-800">
//         {[
//           "custfirstname",
//           "custlastname",
//           "custemail",
//           "custhomephone",
//           "custaddress",
//           "custcity",
//           "custprov",
//           "custpostal",
//           "custcountry"
//         ].map((field) => (
//           <div key={field}>
//             <strong>{field.replace("cust", "").replace(/^[a-z]/, (c) => c.toUpperCase())}:</strong>{" "}
//             {editMode ? (
//               <input
//                 type="text"
//                 name={field}
//                 value={formData[field] || ""}
//                 onChange={handleChange}
//                 className="border px-2 py-1 rounded w-full"
//               />
//             ) : (
//               customer[field] || "Not provided"
//             )}
//           </div>
//         ))}
//       </div>

//       {/* 💾 Save/Cancel */}
//       <div className="flex justify-end gap-4 mt-6 items-center">
//         {showSavedCheck && <span className="text-green-600 font-semibold">✓ Saved</span>}
//         {editMode ? (
//           <>
//             <button
//               onClick={handleSave}
//               disabled={saving}
//               className={`px-4 py-2 rounded text-white ${saving ? "bg-green-400 cursor-wait" : "bg-green-600 hover:bg-green-700"}`}
//             >
//               {saving ? "Saving..." : "Save"}
//             </button>
//             <button
//               onClick={() => {
//                 setEditMode(false);
//                 setFormData(customer);
//               }}
//               className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded"
//             >
//               Cancel
//             </button>
//           </>
//         ) : (
//           <button
//             onClick={() => setEditMode(true)}
//             className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
//           >
//             Edit Profile
//           </button>
//         )}
//       </div>

//       <ToastContainer position="top-right" autoClose={3000} />
//     </div>
//   );
// };

// export default UserProfile;
import React, { useEffect, useState, useRef } from "react";
import { useAuth } from "../contexts/AuthContext";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import {
  validateName,
  validatePhoneNumber,
  validateAddress,
  validateCity,
  validateProvince,
  validatePostalCode,
  validateCountry,
  validateEmail,
} from "../utils/validate";

const BACKEND_URL = "http://localhost:8080";

const countries = ["Canada", "United States", "Mexico"];

const regionOptions = {
  Canada: ["AB", "BC", "MB", "NB", "NL", "NS", "NT", "NU", "ON", "PE", "QC", "SK", "YT"],
 "United States": [
  "AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", "GA",
  "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD",
  "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ",
  "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC",
  "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY"
],
  Mexico: ["AG", "BC", "CMX", "CHH", "GUA", "JAL", "NLE", "OAX", "PUE", "SON", "YUC"]
};

const UserProfile = () => {
  const { user, token } = useAuth();
  const [customer, setCustomer] = useState(null);
  const [formData, setFormData] = useState({});
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showSavedCheck, setShowSavedCheck] = useState(false);
  const [customerType, setCustomerType] = useState({ name: "", discount: 0 });
  const [profileImage, setProfileImage] = useState(null);
  const [imageTimestamp, setImageTimestamp] = useState(Date.now());
  const [points, setPoints] = useState(0);
  const [formErrors, setFormErrors] = useState({});
  const fileInputRef = useRef(null);

  const isAgent = user?.role === "ROLE_AGENT";

  const selectedCountry = formData.custcountry || "Canada";
  const regionList = regionOptions[selectedCountry] || [];

  useEffect(() => {
    const fetchCustomerProfile = async () => {
      try {
        const res = await fetch(`${BACKEND_URL}/api/user/${user?.webUserId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (!res.ok) throw new Error("Failed to fetch WebUser profile");

        const userData = await res.json();
        setProfileImage(userData.profileImage || null);
        setImageTimestamp(Date.now());
        setPoints(userData.points || 0);

        const customerData = userData.customer;
        if (!customerData) throw new Error("Customer info missing");

        setCustomer(customerData);
        setFormData(customerData);

        const typeRes = await fetch(`${BACKEND_URL}/api/customer/${customerData.id}/customer-type`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (typeRes.ok) {
          const typeData = await typeRes.json();
          setCustomerType({
            name: typeData?.name || "Unknown",
            discount: typeData?.discountPercentage || 0,
          });
        }
      } catch (err) {
        console.error(" Error loading profile:", err);
        toast.error("Failed to load user profile");
      } finally {
        setLoading(false);
      }
    };

    if (user?.webUserId && token) {
      fetchCustomerProfile();
    }
  }, [user, token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "custcountry") {
      setFormData((prev) => ({
        ...prev,
        custcountry: value,
        custprov: "" // reset province when country changes
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const formatPostalCode = (value) => {
    const cleaned = value.replace(/\s+/g, "").toUpperCase();
    return cleaned.length > 3
      ? `${cleaned.slice(0, 3)} ${cleaned.slice(3, 6)}`
      : cleaned;
  };

  const validateForm = () => {
    const errors = {};
  
    if (!validateName(formData.custfirstname)) errors.custfirstname = "Invalid first name";
    if (!validateName(formData.custlastname)) errors.custlastname = "Invalid last name";
    if (!validateEmail(formData.custemail)) errors.custemail = "Invalid email";
    if (formData.custhomephone && !validatePhoneNumber(formData.custhomephone)) errors.custhomephone = "Invalid phone number";
  
    // ✳️ Simplified address validation:
    if (!formData.custaddress || formData.custaddress.trim().length < 5) {
      errors.custaddress = "Address must be at least 5 characters";
    }
  
    if (!validateCity(formData.custcity)) errors.custcity = "Invalid city";
    if (!validateProvince(formData.custprov)) errors.custprov = "Invalid province/state";
    if (!validatePostalCode(formData.custpostal)) errors.custpostal = "Invalid postal code";
    if (!validateCountry(formData.custcountry)) errors.custcountry = "Invalid country";
  
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      toast.error("Please fix the errors before saving.");
      return;
    }

    setSaving(true);
    try {
      const res = await fetch(`${BACKEND_URL}/api/customer/${customer.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Save failed");

      toast.success(" Profile saved");
      setShowSavedCheck(true);
      setTimeout(() => setShowSavedCheck(false), 2000);
      setCustomer({ ...customer, ...formData });
      setEditMode(false);
    } catch {
      toast.error(" Error saving profile");
    } finally {
      setSaving(false);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file || !customer) return;

    const formDataData = new FormData();
    formDataData.append("image", file);

    try {
      const res = await fetch(`${BACKEND_URL}/api/customer/${customer.id}/profile-picture`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formDataData,
      });

      if (!res.ok) throw new Error("Upload failed");

      const data = await res.json();
      setProfileImage(data.profileImage);
      setImageTimestamp(Date.now());
      toast.success("✅ Image uploaded");
    } catch (err) {
      console.error(" Upload failed:", err);
      toast.error("Image upload failed");
    } finally {
      fileInputRef.current.value = "";
    }
  };

  const handleDeleteImage = async () => {
    if (!customer) return;

    try {
      const res = await fetch(`${BACKEND_URL}/api/customer/${customer.id}/profile-picture`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Delete failed");

      setProfileImage(null);
      toast.success("🗑️ Image deleted");
    } catch (err) {
      console.error(" Delete failed:", err);
      toast.error(" Failed to delete image");
    }
  };

  const getBadgeColor = (type) => {
    switch (type.toLowerCase()) {
      case "bronze": return "bg-yellow-800 text-white";
      case "silver": return "bg-gray-400 text-white";
      case "gold": return "bg-yellow-400 text-black";
      case "platinum": return "bg-blue-500 text-white";
      default: return "bg-gray-300 text-black";
    }
  };

  if (loading) return <div className="p-6 text-center text-gray-600">⏳ Loading user profile...</div>;
  if (!customer) return <div className="p-6 text-center text-red-600">❌ Customer info not found.</div>;

  return (
    <div className="max-w-3xl mx-auto bg-white shadow-md rounded p-6 mt-10">
      <h2 className="text-2xl font-bold text-blue-700 mb-4">My Profile</h2>

      {/* 👤 Profile Image */}
      <div className="flex items-center gap-6 mb-6">
        <div className="relative group w-24 h-24">
          <img
            src={
              profileImage
                ? `${BACKEND_URL}${profileImage}?t=${imageTimestamp}`
                : "/default-avatar.png"
            }
            alt="Profile"
            className="w-24 h-24 rounded-full border object-cover"
            onClick={() => fileInputRef.current.click()}
            style={{ cursor: "pointer" }}
            title="Click to change"
          />
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleImageUpload}
            className="hidden"
          />
          {profileImage && (
            <button
              onClick={handleDeleteImage}
              className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full p-1 hover:bg-red-600"
              title="Remove image"
            >
              ✕
            </button>
          )}
        </div>

        <div className="flex flex-col text-sm text-gray-700">
          <div>
            <strong>Type:</strong>{" "}
            <span className={`inline-block px-2 py-1 text-sm rounded ${getBadgeColor(customerType.name)}`}>
              {customerType.name} ({Math.round(customerType.discount * 100)}% off)
            </span>
          </div>
          <div>
            <strong>Points:</strong>{" "}
            <span className="text-green-600 font-semibold">{points}</span>
          </div>
          {isAgent && (
            <div className="mt-1 text-sm text-blue-700">
              🎉 As a verified <strong>Agent</strong>, you enjoy a <strong>10% discount</strong> on all bookings!
            </div>
          )}
        </div>
      </div>

      {/* 📝 Editable Form */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-800">
        {[
          "custfirstname",
          "custlastname",
          "custemail",
          "custhomephone",
          "custaddress",
          "custcity",
          "custprov",
          "custpostal",
          "custcountry"
        ].map((field) => (
          <div key={field}>
            <strong>{field.replace("cust", "").replace(/^[a-z]/, (c) => c.toUpperCase())}:</strong>{" "}
            {editMode ? (
              <>
                {field === "custcountry" ? (
                  <select
                    name={field}
                    value={formData[field] || ""}
                    onChange={handleChange}
                    className={`border px-2 py-1 rounded w-full ${formErrors[field] ? "border-red-500" : ""}`}
                  >
                    <option value="">-- Select Country --</option>
                    {countries.map((country) => (
                      <option key={country} value={country}>{country}</option>
                    ))}
                  </select>
                ) : field === "custprov" ? (
                  <select
                    name={field}
                    value={formData[field] || ""}
                    onChange={handleChange}
                    className={`border px-2 py-1 rounded w-full ${formErrors[field] ? "border-red-500" : ""}`}
                  >
                    <option value="">-- Select Province/State --</option>
                    {regionList.map((region) => (
                      <option key={region} value={region}>{region}</option>
                    ))}
                  </select>
                ) : field === "custpostal" ? (
                  <input
                    type="text"
                    name={field}
                    value={formData[field] || ""}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        [field]: formatPostalCode(e.target.value),
                      }))
                    }
                    maxLength={7}
                    className={`border px-2 py-1 rounded w-full ${formErrors[field] ? "border-red-500" : ""}`}
                  />
                ) : (
                  <input
                    type="text"
                    name={field}
                    value={formData[field] || ""}
                    onChange={handleChange}
                    className={`border px-2 py-1 rounded w-full ${formErrors[field] ? "border-red-500" : ""}`}
                  />
                )}
                {formErrors[field] && (
                  <div className="text-red-500 text-xs mt-1">{formErrors[field]}</div>
                )}
              </>
            ) : (
              customer[field] || "Not provided"
            )}
          </div>
        ))}
      </div>

      {/* 💾 Save / Cancel */}
      <div className="flex justify-end gap-4 mt-6 items-center">
        {showSavedCheck && <span className="text-green-600 font-semibold">✓ Saved</span>}
        {editMode ? (
          <>
            <button
              onClick={handleSave}
              disabled={saving}
              className={`px-4 py-2 rounded text-white ${saving ? "bg-green-400 cursor-wait" : "bg-green-600 hover:bg-green-700"}`}
            >
              {saving ? "Saving..." : "Save"}
            </button>
            <button
              onClick={() => {
                setEditMode(false);
                setFormData(customer);
                setFormErrors({});
              }}
              className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded"
            >
              Cancel
            </button>
          </>
        ) : (
          <button
            onClick={() => setEditMode(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
          >
            Edit Profile
          </button>
        )}
      </div>

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default UserProfile;
