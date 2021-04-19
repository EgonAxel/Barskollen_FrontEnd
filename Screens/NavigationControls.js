
import React from 'react';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons'; 
import { Ionicons } from '@expo/vector-icons'; 

import Home from './Home';
import ExploreBeer from './ExploreBeer';
import UserProfile from './UserProfile';
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
            component={UserProfile}
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
              height: 75,
              }}
            }
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

export default NavigationControls