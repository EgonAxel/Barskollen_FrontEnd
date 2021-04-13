
import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import NavigationControls from './Screens/NavigationControls'


//npm install @react-navigation/native @react-navigation/stack
//expo install react-native-reanimated react-native-gesture-handler react-native-screens react-native-safe-area-context @react-native-community/masked-view
//npm install @react-navigation/material-bottom-tabs react-native-paper

const Stack = createStackNavigator()

  
export default function App() {
    return (

      <NavigationContainer>
        <NavigationControls/>
      </NavigationContainer>

    )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  }
});
