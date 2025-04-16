const BACKEND_URL = 'http://localhost:8080';

// Get token once at the top
const getAuthHeader = () => {
  const token = localStorage.getItem("jwt_token");
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
};

// Get full web user (includes customer and nested agent/agency)
export const getUserById = async (userId) => {
  try {
    const res = await fetch(`${BACKEND_URL}/api/user/${userId}`,{
      method: "GET",
      headers: getAuthHeader(),
    });
    if (!res.ok) throw new Error("Failed to fetch user");
    return await res.json();
  } catch (err) {
    console.error("❌ Error fetching user:", err.message);
    return null;
  }
};

// Get customer type (guest / bronze / platinum)
export const getCustomerType = async (customerId) => {
  try {
    const res = await fetch(`${BACKEND_URL}/api/customer/${customerId}/customer-type`, {
      method: "GET",
      headers: getAuthHeader(),
    });
    if (!res.ok) throw new Error("Failed to fetch customer type");
    return await res.json();
  } catch (err) {
    console.error("❌ Error fetching customer type:", err.message);
    return null;
  }
};

// Upload profile image (POST /profile-picture)
export const uploadProfileImage = async (customerId, imageFile) => {
  const formData = new FormData();
  formData.append('image', imageFile);

  try {
    const res = await fetch(`${BACKEND_URL}/api/customer/${customerId}/profile-picture`, {
      method: 'POST',
      body: formData,
    });

    const contentType = res.headers.get("content-type");

    if (!res.ok) throw new Error("Upload failed");

    // Try parsing JSON only if response is JSON
    if (contentType && contentType.includes("application/json")) {
      return await res.json();
    } else {
      const text = await res.text();
      console.warn("⚠️ Upload returned non-JSON:", text);
      return { profileImage: null, message: text };
    }
  } catch (err) {
    console.error("❌ Upload error:", err);
    throw err;
  }
};


// Delete profile image
export const deleteProfileImage = async (customerId) => {
  try {
    const res = await fetch(`${BACKEND_URL}/api/customer/${customerId}/profile-picture`, {
      method: 'DELETE',
    });

    if (!res.ok) throw new Error("Delete failed");
    return { success: true };
  } catch (err) {
    console.error("❌ Error deleting image:", err.message);
    return { success: false };
  }
};

// Update customer details (PUT)
export const updateCustomerAddress = async (customerId, updatedData) => {
  try {
    const res = await fetch(`${BACKEND_URL}/api/customer/${customerId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedData),
    });

    if (!res.ok) throw new Error("Failed to update customer");
    return { success: true, data: await res.json() };
  } catch (err) {
    console.error("❌ Update error:", err.message);
    return { success: false };
  }
};
