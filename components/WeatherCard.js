import React from 'react';
import { View, Image, Text, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { iconMapping } from '../data/iconMapping';
import sunriseicon from '../icons/02d.png';
import sunseticon from '../icons/02n.png';
import tw from 'twrnc';
import translations from '../assets/translation.json';
import { user } from '../data/userData';

const WeatherCard = ({
  temperature = 'N/A',
  feelsLike = 'N/A',
  iconCode = 'Unknown',
  locationName = 'Unknown Location',
  sunrise = 'N/A',
  sunset = 'N/A',
  onRefresh,
}) => {
  const iconSource = iconMapping[iconCode] || iconMapping['03d'];
  const lang = user.language;

  return (
    <View style={tw`ml-2 mr-2 bg-white rounded-3xl shadow-md pl-4 p-4`}>
      {/* Header Section */}
      <View style={tw`flex-row justify-between items-center mb-4`}>
        <Text style={tw`text-2xl font-semibold text-gray-800`}>
          {translations.home.weather[lang]}
        </Text>
        <TouchableOpacity onPress={onRefresh}>
          <MaterialCommunityIcons
            name="refresh"
            size={28}
            style={tw`text-blue-500`}
          />
        </TouchableOpacity>
      </View>

      {/* Location Section */}
      <View style={tw`flex-row items-center`}>
        <MaterialCommunityIcons
          name="map-marker"
          size={26}
          style={tw`text-blue-500 mr-2`}
        />
        <Text style={tw`text-lg font-medium text-gray-600`}>
          {locationName}
        </Text>
      </View>

      {/* Weather Info Section */}
      <View style={tw`flex-row items-center`}>
        <Image source={iconSource} style={tw`w-20 h-20 mr-4`} />
        <View>
          <Text style={tw`text-4xl font-bold text-gray-800`}>
            {temperature}°C
          </Text>
          <Text style={tw`text-lg text-gray-500`}>
            {translations.home.feelsLike[lang]}: {feelsLike}°C
          </Text>
        </View>
      </View>

      {/* Sunrise and Sunset Section */}
      <View style={tw`flex-row justify-between items-center mt-4`}>
        <InfoRow icon={sunriseicon} text={`${sunrise}`} />
        <InfoRow icon={sunseticon} text={`${sunset}`} />
      </View>
    </View>
  );
};

// InfoRow Component to display sunrise/sunset info
const InfoRow = ({ icon, text }) => (
  <View style={tw`flex-row items-center`}>
    <Image source={icon} style={tw`w-10 h-10 mr-2`} />
    <Text style={tw`text-lg text-gray-600`}>{text}</Text>
  </View>
);

export default WeatherCard;