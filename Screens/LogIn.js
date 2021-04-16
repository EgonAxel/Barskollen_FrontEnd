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
   login = (username, pass, pass2, navigation) => {
      if (pass !== pass2) {
         Alert.alert("Fel lösenord", "Lösenorden matchar inte") /*   Första strängen är alert-titel, andra strängen är alert-meddelandet  */ 
      }
      else {
         axios
         .post(`http://192.168.1.73:8000/api-token-auth/`, {username:username, password:pass}) //Här behövs din egen adress till APIn
         .then(response => {
           
            if (response.request._aborted !== 'true') {
                this.props.navigation.replace('NavigationControls');
                save("Token", str(response.data.token));
            }
            else{
                alert('Fel lösenord eller användarnamn');
                console.log('Please check your email id or password');
            }
         })
         .catch((error) => {
         this.setState({error: error.message});
         });
      }
   }
   render() {
      return (
        <View style = {styles.container}> 
         <View>
           <Text style = {styles.topTitle}>Logga in</Text>
            <TextInput style = {styles.textInputFields}
               underlineColorAndroid = "transparent"
               placeholder = "Användarnamn"
               placeholderTextColor = "grey"
               autoCapitalize = "none"
               onChangeText = {this.handleUsername}/>

            {/* <TextInput style = {styles.textInputFields}
               underlineColorAndroid = "transparent"
               placeholder = "Email"
               placeholderTextColor = "grey"
               autoCapitalize = "none"
               onChangeText = {this.handleEmail}/> */}
            
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
                  () => this.login(this.state.username,  this.state.password, this.state.confirmPassword)
               }>
               <Text style = {styles.submitButtonText}> Logga in </Text>
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
   textInputFields: {
      paddingLeft: 15,
      paddingRight: 15,
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
   submitButtonText:{
      alignSelf: 'center',
      color: 'white'
   }
})