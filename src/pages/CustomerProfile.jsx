import React, { useEffect, useState, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import InputField from '../components/InputField';
import AddressAutocomplete from '../components/AddressAutocomplete';

const CustomerProfile = () => {
  const { user } = useAuth();
  const customerId = user?.id;
  const fileInputRef = useRef(null);

  const [customer, setCustomer] = useState(null);
  const [points, setPoints] = useState(null);
  const [type, setType] = useState({ name: '', discount: null });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formErrors, setFormErrors] = useState({});
  const [uploading, setUploading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [originalCustomer, setOriginalCustomer] = useState(null);
  const [showAgentInfo, setShowAgentInfo] = useState(false);
  const [highlightedFields, setHighlightedFields] = useState([]);

  useEffect(() => {
    if (customerId) fetchCustomerData();
  }, [customerId]);

  const fetchCustomerData = async () => {
    try {
      setLoading(true);
      const [custRes, pointsRes, typeRes] = await Promise.all([
        fetch(`http://localhost:8080/api/customer/${customerId}`),
        fetch(`http://localhost:8080/api/customer/${customerId}/points`),
        fetch(`http://localhost:8080/api/customer/${customerId}/customer-type`)
      ]);

      if (!custRes.ok || !pointsRes.ok || !typeRes.ok) throw new Error("Failed to fetch data");

      const customerData = await custRes.json();
      const pointsData = await pointsRes.json();
      const typeData = await typeRes.json();

      setCustomer(customerData);
      setOriginalCustomer(customerData);
      setPoints(pointsData);
      setType({ name: typeData.name, discount: typeData.discountPercentage });
    } catch (err) {
      console.error(err);
      setError("Unable to load customer profile.");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCustomer(prev => ({ ...prev, [name]: value }));
  };

  const handleAddressSelected = (place) => {
    const address = place.formatted_address;
    const components = place.address_components;

    const get = (type) =>
      components.find(c => c.types.includes(type))?.long_name || '';

    const updated = {
      custaddress: address,
      custcity: get('locality'),
      custprov: get('administrative_area_level_1'),
      custpostal: get('postal_code'),
      custcountry: get('country'),
    };

    setCustomer(prev => ({ ...prev, ...updated }));
    setHighlightedFields(Object.keys(updated));
    setTimeout(() => setHighlightedFields([]), 1500);
  };

  const validateForm = () => {
    const errors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[0-9]{10}$/;

    if (!emailRegex.test(customer.custemail.trim())) errors.custemail = "Invalid email format.";
    if (!phoneRegex.test(customer.custhomephone)) errors.custhomephone = "Phone must be 10 digits.";
    if (!customer.custaddress || customer.custaddress.trim().length < 5) errors.custaddress = "Address must be at least 5 characters.";

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleImageUpload = async (file) => {
    if (!file || !customerId) return;
    const formData = new FormData();
    formData.append("image", file);
    try {
      setUploading(true);
      const res = await fetch(`http://localhost:8080/api/customer/${customerId}/profile-picture`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Image upload failed");

      // Force image refresh by appending cache buster
      await new Promise(resolve => setTimeout(resolve, 200)); // tiny delay to ensure backend saves first
      await fetchCustomerData();
    } catch (err) {
      console.error("Upload failed:", err);
      showToast("Failed to upload image.", "error");
    } finally {
      setUploading(false);
      showToast("Image uploaded successfully!", "success");
    }
  };

  const handleDeleteImage = async () => {
    if (!window.confirm("Are you sure you want to delete your profile photo?")) return;
    try {
      const res = await fetch(`http://localhost:8080/api/customer/${customerId}/profile-picture`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to delete image");

      await fetchCustomerData();
      showToast("Profile photo deleted.", "success");
    } catch (err) {
      console.error(err);
      showToast("Failed to delete profile photo.", "error");
    }
  };

  const handleSave = async () => {
    if (!validateForm()) return;
    try {
      const res = await fetch(`http://localhost:8080/api/customer/${customerId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(customer)
      });

      if (!res.ok) throw new Error("Failed to update");

      showToast("Profile updated successfully!", "success");
      setIsEditing(false);
      setOriginalCustomer(customer);
    } catch (err) {
      console.error(err);
      showToast("Failed to update profile.", "error");
    }
  };

  const handleCancel = () => {
    setCustomer(originalCustomer);
    setIsEditing(false);
    setFormErrors({});
  };

  const showToast = (msg, type) => {
    const toast = document.createElement("div");
    toast.className = `fixed bottom-4 right-4 px-4 py-2 rounded text-white z-50 shadow-lg bg-${type === 'success' ? 'green' : 'red'}-500`;
    toast.textContent = msg;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
  };

  if (!customerId) return <p className="text-red-600 text-center mt-8">Not logged in.</p>;
  if (loading) return <div className="flex flex-col items-center mt-8"><div className="loader" /><p>Loading profile...</p></div>;
  if (error) return <p className="text-red-600 text-center mt-8">{error}</p>;

  // Append timestamp to bust browser image cache
  const profileImageUrl = customer.profileImageUrl
    ? `${customer.profileImageUrl.startsWith("http")
      ? customer.profileImageUrl
      : `http://localhost:8080${customer.profileImageUrl}`}?t=${Date.now()}`
    : "https://placehold.co/150x150?text=No+Photo";

  return (
    <div className="w-full max-w-4xl mx-auto mt-10 p-6 bg-white rounded-xl shadow-md mb-10 px-4 sm:px-6 lg:px-8">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">My Profile</h2>

      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex flex-col items-center md:w-1/3">
          <div className="relative group">
            <img
              src={profileImageUrl}
              alt="Profile"
              className="w-36 h-36 rounded-full object-cover border-2 border-gray-300"
            />
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition">
              <button onClick={() => fileInputRef.current?.click()} className="text-white text-sm mb-2">✏️ Edit</button>
              <button
                className="text-red-400 text-sm hover:text-red-200"
                onClick={handleDeleteImage}
              >🗑️ Delete</button>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={(e) => handleImageUpload(e.target.files[0])}
              className="hidden"
            />
          </div>

          {uploading && <p className="text-blue-500 text-sm mt-1">Uploading...</p>}
          {type.name && (
            <div className="mt-4 text-center space-y-2">
              <span
                className={`inline-block text-xs font-medium px-4 py-1 rounded-full shadow-sm
                  ${
                    type.name === 'Bronze'
                      ? 'bg-yellow-100 text-yellow-800'
                      : type.name === 'Platinum'
                      ? 'bg-purple-100 text-purple-800'
                      : 'bg-gray-200 text-gray-700'
                  }`}
              >
                {type.name} Member • {type.discount * 100}% Off
              </span>
              <p className="text-sm text-gray-700"><strong>Points:</strong> {points}</p>
            </div>
          )}
        </div>

        <div className="md:w-2/3 space-y-3">
          <h3 className="text-lg font-semibold text-gray-700">{customer.custfirstname} {customer.custlastname}</h3>

          {isEditing ? (
            <>
              <InputField label="Email" name="custemail" value={customer.custemail} onChange={handleInputChange} error={formErrors.custemail} />
              <InputField label="Phone" name="custhomephone" value={customer.custhomephone} onChange={handleInputChange} error={formErrors.custhomephone} />
              <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
              <AddressAutocomplete
                value={customer.custaddress}
                onChange={(e) => setCustomer({ ...customer, custaddress: e.target.value })}
                onPlaceSelected={handleAddressSelected}
              />
              {formErrors.custaddress && <p className="text-red-500 text-xs mt-1">{formErrors.custaddress}</p>}

              <div className="flex gap-4 mt-2">
                <button className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded" onClick={handleSave}>💾 Save</button>
                <button className="bg-gray-300 hover:bg-gray-400 text-black px-4 py-2 rounded" onClick={handleCancel}>❌ Cancel</button>
              </div>
            </>
          ) : (
            <>
              <p><strong>Email:</strong> {customer.custemail}</p>
              <p><strong>Phone:</strong> {customer.custhomephone}</p>
              <p><strong>Address:</strong> {customer.custaddress}</p>
              <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded" onClick={() => setIsEditing(true)}>✏️ Edit</button>
            </>
          )}

          {['custcity', 'custprov', 'custpostal', 'custcountry'].map((field) => (
            <p
              key={field}
              className={`transition duration-300 ${highlightedFields.includes(field) ? 'bg-yellow-100 p-1 rounded' : ''}`}
            >
              <strong>{field.replace('cust', '')}:</strong> {customer[field]}
            </p>
          ))}
        </div>
      </div>

      <div className="mt-10 border-t pt-6">
        <div className="flex justify-between items-center cursor-pointer" onClick={() => setShowAgentInfo(prev => !prev)}>
          <h4 className="text-xl font-semibold text-gray-700">Assigned Agent</h4>
          <span className="text-xl">{showAgentInfo ? "▼" : "▶"}</span>
        </div>

        <div
          className={`transition-all duration-500 ease-in-out ${showAgentInfo ? 'max-h-[1000px] opacity-100 mt-4' : 'max-h-0 opacity-0 overflow-hidden'}`}
        >
          <div className="space-y-2 text-sm">
            <img
              src={customer.agentid?.profileImageUrl || 'https://placehold.co/100x100?text=Agent'}
              alt="Agent"
              className="w-20 h-20 rounded-full object-cover mb-2"
            />
            <p><strong>Name:</strong> {customer.agentid?.agtfirstname} {customer.agentid?.agtlastname}</p>
            <p><strong>Phone:</strong> {customer.agentid?.agtbusphone}</p>
            <p><strong>Email:</strong> {customer.agentid?.agtemail}</p>
            <p><strong>Position:</strong> {customer.agentid?.agtposition}</p>
            <h5 className="mt-2 font-medium">Agency Info</h5>
            <p><strong>Address:</strong> {customer.agentid?.agencyid?.agncyaddress}, {customer.agentid?.agencyid?.agncycity}, {customer.agentid?.agencyid?.agncyprov}</p>
            <p><strong>Phone:</strong> {customer.agentid?.agencyid?.agncyphone}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerProfile;
