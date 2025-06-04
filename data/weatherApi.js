import axios from 'axios';

const API_KEY = 'efa2bed96a28f548909a177696cf0f90';

let cachedWeatherData = null; // Singleton to store weather data
let lastFetchTime = null; // Timestamp of the last fetch

const fetchWeatherData = async (latitude, longitude) => {
  const tenMinutes = 10 * 60 * 1000;
  const now = new Date().getTime();

  // Check for cached data
  if (cachedWeatherData && lastFetchTime && now - lastFetchTime < tenMinutes) {
    return cachedWeatherData; // Return cached data if it's still valid
  }

  try {
    // Fetch weather and forecast data
    const [weatherResponse, forecastResponse] = await Promise.all([
      axios.get(
        `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${API_KEY}`
      ),
      axios.get(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&units=metric&appid=${API_KEY}`
      ),
    ]);

    // Extracting relevant data directly from the response
    const temperature = weatherResponse.data.main.temp;
    const feelsLike = weatherResponse.data.main.feels_like;
    const condition = weatherResponse.data.weather[0].icon; // This is the weather icon code
    const locationName = weatherResponse.data.name;

    // Access sunrise and sunset correctly
    const sunrise = new Date(
      weatherResponse.data.sys.sunrise * 1000
    ).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const sunset = new Date(
      weatherResponse.data.sys.sunset * 1000
    ).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const minTemp = weatherResponse.data.main.temp_min; // Minimum temperature
    const maxTemp = weatherResponse.data.main.temp_max; // Maximum temperature
    const windSpeed = weatherResponse.data.wind.speed; // Wind speed
    const humidity = weatherResponse.data.main.humidity; // Humidity

    console.log(forecastResponse);

    // Map the forecast data
    const forecast = forecastResponse.data.list
      .map((item) => ({
        date: new Date(item.dt * 1000).toLocaleDateString(),
        time: new Date(item.dt * 1000).toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        }),
        icon: item.weather[0].icon,
        temp: Math.round(item.main.temp),
        windfSpeed: item.wind.speed,
      }))
      .slice(0, 15); // Limit to 15 forecast entries

    // Cache the fetched data
    cachedWeatherData = {
      temperature,
      feelsLike,
      condition,
      locationName,
      sunrise,
      sunset,
      forecast,
      minTemp,
      maxTemp,
      windSpeed,
      humidity,
    };
    lastFetchTime = now; // Update the last fetch time

    return cachedWeatherData; // Return the fetched data
  } catch (error) {
    console.error('Error fetching weather data', error);
    throw new Error('Failed to fetch weather data');
  }
};

// Exporting the function to get weather data
export const getWeatherData = async (latitude, longitude) => {
  return fetchWeatherData(latitude, longitude);
};
