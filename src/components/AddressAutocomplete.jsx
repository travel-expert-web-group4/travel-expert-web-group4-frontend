import React, { useRef, useEffect } from 'react';

const AddressAutocomplete = ({ value, onChange, onPlaceSelected, disabled, className }) => {
  const inputRef = useRef(null);

  useEffect(() => {
    if (!window.google || !window.google.maps) return;

    const autocomplete = new window.google.maps.places.Autocomplete(inputRef.current, {
      types: ['address'],
      componentRestrictions: { country: 'ca' },
    });

    autocomplete.addListener('place_changed', () => {
      const place = autocomplete.getPlace();
      onPlaceSelected(place);
    });
  }, [onPlaceSelected]);

  return (
    <div className="relative">
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={onChange}
        disabled={disabled}
        className={`mt-1 block w-full px-3 py-2 rounded-md shadow-sm border ${
          disabled
            ? 'bg-gray-100 text-gray-700 cursor-not-allowed border-0 focus:ring-0'
            : 'border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400'
        } ${className || ''}`}
        placeholder="Enter your address"
        name="custaddress"
      />

      {/* ⛔ Overlay to block interaction when disabled */}
      {disabled && (
        <div className="absolute inset-0 bg-transparent cursor-not-allowed z-10 rounded-md" />
      )}
    </div>
  );
};

export default AddressAutocomplete;
