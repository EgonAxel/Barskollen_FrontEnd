import React from 'react';
import { View, Text, FlatList, Image, StyleSheet, TouchableOpacity, Dimensions} from 'react-native';
import axios from 'axios';
import Stars from 'react-native-stars';
import { Ionicons } from '@expo/vector-icons'; 
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import * as SecureStore from 'expo-secure-store';

async function getValueFor(key) {
 let result = await SecureStore.getItemAsync(key);
 if (result) {
    return(result);
  } else {
    return(None);
  }
}

class IndividualBeer extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      beer_ID: this.props.route.params.beer_ID,
      beer: this.props.route.params.beer,
      beerDataFetched: this.props.route.params.beerDataFetched,
      reviews: [],
      offset: 0,  //Bestämmer vilken sida från vår API vi laddar in reviews.
      error: null,
      hasReviewed: this.props.route.params.hasReviewed,
      userRating: this.props.route.params.userRating
    };
  }
  fetchBeer = () => {
    getValueFor("Token").then((token) => {
    axios
      .get(`http://127.0.0.1:8000/beer/${this.state.beer_ID}/`, {headers: { 'Authorization': `Token ` + token}}) //Här behävs din egen adress till APIn
      .then(response => {
        this.setState({
          beer: response.data,
          beerDataFetched: true
        });
      })
      .catch(error => {
        this.setState({error: error.message});
      });
    })
  };
  fetchReviews = () => {
    getValueFor("Token").then((token) => {
    axios
      .get(`http://127.0.0.1:8000/review/?beer=${this.state.beer_ID}`, {headers: { 'Authorization': `Token ` + token}}) //Här behävs din egen adress till APIn
      .then(response => {
        this.setState({
          reviews: this.state.reviews.concat(response.data.results),
        });
      })
      .catch(error => {
        this.setState({error: error.message});
      });
    })
  };
  fetchMoreReviews = () => {
    this.setState(
      prevState => ({
        offset: prevState.offset + 20 ,
      }),
      () => {
        this.fetchReviews();
      },
    );
  };
  checkHasReviewed = () => {
    getValueFor("Username").then((username) => {
      getValueFor("Token").then((token) => {
        axios
          .get(`http://127.0.0.1:8000/review/?beer=${this.state.beer_ID}&user=${username}`, { headers: { 'Authorization': `Token ` + token}}) //Här behövs din egen adress till APIn
          .then(response => {
            if (response.data.results.length > 0) {
              this.setState({
                hasReviewed: true,
                userRating: response.data.results[0].rating
              });
            }
            else {
              this.setState({
                hasReviewed: false
              })
            }
          })
          .catch(error => {
            console.log(error.message);
          });
      })
    })
  }

  componentDidMount() {
    this._unsubscribe = this.props.navigation.addListener('focus', () => {
      if (this.state.beerDataFetched != true) {
        this.fetchBeer()
      }
      this.fetchReviews()
      if (this.state.hasReviewed != true) {
        this.checkHasReviewed()
      }
    });
  }

  componentWillUnmount() {
    this._unsubscribe();
  }

 _renderListItem(item) {
  if (item.review_text != null) {
    return(
      <View style = {styles.commentWrap}>
        <View style = {styles.reviewDateBar}>
          <Ionicons name="calendar-outline" size={18}></Ionicons>
          <Text style={styles.dateOfReview}>{item.review_date.substring(0, 10)}</Text>
        </View>
        <View style={styles.reviewUsernameAndIcon}>
          <Ionicons name="person" size={23} style={styles.usernameIcon}/>
          <Text style = {styles.reviewUsername}>{item.user}</Text>
        </View>
        <Stars
          display= {Number(item.rating)}
          half={true}
          fullStar={<Icon name={'star'} style={[styles.reviewStarStyle]}/>}
          emptyStar={<Icon name={'star-outline'} style={[styles.reviewStarStyle]}/>}
          halfStar={<Icon name={'star-half-full'} style={[styles.reviewStarStyle]}/>}/>
          <Text style = {styles.reviewText}>{item.review_text} </Text>
      </View>
    )}
  else {
    return(
      <View style = {styles.commentWrap}>
        <View style = {styles.reviewDateBar}>
          <Ionicons name="calendar-outline" size={18}></Ionicons>
          <Text style={styles.dateOfReview}>{item.review_date.substring(0, 10)}</Text>
        </View>
        <View style={styles.reviewUsernameAndIcon}>
          <Ionicons name="person" size={23} style={styles.usernameIcon}/>
          <Text style = {styles.reviewUsername}>{item.user}</Text>
        </View> 
        <Stars
          display= {Number(item.rating)}
          half={true}
          fullStar={<Icon name={'star'} style={[styles.reviewStarStyle]}/>}
          emptyStar={<Icon name={'star-outline'} style={[styles.reviewStarStyle]}/>}
          halfStar={<Icon name={'star-half-full'} style={[styles.reviewStarStyle]}/>}/>
      </View>
  )}
}

