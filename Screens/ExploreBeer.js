import React from 'react';
import {View, Text, FlatList, Image, StyleSheet,TouchableOpacity} from 'react-native';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import Stars from 'react-native-stars';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

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
      error: null,
    };
  }
  fetchBeer = () => {
    const {offset} = this.state;
    getValueFor("Token").then((token) => {
      axios
      .get(`http://192.168.56.1:80/beer/?limit=20&offset=${offset}`, {headers: { 'Authorization': `Token `  + token}}) //Här behävs din egen adress till APIn
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
    console.log(this.state.offset)
    this.setState(
      prevState => ({
        offset: prevState.offset + 20 ,
      }),
      () => {
        this.fetchBeer();
      },
    );
  };
  componentDidMount() {
    this.fetchBeer(this.state.offset);
  }
  _renderListItem(item){
    
      return(
        // Bortkommenderad från <Card>: pointerEvents="none">
        <View style = {styles.viewStyle}>
          {/* <Card style = {styles.cardStyle}> */}
            <TouchableOpacity onPress={() => this.props.navigation.navigate('IndividualBeer', {beer_ID: item.beer_ID})}>
                <View style = {styles.beerInstance}>
                  <Image style = {styles.beerImage} source = {{uri: item.picture_url + '_100.png' }}/>
                    <View style = {styles.beerInformation}>
                      <Text style = {styles.productNameBold}>{item.name}</Text>
                      <Text style = {styles.productNameThin}>{item.beer_type}</Text>
                      {/* <Text style = {styles.attributeStyle}>{item.container_type}{'\n'}</Text> */}
                      {/* <Text style = {styles.attributeStyle}>{item.volume + ' ml'}{'\n'}</Text> */}
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
            </TouchableOpacity>
          {/* </Card> */}
        </View>
        )
    }
  render() {
    
    return (
      
        <FlatList
        style={{flex: 1}}
          contentContainerStyle={{
            backgroundColor: '#d9f7cd',
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
           />
    );

  }
  
}
const styles = StyleSheet.create({

    viewStyle: {
      marginTop: 15,
      width: 400,
      backgroundColor: '#effce8',
      borderRadius: 15,
      borderStyle: 'solid', 
      borderColor: '#effce8',
      borderWidth: 3,
      shadowColor: "#000",
      shadowOffset: {
	      width: 3,
	      height: 3
      },
      shadowOpacity: 0.5,
      shadowRadius: 5,
      elevation: 20,
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
      fontSize: 14,
      fontWeight: '500',
      textAlign: 'left',
    },

    productNameThin: {
      fontSize: 12,
      fontWeight: '400',
      textAlign: 'left',
      marginBottom: 5,
    },

    beerInstance: {
      textAlign: 'center',
      paddingBottom: 5,
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
        paddingBottom: 0,
      },

    alcohol_percentage: {
      fontSize: 14,
      textAlign: 'left',
    },

    rating: {
      fontSize: 14,
      textAlign: 'left',
    },
    myStarStyle: {
      color: 'black',
      backgroundColor: 'transparent',
      textShadowColor: 'black',
      textShadowOffset: {width: 1, height: 1},
      textShadowRadius: 2,
      fontSize: 30,
      left: 15
  
    },
    myEmptyStarStyle: {
      color: 'black',
    },
})
export default Beers;