import axios from 'axios';

const API_BASE_URL = '/api/user';

/**
 * Register a new user
 * @param {Object} formData - Form input from Register.jsx
 */
export const registerUser = async (formData) => {
    const data = new FormData();
  
    // Append user as JSON string
    data.append('user', new Blob([JSON.stringify({
      password: formData.password,
      customer: {
        custfirstname: formData.firstName,
        custlastname: formData.lastName,
        custemail: formData.email,
        custhomephone: formData.homePhone,
        custbusphone: formData.busPhone,
        custaddress: formData.address,
        custcity: formData.city,
        custprov: formData.province,
        custpostal: formData.postal,
        custcountry: formData.country
      }
    })], { type: 'application/json' }));
  
    // Optional: If you're also uploading a profile image
    // data.append('image', formData.profileImage);
  
    const response = await axios.post('/api/user/new-user', data, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  
    return response.data;
  };
  
/**
 * Get user by ID
 * @param {number|string} userId
 */
export const getUserById = async (userId) => {
  const response = await axios.get(`${API_BASE_URL}/${userId}`);
  return response.data;
};

/**
 * Get user by email
 * @param {string} email
 */
export const getUserByEmail = async (email) => {
  const response = await axios.get(`${API_BASE_URL}/email`, {
    params: { email }
  });
  return response.data;
};
