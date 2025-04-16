const BASE_URL = "http://localhost:8080/api";

// Get token once at the top
const getAuthHeader = () => {
  const token = localStorage.getItem("jwt_token");
  if(token == null) {
    return {
      "Content-Type": "application/json",
    }
  }
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
};


// Get all agencies
export const fetchAgencies = async () => {
  const res = await fetch(`${BASE_URL}/agencies`,{
    method: "GET",
    headers: getAuthHeader(),
  });
  if (!res.ok) throw new Error("Failed to fetch agencies");
  return res.json();
};

// Get all agents
export const fetchAgents = async () => {
  const res = await fetch(`${BASE_URL}/agents`,{
    method: "GET",
    headers: getAuthHeader(),
  });
  if (!res.ok) throw new Error("Failed to fetch agents");
  return res.json();
};
