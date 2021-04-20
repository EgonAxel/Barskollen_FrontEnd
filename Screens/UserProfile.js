import React from 'react';
import {View, Text, FlatList, Image, StyleSheet, TextInput, TouchableOpacity, SectionList} from 'react-native';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import Stars from 'react-native-stars';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import RNPickerSelect from 'react-native-picker-select';

// Installera dessa: 
// npm i --save axios 
// npm i react-native-elements --save
// npm i --save react-native-vector-icons // required by react-native-elements

// npm install react-native-stars --save  //För stärnor

async function getValueFor(key) {
  let result = await SecureStore.getItemAsync(key);
  if (result) {
     return(result);
   } else {
     return(None);
   }
 }


class UserProfile extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      reviews: [],
      offset: 0,  //Bestämmer vilken sida från vår api vi laddar in.
      orderingValue: "",
      error: null,
    };
  }
  handleFilterAction = () => {
    this.setState({
      offset: 0,
      reviews: []})
    this.fetchReview(0, this.state.orderingValue)
  }
  fetchReview = (offset, orderingValue) => {
    getValueFor("Token").then((token) => {
      getValueFor("Username").then((username) => {
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
          this.fetchReview(this.state.offset, this.state.orderingValue);
        },
      );
    };
  }
  componentDidMount() {
    this.fetchReview(this.state.offset, this.state.orderingValue);
  }
  _renderListItem(item) {
    return(
      // Bortkommenderad från <Card>: pointerEvents="none">
      <View style = {styles.viewStyle}>
        {/* <Card style = {styles.cardStyle}> */}
          <TouchableOpacity onPress={() => this.props.navigation.navigate('IndividualBeer', {beer_ID: item.beer})}>
              <View style = {styles.beerInstance}>
                <Image style = {styles.beerImage} source = {{uri: "https://product-cdn.systembolaget.se/productimages/" + item.beer + "/" + item.beer + '_100.png' }}/>
                <View style = {styles.ratingStars}>
                  <Stars
                      display= {Number((item.rating).toFixed(1))}
                      fullStar={<Icon name={'star'} style={[styles.myStarStyle]}/>}
                      emptyStar={<Icon name={'star-outline'} style={[styles.myStarStyle, styles.myEmptyStarStyle]}/>}
                      halfStar={<Icon name={'star-half-full'} style={[styles.myStarStyle]}/>}
                  />
                </View>
              </View>
          </TouchableOpacity>
        {/* </Card> */}
      </View>
      )
  }

  renderListHeader = () => {
    return (
      <View style={{height: 100}}>
        <View style={{flexDirection:"row", justifyContent:"space-evenly"}} 
        style={
              Platform.OS === 'ios'
                ? pickerSelectStyles.inputIOS
                : pickerSelectStyles.inputAndroid
            }>  
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
                { label: 'Sortera på rating (stigande)', value: 'rating', inputLabel: '' },
                { label: 'Sortera på rating (fallande)', value: '-rating', inputLabel: '' },
                { label: 'Sortera datum (nyast först)', value: '-review_date', inputLabel: '' },
                { label: 'Sortera datum (äldst först)', value: 'review_date', inputLabel: '' },
              ]}
            />
        </View>
      </View>
    )}

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
const styles = StyleSheet.create({

    viewStyle: {
      marginTop: 15,
      width: 350,
      height: 200,
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

    textInputFields: {
      // fontFamily: 'Avenir',
      padding: 10,
      marginTop: 10,
      marginBottom: 5,
      marginRight: 5,
      height: 40,
      width: "70%",
      borderColor: '#009688',
      borderWidth: 2,
      borderRadius: 10,
      backgroundColor: 'white'
    },
    searchButton: {
      // fontFamily: 'Avenir',
       backgroundColor: '#009688',
       padding: 10,
       marginTop: 10,
       marginBottom: 5,
       height: 40,
       borderRadius: 10,
    },
    searchButtonText: {
      // fontFamily: 'Avenir',
       fontWeight: '700',
       alignSelf: 'center',
       color: 'white'
    },
    beerImage: {
        width: 100,
        height: 170,
        marginTop: 10,
        marginBottom: 10,
        marginLeft: 10,
        resizeMode: 'contain',
        left: 0,
    },

    productNameBold: {
     // fontFamily: 'Avenir',
      fontSize: 14,
      fontWeight: '500',
      textAlign: 'left',
    },

    productNameThin: {
     // fontFamily: 'Avenir',
      fontSize: 14,
      fontWeight: '400',
      textAlign: 'left',
      marginBottom: 5,
    },

    beerInstance: {
      textAlign: 'left',
      flexDirection: 'row',
      maxWidth: 265,
    },

    beerInformation: {
      marginTop: 15,
      paddingBottom: 5,
      flexDirection: 'column',
      left: 15,
    },

    attributeStyle: {
        fontSize: 20,
        textAlign: 'left',
      },

    alcohol_percentage: {
     // fontFamily: 'Avenir',
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
      left: 5
    },
    myEmptyStarStyle: {
      color: '#009688',
    },
    ratingStars: {
      alignSelf: "center",
      marginLeft: "10%",
    },
})

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 4,
    color: 'black',
    paddingRight: 30, // to ensure the text is never behind the icon
  },
  inputAndroid: {
    fontSize: 16,
    //paddingHorizontal: 10,
    //paddingVertical: 8,
    borderWidth: 0.5,
    //borderColor: 'purple',
    borderRadius: 8,
    color: 'black',
    paddingRight: 30, // to ensure the text is never behind the icon
  },
});

export default UserProfile;