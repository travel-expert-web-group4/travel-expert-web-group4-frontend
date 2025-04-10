const BASE_URL = "http://localhost:8080/api";

// checkout
export const checkOutBill = async (checkData) => {
  try {
    const response = await fetch(
      `${BASE_URL}/stripe/checkout`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "token" : "111",
        },
        body: JSON.stringify({
          ...checkData
        }),
      }
    );
    if (!response.ok) {
      throw new Error("Failed to checkout");
    }
    return response.json();
  } catch (error) {
    console.error("Error checking out bill:", error);
    return null;
  }
};


