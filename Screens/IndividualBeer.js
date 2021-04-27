

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
      beers: [],
      reviews:[],
      offset: 0,  //Bestämmer vilken sida från vår api vi laddar in.
      error: null,
      beer_ID: this.props.route.params.beer_ID,
      beer_name: this.props.route.params.beer_name,
      beer_pic: this.props.route.params.beer_pic,
      beer_type: this.props.route.params.beer_type,
      beer_percentage: this.props.route.params.beer_percentage,
      beer_volume:this.props.route.params.beer_volume,
      beer_container_type:this.props.route.params.beer_container_type,
      beer_bitterness:this.props.route.params.beer_bitterness,
      beer_sweetness: this.props.route.params.beer_sweetness,
      beer_fullness:this.props.route.params.beer_fullness,
      beer_avgrating:this.props.route.params.beer_avgrating,
      hasReviewed: false,
    };
  }
  
  checkHasReviewed = () => {
    getValueFor("Username").then((username) => {
      getValueFor("Token").then((token) => {
        axios
          .get(`http://127.0.0.1:8000/review/?beer=${this.state.beer_ID}&user=${username}`, { headers: { 'Authorization': `Token ` + token}}) //Här behövs din egen adress till APIn
          .then(response => {
            if (response.data.results.length > 0) {
              this.setState({ hasReviewed: true });
              console.log("Användare har recenserat, hasReviewed sätts till true.")
            }
          })
          .catch(error => {
          console.log(error.message);
          });
        })
      })
    }

  fetchReview = () => {
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
        this.fetchReview();
      },
    );
  };
  componentDidMount() {
    this.checkHasReviewed();
    this.fetchReview(this.state.offset, this.state.reviews);
  }


_renderListItem(item){
  return(
      <View style = {styles.commentWrap}>
        <View>
        <View style={{flexDirection:"row", alignSelf:'center', justifyContent: 'flex-end'}}>
              <Ionicons name="person" size={23} style={styles.usernameIcon}/>
              <Text style = {styles.reviewUsername}>{item.user}</Text>
          </View> 
          <Stars
            display= {Number(item.rating)}
            half={true}
            fullStar={<Icon name={'star'} style={[styles.reviewStarStyle]}/>}
            emptyStar={<Icon name={'star-outline'} style={[styles.reviewStarStyle]}/>}
            halfStar={<Icon name={'star-half-full'} style={[styles.reviewStarStyle]}/>}
          />
          <Text style = {styles.reviewText}>{item.review_text} </Text>
        </View>
      </View>
  )
}

renderListHeader = () => {
  const { hasReviewed } = this.state;
  return (
    <View style={styles.individualBeerScreen}>
      <View style = {styles.viewStyle}>
        <View style={styles.beerTitles}>
          <Text style = {styles.productNameBold}>{this.state.beer_name}</Text>
          <Text style = {styles.productNameThin}>{this.state.beer_type}</Text>
        </View>
        <View style = {styles.imageWrap}>
          <Image source={{uri: this.state.beer_pic + '_200.png' }} style={styles.beerImage} />
        </View>
        <View style = {styles.textWrap}>
          <View style={styles.percentageAndContainer}>
            <Text style = {styles.alcoholPercentageStyle}>{this.state.beer_percentage + '% vol'}</Text>
            <Text style = {styles.containerAndVolumeStyle}>{this.state.beer_container_type + ', ' + this.state.beer_volume + ' ml'}</Text>
          </View>
          <View style = {styles.tasteClockWrap}>
            <Text style = {styles.tasteClockStyle}>{'Bitterhet: ' + this.state.beer_bitterness}</Text>
            <Text style = {styles.tasteClockStyle}>{'Fyllighet: ' + this.state.beer_fullness}</Text>
            <Text style = {styles.tasteClockStyle}>{'Sötma: ' +  this.state.beer_sweetness}</Text>
          </View>
          <View style = {styles.ratingStars}>
            <Stars
              display= {Number(this.state.beer_avgrating)}
              half={true}
              fullStar={<Icon name={'star'} style={[styles.averageStarStyle]}/>}
              emptyStar={<Icon name={'star-outline'} style={[styles.averageStarStyle]}/>}
              halfStar={<Icon name={'star-half-full'} style={[styles.averageStarStyle]}/>}
            />
          </View>
          <Text style = {styles.averageRatingText}>{'Medelrating: ' + Number(this.state.beer_avgrating) + ' av 5'}</Text> 
          <TouchableOpacity onPress={() => {this.props.navigation.navigate('ReviewBeer', {beer_ID: this.state.beer_ID, beer_name:this.state.beer_name, beer_pic: this.state.beer_pic, beer_type: this.state.beer_type, beer_bitterness: this.state.beer_bitterness, beer_fullness: this.state.beer_fullness, beer_sweetness: this.state.beer_sweetness, modalVisible: false})}}>
            <Text style={styles.giveRating}>
              Ge rating
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      <View>
        <Text style= {styles.ratingTitle}> Ratings </Text>
      </View>
    </View>
    
  )
}



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
const reviewUsernameMarginTop = 15;
const usedBorderRadius = 15;
const beerInformationFontSize = 18;

const styles = StyleSheet.create({

  individualBeerScreen: {
    minHeight: 650,
    maxHeight: windowHeight,
  },
  viewStyle: {
    width: 350,
    minHeight: 575,
    maxHeight: windowHeight,
    marginTop: 25,
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
  reviewUsername: {
    marginTop: reviewUsernameMarginTop,
    fontSize: 22,
    color: 'black',
    fontWeight: "700",
    alignSelf: "center",
    marginBottom: 10,
  },
  usernameIcon: {
    color: '#009688',
    marginTop: reviewUsernameMarginTop + 3,
    paddingRight: 5,

  },
  reviewText: {
    fontSize: 18,
    fontWeight: '500',
    textAlign: 'center',
    paddingTop: 15,
    marginBottom: 25,
  },
beerImage: {
    width: 100,
    height: 225,
    resizeMode: 'contain',
    alignSelf: 'center',
},
imageWrap: {
  marginTop: 15,
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
    fontSize: beerInformationFontSize,
    textAlign: 'center',
  },
  percentageAndContainer: {
    marginTop: 25,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    width: '100%',
  },
  tasteClockWrap: {
    marginTop: 15,
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
    // textDecorationLine: 'underline',
    alignSelf: 'center',
    fontSize: 25,
    fontWeight: '700',
    color: '#000000',
    marginTop: 40,
  },
  commentWrap: {
    marginTop: 15,
    marginBottom: 25,
    width: 350,
    minHeight: 125,
    maxHeight: 150,
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
    paddingVertical: 10,

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
    marginTop: 10,
  },

})

export default IndividualBeer  
