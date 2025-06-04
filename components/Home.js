import React, { useEffect, useState, useCallback } from 'react';
import { View, ActivityIndicator, ScrollView, Text } from 'react-native';
import * as Location from 'expo-location';
import { getWeatherData } from '../data/weatherApi';
import WeatherCard from './WeatherCard';
import ForecastCard from './ForecastCard';
import ErrorMessage from '../pages/ErrorMessage';
import WeatherInfoCard from './weatherinfo'; // Import the updated WeatherInfoCard component
import tw from 'twrnc';

const Home = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchWeatherData = useCallback(async (latitude, longitude) => {
    setLoading(true);
    try {
      const data = await getWeatherData(latitude, longitude);
      setWeatherData(data);
    } catch (error) {
      setError('Failed to fetch weather data. Please try again.');
      setWeatherData(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const getLocationAndFetchWeather = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setError('Permission to access location was denied');
        setLoading(false);
        return;
      }

      try {
        const { coords } = await Location.getCurrentPositionAsync({});
        fetchWeatherData(coords.latitude, coords.longitude);
      } catch (error) {
        setError('Unable to retrieve location.');
        setLoading(false);
      }
    };

    getLocationAndFetchWeather();
  }, [fetchWeatherData]);

  if (loading) {
    return (
      <View style={tw`flex-1 justify-center items-center bg-gray-100`}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (error) {
    return <ErrorMessage message={error} />;
  }

  const {
    temperature = 'N/A',
    feelsLike = 'N/A',
    condition = 'Unknown',
    locationName = 'Unknown Location',
    sunrise = 'N/A',
    sunset = 'N/A',
    forecast = [],
    minTemp = 'N/A',
    maxTemp = 'N/A',
    windSpeed = 'N/A',
    humidity = 'N/A',
  } = weatherData || {};

  return (
    <ScrollView style={tw`flex-1 bg-slate-100`}>
      <WeatherCard
        temperature={String(temperature)}
        feelsLike={String(feelsLike)}
        iconCode={condition}
        locationName={locationName}
        sunrise={sunrise}
        sunset={sunset}
      />

      <View style={tw`py-2`}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {forecast.length > 0 ? (
            forecast.map((item, index) => (
              <ForecastCard
                key={index}
                date={String(item.date)}
                time={String(item.time)}
                iconCode={item.icon}
                temp={String(item.temp)}
                winds={String(item.windfSpeed)}
              />
            ))
          ) : (
            <Text style={tw`text-xl text-center`}>
              No forecast data available.
            </Text>
          )}
        </ScrollView>
      </View>

      {/* Flexbox layout for WeatherInfoCard components */}
      <View style={tw`flex flex-row flex-wrap justify-between p-1`}>
        <View style={tw`w-1/2 p-2`}>
          <WeatherInfoCard title="Min Temp" value={`${minTemp} °C`} />
        </View>
        <View style={tw`w-1/2 p-2`}>
          <WeatherInfoCard title="Max Temp" value={`${maxTemp} °C`} />
        </View>
        <View style={tw`w-1/2 p-2`}>
          <WeatherInfoCard title="Wind Speed" value={`${windSpeed} m/s`} />
        </View>
        <View style={tw`w-1/2 p-2`}>
          <WeatherInfoCard title="Humidity" value={`${humidity} %`} />
        </View>
      </View>
    </ScrollView>
  );
};

export default Home;
