const BASE_URL = "http://localhost:8080/api";

// booking
export const newBooking = async (bookingData, customerId) => {
  try {
    const response = await fetch(
      `${BASE_URL}/booking/new/${bookingData.tripTypeId}/${customerId}/${bookingData.packageId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "token" : "111",
        },
        body: JSON.stringify({
          ...bookingData,
          saveAt: new Date().toLocaleString(),
          travelers: ""
        }),
      }
    );
    if (!response.ok) {
      throw new Error("Failed to add new booking");
    }
    return await response.json();
  } catch (error) {
    console.error("Error adding booking:", error);
    return null;
  }
};

// booking list
export const bookingList =  async (customerId) => {
    try {
        const response = await fetch(
            `${BASE_URL}/booking/customer/${customerId}`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                "token" : "111",
              }
            }
          );
          if (!response.ok) {
            throw new Error("Failed to fetch booking list");
          }
          return await response.json();
    } catch (error) {
        console.error("Error fetching booking list:", error);
        return null;
    }
}
