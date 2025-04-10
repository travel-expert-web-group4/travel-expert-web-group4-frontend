const BASE_URL = "http://localhost:8080/api";

// review package
export const reviewPackage = async (reviweData, packageId, email) => {
  try {
    const response = await fetch(
      `${BASE_URL}/review/post`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "token" : "111",
        },
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
    const response = await fetch(`${BASE_URL}/review/package/${packageId}`)
    if(!response.ok) {
      throw new Error("Failed to load review list");
    }
    return response.json();
  } catch (err) {
    console.error("Error get review list:", error);
    return null;
  }
}
