import React from 'react';
import {View, Text, FlatList, Image, StyleSheet, TextInput, TouchableOpacity, Button, Dimensions, ImageBackground} from 'react-native';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import Stars from 'react-native-stars';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Ionicons } from '@expo/vector-icons'; 
import { MaterialIcons } from '@expo/vector-icons'; 
import RNPickerSelect from 'react-native-picker-select';

async function getValueFor(key) {
  let result = await SecureStore.getItemAsync(key);
  if (result) {
     return(result);
   } else {
     return(None);
   }
 }

async function deleteValueFor(key) {
  await SecureStore.deleteItemAsync(key);
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
    this._unsubscribe = this.props.navigation.addListener('focus', () => {
      getValueFor("Username").then((username) => {
        this.setState({username: username})
        this.fetchReview(this.state.username, this.state.offset, this.state.orderingValue);
      })
    })
    this._unsubscribe2 = this.props.navigation.addListener('blur', () => {
      this.setState({
        reviews: []
      })
    })
  }

  componentWillUnmount() {
    this._unsubscribe()
    this._unsubscribe2()
  }

  renderBeerImage = (beer_image, resolution, imageStyle) => {
    if (beer_image == null) {
      return( <Image source={{uri: "https://cdn.systembolaget.se/492c4d/contentassets/ef797556881d4e20b334529d96b975a2/placeholder-beer-bottle.png" }} style={imageStyle}/>)
    }
    else {
      return( <Image source={{uri: beer_image + resolution }} style={imageStyle} />)
    }
  }

  _renderListItem(item) {
    return(
      <View style = {styles.viewStyle}>
        <TouchableOpacity onPress={() => this.props.navigation.navigate('IndividualBeer', {beer_ID: item.beer, hasReviewed: true, userRating: item.rating, beerDataFetched: false})}>
          <View style = {styles.reviewDateBar}>
            <Ionicons name="calendar-outline" size={18}></Ionicons>
            <Text style={styles.dateOfReview}>{item.review_date.substring(0, 10)}</Text>
          </View>
            <View style = {styles.beerInstance}>
              {this.renderBeerImage(item.picture_url, '_100.png', styles.beerImage)}
              <View style = {styles.ratingStars}>
                <Text style = {styles.productNameBold}>{item.beer_name}</Text>
                <Stars
                  display= {Number((item.rating).toFixed(1))}
                  fullStar={<Icon name={'star'} style={[styles.myStarStyle]}/>}
                  emptyStar={<Icon name={'star-outline'} style={[styles.myStarStyle, styles.myEmptyStarStyle]}/>}
                  halfStar={<Icon name={'star-half-full'} style={[styles.myStarStyle]}/>}/>
              </View>
            </View>
        </TouchableOpacity>
      </View>
      )
  }

  renderListHeader = () => {
    return (
    <View>
      <View style = {styles.userNameAndLogout}>
      {/* <ImageBackground source={require('../images/blurry.jpg')} style={styles.backgroundImage} blurRadius={10} opacity={0.6}> */}
        <TouchableOpacity style = {styles.logoutIcon}
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
          {/* <Text style = {styles.logoutText}>Logga ut</Text> */}
          <Ionicons name="log-out-outline" size={30}/>
        </TouchableOpacity>
        <View style={styles.userNameAndIcon}>
          <MaterialIcons name="person-outline" size={26} color={'#009688'} />
          <Text style={styles.userNameText}>{this.state.username}</Text>
        </View> 
      </View>
      <View>
        <View style={ Platform.OS === 'ios'
              ? pickerSelectStyles.inputIOS
              : pickerSelectStyles.inputAndroid, 
              { flexDirection:"row", 
                justifyContent:"space-evenly",
              }}> 
            <View style = {styles.usernameMyBeerAndSorting}>
              <View style = {styles.myBeersSorting}>
                <Text style={styles.myBeersText}>Mina recensioner:</Text>
                <RNPickerSelect style={pickerSelectStyles}
                  useNativeAndroidPickerStyle={false}
                  placeholder={{
                  label: 'Sortera datum (nyast först)',
                  value: '-review_date',
                  inputLabel: 'Datum (nyast först)',
                  }}
                  onValueChange={(value) => this.setState({
                    orderingValue: value},
                    this.handleFilterAction)}
                  items={[
                    { label: 'Sortera datum (äldst först)', value: 'review_date', inputLabel: 'Datum (äldst först)' },
                    { label: 'Sortera på rating (fallande)', value: '-rating', inputLabel: 'Rating (fallande)' },
                    { label: 'Sortera på rating (stigande)', value: 'rating', inputLabel: 'Rating (stigande)' },
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
    color: '#000000',
    alignSelf: 'center',
  },
  inputAndroid: {
    fontSize: 16,
    paddingVertical: 5,
    paddingHorizontal: 30,
    borderWidth: 2,
    borderColor: '#009688',
    borderRadius: 10,
    color: '#000000',
  },
});

const styles = StyleSheet.create({

  viewStyle: {
    marginTop: 15,
    width: 350,
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
  userNameAndIcon: {
    flexDirection:"row", 
    alignSelf:'center',
    paddingTop: 10,
    paddingRight: 10,
  },
  userNameAndLogout: {
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    width: windowWidth * 0.9,
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
  logoutIcon: {
    backgroundColor: '#ffffff',
    flexDirection: 'row',
    marginVertical: 10,
    padding: 10,
    // borderWidth: 2,
    // borderColor: '#009688',
    borderRadius: 10,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
    padding: 2,
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
  },
  productNameBold: {
    fontSize: 14,
    marginTop: 10,
    marginBottom: 5,
    fontWeight: '500',
    textAlign: 'left',
  },
  reviewDateBar: {
    flexDirection: 'row',
    alignSelf: 'center',
    position: 'absolute',
    alignItems: 'baseline',
    marginTop: 20,
    paddingBottom: 20,
    fontSize: 14,
    color: 'black',
  },
  dateOfReview: {
    paddingLeft: 5,
  },
  beerInstance: {
    maxWidth: windowWidth * 0.5,
    marginTop: 10,
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
    marginLeft: "6%",
    flexDirection: 'column',
    justifyContent: 'flex-start',
  },
})

export default UserProfile;