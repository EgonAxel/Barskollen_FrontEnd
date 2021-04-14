

import React, {Component} from 'react';
import {ScrollView, View, Text, FlatList, Image, StyleSheet} from 'react-native';
import {Card} from 'react-native-elements';
import axios from 'axios';
import { TouchableOpacity } from 'react-native';


class individualBeer extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      beers: [],
      offset: 0,  //Bestämmer vilken sida från vår api vi laddar in.
      error: null,
      id: this.props.route.params.beer_ID
    };
  }
  fetchBeer = () => {
    axios
      .get(`http://192.168.56.1/beer/${this.state.id}`) //Här behävs din egen adress till APIn
      .then(response => {
        console.log()
        this.setState({
          beers: this.state.beers.concat(response.data),
          
          
        });
        console.log()
      })
      .catch(error => {
        this.setState({error: error.message});
      });
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
        
          <Card pointerEvents="none">
          <Text style = {styles.textStyles}>{item.name}</Text>
          <Text style = {styles.textStyles}>{item.beer_type}</Text>
          <Image source={{uri: item.picture_url + '_100.png' }} style={styles.imageStyle} />
          <Text style = {styles.textStyles}>{item.container_type}</Text>
          <Text style = {styles.textStyles}>{item.volume + ' ml'}</Text>
          <Text style = {styles.textStyles}>{item.alcohol_percentage + '% vol'}</Text>
          {/* <Text style = {styles.textStyles}>{item.bitterness + ' Bitterhet'}</Text>
          <Text style = {styles.textStyles}>{item.fullness + ' Fyllighet'}</Text>
          <Text style = {styles.textStyles}>{item.sweetness + ' Sötma' }</Text>
          <Text style = {styles.textStyles}>{item.avg_rating + ' Betyg' }</Text> */}
          </Card>
          
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
        marginTop: 15,
      
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
      fontSize: 15,
      textAlign: 'center',
    },
})


  

  
export default individualBeer  