
import React from 'react';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Home from './Home';
import Beers from './HomeInfinityScroll';
import UserProfile from './UserProfile';


const Tab = createMaterialBottomTabNavigator();

function NavigationControls() {
  return (

    <Tab.Navigator
     initialRouteName="Home"
      activeColor="#e91e63"
      labelStyle={{ fontSize: 12 }}
      style={{ backgroundColor: 'tomato' }}
    >

    <Tab.Screen
        name="Mitt konto"
        component={UserProfile}
        options={{
          tabBarLabel: 'Mitt konto',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="face-profile" color={color} size={26} />
          ),
        }}
      /> 
    <Tab.Screen
        name="Home"
        component={Home}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="home" color={color} size={26} />
          ),
        }}
    />
    <Tab.Screen
        name="Utforska"
        component={Beers}
        options={{
          tabBarLabel: 'Utforska',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="bottle-soda" color={color} size={26} />
          ),
        }}
      />
    </Tab.Navigator>
);
}
export default NavigationControls