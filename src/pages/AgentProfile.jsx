import React, { useEffect, useState } from 'react';
import '../styles/AgentProfile.css';
import { useAuth } from '../contexts/AuthContext';

const AgentProfile = () => {
  const { user } = useAuth();
  const agentId = user?.id;

  const [agent, setAgent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!agentId) return;

    const fetchAgentData = async () => {
      try {
        const res = await fetch(`http://localhost:8080/api/agent/${agentId}`);
        if (!res.ok) throw new Error("Failed to fetch agent profile");

        const data = await res.json();
        setAgent(data);
      } catch (err) {
        console.error(err);
        setError("Unable to load agent profile.");
      } finally {
        setLoading(false);
      }
    };

    fetchAgentData();
  }, [agentId]);

  if (!agentId) return <p className="error-message">Not logged in.</p>;
  if (loading) return <div className="spinner-wrapper"><div className="spinner"></div><p>Loading profile...</p></div>;
  if (error) return <p className="error-message">{error}</p>;

  return (
    <div className="agent-profile">
      <h2>Agent Profile</h2>

      <div className="agent-card">
        <img
          src={agent.profileImageUrl || "https://placehold.co/120x120?text=No+Photo"}
          alt="Agent"
          className="agent-img"
        />
        <div className="info">
          <h3>{agent.agtfirstname} {agent.agtlastname}</h3>
          <p><strong>Email:</strong> {agent.agtemail}</p>
          <p><strong>Phone:</strong> {agent.agtbusphone}</p>
          <p><strong>Position:</strong> {agent.agtposition}</p>
          <h4>Agency Details</h4>
          <p><strong>Address:</strong> {agent.agencyid?.agncyaddress}, {agent.agencyid?.agncycity}, {agent.agencyid?.agncyprov}</p>
          <p><strong>Phone:</strong> {agent.agencyid?.agncyphone}</p>
        </div>
      </div>
    </div>
  );
};

export default AgentProfile;
