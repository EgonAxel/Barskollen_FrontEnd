

import React from 'react'
import { StyleSheet, Text, View, Button, TouchableOpacity} from 'react-native';
import {Card} from 'react-native-elements';


 
function IndividualBeer({ navigation }) {
  
    return (
      <View>
          <Text>Här ska det visas individuell info om ölen man klickade på! </Text>
          {/* <Text>beer_ID: {JSON.stringify(this.props.navigation.getParam('beer_ID'))}</Text> */}
      </View>
        )
  }

  

const styles = StyleSheet.create({

  })
    
export default IndividualBeer  