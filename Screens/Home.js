import React from 'react'
import { StyleSheet, Text, View, TouchableOpacity, Image, ImageBackground, Dimensions} from 'react-native';
import { Ionicons } from '@expo/vector-icons'; 
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import MakeItRain from 'react-native-make-it-rain';
import CountDown from 'react-native-countdown-component';
import moment from 'moment'

const primaryColor = '#f89c11';

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

  isItFridayText = () => {
    let fridayCountdown = this.untilFriday()
    if (fridayCountdown < 0) {
      return ("Äntligen fredag!")
    }
    else {
      return ("Det är fredag om...")
    }
  }

  fridaySecondText = () => {
    let fridayCountdown = this.untilFriday()
    if (fridayCountdown < 0) {
      return ("Njut av helgen!")
    }
    else {
      return ("Håll ut!")
    }
  }
  rainingBeerNumber = ()  => {
    let fridayCountdown = this.untilFriday()
    let  numberOfRainingBeer = 0
    if (fridayCountdown < 0) {
      return (numberOfRainingBeer = 15 )
    }
    else {
      return ( numberOfRainingBeer == 0)
    }
  }

  render(){
    return (
      <SafeAreaProvider style = {{backgroundColor: '#ffffff'}}>
        <ImageBackground source={require('../images/humle.jpg')} style={styles.backgroundImage} blurRadius={0} opacity={1}>
          <View>
          <Image style = {{width: 175, height: 175, resizeMode: 'contain', alignSelf: 'center'}} source = {require('../images/Barskollen_logo_v2.png')}/>
            {/* <Header                   // --- För att ha en header behövs en safearea runt appen 
              containerStyle={{
                backgroundColor: 'transparent',
                justifyContent: 'space-around', 
                zIndex: 100,
              }}
              centerComponent={
                <Image style = {{ width: 150, height: 150}}source = {require('../images/Bärskollen_logga_v.2-NOBACKR.png')}/>}
            />          */}
            <View style={styles.buttonContainer}>
              <Text style = {styles.fridayTextStyle}>{this.isItFridayText()}</Text>
              <CountDown
                until={this.untilFriday()}  
                size={30}
                digitStyle={{backgroundColor: primaryColor}}
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
              numItems={this.rainingBeerNumber()}
              itemComponent={<Ionicons name="beer"  size={50}/>}
              itemDimensions = {{ width: 50, height: 50 }}
              itemTintStrength={0}
              fallSpeed = {10}
              flipSpeed = {0.1}
              horizSpeed = {20}
              continous = {true}
            />
          </View>
        </ImageBackground>
      </SafeAreaProvider> 
      )
    }
  }

const windowWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
  buttonContainer: {
    margin: 10,
    padding: 10,
    justifyContent: 'center',
  },
  backgroundImage: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center",
  },
  appButtonContainer: {
    width: windowWidth * 0.7,
    alignSelf: 'center',
    margin: 15,
    backgroundColor: primaryColor,
    borderRadius: 30,
    paddingVertical: 20,
    paddingHorizontal: 12,
    shadowColor: "#9f5f04",
    shadowOffset: {
      width: 1,
      height: 1 
    },
    shadowOpacity: 0.75,
    shadowRadius: 2,
  },
  appButtonText: {
    fontSize: 20,
    color: "#ffffff",
    fontWeight: "bold",
    alignSelf: "center",
    textTransform: "uppercase"
  },
  fridayTextStyle: {
    fontSize: 22,
    color: "black",
    fontWeight: "bold",
    alignSelf: "center",
    textTransform: "uppercase",
    padding: 10,
    backgroundColor: "#ffffff",
    borderRadius: 20,
    overflow: "hidden",
  }, 
})

export default Home