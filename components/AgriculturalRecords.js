import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl
} from 'react-native';
import { supabase } from '../supabaseClient'; // Adjust this import based on your project structure
import tw from 'twrnc';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import translations from '../assets/translation.json';
import { user } from '../data/userData';

// Resource type icons - same as in AddForm
const resourceIcons = {
  'Crop': 'sprout',
  'Vehicle': 'tractor',
  'Cattle': 'cow'
};

const AgriculturalRecords = () => {
  const navigation = useNavigation();
  const lang = user.language;
  
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState(null); // For filtering by resource type

  // Fetch records from Supabase
  const fetchRecords = async () => {
    setLoading(true);
    
    let query = supabase
      .from('agricultural_records')
      .select('*')
      .order('created_at', { ascending: false });
    
    // Apply filter if one is selected
    if (filter) {
      query = query.eq('resource_type', filter);
    }
    
    const { data, error } = await query;
    
    if (error) {
      console.error('Error fetching records:', error);
    } else {
      setRecords(data || []);
    }
    
    setLoading(false);
    setRefreshing(false);
  };

  // Initial fetch
  useEffect(() => {
    fetchRecords();
  }, [filter]);

  // Pull to refresh
  const onRefresh = () => {
    setRefreshing(true);
    fetchRecords();
  };

  // Format the date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  // Resource type filter buttons
  const FilterButtons = () => (
    <View style={tw`flex-row mb-4 px-2`}>
      <TouchableOpacity
        style={[
          tw`py-2 px-4 rounded-full mr-2`,
          filter === null ? tw`bg-blue-500` : tw`bg-gray-300`
        ]}
        onPress={() => setFilter(null)}>
        <Text style={filter === null ? tw`text-white` : tw`text-black`}>
          {translations.records?.all?.[lang] || 'All'}
        </Text>
      </TouchableOpacity>
      
      {Object.keys(resourceIcons).map((type) => (
        <TouchableOpacity
          key={type}
          style={[
            tw`flex-row items-center py-2 px-4 rounded-full mr-2`,
            filter === type ? tw`bg-blue-500` : tw`bg-gray-300`
          ]}
          onPress={() => setFilter(type)}>
          <MaterialCommunityIcons
            name={resourceIcons[type]}
            size={16}
            color={filter === type ? 'white' : 'black'}
            style={tw`mr-1`}
          />
          <Text style={filter === type ? tw`text-white` : tw`text-black`}>
            {translations.addResource?.resourceTypes?.[type]?.[lang] || type}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  // Render each record item
  const renderItem = ({ item }) => (
    <View style={tw`bg-white rounded-lg shadow-md p-4 mb-4 mx-2`}>
      <View style={tw`flex-row justify-between items-center mb-2`}>
        <View style={tw`flex-row items-center`}>
          <MaterialCommunityIcons
            name={resourceIcons[item.resource_type] || 'help-circle'}
            size={24}
            color="#3b82f6"
            style={tw`mr-2`}
          />
          <Text style={tw`font-bold text-lg`}>{item.resource_name}</Text>
        </View>
        <View style={tw`bg-gray-200 rounded-full px-3 py-1`}>
          <Text style={tw`text-xs`}>
            {translations.addResource?.resourceTypes?.[item.resource_type]?.[lang] || item.resource_type}
          </Text>
        </View>
      </View>
      
      <View style={tw`flex-row justify-between mb-2`}>
        <Text style={tw`text-gray-600`}>
          {translations.records?.size?.[lang] || 'Size'}: {item.resource_size}
        </Text>
        <Text style={tw`text-gray-600`}>
          {translations.records?.startDate?.[lang] || 'Start Date'}: {formatDate(item.start_date)}
        </Text>
      </View>
      
      <Text style={tw`text-gray-800 mb-2`}>{item.resource_description}</Text>
      
      <View style={tw`border-t border-gray-200 pt-2 mt-1 flex-row justify-end`}>
        <TouchableOpacity 
          style={tw`bg-blue-100 rounded-full p-2 mr-2`}
          onPress={() => navigation.navigate('EditRecord', { record: item })}>
          <Ionicons name="pencil" size={16} color="#3b82f6" />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={tw`bg-red-100 rounded-full p-2`}
          onPress={() => deleteRecord(item.id)}>
          <Ionicons name="trash" size={16} color="#ef4444" />
        </TouchableOpacity>
      </View>
    </View>
  );

  // Delete a record
  const deleteRecord = async (id) => {
    // Implement confirmation alert here if desired
    
    const { error } = await supabase
      .from('agricultural_records')
      .delete()
      .eq('id', id);
      
    if (error) {
      console.error('Error deleting record:', error);
    } else {
      // Refresh the list after deletion
      fetchRecords();
    }
  };

  return (
    <View style={tw`flex-1 bg-slate-100 pt-2`}>
      <Text style={tw`text-xl font-bold text-center mb-4`}>
        {translations.records?.title?.[lang] || 'Agricultural Records'}
      </Text>
      
      <FilterButtons />
      
      {loading && !refreshing ? (
        <ActivityIndicator size="large" color="#3b82f6" style={tw`mt-4`} />
      ) : records.length === 0 ? (
        <View style={tw`flex-1 justify-center items-center`}>
          <MaterialCommunityIcons name="clipboard-text-outline" size={50} color="#cbd5e1" />
          <Text style={tw`text-gray-400 mt-2`}>
            {translations.records?.noRecords?.[lang] || 'No records found'}
          </Text>
        </View>
      ) : (
        <FlatList
          data={records}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={tw`pb-20`}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={['#3b82f6']}
            />
          }
        />
      )}
      
      {/* Add new record floating action button */}
      <TouchableOpacity
        onPress={() => navigation.navigate('AddForm')}
        style={tw`bg-blue-500 p-4 rounded-full absolute bottom-5 right-5 items-center justify-center shadow-lg`}>
        <Ionicons name="add" size={24} color="white" />
      </TouchableOpacity>
    </View>
  );
};

export default AgriculturalRecords;