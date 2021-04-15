import React, { Component } from 'react'
import { View, Text, TouchableOpacity, TextInput, StyleSheet } from 'react-native'

class LogIn extends Component {
   state = {
      username:'', 
    //   email: '',
      password: ''
   }
   handleUsername = (text) => {
    this.setState({ username: text })
   }
//    handleEmail = (text) => {
//       this.setState({ email: text })
//    }
   handlePassword = (text) => {
      this.setState({ password: text })
   }
   login = (username, email, pass) => {
      alert('username: ' + username + ' password: ' + pass)
   }
   render() {
      return (
        <View style = {styles.container}> 
         <View>
           <Text style = {styles.toptext}>Skapa konto</Text>
            <TextInput style = {styles.input}
               underlineColorAndroid = "transparent"
               placeholder = "Username"
               placeholderTextColor = "black"
               autoCapitalize = "none"
               onChangeText = {this.handleUsername}/>

            {/* <TextInput style = {styles.input}
               underlineColorAndroid = "transparent"
               placeholder = "Email"
               placeholderTextColor = "black"
               autoCapitalize = "none"
               onChangeText = {this.handleEmail}/> */}
            
            <TextInput style = {styles.input}
               underlineColorAndroid = "transparent"
               placeholder = "Password"
               placeholderTextColor = "black"
               autoCapitalize = "none"
               onChangeText = {this.handlePassword}/>
            
            <TouchableOpacity
               style = {styles.submitButton}
               onPress = {
                  () => this.login(this.state.username,  this.state.password)
               }>
               <Text style = {styles.submitButtonText}> Submit </Text>
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
   toptext:  {
    fontSize: 30,
    alignSelf: 'center',
   },
   input: {
      margin: 15,
      height: 40,
      borderColor: '#009688',
      borderWidth: 1,
      borderRadius: 10,
   },
   submitButton: {
      backgroundColor: '#009688',
      padding: 10,
      margin: 15,
      height: 40,
      borderRadius: 10,
   },
   submitButtonText:{
      color: 'white'
   }
})