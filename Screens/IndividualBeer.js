

import React from 'react'
import { StyleSheet, Text, View, Button, TouchableOpacity} from 'react-native';


const AppButton = ({ onPress, title }) => (
    <TouchableOpacity
     onPress={onPress} 
     style={styles.appButtonContainer}>                 
      <Text style={styles.appButtonText}>{title}</Text>
    </TouchableOpacity>
  );

function IndividualBeer({  }) {
  
    return (
        <View style={styles.buttonContainer}>
     
        <AppButton 
         title="Ska vara individsuella öl"
         onPress={() =>
           //props.navigation.navigate('')
           console.log('Klicka Topplistan')
         }
       />
       <AppButton 
         title="skit i dessa knappar"
         onPress={() =>
           navigation.navigate('Utforska')
         }
       />
   
   <AppButton 
         title="bara skit azz"
         onPress={() =>
           navigation.navigate('Mitt konto')
         }
       />
   
   </View>
        )
    }

    const styles = StyleSheet.create({
        buttonContainer: {
            margin: 10,
            padding: 10,
            justifyContent: 'center',
        },
    
        appButtonContainer: {
            margin: 15,
            elevation: 8,
            backgroundColor: "#009688",
            borderRadius: 10,
            paddingVertical: 20,
            paddingHorizontal: 12
          },
        appButtonText: {
            //fontFamily: 'tahoma',
            fontSize: 18,
            color: "#fff",
            fontWeight: "bold",
            alignSelf: "center",
            textTransform: "uppercase"
          }

    })
    
    export default IndividualBeer  