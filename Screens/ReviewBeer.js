import React from 'react';
import { View, Text, Image, FlatList, StyleSheet,TouchableOpacity,
         TextInput, Dimensions, Modal, Alert, KeyboardAvoidingView } from 'react-native';
import axios from 'axios';
import { Rating } from 'react-native-ratings';
import * as SecureStore from 'expo-secure-store';

const primaryColor = '#f89c11';
const colorOnCard = "#ffffff";
const colorBehindCard = "#feeed8";

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

async function getValueFor(key) {
  let result = await SecureStore.getItemAsync(key);
  if (result) {
     return(result);
   } else {
     return(None);
   }
 }

class ReviewBeer extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
        ratingValue: 0,
        beer: this.props.route.params.beer,
        modalVisible: this.props.route.params.modalVisible,
        error: null,
        recommendations: [],
        review: "",
    };
  }

  handleRating = (rating) => {
    this.setState({ ratingValue: rating })
  }

  reviewText = (text) => {
    this.setState({ review: text })
  }
  
  postReview(beer_ID, starValue, review) {
    getValueFor("Username").then((username) => {
      getValueFor("Token").then((token) => {
        if (review == "") {
          axios.post(`http://127.0.0.1:8000/review/`, { beer: beer_ID, user: username, rating: starValue }, { headers: { Authorization: 'Token ' + token }})
          .catch(error => {
            console.log(error.message);
          });
        }
        else {
          axios.post(`http://127.0.0.1:8000/review/`, { beer: beer_ID, user: username, rating: starValue, review_text: review }, { headers: { Authorization: 'Token ' + token }})
          .catch(error => {
            console.log(error.message);
          });
        }
      });
    });
  }

  getRecommendations(beer_ID, starValue, beer_type, beer_bitterness, beer_fullness, beer_sweetness) {
    var beer_type_encoded = encodeURIComponent(beer_type)
    if (beer_type_encoded == "null") {
      var beer_type_encoded = ""
    }
    getValueFor("Token").then((token) => {
      const interval = 6 - starValue
      axios
        .get(`http://127.0.0.1:8000/beer/?beer_type=${beer_type_encoded}&min_bitterness=${beer_bitterness - interval}&max_bitterness=${beer_bitterness + interval}&min_fullness=${beer_fullness - interval}&max_fullness=${beer_fullness + interval}&min_sweetness=${beer_sweetness - interval}&max_sweetness=${beer_sweetness + interval}&beer_ID_exclude=${beer_ID}&ordering=-rating&limit=3`, { headers: { 'Authorization': `Token ` + token}}) //Här behövs din egen adress till APIn
        .then(response => {
          this.setState({
            recommendations: response.data.results,
          });
        })
        .catch(error => {
        this.setState({error: error.message});
        });
      });
  }

  setModalVisible = (visible) => {
    this.setState({ modalVisible: visible });
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
        <View style = {styles.modalStyleRecommendation}>
          <TouchableOpacity onPress={() => { this.props.navigation.replace('IndividualBeer', {beer_ID: item.beer_ID, beer: item, beerDataFetched: true, hasReviewed: null})}}>
            <View style = {styles.beerInstance}>
              {this.renderBeerImage(item.picture_url, '_100.png', styles.beerImageRecommendation)}
              <View style = {styles.beerInformation}>
                <Text style = {styles.productNameRecommendation}>{item.name}  </Text>
                <Text style = {styles.productTypeRecommendation}>{item.beer_type}</Text>
                {/* <Text style = {styles.alcohol_percentage}>{item.alcohol_percentage + '% vol'}{'\n'}</Text> */}
                <Rating
                  type='custom'
                  readonly={true}
                  startingValue={item.avg_rating}
                  style={styles.ratingStyleRecommendation}
                  imageSize={20}
                  ratingColor={primaryColor}
                  ratingBackgroundColor='#dadada'
                  tintColor={colorOnCard}
                />
              </View>
            </View>
          </TouchableOpacity>
         </View>        
      )
  }

  render() {
    const { modalVisible } = this.state;
    return (
    <View>
      <View style={styles.wholePage}>  
        <KeyboardAvoidingView behavior="position" keyboardVerticalOffset = {100} style={styles.viewStyle}>  
          <Text style = {styles.productName}>
            {this.state.beer.name}
          </Text>
          {this.renderBeerImage(this.state.beer.picture_url, '_200.png', styles.beerImage)}
          <View style={styles.ratingStars}>
            <Rating
              type='custom'
              startingValue={0}
              style={styles.ratingStyle}
              imageSize={35}
              ratingColor={primaryColor}
              ratingBackgroundColor='#dadada'
              tintColor={colorOnCard}
              onFinishRating={this.handleRating}
            />
          </View>
          <TextInput style = {styles.textInputFields}
            clearButtonMode = 'always'
            underlineColorAndroid = "transparent"
            placeholder = "Vad tyckte du om ölen?"
            placeholderTextColor = "grey"
            returnKeyType="go"
            onChangeText = {this.reviewText}
            blurOnSubmit={true}
            multiline={true}
          />
          <TouchableOpacity 
            onPress={() => {
              if (this.state.ratingValue > 0) {
                this.postReview(this.state.beer.beer_ID, this.state.ratingValue, this.state.review),
                this.getRecommendations(this.state.beer.beer_ID, this.state.ratingValue, this.state.beer.beer_type, this.state.beer.bitterness, this.state.beer.fullness, this.state.beer.sweetness),
                this.setModalVisible(true)
              }
              else {
                Alert.alert("Noll stjärnor?", "Så dåliga öl finns det inte. Kör en halv i alla fall!")
              }}}>
              <Text style={styles.sendReview}>Skicka review</Text>
          </TouchableOpacity>
        </KeyboardAvoidingView>
      </View>
      <View>
        <Modal 
          visible={modalVisible}
          animationType="slide"
          useNativeDriver={true} 
          onRequestClose={() => {
            this.setModalVisible(!modalVisible);}}>
          <Text style = {styles.recommendationHeader}>Tack för din rating!</Text>
          <Text style = {styles.recommendationText}>Här är några öl du kanske gillar {'\n'} baserat på ditt betyg.</Text>
          <FlatList
            style={{flex: 1}}
            contentContainerStyle={{
              backgroundColor: "#ffffff",
              alignItems: 'center',
              justifyContent: 'center',
              marginTop: 15
            }}
            data={this.state.recommendations}
            keyExtractor={(beer, index) => String(index)}
            renderItem={({ item }) => this._renderListItem(item)}
          />
          <TouchableOpacity onPress={() => this.props.navigation.navigate('IndividualBeer', {beer_ID: this.state.beer.beer_ID, beer: this.state.beer, beerDataFetched: false, hasReviewed: null})}>
            <View style={styles.closeButton}>
              <Text style={styles.closeText}>Stäng</Text>
            </View>
          </TouchableOpacity>
        </Modal>    
      </View>
    </View>
    );
  }
}

