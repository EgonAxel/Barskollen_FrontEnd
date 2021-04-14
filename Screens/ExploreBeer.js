import React, {Component} from 'react';
import {ScrollView, View, Text, FlatList, Image, StyleSheet} from 'react-native';
import {Card} from 'react-native-elements';
import axios from 'axios';
import { TouchableOpacity } from 'react-native';


// Installera dessa: 
// npm i --save axios 
// npm i react-native-elements --save
// npm i --save react-native-vector-icons // required by react-native-elements



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
    axios
      .get(`http://127.0.0.1:8000/beer/?limit=20&offset=${offset}&ordering=-rating`) //Här behävs din egen adress till APIn
      .then(response => {
        this.setState({
          beers: this.state.beers.concat(response.data.results),
          
        });
      })
      .catch(error => {
        this.setState({error: error.message});
      });
  };
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
                      <Text style = {styles.rating}>{'Rating: ' + Number((item.avg_rating).toFixed(1)) + ' av 5'}</Text>
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
            backgroundColor: '#effce8',
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
      backgroundColor: '#f9fcf7',
      borderRadius: 15,
      borderStyle: 'solid', 
      borderColor: '#e3e3e3',
      borderWidth: 3,
    },

    beerImage: {
        width: 100,
        height: 200,
        marginTop: 10,
        marginBottom: 10,
        marginLeft: 10,
        resizeMode: 'contain',
        left: 0,
    },

    productNameBold: {
      fontSize: 20,
      fontWeight: '700',
      textAlign: 'left',
    },

    productNameThin: {
      fontSize: 18,
      fontWeight: '600',
      textAlign: 'left',
      marginBottom: 20,
    },

    beerInstance: {
      textAlign: 'center',
      paddingBottom: 5,
      textAlign: 'left',
      flexDirection: 'row',
    },

    beerInformation: {
      marginTop: 15,
      paddingBottom: 5,
      flexDirection: 'column',
      left: 50,
    },

    attributeStyle: {
        fontSize: 20,
        textAlign: 'left',
        paddingBottom: 0,
      },

    alcohol_percentage: {
      fontSize: 20,
      textAlign: 'left',
      marginTop: 20,
    },

    rating: {
      flex: 1,
      fontSize: 20,
      textAlign: 'left',
      marginTop: 20,
    },
})
export default Beers;