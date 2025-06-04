import React, { useState, useEffect } from 'react';
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
import Popup from '../charts/PopUp';
import { useNavigation, useRoute } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import translations from '../assets/translation.json';
import { user } from '../data/userData';
import { supabase } from '../supabaseClient';

// Define available resource types and icons - same as AddForm
const resourceTypes = [
  { name: 'Crop', icon: 'sprout' },
  { name: 'Vehicle', icon: 'tractor' },
  { name: 'Cattle', icon: 'cow' },
];

const EditRecordForm = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { record } = route.params;
  const lang = user.language;

  // State management
  const [selectedResourceType, setSelectedResourceType] = useState(record.resource_type);
  const [resourceName, setResourceName] = useState(record.resource_name);
  const [resourceSize, setResourceSize] = useState(record.resource_size.toString());
  const [resourceDescription, setResourceDescription] = useState(record.resource_description);
  const [startDate, setStartDate] = useState(new Date(record.start_date));
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [popupVisible, setPopupVisible] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');
  const [saving, setSaving] = useState(false);

  const handleUpdate = async () => {
    // Validate input
    if (!resourceName || !resourceSize || !resourceDescription || !startDate) {
      setPopupMessage(translations.addResource.fillFieldsMessage[lang]);
      setPopupVisible(true);
      return;
    }

    // Set saving state to show loading indicator
    setSaving(true);

    // Prepare data for Supabase
    const updatedRecord = {
      resource_type: selectedResourceType,
      resource_name: resourceName,
      resource_size: parseFloat(resourceSize),
      resource_description: resourceDescription,
      start_date: startDate.toISOString().split('T')[0], // Format date as YYYY-MM-DD
    };

    // Update record in Supabase
    const { data, error } = await supabase
      .from('agricultural_records')
      .update(updatedRecord)
      .eq('id', record.id);

    setSaving(false);

    if (error) {
      console.error('Error updating record:', error);
      setPopupMessage(translations.editRecord?.errorMessage?.[lang] || 'Error updating record. Please try again.');
    } else {
      setPopupMessage(translations.editRecord?.successMessage?.[lang] || 'Record updated successfully!');
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
          {translations.editRecord?.title?.[lang] || 'Edit Record'}
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

        {/* Update and Cancel Buttons */}
        <View style={tw`flex-row justify-around mt-4`}>
          <TouchableOpacity
            style={tw`border border-green-500 bg-white py-2 px-4 rounded-full flex-row items-center`}
            onPress={handleUpdate}
            disabled={saving}>
            {saving ? (
              <ActivityIndicator size="small" color="#22c55e" style={tw`mr-2`} />
            ) : (
              <MaterialCommunityIcons name="content-save" size={18} color="#22c55e" style={tw`mr-2`} />
            )}
            <Text style={tw`text-black font-bold`}>
              {translations.editRecord?.update?.[lang] || 'Update'}
            </Text>
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
            if (popupMessage === (translations.editRecord?.successMessage?.[lang] || 'Record updated successfully!')) {
              navigation.goBack(); // Navigate only when update is successful
            }
          }}
        />
      </View>
    </ScrollView>
  );
};

export default EditRecordForm;