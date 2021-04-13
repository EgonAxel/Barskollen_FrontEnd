
import React from 'react'
import { StyleSheet, Text, View, Button, TouchableOpacity} from 'react-native';


const AppButton = ({ onPress, title }) => (
    <TouchableOpacity
     onPress={onPress} 
     style={styles.appButtonContainer}>                 
      <Text style={styles.appButtonText}>{title}</Text>
    </TouchableOpacity>
  );

function UserProfile({ navigation }) {
  
    return (
     <View style={styles.buttonContainer}>
         
         <AppButton 
          title="Mina bärs"
          onPress={() =>
            //props.navigation.navigate('')
            console.log('Klicka Topplistan')
          }
        />
        <AppButton 
          title="Utforska"
          onPress={() =>
            navigation.navigate('Utforska')
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
           // fontFamily: 'tahoma',
            fontSize: 18,
            color: "#fff",
            fontWeight: "bold",
            alignSelf: "center",
            textTransform: "uppercase"
          }
    })
    
    export default UserProfile  