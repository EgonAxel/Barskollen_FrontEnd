

import React from 'react';
import { View, Text, FlatList, Image, StyleSheet, TouchableOpacity} from 'react-native';
import axios from 'axios';



class individualBeer extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      beers: [],
      offset: 0,  //Bestämmer vilken sida från vår api vi laddar in.
      error: null,
      beer_ID: this.props.route.params.beer_ID
    };
  }
  fetchBeer = () => {
    axios
      .get(`http://192.168.56.1:80/beer/${this.state.beer_ID}/`, {headers: { 'Authorization': `Token e81a635ac58256dd9ff9a9626542d05743b2c4d3`}}) //Här behävs din egen adress till APIn
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
    
    <View style = {styles.viewStyle}>
          {/* <Card pointerEvents="none"> */} 
          <Text style = {styles.productNameBold}>{item.name}</Text>
          <Text style = {styles.productNameThin}>{item.beer_type}</Text>
          <View style = {styles.imageWrap}>
          <Image source={{uri: item.picture_url + '_100.png' }} style={styles.beerImage} />
          <TouchableOpacity onPress={() => this.props.navigation.navigate('commentLayout', {beer_ID: item.beer_ID, beer_name:item.name, beer_pic: item.picture_url} )}>
           <Image source={require('../images/beerCap.png')} style={styles.capImage} /> 
          </TouchableOpacity>
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
          <Text style = {styles.rating}>{'Rating: ' + Number((item.avg_rating).toFixed(1)) + ' av 5'}</Text> 
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
       />

    );
  }
}

const styles = StyleSheet.create({

  viewStyle: {
    marginTop: 15,
    width: 400,
    height: 720,
    backgroundColor: '#effce8',
    borderRadius: 15,
    borderStyle: 'solid', 
    borderColor: '#e3e3e3',
    borderWidth: 3,
    marginBottom: 15,
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
      width: 200,
      height: 300,
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
    fontSize: 22,
    textAlign: 'right',
    fontWeight: '500',
    marginBottom: 10,
  },

  containerAndVolumeStyle: {
    fontSize: 20,
    textAlign: 'center',

  },

  tasteClockStyle : {
      fontSize: 20,
      fontWeight: 'bold',
      textAlign: 'center',
    },

  rating: {
    fontSize: 25,
    textAlign: 'center',
    marginBottom: 100,
  },
})

export default individualBeer  