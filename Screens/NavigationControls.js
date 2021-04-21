
import React from 'react';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { createStackNavigator, } from '@react-navigation/stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons'; 
import { Ionicons } from '@expo/vector-icons'; 
import { RectButton, BorderlessButton } from "react-native-gesture-handler";

import Home from './Home';
import ExploreBeer from './ExploreBeer';
import UserProfile from './UserProfile';
import IndividualBeerFromProfile from './IndividualBeerFromProfile';
import IndividualBeer from './IndividualBeer';
import commentLayout from './commentLayout';

const Tab = createMaterialBottomTabNavigator();


function NavigationControls() {
  return (
    <SafeAreaProvider>            
      <Tab.Navigator
        initialRouteName="Home"
        activeColor="#fff"
        labelStyle={{ fontSize: 12 }}
        barStyle={{ backgroundColor: '#009688' } }
      >
        <Tab.Screen
            name="Mitt konto"
            component={UserProfileStackScreen}
            options={{
              tabBarLabel: 'Mitt konto',
              tabBarIcon: ({ color }) => (
                <MaterialIcons name="person-outline" size={25} color={color} />
              ),
            }}
          /> 
        <Tab.Screen
            name="Home"
            component={Home}
            options={{
              tabBarLabel: 'Startsida',
              tabBarIcon: ({ color }) => (
                <MaterialCommunityIcons name="home" color={color} size={25}
                />
              ),
            }}
        />
        <Tab.Screen
            name="Utforska"
            component={ExploreBeerStackScreen}
            options={{
              tabBarLabel: 'Utforska',
              tabBarIcon: ({ color }) => (
                <Ionicons name="beer-outline" size={25} color={color} />
              ),
            }}
          />
      </Tab.Navigator>
  </SafeAreaProvider>
);
}

const ExploreBeerStack = createStackNavigator();

function ExploreBeerStackScreen() {
  return (
    <ExploreBeerStack.Navigator>  
        <ExploreBeerStack.Screen
          name="Utforska" 
          component={ExploreBeer} 
          options={{ 
            title: 'Utforska',
            headerTitleStyle: { alignSelf: 'center' },
            headerStyle: {
              backgroundColor: '#fff',
              }
            }}
        />
        <ExploreBeerStack.Screen 
          name="IndividualBeer" 
          component={IndividualBeer}
          options={{ 
            title: 'Info' ,
            headerTitleStyle: { alignSelf: 'flex-start' },
            headerStyle: {
              backgroundColor: '#fff',
              }}
            } 
         />
        <ExploreBeerStack.Screen 
          name="commentLayout" 
          component={commentLayout}
          options={{ 
            title: 'Ge betyg' ,
            headerTitleStyle: { alignSelf: 'flex-start' },
            headerStyle: {
              backgroundColor: '#fff', 
              }}
            } 
         />
    </ExploreBeerStack.Navigator>
  );
}

const UserProfileStack = createStackNavigator();

function UserProfileStackScreen() {
  return (
    <UserProfileStack.Navigator>  
      <UserProfileStack.Screen
        name="UserProfile" 
        component={UserProfile}
        options={{ 
          title: 'Min profil' ,
          headerTitleStyle: { alignSelf: 'flex-start' },
          headerStyle: {
            backgroundColor: '#fff',
            }}
          } 
        />
        <UserProfileStack.Screen 
          name="IndividualBeerFromProfile" 
          component={IndividualBeerFromProfile}
          options={{ 
            title: 'Info' ,
            headerTitleStyle: { alignSelf: 'flex-start' },
            headerStyle: {
              backgroundColor: '#fff',
              }}
            } 
         />
    </UserProfileStack.Navigator>
  );
}

export default NavigationControls