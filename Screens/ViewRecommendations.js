import React from 'react';
import { View, Text, Image, FlatList, StyleSheet,TouchableOpacity,
         TextInput, Dimensions, Modal, Alert, Pressable, KeyboardAvoidingView } from 'react-native';
import Stars from 'react-native-stars';
import axios from 'axios';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import * as SecureStore from 'expo-secure-store';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

async function getValueFor(key) {
  let result = await SecureStore.getItemAsync(key);
  if (result) {
     return(result);
   } else {
     return(None);
   }
 }

class ViewRecommendations extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
        beer_ID: this.props.route.params.beer_ID,
        beer_pic: this.props.route.params.beer_pic,
        beer_name: this.props.route.params.beer_name,
        beer_type: this.props.route.params.beer_type,
        beer_bitterness: this.props.route.params.beer_bitterness,
        beer_fullness: this.props.route.params.beer_fullness,
        beer_sweetness: this.props.route.params.beer_sweetness,
        modalVisible: true,
        error: null,
        recommendations: [],
        rating: this.props.route.params.rating,
    };
  }
  reviewText = (text) => {
    this.setState({ review: text })
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
    this.getRecommendations(this.state.beer_ID, this.state.rating, this.state.beer_type, this.state.beer_bitterness, this.state.beer_fullness, this.state.beer_sweetness)
  }

  setModalVisible = (visible) => {
    this.setState({ modalVisible: visible });
  }

  _renderListItem(item) {
    return(
        <View style = {styles.modalStyleRecommendation}>
          <TouchableOpacity onPress={() => { this.props.navigation.replace('IndividualBeer', {beer_ID: item.beer_ID, beer_name:item.name, beer_pic: item.picture_url, beer_type: item.beer_type, beer_percentage: item.alcohol_percentage, beer_volume:item.volume, beer_container_type:item.container_type, beer_bitterness:item.bitterness, beer_sweetness: item.sweetness, beer_fullness:item.fullness, beer_avgrating:item.avg_rating})}}>
            <View style = {styles.beerInstance}>
              <Image style = {styles.beerImageRecommendation} source = {{uri: item.picture_url + '_100.png' }}/>
              <View style = {styles.beerInformation}>
                <Text style = {styles.productNameRecommendation}>{item.name}  </Text>
                <Text style = {styles.productTypeRecommendation}>{item.beer_type}</Text>
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
            <View style = {styles.ratingStars}>
            </View>
          </TouchableOpacity>
         </View>        
      )
  }

  render() {
    const { modalVisible } = this.state;
    return (
    <View>
      <View style={styles.wholePage}>  
        <KeyboardAvoidingView 
          behavior="position"
          style={{ flex: 1 }}
          >  
        <View style = {styles.viewStyle}>
          <Text style = {styles.productName}>
            {this.state.beer_name}
          </Text>
          <Image style={styles.beerImage} source={{uri: this.state.beer_pic + '_100.png' }}/> 
            <Text>Laddar rekommendationer...</Text>
          </View>
        </KeyboardAvoidingView>
      </View>
      <View>
        <Modal 
          visible={modalVisible}
          animationType="slide"
          useNativeDriver={true} 
          onRequestClose={() => {
            Alert.alert("Modal has been closed.");
            this.setModalVisible(!modalVisible);}}>
          <Text style = {styles.recommendationHeader}>Rekommendationer</Text>
          <Text style = {styles.recommendationText}>Här är några öl du kanske gillar baserat på ditt betyg.</Text>
          <FlatList
            style={{flex: 1}}
            contentContainerStyle={{
              backgroundColor: '#ffffff',
              alignItems: 'center',
              justifyContent: 'center',
              marginTop: 15,
            }}
            data={this.state.recommendations}
              keyExtractor={(beer, index) => String(index)}
              renderItem={({ item }) => this._renderListItem(item)}/>
          <TouchableOpacity onPress={() => this.props.navigation.navigate('IndividualBeer', {beer_ID: this.state.beer_ID, beer_name: this.state.name, beer_pic: this.state.picture_url, beer_type: this.state.beer_type, beer_percentage: this.state.alcohol_percentage, beer_volume: this.state.volume, beer_container_type: this.state.container_type, beer_bitterness: this.state.bitterness, beer_sweetness: this.state.sweetness, beer_fullness: this.state.fullness, beer_avgrating: this.state.avg_rating, hasReviewed: true})}>
            <View style={styles.button}>
              <Text style={styles.textStyle}>Stäng</Text>
            </View>
          </TouchableOpacity>
        </Modal>    
      </View>
    </View>
    );
  }
}
const usedBorderRadius = 15;
const styles = StyleSheet.create({
  
// ÖL SOM RATEAS
wholePage: {
  height: windowHeight,
  backgroundColor: '#ffffff',
},
viewStyle: {
  marginTop: 15,
  width: 350,
  minHeight: 500,
  maxHeight: 1000,
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
  alignSelf: 'center'
},
productName: {
  fontSize: 25,
  fontWeight: '700',
  marginTop: 25,
  textAlign: 'center',
  marginBottom: 15
},
textInputFields: {
  paddingLeft: 15,
  paddingRight: 15,
  paddingTop: 10,
  paddingBottom: 10,
  marginRight: 40,
  marginTop: 10,
  marginBottom: 5,
  marginLeft: 40,
  height: 75,
  width: windowWidth * 0.7,
  borderColor: '#009688',
  borderWidth: 2,
  borderRadius: 10,
  backgroundColor: 'white',
  alignSelf: 'center',
},
sendReview: {
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
beerImage: {
  width: 125,
  height: windowHeight * 0.3,
  marginVertical: 20,
  resizeMode: 'contain',
  alignSelf: 'center'
},
rating: {
  fontSize: 25,
  textAlign: 'center',
},

// ---------- REKOMMENDATIONER ------------  
  modalStyleRecommendation: {
    margin: 10,
    width: windowWidth * 0.93,
    backgroundColor: "white",
    borderRadius: 15,
    borderStyle: 'solid', 
    borderColor: '#dadada',
    borderWidth: 1,
    padding: 5,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  recommendationHeader: {
    fontSize: 25,
    fontWeight: '700',
    marginTop: windowHeight * 0.15,
    textAlign: 'center',
  },
  recommendationText: {
    fontSize: 14,
    marginTop: 20,
    fontWeight: '400',
    textAlign: 'center',
  },
  productNameRecommendation: {
    // fontFamily: 'Avenir',
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'left',
  },
  productTypeRecommendation: {
    // fontFamily: 'Avenir',
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
    justifyContent: 'flex-start',
  },
  attributeStyle: {
    fontSize: 20,
    textAlign: 'left',
  },
  alcohol_percentage: {
    // fontFamily: 'Avenir',
    fontSize: 14,
    textAlign: 'left',
  },
  beerImageRecommendation: {
    width: 100,
    height: 100,
    marginTop: 10,
    marginBottom: 10,
    marginLeft: 10,
    resizeMode: 'contain',
  },
  myStarStyle: {
    color: '#009688',
    backgroundColor: 'transparent',
    textShadowColor: '#dadada',
    textShadowOffset: {width: 1, height: 1},
    textShadowRadius: 5,
    fontSize: 35,
  },
  myEmptyStarStyle: {
    color: '#009688',
  },
  ratingStars: {
    alignItems: 'center',
  },
  button: {
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
  buttonOpen: {
    backgroundColor: "#009688",
  },
  buttonClose: {
    backgroundColor: "#009688",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center"
  },
  })
  
  export default ViewRecommendations