import React, { Component } from 'react'
import { View, Text, TouchableOpacity, TextInput, StyleSheet } from 'react-native'
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

async function save(key, value) {
   await SecureStore.setItemAsync(key, value);
 }

class LogIn extends Component {
   state = {
      username:'', 
      password: '',
      confirmPassword: '',
   }
   handleUsername = (text) => {
    this.setState({ username: text })
   }
   handlePassword = (text) => {
      this.setState({ password: text })
   }
   handleConfirmPassword = (text)=> {
      this.setState({ confirmPassword: text})
   }
   login = (username, pass) => {
      axios
      .post(`http://192.168.1.160:8080/api-token-auth/`, {username:username, password:pass}) //Här behövs din egen adress till APIn
      .then(response => {
         save("Token", str(response.data.token));
        this.setState({
          login: this.state.login.concat(response.data),
        });
        console.log()
      })
      .catch(error => {
        this.setState({error: error.message});
      });
   }
   render() {
      return (
        <View style = {styles.container}> 
         <View>
           <Text style = {styles.topTitle}>Skapa konto</Text>
            <TextInput style = {styles.textInputFields}
               underlineColorAndroid = "transparent"
               placeholder = "Användarnamn"
               placeholderTextColor = "grey"
               autoCapitalize = "none"
               onChangeText = {this.handleUsername}/>

            {/* <TextInput style = {styles.input}
               underlineColorAndroid = "transparent"
               placeholder = "Email"
               placeholderTextColor = "black"
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
               onChangeText = {this.handlePassword}/>
            
            <TouchableOpacity
               style = {styles.submitButton}
               onPress = {
                  () => this.login(this.state.username,  this.state.password)
               }>
               <Text style = {styles.submitButtonText}> Skapa konto </Text>
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