import React from 'react';
import {View, Text, FlatList, Image, StyleSheet, TextInput, TouchableOpacity, Button, Dimensions, ImageBackground} from 'react-native';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import Stars from 'react-native-stars';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Ionicons } from '@expo/vector-icons'; 
import { MaterialIcons } from '@expo/vector-icons'; 
import RNPickerSelect from 'react-native-picker-select';

// Installera dessa: 
// npm i --save axios 
// npm i react-native-elements --save
// npm i --save react-native-vector-icons // required by react-native-elements

// npm install react-native-stars --save  //För stärnor

const AppButton = ({ onPress, title }) => (
  <TouchableOpacity
   onPress={onPress}>                 
    <Text style={styles.logoutText}>{title}</Text>
  </TouchableOpacity>
);

async function getValueFor(key) {
  let result = await SecureStore.getItemAsync(key);
  if (result) {
     return(result);
   } else {
     return(None);
   }
 }

async function deleteValueFor(key) {
  let result = await SecureStore.deleteItemAsync(key);
}

class UserProfile extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      reviews: [],
      offset: 0,  //Bestämmer vilken sida från vår api vi laddar in.
      orderingValue: "",
      error: null,
      username: ""
    };
  }
  handleFilterAction = () => {
    this.setState({
      offset: 0,
      reviews: []})
    this.fetchReview(this.state.username, 0, this.state.orderingValue)
  }
  fetchReview = (username, offset, orderingValue) => {
    getValueFor("Token").then((token) => {
        axios
        .get(`http://127.0.0.1:8000/review/?limit=20&user=${username}&offset=${offset}&ordering=${orderingValue}`, {headers: { 'Authorization': `Token ` + token}}) //Här behävs din egen adress till APIn
        .then(response => {
          this.setState({
            reviews: this.state.reviews.concat(response.data.results),
          });
        })
        .catch(error => {
          this.setState({error: error.message});
        });
    })
  }
  fetchMoreReviews = () => {
    if (this.state.reviews.length >= 20) {
      this.setState(
        prevState => ({
          offset: prevState.offset + 20,
        }),
        () => {
          this.fetchReview(this.state.username, this.state.offset, this.state.orderingValue);
        },
      );
    };
  }
  componentDidMount() {
    getValueFor("Username").then((username) => {
      this.setState({username: username})
      this.fetchReview(this.state.username, this.state.offset, this.state.orderingValue);
    })
  }
  _renderListItem(item) {
    return(
      // Bortkommenderad från <Card>: pointerEvents="none">
      <View style = {styles.viewStyle}>
        {/* <Card style = {styles.cardStyle}> */}
          <TouchableOpacity onPress={() => this.props.navigation.navigate('IndividualBeerFromProfile', {beer_ID: item.beer, rating: item.rating})}>
              <View style = {styles.beerInstance}>
                <Image style = {styles.beerImage} source = {{uri: "https://product-cdn.systembolaget.se/productimages/" + item.beer + "/" + item.beer + '_100.png' }}/>
                <View style = {styles.ratingStars}>
                  <Text style = {styles.productNameBold}> {item.beer_name} </Text>
                  <Stars
                      display= {Number((item.rating).toFixed(1))}
                      fullStar={<Icon name={'star'} style={[styles.myStarStyle]}/>}
                      emptyStar={<Icon name={'star-outline'} style={[styles.myStarStyle, styles.myEmptyStarStyle]}/>}
                      halfStar={<Icon name={'star-half-full'} style={[styles.myStarStyle]}/>}
                  />
                </View>
              </View>
          </TouchableOpacity>
      </View>
      )
  }

  renderListHeader = () => {
    return (
    <View>
      <View>
      {/* <ImageBackground source={require('../images/blurry.jpg')} style={styles.backgroundImage} blurRadius={10} opacity={0.6}> */}
      <TouchableOpacity style = {styles.logoutButton}
          onPress={() =>
            deleteValueFor("Username").then(() => {
              deleteValueFor("Token").then(() => {
                this.props.navigation.reset({
                  index: 0,
                  routes: [{ name: 'Auth' }]
                })

              })
            })
          }>
        <Text style = {styles.logoutText}>Logga ut</Text>
        <Ionicons name="log-out-outline" size={23}/>
      </TouchableOpacity>
      </View>
      <View>
        <View style={ Platform.OS === 'ios'
              ? pickerSelectStyles.inputIOS
              : pickerSelectStyles.inputAndroid, 
              { flexDirection:"row", 
                justifyContent:"space-evenly",
              }}> 
            <View style = {styles.usernameMyBeerAndSorting}>
              <View style={{flexDirection:"row", alignSelf:'center'}}>
                <MaterialIcons name="person-outline" size={26} color={'#009688'} />
                <Text style={styles.userNameText}>{this.state.username}</Text>
              </View> 
              <View style = {styles.myBeersSorting}>
                <Text style={styles.myBeersText}>Mina recensioner:</Text>
                <RNPickerSelect style={pickerSelectStyles}
                  useNativeAndroidPickerStyle={false}
                  placeholder={{
                  label: 'Sortering',
                  value: null,
                  }}
                  onValueChange={(value) => this.setState({
                    orderingValue: value},
                    this.handleFilterAction)}
                  items={[
                    { label: 'Sortera på rating (stigande)', value: 'rating', inputLabel: 'Rating (stigande)' },
                    { label: 'Sortera på rating (fallande)', value: '-rating', inputLabel: 'Rating (fallande)' },
                    { label: 'Sortera datum (nyast först)', value: '-review_date', inputLabel: 'Datum (nyast först)' },
                    { label: 'Sortera datum (äldst först)', value: 'review_date', inputLabel: 'Datum (äldst först)' },
                  ]}
                />
            </View>
          </View>
        </View>
      </View>
      {/* </ImageBackground> */}
    </View>
    )
  }

  render() {

    return (
      <View style={{flex: 1}}>
        <FlatList
          style={{flex: 1}}
          contentContainerStyle={{
            backgroundColor: '#ffffff',
            alignItems: 'center',
            justifyContent: 'center',
            // marginTop: 15,
          
          }}
          data={this.state.reviews}
          keyExtractor={(beer, index) => String(index)}
          
          renderItem={({ item }) => this._renderListItem(item)}
          //horizontal={true}
        
          onEndReached={this.fetchMoreReviews}
          onEndReachedThreshold={2}
          ListHeaderComponent={this.renderListHeader}/>
      </View>
    );
  }
}
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const pickerSelectStyles = StyleSheet.create({
  inputIOS: { //
    backgroundColor: '#ffffff',
    fontSize: 16,
    paddingVertical: 5,
    paddingHorizontal: 10,
    marginLeft: 10,
    borderWidth: 2,
    borderColor: '#009688',
    borderRadius: 10,
    color: 'black',
    alignSelf: 'center',
  },
  inputAndroid: {
    fontSize: 16,
    paddingVertical: 5,
    paddingHorizontal: 30,
    borderWidth: 2,
    borderColor: '#009688',
    borderRadius: 10,
    color: 'black',
  },
});

