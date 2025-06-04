// import { createClient } from '@supabase/supabase-js';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import 'react-native-url-polyfill/auto';

// // Replace with your Supabase URL and anon key
// const supabaseUrl = 'https://dayycttwivjochnyvkur.supabase.co';
// const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRheXljdHR3aXZqb2Nobnl2a3VyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY3MTY4MzEsImV4cCI6MjA2MjI5MjgzMX0.hFXub7yWX2AFRFQvPxQtDNC-PWD_3vHjvJTWzjQyK9U';

// export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
//   auth: {
//     storage: AsyncStorage,
//     autoRefreshToken: true,
//     persistSession: true,
//     detectSessionInUrl: false,
//   },
// });

import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import 'react-native-url-polyfill/auto';

// Replace with your Supabase URL and anon key
const supabaseUrl = 'https://sewhaclzymyqlaayruug.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNld2hhY2x6eW15cWxhYXlydXVnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ5MDQwODUsImV4cCI6MjA2MDQ4MDA4NX0.q7RY8Pscn20Da9Bar29wTa_0U-UyCg5i2mCQjxBomio';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});


// Custom function to handle farmer login - Fixed implementation
export const loginFarmer = async (mobileNumber, password) => {
  try {
    const { data: rpcData, error: rpcError } = await supabase
      .rpc('login_farmer', {
        p_mobile_number: mobileNumber,
        p_password: password,
      });

    if (rpcError) {
      console.error('RPC error:', rpcError);
      return { success: false, message: 'Login failed. Please try again.' };
    }

    if (!rpcData?.success) {
      return { success: false, message: rpcData?.message || 'Login failed' };
    }

    // Store the farmer data in AsyncStorage
    await AsyncStorage.setItem('farmer', JSON.stringify(rpcData.farmer));

    return {
      success: true,
      message: 'Login successful',
      farmer: rpcData.farmer,
    };
  } catch (error) {
    console.error('Error logging in:', error.message);
    return { success: false, message: 'An error occurred during login' };
  }
};

// Custom function to handle farmer signup - Updated implementation
export const signupFarmer = async (
  name,
  mobileNumber,
  password,
  latitude,
  longitude
) => {
  try {
    const { data: checkResult, error: checkError } = await supabase
      .rpc('check_mobile_exists', { p_mobile_number: mobileNumber });

    if (checkError) {
      console.error('Check mobile error:', checkError);
      return { success: false, message: 'Error checking mobile number' };
    }

    if (checkResult) {
      return { success: false, message: 'Mobile number already registered' };
    }

    const { data, error } = await supabase.rpc('create_farmer', {
      p_name: name,
      p_mobile_number: mobileNumber,
      p_password: password,
      p_latitude: latitude,
      p_longitude: longitude,
    });

    if (error) {
      console.error('Signup error:', error);
      return { success: false, message: 'Failed to create account' };
    }

    return { success: true, message: 'Signup successful' };
  } catch (error) {
    console.error('Error signing up:', error.message);
    return { success: false, message: 'An error occurred during signup' };
  }
};

// Function to check if farmer is logged in
export const getCurrentFarmer = async () => {
  try {
    const farmerString = await AsyncStorage.getItem('farmer');
    if (!farmerString) return null;

    return JSON.parse(farmerString);
  } catch (error) {
    console.error('Error getting current farmer:', error.message);
    return null;
  }
};

// Function to log out farmer
export const logoutFarmer = async () => {
  try {
    await AsyncStorage.removeItem('farmer');
    return { success: true };
  } catch (error) {
    console.error('Error logging out:', error.message);
    return { success: false, message: 'Failed to log out' };
  }
};

// FIXED: Get farmer ID directly from AsyncStorage instead of Supabase Auth
export const getCurrentFarmerId = async () => {
  try {
    const farmer = await getCurrentFarmer();
    if (!farmer) {
      console.log('No farmer found in AsyncStorage');
      return null;
    }
    
    console.log('Successfully retrieved farmer ID from AsyncStorage:', farmer.id);
    return farmer.id;
  } catch (error) {
    console.error('Error getting farmer ID:', error.message);
    return null;
  }
};