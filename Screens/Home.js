

import React from 'react'
import { StyleSheet, Text, View, Button, TouchableOpacity} from 'react-native';
import * as SecureStore from 'expo-secure-store';

//const AppButton istället för vanlig button för att få en redigerbar knapp som funkar på både ios o andriod.
// länk för knappar: https://blog.logrocket.com/creating-custom-buttons-in-react-native/

const AppButton = ({ onPress, title }) => (
    <TouchableOpacity
     onPress={onPress} 
     style={styles.appButtonContainer}>                 
      <Text style={styles.appButtonText}>{title}</Text>
    </TouchableOpacity>
  );
  async function save(key, value) {
    await SecureStore.setItemAsync(key, value);
  }
  
  async function getValueFor(key) {
    let result = await SecureStore.getItemAsync(key);
    if (result) {
      return(result);
    } else {
      return(None);
    }
  }


function Home({ navigation }) {
  
return (
 <View style={styles.buttonContainer}>
  
  <AppButton 
      title="Topplistan"
      onPress={() => {
        save("Token", "fb7bc1a9dab70d8e5c74457839243528cf454d0a");
        getValueFor("Token").then((token) => {
          console.log(token)
        })
      }}
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
        paddingHorizontal: 12,
      },
    appButtonText: {
        //fontFamily: '',
        fontSize: 18,
        color: "#fff",
        fontWeight: "bold",
        alignSelf: "center",
        textTransform: "uppercase"
      }
})

export default Home
