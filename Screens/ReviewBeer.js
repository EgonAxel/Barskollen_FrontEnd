import React from 'react';
import { View, Text, Image, FlatList, StyleSheet,TouchableOpacity, TextInput, Dimensions} from 'react-native';
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
            .post(`http://192.168.10.131:8000/review/?beer=${this.state.beer_ID}`, { beer:beer_ID, user:username, beer_name: beer_name, rating: starValue, headers: { 'Authorization': `Token ` + token}}) //Här behövs din egen adress till APIn
            .catch(error => {
            this.setState({error: error.message});
          });
        }
        else {
          axios
            .post(`http://192.168.10.131:8000/review/?beer=${this.state.beer_ID}`, { beer:beer_ID, user:username, beer_name: beer_name, rating: starValue, review_text: review, headers: { 'Authorization': `Token ` + token}}) //Här behövs din egen adress till APIn
            .catch(error => {
            this.setState({error: error.message});
          });
        }
      });
    });
  }

  getRecommendations(starValue, beer_type, beer_bitterness, beer_fullness, beer_sweetness) {
    const beer_type_encoded = encodeURIComponent(beer_type)
    getValueFor("Token").then((token) => {
      const interval = 6 - starValue
      axios
        .get(`http://192.168.10.131:8000/beer/?beer_type=${beer_type_encoded}&min_bitterness=${beer_bitterness - interval}&max_bitterness=${beer_bitterness + interval}&min_fullness=${beer_fullness - interval}&max_fullness=${beer_fullness + interval}&min_sweetness=${beer_sweetness - interval}&max_sweetness=${beer_sweetness + interval}&ordering=-rating&limit=3`, { headers: { 'Authorization': `Token ` + token}}) //Här behövs din egen adress till APIn
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

  _renderListItem(item) {
    return(
      // Bortkommenderad från <Card>: pointerEvents="none">
      <View style = {styles.viewStyleRecommendation}>
          <TouchableOpacity onPress={() => this.props.navigation.navigate('IndividualBeer', {beer_ID: item.beer_ID, beer_name:item.name, beer_pic: item.picture_url, beer_type: item.beer_type, beer_percentage: item.alcohol_percentage, beer_volume:item.volume, beer_container_type:item.container_type, beer_bitterness:item.bitterness, beer_sweetness: item.sweetness, beer_fullness:item.fullness, beer_avgrating:item.avg_rating})}>
              <View style = {styles.beerInstance}>
                <Image style = {styles.beerImageRecommendation} source = {{uri: item.picture_url + '_100.png' }}/>
                  <View style = {styles.beerInformation}>
                    <Text style = {styles.productNameRecommendation}>{item.name}</Text>
                    <Text style = {styles.productTypeRecommendation}>{item.beer_type}</Text>
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
      </View>
      )
  }
  renderListHeader = () => {
    return (
      <View style={styles.wholePage}>
        <View style = {styles.viewStyle}>
          <Text style = {styles.productName}>
            {this.state.beer_name}
          </Text>
          <Image style={styles.beerImage} source={{uri: this.state.beer_pic + '_100.png' }}/> 
          <View style={styles.ratingStars}>
            <Stars
              update={(val)=>{this.setState({stars: val})}}
              // half={true}
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
              returnKeyType="next"
              onChangeText = {this.reviewText}
              blurOnSubmit={false}
            />
            <TouchableOpacity 
            onPress={() => {
              this.postRatingComment(this.state.beer_ID, this.state.beer_name, this.state.stars, this.state.review),
              this.getRecommendations(this.state.stars, this.state.beer_type, this.state.beer_bitterness, this.state.beer_fullness, this.state.beer_sweetness)}}>
              {/* <Image source={require('../images/beerCap.png')} style={styles.capImage} />  */}
              <Text style={styles.sendReview}>
                Betygssätt
              </Text>
          </TouchableOpacity>

        </View>
      </View>
    )}

  render() {
    return (
      <FlatList
        style={{flex: 1}}
        contentContainerStyle={{
          backgroundColor: '#ffffff',
          alignItems: 'center',
          justifyContent: 'center',
          // marginTop: 15,
        }}
      
        data={this.state.recommendations}
       
        keyExtractor={(beer, index) => String(index)}
        renderItem={({ item }) => this._renderListItem(item)}
        ListHeaderComponent={this.renderListHeader()}
        //horizontal={true}
         />
         
      );
    }
  }
  
  const styles = StyleSheet.create({
  
    // ÖL SOM RATEAS
wholePage: {
  height: windowHeight,
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
    marginRight: 40,
    marginTop: 10,
    marginBottom: 5,
    marginLeft: 40,
    height: 40,
    width: windowWidth * 0.7,
    borderColor: '#009688',
    borderWidth: 2,
    borderRadius: 10,
    backgroundColor: 'white',
    alignSelf: 'center',
},
sendReview: {
  alignSelf: 'center',
  borderWidth: 4,
  borderColor: '#009688',
  color: '#009688',
  padding: 7,
  marginTop: 10,
  marginBottom: 5,
  height: 40,
  borderRadius: 15,
},
beerImage: {
  width: 125,
  height: 300,
  marginVertical: 20,
  resizeMode: 'contain',
  alignSelf: 'center'
},
rating: {
  fontSize: 25,
  textAlign: 'center',
},

    // REKOMMENDATIONER
  viewStyleRecommendation: {
    marginTop: 15,
    width: windowWidth * 0.93,
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
    marginTop: 5,
  },
  myEmptyStarStyle: {
    color: '#009688',
  },
  ratingStars: {
    alignItems: 'center',
  },
  })
  
  export default ReviewBeer