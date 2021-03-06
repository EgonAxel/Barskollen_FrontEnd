import React, { Component } from 'react'
import { View, Text, TouchableOpacity, TextInput, StyleSheet, Alert, ImageBackground, Image, KeyboardAvoidingView } from 'react-native'
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

const primaryColor = '#f89c12';
const usedBorderRadius = 25;

async function save(key, value) {
   await SecureStore.setItemAsync(key, value);
 }

class LogIn extends Component {
   state = {
      username: '',
      email: '', 
      password: '',
   }
   handleUsername = (text) => {
    this.setState({ username: text })
   }
   handlePassword = (text) => {
      this.setState({ password: text })
   }
   login = (username, pass) => {
      if (!username) {
         Alert.alert('Användarnamn saknas','Fyll i ditt användarnamn!')
         return
      }
      if (!pass) {
         Alert.alert('Lösenord saknas','Fyll i ditt lösenord!')
         return
      }
      axios
         .post(`http://127.0.0.1:8000/api-token-auth/`, {username:username, password:pass})
         .then(response => {
            if (response.request.status === 200) {
               save("Token", response.data.token);
               save("Username", this.state.username);
               this.props.navigation.replace('NavigationControls')
            }
         })
         .catch((error) => {
            if (error.response.status !== 200) {
            Alert.alert('Kunde inte logga in','Kontrollera användarnamn och lösenord.')
            }
         });
   }
   render() {
      return (
         <View style = {styles.container}>
            <ImageBackground source={require('../images/login.jpg')} style={styles.backgroundImage} blurRadius={5} opacity={0.6}>
            <KeyboardAvoidingView behavior="position">
               <Image style = {{width: 240, height: 240, resizeMode: 'contain', alignSelf: 'center'}} source = {require('../images/Barskollen_logo_v2.png')}/>
                  <Text style = {styles.topTitle}>Logga in</Text>
                  <TextInput style = {styles.textInputFields}
                     underlineColorAndroid = "transparent"
                     placeholder = "Användarnamn"
                     placeholderTextColor = "grey"
                     autoCapitalize = "none"
                     returnKeyType="next"
                     onChangeText = {this.handleUsername}
                     onSubmitEditing={() => { this.passwordInput.focus(); }}
                     blurOnSubmit={false}/>
                     
                  <TextInput secureTextEntry={true} style = {styles.textInputFields}
                     ref={(input) => { this.passwordInput = input; }}
                     underlineColorAndroid = "transparent"
                     placeholder = "Lösenord"
                     placeholderTextColor = "grey"
                     autoCapitalize = "none"
                     returnKeyType="go"
                     onChangeText = {this.handlePassword}
                     onSubmitEditing={() => { this.login(this.state.username,  this.state.password) }}/>
                  
                  <TouchableOpacity
                     style = {styles.submitButton}
                     onPress = {
                        () => this.login(this.state.username,  this.state.password)
                     }>
                     <Text style = {styles.submitButtonText}>Logga in</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                     style = {styles.registerButton}
                     onPress = {
                        () => this.props.navigation.replace('Register')
                     }>
                     <Text style = {styles.registerButtonText}> Inget konto? Registrera dig! </Text>
                  </TouchableOpacity>
               </KeyboardAvoidingView>
            </ImageBackground>
         </View> 
      )
   }
}
export default LogIn

const styles = StyleSheet.create({
   container: {
    flex: 1,
    flexDirection: "column",
    justifyContent: 'center',
   },
   backgroundImage: {
      flex: 1,
      resizeMode: "cover",
      justifyContent: "center",
    },
   topTitle:  {
      fontWeight: '700',
      fontSize: 30,
      alignSelf: 'center',
      marginBottom: 20,
   },
   textInputFields: {
      paddingLeft: 15,
      paddingRight: 15,
      marginTop: 10,
      marginRight: 40,
      marginBottom: 5,
      marginLeft: 40,
      height: 40,
      borderColor: primaryColor,
      borderWidth: 2,
      borderRadius: usedBorderRadius,
      backgroundColor: 'white'
   },
   submitButton: {
      backgroundColor: primaryColor,
      padding: 10,
      marginTop: 10,
      marginRight: 40,
      marginBottom: 5,
      marginLeft: 40,
      height: 40,
      borderRadius: usedBorderRadius,
   },
   registerButton: {
      padding: 8,
      marginTop: 20,
      marginRight: 80,
      marginBottom: 5,
      marginLeft: 80,
      borderRadius: usedBorderRadius,
      backgroundColor: 'white',
   },
   submitButtonText: {
      fontSize: 16,
      fontWeight: '700',
      alignSelf: 'center',
      color: 'white',
   },
   registerButtonText: {
      fontWeight: '500',
      alignSelf: 'center',
      color: primaryColor,
   },
})