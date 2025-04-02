import React, { useEffect, useState } from 'react';
import '../styles/CustomerProfile.css';
import { useAuth } from '../contexts/AuthContext';

const CustomerProfile = () => {
  const { user } = useAuth();
  const customerId = user?.id;

  const [customer, setCustomer] = useState(null);
  const [points, setPoints] = useState(null);
  const [type, setType] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formErrors, setFormErrors] = useState({});
  const [uploading, setUploading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [originalCustomer, setOriginalCustomer] = useState(null);
  const [showAgentInfo, setShowAgentInfo] = useState(false);

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
      const typeData = await typeRes.text();

      setCustomer(customerData);
      setOriginalCustomer(customerData);
      setPoints(pointsData);
      setType(typeData);
    } catch (err) {
      console.error(err);
      setError("Unable to load customer profile.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (customerId) {
      fetchCustomerData();
    }
  }, [customerId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCustomer({ ...customer, [name]: value });

    if (name === 'custaddress') autoFillFromAddress(value);
  };

  const autoFillFromAddress = async (address) => {
    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
    const encoded = encodeURIComponent(address);
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encoded}&key=${apiKey}`;

    try {
      const res = await fetch(url);
      const data = await res.json();
      if (data.status === 'OK') {
        const components = data.results[0].address_components;
        setCustomer(prev => ({
          ...prev,
          custcity: components.find(c => c.types.includes('locality'))?.long_name || '',
          custprov: components.find(c => c.types.includes('administrative_area_level_1'))?.short_name || '',
          custpostal: components.find(c => c.types.includes('postal_code'))?.long_name || '',
          custcountry: components.find(c => c.types.includes('country'))?.long_name || ''
        }));
      }
    } catch (err) {
      console.error("Geocoding failed:", err);
    }
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

      await fetchCustomerData();
      showToast("Image uploaded successfully!", "success");
    } catch (err) {
      console.error("Upload failed:", err);
      showToast("Failed to upload image.", "error");
    } finally {
      setUploading(false);
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
    toast.className = `toast ${type}`;
    toast.textContent = msg;
    document.body.appendChild(toast);
    setTimeout(() => toast.classList.add("show"), 100);
    setTimeout(() => toast.classList.remove("show"), 3000);
    setTimeout(() => toast.remove(), 3500);
  };

  if (!customerId) return <p className="error-message">Not logged in.</p>;
  if (loading) return <div className="spinner-wrapper"><div className="spinner"></div><p>Loading profile...</p></div>;
  if (error) return <p className="error-message">{error}</p>;

  return (
    <div className="customer-profile">
      <h2>My Profile</h2>

      <div className="profile-card">
        <div className="profile-image-upload">
          <label className="upload-label">
            <img
              src={
                customer.profileImageUrl
                  ? customer.profileImageUrl.startsWith("http")
                    ? customer.profileImageUrl
                    : `http://localhost:8080${customer.profileImageUrl}`
                  : "https://placehold.co/150x150?text=No+Photo"
              }
              alt="Profile"
              className="profile-img-circle"
            />
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleImageUpload(e.target.files[0])}
              className="upload-input"
            />
          </label>
          {customer.profileImageUrl && (
            <button className="delete-btn" onClick={handleDeleteImage}>🗑️ Delete Photo</button>
          )}
          {uploading && <p className="uploading-message">Uploading...</p>}
        </div>

        <div className="info editable-section">
          <h3>{customer.custfirstname} {customer.custlastname}</h3>

          {isEditing ? (
            <>
              <label>Email:
                <input
                  name="custemail"
                  value={customer.custemail?.trim() || ""}
                  onChange={handleInputChange}
                />
                {formErrors.custemail && <p className="form-error">{formErrors.custemail}</p>}
              </label>

              <label>Phone:
                <input
                  name="custhomephone"
                  value={customer.custhomephone || ""}
                  onChange={handleInputChange}
                />
                {formErrors.custhomephone && <p className="form-error">{formErrors.custhomephone}</p>}
              </label>

              <label>Address:
                <input
                  name="custaddress"
                  value={customer.custaddress || ""}
                  onChange={handleInputChange}
                />
                {formErrors.custaddress && <p className="form-error">{formErrors.custaddress}</p>}
              </label>

              <button className="save-btn" onClick={handleSave}>💾 Save Changes</button>
              <button className="cancel-btn" onClick={handleCancel}>❌ Cancel</button>
            </>
          ) : (
            <>
              <p><strong>Email:</strong> {customer.custemail}</p>
              <p><strong>Phone:</strong> {customer.custhomephone}</p>
              <p><strong>Address:</strong> {customer.custaddress}</p>
              <button className="edit-btn" onClick={() => setIsEditing(true)}>✏️ Edit</button>
            </>
          )}

          <p><strong>City:</strong> {customer.custcity}</p>
          <p><strong>Province:</strong> {customer.custprov}</p>
          <p><strong>Postal Code:</strong> {customer.custpostal}</p>
          <p><strong>Country:</strong> {customer.custcountry}</p>
          <p><strong>Points:</strong> {points}</p>
          <p><strong>Membership Type:</strong> {type}</p>
        </div>
      </div>

      <div className="agent-info">
        <div className="agent-header" onClick={() => setShowAgentInfo(prev => !prev)}>
          <h4>Assigned Agent</h4>
          <span>{showAgentInfo ? "▼" : "▶"}</span>
        </div>
        {showAgentInfo && (
          <div className="agent-details">
            <img
              src={customer.agentid?.profileImageUrl || 'https://placehold.co/100x100?text=Agent'}
              alt="Agent"
              className="agent-photo"
            />
            <p><strong>Name:</strong> {customer.agentid?.agtfirstname} {customer.agentid?.agtlastname}</p>
            <p><strong>Phone:</strong> {customer.agentid?.agtbusphone}</p>
            <p><strong>Email:</strong> {customer.agentid?.agtemail}</p>
            <p><strong>Position:</strong> {customer.agentid?.agtposition}</p>
            <h4>Agency Info</h4>
            <p><strong>Address:</strong> {customer.agentid?.agencyid?.agncyaddress}, {customer.agentid?.agencyid?.agncycity}, {customer.agentid?.agencyid?.agncyprov}</p>
            <p><strong>Phone:</strong> {customer.agentid?.agencyid?.agncyphone}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerProfile;
