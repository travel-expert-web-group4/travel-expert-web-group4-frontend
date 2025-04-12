import React, { useState } from 'react';
import axios from 'axios';

const Register = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [emailValid, setEmailValid] = useState(true); // true = customer exists

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (name === 'email') setEmailValid(true); // reset error on typing
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      // ✅ Step 1: Check if customer exists
      const checkResponse = await axios.get('http://localhost:8080/api/user/check-user', {
        params: { email: formData.email }
      });

      const customerExists = checkResponse.data;

      if (!customerExists) {
        setEmailValid(false);
        setLoading(false);
        return;
      }

      // ✅ Step 2: Proceed with registration
      const data = new FormData();
      data.append('email', formData.email);
      data.append('password', formData.password);

      await axios.post('http://localhost:8080/api/user/register-user', data);
      setMessage('✅ Registration successful. You can now log in!');
    } catch (error) {
      setMessage(`❌ Error: ${error.response?.data?.message || error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Customer Registration</h2>
      <form onSubmit={handleRegister} className="space-y-4">
        <input
          type="email"
          name="email"
          placeholder="Email"
          className={`w-full border p-2 rounded ${!emailValid ? 'border-red-500' : ''}`}
          value={formData.email}
          onChange={handleChange}
          required
        />
        {!emailValid && (
          <p className="text-red-500 text-sm">
            This email is not yet registered as a customer. Please contact support or visit our agency.
          </p>
        )}

        <input
          type="password"
          name="password"
          placeholder="Password"
          className="w-full border p-2 rounded"
          value={formData.password}
          onChange={handleChange}
          required
        />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          disabled={loading}
        >
          {loading ? 'Registering...' : 'Register'}
        </button>

        {message && <p className="text-center mt-2 text-sm">{message}</p>}
      </form>
    </div>
  );
};

export default Register;
