import React, { Component } from 'react'
import { View, Text, TouchableOpacity, TextInput, StyleSheet, Alert, ImageBackground } from 'react-native'
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

async function save(key, value) {
   await SecureStore.setItemAsync(key, value);
 }

   class Register extends Component {
      state = {
         username: '',
         email: '', 
         password: '',
         dateOfBirth: '',
         confirmPassword: '',
    }
   handleUsername = (text) => {
      this.setState({ username: text })
   }
   handleEmail = (text) => {
      this.setState({ email: text })
   }
   handlePassword = (text) => {
      this.setState({ password: text })
   }
   handleConfirmPassword = (text)=> {
      this.setState({ confirmPassword: text})
   }
   handleEmail = (text)=> {
      this.setState({ email: text})
   }
   handleDateOfBirth = (text)=> {
      this.setState({ dateOfBirth: text})
   }
   registerUser = (username, pass, pass2, email, dob) => {
      if (!username) {
         Alert.alert('Användarnamn saknas','Fyll i användarnamn')
         return
      }
      if (!pass) {
         Alert.alert('Lösenord saknas','Fyll i lösenord')
         return
      }
      if (!email) {
         Alert.alert('Email saknas','Fyll i emailadress')
         return
      }
      if (!dob) {
         Alert.alert('Födelsedatum saknas','Fyll i födelsedatum')
         return
      }
      if (pass !== pass2) {
         Alert.alert("Fel lösenord", "Lösenorden matchar inte") /*   Första strängen är alert-titel, andra strängen är alert-meddelandet  */ 
      }
      axios
      .post(`http://127.0.0.1:8000/user/register`, {username:username, password:pass, email:email, date_of_birth:dob}) //Här behövs din egen adress till APIn
      .then(response => {
         if (response.request.status === 201) { //Status 200 är 'Success'
            console.log(response.data.token);
            save("Token", response.data.token);
            this.props.navigation.replace('NavigationControls')
         }
      })
      .catch((error) => {
         if (error.response.status !== 201) {//Status 400 är 'Bad request'
         Alert.alert('Kunde inte skapa konto','\nKontrollera att fälten fyllts i korrekt')
         }
         });
   }
   render() {
      return (
         <View style = {styles.container}>
            <ImageBackground source={require('../images/login.jpg')} style={styles.backgroundImage} blurRadius={10} opacity={0.6}> 
               <Text style = {styles.topTitle}>Registrera dig</Text>
               <TextInput style = {styles.textInputFields}
                  underlineColorAndroid = "transparent"
                  placeholder = "Användarnamn"
                  placeholderTextColor = "grey"
                  autoCapitalize = "none"
                  onChangeText = {this.handleUsername}/>

               <TextInput style = {styles.textInputFields}
                  underlineColorAndroid = "transparent"
                  placeholder = "Email-adress"
                  placeholderTextColor = "grey"
                  autoCapitalize = "none"
                  onChangeText = {this.handleEmail}/>

               <TextInput style = {styles.textInputFields}
                  underlineColorAndroid = "transparent"
                  placeholder = "Födelsedatum (ÅÅÅÅ-MM-DD)"
                  placeholderTextColor = "grey"
                  autoCapitalize = "none"
                  onChangeText = {this.handleDateOfBirth}/>

               <TextInput secureTextEntry={true} style = {styles.textInputFields}
                  underlineColorAndroid = "transparent"
                  placeholder = "Lösenord"
                  placeholderTextColor = "grey"
                  autoCapitalize = "none"
                  onChangeText = {this.handlePassword}/>

               <TextInput secureTextEntry={true} style = {styles.textInputFields}
                  underlineColorAndroid = "transparent"
                  placeholder = "Bekräfta lösenord"
                  placeholderTextColor = "grey"
                  autoCapitalize = "none"
                  onChangeText = {this.handleConfirmPassword}/>

               <TouchableOpacity
                  style = {styles.registerButton}
                  onPress = {
                     () => this.registerUser(this.state.username,  this.state.password, this.state.confirmPassword, this.state.email, this.state.dateOfBirth)
                  }>
                  <Text style = {styles.registerButtonText}> Registrera konto </Text>
               </TouchableOpacity>

               <TouchableOpacity
                  style = {styles.alreadyHaveAnAccount}
                  onPress = {
                     () => this.props.navigation.replace('LoginScreen')
                  }>
                  <Text style = {styles.alreadyHaveAnAccountText}> Jag har redan ett konto </Text>
               </TouchableOpacity>
            </ImageBackground>
         </View>
      )
   }
}
export default Register

const styles = StyleSheet.create({
   container: {
    flex: 1,
    justifyContent: 'center',
   },
   topTitle:  {
      fontFamily: 'Avenir',
      fontWeight: '700',
      fontSize: 30,
      alignSelf: 'center',
      marginBottom: 20,
   },
   backgroundImage: {
      flex: 1,
      resizeMode: "cover",
      justifyContent: "center",
    },
   dateOfBirthText:  {
      fontSize: 15,
      alignSelf: 'center',
     },
   textInputFields: {
      fontFamily: 'Avenir',
      paddingLeft: 15,
      marginTop: 10,
      marginRight: 40,
      marginBottom: 5,
      marginLeft: 40,
      height: 40,
      borderColor: '#009688',
      borderWidth: 2,
      borderRadius: 10,
      backgroundColor: 'white'
   },
   registerButton: {
      fontFamily: 'Avenir',
      backgroundColor: '#009688',
      padding: 10,
      marginTop: 10,
      marginRight: 40,
      marginBottom: 5,
      marginLeft: 40,
      height: 40,
      borderRadius: 10,
   },
   alreadyHaveAnAccount: {
      padding: 5,
      marginTop: 20,
      marginRight: 80,
      marginBottom: 5,
      marginLeft: 80,
      height: 30,
      borderRadius: 10,
      backgroundColor: 'white',
      opacity: 0.5,
   },
   registerButtonText: {
      fontFamily: 'Avenir',
      fontWeight: '700',
      alignSelf: 'center',
      color: 'white'
   },
   alreadyHaveAnAccountText: {
      fontFamily: 'Avenir',
      fontWeight: '800',
      alignSelf: 'center',
      color: '#009688',
   }
})