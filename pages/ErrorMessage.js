import React from 'react';
import { View, Text } from 'react-native';
import tw from 'twrnc'; // Importing TWRNC

const ErrorMessage = ({ message }) => {
  return (
    <View style={tw`m-2 p-4 bg-red-100 border border-red-300 rounded-lg shadow`}>
      <Text style={tw`text-lg text-red-800 text-center`}>{message}</Text>
    </View>
  );
};

export default ErrorMessage;