renderUserRelated = () => {
  const { hasReviewed } = this.state;
    if (hasReviewed) {
      return (
        <View>
          <View style = {styles.ratingStars}>
            <Stars
              display= {Number(this.state.userRating)}
              half={true}
              fullStar={<Icon name={'star'} style={[styles.averageStarStyle]}/>}
              emptyStar={<Icon name={'star-outline'} style={[styles.averageStarStyle]}/>}
              halfStar={<Icon name={'star-half-full'} style={[styles.averageStarStyle]}/>}
            />
          </View>
          <Text style = {styles.averageRatingText}>{'Din rating: ' + Number(this.state.userRating) + ' av 5'}</Text>
          <View>
            <TouchableOpacity onPress={() => {this.props.navigation.navigate('ViewRecommendations', {beer_ID: this.state.beer.beer_ID, beer_name:this.state.beer.name, beer_pic: this.state.beer.picture_url, beer_type: this.state.beer.beer_type, beer_bitterness: this.state.beer.bitterness, beer_fullness: this.state.beer.fullness, beer_sweetness: this.state.beer.sweetness, rating: this.state.userRating})}}>
              <Text style={styles.giveRating}>Visa rekommendationer</Text>
            </TouchableOpacity>
          </View>
        </View>
      )
    }
    else if (hasReviewed == false){
      return (
        <View>
          <TouchableOpacity onPress={() => {this.props.navigation.navigate('ReviewBeer', {beer_ID: this.state.beer.beer_ID, beer_name:this.state.beer.name, beer_pic: this.state.beer.picture_url, beer_type: this.state.beer.beer_type, beer_bitterness: this.state.beer.bitterness, beer_fullness: this.state.beer.fullness, beer_sweetness: this.state.beer.sweetness, modalVisible: false})}}>
            <Text style={styles.giveRating}>
              Ge rating
            </Text>
          </TouchableOpacity>
        </View>
      )
    }
}

renderBeerImage = (beer_image, resolution, imageStyle) => {
  if (beer_image == null) {
    return( <Image source={{uri: "https://cdn.systembolaget.se/492c4d/contentassets/ef797556881d4e20b334529d96b975a2/placeholder-beer-bottle.png" }} style={imageStyle}/>)
  }
  else {
    return( <Image source={{uri: beer_image + resolution }} style={imageStyle} />)
  }
}

renderListHeader = () => {
  if (this.state.beerDataFetched == true) {
  return (
    <View style={styles.individualBeerScreen}>
      <View style = {styles.viewStyle}>
        <View style={styles.beerTitles}>
          <Text style = {styles.productNameBold}>{this.state.beer.name}</Text>
          <Text style = {styles.productNameThin}>{this.state.beer.beer_type}</Text>
          <View style={styles.percentageAndContainer}>
            <Text style = {styles.containerAndVolumeStyle}>{this.state.beer.container_type + ' • ' + this.state.beer.volume + ' ml • ' + this.state.beer.alcohol_percentage + '% vol'}</Text>
          </View>
        </View>
        <View style = {styles.imageWrap}>
          {this.renderBeerImage(this.state.beer.picture_url, '_200.png', styles.beerImage)}
        </View>
        <View style = {styles.textWrap}>
          {/* <View style = {styles.tasteClockWrap}>
            <Text style = {styles.tasteClockStyle}>{'Bitterhet: ' + this.state.beer_bitterness}</Text>
            <Text style = {styles.tasteClockStyle}>{'Fyllighet: ' + this.state.beer_fullness}</Text>
            <Text style = {styles.tasteClockStyle}>{'Sötma: ' +  this.state.beer_sweetness}</Text>
          </View> */}
          <View style = {styles.ratingStars}>
            <Stars
              display= {Number(this.state.beer.avg_rating)}
              half={true}
              fullStar={<Icon name={'star'} style={[styles.averageStarStyle]}/>}
              emptyStar={<Icon name={'star-outline'} style={[styles.averageStarStyle]}/>}
              halfStar={<Icon name={'star-half-full'} style={[styles.averageStarStyle]}/>}
            />
          </View>
          <Text style = {styles.averageRatingText}>{'Medelrating: ' + Number(this.state.beer.avg_rating).toFixed(1) + ' av 5'}</Text>
          {this.renderUserRelated()}
        </View>
      </View>
      <View>
        <Text style= {styles.ratingTitle}> Ratings </Text>
      </View>
    </View>
  )
        }
}

