// src/components/InputField.jsx
import React from 'react';

const InputField = ({ label, name, value, onChange, error, disabled, inputRef, highlight }) => (
  <label className="block text-sm font-medium text-gray-700 mb-2">
    {label}
    <input
      ref={inputRef}
      type="text"
      name={name}
      value={value || ''}
      onChange={onChange}
      disabled={disabled}
      className={`mt-1 block w-full px-3 py-2 rounded-md shadow-sm border transition-all duration-500 ${
        disabled
          ? 'bg-gray-100 text-gray-700 cursor-not-allowed'
          : 'border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent'
      } ${highlight ? 'bg-yellow-100' : ''}`}
    />
    {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
  </label>
);




export default InputField;
