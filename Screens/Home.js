import React from 'react'
import { StyleSheet, Text, View, Button, TouchableOpacity, Image} from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { Header } from 'react-native-elements';
import axios from 'axios';
import { Ionicons } from '@expo/vector-icons'; 
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import MakeItRain from 'react-native-make-it-rain';
import { render } from 'react-dom';
import CountDown from 'react-native-countdown-component';
import moment from 'moment'

//const AppButton istället för vanlig button för att få en redigerbar knapp som funkar på både ios o andriod.
// länk för knappar: https://blog.logrocket.com/creating-custom-buttons-in-react-native/

// -- länk för countdown: https://www.npmjs.com/package/react-native-countdown-component
// -- länk till moment, räkna ut närt fredag är: https://momentjs.com/

const AppButton = ({ onPress, title }) => (
    <TouchableOpacity
     onPress={onPress} 
     style={styles.appButtonContainer}>                 
      <Text style={styles.appButtonText}>{title}</Text>
    </TouchableOpacity>
  );

class Home extends React.PureComponent {
  untilFriday = () => {
    const currentDay = moment().weekday();
    const currentHour = moment().hours();
    const currentMinute = moment().minutes();
    const currentSecond = moment().seconds();
    // [{monday = 1}, {tuesday = 2}, {wednesday = 3}, {thursday = 4}, {friday = 5}, {saturday = 6}, {sunday = 7}]
    const countdownDay = 5;
    const hoursInDay = 24;
    const secondsInMinute = 60;
    const minutesInHour = 60;
    const seconds = secondsInMinute - currentSecond;
    const minutes = ((minutesInHour - currentMinute) * secondsInMinute);
    const hours = (hoursInDay - currentHour - 1) * minutesInHour * secondsInMinute;
    const secondsToMidnight = hours + minutes + seconds;
    const secondsToCountdownDay = (countdownDay - currentDay - 1) * hoursInDay * minutesInHour * secondsInMinute;

    const tenHours = minutesInHour * secondsInMinute * 10;

    return(
      (secondsToCountdownDay + secondsToMidnight)
      //Countdown till Systembolaget öppnar på fredag (10:00)
      //(secondsToCountdownDay + secondsToMidnight + tenHours)
    )
  }

  fridaySecondText = () => {
    let fridayCountdown = this.untilFriday()
    console.log(fridayCountdown)
    if (fridayCountdown < 0) {
      return ("Njut av helgen!")
    }
    else {
      return ("Håll ut!")
    }
  }

  render(){
    return (
      <SafeAreaProvider style = {{backgroundColor: '#ffff'}}>
        <View>
          <Header                   // --- För att ha en header behövs en safearea runt appen 
            containerStyle={{
              backgroundColor: '#ffff',
              justifyContent: 'space-around', 
              zIndex: 100,
            }}
            centerComponent={
              <Image style = {{ width: 150, height: 150}}source = {require('../images/Bärskollen_logga_v.2-NOBACKR.png')}/>}
          />         
          <View style={styles.buttonContainer}>
            <Text style = {styles.fridayTextStyle}>Det är fredag om...</Text>
            <CountDown
              // until={604800 - this.secondsUntilFriday()}
              until={this.untilFriday()}  
              size={30}
              digitStyle={{backgroundColor: '#009688'}}
              digitTxtStyle={{color: '#ffffff'}}
              timeLabels={{d: 'Dagar', h: 'Timmar', m: 'Minuter', s: 'Sekunder'}}
              style = {{zIndex: 100, paddingVertical: 10}}
            />
            <Text style = {styles.fridayTextStyle}>{this.fridaySecondText()}</Text>
            <AppButton 
              title="Hitta nya öl"
              onPress={() => {{ this.props.navigation.navigate('Utforska')} }}
            />
            <AppButton 
              title="Mina öl"
              onPress={() => {{ this.props.navigation.navigate('Mitt konto')} }}
            />
            <StatusBar style="dark"/>
          </View>
          <MakeItRain
            numItems={0}
            itemComponent={<Ionicons name="beer"  size={50}/>}
          // itemComponent={<Image style = {{width: 50, height: 50, resizeMode: 'contain'}} source = {require('../images/Bärskollen_logga_v.2-NOBACKR.png')}/>}
          // itemComponent={<Image source = {{uri: "https://product-cdn.systembolaget.se/productimages/" + this.state.beerImage.beer + "/" + this.state.beerImage.beer + '_100.png' }}/>}
          // itemComponent={<Image style = {{width: 100, height: 100, resizeMode: 'contain'}} source = {{uri: this.state.beerImage[1].picture_url + '_100.png' }}/>}
            itemDimensions = {{ width: 50, height: 50 }}
            itemTintStrength={0}
            fallSpeed = {10}
            flipSpeed = {0.1}
            horizSpeed = {20}
            continous = {true}
            //flavor={"rain"}
          />
        </View>
      </SafeAreaProvider> 
      )
    }
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
  fridayTextStyle: {
    fontSize: 22,
    color: "black",
    fontWeight: "bold",
    alignSelf: "center",
    textTransform: "uppercase",
    padding: 10,
  }, 
  appButtonText: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "bold",
    alignSelf: "center",
    textTransform: "uppercase"
  }
})

export default Home