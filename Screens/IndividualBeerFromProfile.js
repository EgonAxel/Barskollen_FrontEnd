import React from 'react';
import { View, Text, FlatList, Image, StyleSheet, TouchableOpacity} from 'react-native';
import axios from 'axios';
import Stars from 'react-native-stars';
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

class IndividualBeerFromProfile extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      beers: [],
      offset: 0,  //Bestämmer vilken sida från vår api vi laddar in.
      error: null,
      beer_ID: this.props.route.params.beer_ID,
      rating: this.props.route.params.rating
    };
  }
  fetchBeer = () => {
    getValueFor("Token").then((token) => {
    axios
      .get(`http://127.0.0.1:8000/beer/${this.state.beer_ID}/`, {headers: { 'Authorization': `Token ` + token}}) //Här behävs din egen adress till APIn
      .then(response => {
        this.setState({
          beers: this.state.beers.concat(response.data),
        });
     
      })
      .catch(error => {
        this.setState({error: error.message});
      });
    })
  };
  componentDidMount() {
    this.fetchBeer(this.state.offset);
  }

_renderListItem(item){
  return(
    
    <View style = {styles.viewStyle}>
          {/* <Card pointerEvents="none"> */} 
          <Text style = {styles.productNameBold}>{item.name}</Text>
          <Text style = {styles.productNameThin}>{item.beer_type}</Text>
          <View style = {styles.imageWrap}>
          <Image source={{uri: item.picture_url + '_200.png' }} style={styles.beerImage} />
          </View>
            <View style = {styles.textWrap}>
              <Text style = {styles.alcoholPercentageStyle}>{item.alcohol_percentage + '% vol'}</Text>
              <Text style = {styles.containerAndVolumeStyle}>{item.container_type + ', ' + item.volume + ' ml'}</Text>
            </View>
          {/* <Text style = {styles.volumeStyle}>{item.volume + ' ml'}</Text> */}
          <View style = {styles.tasteClockWrap}>
            <Text style = {styles.tasteClockStyle}>{'Bitterhet: ' + item.bitterness}</Text>
            <Text style = {styles.tasteClockStyle}>{'Fyllighet: ' + item.fullness}</Text>
            <Text style = {styles.tasteClockStyle}>{'Sötma: ' +  item.sweetness}</Text>
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
          <Text style = {styles.rating}>{'Medelrating: ' + Number((item.avg_rating).toFixed(1)) + ' av 5'}</Text>
          <View style = {styles.ratingStars}>
            <Stars
              display= {Number(this.state.rating)}
              half={true}
              fullStar={<Icon name={'star'} style={[styles.myStarStyle]}/>}
              emptyStar={<Icon name={'star-outline'} style={[styles.myStarStyle, styles.myEmptyStarStyle]}/>}
              halfStar={<Icon name={'star-half-full'} style={[styles.myStarStyle]}/>}
            />
          </View>
          <Text style = {styles.rating}>{'Din rating: ' + Number(this.state.rating) + ' av 5'}</Text> 
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
      data={this.state.beers}
      keyExtractor={(beer, index) => String(index)}
      
      renderItem={({ item }) => this._renderListItem(item)}
      //horizontal={true}
       />
    );
  }
}

const styles = StyleSheet.create({

viewStyle: {
  marginTop: 15,
  width: 350,
  height: 650,
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
  flexDirection: 'column',
  justifyContent: 'center'
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
  height: 205,
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
  flex: 1,
  marginTop: 50,
  flexDirection: 'row',
  justifyContent: 'space-evenly',
},
tasteClockWrap: {
  flex: 1,
  flexDirection: 'row',
  justifyContent: 'space-evenly',
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
  marginVertical: 10,
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
},
myEmptyStarStyle: {
  color: '#009688',
},
  ratingStars: {
    
  },
})

export default IndividualBeerFromProfile