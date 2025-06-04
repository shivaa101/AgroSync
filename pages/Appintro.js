// import React, { useEffect, useState } from 'react';
// import {
//   View,
//   Text,
//   Animated,
//   TouchableOpacity,
//   Dimensions,
//   Easing,
// } from 'react-native';
// import tw from 'twrnc';
// import { MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';

// // Import translations from JSON file
// import translations from '../assets/translation.json'; 
// import { user, updateUserLanguage } from '../data/userData';

// const icons = [
//   { name: 'tractor', component: MaterialCommunityIcons },
//   { name: 'cow', component: MaterialCommunityIcons },
//   { name: 'corn', component: MaterialCommunityIcons },
//   { name: 'apple-alt', component: FontAwesome5 },
//   { name: 'carrot', component: FontAwesome5 },
//   { name: 'water', component: MaterialCommunityIcons },
//   { name: 'fish', component: MaterialCommunityIcons },
//   { name: 'pig', component: MaterialCommunityIcons },
//   { name: 'herb', component: MaterialCommunityIcons },
//   { name: 'flower', component: MaterialCommunityIcons },
//   { name: 'sunflower', component: MaterialCommunityIcons },
//   { name: 'garden', component: MaterialCommunityIcons },
//   { name: 'sheep', component: MaterialCommunityIcons },
//   { name: 'grapes', component: FontAwesome5 },
//   { name: 'pumpkin', component: FontAwesome5 },
//   { name: 'lemon', component: FontAwesome5 },
//   { name: 'pineapple', component: FontAwesome5 },
//   { name: 'melon', component: FontAwesome5 },
//   { name: 'lettuce', component: MaterialCommunityIcons },
//   { name: 'tomato', component: MaterialCommunityIcons },
//   { name: 'peas', component: MaterialCommunityIcons },
//   { name: 'mushroom', component: MaterialCommunityIcons },
//   { name: 'berry', component: MaterialCommunityIcons },
//   { name: 'apple', component: FontAwesome5 },
//   { name: 'orange', component: FontAwesome5 },
//   { name: 'strawberry', component: FontAwesome5 },
// ];

// // Get screen dimensions
// const { width, height } = Dimensions.get('window');

// // Define different animation types
// const animationTypes = ['vertical', 'horizontal', 'zigzag'];

// // Function to generate random animation type
// const getRandomAnimation = () => {
//   return animationTypes[Math.floor(Math.random() * animationTypes.length)];
// };

// const AppIntroScreen = ({ navigation }) => {
//   const [iconAnimations] = useState(
//     Array.from({ length: 50 }, (_, index) => {
//       const cols = 5; // 5 icons per row
//       const rows = 8; // 10 rows total
//       const colWidth = width / cols;
//       const rowHeight = height / rows;

//       // Add margins for icons
//       const marginLeft = Math.random() * 10 + 5; // Random left margin
//       const marginRight = Math.random() * 10 + 5; // Random right margin

//       const positionX = (index % cols) * colWidth + marginLeft;
//       const positionY = Math.floor(index / cols) * rowHeight + 20; // Top margin

//       return {
//         translateX: new Animated.Value(0),
//         translateY: new Animated.Value(0),
//         rotate: new Animated.Value(0),
//         scale: new Animated.Value(1),
//         position: {
//           x: positionX,
//           y: positionY,
//         },
//         animationType: getRandomAnimation(),
//       };
//     })
//   );

//   const [selectedLanguage, setSelectedLanguage] = useState(user.language);


//   useEffect(() => {
//     const startAnimation = (animation) => {
//       const animations = [];

