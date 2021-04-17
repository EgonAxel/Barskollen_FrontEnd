import React, { Component } from 'react'
import { View, Text, TouchableOpacity, TextInput, StyleSheet, Alert } from 'react-native'
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

async function save(key, value) {
   await SecureStore.setItemAsync(key, value);
 }

   class LogIn extends Component {
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
   login = (username, pass, pass2, email, dob) => {
      if (pass !== pass2) {
         Alert.alert("Fel lösenord", "Lösenorden matchar inte") /*   Första strängen är alert-titel, andra strängen är alert-meddelandet  */ 
      }
      else {
         axios
         .post(`http://127.0.0.1:8000/user/register`, {username:username, password:pass, email:email, date_of_birth:dob}) //Här behövs din egen adress till APIn
         .then(response => {
            if (response.request._aborted !== 'true') {
               save("Token", response.data.token)
               this.props.navigation.replace('NavigationControls')
            }
            else {
                alert('Fel lösenord eller användarnamn');
                console.log('Please check your email id or password');
            }
         })
         .catch((error) => {
         this.setState({error: error.message});
         console.log(error.message);
         });
      }
   }
   render() {
      return (
        <View style = {styles.container}> 
         <View>
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
               placeholder = "Födelsedatum ÅÅÅÅ-MM-DD"
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
               style = {styles.submitButton}
               onPress = {
                  () => this.login(this.state.username,  this.state.password, this.state.confirmPassword, this.state.email, this.state.dateOfBirth)
               }>
               <Text style = {styles.submitButtonText}> Registrera dig </Text>
            </TouchableOpacity>

            <TouchableOpacity
               style = {styles.alreadyHaveAnAccount}
               onPress = {
                  () => this.props.navigation.replace('LoginScreen')
               }>
               <Text style = {styles.alreadyHaveAnAccountText}> Jag har redan ett konto </Text>
            </TouchableOpacity>
         </View>
        </View>  
      )
   }
}
export default LogIn

const styles = StyleSheet.create({
   container: {
    flex: 1,
    justifyContent: 'center',
   },
   topTitle:  {
    fontSize: 30,
    alignSelf: 'center',
   },
   dateOfBirthText:  {
      fontSize: 15,
      alignSelf: 'center',
     },
   textInputFields: {
      paddingLeft: 15,
      marginTop: 10,
      marginRight: 40,
      marginBottom: 5,
      marginLeft: 40,
      height: 40,
      borderColor: '#009688',
      borderWidth: 2,
      borderRadius: 10,
   },
   submitButton: {
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
      padding: 10,
      marginTop: 20,
      marginRight: 40,
      marginBottom: 5,
      marginLeft: 40,
      height: 40,
      borderRadius: 10,
   },
   submitButtonText:{
      alignSelf: 'center',
      color: 'white'
   },
   alreadyHaveAnAccountText:{
      alignSelf: 'center',
      color: '#009688',
   }
})