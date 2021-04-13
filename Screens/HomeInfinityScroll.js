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
      .get(`http://192.168.56.1/beer/?limit=20&offset=${offset}&ordering=-rating`) //Här behävs din egen adress till APIn
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
        
        <View
              style={{
                marginTop: 10,
              }}>
              <TouchableOpacity onPress={() => console.log('klicka öl' + item.name)}>
              <Card pointerEvents="none">
              <Text style = {styles.textStyles}>{item.name}</Text>
              <Text style = {styles.textStyles}>{item.beer_type}</Text>
              <Image source={{uri: item.picture_url + '_100.png' }} style={styles.imageStyle} />
              <Text style = {styles.textStyles}>{item.container_type}</Text>
              <Text style = {styles.textStyles}>{item.volume + ' ml'}</Text>
              <Text style = {styles.textStyles}>{item.alcohol_percentage + '% vol'}</Text>
              </Card>
              </TouchableOpacity>
            </View>
        )
    }
  render() {
    return (
      
        <FlatList
        style={{flex:1}}
          contentContainerStyle={{
            backgroundColor: '#FFFFFF',
            alignItems: 'center',
            justifyContent: 'center',
            marginTop: 15,
          
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
    cardStyle: {
        padding:5,
        margin:5,
        justifyContent: 'center',
        alignContent: 'center',
        backgroundColor: '#FFFFFF',
        borderRadius: 10,
        flex:1,
       
    },
    imageStyle: {
        
        width: 80,
        height: 150,
        resizeMode: 'contain',
        alignSelf: 'center'
    },

    textStyles : {
        fontSize:15,
        textAlign: 'center',
      },
})
export default Beers;