

import React from 'react';
import { View, Text, FlatList, Image, StyleSheet, TouchableOpacity} from 'react-native';
import axios from 'axios';
import Stars from 'react-native-stars';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import * as SecureStore from 'expo-secure-store';
import { SafeAreaView } from 'react-native-safe-area-context';


async function getValueFor(key) {
 let result = await SecureStore.getItemAsync(key);
 if (result) {
    return(result);
  } else {
    return(None);
  }
}


class individualBeer extends React.PureComponent {
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
      beer_avgrating:this.props.route.params.beer_avgrating
    };
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
    this.fetchReview(this.state.offset, this.state.reviews);
  }

_renderListItem(item){

  return(
    
    <View style = {styles.commentWrap}>
         
          <View style = {styles.ratingStars}>
          <Text style = {styles.productNameBold}>{item.user}</Text>
            <Stars
              display= {Number(item.rating)}
              half={true}
              fullStar={<Icon name={'star'} style={[styles.myStarStyle]}/>}
              emptyStar={<Icon name={'star-outline'} style={[styles.myStarStyle, styles.myEmptyStarStyle]}/>}
              halfStar={<Icon name={'star-half-full'} style={[styles.myStarStyle]}/>}
            />
          </View>
          {/* </Card> */}
         
          
  
    </View>
    
    )
}
renderListHeader = () => {
  return (
    <View style={{height: 600}}>
      <View style = {styles.viewStyle}>
          {/* <Card pointerEvents="none"> */} 
          <Text style = {styles.productNameBold}>{this.state.beer_name}</Text>
          <Text style = {styles.productNameThin}>{this.state.beer_type}</Text>
          <View style = {styles.imageWrap}>
          <Image source={{uri: this.state.beer_pic + '_200.png' }} style={styles.beerImage} />
          <TouchableOpacity onPress={() => this.props.navigation.navigate('commentLayout', {beer_ID: this.state.beer_ID, beer_name:this.state.beer_name, beer_pic: this.state.beer_pic, beer_type: this.state.beer_type, beer_bitterness: this.state.beer_bitterness, beer_fullness: this.state.beer_fullness, beer_sweetness: this.state.beer_sweetness})}>
           <Image source={require('../images/beerCap.png')} style={styles.capImage} /> 
           </TouchableOpacity>
          </View>
          <View style = {styles.textWrap}>
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
              fullStar={<Icon name={'star'} style={[styles.myStarStyle]}/>}
              emptyStar={<Icon name={'star-outline'} style={[styles.myStarStyle, styles.myEmptyStarStyle]}/>}
              halfStar={<Icon name={'star-half-full'} style={[styles.myStarStyle]}/>}
            />
          </View>
          <Text style = {styles.rating}>{'Rating: ' + Number(this.state.beer_avgrating) + ' av 5'}</Text> 
          {/* </Card> */}
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
    
      
    data={this.state.reviews}
     
      keyExtractor={(beer, index) => String(index)}
      renderItem={({ item }) => this._renderListItem(item)}
      ListHeaderComponent={this.renderListHeader()}
      //horizontal={true}
       />
       
    );
  }
}

const styles = StyleSheet.create({

  viewStyle: {
    marginTop: 15,
    width: 350,
    height: 525,
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

  productNameBold: {
    fontSize: 25,
    fontWeight: '700',
    marginTop: 25,
    textAlign: 'center',
  },

  productNameThin: {
    fontSize: 18,
    fontWeight: '400',
    textAlign: 'center',
    marginBottom: 5,
  },

  beerImage: {
      width: 150,
      height: 250,
      resizeMode: 'contain',
      alignSelf: 'center'
  },
  imageWrap: {
    flex: 3,
    marginTop: 80,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginBottom: 20
},

  textWrap: {
    flex: 2,
    marginTop: 120,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  commentWrap: {
    marginTop: 50,
    marginTop: 15,
    width: 350,
    height: 400,
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
  
  tasteClockWrap: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },

  capImage: {
    width: 150,
    height: 200,
    resizeMode: 'contain',
    alignSelf: 'center'
},

  alcoholPercentageStyle: {
    fontSize: 20,
    textAlign: 'center',
    fontWeight: '500',
    marginBottom: 10,
  },

  containerAndVolumeStyle: {
    fontSize: 20,
    textAlign: 'center',
  },

  tasteClockStyle: {
      fontSize: 16,
      fontWeight: '400',
      textAlign: 'center',
    },

  rating: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 25,
  },

  myStarStyle: {
    color: '#009688',
    backgroundColor: 'transparent',
    textShadowColor: 'black',
    textShadowOffset: {width: 1, height: 1},
    textShadowRadius: 2,
    fontSize: 30,
    left: 15
  },
  myEmptyStarStyle: {
    color: '#009688',
  },
  ratingStars: {
    
  },
})

export default individualBeer  