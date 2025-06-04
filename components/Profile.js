import React, { useState } from 'react';
import { View, Text, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // Assuming you want to keep using Ionicons
import { user } from '../data/userData'; // Ensure this path is correct
import profilepic from '../assets/profile.png'; // Ensure this path is correct
import tw from 'twrnc'; // Importing TWRNC

const Home = () => {
  const [imageUri, setImageUri] = useState(user.photo);
  const [imageError, setImageError] = useState(false);

  return (
    <View style={tw`flex-1 items-center bg-gray-100`}>
      <View style={tw`m-3 p-4 rounded-lg bg-white flex-row items-center shadow-lg`}>
        <Image
          source={imageError ? profilepic : { uri: imageUri }}
          style={tw`w-16 h-16 rounded-full mr-5`} // 64px width and height, rounded
          onError={() => setImageError(true)}
        />
        <View style={tw`flex-1`}>
          <Text style={tw`text-lg font-bold mb-1`}>{user.name}</Text>
          <Text style={tw`text-base text-gray-600 mb-1`}>{user.mobile}</Text>
          <View style={tw`flex-row items-center`}>
            <Ionicons name="location-outline" size={16} color="black" />
            <Text style={tw`text-base text-gray-600 ml-1`}>{user.address}</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default Home;
