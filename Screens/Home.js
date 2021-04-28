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

// -- Make it rain ger loggor som faller ner, början på att få in de olika bilderna på öl
// -- är gjord men inte klar och utkommenterad för tillfället. 

//const AppButton istället för vanlig button för att få en redigerbar knapp som funkar på både ios o andriod.
// länk för knappar: https://blog.logrocket.com/creating-custom-buttons-in-react-native/

const AppButton = ({ onPress, title }) => (
    <TouchableOpacity
     onPress={onPress} 
     style={styles.appButtonContainer}>                 
      <Text style={styles.appButtonText}>{title}</Text>
    </TouchableOpacity>
  );
  // async function save(key, value) {
  //   await SecureStore.setItemAsync(key, value);
  // }
  
  // async function getValueFor(key) {
  //   let result = await SecureStore.getItemAsync(key);
  //   if (result) {
  //     return(result);
  //   } else {
  //     return(None);
  //   }
  // }


class Home extends React.PureComponent {
  // constructor(props) {
  //   super(props);
 
  //   this.state = {
  //     offset: 0,
  //     beerImage: [],
  //   };
  // }

  // fetchBeer = (offset) => {
  //   getValueFor("Token").then((token) => {
  //       axios
  //       .get(`http://192.168.1.73:8000/beer/?limit=20&offset=${offset}`, {headers: { 'Authorization': `Token ` + token}}) //Här behävs din egen adress till APIn
  //       .then(response => {
  //         this.setState({
  //           beerImage: this.state.beerImage.concat(response.data.results),
  //         });
  //       })
  //       .catch(error => {
  //         this.setState({error: error.message});
  //       });
  //   })
  // }
  // fetchMoreBeers = () => {
  //   if (this.state.beerImage.length >= 20) {
  //     this.setState(
  //       prevState => ({
  //         offset: prevState.offset + 20,
  //       }),
  //       () => {
  //         this.fetchBeer(this.state.offset, this.state.searchText, this.state.orderingValue, this.state.beerType);
  //       },
  //     );
  //   };
  // }
  // componentDidMount() {
  //     this.fetchBeer(this.state.offset);
  // }

  // setBeerImage  = () => {

  // }

render(){
    
return (
<SafeAreaProvider>
  <View>
    <Header                   // --- För att ha en header behövs en safearea runt appen 
          placement="left"
          statusBarProps={{ barStyle: 'light-content' }}
          barStyle="light-content" // or directly
          leftComponent={{text: 'Bärskollen', style: { color: 'black' , fontSize: 35}}}
          containerStyle={{
            backgroundColor: '#fff',
            justifyContent: 'space-around', 
          }}
          rightComponent={<Ionicons name="beer-outline" size={45}  /> }
          />
    <View style={styles.buttonContainer}>
        <AppButton 
            title="Topplistan"
            onPress={() => {
              console.log( this.state.beerImage[1].picture_url + '_100.png')
            }}
          />
          <AppButton 
            title="Utforska"
            onPress={() =>
              this.props.navigation.navigate('Utforska')
            }
          />
        <AppButton 
            title="Mitt konto"
            onPress={() =>
              this.props.navigation.navigate('Mitt konto')
            }
          />

      <StatusBar style="dark" />
      </View> 
	        <MakeItRain
	          numItems={20}
	          itemComponent={<Ionicons name="beer-outline"  size={50} />}
           // itemComponent={<Image source = {{uri: "https://product-cdn.systembolaget.se/productimages/" + this.state.beerImage.beer + "/" + this.state.beerImage.beer + '_100.png' }}/>}
           // itemComponent={<Image style = {{width: 100, height: 100, resizeMode: 'contain'}} source = {{uri: this.state.beerImage[1].picture_url + '_100.png' }}/>}
            itemDimensions = {{ width: 50, height: 50 }}
	          itemTintStrength={0}
            fallSpeed = {10}
            flipSpeed = {0}
            horizSpeed = {20}
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
    appButtonText: {
       // fontFamily: 'Avenir',
        fontSize: 18,
        color: "#fff",
        fontWeight: "bold",
        alignSelf: "center",
        textTransform: "uppercase"
      }
})

export default Home