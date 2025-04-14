import React, { useEffect, useState, useRef } from "react";
import { useAuth } from "../contexts/AuthContext";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const BACKEND_URL = "http://localhost:8080";

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
  const [points, setPoints] = useState(0);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const fetchCustomerProfile = async () => {
      try {
        console.log("👤 user.webUserId:", user?.webUserId); // ✅ ensure correct ID
        console.log("🔐 JWT token:", token?.slice(0, 20), "...");

        const res = await fetch(`${BACKEND_URL}/api/user/${user?.webUserId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        console.log("📡 /api/user/{id} response status:", res.status);
        if (!res.ok) throw new Error("Failed to fetch WebUser profile");

        const userData = await res.json();
        console.log("✅ WebUser payload:", userData);

        setProfileImage(userData.profileImage || null);
        setPoints(userData.points || 0);

        const customerData = userData.customer;
        if (!customerData) throw new Error("Customer info missing in WebUser");

        setCustomer(customerData);
        setFormData(customerData);

        // ✅ Fetch customer type
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
        console.error("❌ Error loading profile:", err);
        toast.error("❌ Failed to load user profile");
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
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch(`${BACKEND_URL}/api/customer/${customer.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Save failed");

      toast.success("✅ Profile saved");
      setShowSavedCheck(true);
      setTimeout(() => setShowSavedCheck(false), 2000);
      setCustomer({ ...customer, ...formData });
      setEditMode(false);
    } catch {
      toast.error("❌ Error saving profile");
    } finally {
      setSaving(false);
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
      <div className="flex items-center gap-6 mb-6">
        <img
          src={profileImage ? `${BACKEND_URL}${profileImage}` : "/default-avatar.png"}
          alt="Profile"
          className="w-24 h-24 rounded-full border"
        />
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
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-800">
        {["custfirstname", "custlastname", "custemail", "custhomephone", "custaddress", "custcity", "custprov", "custpostal", "custcountry"].map((field) => (
          <div key={field}>
            <strong>{field.replace("cust", "").replace(/^[a-z]/, (c) => c.toUpperCase())}:</strong>{" "}
            {editMode ? (
              <input
                type="text"
                name={field}
                value={formData[field] || ""}
                onChange={handleChange}
                className="border px-2 py-1 rounded w-full"
              />
            ) : (
              customer[field] || "Not provided"
            )}
          </div>
        ))}
      </div>

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
            <button onClick={() => { setEditMode(false); setFormData(customer); }} className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded">
              Cancel
            </button>
          </>
        ) : (
          <button onClick={() => setEditMode(true)} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">
            Edit Profile
          </button>
        )}
      </div>
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default UserProfile;
