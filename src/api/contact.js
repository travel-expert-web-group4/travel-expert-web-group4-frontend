const BASE_URL = "http://localhost:8080/api";

// Get all agencies
export const fetchAgencies = async () => {
  const res = await fetch(`${BASE_URL}/agencies`);
  if (!res.ok) throw new Error("Failed to fetch agencies");
  return res.json();
};

// Get all agents
export const fetchAgents = async () => {
  const res = await fetch(`${BASE_URL}/agents`);
  if (!res.ok) throw new Error("Failed to fetch agents");
  return res.json();
};
