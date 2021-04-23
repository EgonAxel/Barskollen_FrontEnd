import React, { useState } from 'react';
import {View, Text, FlatList, Image, StyleSheet, TextInput, TouchableOpacity, SafeAreaView, Dimensions, Animated} from 'react-native';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import Stars from 'react-native-stars';
import { Ionicons } from '@expo/vector-icons'; 
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
      beerType: "",
      toggleSearchMargin: 120,
      error: null,
    };
  }
  
  handleSearchText = (text) => {
      this.setState({searchText: text})    
          //----För att söka medans man skriver
      this.handleFilterAction(text)
      
  }
  handleFilterAction = (text) => {
    console.log(text)
    this.setState({
      offset: 0,
      beers: []})
    if (typeof text != "undefined") {
      this.fetchBeer(0, text, this.state.orderingValue, this.state.beerType)
    }
    else {
      this.fetchBeer(0, "", this.state.orderingValue, this.state.beerType)
    }

}
  fetchBeer = (offset, searchText, orderingValue, beerType) => {
    getValueFor("Token").then((token) => {
      axios
      .get(`http://192.168.56.1:80/beer/?limit=20&offset=${offset}&search=${searchText.replace(' ','& ')}&ordering=${orderingValue}&beer_type=${beerType}`, {headers: { 'Authorization': `Token ` + token}}) //Här behävs din egen adress till APIn
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
          this.fetchBeer(this.state.offset, this.state.searchText, this.state.orderingValue, this.state.beerType);
        },
      );
    };
  }
  componentDidMount() {
    this.fetchBeer(this.state.offset, this.state.searchText, this.state.orderingValue, this.state.beerType);
  }
  _renderListItem(item) {
    return(
      // Bortkommenderad från <Card>: pointerEvents="none">
      <View style = {styles.beerItem}>
          <TouchableOpacity onPress={() => this.props.navigation.navigate('IndividualBeer', {beer_ID: item.beer_ID, beer_name:item.name, beer_pic: item.picture_url, beer_type: item.beer_type, beer_percentage: item.alcohol_percentage, beer_volume:item.volume, beer_container_type:item.container_type, beer_bitterness:item.bitterness, beer_sweetness: item.sweetness, beer_fullness:item.fullness, beer_avgrating:item.avg_rating})}>
              <View style = {styles.beerInstance}>
                <Image style = {styles.beerImage} source = {{uri: item.picture_url + '_100.png' }}/>
                  <View style = {styles.beerInformation}>
                    <Text style = {styles.productNameBold}>{item.name}</Text>
                    <Text style = {styles.productNameThin}>{item.beer_type}</Text>
                    <Text style = {styles.alcohol_percentage}>{item.alcohol_percentage + '% vol'}{'\n'}</Text>
                    <Stars
                      display= {Number((item.avg_rating).toFixed(1))}
                      half={true}
                      fullStar={<Icon name={'star'} style={[styles.myStarStyle]}/>}
                      emptyStar={<Icon name={'star-outline'} style={[styles.myStarStyle, styles.myEmptyStarStyle]}/>}
                      halfStar={<Icon name={'star-half-full'} style={[styles.myStarStyle]}/>}
                    />
                  </View>
              </View> 
              {/* <View style = {styles.ratingStars}> */}
              
              {/* </View> */}
          </TouchableOpacity>
      </View>
      )
  }

  renderListHeader = () => {
    const [shouldShowSearchArea, setShouldShow] = useState(true);
    return (
      <SafeAreaView style={styles.safeAreaView}>
        {/* <View style={styles.toggleSearch}>
          <TouchableOpacity onPress={() => setShouldShow(!shouldShowSearchArea) }>
            <Ionicons style={styles.searchIcon}
              name="md-search"
            />
          </TouchableOpacity>
          <Text onPress={() => setShouldShow(!shouldShowSearchArea)}
                style={styles.searchIconText}>
                Hitta din favoritbärs
          </Text>
        </View> */}
        {/* {shouldShowSearchArea ? ( */}
          <View style={styles.filterAndSearchArea}>
            <View style={styles.searchBarRow}>
              <TextInput style = {styles.searchField}
                clearButtonMode = 'always'
                underlineColorAndroid = "transparent"
                placeholder = "Sök efter bärs..."
                placeholderTextColor = "grey"
                //autoCapitalize = "words"

                returnKeyType="search"
                onChangeText={this.handleSearchText}
               // onSubmitEditing={this.handleFilterAction}
                />
              {/* <TouchableOpacity
                style = {styles.searchButton}
                onPress = { () => {
                  this.handleFilterAction()
                }}>
                <Text> <Ionicons style={styles.searchIcon} name="md-search" /> </Text> 
              </TouchableOpacity> */}
            </View>
            <View style={ Platform.OS === 'ios'
                  ? pickerSelectStyles.inputIOS
                  : pickerSelectStyles.inputAndroid, 
                  { flexDirection:"row", 
                    justifyContent:"space-between",
                  }}>  
              <RNPickerSelect style={pickerSelectStyles}
                  useNativeAndroidPickerStyle={false}
                  placeholder={{
                  label: 'Ölsort',
                  value: "",
                  }}
                  onValueChange={(value) => this.setState({
                    beerType: value},
                    this.handleFilterAction)}
                  items={[
                    { label: 'Ljus lager', value: 'Ljus lager', inputLabel: 'Ljus lager' },
                    { label: 'Ale', value: 'Ale', inputLabel: 'Ale' },
                    { label: 'Porter & Stout', value: 'Porter+%26+Stout', inputLabel: 'Porter & Stout' },
                    { label: 'Veteöl', value: 'Veteöl', inputLabel: 'Veteöl' },
                    { label: "Mellanmörk & Mörk lager", value: "Mellanm%C3%B6rk+%26+M%C3%B6rk+lager", inputLabel: "Mellanmörk & Mörk lager" },
                    { label: 'Syrlig öl', value: 'Syrlig öl', inputLabel: 'Syrlig öl' },
                    { label: 'Annan öl', value: 'Annan öl', inputLabel: 'Annan öl' },
                  ]}
                />
                <RNPickerSelect style={pickerSelectStyles}
                  useNativeAndroidPickerStyle={false}
                  placeholder={{
                  label: 'Sortering',
                  value: "",
                  }}
                  onValueChange={(value) => this.setState({
                    orderingValue: value},
                    this.handleFilterAction)}
                  items={[
                    { label: 'Sortera på rating (stigande)', value: 'rating', inputLabel: 'Rating (stigande)' },
                    { label: 'Sortera på rating (fallande)', value: '-rating', inputLabel: 'Rating (fallande)' },
                    { label: 'Sortera alfabetiskt (a-ö)', value: 'name', inputLabel: 'Alfabetiskt (a-ö)' },
                    { label: 'Sortera alfabetiskt (ö-a)', value: '-name', inputLabel: 'Alfabetiskt (ö-a)' },
                  ]}
                />
            </View>
          </View>
         {/* ) : null} */}
      </SafeAreaView>
    )}

  render() {

    const scrollY = new Animated.Value(0)
    const diffClamp = Animated.diffClamp(scrollY, 0, 100) 

    const translateY = diffClamp.interpolate({
         inputRange:[0,100],
         outputRange:[0,-165],
         extrapolate: 'clamp',
    })

    return (
      <View style={{flex: 1}}>
        <Animated.View  // - Måste ha denna styling här för att komma åt 'translate' varabel.
            style={{
              transform:[
                {translateY:translateY}
              ],
              position:'absolute',
              top: 0,
              left: 0,
              right: 0,
              borderBottomLeftRadius: 15,
              borderBottomRightRadius: 15,
              // elevation: 601, // - Denna elevation ger ingen skugga runt objektet på android
              zIndex: 1,
              backgroundColor: 'white',
                          }}
          > 
           <this.renderListHeader/>
        </Animated.View>

        <FlatList
          style={{flex: 1}}
          contentContainerStyle={{
            backgroundColor: '#ffffff',
            alignItems: 'center',
            justifyContent: 'center',
            marginTop: this.state.toggleSearchMargin,
            zIndex: -10,
            elevation: -10,
          }}
          data={this.state.beers}
          keyExtractor={(beer, index) => String(index)}
          
          renderItem={({ item }) => this._renderListItem(item)}
        
          onEndReached={this.fetchMoreBeers}
          onEndReachedThreshold={2}

          scrollEventThrottle="16"
          onScroll = {(e)=>{
            if (e.nativeEvent.contentOffset.y > 0)
            scrollY.setValue(0.7 * (e.nativeEvent.contentOffset.y));
          }}
        />
      </View>
    );
  }
}

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
const usedBorderRadius = 23;

