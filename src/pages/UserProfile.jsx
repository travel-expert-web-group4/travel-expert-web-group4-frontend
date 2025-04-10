import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

import AddressAutocomplete from '../components/AddressAutocomplete';
import { updateCustomerAddress, uploadProfileImage, deleteProfileImage } from '../api/user';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const BACKEND_URL = 'http://localhost:8080';

const UserProfile = ({ user }) => {
  const fileInputRef = useRef(null);
  const { login } = useAuth();


  const customer = user?.customer;
  const agent = customer?.agentid;
  const agency = agent?.agencyid;

  const [preview, setPreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [addressData, setAddressData] = useState({
    custaddress: customer?.custaddress || '',
    custcity: customer?.custcity || '',
    custprov: customer?.custprov || '',
    custpostal: customer?.custpostal || '',
    custcountry: customer?.custcountry || ''
  });

  useEffect(() => {
    if (user) {
      const imgPath = user.profileImage || user.customer?.profileImage;
      if (imgPath) {
        setPreview(`${BACKEND_URL}${imgPath}`);
      }
    }
  }, [user]);

  if (!user || !customer) {
    return <div className="p-8 text-center text-lg">Loading profile...</div>;
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImageFile(file);
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = async () => {
    if (!imageFile || !customer.id) return;
    try {
      const result = await uploadProfileImage(customer.id, imageFile);
      if (result && result.profileImage) {
        toast.success('Profile image uploaded successfully!');
        const imageUrl = `${BACKEND_URL}${result.profileImage}`;
        setPreview(imageUrl);
        setImageFile(null);
  
        const updatedUser = {
          ...user,
          profileImage: result.profileImage,
          customer: {
            ...user.customer,
            profileImage: result.profileImage
          }
        };
  
        login(updatedUser); // update context + localStorage
        toast.info('Profile synced!');
      } else {
        const errorMsg = result?.message || 'Unexpected server response.';
        toast.error(errorMsg);
      }
    } catch (error) {
      console.error('Upload error:', error);
      const backendMessage = error?.response?.data?.message || error.message || 'Failed to upload image.';
      toast.error(backendMessage);
    }
  };
  
  
  const handleDelete = async () => {
    if (!customer.id) return;
    const result = await deleteProfileImage(customer.id);
    if (result.success) {
      toast.success('Profile image deleted.');
      setPreview(null);
      setImageFile(null);
  
      const updatedUser = {
        ...user,
        profileImage: null,
        customer: {
          ...user.customer,
          profileImage: null
        }
      };
  
      login(updatedUser); // update context + localStorage
      toast.info('Profile synced!');
    } else {
      toast.error('Failed to delete image.');
    }
  };
  
  


  const handlePlaceSelected = (place) => {
    const components = place.address_components.reduce((acc, comp) => {
      comp.types.forEach((type) => {
        acc[type] = comp.long_name;
      });
      return acc;
    }, {});

    setAddressData({
      ...addressData,
      custaddress: place.formatted_address || '',
      custcity: components.locality || '',
      custprov: (components.administrative_area_level_1 || '').slice(0, 2).toUpperCase(),
      custpostal: components.postal_code || '',
      custcountry: components.country || ''
    });
  };

  const handleSaveAddress = async () => {
    const fullData = {
      ...customer,
      ...addressData
    };

    const result = await updateCustomerAddress(customer.id, fullData);
    if (result.success) {
      toast.success('Address updated!');
      setEditMode(false);
    } else {
      toast.error('Failed to save address.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg mt-6 space-y-6">
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop={false} closeOnClick pauseOnFocusLoss draggable pauseOnHover />

      <div className="flex items-center gap-6">
        <img
          src={preview || '/default-avatar.png'}
          alt="Profile"
          className="w-32 h-32 rounded-full object-cover border cursor-pointer hover:opacity-80"
          onClick={() => fileInputRef.current.click()}
        />
        <div className="space-y-2">
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            ref={fileInputRef}
            className="hidden"
          />
          <button
            onClick={handleUpload}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Upload
          </button>
          <button
            onClick={handleDelete}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Delete
          </button>
        </div>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-2">Personal Information</h2>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Points:</strong> {user.points}</p>
        <p><strong>Type:</strong> {user.customerType?.name || 'Unknown'}</p>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-2">Customer Details</h2>
        <p><strong>Name:</strong> {customer.custfirstname} {customer.custlastname}</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium">Address</label>
            <AddressAutocomplete
              value={addressData.custaddress}
              onChange={(e) => setAddressData({ ...addressData, custaddress: e.target.value })}
              onPlaceSelected={handlePlaceSelected}
              disabled={!editMode}
            />
          </div>
          <div>
            <label className="text-sm font-medium">City</label>
            <input
              type="text"
              value={addressData.custcity}
              disabled={!editMode}
              onChange={(e) => setAddressData({ ...addressData, custcity: e.target.value })}
              className="w-full border px-3 py-2 rounded"
            />
          </div>
          <div>
            <label className="text-sm font-medium">Province</label>
            <input
              type="text"
              value={addressData.custprov}
              disabled={!editMode}
              onChange={(e) => setAddressData({ ...addressData, custprov: e.target.value.slice(0, 2).toUpperCase() })}
              className="w-full border px-3 py-2 rounded"
              maxLength={2}
            />
          </div>
          <div>
            <label className="text-sm font-medium">Postal Code</label>
            <input
              type="text"
              value={addressData.custpostal}
              disabled={!editMode}
              onChange={(e) => setAddressData({ ...addressData, custpostal: e.target.value })}
              className="w-full border px-3 py-2 rounded"
            />
          </div>
          <div>
            <label className="text-sm font-medium">Country</label>
            <input
              type="text"
              value={addressData.custcountry}
              disabled={!editMode}
              onChange={(e) => setAddressData({ ...addressData, custcountry: e.target.value })}
              className="w-full border px-3 py-2 rounded"
            />
          </div>
        </div>

        {!editMode ? (
          <button
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            onClick={() => setEditMode(true)}
          >
            Edit Address
          </button>
        ) : (
          <div className="flex gap-3 mt-4">
            <button
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
              onClick={handleSaveAddress}
            >
              Save
            </button>
            <button
              className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
              onClick={() => {
                setEditMode(false);
                toast.info('Edit cancelled.');
              }}
            >
              Cancel
            </button>
          </div>
        )}
      </div>

      {agent && (
        <div>
          <h2 className="text-xl font-semibold mb-2">Agent Information</h2>
          <p><strong>Name:</strong> {agent.agtfirstname} {agent.agtmiddleinitial || ''} {agent.agtlastname}</p>
          <p><strong>Email:</strong> {agent.agtemail}</p>
          <p><strong>Phone:</strong> {agent.agtbusphone}</p>
          <p><strong>Position:</strong> {agent.agtposition}</p>
        </div>
      )}

      {agency && (
        <div>
          <h2 className="text-xl font-semibold mb-2">Agency Information</h2>
          <p><strong>Address:</strong> {agency.agncyaddress}, {agency.agncycity}, {agency.agncyprov}, {agency.agncypostal}</p>
          <p><strong>Country:</strong> {agency.agncycountry}</p>
          <p><strong>Phone:</strong> {agency.agncyphone}</p>
          <p><strong>Fax:</strong> {agency.agncyfax}</p>
        </div>
      )}
    </div>
  );
};

export default UserProfile;
