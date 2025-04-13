import React, { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";

const BACKEND_URL = "http://localhost:8080";

const UserProfile = () => {
  const { user, token } = useAuth(); // Get JWT-decoded user + token
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchFullProfile = async () => {
      try {
        const cleanToken = token?.trim(); // 🔐 Prevent whitespace issue
        const res = await fetch(`${BACKEND_URL}/api/customer/${user?.id}`, {
          headers: {
            Authorization: `Bearer ${cleanToken}`,
          },
        });

        if (!res.ok) throw new Error("Failed to fetch profile");
        const data = await res.json();
        setProfile(data);
      } catch (err) {
        console.error("❌ Error fetching profile:", err);
        setError("Failed to load your profile.");
      } finally {
        setLoading(false);
      }
    };

    if (user?.id && token) {
      fetchFullProfile();
    }
  }, [user?.id, token]);

  if (loading) return <div className="p-6 text-gray-500 text-center">Loading profile...</div>;
  if (error) return <div className="p-6 text-red-500 text-center">{error}</div>;
  if (!profile) return null;

  return (
    <div className="max-w-3xl mx-auto bg-white shadow-md rounded p-6 mt-10">
      <h2 className="text-2xl font-bold text-blue-700 mb-4">My Profile</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-800">
        <div><strong>First Name:</strong> {profile.custfirstname}</div>
        <div><strong>Last Name:</strong> {profile.custlastname}</div>
        <div><strong>Email:</strong> {profile.custemail}</div>
        <div><strong>Phone:</strong> {profile.custhomephone}</div>
        <div><strong>Address:</strong> {profile.custaddress}</div>
        <div><strong>City:</strong> {profile.custcity}</div>
        <div><strong>Province:</strong> {profile.custprov}</div>
        <div><strong>Postal Code:</strong> {profile.custpostal}</div>
        <div><strong>Country:</strong> {profile.custcountry}</div>
      </div>
    </div>
  );
};

export default UserProfile;
