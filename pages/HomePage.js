import React, { useState } from 'react';
import { View, StatusBar } from 'react-native';
import { Appbar, BottomNavigation } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import Home from '../components/Home';
import Book from '../components/Records';
import Add from '../components/Create';
import Profile from '../components/Profile';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import tw from 'twrnc';
import translations from '../assets/translation.json';
import { user } from '../data/userData';

const HomeScreen = () => {
  const [index, setIndex] = useState(0);
  const navigation = useNavigation();
  const lang = user.language;

  const handleLogout = () => {
    navigation.navigate('Login');
  };

  const routes = [
    { 
      key: 'home', 
      title: translations.navigation.home[lang], 
      icon: 'home' 
    },
    { 
      key: 'book', 
      title: translations.navigation.book[lang], 
      icon: 'book' 
    },
    { 
      key: 'add', 
      title: translations.navigation.add[lang], 
      icon: 'plus' 
    },
    { 
      key: 'profile', 
      title: translations.navigation.profile[lang], 
      icon: 'account' 
    },
  ];

  const renderScene = BottomNavigation.SceneMap({
    home: Home,
    book: Book,
    add: Add,
    profile: Profile,
  });

  const renderIcon = ({ route }) => (
    <MaterialCommunityIcons name={route.icon} size={24} color="black" />
  );

  return (
    <View style={tw`flex-1 bg-slate-100`}>
      <StatusBar barStyle="dark-content" />
      <Appbar.Header style={tw`bg-slate-100`}>
        <Appbar.Content style={tw`font-weight-bold`} title="MyApp"/>
        <Appbar.Action 
          icon="logout" 
          onPress={handleLogout} 
          tooltip={translations.navigation.logout[lang]}
        />
      </Appbar.Header>

      <BottomNavigation
        navigationState={{ index, routes }}
        onIndexChange={setIndex}
        renderScene={renderScene}
        barStyle={tw`bg-white`}
        labeled={true}
        renderIcon={renderIcon}
      />
    </View>
  );
};

export default HomeScreen;