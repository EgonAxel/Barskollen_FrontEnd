import React from 'react';
import { View, Text, Image, FlatList, StyleSheet,TouchableOpacity,
         TextInput, Dimensions, Modal, Alert, Pressable, KeyboardAvoidingView } from 'react-native';
import Stars from 'react-native-stars';
import axios from 'axios';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import * as SecureStore from 'expo-secure-store';

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
        stars: 0,
        beer_ID: this.props.route.params.beer_ID,
        beer_pic: this.props.route.params.beer_pic,
        beer_name: this.props.route.params.beer_name,
        beer_type: this.props.route.params.beer_type,
        beer_bitterness: this.props.route.params.beer_bitterness,
        beer_fullness: this.props.route.params.beer_fullness,
        beer_sweetness: this.props.route.params.beer_sweetness,
        modalVisible: this.props.route.params.modalVisible,
        error: null,
        recommendations: [],
        review: "",
    };
  }
  reviewText = (text) => {
    this.setState({ review: text })
    }
  
  postRatingComment(beer_ID, beer_name, starValue, review) {
    getValueFor("Username").then((username) => {
      getValueFor("Token").then((token) => {
      if (review == "") { 
        axios
          .post(`http://127.0.0.1:8000/review/?beer=${this.state.beer_ID}`, { beer:beer_ID, user:username, beer_name: beer_name, rating: starValue, headers: { 'Authorization': `Token ` + token}}) //Här behövs din egen adress till APIn
          .catch(error => {
          console.log(error.message);
          });
        }
        else {
          axios
            .post(`http://127.0.0.1:8000/review/?beer=${this.state.beer_ID}`, { beer:beer_ID, user:username, beer_name: beer_name, rating: starValue, review_text: review, headers: { 'Authorization': `Token ` + token}}) //Här behövs din egen adress till APIn
            .catch(error => {
              console.log(error.message);
          });
        }
      });
    });
  }

  getRecommendations(beer_ID, starValue, beer_type, beer_bitterness, beer_fullness, beer_sweetness) {
    const beer_type_encoded = encodeURIComponent(beer_type)
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

  componentDidMount() {
    // this.postRatingComment(this.state.beer_ID, this.state.beer_name, this.state.rating, this.state.review)
    // this.getRecommendations(this.state.rating, this.state.beer_type, this.state.beer_bitterness, this.state.beer_fullness, this.state.beer_sweetness)
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
        <View style = {styles.beerItem}>
          <TouchableOpacity onPress={() => { this.props.navigation.replace('IndividualBeer', {beer_ID: item.beer_ID, beer_name:item.name, beer_pic: item.picture_url, beer_type: item.beer_type, beer_percentage: item.alcohol_percentage, beer_volume:item.volume, beer_container_type:item.container_type, beer_bitterness:item.bitterness, beer_sweetness: item.sweetness, beer_fullness:item.fullness, beer_avgrating:item.avg_rating})}}>
              <View style = {styles.beerInstance}>
                {this.renderBeerImage(item.picture_url, '_100.png', styles.beerImageRecommendation)}
                  <View style = {styles.beerInformation}>
                    <Text style = {styles.productNameRecommendation}>{item.name}</Text>
                    <Text style = {styles.productTypeRecommendation}>{item.beer_type}</Text>
                    <Text style = {styles.alcohol_percentage}>{item.alcohol_percentage + '% vol'}{'\n'}</Text>
                    <Stars
                      display= {Number((item.avg_rating))}
                      half={true}
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

  render() {
    const { modalVisible } = this.state;
    return (
    <View>
      <View style={styles.wholePage}>  
        <KeyboardAvoidingView 
          behavior="position"
          style={{ flex: 1 }}
          >  
        <View style = {styles.viewStyle}>
          <Text style = {styles.productName}>
            {this.state.beer_name}
          </Text>
          {this.renderBeerImage(this.state.beer_pic, '_200.png', styles.beerImage)}
            <View style={styles.ratingStars}>
              <Stars
                update={(val)=>{this.setState({stars: val})}}
                half={true}
                display= {Number((this.state.stars).toFixed(1))}
                fullStar={<Icon name={'star'} style={[styles.myStarStyle]}/>}
                emptyStar={<Icon name={'star-outline'} style={[styles.myStarStyle, styles.myEmptyStarStyle]}/>}
                halfStar={<Icon name={'star-half-full'} style={[styles.myStarStyle]}/>}
                />
            </View>
            <TextInput style = {styles.textInputFields}
              clearButtonMode = 'always'
              underlineColorAndroid = "transparent"
              placeholder = "Vad tyckte du om ölen?"
              placeholderTextColor = "grey"
              returnKeyType="go"
              onChangeText = {this.reviewText}
              onSubmitEditing={() => { this.postRatingComment(this.state.beer_ID, this.state.beer_name, this.state.stars, this.state.review) }}
              blurOnSubmit={false}
              multiline={true}
            />
            <TouchableOpacity 
              onPress={() => {
                if (this.state.stars > 0) {
                  this.postRatingComment(this.state.beer_ID, this.state.beer_name, this.state.stars, this.state.review),
                  this.getRecommendations(this.state.beer_ID, this.state.stars, this.state.beer_type, this.state.beer_bitterness, this.state.beer_fullness, this.state.beer_sweetness),
                  this.setModalVisible(true)
                }
                else {
                  Alert.alert("Noll stjärnor?", "Så dåliga öl finns det inte. Kör en halv i alla fall!")
                }}}>
                <Text style={styles.sendReview}>Skicka review</Text>
            </TouchableOpacity>
          </View>
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
          <Text style = {styles.recommendationText}>Här är några öl du kanske gillar {"\n"} baserat på ditt betyg.</Text>
          <FlatList
            style={{flex: 1}}
            contentContainerStyle={{
              backgroundColor: '#ffffff',
              alignItems: 'center',
              justifyContent: 'center',
              marginTop: 15 }}
              data={this.state.recommendations}
              keyExtractor={(beer, index) => String(index)}
              renderItem={({ item }) => this._renderListItem(item)}/>
          <TouchableOpacity onPress={() => this.props.navigation.navigate('IndividualBeer', {beer_ID: this.state.beer_ID, beer_name: this.state.name, beer_pic: this.state.picture_url, beer_type: this.state.beer_type, beer_percentage: this.state.alcohol_percentage, beer_volume: this.state.volume, beer_container_type: this.state.container_type, beer_bitterness: this.state.bitterness, beer_sweetness: this.state.sweetness, beer_fullness: this.state.fullness, beer_avgrating: this.state.avg_rating, hasReviewed: true})}>
            <View style={styles.button}>
              <Text style={styles.textStyle}>Stäng</Text>
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
  backgroundColor: '#ffffff',
},
viewStyle: {
  marginTop: 15,
  width: 350,
  minHeight: 500,
  maxHeight: 1000,
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
  borderColor: '#009688',
  borderWidth: 2,
  borderRadius: 10,
  backgroundColor: 'white',
  alignSelf: 'center',
},
sendReview: {
  alignSelf: 'center',
  fontSize: 16,
  fontWeight: '600',
  backgroundColor: '#009688',
  color: '#ffffff',
  overflow: 'hidden',
  paddingHorizontal: 35,
  paddingVertical: 15,
  marginTop: 10,
  marginBottom: 25,
  borderRadius: usedBorderRadius,
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

// ---------- REKOMMENDATIONER ------------  

  beerItem: {
    marginTop: beerItemMarginTop,
    width: windowWidth * 0.93,
    minHeight: 125,
    maxHeight: 175,
    backgroundColor: '#ffffff',
    borderRadius: 15,
    borderStyle: 'solid', 
    borderColor: '#dadada',
    borderWidth: 1,
    shadowColor: "#000000",
    shadowOffset: {
      width: 3,
      height: 3
    },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  recommendationHeader: {
    fontSize: 32,
    fontWeight: '700',
    marginTop: windowHeight * 0.15,
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
    // fontFamily: 'Avenir',
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'left',
  },
  productTypeRecommendation: {
    // fontFamily: 'Avenir',
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
    maxWidth: windowWidth * 0.55,
    marginTop: 15,
    paddingBottom: 5,
    flexDirection: 'column',
    justifyContent: 'flex-start',

    maxWidth: windowWidth * 0.55,
    marginTop: 15,
    paddingBottom: 15,
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
  beerImageRecommendation: {
    width: 100,
    height: 100,
    marginTop: 10,
    marginBottom: 10,
    marginLeft: 10,
    resizeMode: 'contain',
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
    alignItems: 'center',
  },
  button: {
    // backgroundColor: "#009688",
    // fontSize: 16,
    // borderRadius: 20,
    // paddingVertical: 12,
    // marginBottom: windowHeight * 0.05,
    // width: windowWidth * 0.3,
    // elevation: 2,
    alignSelf: 'center',
    fontSize: 16,
    fontWeight: '600',
    backgroundColor: '#009688',
    color: '#ffffff',
    overflow: 'hidden',
    paddingHorizontal: 35,
    paddingVertical: 15,
    marginTop: 10,
    marginBottom: 25,
    borderRadius: usedBorderRadius,
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center"
  },
  })
  
  export default ReviewBeer