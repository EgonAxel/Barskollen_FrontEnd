

import React from 'react'
import { StyleSheet, Text, View, Button, TouchableOpacity} from 'react-native';

//const AppButton istället för vanlig button för att få en redigerbar knapp som funkar på både ios o andriod.
// länk för knappar: https://blog.logrocket.com/creating-custom-buttons-in-react-native/

const AppButton = ({ onPress, title }) => (
    <TouchableOpacity
     onPress={onPress} 
     style={styles.appButtonContainer}>                 
      <Text style={styles.appButtonText}>{title}</Text>
    </TouchableOpacity>
  );


function Home({ navigation }) {
  
return (
 <View style={styles.buttonContainer}>
     
     <AppButton 
      title="Topplistan"
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

<AppButton 
      title="Mitt konto"
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
        fontFamily: 'tahoma',
        fontSize: 18,
        color: "#fff",
        fontWeight: "bold",
        alignSelf: "center",
        textTransform: "uppercase"
      }
})

export default Home
