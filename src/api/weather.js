

const apiKey = '24007347dad87e5428bf360c591f55f1'; 

export const getWeather = async (city) => {
  try {
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`)
    if(!response.ok) {
      throw new Error(`Failed to fetch weather of the ${city}`); 
    }
    return response.json();
  } catch (err) {
    console.error("Error fetching weather:", error);
    return null;
  }
}