const pickerSelectStyles = StyleSheet.create({
  inputIOS: { //
    minWidth: windowWidth * 0.22,
    maxWidth: windowWidth * 0.5,
    textAlign: 'center',
    fontSize: 14,
    paddingHorizontal: 17,
    paddingVertical: 10,
    borderWidth: 2,
    borderColor: '#009688',
    borderRadius: usedBorderRadius,
    color: '#009688',
  },
  inputAndroid: {
    minWidth: windowWidth * 0.22,
    maxWidth: windowWidth * 0.4,
    textAlign: 'center',
    fontSize: 14,
    paddingHorizontal: 17,
    paddingVertical: 10,
    borderWidth: 2,
    borderColor: '#009688',
    borderRadius: usedBorderRadius,
    color: 'black',
  },
});

const styles = StyleSheet.create({
  beerItem: {
    marginTop: 15,
    width: windowWidth * 0.93,
    minHeight: 125,
    maxHeight: 150,
    backgroundColor: '#ffffff',
    borderRadius: 15,
    borderStyle: 'solid', 
    borderColor: '#dadada',
    borderWidth: 0.5,
    shadowColor: "#000000",
    shadowOffset: {
      width: 3,
      height: 3
    },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  safeAreaView: {
    alignSelf: 'center',
  },

  searchIcon: {
    fontSize: 20,
    alignSelf: 'center',
    color: '#009688',
    padding: 10,
  },

  searchBarRow: {
    marginTop: 15,
    marginBottom: 5,
    flexDirection:"row",
  },
  searchField: {
    // fontFamily: 'Avenir',
    paddingHorizontal: 20,
    marginBottom: 5,
    marginRight: 5,
    width: windowWidth * 0.75,
    borderColor: '#009688',
    borderWidth: 2,
    borderRadius: usedBorderRadius,
    backgroundColor: 'white'
  },
  searchButton: {
    // fontFamily: 'Avenir',
    // backgroundColor: '#009688',
    borderWidth: 2,
    borderColor: '#009688',
    padding: 10,
    marginBottom: 5,
    borderRadius: usedBorderRadius,
    justifyContent: 'center',
  },
  filterAndSearchArea: {
    paddingBottom: 15,
    borderRadius: usedBorderRadius,
    alignSelf: 'center',
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
    alignItems: 'flex-start',
    left: 20,
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
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 5,
    fontSize: 25,
  },
  myEmptyStarStyle: {
    color: '#009688',
  },

})

export default Beers;