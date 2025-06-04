import React, { useState, useRef } from 'react';
import { View, TextInput, TouchableOpacity, Text, ActivityIndicator } from 'react-native';
import { loginFarmer } from '../supabaseClient'; // Import the custom login function
import tw from 'twrnc';
import { useNavigation } from '@react-navigation/native';
import { FontAwesome } from '@expo/vector-icons';

const LoginScreen = () => {
  const navigation = useNavigation();
  const [mobileNumber, setMobileNumber] = useState('');
  const [pin, setPin] = useState(['', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  // Create refs for each PIN input
  const pinRefs = useRef(pin.map(() => React.createRef()));

  // Function to validate mobile number and PIN, and log in the user
  const handleLogin = async () => {
    const pinString = pin.join('');

    // Validate 10-digit mobile number and 4-digit PIN
    if (!/^[6-9]\d{9}$/.test(mobileNumber)) {
      setNotification('Please enter a valid 10-digit Indian mobile number.');
      return;
    }
    if (!/^\d{4}$/.test(pinString)) {
      setNotification('Please enter a valid 4-digit PIN.');
      return;
    }

    setLoading(true);

    try {
      // Use the custom login function from supabaseClient
      const result = await loginFarmer(mobileNumber, pinString);
      
      if (result.success) {
        setNotification('Login successful!');
        setMobileNumber('');
        setPin(['', '', '', '']);
        navigation.navigate('Home');
      } else {
        setNotification(result.message || 'Login failed. Please try again.');
      }
    } catch (error) {
      console.error('Login error:', error);
      setNotification('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handlePinChange = (text, index) => {
    const newPin = [...pin];

    // Handle backspace
    if (text === '') {
      if (index === 0) {
        newPin[index] = ''; // Clear the first box
        setPin(newPin);
      } else {
        newPin[index] = ''; // Clear the current box
        setPin(newPin);
        // Move focus to the previous input box
        pinRefs.current[index - 1].current.focus();
      }
    } else {
      newPin[index] = text.replace(/[^0-9]/g, '');
      setPin(newPin);

      // Move to the next input field if current field is filled
      if (text && index < 3) {
        pinRefs.current[index + 1].current.focus();
      }
    }
  };

  const toggleShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <View style={tw`flex-1 justify-center px-6 bg-slate-100`}>
      {/* Header */}
      <Text style={tw`text-2xl font-bold text-center mb-6`}>Login</Text>

      {notification ? (
        <Text style={tw`text-red-500 text-center mb-4`}>{notification}</Text>
      ) : null}

      <TextInput
        style={tw`border border-gray-400 rounded-lg py-4 px-6 mb-6 text-lg`}
        placeholder="Enter your mobile number"
        value={mobileNumber}
        onChangeText={setMobileNumber}
        keyboardType="phone-pad"
        autoCapitalize="none"
        maxLength={10}
      />

      <View style={tw`flex-row items-center justify-between mb-6`}>
        {pin.map((digit, index) => (
          <TextInput
            key={index}
            ref={pinRefs.current[index]} // Set the ref for each input
            style={tw`border border-gray-400 rounded-lg py-2 text-lg text-center flex-1 mx-1 w-10`} // Smaller width
            placeholder="" // Make placeholder empty when there is nothing
            value={digit}
            onChangeText={(text) => handlePinChange(text, index)}
            keyboardType="numeric"
            secureTextEntry={!showPassword}
            maxLength={1}
          />
        ))}
        {/* Show Password Button next to PIN inputs */}
        <TouchableOpacity onPress={toggleShowPassword} style={tw`ml-2`}>
          <FontAwesome name={showPassword ? "eye" : "eye-slash"} size={24} color="black" />
        </TouchableOpacity>
      </View>

      <TouchableOpacity 
        onPress={handleLogin} 
        disabled={loading}
        style={tw`bg-blue-500 py-4 rounded-lg`}>
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={tw`text-white text-center text-lg`}>Login</Text>}
      </TouchableOpacity>

      {/* Sign Up Prompt */}
      <View style={tw`flex-row justify-center mt-4`}>
        <Text style={tw`text-gray-600`}>Are you new? </Text>
        <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
          <Text style={tw`text-blue-500 font-semibold`}>Go to Sign Up</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default LoginScreen;