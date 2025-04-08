// 📍 Import statements remain the same
import React, { useEffect, useRef, useState } from "react";
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
  const [error, setError] = useState("");
  const agencyRefs = useRef({});

  const geocodeAddress = async (address) => {
    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
      address
    )}&key=${apiKey}`;
    try {
      const res = await fetch(url);
      const data = await res.json();
      if (data.status === "OK" && data.results.length > 0) {
        const { lat, lng } = data.results[0].geometry.location;
        return { lat, lng };
      }
    } catch (err) {
      console.error("Geocoding error:", err);
    }
    return { lat: 51.045, lng: -114.057 };
  };

  useEffect(() => {
    setLoading(true);
    Promise.all([
      fetch("http://localhost:8080/api/agencies").then((res) => res.json()),
      fetch("http://localhost:8080/api/agents").then((res) => res.json()),
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
      .catch((err) => {
        console.error("❌ Failed to load data:", err);
        setError("Failed to fetch agency and agent data. Please try again later.");
        setLoading(false);
      });
  }, []);

  const toggleAgency = (id) => {
    setExpandedAgencyIds((prev) =>
      prev.includes(id) ? prev.filter((aid) => aid !== id) : [...prev, id]
    );
    setAgentPage((prev) => ({ ...prev, [id]: 1 }));
  };

  const getFilteredAgents = (agencyId) => {
    const filtered = agents.filter(
      (agent) =>
        agent.agencyid?.id === agencyId &&
        (agent.agtfirstname.toLowerCase().includes(agentSearch.toLowerCase()) ||
          agent.agtlastname.toLowerCase().includes(agentSearch.toLowerCase()) ||
          agent.agtposition.toLowerCase().includes(agentSearch.toLowerCase()))
    );
    const currentPage = agentPage[agencyId] || 1;
    const start = (currentPage - 1) * AGENTS_PER_PAGE;
    return {
      agents: filtered.slice(start, start + AGENTS_PER_PAGE),
      total: filtered.length,
    };
  };

  const filteredAgencies = agencies.filter(
    (agency) =>
      agency.agncycity.toLowerCase().includes(searchTerm.toLowerCase()) ||
      agency.agncyprov.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleMarkerClick = (agencyId) => {
    const element = agencyRefs.current[agencyId];
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
      element.classList.add("ring-2", "ring-yellow-400");
      setTimeout(() => element.classList.remove("ring-2", "ring-yellow-400"), 1500);
    }
  };

  if (loading) {
    return (
      <div id="contact" className="min-h-screen px-4 py-12 grid gap-6 sm:grid-cols-2 md:grid-cols-3">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="animate-pulse bg-white rounded-lg shadow p-6 space-y-4 border border-gray-200"
          >
            <div className="h-4 bg-gray-300 rounded w-2/3"></div>
            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            <div className="h-3 bg-gray-200 rounded w-3/4"></div>
            <div className="h-3 bg-gray-200 rounded w-5/6"></div>
            <div className="h-3 bg-gray-200 rounded w-1/3"></div>
            <div className="flex gap-2 mt-4">
              <div className="h-8 w-20 bg-gray-300 rounded"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) return <p className="text-red-600 text-center">{error}</p>;

  return (
    <div className="min-h-screen bg-slate-50 pt-28 pb-10 px-4 md:px-10 relative">
      {/* Header */}
      <h2 className="text-4xl font-extrabold text-center text-blue-800 mb-2">📞 Contact Us</h2>
      <p className="text-center text-gray-600 text-sm mb-8 animate-fade-in">
        Find our agencies and reach the right agent for your needs
      </p>

      {/* Search + Map */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
        {/* Search Fields with placeholders */}
        <div className="space-y-6">
          {[
            {
              label: "Search agencies by city or province",
              value: searchTerm,
              set: setSearchTerm,
              placeholder: "e.g. Calgary or AB",
            },
            {
              label: "Search agents by name or role",
              value: agentSearch,
              set: setAgentSearch,
              placeholder: "e.g. Janet or Senior Agent",
            },
          ].map(({ label, value, set, placeholder }, idx) => (
            <div key={idx}>
              <label className="block text-gray-700 font-medium mb-1">{label}:</label>
              <div className="relative">
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded-md pl-10 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  value={value}
                  onChange={(e) => set(e.target.value)}
                  placeholder={placeholder}
                />
                <FontAwesomeIcon icon={faSearch} className="absolute left-3 top-2.5 text-gray-400" />
              </div>
            </div>
          ))}
        </div>

        {/* Map */}
        <div className="h-[350px] rounded overflow-hidden shadow">
          <GoogleMapComponent agencies={filteredAgencies} onMarkerClick={handleMarkerClick} />
        </div>
      </div>

      {/* Agencies and agents */}
      {filteredAgencies.length === 0 ? (
        <p className="text-center text-gray-500">No matching agencies found.</p>
      ) : (
        <div className="space-y-8">
          {filteredAgencies.map((agency) => {
            const { agents: agencyAgents, total } = getFilteredAgents(agency.id);
            const currentPage = agentPage[agency.id] || 1;
            const totalPages = Math.ceil(total / AGENTS_PER_PAGE);

            return (
              <div
                key={agency.id}
                ref={(el) => (agencyRefs.current[agency.id] = el)}
                className="bg-white rounded-lg shadow p-6 border border-gray-100 transition hover:shadow-xl hover:-translate-y-1 duration-300"
              >
                <h4 className="text-xl font-semibold text-blue-700 mb-2">Agency #{agency.id}</h4>
                <div className="text-sm text-gray-700 space-y-1 mb-4">
                  <p><strong>Address:</strong> {agency.agncyaddress}</p>
                  <p><strong>City:</strong> {agency.agncycity}</p>
                  <p><strong>Province:</strong> {agency.agncyprov}</p>
                  <p><strong>Postal Code:</strong> {agency.agncypostal}</p>
                  <p><strong>Country:</strong> {agency.agncycountry}</p>
                  <p><strong>Phone:</strong> {agency.agncyphone}</p>
                  <p><strong>Fax:</strong> {agency.agncyfax}</p>
                </div>

                <button
                  className="bg-blue-600 text-white text-sm px-4 py-2 rounded hover:bg-blue-700 transition"
                  onClick={() => toggleAgency(agency.id)}
                >
                  {expandedAgencyIds.includes(agency.id) ? "Hide Agents" : "Show Agents"}
                </button>

                {expandedAgencyIds.includes(agency.id) && (
                  <div className="mt-5 animate-fade-in transition-all duration-300 ease-out">
                    {agencyAgents.length === 0 ? (
                      <p className="text-sm text-gray-500">No matching agents for this agency.</p>
                    ) : (
                      <>
                        <ul className="divide-y divide-gray-200 animate-fade-in-up">
                          {agencyAgents.map((agent) => (
                            <li key={agent.id} className="flex items-start gap-4 py-4">
                              <img
                                src={
                                  agent.profileImageUrl
                                    ? `http://localhost:8080${agent.profileImageUrl}`
                                    : "/default-avatar.png"
                                }
                                onError={(e) => (e.target.src = "/default-avatar.png")}
                                alt={`${agent.agtfirstname}'s profile`}
                                className="w-14 h-14 rounded-full object-cover"
                              />
                              <div className="text-sm text-gray-700">
                                <strong>
                                  {agent.agtfirstname} {agent.agtmiddleinitial || ""} {agent.agtlastname}
                                </strong>
                                <br />
                                {agent.agtposition}
                                <br />
                                📞 {agent.agtbusphone} <br />
                                ✉️{" "}
                                <a href={`mailto:${agent.agtemail}`} className="text-blue-600 hover:underline">
                                  {agent.agtemail}
                                </a>
                              </div>
                            </li>
                          ))}
                        </ul>

                        {totalPages > 1 && (
                          <div className="mt-4 flex flex-wrap gap-2">
                            {Array.from({ length: totalPages }, (_, i) => (
                              <button
                                key={i + 1}
                                onClick={() =>
                                  setAgentPage((prev) => ({ ...prev, [agency.id]: i + 1 }))
                                }
                                className={`px-3 py-1 rounded text-sm border ${
                                  currentPage === i + 1
                                    ? "bg-blue-600 text-white"
                                    : "bg-white text-blue-600 border-blue-600"
                                } hover:bg-blue-700 hover:text-white transition`}
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

      {/* Scroll to Top */}
      {filteredAgencies.length > 3 && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed bottom-8 right-8 bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700"
        >
          ⬆️
        </button>
      )}
    </div>
  );
};

export default ContactUs;
