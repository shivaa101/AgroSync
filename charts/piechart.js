import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Dimensions, StyleSheet } from 'react-native';
import { PieChart } from 'react-native-svg-charts';
import { G, Text as SvgText } from 'react-native-svg';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, Easing } from 'react-native-reanimated';
import tw from 'twrnc';

const PieChartComponent = ({ data, title = "Expense Summary" }) => {
  const [selectedSlice, setSelectedSlice] = useState(null);
  const [totalAmount, setTotalAmount] = useState(0);
  const animatedOpacity = useSharedValue(0);

  // Calculate total on data change
  useEffect(() => {
    const newTotal = data.reduce((sum, item) => sum + item.value, 0);
    setTotalAmount(newTotal);
    
    // Animate chart appearance
    animatedOpacity.value = withTiming(1, {
      duration: 800,
      easing: Easing.out(Easing.cubic)
    });
  }, [data]);

  const handleSlicePress = (slice) => {
    setSelectedSlice(selectedSlice?.label === slice.label ? null : slice);
  };

  // Format currency to Indian Rupees
  const formatCurrency = (amount) => {
    return '₹' + amount.toLocaleString('en-IN');
  };

  // Calculate percentage for display
  const calculatePercentage = (value) => {
    return totalAmount > 0 ? Math.round((value / totalAmount) * 100) : 0;
  };

  // Transform data for pie chart with enhanced styling
  const pieData = data.map((item) => ({
    value: item.value,
    svg: {
      fill: item.color,
      onPress: () => handleSlicePress(item),
      // Make selected slice stand out
      fillOpacity: selectedSlice?.label === item.label ? 1 : 0.85,
      // Slight push effect for selected slice
      scale: selectedSlice?.label === item.label ? 1.05 : 1,
      stroke: selectedSlice?.label === item.label ? '#ffffff' : 'none',
      strokeWidth: 2,
    },
    key: item.label,
    arc: { 
      padAngle: 0.02,
      cornerRadius: 5
    }
  }));

  // Dimensions for responsiveness
  const { width } = Dimensions.get('window');
  const chartSize = width * 0.7; // 70% of screen width

  // Center label component
  const Labels = ({ slices }) => {
    if (!slices.length) return null;
    
    // Show selected slice info or total
    const centerText = selectedSlice 
      ? `${calculatePercentage(selectedSlice.value)}%`
      : 'Total';
      
    const centerValue = selectedSlice 
      ? formatCurrency(selectedSlice.value)
      : formatCurrency(totalAmount);
      
    return (
      <G>
        <SvgText
          fill={selectedSlice?.color || "#333"}
          textAnchor="middle"
          alignmentBaseline="middle"
          fontSize="16"
          fontWeight="bold"
          x="50%"
          y="46%"
        >
          {centerText}
        </SvgText>
        <SvgText
          fill="#333"
          textAnchor="middle"
          alignmentBaseline="middle"
          fontSize="14"
          x="50%"
          y="54%"
        >
          {centerValue}
        </SvgText>
      </G>
    );
  };

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: animatedOpacity.value,
      transform: [{ scale: animatedOpacity.value }]
    };
  });

  // No data display
  if (!data.length) {
    return (
      <View style={tw`p-6 bg-white rounded-lg shadow-md items-center justify-center`}>
        <MaterialCommunityIcons name="chart-pie" size={48} color="#d1d5db" />
        <Text style={tw`text-lg text-gray-400 mt-2`}>No data available</Text>
      </View>
    );
  }

  return (
    <View style={tw`bg-white rounded-xl shadow-lg p-4 mb-4`}>
      <Text style={tw`text-xl font-bold text-center mb-4 text-gray-800`}>{title}</Text>
      
      <Animated.View style={[{ width: chartSize, height: chartSize, alignSelf: 'center' }, animatedStyle]}>
        <PieChart
          style={{ height: '100%' }}
          data={pieData}
          innerRadius="40%"
          outerRadius="95%"
          padAngle={0.02}
          animate={true}
          animationDuration={500}
        >
          <Labels />
        </PieChart>
      </Animated.View>

      {/* Legend */}
      <View style={tw`mt-6 flex-row flex-wrap justify-center`}>
        {data.map((item, index) => (
          <TouchableOpacity 
            key={index} 
            onPress={() => handleSlicePress(item)}
            style={tw`flex-row items-center px-2 py-1 m-1 rounded-full ${selectedSlice?.label === item.label ? 'bg-gray-100' : ''}`}
          >
            <View 
              style={[
                tw`w-4 h-4 mr-2 rounded-full`,
                { backgroundColor: item.color },
                selectedSlice?.label === item.label ? styles.selectedIndicator : {}
              ]} 
            />
            <Text style={[
              tw`${selectedSlice?.label === item.label ? 'font-bold' : ''} text-gray-800`,
            ]}>
              {item.label}
              <Text style={tw`text-gray-500 text-xs ml-1`}> ({calculatePercentage(item.value)}%)</Text>
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  selectedIndicator: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 3,
  }
});

export default PieChartComponent;