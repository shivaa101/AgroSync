import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import tw from 'twrnc';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons'; // Import Ionicons from @expo/vector-icons
import AgriculturalRecords from './AgriculturalRecords'; 

const Add = () => {
  const navigation = useNavigation(); // Use navigation hook to access navigation

  return (
    <View style={tw`flex-1 bg-slate-100`}>
      <AgriculturalRecords />
    </View>
  );
};

export default Add;