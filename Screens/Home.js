import React from 'react'
import { StyleSheet, Text, View, Button, TouchableOpacity} from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { Header } from 'react-native-elements';
import { Ionicons } from '@expo/vector-icons'; 
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';


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
<SafeAreaProvider>
  <View>
    <Header                   // --- För att ha en header behövs en safearea runt appen 
          placement="left"
          statusBarProps={{ barStyle: 'light-content' }}
          barStyle="light-content" // or directly
          leftComponent={{text: 'Bärskollen', style: { color: 'black' , fontSize: 35}}}
          containerStyle={{
            backgroundColor: '#fff',
            justifyContent: 'space-around', 
          }}
          rightComponent={<Ionicons name="beer-outline" size={45}  /> }
          />
    <View style={styles.buttonContainer}>
        <AppButton 
            title="Topplistan"
            onPress={() => {
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
      <StatusBar style="dark" />
    </View>
  </SafeAreaProvider> 
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
       // fontFamily: 'Avenir',
        fontSize: 18,
        color: "#fff",
        fontWeight: "bold",
        alignSelf: "center",
        textTransform: "uppercase"
      }
})

export default Home