const usedBorderRadius = 15;
const beerItemMarginTop = 15;
const styles = StyleSheet.create({
  // ÖL SOM RATEAS
  wholePage: {
    height: windowHeight,
    backgroundColor: colorBehindCard,
  },
  viewStyle: {
    marginTop: 15,
    width: 350,
    minHeight: 500,
    maxHeight: 1000,
    backgroundColor: colorOnCard,
    borderRadius: 15,
    borderStyle: 'solid', 
    borderColor: '#dadada',
    borderWidth: 1,
    shadowColor: "#0a0600",
    shadowOffset: {
      width: 1,
      height: 1
    },
    shadowOpacity: 0.5,
    shadowRadius: 3,
    elevation: 20,
    alignSelf: 'center'
  },
  productName: {
    fontSize: 25,
    fontWeight: '700',
    marginTop: 25,
    textAlign: 'center',
    marginBottom: 15
  },
  textInputFields: {
    paddingLeft: 15,
    paddingRight: 15,
    paddingTop: 10,
    paddingBottom: 10,
    marginRight: 40,
    marginTop: 10,
    marginBottom: 5,
    marginLeft: 40,
    height: 75,
    width: windowWidth * 0.7,
    borderColor: primaryColor,
    borderWidth: 2,
    borderRadius: 15,
    backgroundColor: 'white',
    alignSelf: 'center',
  },
  sendReview: {
    alignSelf: 'center',
    fontSize: 16,
    fontWeight: '600',
    backgroundColor: primaryColor,
    color: '#ffffff',
    overflow: 'hidden',
    paddingHorizontal: 35,
    paddingVertical: 15,
    marginTop: 10,
    marginBottom: 25,
    borderRadius: 25,
  },
  beerImage: {
    width: 125,
    height: windowHeight * 0.3,
    marginVertical: 20,
    resizeMode: 'contain',
    alignSelf: 'center'
  },
  rating: {
    fontSize: 25,
    textAlign: 'center',
  },
  ratingStars: {
    alignItems: 'center',
  },

// ---------- REKOMMENDATIONER ------------  
  modalStyleRecommendation: {
    margin: 5,
    width: windowWidth * 0.93,
    backgroundColor: "white",
    borderRadius: 15,
    borderStyle: 'solid', 
    borderColor: '#dadada',
    borderWidth: 1,
    padding: 5,
    shadowColor: "#0a0600",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  recommendationHeader: {
    fontSize: 28,
    fontWeight: '700',
    marginTop: windowHeight * 0.1,
    textAlign: 'center',
  },
  recommendationText: {
    fontSize: 18,
    marginTop: 20,
    paddingBottom: 25,
    fontWeight: '400',
    textAlign: 'center',
  },
  productNameRecommendation: {
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'left',
  },
  productTypeRecommendation: {
    fontSize: 14,
    fontWeight: '400',
    textAlign: 'left',
    marginBottom: 5,
  },
  beerInstance: {
    textAlign: 'left',
    flexDirection: 'row',
  },
  beerInformation: {
    maxWidth : windowWidth * 0.55,
    marginTop: 15,
    paddingBottom: 5,
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  attributeStyle: {
    fontSize: 20,
    textAlign: 'left',
  },
  alcohol_percentage: {
    fontSize: 14,
    textAlign: 'left',
  },
  beerImageRecommendation: {
    width: 100,
    height: 100,
    marginTop: 10,
    marginBottom: 10,
    alignSelf: 'center',
    resizeMode: 'contain',
  },
  ratingStyle: {
    alignSelf: 'center'
  },
  ratingStyleRecommendation: {
    paddingBottom: 10,
    alignSelf: 'flex-start'
  },
  closeButton: {
    width: windowWidth * 0.4,
    alignSelf: 'center',
    fontSize: 16,
    fontWeight: '600',
    backgroundColor: primaryColor,
    color: '#ffffff',
    overflow: 'hidden',
    paddingHorizontal: 35,
    paddingVertical: 15,
    marginTop: 10,
    marginBottom: 50,
    borderRadius: 25,
  },
  closeText: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center"
  },
})
  
  export default ReviewBeer