//       if (animation.animationType === 'vertical') {
//         animations.push(
//           Animated.timing(animation.translateY, {
//             toValue: Math.random() * 200 - 100,
//             duration: 7000,
//             useNativeDriver: true,
//             easing: Easing.linear,
//           }),
//           Animated.timing(animation.translateY, {
//             toValue: 0,
//             duration: 7000,
//             useNativeDriver: true,
//             easing: Easing.linear,
//           })
//         );
//       } else if (animation.animationType === 'horizontal') {
//         animations.push(
//           Animated.timing(animation.translateX, {
//             toValue: Math.random() * 200 - 100,
//             duration: 7000,
//             useNativeDriver: true,
//             easing: Easing.linear,
//           }),
//           Animated.timing(animation.translateX, {
//             toValue: 0,
//             duration: 7000,
//             useNativeDriver: true,
//             easing: Easing.linear,
//           })
//         );
//       } else if (animation.animationType === 'zigzag') {
//         animations.push(
//           Animated.timing(animation.translateY, {
//             toValue: Math.random() * 120 - 50,
//             duration: 7000,
//             useNativeDriver: true,
//             easing: Easing.linear,
//           }),
//           Animated.timing(animation.translateY, {
//             toValue: 0,
//             duration: 7000,
//             useNativeDriver: true,
//             easing: Easing.linear,
//           })
//         );
//       }

//       // Start animation sequence
//       Animated.sequence(animations).start(() => {
//         // Change animation type after each iteration
//         animation.animationType = getRandomAnimation();
//         startAnimation(animation); // Restart animation with new type
//       });
//     };

//     iconAnimations.forEach(animation => {
//       startAnimation(animation);
//     });
//   }, [iconAnimations]);

//   const handleLanguageChange = (language) => {
//     setSelectedLanguage(language);
//     updateUserLanguage(language); // Update the language in user data
//   };

//   return (
//     <View style={tw`flex-1 bg-green-200`}>
//       {/* Animated Icons */}
//       <View style={tw`absolute inset-0 z-0 m-2`}>
//         {iconAnimations.map((animation, index) => {
//           const IconComponent = icons[index % icons.length].component;

//           return (
//             <Animated.View
//               key={index}
//               style={{
//                 position: 'absolute',
//                 left: animation.position.x,
//                 top: animation.position.y,
//                 transform: [
//                   { translateX: animation.translateX },
//                   { translateY: animation.translateY },
//                   {
//                     rotate: animation.rotate.interpolate({
//                       inputRange: [0, 360],
//                       outputRange: ['0deg', '360deg'],
//                     }),
//                   },
//                   { scale: animation.scale },
//                 ],
//               }}>
//               <IconComponent
//                 name={icons[index % icons.length].name}
//                 size={40}
//                 color={'green'} // Use the dynamic color here
//               />
//             </Animated.View>
//           );
//         })}
//       </View>

//       {/* Welcome Text and Button */}
//       <View style={tw`z-10 items-center justify-center h-full`}>
//         <Text style={tw`text-4xl font-bold text-center text-black mb-6`}>
//           {translations.welcome[selectedLanguage]} {/* Use dynamic text */}
//         </Text>

//         {/* Select Language Text */}
//         <Text style={tw`text-2xl text-center text-black mb-4`}>
//           {translations.selectLanguage[selectedLanguage]} {/* Use dynamic text */}
//         </Text>

//         {/* Language Buttons */}
//         <View style={tw`flex-row justify-around mb-6 w-full px-10`}>
//           <TouchableOpacity
//             style={[tw`py-3 px-8 rounded-full`, selectedLanguage === 'English' ? tw`bg-blue-500` : tw`bg-white`]}
//             onPress={() => handleLanguageChange('English')}>
//             <Text style={tw`text-black text-lg font-bold`}>
//               {translations.language[selectedLanguage].english} {/* Use dynamic text */}
//             </Text>
//           </TouchableOpacity>

//           <TouchableOpacity
//             style={[tw`py-3 px-8 rounded-full`, selectedLanguage === 'Marathi' ? tw`bg-blue-500` : tw`bg-white`]}
//             onPress={() => handleLanguageChange('Marathi')}>
//             <Text style={tw`text-black text-lg font-bold`}>
//               {translations.language[selectedLanguage].marathi} {/* Use dynamic text */}
//             </Text>
//           </TouchableOpacity>
//         </View>