const styles = StyleSheet.create({

  viewStyle: {
    marginTop: 15,
    width: 350,
    height: 150,
    backgroundColor: '#ffffff',
    borderRadius: 15,
    borderStyle: 'solid', 
    borderColor: '#dadada',
    borderWidth: 1,
    shadowColor: "#000000",
    shadowOffset: {
      width: 1,
      height: 1
    },
    shadowOpacity: 0.5,
    shadowRadius: 3,
    elevation: 20,
  },
  backgroundImage: {
    resizeMode: "cover",
    justifyContent: "center",
    width: windowWidth,
    height: 150,
  },
  myBeersSorting: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between'

  },
  logoutButton: {
    backgroundColor: '#ffffff',
    flexDirection: 'row',
    alignSelf: 'center',
    alignItems: 'center',
    marginVertical: 10,
    width: windowWidth * 0.3,
    borderWidth: 2,
    borderColor: '#009688',
    borderRadius: 10,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
    padding: 10,
  },
  userNameText: {
    fontSize: 22,
    color: 'black',
    fontWeight: "bold",
    alignSelf: "center",
    textTransform: "lowercase",
    marginBottom: 10,
  },
  usernameMyBeerAndSorting: {
    flexDirection: 'column',
    alignSelf: 'center',
  },
  myBeersText: {
    fontSize: 18,
    color: 'black',
    fontWeight: "700",
    alignSelf: "center",
    marginBottom: 5,
  },
  searchButtonText: {
    fontWeight: '700',
    alignSelf: 'center',
    color: 'white'
  },
  beerImage: {
    width: 100,
    height: 120,
    marginTop: 10,
    marginBottom: 10,
    marginLeft: 10,
    resizeMode: 'contain',
    left: 0,
  },
  productNameBold: {
    fontSize: 14,
    marginBottom: 5,
    fontWeight: '500',
    textAlign: 'left',
  },
  productNameThin: {
    fontSize: 14,
    fontWeight: '400',
    textAlign: 'left',
    marginBottom: 5,
  },
  beerInstance: {
    maxWidth: windowWidth * 0.5,
    textAlign: 'left',
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  beerInformation: {
    marginTop: 15,
    paddingBottom: 5,
    flexDirection: 'column',
  },
  attributeStyle: {
      fontSize: 20,
      textAlign: 'left',
    },
  alcohol_percentage: {
    fontSize: 14,
    textAlign: 'left',
  },
  myStarStyle: {
    color: '#009688',
    backgroundColor: 'transparent',
    textShadowColor: '#dadada',
    textShadowOffset: {width: 1, height: 1},
    textShadowRadius: 5,
    fontSize: 35,
  },
  myEmptyStarStyle: {
    color: '#009688',
  },
  ratingStars: {
    alignSelf: "center",
    marginLeft: "10%",
    flexDirection: 'column',
  },
})

export default UserProfile;