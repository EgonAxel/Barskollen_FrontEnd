import React from 'react';
import {View, Text, FlatList, Image, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { Rating } from 'react-native-ratings';
import { Ionicons } from '@expo/vector-icons'; 
import { MaterialIcons } from '@expo/vector-icons'; 
import RNPickerSelect from 'react-native-picker-select';

const primaryColor = '#f89c11';
const topSectionBackgroundColor = "#ffffff";
const sortingBackgroundColor = "#fffbf5";
const colorBehindCards = "#fafafa";

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
  }

  componentWillUnmount() {
    this._unsubscribe()
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
              <Rating
                type='custom'
                readonly={true}
                startingValue={item.rating}
                style={styles.reviewStarStyle}
                imageSize={35}
                ratingColor={primaryColor}
                ratingBackgroundColor='#dadada'
                tintColor='white'
              />
            </View>
          </View>
        </TouchableOpacity>
      </View>
    )
  }

  renderListHeader = () => {
    return (
    <View style={styles.topSection}>
      <View style = {styles.userNameAndLogout}>
      <View style={styles.userNameAndIcon}>
        <MaterialIcons name="person" size={26} color={'#7e520f'} />
        <Text style={styles.userNameText}>{this.state.username}</Text>
      </View> 
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
          <Ionicons name="log-out-outline" size={30} color="#ffffff"/>
          <Text style={styles.logoutText}>Logga ut</Text>
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
              <View style = {styles.myBeersSorting}>
                <Text style={styles.myBeersText}>Mina recensioner</Text>
                <RNPickerSelect style={pickerSelectStyles}
                  useNativeAndroidPickerStyle={false}
                  placeholder={{
                  label: '',
                  inputLabel: 'Sortera öl',
                  value: null,
                  }}
                  onValueChange={(value) => this.setState({
                    orderingValue: value},
                    this.handleFilterAction)}
                  items={[
                    { label: 'Sortera datum (nyast först)', value: '-review_date', inputLabel: 'Datum (nyast först)' },
                    { label: 'Sortera datum (äldst först)', value: 'review_date', inputLabel: 'Datum (äldst först)' },
                    { label: 'Sortera på rating (fallande)', value: '-rating', inputLabel: 'Rating (fallande)' },
                    { label: 'Sortera på rating (stigande)', value: 'rating', inputLabel: 'Rating (stigande)' },
                  ]}
                />
            </View>
          </View>
        </View>
      </View>
    </View>
    )
  }

  render() {
    return (
      <View style={{flex: 1}}>
        <FlatList
          style={{flex: 1}}
          contentContainerStyle={{
            backgroundColor: colorBehindCards,
            alignItems: 'center',
            justifyContent: 'center',
          }}
          data={this.state.reviews}
          keyExtractor={(beer, index) => String(index)}
          renderItem={({ item }) => this._renderListItem(item)}
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
    backgroundColor: sortingBackgroundColor,
    fontSize: 16,
    paddingVertical: 7,
    paddingHorizontal: 14,
    borderWidth: 2,
    borderColor: primaryColor,
    borderRadius: 30,
    color: "#0a0600",
    alignSelf: 'center',
  },
  inputAndroid: {
    backgroundColor: sortingBackgroundColor,
    fontSize: 16,
    paddingVertical: 5,
    paddingHorizontal: 30,
    borderWidth: 2,
    borderColor: primaryColor,
    borderRadius: 10,
    color: primaryColor,
  },
});

const styles = StyleSheet.create({

  topSection: {
    backgroundColor: topSectionBackgroundColor, 
    borderWidth: 3,
    borderTopColor: 'transparent',
    borderColor: primaryColor,
    width: windowWidth * 0.93, 
    paddingHorizontal: 10, 
    paddingBottom: 15, 
    paddingTop: 10, 
    borderBottomRightRadius: 25, 
    borderBottomLeftRadius: 25,
  },

  viewStyle: {
    marginTop: 15,
    width: windowWidth * 0.93,
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
    alignSelf: 'center',
    justifyContent: 'space-between', 
    width: windowWidth * 0.8,
  },
  backgroundImage: {
    resizeMode: "cover",
    justifyContent: "center",
    width: windowWidth,
    height: 150,
  },
  myBeersSorting: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  logoutIcon: {
    backgroundColor: primaryColor,
    flexDirection: 'row',
    marginVertical: 10,
    paddingVertical: 3,
    paddingHorizontal: 10,
    borderRadius: 10,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
    paddingTop: 5,
    paddingLeft: 5,
    paddingRight: 3,
    marginBottom: 7,
    color: "#ffffff"
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
    color: '#0a0600',
    fontWeight: "700",
    alignSelf: "center",
    marginBottom: 10,
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
    color: '#000000',
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
  ratingStars: {
    alignSelf: "center",
    marginLeft: "6%",
    flexDirection: 'column',
    justifyContent: 'flex-start',
  },
})

export default UserProfile;