import React from 'react';
import { View, Image, Text } from 'react-native';
import { iconMapping } from '../data/iconMapping';
import tw from 'twrnc';

const ForecastCard = ({ date, time, iconCode, temp, windspeed}) => {
  const iconSource = iconMapping[iconCode] || iconMapping['03d'];

  return (
    <View
      style={tw`m-1 rounded-lg bg-white shadow border items-center p-2 border-solid border-1 border-gray-600`}>
      <View style={tw`py-2 items-center`}>
        <Text style={tw`text-sm font-bold`}>{date}</Text>
        <Text style={tw`text-xs`}>{time}</Text>
        <Image source={iconSource} style={tw`w-24 h-16`} />
        <Text style={tw`text-sm`}>{temp}°</Text>
        <Text style={tw`text-sm`}>{windspeed}</Text>
      </View>
    </View>
  );
};

export default ForecastCard;