//         {/* Continue Button */}
//         <TouchableOpacity
//           style={tw`py-3 px-8 rounded-full bg-blue-500`}
//           onPress={() => navigation.navigate('Login')}>
//           <Text style={tw`text-white text-lg font-bold`}>
//             {translations.continue[selectedLanguage]} {/* Use dynamic text */}
//           </Text>
//         </TouchableOpacity>
//       </View>
//     </View>
//   );
// };

// export default AppIntroScreen;

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Animated,
  TouchableOpacity,
  Dimensions,
  Easing,
} from 'react-native';
import tw from 'twrnc';
import { MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';

// Import translations from JSON file
import translations from '../assets/translation.json'; 
import { user, updateUserLanguage } from '../data/userData';

const icons = [
  { name: 'tractor', component: MaterialCommunityIcons },
  { name: 'cow', component: MaterialCommunityIcons },
  { name: 'corn', component: MaterialCommunityIcons },
  { name: 'apple-alt', component: FontAwesome5 },
  { name: 'carrot', component: FontAwesome5 },
  { name: 'water', component: MaterialCommunityIcons },
  { name: 'fish', component: MaterialCommunityIcons },
  { name: 'pig', component: MaterialCommunityIcons },
  { name: 'herb', component: MaterialCommunityIcons },
  { name: 'flower', component: MaterialCommunityIcons },
  { name: 'sunflower', component: MaterialCommunityIcons },
  { name: 'garden', component: MaterialCommunityIcons },
  { name: 'sheep', component: MaterialCommunityIcons },
  { name: 'grapes', component: FontAwesome5 },
  { name: 'pumpkin', component: FontAwesome5 },
  { name: 'lemon', component: FontAwesome5 },
  { name: 'pineapple', component: FontAwesome5 },
  { name: 'melon', component: FontAwesome5 },
  { name: 'lettuce', component: MaterialCommunityIcons },
  { name: 'tomato', component: MaterialCommunityIcons },
  { name: 'peas', component: MaterialCommunityIcons },
  { name: 'mushroom', component: MaterialCommunityIcons },
  { name: 'berry', component: MaterialCommunityIcons },
  { name: 'apple', component: FontAwesome5 },
  { name: 'orange', component: FontAwesome5 },
  { name: 'strawberry', component: FontAwesome5 },
];

// Get screen dimensions
const { width, height } = Dimensions.get('window');

// Define different animation types
const animationTypes = ['vertical', 'horizontal', 'zigzag'];

// Function to generate random animation type
const getRandomAnimation = () => {
  return animationTypes[Math.floor(Math.random() * animationTypes.length)];
};

const AppIntroScreen = ({ navigation }) => {
  const [iconAnimations] = useState(
    Array.from({ length: 50 }, (_, index) => {
      const cols = 5; // 5 icons per row
      const rows = 8; // 10 rows total
      const colWidth = width / cols;
      const rowHeight = height / rows;

      // Add margins for icons
      const marginLeft = Math.random() * 10 + 5; // Random left margin
      const marginRight = Math.random() * 10 + 5; // Random right margin

      const positionX = (index % cols) * colWidth + marginLeft;
      const positionY = Math.floor(index / cols) * rowHeight + 20; // Top margin

      return {
        translateX: new Animated.Value(0),
        translateY: new Animated.Value(0),
        rotate: new Animated.Value(0),
        scale: new Animated.Value(1),
        position: {
          x: positionX,
          y: positionY,
        },
        animationType: getRandomAnimation(),
      };
    })
  );

  const [selectedLanguage, setSelectedLanguage] = useState(user.language);


  useEffect(() => {
    const startAnimation = (animation) => {
      const animations = [];

      if (animation.animationType === 'vertical') {
        animations.push(
          Animated.timing(animation.translateY, {
            toValue: Math.random() * 200 - 100,
            duration: 7000,
            useNativeDriver: true,
            easing: Easing.linear,
          }),
          Animated.timing(animation.translateY, {
            toValue: 0,
            duration: 7000,
            useNativeDriver: true,
            easing: Easing.linear,
          })
        );
      } else if (animation.animationType === 'horizontal') {
        animations.push(
          Animated.timing(animation.translateX, {
            toValue: Math.random() * 200 - 100,
            duration: 7000,
            useNativeDriver: true,
            easing: Easing.linear,
          }),
          Animated.timing(animation.translateX, {
            toValue: 0,
            duration: 7000,
            useNativeDriver: true,
            easing: Easing.linear,
          })
        );
      } else if (animation.animationType === 'zigzag') {
        animations.push(
          Animated.timing(animation.translateY, {
            toValue: Math.random() * 120 - 50,
            duration: 7000,
            useNativeDriver: true,
            easing: Easing.linear,
          }),
          Animated.timing(animation.translateY, {
            toValue: 0,
            duration: 7000,
            useNativeDriver: true,
            easing: Easing.linear,
          })
        );
      }

      // Start animation sequence
      Animated.sequence(animations).start(() => {
        // Change animation type after each iteration
        animation.animationType = getRandomAnimation();
        startAnimation(animation); // Restart animation with new type
      });
    };

    iconAnimations.forEach(animation => {
      startAnimation(animation);
    });
  }, [iconAnimations]);

  const handleLanguageChange = (language) => {
    setSelectedLanguage(language);
    updateUserLanguage(language); // Update the language in user data
  };

  return (
    <View style={tw`flex-1 bg-green-200`}>
      {/* Animated Icons */}
      <View style={tw`absolute inset-0 z-0 m-2`}>
        {iconAnimations.map((animation, index) => {
          const IconComponent = icons[index % icons.length].component;

          return (
            <Animated.View
              key={index}
              style={{
                position: 'absolute',
                left: animation.position.x,
                top: animation.position.y,
                transform: [
                  { translateX: animation.translateX },
                  { translateY: animation.translateY },
                  {
                    rotate: animation.rotate.interpolate({
                      inputRange: [0, 360],
                      outputRange: ['0deg', '360deg'],
                    }),
                  },
                  { scale: animation.scale },
                ],
              }}>
              <IconComponent
                name={icons[index % icons.length].name}
                size={40}
                color={'green'} // Use the dynamic color here
              />
            </Animated.View>
          );
        })}
      </View>

      {/* Welcome Text and Button */}
      <View style={tw`z-10 items-center justify-center h-full`}>
        <Text style={tw`text-4xl font-bold text-center text-black mb-6`}>
          {translations.welcome[selectedLanguage]} {/* Use dynamic text */}
        </Text>

        {/* Select Language Text */}
        <Text style={tw`text-2xl text-center text-black mb-4`}>
          {translations.selectLanguage[selectedLanguage]} {/* Use dynamic text */}
        </Text>

        {/* Language Buttons */}
        <View style={tw`flex-row justify-around mb-6 w-full px-10`}>
          <TouchableOpacity
            style={[tw`py-3 px-8 rounded-full`, selectedLanguage === 'English' ? tw`bg-blue-500` : tw`bg-white`]}
            onPress={() => handleLanguageChange('English')}>
            <Text style={tw`text-black text-lg font-bold`}>
              {translations.language[selectedLanguage].english} {/* Use dynamic text */}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[tw`py-3 px-8 rounded-full`, selectedLanguage === 'Marathi' ? tw`bg-blue-500` : tw`bg-white`]}
            onPress={() => handleLanguageChange('Marathi')}>
            <Text style={tw`text-black text-lg font-bold`}>
              {translations.language[selectedLanguage].marathi} {/* Use dynamic text */}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Continue Button - Changed navigation from 'Login' to 'Home' */}
        <TouchableOpacity
          style={tw`py-3 px-8 rounded-full bg-blue-500`}
          onPress={() => navigation.navigate('Home')}>
          <Text style={tw`text-white text-lg font-bold`}>
            {translations.continue[selectedLanguage]} {/* Use dynamic text */}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default AppIntroScreen;
