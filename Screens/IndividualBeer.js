import React from 'react';
import { View, Text, FlatList, Image, StyleSheet, TouchableOpacity, Dimensions, Modal, ImageBackground } from 'react-native';
import axios from 'axios';
import { Rating } from 'react-native-ratings';
import { Ionicons } from '@expo/vector-icons';
import * as SecureStore from 'expo-secure-store';

const primaryColor = '#f89c11';
const colorOnCard = "#ffffff";          // Backbground dolor on the individual beer card
const colorOnReviewCard = colorOnCard;  // Background color on the review cards below the individual beer

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
      reviews: [],
      offset: 0,  //Bestämmer vilken sida från vår API vi laddar in reviews.
      error: null,
      beerDataFetched: this.props.route.params.beerDataFetched,
      hasReviewed: this.props.route.params.hasReviewed,
      userRating: this.props.route.params.userRating,
      recommendationsModalVisible: false
    };
  }

  setModalVisible = (visible) => {
    this.setState({ recommendationsModalVisible: visible });
  }

  fetchBeer = () => {
    getValueFor("Token").then((token) => {
    axios
      .get(`http://127.0.0.1:8000/beer/${this.state.beer_ID}/`, { headers: { 'Authorization': `Token ` + token}}) //Här behävs din egen adress till APIn
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

  fetchReviews = (firstLoad) => {
    getValueFor("Token").then((token) => {
    axios
      .get(`http://127.0.0.1:8000/review/?beer=${this.state.beer_ID}`, { headers: { 'Authorization': `Token ` + token}}) //Här behävs din egen adress till APIn
      .then(response => {
        if (firstLoad) {
          this.setState({
            reviews: response.data.results
          })
        }
        else {
          this.setState({
            reviews: this.state.reviews.concat(response.data.results)
          })
        }
      })
      .catch(error => {
        this.setState({error: error.message});
      })
    })
  };

  fetchMoreReviews = () => {
    this.setState(
      prevState => ({
        offset: prevState.offset + 20 ,
      }),
      () => {
        this.fetchReviews(false);
      },
    );
  };

  checkHasReviewed = () => {
    getValueFor("Username").then((username) => {
      getValueFor("Token").then((token) => {
        axios
          .get(`http://127.0.0.1:8000/review/?beer=${this.state.beer_ID}&user=${username}`, { headers: { 'Authorization': 'Token ' + token }}) //Här behövs din egen adress till APIn
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
    this._unsubscribe = this.props.navigation.addListener('focus', () => {
      if (this.state.beerDataFetched != true || this.state.refreshed != true) {
        this.fetchBeer()
      }
      this.fetchReviews(true)
      if (this.state.hasReviewed != true) {
        this.checkHasReviewed()
      }
    })
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
          <Rating
            type='custom'
            readonly={true}
            startingValue={item.rating}
            style={styles.reviewStarStyle}
            imageSize={35}
            ratingColor={primaryColor}
            ratingBackgroundColor='#dadada'
            tintColor={colorOnReviewCard}
          />
          <Text style = {styles.reviewText}>{item.review_text} </Text>
        </View>
      )
    }
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
      )
    }
  }

  renderUserRelated = () => {
    const { hasReviewed } = this.state;
      if (hasReviewed) {
        return (
          <View>
          <Rating
            type='custom'
            readonly={true}
            startingValue={this.state.userRating}
            style={styles.reviewStarStyle}
            imageSize={35}
            ratingColor={primaryColor}
            ratingBackgroundColor='#dadada'
            tintColor={colorOnCard}
          />
          <Text style = {styles.averageRatingText}>{'Din rating: ' + Number(this.state.userRating) + ' av 5'}</Text>
          <View>
            <TouchableOpacity onPress={() => {
              this.getRecommendations(this.state.beer.beer_ID, this.state.userRating, this.state.beer.beer_type, this.state.beer.bitterness, this.state.beer.fullness, this.state.beer.sweetness)
              this.setModalVisible(true)}}>
              <Text style={styles.giveRating}>Visa rekommendationer</Text>
            </TouchableOpacity>
          </View>
        </View>
        )
      }
      else if (hasReviewed == false){
        return (
          <View>
            <TouchableOpacity onPress={() => {
              this.props.navigation.navigate('ReviewBeer', {beer: this.state.beer, modalVisible: false})}}>
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
        <View>
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
              <View>
                <Rating
                  type='custom'
                  readonly={true}
                  startingValue={this.state.beer.avg_rating}
                  style={styles.reviewStarStyle}
                  imageSize={35}
                  ratingColor={primaryColor}
                  ratingBackgroundColor='#dadada'
                  tintColor={colorOnCard}
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
    const { recommendationsModalVisible } = this.state;
    return (
      <View>
        <ImageBackground source={require('../images/humle7.jpg')} style={styles.backgroundImage} blurRadius={0} opacity={0.8}>
          <FlatList
            contentContainerStyle={{
              // backgroundColor: '#ffffff',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            data={this.state.reviews}
            keyExtractor={(review, index) => String(index)}
            renderItem={({ item }) => this._renderListItem(item)}
            ListHeaderComponent={this.renderListHeader()}
          />
          <Modal 
            style={{backgroundColor: "blue"}}
            visible={recommendationsModalVisible}
            animationType="slide"
            useNativeDriver={true} 
            onRequestClose={() => {
              Alert.alert("Modal has been closed.");
              this.setModalVisible(!recommendationsModalVisible);}}>
            <Text style = {styles.recommendationHeader}>Rekommendationer</Text>
            <Text style = {styles.recommendationText}>Här är några öl du kanske gillar {'\n'} baserat på ditt betyg.</Text>
            <FlatList
              style={{flex: 1}}
              contentContainerStyle={{
                backgroundColor: "#ffffff",
                alignItems: 'center',
                justifyContent: 'center',
                marginTop: 15 }}
                data={this.state.recommendations}
                keyExtractor={(beer, index) => String(index)}
                renderItem={({ item }) => this._renderModalListItem(item)}/>
            <TouchableOpacity onPress={() => this.setModalVisible(false)}>
              <View style={styles.closeButton}>
                <Text style={styles.closeTextStyle}>Stäng</Text>
              </View>
            </TouchableOpacity>
          </Modal>
        </ImageBackground>
      </View>
    );
  }

  _renderModalListItem(item) {
    return(
      <View style = {styles.modalStyleRecommendation}>
        <TouchableOpacity onPress={() => {
            this.setModalVisible(false)
            this.props.navigation.push('IndividualBeer', { beer_ID: item.beer_ID, beer: item, beerDataFetched: true, hasReviewed: null })}}>
          <View style = {styles.beerInstance}>
            {this.renderBeerImage(item.picture_url, '_100.png', styles.beerImageRecommendation)}
            <View style = {styles.beerInformation}>
              <Text style = {styles.productNameRecommendation}>{item.name}</Text>
              <Text style = {styles.productTypeRecommendation}>{item.beer_type}</Text>
              {/* <Text style = {styles.alcohol_percentage}>{item.alcohol_percentage + '% vol'}{'\n'}</Text> */}
              <Rating
                type='custom'
                readonly={true}
                startingValue={item.avg_rating}
                style={styles.ratingStyle}
                imageSize={28}
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
}

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
const reviewUsernameMarginTop = 7;
const usedBorderRadius = 15;
const beerInformationFontSize = 16;

const styles = StyleSheet.create({

  viewStyle: {
    width: 350,
    maxHeight: windowHeight,
    marginTop: 15,
    backgroundColor: colorOnCard,
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
  backgroundImage: {
    resizeMode: "cover",
    justifyContent: "center",
    borderRadius: usedBorderRadius,
    overflow: "hidden"
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
    color: '#7e520f',
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
    backgroundColor: primaryColor,
    color: '#ffffff',
    overflow: 'hidden',
    paddingHorizontal: 25,
    paddingVertical: 15,
    marginTop: 10,
    marginBottom: 25,
    borderRadius: 25,
    shadowColor: "#9f5f04",
    shadowOffset: {
      width: 3,
      height: 3 
    },
    shadowOpacity: 1,
    shadowRadius: 3,
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
    backgroundColor: colorOnReviewCard,
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
  reviewStarStyle: {
    paddingVertical: 10,
  },

  // MODAL

  modalStyleRecommendation: {
    width: windowWidth * 0.93,
    backgroundColor: "white",
    borderRadius: 15,
    borderStyle: 'solid', 
    borderColor: '#dadada',
    borderWidth: 1,
    margin: 5,
    padding: 5,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
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
  closeTextStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center"
  },
})

export default IndividualBeer