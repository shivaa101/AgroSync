import React, { useState } from 'react';
import {
  View,
  TextInput,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import tw from 'twrnc';
import DateTimePicker from '@react-native-community/datetimepicker';
import Popup from './PopUp';
import { useNavigation } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import translations from '../assets/translation.json';
import { user } from '../data/userData';
import { supabase } from '../supabaseClient'; // Import Supabase client

// Define available resource types and icons
const resourceTypes = [
  { name: 'Crop', icon: 'sprout' }, // Sprout icon for Crop
  { name: 'Vehicle', icon: 'tractor' }, // Tractor icon for Vehicle
  { name: 'Cattle', icon: 'cow' }, // Cow icon for Cattle
];

const AddForm = () => {
  const navigation = useNavigation();
  const lang = user.language;

  // State management
  const [selectedResourceType, setSelectedResourceType] = useState(resourceTypes[0].name);
  const [resourceName, setResourceName] = useState('');
  const [resourceSize, setResourceSize] = useState('');
  const [resourceDescription, setResourceDescription] = useState('');
  const [startDate, setStartDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [popupVisible, setPopupVisible] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    // Validate input
    if (!resourceName || !resourceSize || !resourceDescription || !startDate) {
      setPopupMessage(translations.addResource.fillFieldsMessage[lang]);
      setPopupVisible(true);
      return;
    }

    // Set saving state to show loading indicator
    setSaving(true);

    // Prepare data for Supabase
    const newRecord = {
      resource_type: selectedResourceType,
      resource_name: resourceName,
      resource_size: parseFloat(resourceSize),
      resource_description: resourceDescription,
      start_date: startDate.toISOString().split('T')[0], // Format date as YYYY-MM-DD
    };

    // Save to Supabase
    const { data, error } = await supabase
      .from('agricultural_records')
      .insert(newRecord);

    setSaving(false);

    if (error) {
      console.error('Error saving record:', error);
      setPopupMessage(translations.addResource.errorMessage?.[lang] || 'Error saving record. Please try again.');
    } else {
      setPopupMessage(translations.addResource.successMessage[lang]);
    }
    
    setPopupVisible(true);
  };

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) setStartDate(selectedDate);
  };

  return (
    <ScrollView contentContainerStyle={tw`flex-grow justify-center`}>
      <View style={tw`p-4 bg-white rounded-lg shadow-md mx-4 my-8`}>
        <Text style={tw`text-xl font-bold mb-4 text-center`}>
          {translations.addResource.title[lang]}
        </Text>

        {/* Horizontal ScrollView for selecting resource type */}
        <Text style={tw`mb-2 font-bold`}>{translations.addResource.selectType[lang]}</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={tw`mb-4`}>
          {resourceTypes.map((type) => (
            <TouchableOpacity
              key={type.name}
              style={[
                tw`flex-row items-center py-2 px-4 mr-2 rounded-full`,
                selectedResourceType === type.name
                  ? tw`bg-blue-500`
                  : tw`bg-gray-300`,
              ]}
              onPress={() => setSelectedResourceType(type.name)}>
              <MaterialCommunityIcons
                name={type.icon}
                size={20}
                color={selectedResourceType === type.name ? 'white' : 'black'}
                style={tw`mr-2`}
              />
              <Text
                style={tw`font-bold ${
                  selectedResourceType === type.name ? 'text-white' : 'text-black'
                }`}>
                {translations.addResource.resourceTypes[type.name][lang]}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Input for Resource Name */}
        <Text style={tw`mb-1 font-bold`}>{translations.addResource.resourceName[lang]}</Text>
        <TextInput
          style={tw`border border-gray-300 p-2 mb-4 rounded`}
          placeholder={translations.addResource.placeholders.resourceName[lang]}
          value={resourceName}
          onChangeText={setResourceName}
        />

        {/* Input for Resource Size */}
        <Text style={tw`mb-1 font-bold`}>{translations.addResource.resourceSize[lang]}</Text>
        <TextInput
          style={tw`border border-gray-300 p-2 mb-4 rounded`}
          placeholder={translations.addResource.placeholders.resourceSize[lang]}
          value={resourceSize}
          onChangeText={setResourceSize}
          keyboardType="numeric"
        />

        {/* Input for Resource Description */}
        <Text style={tw`mb-1 font-bold`}>{translations.addResource.resourceDescription[lang]}</Text>
        <TextInput
          style={tw`border border-gray-300 p-2 mb-4 rounded`}
          placeholder={translations.addResource.placeholders.resourceDescription[lang]}
          value={resourceDescription}
          onChangeText={setResourceDescription}
          multiline
          numberOfLines={4}
        />

        {/* Start Date */}
        <Text style={tw`mb-1 font-bold`}>{translations.addResource.startDate[lang]}</Text>
        <TouchableOpacity
          style={tw`border border-gray-300 p-3 rounded mb-4`}
          onPress={() => setShowDatePicker(true)}>
          <Text style={tw`text-gray-600`}>{startDate.toDateString()}</Text>
        </TouchableOpacity>
        {showDatePicker && (
          <DateTimePicker
            value={startDate}
            mode="date"
            display="default"
            onChange={handleDateChange}
          />
        )}

        {/* Save and Cancel Buttons */}
        <View style={tw`flex-row justify-around mt-4`}>
          <TouchableOpacity
            style={tw`border border-green-500 bg-white py-2 px-4 rounded-full flex-row items-center`}
            onPress={handleSave}
            disabled={saving}>
            {saving ? (
              <ActivityIndicator size="small" color="#22c55e" style={tw`mr-2`} />
            ) : (
              <MaterialCommunityIcons name="content-save" size={18} color="#22c55e" style={tw`mr-2`} />
            )}
            <Text style={tw`text-black font-bold`}>{translations.addResource.save[lang]}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={tw`border border-red-500 bg-white py-2 px-4 rounded-full flex-row items-center`}
            onPress={() => navigation.goBack()}
            disabled={saving}>
            <MaterialCommunityIcons name="close" size={18} color="#ef4444" style={tw`mr-2`} />
            <Text style={tw`text-black font-bold`}>{translations.addResource.cancel[lang]}</Text>
          </TouchableOpacity>
        </View>

        {/* Popup for displaying messages */}
        <Popup
          visible={popupVisible}
          message={popupMessage}
          onClose={() => {
            setPopupVisible(false);
            if (popupMessage === translations.addResource.successMessage[lang]) {
              navigation.goBack(); // Navigate only when saving is successful
            }
          }}
        />
      </View>
    </ScrollView>
  );
};

export default AddForm;