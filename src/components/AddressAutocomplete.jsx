import React, { useRef, useEffect } from 'react';

const AddressAutocomplete = ({ value, onChange, onPlaceSelected }) => {
  const inputRef = useRef(null);

  useEffect(() => {
    if (!window.google || !window.google.maps) return;

    const autocomplete = new window.google.maps.places.Autocomplete(inputRef.current, {
      types: ['address'],
      componentRestrictions: { country: 'ca' }, // restrict to Canada
    });

    autocomplete.addListener('place_changed', () => {
      const place = autocomplete.getPlace();
      onPlaceSelected(place);
    });
  }, []);

  return (
    <input
      ref={inputRef}
      type="text"
      value={value}
      onChange={onChange}
      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
      placeholder="Enter your address"
      name="custaddress"
    />
  );
};

export default AddressAutocomplete;
