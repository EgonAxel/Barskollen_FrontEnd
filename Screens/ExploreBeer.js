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


class Beers extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      beers: [],
      offset: 0,  //Bestämmer vilken sida från vår api vi laddar in.
      searchText: "",
      orderingValue: "",
      error: null,
    };
  }
  handleSearchText = (text) => {
    this.setState({searchText: text})         //----För att söka medans man skriver
    this.handleFilterAction(text)          
  }
  handleFilterAction = (text) => {
    this.setState({
      offset: 0,
      beers: []})
    this.fetchBeer(0, text, this.state.orderingValue)
  }
  fetchBeer = (offset, searchText, orderingValue) => {
    getValueFor("Token").then((token) => {
      axios
      .get(`http://192.168.56.1:80/beer/?limit=20&offset=${offset}&search=${searchText}&ordering=${orderingValue}`, {headers: { 'Authorization': `Token ` + token}}) //Här behävs din egen adress till APIn
      .then(response => {
        this.setState({
          beers: this.state.beers.concat(response.data.results),
        });
      })
      .catch(error => {
        this.setState({error: error.message});
      });
    })
  }
  fetchMoreBeers = () => {
    if (this.state.beers.length >= 20) {
      this.setState(
        prevState => ({
          offset: prevState.offset + 20,
        }),
        () => {
          this.fetchBeer(this.state.offset, this.state.searchText, this.state.orderingValue);
        },
      );
    };
  }
  componentDidMount() {
    this.fetchBeer(this.state.offset, this.state.searchText, this.state.orderingValue);
  }
  _renderListItem(item) {
    return(
      // Bortkommenderad från <Card>: pointerEvents="none">
      <View style = {styles.viewStyle}>
        {/* <Card style = {styles.cardStyle}> */}
          <TouchableOpacity onPress={() => this.props.navigation.navigate('IndividualBeer', {beer_ID: item.beer_ID, beer_name:item.name, beer_pic: item.picture_url, beer_percentage: item.alcohol_percentage, beer_volume:item.volume, beer_container_type:item.container_type, beer_bitterness:item.bitterness, beer_sweetness: item.sweetness, beer_fullness:item.fullness, beer_avgrating:item.avg_rating})}>
              <View style = {styles.beerInstance}>
                <Image style = {styles.beerImage} source = {{uri: item.picture_url + '_100.png' }}/>
                  <View style = {styles.beerInformation}>
                    <Text style = {styles.productNameBold}>{item.name}</Text>
                    <Text style = {styles.productNameThin}>{item.beer_type}</Text>
                    {/* <Text style = {styles.attributeStyle}>{item.container_type}{'\n'}</Text> */}
                    {/* <Text style = {styles.attributeStyle}>{item.volume + ' ml'}{'\n'}</Text> */}
                    <Text style = {styles.alcohol_percentage}>{item.alcohol_percentage + '% vol'}{'\n'}</Text>
                  </View>
              </View> 
              <View style = {styles.ratingStars}>
              <Stars
                  display= {Number((item.avg_rating).toFixed(1))}
                  half={true}
                  fullStar={<Icon name={'star'} style={[styles.myStarStyle]}/>}
                  emptyStar={<Icon name={'star-outline'} style={[styles.myStarStyle, styles.myEmptyStarStyle]}/>}
                  halfStar={<Icon name={'star-half-full'} style={[styles.myStarStyle]}/>}
              />
              </View>
          </TouchableOpacity>
        {/* </Card> */}
      </View>
      )
  }

  renderListHeader = () => {
    return (
      <View style={{height: 100}}>
        <View style={{width: "100%", flexDirection:"row"}}>
          <TextInput style = {styles.textInputFields}
            underlineColorAndroid = "transparent"
            placeholder = "Sök efter en öl..."
            placeholderTextColor = "grey"
            autoCapitalize = "none"
            returnKeyType="search"
            onChangeText={this.handleSearchText}
            onSubmitEditing={this.handleFilterAction}/>
          <TouchableOpacity
            style = {styles.searchButton}
            onPress = { () => {
              this.handleFilterAction()
            }}>
            <Text style = {styles.searchButtonText}> Sök </Text>
          </TouchableOpacity>
        </View>
        <View style={ Platform.OS === 'ios'
              ? pickerSelectStyles.inputIOS
              : pickerSelectStyles.inputAndroid, 
              { flexDirection:"row", 
                justifyContent:"space-evenly",
              }}>  
          <RNPickerSelect style={pickerSelectStyles}
              useNativeAndroidPickerStyle={false}
              placeholder={{
              label: 'Filtrering',
              value: null,
              }}
              onValueChange={(value) => {console.log(value)}}
              // this.setState({offset: 0})
              // this.fetchBeer(this.state.offset)
              items={[
                { label: 'Filtrera på öltyp', value: 'type', inputLabel: '' },
                { label: 'Filtrera på volym', value: 'volume', inputLabel: '' },
                { label: 'Filtrera på volymprocent', value: 'percentage', inputLabel: '' },
              ]}
            />
            <RNPickerSelect style={pickerSelectStyles}
              useNativeAndroidPickerStyle={false}
              placeholder={{
              label: 'Sortering',
              value: null,
              }}
              onValueChange={(value) => this.setState({orderingValue: value})}
              // this.setState({offset: 0})
              // this.fetchBeer(this.state.offset)
              items={[
                { label: 'Sortera på rating (stigande)', value: 'rating', inputLabel: 'Rating (stigande)' },
                { label: 'Sortera på rating (fallande)', value: '-rating', inputLabel: 'Rating (fallande)' },
                { label: 'Sortera alfabetiskt (a-ö)', value: 'name', inputLabel: 'Alfabetiskt (a-ö)' },
                { label: 'Sortera alfabetiskt (ö-a)', value: '-name', inputLabel: 'Alfabetiskt (ö-a)' },
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
          data={this.state.beers}
          keyExtractor={(beer, index) => String(index)}
          
          renderItem={({ item }) => this._renderListItem(item)}
          //horizontal={true}
        
          onEndReached={this.fetchMoreBeers}
          onEndReachedThreshold={2}
          ListHeaderComponent={this.renderListHeader}/>
      </View>
    );

  }
  
}
const pickerSelectStyles = StyleSheet.create({
  inputIOS: { //
    fontSize: 14,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderWidth: 2,
    borderColor: '#009688',
    borderRadius: 10,
    color: 'black',
    // paddingRight: 30, // to ensure the text is never behind the icon
  },
  inputAndroid: {
    fontSize: 14,
    //paddingHorizontal: 10,
    //paddingVertical: 8,
    borderWidth: 0.5,
    //borderColor: 'purple',
    borderRadius: 8,
    color: 'black',
    paddingRight: 30, // to ensure the text is never behind the icon
  },
});

const styles = StyleSheet.create({

    viewStyle: {
      marginTop: 15,
      width: 350,
      height: 125,
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
        height: 100,
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
      fontSize: 25,
      left: 5
    },
    myEmptyStarStyle: {
      color: '#009688',
    },
    ratingStars: {
      marginTop: -40,
      marginLeft: 15,
    },
})

export default Beers;