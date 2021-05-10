import React, { Component } from 'react'
import { View, Text, TouchableOpacity, TextInput, StyleSheet, Alert, ImageBackground, KeyboardAvoidingView } from 'react-native'
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import moment, { parseTwoDigitYear } from 'moment';


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
      if (pass !== pass2) {
         Alert.alert("Fel lösenord", "Lösenorden matchar inte") /*   Första strängen är alert-titel, andra strängen är alert-meddelandet  */ 
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
      axios
      .post(`http://127.0.0.1:8000/register/`, {username:username, password:pass, email:email, date_of_birth:dob}) //Här behövs din egen adress till APIn
      .then(response => {
         if (response.request.status === 201) { 
            console.log('Genererad token: ', response.data.token);
            save("Token", response.data.token);
            save("Username", this.state.username);
            this.props.navigation.replace('NavigationControls')
         }
      })
      .catch((error) => {
         if (typeof error.response.data.username == 'object') {
            Alert.alert('Felaktigt användarnamn','Användarnamnet får endast innehålla bokstäver, siffror och @/./+/-/_')
         }
         else if (typeof error.response.data.email == 'object') {
            Alert.alert('Felaktig mailadress','Ange en korrekt mailadress')
         }
         else if (error.response.data.date_of_birth == "AgeRequirementNotSatisfied") {
            Alert.alert('Inte riktigt ännu','Du behöver vara minst 18 år för att registrera ett konto.')
         }
         else if (typeof error.response.data.date_of_birth == 'object') {
            Alert.alert('Felaktigt födelsedatum','Ange ett födelsedatum på formatet ÅÅÅÅ-MM-DD')
         }
         else if (error.response.status !== 201) {
            Alert.alert('Kunde inte skapa konto','Kontrollera att fälten fyllts i korrekt')
         }
         });
   }

   render() {
      return (
         <View style = {styles.container}>
            <ImageBackground source={require('../images/login.jpg')} style={styles.backgroundImage} blurRadius={10} opacity={0.6}>
               <KeyboardAvoidingView behavior="position">
                  <Text style = {styles.topTitle}>Registrera dig</Text>
                  <TextInput style = {styles.textInputFields}
                     underlineColorAndroid = "transparent"
                     placeholder = "Användarnamn"
                     placeholderTextColor = "grey"
                     autoCapitalize = "none"
                     returnKeyType="next"
                     onChangeText = {this.handleUsername}
                     onSubmitEditing={() => { this.emailInput.focus(); }}
                     blurOnSubmit={false}/>
                     
                  <TextInput style = {styles.textInputFields}
                     ref={(input) => { this.emailInput = input; }}
                     underlineColorAndroid = "transparent"
                     placeholder = "Email-adress"
                     placeholderTextColor = "grey"
                     autoCapitalize = "none"
                     returnKeyType="next"
                     onChangeText = {this.handleEmail}
                     onSubmitEditing={() => { this.birthDateInput.focus(); }}
                     blurOnSubmit={false}/>

                  <TextInput style = {styles.textInputFields}
                     ref={(input) => { this.birthDateInput = input; }}
                     underlineColorAndroid = "transparent"
                     placeholder = "Födelsedatum (ÅÅÅÅ-MM-DD)"
                     placeholderTextColor = "grey"
                     autoCapitalize = "none"
                     returnKeyType="next"
                     onChangeText = {this.handleDateOfBirth}
                     onSubmitEditing={() => { this.passwordInput.focus(); }}
                     blurOnSubmit={false}/>

                  <TextInput secureTextEntry={true} style = {styles.textInputFields}
                     ref={(input) => { this.passwordInput = input; }}
                     underlineColorAndroid = "transparent"
                     placeholder = "Lösenord"
                     placeholderTextColor = "grey"
                     autoCapitalize = "none"
                     returnKeyType="next"
                     onChangeText = {this.handlePassword}
                     onSubmitEditing={() => { this.confirmPasswordInput.focus(); }}
                     blurOnSubmit={false}/>

                  <TextInput secureTextEntry={true} style = {styles.textInputFields}
                     ref={(input) => { this.confirmPasswordInput = input; }}
                     underlineColorAndroid = "transparent"
                     placeholder = "Bekräfta lösenord"
                     placeholderTextColor = "grey"
                     autoCapitalize = "none"
                     returnKeyType="go"
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
               </KeyboardAvoidingView>
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
    //  fontFamily: 'Avenir',
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
     // fontFamily: 'Avenir',
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
     // fontFamily: 'Avenir',
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
     // fontFamily: 'Avenir',
      fontWeight: '700',
      alignSelf: 'center',
      color: 'white'
   },
   alreadyHaveAnAccountText: {
     // fontFamily: 'Avenir',
      fontWeight: '700',
      alignSelf: 'center',
      color: '#009688',
   }
})