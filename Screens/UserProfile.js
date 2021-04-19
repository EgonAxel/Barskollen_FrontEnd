
import React from 'react'
import { StyleSheet, Text, View, Button, TouchableOpacity} from 'react-native';
import axios from 'axios';
import { Header } from 'react-native-elements';
import { Ionicons } from '@expo/vector-icons'; 
import { SafeAreaProvider } from 'react-native-safe-area-context';

const AppButton = ({ onPress, title }) => (
    <TouchableOpacity
     onPress={onPress} 
     style={styles.appButtonContainer}>                 
      <Text style={styles.appButtonText}>{title}</Text>
    </TouchableOpacity>
  );
    
function UserProfile({ navigation }) {
  
    return (
    <SafeAreaProvider>
      <View>
          <Header                                   // --- För att ha en header behövs en safearea runt appen 
            placement="left"
            statusBarProps={{ barStyle: 'light-content' }}
            barStyle="light-content" // or directly
            leftComponent={{text: 'Bärskollen', style: { color: 'black' , fontSize: 35}}}
            containerStyle={{
              backgroundColor: '#fff',
              justifyContent: 'space-around',
              //height: 100,
              
            }}
            rightComponent={<Ionicons name="person-outline" size={45}  /> }
          />
  
        <View style = {styles.buttonContainer}>
            <AppButton 
              title="Mina bärs"
              onPress={() =>
                //props.navigation.navigate('')
                console.log('Klicka mina bärs')
              }
            />
            <AppButton 
              title="Logga ut"
              onPress={() =>
                navigation.navigate('Auth')
              }
            />
        </View>
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
            paddingHorizontal: 12
          },
        appButtonText: {
          //  fontFamily: 'Avenir',
            fontSize: 18,
            color: "#fff",
            fontWeight: "bold",
            alignSelf: "center",
            textTransform: "uppercase"
          }
    })
    
    export default UserProfile  