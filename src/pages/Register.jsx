import React, { useState } from 'react';
import { registerUser } from '../api/webUser'; // Adjust path if needed

const Register = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    homePhone: '',
    busPhone: '',
    address: '',
    city: '',
    province: '',
    postal: '',
    country: '',
    password: '',
    confirmPassword: '',
  });

  const [message, setMessage] = useState('');
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setMessage('❌ Passwords do not match');
      setSuccess(false);
      return;
    }

    try {
      await registerUser(formData);
      setMessage('✅ Registration successful!');
      setSuccess(true);
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        homePhone: '',
        busPhone: '',
        address: '',
        city: '',
        province: '',
        postal: '',
        country: '',
        password: '',
        confirmPassword: '',
      });
    } catch (error) {
      console.error('Registration error:', error);
      setMessage('❌ Registration failed. Please try again.');
      setSuccess(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white shadow-md rounded-md border border-gray-200">
      <h2 className="text-3xl font-bold mb-6 text-center text-blue-600">Register</h2>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Left column */}
        <input name="firstName" placeholder="First Name" value={formData.firstName} onChange={handleChange} required className="p-2 border rounded" />
        <input name="lastName" placeholder="Last Name" value={formData.lastName} onChange={handleChange} required className="p-2 border rounded" />
        <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required className="p-2 border rounded" />
        <input name="homePhone" placeholder="Home Phone" value={formData.homePhone} onChange={handleChange} className="p-2 border rounded" />
        <input name="busPhone" placeholder="Business Phone" value={formData.busPhone} onChange={handleChange} className="p-2 border rounded" />
        <input name="address" placeholder="Street Address" value={formData.address} onChange={handleChange} className="p-2 border rounded" />
        <input name="city" placeholder="City" value={formData.city} onChange={handleChange} className="p-2 border rounded" />
        <input name="province" placeholder="Province" value={formData.province} onChange={handleChange} className="p-2 border rounded" />
        <input name="postal" placeholder="Postal Code" value={formData.postal} onChange={handleChange} className="p-2 border rounded" />
        <input name="country" placeholder="Country" value={formData.country} onChange={handleChange} className="p-2 border rounded" />
        <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} required className="p-2 border rounded" />
        <input type="password" name="confirmPassword" placeholder="Confirm Password" value={formData.confirmPassword} onChange={handleChange} required className="p-2 border rounded" />

        <button type="submit" className="col-span-1 md:col-span-2 bg-blue-600 text-white font-semibold p-2 rounded hover:bg-blue-700 transition">
          Register
        </button>
      </form>

      {message && (
        <p className={`mt-4 text-center font-medium ${success ? 'text-green-600' : 'text-red-500'}`}>
          {message}
        </p>
      )}
    </div>
  );
};

export default Register;
