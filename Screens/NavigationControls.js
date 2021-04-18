
import React from 'react';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons'; 
import { Ionicons } from '@expo/vector-icons'; 
import { Header } from 'react-native-elements';

import Home from './Home';
import ExploreBeer from './ExploreBeer';
import UserProfile from './UserProfile';
import IndividualBeer from './IndividualBeer';
import commentLayout from './commentLayout';

const Tab = createMaterialBottomTabNavigator();


function NavigationControls() {
  return (


    <SafeAreaProvider>            
      <Header                                   // --- För att ha en header behövs en safearea runt appen 
        placement="left"
        statusBarProps={{ barStyle: 'light-content' }}
        barStyle="light-content" // or directly
        leftComponent={{text: 'Bärskollen', style: { color: 'black' , fontSize: 25}}}
        containerStyle={{
          backgroundColor: '#fff',
          justifyContent: 'space-around',
          //height: 100,
        }}
        rightComponent={<Ionicons name="beer-outline" size={30}  /> }
      />
  
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
            <MaterialIcons name="face" size={30} color={color} />
          ),
        }}
      /> 
    <Tab.Screen
        name="Home"
        component={Home}
        options={{
          tabBarLabel: 'Startsida',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="home" color={color} size={30}
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
            <Ionicons name="beer-outline" size={30} color={color} />
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
          title: 'Individual beer' ,
          headerTitleStyle: { alignSelf: 'center' },
          headerStyle: {
            backgroundColor: '#fff', 
            height: 75,
            }}
          } 
         />
          <ExploreBeerStack.Screen 
        name="commentLayout" 
        component={commentLayout}
        options={{ 
          title: 'commentLayout' ,
          headerTitleStyle: { alignSelf: 'center' },
          headerStyle: {
            backgroundColor: '#fff', 
            height: 75,
            }}
          } 
         />
    </ExploreBeerStack.Navigator>
  );
}

export default NavigationControls