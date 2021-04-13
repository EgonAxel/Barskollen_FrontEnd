
import React from 'react';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Home from './Home';
import ExploreBeer from './ExploreBeer';
import UserProfile from './UserProfile';
import IndividualBeer from './IndividualBeer';


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
        component={ExploreBeerStackScreen}
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

const ExploreBeerStack = createStackNavigator();

function ExploreBeerStackScreen() {
  return (
    <ExploreBeerStack.Navigator>
      <ExploreBeerStack.Screen name="Utforska" component={ExploreBeer} />
      <ExploreBeerStack.Screen name="IndividualBeer" component={IndividualBeer} />
    </ExploreBeerStack.Navigator>
  );
}

export default NavigationControls