import React, { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import axios from "axios";

const BACKEND_URL = "http://localhost:8080";

const UserProfile = () => {
  const { token } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(`${BACKEND_URL}/api/customer/profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setProfile(res.data);
      } catch (error) {
        console.error("Failed to fetch profile", error);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchProfile();
    }
  }, [token]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64 text-gray-600 text-xl">
        Loading profile...
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="text-red-600 text-center font-medium mt-8">
        Failed to load profile. Please try logging in again.
      </div>
    );
  }

  const customer = profile.customer || {};
  const fullName = `${customer.custfirstname || ""} ${customer.custlastname || ""}`;

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white rounded shadow space-y-4">
      <h2 className="text-2xl font-semibold text-blue-600">Welcome, {fullName}</h2>
      <p><strong>Email:</strong> {profile.email}</p>
      <p><strong>Phone:</strong> {customer.custhomephone || "Not provided"}</p>
      <p><strong>Role:</strong> {profile.role}</p>
      <p><strong>Customer Type:</strong> {profile.customerType?.name || "Unknown"}</p>
      <p><strong>Points:</strong> {profile.points}</p>
    </div>
  );
};

export default UserProfile;
