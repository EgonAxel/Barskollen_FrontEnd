
import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import NavigationControls from './Screens/NavigationControls';
import React from 'react';

import LogIn from './Screens/LogIn'
import RegisterScreen from './Screens/RegisterScreen'


//npm install @react-navigation/native @react-navigation/stack
//expo install react-native-reanimated react-native-gesture-handler react-native-screens react-native-safe-area-context @react-native-community/masked-view
//npm install @react-navigation/material-bottom-tabs react-native-paper

//npm i react-native-elements --save       ---  För header och element från react native element
//npm i --save react-native-vector-icons
//npm i --save react-native-safe-area-context      


const Stack = createStackNavigator();

const Auth = () => {
  // Stack Navigator for Login and Sign up Screen
  return (
    <Stack.Navigator initialRouteName="LoginScreen">
      <Stack.Screen
        name="LoginScreen"
        component={LogIn}
        options={{headerShown: false}}
      />
      {/* <Stack.Screen
        name="RegisterScreen"
        component={RegisterScreen}
        options={{
          title: 'Register', //Set Header Title
          headerStyle: {
            backgroundColor: '#307ecc', //Set Header color
          },
          headerTintColor: '#fff', //Set Header text color
          headerTitleStyle: {
            fontWeight: 'bold', //Set Header text style
          },
        }}
      /> */}
    </Stack.Navigator>
  );
};




export default function App() {
    return (

<NavigationContainer>

      <Stack.Navigator initialRouteName="Auth">
        
        {/* Auth Navigator: Include Login and Signup */}
        <Stack.Screen
          name="Auth"
          component={Auth}
          options={{headerShown: false}}
        />
        {/* NavigationControls as a landing page */}
        <Stack.Screen
          name="NavigationControls"
          component={NavigationControls}
          // Hiding header for Navigation Drawer
          options={{headerShown: false}}
        />

      </Stack.Navigator>
  </NavigationContainer>

    )
}
