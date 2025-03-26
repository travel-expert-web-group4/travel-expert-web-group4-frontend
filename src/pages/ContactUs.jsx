import React, { useEffect, useState } from "react";
import "../styles/ContactUs.css";

const ContactUs = () => {
  const [agencies, setAgencies] = useState([]);
  const [agents, setAgents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedAgencyIds, setExpandedAgencyIds] = useState([]);

  useEffect(() => {
    fetch("/mockAgencies.json")
      .then(res => res.json())
      .then(data => setAgencies(data));

    fetch("/mockAgents.json")
      .then(res => res.json())
      .then(data => setAgents(data));
  }, []);

  const getAgentsForAgency = (agencyId) => {
    return agents.filter(agent => agent.agencyId === agencyId);
  };

  const toggleAgency = (id) => {
    setExpandedAgencyIds(prev =>
      prev.includes(id)
        ? prev.filter(aid => aid !== id)
        : [...prev, id]
    );
  };

  const filteredAgencies = agencies.filter(agency =>
    agency.agncyCity.toLowerCase().includes(searchTerm.toLowerCase()) ||
    agency.agncyProv.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="contact-container">
      <h2>📞 Contact Us</h2>
      <p>Search agencies by city or province:</p>
      <input
        type="text"
        placeholder="e.g. Calgary or AB"
        className="agency-search"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <div className="agency-list">
        {filteredAgencies.map((agency) => (
          <div key={agency.agencyId} className="agency-card">
            <h4>Agency #{agency.agencyId}</h4>
            <p><strong>Address:</strong> {agency.agncyAddress}</p>
            <p><strong>City:</strong> {agency.agncyCity}</p>
            <p><strong>Province:</strong> {agency.agncyProv}</p>
            <p><strong>Postal Code:</strong> {agency.agncyPostal}</p>
            <p><strong>Country:</strong> {agency.agncyCountry}</p>
            <p><strong>Phone:</strong> {agency.agncyPhone}</p>
            <p><strong>Fax:</strong> {agency.agncyFax}</p>

            {/* Collapsible agents section */}
            <button
              className="toggle-agents-btn"
              onClick={() => toggleAgency(agency.agencyId)}
            >
              {expandedAgencyIds.includes(agency.agencyId) ? "Hide Agents" : "Show Agents"}
            </button>

            {expandedAgencyIds.includes(agency.agencyId) && (
              <div className="agents-section">
                {getAgentsForAgency(agency.agencyId).length === 0 ? (
                  <p>No agents assigned to this agency.</p>
                ) : (
                  <ul>
                    {getAgentsForAgency(agency.agencyId).map(agent => (
                      <li key={agent.agentId}>
                        <strong>{agent.agtFirstName} {agent.agtMiddleInitial} {agent.agtLastName}</strong><br />
                        {agent.agtPosition}<br />
                        📞 {agent.agtBusPhone} <br />
                        ✉️ <a href={`mailto:${agent.agtEmail}`}>{agent.agtEmail}</a>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ContactUs;
