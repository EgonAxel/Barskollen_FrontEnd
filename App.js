
import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import React from 'react';
import { StyleSheet, Text, View} from 'react-native';
import { Header } from 'react-native-elements';
import NavigationControls from './Screens/NavigationControls'
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons'; 


//npm install @react-navigation/native @react-navigation/stack
//expo install react-native-reanimated react-native-gesture-handler react-native-screens react-native-safe-area-context @react-native-community/masked-view
//npm install @react-navigation/material-bottom-tabs react-native-paper

//npm i react-native-elements --save       ---  För header och element från react native element
//npm i --save react-native-vector-icons
//npm i --save react-native-safe-area-context      

  
export default function App() {
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
            height: 100,
          }}
          rightComponent={<Ionicons name="beer-outline" size={30}  /> }
        />
      <NavigationContainer>
        <NavigationControls/> 
      </NavigationContainer>
    </SafeAreaProvider>
    )
}
