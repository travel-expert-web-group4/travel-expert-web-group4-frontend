import React, { useEffect, useRef, useState } from "react";
import "../styles/ContactUs.css";
import GoogleMapComponent from "../components/GoogleMapComponent";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";

const AGENTS_PER_PAGE = 3;

const ContactUs = () => {
  const [agencies, setAgencies] = useState([]);
  const [agents, setAgents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedAgencyIds, setExpandedAgencyIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [agentSearch, setAgentSearch] = useState("");
  const [agentPage, setAgentPage] = useState({});
  const [error, setError] = useState(""); // NEW: error state
  const agencyRefs = useRef({});

  const geocodeAddress = async (address) => {
    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${apiKey}`;

    try {
      const res = await fetch(url);
      const data = await res.json();
      if (data.status === "OK" && data.results.length > 0) {
        const { lat, lng } = data.results[0].geometry.location;
        return { lat, lng };
      } else {
        console.warn("Geocoding failed:", address, data.status);
      }
    } catch (err) {
      console.error("Geocoding error:", err);
    }
    return { lat: 51.045, lng: -114.057 }; // fallback to Calgary
  };

  useEffect(() => {
    setLoading(true);
    Promise.all([
      fetch("http://localhost:8080/api/agencies").then(res => res.json()),
      fetch("http://localhost:8080/api/agents").then(res => res.json())
    ])
      .then(async ([agenciesData, agentsData]) => {
        const geocoded = await Promise.all(
          agenciesData.map(async (agency) => {
            const fullAddress = `${agency.agncyaddress}, ${agency.agncycity}, ${agency.agncyprov}, ${agency.agncypostal}, ${agency.agncycountry}`;
            const coords = await geocodeAddress(fullAddress);
            return { ...agency, lat: coords.lat, lng: coords.lng };
          })
        );

        setAgencies(geocoded);
        setAgents(agentsData);
        setLoading(false);
      })
      .catch(err => {
        console.error("❌ Failed to load data:", err);
        setError("Failed to fetch agency and agent data. Please try again later.");
        setLoading(false);
      });
  }, []);

  const toggleAgency = (id) => {
    setExpandedAgencyIds(prev =>
      prev.includes(id) ? prev.filter(aid => aid !== id) : [...prev, id]
    );
    setAgentPage(prev => ({ ...prev, [id]: 1 }));
  };

  const getFilteredAgents = (agencyId) => {
    const filtered = agents.filter(agent =>
      agent.agencyid?.id === agencyId &&
      (agent.agtfirstname.toLowerCase().includes(agentSearch.toLowerCase()) ||
        agent.agtlastname.toLowerCase().includes(agentSearch.toLowerCase()) ||
        agent.agtposition.toLowerCase().includes(agentSearch.toLowerCase()))
    );

    const currentPage = agentPage[agencyId] || 1;
    const start = (currentPage - 1) * AGENTS_PER_PAGE;

    return {
      agents: filtered.slice(start, start + AGENTS_PER_PAGE),
      total: filtered.length
    };
  };

  const filteredAgencies = agencies.filter(agency =>
    agency.agncycity.toLowerCase().includes(searchTerm.toLowerCase()) ||
    agency.agncyprov.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleMarkerClick = (agencyId) => {
    const element = agencyRefs.current[agencyId];
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
      element.classList.add("highlight");
      setTimeout(() => element.classList.remove("highlight"), 1500);
    }
  };

  if (loading) return <p>Loading agencies and agents...</p>;
  if (error) return <p className="error-message">{error}</p>;

  return (
    <div className="contact-container">
      <h2>📞 Contact Us</h2>

      <div className="contact-top">
        <div className="search-section">
          <p>Search agencies by city or province:</p>
          <div className="search-input-wrapper">
            <input
              type="text"
              placeholder="e.g. Calgary or AB"
              className="search-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <FontAwesomeIcon icon={faSearch} className="search-input-icon" />
          </div>

          <p>Search agents by name or role:</p>
          <div className="search-input-wrapper">
            <input
              type="text"
              placeholder="e.g. Janet or Senior Agent"
              className="search-input"
              value={agentSearch}
              onChange={(e) => setAgentSearch(e.target.value)}
            />
            <FontAwesomeIcon icon={faSearch} className="search-input-icon" />
          </div>
        </div>

        <div className="map-wrapper">
          <GoogleMapComponent
            agencies={filteredAgencies}
            onMarkerClick={handleMarkerClick}
          />
        </div>
      </div>

      {filteredAgencies.length === 0 ? (
        <p className="no-results">No matching agencies found.</p>
      ) : (
        <div className="agency-list">
          {filteredAgencies.map((agency) => {
            const { agents: agencyAgents, total } = getFilteredAgents(agency.id);
            const currentPage = agentPage[agency.id] || 1;
            const totalPages = Math.ceil(total / AGENTS_PER_PAGE);

            return (
              <div
                key={agency.id}
                className="agency-card"
                ref={(el) => (agencyRefs.current[agency.id] = el)}
              >
                <h4>Agency #{agency.id}</h4>
                <p><strong>Address:</strong> {agency.agncyaddress}</p>
                <p><strong>City:</strong> {agency.agncycity}</p>
                <p><strong>Province:</strong> {agency.agncyprov}</p>
                <p><strong>Postal Code:</strong> {agency.agncypostal}</p>
                <p><strong>Country:</strong> {agency.agncycountry}</p>
                <p><strong>Phone:</strong> {agency.agncyphone}</p>
                <p><strong>Fax:</strong> {agency.agncyfax}</p>

                <button
                  className="toggle-agents-btn"
                  onClick={() => toggleAgency(agency.id)}
                >
                  {expandedAgencyIds.includes(agency.id) ? "Hide Agents" : "Show Agents"}
                </button>

                {expandedAgencyIds.includes(agency.id) && (
                  <div className="agents-section">
                    {agencyAgents.length === 0 ? (
                      <p className="no-results">No matching agents for this agency.</p>
                    ) : (
                      <>
                        <ul>
                          {agencyAgents.map(agent => (
                            <li key={agent.id} className="agent-item">
                              <img
                                src={
                                  agent.profileImageUrl
                                    ? `http://localhost:8080${agent.profileImageUrl}`
                                    : "/default-avatar.png"
                                }
                                alt={`${agent.agtfirstname}'s profile`}
                                className="agent-photo"
                              />
                              <div>
                                <strong>{agent.agtfirstname} {agent.agtmiddleinitial || ""} {agent.agtlastname}</strong><br />
                                {agent.agtposition}<br />
                                📞 {agent.agtbusphone} <br />
                                ✉️ <a href={`mailto:${agent.agtemail}`}>{agent.agtemail}</a>
                              </div>
                            </li>
                          ))}
                        </ul>

                        {totalPages > 1 && (
                          <div className="pagination">
                            {Array.from({ length: totalPages }, (_, i) => (
                              <button
                                key={i + 1}
                                className={`page-btn ${currentPage === i + 1 ? "active" : ""}`}
                                onClick={() =>
                                  setAgentPage(prev => ({ ...prev, [agency.id]: i + 1 }))
                                }
                              >
                                {i + 1}
                              </button>
                            ))}
                          </div>
                        )}
                      </>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ContactUs;
