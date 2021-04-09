import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Beers from './Screens/HomeInfinityScroll'
import ExempelClass from './Screens/ExempelClass'

export default function App() {
  return (
    <View style={styles.container}>

        <Beers name = 'Snogg'/>
        {/* <ExempelClass email = 'Snoggmail@snogg'/> */}

      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  }
});