render() {
  return (
    <FlatList
      style={{flex: 1, backgroundColor: '#ffffff'}}
      contentContainerStyle={{
        backgroundColor: '#ffffff',
        alignItems: 'center',
        justifyContent: 'center',
        // marginTop: 15,
      }}

      data={this.state.reviews}
     
      keyExtractor={(beer, index) => String(index)}
      renderItem={({ item }) => this._renderListItem(item)}
      ListHeaderComponent={this.renderListHeader()}
      //horizontal={true}
       />
       
    );
  }
}

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
const reviewUsernameMarginTop = 7;
const usedBorderRadius = 15;
const beerInformationFontSize = 16;

const styles = StyleSheet.create({

  individualBeerScreen: {
    minHeight: 650,
    maxHeight: windowHeight,
  },
  viewStyle: {
    width: 350,
    maxHeight: windowHeight,
    marginTop: 15,
    backgroundColor: '#ffffff',
    borderRadius: usedBorderRadius,
    borderStyle: 'solid', 
    borderColor: '#dadada',
    borderWidth: 2,
    shadowColor: "#000000",
    shadowOffset: {
      width: 3,
      height: 3
    },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  beerTitles: {
    maxWidth: windowWidth * 0.75,
    alignSelf: 'center',
  },
  productNameBold: {
    fontSize: 25,
    fontWeight: '600',
    marginTop: 25,
    textAlign: 'center',
  },
  productNameThin: {
    fontSize: 18,
    fontWeight: '400',
    textAlign: 'center',
    marginBottom: 15,
  },
  reviewUsernameAndIcon: {
    flexDirection: 'row',
    alignSelf: 'center', 
  },
  reviewUsername: {
    marginTop: reviewUsernameMarginTop,
    fontSize: 22,
    color: 'black',
    fontWeight: "700",
    marginBottom: 5,
    paddingRight: 5,
  },
  usernameIcon: {
    color: '#009688',
    marginTop: reviewUsernameMarginTop + 3,
    paddingRight: 5,
  },
  reviewText: {
    fontSize: 18,
    fontWeight: '500',
    width: windowWidth * 0.75,
    alignSelf: 'center',
    textAlign: 'center',
    paddingTop: 15,
    paddingBottom: 15,
    marginBottom: 5,
  },
  usernameIcon: {
    color: '#009688',
    marginTop: reviewUsernameMarginTop + 3,
    paddingRight: 5,
  },
  reviewDateBar: {
    flexDirection: 'row',
    alignSelf: 'center',
    alignItems: 'baseline',
    marginTop: 15,
    paddingBottom: 10,
    fontSize: 14,
    color: 'black',
  },
  dateOfReview: {
    paddingLeft: 5,
  },
  reviewText: {
    fontSize: 16,
    fontWeight: '500',
    width: windowWidth * 0.75,
    alignSelf: 'center',
    textAlign: 'center',
    paddingBottom: 15,
  },
  beerImage: {
      width: 100,
      height: 225,
      resizeMode: 'contain',
      alignSelf: 'center',
  },
  imageWrap: {
    marginTop: 15,
    marginBottom: 10,
    alignItems: 'center',
    alignSelf: 'center',
  },
  giveRating: {
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
  textWrap: {
    alignItems: 'center',
    alignSelf: 'center',
  },
  alcoholPercentageStyle: {
    fontSize: beerInformationFontSize,
    textAlign: 'center',
    marginBottom: 10,
  },
  containerAndVolumeStyle: {
    fontSize: 15,
    textAlign: 'center',
  },
  percentageAndContainer: {
    // marginTop: 25,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    width: '100%',
  },
  tasteClockWrap: {
    marginTop: 5,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    width: '100%',
  },
  tasteClockStyle: {
      fontSize: beerInformationFontSize,
      fontWeight: '400',
      textAlign: 'center',
    },
  averageRatingText: {
    fontSize: beerInformationFontSize,
    textAlign: 'center',
    marginBottom: 10,
  },
  ratingTitle: {
    alignSelf: 'center',
    fontSize: 25,
    fontWeight: '700',
    color: '#000000',
    marginTop: 40,
  },
  commentWrap: {
    marginTop: 15,
    marginBottom: 15,
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
  ratingStars: {
    paddingBottom: 10,
  },
  averageStarStyle: {
    color: '#009688',
    backgroundColor: 'transparent',
    textShadowColor: '#dadada',
    textShadowOffset: 
    {width: 1, height: 1},
    textShadowRadius: 5,
    fontSize: 35,
    marginTop: 10,
  },
  reviewStarStyle: {
    color: '#009688',
    backgroundColor: 'transparent',
    textShadowColor: '#dadada',
    textShadowOffset: 
    {width: 1, height: 1},
    textShadowRadius: 5,
    fontSize: 30,
    paddingVertical: 15,
  },
})

export default IndividualBeer