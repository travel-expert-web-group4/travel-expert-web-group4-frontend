const BASE_URL = "http://localhost:8080/api";


// Get token once at the top
const getAuthHeader = () => {
  const token = localStorage.getItem("jwt_token");
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
};

// review package
export const reviewPackage = async (reviweData, packageId, email) => {
  try {
    const response = await fetch(
      `${BASE_URL}/review/post`,
      {
        method: "POST",
        headers: getAuthHeader(),
        body: JSON.stringify({
          package_review:{
            ...reviweData
          },
          package_id:packageId,
          user_email:email
        }),
      }
    );
    if (!response.ok) {
      throw new Error("Failed to review package");
    }
  } catch (error) {
    console.error("Error reviewing package:", error);
    return null;
  }
};

// get reviews
export const getReview = async (packageId) => {
  try {
    const response = await fetch(`${BASE_URL}/review/package/${packageId}`,{
      method: "GET",
      headers: getAuthHeader(),
    })
    if(!response.ok) {
      throw new Error("Failed to load review list");
    }
    return response.json();
  } catch (err) {
    console.error("Error get review list:", error);
    return null;
  }
}
