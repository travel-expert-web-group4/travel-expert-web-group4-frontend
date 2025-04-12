import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import AddressAutocomplete from '../components/AddressAutocomplete';
import InputField from '../components/InputField';
import { Link } from 'react-router-dom'; 

import {
  updateCustomerAddress,
  uploadProfileImage,
  deleteProfileImage
} from '../api/user';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  CheckCircle,
  Camera,
  Pencil,
  Trash2,
  Save,
  XCircle
} from 'lucide-react';

const provinceCodeMap = {
  Alberta: 'AB',
  'British Columbia': 'BC',
  Manitoba: 'MB',
  'New Brunswick': 'NB',
  'Newfoundland and Labrador': 'NL',
  'Northwest Territories': 'NT',
  'Nova Scotia': 'NS',
  Nunavut: 'NU',
  Ontario: 'ON',
  'Prince Edward Island': 'PE',
  Quebec: 'QC',
  Saskatchewan: 'SK',
  Yukon: 'YT'
};

const BACKEND_URL = 'http://localhost:8080';

const UserProfile = ({ user }) => {
  const fileInputRef = useRef(null);
  const addressRef = useRef(null);
  const cityRef = useRef(null);

  const { login } = useAuth();
  const customer = user?.customer;

  const [updatedFields, setUpdatedFields] = useState([]);

  const [preview, setPreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [savingAddress, setSavingAddress] = useState(false);
  const [showSavedBanner, setShowSavedBanner] = useState(false);
  const [highlightFields, setHighlightFields] = useState([]);
  const [validationErrors, setValidationErrors] = useState({});

  const [addressData, setAddressData] = useState({
    custaddress: customer?.custaddress || '',
    custcity: customer?.custcity || '',
    custprov: customer?.custprov || '',
    custpostal: customer?.custpostal || '',
    custcountry: customer?.custcountry || ''
  });

  const [originalAddress, setOriginalAddress] = useState(addressData);

  useEffect(() => {
    if (user) {
      const imgPath = user.profileImage || user.customer?.profileImage;
      if (imgPath) {
        const fixedPath = imgPath.startsWith('/images/customers/')
          ? imgPath
          : `/images/customers/${imgPath}`;
        setPreview(`${BACKEND_URL}${fixedPath}`);
      }

      setOriginalAddress({
        custaddress: customer?.custaddress || '',
        custcity: customer?.custcity || '',
        custprov: customer?.custprov || '',
        custpostal: customer?.custpostal || '',
        custcountry: customer?.custcountry || ''
      });
    }
  }, [user]);

  const handlePlaceSelected = (place) => {
    if (!place || !place.address_components || !editMode) return;
  
    const components = place.address_components.reduce((acc, comp) => {
      comp.types.forEach((type) => {
        acc[type] = comp.long_name;
      });
      return acc;
    }, {});
  
    const streetNumber = components.street_number || '';
    const route = components.route || '';
    const fullStreet = `${streetNumber} ${route}`.trim();
  
    const fullProvince = components.administrative_area_level_1;
    const provinceCode = provinceCodeMap[fullProvince] || '';
  
    const updatedData = {
      custaddress: fullStreet,
      custcity: components.locality || components.sublocality || '',
      custprov: provinceCode,
      custpostal: components.postal_code || '',
      custcountry: components.country || ''
    };
  
    setAddressData((prev) => ({
      ...prev,
      ...updatedData
    }));
  };
  
  const handleSaveAddress = async () => {
  const trimmedData = {
    custaddress: addressData.custaddress.trim(),
    custcity: addressData.custcity.trim(),
    custprov: addressData.custprov.trim(),
    custpostal: addressData.custpostal.trim(),
    custcountry: addressData.custcountry.trim()
  };

  let errors = {};
  const requiredFields = ['custaddress', 'custcity', 'custprov', 'custpostal', 'custcountry'];
  requiredFields.forEach((field) => {
    if (!trimmedData[field]) {
      errors[field] = `${field.replace('cust', '')} is required.`;
    }
  });

  if (Object.keys(errors).length > 0) {
    setValidationErrors(errors);
    return;
  }

  setValidationErrors({});

  const changedFields = Object.entries(trimmedData)
    .filter(([key, value]) => value !== originalAddress[key])
    .map(([key]) => key);

  if (changedFields.length === 0) {
    toast.info('No changes detected.');
    setEditMode(false);
    return;
  }

  setSavingAddress(true);
  try {
    const fullData = {
      ...customer,
      ...trimmedData
    };

    const result = await updateCustomerAddress(customer.id, fullData);
    if (result.success) {
      toast.success('Address updated!');
      setOriginalAddress(trimmedData);
      setEditMode(false);
      setShowSavedBanner(true);
      setUpdatedFields(changedFields);

      setTimeout(() => {
        setShowSavedBanner(false);
        setUpdatedFields([]); // remove highlight
      }, 2500);
    } else {
      toast.error(result?.message || 'Failed to save address.');
    }
  } catch (error) {
    console.error('Address save error:', error);
    toast.error(error?.response?.data?.message || error.message || 'Something went wrong.');
  } finally {
    setSavingAddress(false);
  }
};


  const handleUpload = async () => {
    if (!imageFile || !customer.id) return;
    setUploading(true);
    try {
      const result = await uploadProfileImage(customer.id, imageFile);
      if (result && result.profileImage) {
        toast.success('Profile image uploaded successfully!');

        const fixedPath = result.profileImage.startsWith('/images/customers/')
          ? result.profileImage
          : `/images/customers/${result.profileImage}`;
        const imageUrl = `${BACKEND_URL}${fixedPath}`;
        setPreview(imageUrl);

        setImageFile(null);
        fileInputRef.current.value = null;

        login({
          ...user,
          profileImage: result.profileImage,
          customer: {
            ...user.customer,
            profileImage: result.profileImage
          }
        });

        toast.info('Profile synced!');
      } else {
        toast.error(result?.message || 'Unexpected server response.');
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast.error(error?.response?.data?.message || error.message || 'Upload failed.');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async () => {
    if (!customer.id) return;
    setDeleting(true);
    try {
      const result = await deleteProfileImage(customer.id);
      if (result.success) {
        toast.success('Profile image deleted.');
        setPreview(null);
        setImageFile(null);
        fileInputRef.current.value = null;

        login({
          ...user,
          profileImage: null,
          customer: {
            ...user.customer,
            profileImage: null
          }
        });

        toast.info('Profile synced!');
      } else {
        toast.error('Failed to delete image.');
      }
    } catch (error) {
      console.error('Delete error:', error);
      toast.error(error?.response?.data?.message || error.message || 'Delete failed.');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg mt-6 space-y-6">
      <ToastContainer position="top-right" autoClose={3000} />

      {showSavedBanner && (
        <div className="bg-green-100 text-green-800 px-4 py-2 rounded text-center font-medium border border-green-300">
          ✓ Address Saved
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-start gap-6">
        {/* Avatar Section */}
        <div className="flex flex-col items-center sm:items-start gap-2">
          <div className="relative group">
            <img
              src={preview || '/default-avatar.png'}
              alt="Profile"
              onClick={() => fileInputRef.current.click()}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = '/default-avatar.png';
              }}
              className="w-32 h-32 rounded-full object-cover border-2 border-gray-300 shadow-md cursor-pointer group-hover:opacity-80 transition"
              title="Click to upload new photo"
            />
            <Camera className="absolute bottom-1 right-1 bg-white rounded-full p-1 text-gray-700 group-hover:text-blue-500 w-6 h-6 shadow" />
          </div>
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={(e) => setImageFile(e.target.files[0])}
            className="hidden"
          />
          <button
            onClick={handleDelete}
            className="text-sm text-red-600 hover:text-red-700 flex items-center gap-1 mt-1 disabled:opacity-50"
            disabled={deleting}
          >
            <Trash2 size={16} /> {deleting ? 'Deleting...' : 'Delete Photo'}
          </button>
          {imageFile && (
            <button
              onClick={handleUpload}
              className="text-sm text-green-600 hover:text-green-700 underline"
              disabled={uploading}
            >
              {uploading ? 'Uploading...' : 'Click to Confirm Upload'}
            </button>
          )}
          <div className="mt-3 text-sm text-gray-700 space-y-1">
            <p><strong>Type:</strong> {user.customerType?.name || 'Unknown'}</p>
            <p><strong>Points:</strong> {user.points}</p>
          </div>
        </div>

        {/* Info */}
        <div className="flex-1 space-y-2">
  <h2 className="text-xl font-semibold mb-2">Personal Information</h2>

  <p><strong>Name:</strong> {customer.custfirstname} {customer.custlastname}</p>

  {editMode ? (
    <InputField
      label="Email"
      name="email"
      value={customer.custemail}
      onChange={(e) =>
        login({
          ...user,
          email: e.target.value,
          customer: {
            ...user.customer,
            custemail: e.target.value
          }
        })
      }
      disabled={false}
    />
  ) : (
    <p><strong>Email:</strong> {user.email}</p>
  )}

  {editMode ? (
    <InputField
      label="Phone"
      name="custhomephone"
      value={customer.custhomephone || ''}
      onChange={(e) =>
        login({
          ...user,
          customer: {
            ...user.customer,
            custhomephone: e.target.value
          }
        })
      }
      disabled={false}
    />
  ) : (
    <p><strong>Phone:</strong> {customer.custhomephone}</p>
  )}

  <p><strong>Role:</strong> {user.role || (user.agent ? 'Agent' : 'Customer')}</p>
  <Link
  to="/chat"
  className="inline-block mt-2 text-blue-600 hover:underline text-sm"
>
  💬 Go to Chat
</Link>

</div>

      </div>
       {showSavedBanner && (
        <div className="text-green-700 bg-green-100 border border-green-300 px-4 py-2 rounded shadow mb-4 text-center font-medium">
       ✓ Address saved successfully!
       </div>
        )}


      <div ref={addressRef}>
        <h2 className="text-xl font-semibold mt-6 mb-2">Address</h2>
       

        <div className={`grid grid-cols-1 sm:grid-cols-2 gap-4 border rounded-lg p-4 ${!editMode ? 'bg-gray-100' : 'bg-white'}`}>
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">Address</label>
            <AddressAutocomplete
              value={addressData.custaddress}
              onChange={(e) => setAddressData({ ...addressData, custaddress: e.target.value })}
              onPlaceSelected={handlePlaceSelected}
              disabled={!editMode}
              className={`w-full px-3 py-2 rounded-md shadow-sm border ${
  !editMode
    ? 'bg-gray-100 text-gray-700 border-0 focus:ring-0 cursor-default'
    : 'border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400'
} ${highlightFields.includes('custaddress') ? 'bg-yellow-100 transition duration-500' : ''}`}
            />
            {editMode && validationErrors.custaddress && (
              <p className="text-red-500 text-xs mt-1">{validationErrors.custaddress}</p>
            )}
          </div>

          <InputField
            label="City"
            name="custcity"
            value={addressData.custcity}
            onChange={(e) => setAddressData({ ...addressData, custcity: e.target.value })}
            disabled={!editMode}
            error={editMode ? validationErrors.custcity : null}
            inputRef={cityRef}
            highlight={highlightFields.includes('custcity')}
          />

          <InputField
            label="Province"
            name="custprov"
            value={addressData.custprov}
            onChange={(e) => setAddressData({ ...addressData, custprov: e.target.value.toUpperCase() })}
            disabled={!editMode}
            error={editMode ? validationErrors.custprov : null}
            highlight={highlightFields.includes('custprov')}
          />

          <InputField
            label="Postal Code"
            name="custpostal"
            value={addressData.custpostal}
            onChange={(e) => setAddressData({ ...addressData, custpostal: e.target.value })}
            disabled={!editMode}
            error={editMode ? validationErrors.custpostal : null}
            highlight={highlightFields.includes('custpostal')}
          />

          <InputField
            label="Country"
            name="custcountry"
            value={addressData.custcountry}
            onChange={(e) => setAddressData({ ...addressData, custcountry: e.target.value })}
            disabled={!editMode}
            error={editMode ? validationErrors.custcountry : null}
            highlight={highlightFields.includes('custcountry')}
          />
        </div>

        {!editMode ? (
          <button
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center gap-2"
            onClick={() => {
              setEditMode(true);
              setTimeout(() => {
                addressRef.current?.scrollIntoView({ behavior: 'smooth' });
                cityRef.current?.focus();
              }, 150);
            }}
          >
            <Pencil size={16} /> Edit Address
          </button>
        ) : (
          <div className="flex gap-3 mt-4">
            <button
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 flex items-center gap-2 disabled:opacity-50"
              onClick={handleSaveAddress}
              disabled={savingAddress}
            >
              <Save size={16} /> {savingAddress ? 'Saving...' : 'Save'}
            </button>
            <button
              className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500 flex items-center gap-2"
              onClick={() => {
                setAddressData(originalAddress);
                setEditMode(false);
                toast.info('Edit cancelled.');
              }}
            >
              <XCircle size={16} /> Cancel
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfile;
