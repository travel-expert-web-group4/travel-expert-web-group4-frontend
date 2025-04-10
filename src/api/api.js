//Below is just an example of a central api and how to fetch data from a backend API.

const BASE_URL = "http://localhost:8800/api"; // Replace with actual backend URL

// Fetch all travel packages
export const fetchPackages = async () => {
    try {
        const response = await fetch(`${BASE_URL}/packages`);
        if (!response.ok) {
            throw new Error("Failed to fetch packages");
        }
        return await response.json();
    } catch (error) {
        console.error("Error fetching packages:", error);
        return [];
    }
};

// Fetch a single package by ID
export const fetchPackageById = async (id) => {
    try {
        const response = await fetch(`${BASE_URL}/packages/${id}`);
        if (!response.ok) {
            throw new Error("Failed to fetch package details");
        }
        return await response.json();
    } catch (error) {
        console.error("Error fetching package details:", error);
        return null;
    }
};

// User login (Example for authentication)
export const loginUser = async (email, password) => {
    try {
        const response = await fetch(`${BASE_URL}/auth/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, password }),
        });
        return await response.json();
    } catch (error) {
        console.error("Login error:", error);
        return null;
    }
};
