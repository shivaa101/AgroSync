export const iconMapping = {
  "01d": require("../icons/01d.png"),          // Clear (day)
  "01n": require('../icons/01n.png'),           // Clear (night)
  "02d": require('../icons/02d.png'),           // Partly cloudy (day)
  "02n": require('../icons/02n.png'),           // Partly cloudy (night)
  "03d": require('../icons/03d.png'),           // Cloudy (day)
  "03n": require('../icons/03n.png'),           // Cloudy (night)
  "04d": require('../icons/04d.png'),           // Overcast (day)
  "04n": require('../icons/04n.png'),           // Overcast (night)
  "09d": require('../icons/09d.png'),           // Rain (day)
  "09n": require('../icons/09n.png'),           // Rain (night)
  "10d": require('../icons/10d.png'),           // Rain (day)
  "10n": require('../icons/10n.png'),           // Rain (night)
  "11d": require('../icons/11d.png'),           // Thunderstorm (day)
  "11n": require('../icons/11n.png'),           // Thunderstorm (night)
  "13d": require('../icons/13d.png'),           // Snow (day)
  "13n": require('../icons/13n.png'),           // Snow (night)
  "50d": require('../icons/50d.png'),           // Fog (day)
  "50n": require('../icons/50n.png'),           // Fog (night)
};




// Function to get the icon name based on the icon code
export const getWeatherIcon = (iconCode) => {
  // Check if the iconCode exists in the iconMapping
  const iconName = iconMapping[iconCode];
  if (iconName) {
    return iconName; // Return the corresponding icon name
  } else {
    console.warn(`Icon code ${iconCode} not found. Returning default icon.`);
    return 'weather-cloudy'; // Default icon if not found
  }
};
