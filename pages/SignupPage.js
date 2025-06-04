import React, { useState } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  ActivityIndicator,
} from 'react-native';
import tw from 'twrnc';
import { signupFarmer } from '../supabaseClient'; // Import the custom signup function
import * as Location from 'expo-location';
import PopUpComponent from '../charts/PopUp';

const SignupPage = ({ navigation }) => {
  const [name, setName] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [confirmMobileNumber, setConfirmMobileNumber] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [popupVisible, setPopupVisible] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');

  const handleSignup = async () => {
    // Validate fields
    if (!name.trim()) {
      setPopupMessage('Please enter your name');
      setPopupVisible(true);
      return;
    }
    
    if (!/^[6-9]\d{9}$/.test(mobileNumber)) {
      setPopupMessage('Please enter a valid 10-digit Indian mobile number');
      setPopupVisible(true);
      return;
    }
    
    if (mobileNumber !== confirmMobileNumber) {
      setPopupMessage("Mobile numbers don't match!");
      setPopupVisible(true);
      return;
    }
    
    if (password.length < 4) {
      setPopupMessage("Password must be at least 4 characters");
      setPopupVisible(true);
      return;
    }
    
    if (password !== confirmPassword) {
      setPopupMessage("Passwords don't match!");
      setPopupVisible(true);
      return;
    }

    setLoading(true);

    try {
      // Request location permission
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setPopupMessage('Permission to access location was denied');
        setPopupVisible(true);
        setLoading(false);
        return;
      }

      // Get current location
      let location = await Location.getCurrentPositionAsync({});
      
      // Use the custom signup function
      const result = await signupFarmer(
        name,
        mobileNumber,
        password,
        location.coords.latitude,
        location.coords.longitude
      );

      if (result.success) {
        setPopupMessage('Signup successful!');
        setPopupVisible(true);
        
        // Clear form fields
        setName('');
        setMobileNumber('');
        setConfirmMobileNumber('');
        setPassword('');
        setConfirmPassword('');
        
        // Navigate to Login after a short delay
        setTimeout(() => {
          navigation.navigate('Login');
        }, 1500);
      } else {
        setPopupMessage(result.message || 'Signup failed. Please try again.');
        setPopupVisible(true);
      }
    } catch (error) {
      console.error('Signup error:', error);
      setPopupMessage('An error occurred. Please try again.');
      setPopupVisible(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={tw`flex-1 justify-center px-6 bg-slate-100`}>
      {/* Title */}
      <Text style={tw`text-3xl font-bold text-center text-black mb-8`}>
        Signup
      </Text>

      {/* Name Input */}
      <TextInput
        style={tw`border border-gray-400 rounded-lg py-4 px-6 mb-4 text-lg`}
        placeholder="Name"
        value={name}
        onChangeText={setName}
      />

      {/* Mobile Number Input */}
      <TextInput
        style={tw`border border-gray-400 rounded-lg py-4 px-6 mb-4 text-lg`}
        placeholder="Mobile Number"
        value={mobileNumber}
        onChangeText={setMobileNumber}
        keyboardType="phone-pad"
        maxLength={10}
      />

      {/* Confirm Mobile Number Input */}
      <TextInput
        style={tw`border border-gray-400 rounded-lg py-4 px-6 mb-4 text-lg`}
        placeholder="Confirm Mobile Number"
        value={confirmMobileNumber}
        onChangeText={setConfirmMobileNumber}
        keyboardType="phone-pad"
        maxLength={10}
      />

      {/* Password Input */}
      <TextInput
        style={tw`border border-gray-400 rounded-lg py-4 px-6 mb-4 text-lg`}
        placeholder="Password (4-digit PIN)"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        keyboardType="numeric"
        maxLength={4}
      />

      {/* Confirm Password Input */}
      <TextInput
        style={tw`border border-gray-400 rounded-lg py-4 px-6 mb-4 text-lg`}
        placeholder="Confirm Password"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
        keyboardType="numeric"
        maxLength={4}
      />

      {/* Signup Button */}
      <TouchableOpacity
        onPress={handleSignup}
        style={tw`bg-blue-500 py-4 rounded-xl mb-6 mx-10`}
        disabled={loading}>
        {loading ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <Text style={tw`text-white text-center text-lg`}>Signup</Text>
        )}
      </TouchableOpacity>

      {/* Back to Login Button */}
      <View style={tw`flex-row justify-center mt-4`}>
        <Text style={tw`text-gray-600`}>Are you existing user? </Text>
        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={tw`text-blue-500 font-semibold`}>Go to Login</Text>
        </TouchableOpacity>
      </View>

      {/* Popup Component */}
      <PopUpComponent
        message={popupMessage}
        visible={popupVisible}
        onClose={() => setPopupVisible(false)}
      />
    </View>
  );
};

export default SignupPage;