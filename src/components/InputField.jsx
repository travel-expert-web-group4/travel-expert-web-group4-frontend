// src/components/InputField.jsx
import React from 'react';

const InputField = ({ label, name, value, onChange, error }) => (
  <label className="block text-sm font-medium text-gray-700 mb-2">
    {label}
    <input
      type="text"
      name={name}
      value={value || ''}
      onChange={onChange}
      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
    />
    {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
  </label>
);

export default InputField;
